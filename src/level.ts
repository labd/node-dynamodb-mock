export class Level {
	constructor() {
		throw new Error(
			"@labdigital/mock-dynamodb only supports in-memory storage, a persistent path is not supported",
		);
	}
}
