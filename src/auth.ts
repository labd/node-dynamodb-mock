export const parseAuthHeader = (header: string) => {
	const m = header.match(/Credential=([^,]+)/);
	if (!m) {
		throw new Error("Invalid auth header");
	}

	return {
		credentials: {
			accessKeyId: m[1].split("/")[0],
		},
	};
};
