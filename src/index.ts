import db, { type Store } from "dynalite/db";
import validations from "dynalite/validations";
import { HttpResponse, http, type RequestHandler } from "msw";
import type { SetupServer } from "msw/node";
import { type ActionType, actions } from "./actions.js";
import { parseAuthHeader } from "./auth.js";
import { actionValidations } from "./validations.js";

type Response = {
	statusCode: number;
	body: any;
};

// dynalite responds to these before the table reaches its settled state: the
// CREATING/UPDATING/DELETING -> ACTIVE/deleted transition happens in a
// setTimeout that is scheduled after the response callback has already fired.
// Requests are dispatched in-process here, so the next one can arrive before
// that timer runs, making a table created a statement earlier look like it
// doesn't exist yet. Wait for the transition before responding.
const tableActions = new Set<ActionType>([
	"CreateTable",
	"DeleteTable",
	"UpdateTable",
]);

const settleTable = async (store: Store, tableName: string) => {
	// Bounded so a table that never settles fails as a test timeout on the
	// caller's side rather than hanging here forever
	for (let i = 0; i < 1000; i++) {
		const status = await new Promise<string | undefined>((resolve) => {
			store.tableDb.get(tableName, (_err, table) =>
				resolve(table?.TableStatus),
			);
		});

		// Deleted tables resolve to undefined, which is settled as well
		if (
			status !== "CREATING" &&
			status !== "UPDATING" &&
			status !== "DELETING"
		) {
			return;
		}

		await new Promise((resolve) => setImmediate(resolve));
	}
};

const handler = async (
	request: Request,
	body: string,
	store: Store,
): Promise<Response> => {
	const target = (request.headers.get("x-amz-target") || "").split(".");
	const action = target[1] as ActionType;
	let data = JSON.parse(body);

	const actionValidation = actionValidations[action];
	try {
		data = validations.checkTypes(data, actionValidation.types);
		validations.checkValidations(
			data,
			actionValidation.types,
			actionValidation.custom,
			store,
		);
	} catch (err: any) {
		if (err.statusCode) {
			return {
				statusCode: err.statusCode,
				body: err.body,
			};
		}
		throw err;
	}

	const p = new Promise((resolve, reject) => {
		actions[action](store, data, (err: any, data: any) => {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});

	return await p
		.then(async (result) => {
			if (tableActions.has(action) && data.TableName) {
				await settleTable(store, data.TableName);
			}
			return {
				statusCode: 200,
				body: result,
			};
		})
		.catch((err) => {
			if (err.statusCode) {
				return {
					statusCode: err.statusCode,
					body: err.body,
				};
			}
			throw err;
		});
};

export type Options = {
	/** Endpoint the DynamoDB client is configured with */
	endpoint: string;
};

export class MockDynamoDB {
	private stores: Record<string, Store> = {};
	private options: Options;

	constructor(options: Options) {
		this.options = options;
	}

	private getStore(accessKeyId: string) {
		if (!this.stores[accessKeyId]) {
			this.stores[accessKeyId] = db.create({
				createTableMs: 0,
				deleteTableMs: 0,
				updateTableMs: 0,
			});
		}
		return this.stores[accessKeyId];
	}

	/**
	 * The msw request handlers for this mock. Pass these to setupServer() so
	 * they survive server.resetHandlers():
	 *
	 *   const server = setupServer(...mock.getHandlers());
	 */
	getHandlers(): RequestHandler[] {
		// DynamoDB sends every operation as a POST to the root path
		const url = new URL("/", this.options.endpoint).toString();

		return [
			http.post(url, async ({ request }) => {
				const auth = parseAuthHeader(
					request.headers.get("authorization") ?? "",
				);
				const store = this.getStore(auth.credentials.accessKeyId);
				const data = await handler(request, await request.text(), store);
				return HttpResponse.json(data.body, { status: data.statusCode });
			}),
		];
	}

	/**
	 * Register the handlers on an already running msw server. Note that these
	 * are removed again by server.resetHandlers(), prefer passing
	 * getHandlers() to setupServer() instead.
	 */
	registerHandlers(server: SetupServer) {
		server.use(...this.getHandlers());
	}

	reset() {
		for (const store of Object.values(this.stores)) {
			store.recreate();
		}
	}

	/**
	 * @deprecated This mock no longer runs its own msw server, since a second
	 * server breaks the one owned by your test suite. Register the handlers
	 * instead: setupServer(...mock.getHandlers())
	 */
	start(): never {
		throw new Error(
			"MockDynamoDB.start() is removed, pass the handlers to your own msw " +
				"server instead: setupServer(...mock.getHandlers())",
		);
	}

	/**
	 * @deprecated Close your own msw server instead, see start().
	 */
	stop(): never {
		throw new Error(
			"MockDynamoDB.stop() is removed, close your own msw server instead",
		);
	}
}

export const mockDynamoDB = (options: Options) => new MockDynamoDB(options);
