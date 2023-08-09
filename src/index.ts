import db, { type Store } from "dynalite/db";
import validations from "dynalite/validations";
import nock, { ReplyFnContext } from "nock";
import { ActionType, actions } from "./actions.js";
import { actionValidations } from "./validations.js";
import { parseAuthHeader } from "./auth.js";

type Response = {
	statusCode: number;
	body: any;
};

const handler = async (
	req: ReplyFnContext["req"],
	body: string,
	store: Store
): Promise<Response> => {
	const target = (req.headers["x-amz-target"] || "").split(".");
	const action = target[1] as ActionType;
	let data = JSON.parse(body as string);

	const actionValidation = actionValidations[action];
	try {
		data = validations.checkTypes(data, actionValidation.types);
		validations.checkValidations(
			data,
			actionValidation.types,
			actionValidation.custom,
			store
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
		actions[action](store, data, function (err: any, data: any) {
			if (err) {
				reject(err);
			}
			resolve(data);
		});
	});

	return await p
		.then((data) => ({
			statusCode: 200,
			body: data,
		}))
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

type Options = {
	endpoint: string;
};

class MockDynamoDB {
	private stores: Record<string, Store> = {};
	private options: Options;
	private isStarted = false;

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

	start() {
		const self = this;
		if (this.isStarted) {
			return;
		}
		this.isStarted = true;
		nock(this.options.endpoint)
			.persist()
			.post("/")
			.reply(async function (uri, body) {
				const auth = parseAuthHeader(this.req.headers.authorization);
				const store = self.getStore(auth.credentials.accessKeyId);
				const data = await handler(this.req, body as string, store);
				return [data.statusCode, data.body];
			});
	}

	reset() {
		for (const store of Object.values(this.stores)) {
			store.recreate();
		}
	}

	stop() {
		nock.cleanAll();
		this.isStarted = false;
	}
}

export const mockDynamoDB = (options: Options) => {
	const m = new MockDynamoDB(options);
	m.start();
	return m;
};
