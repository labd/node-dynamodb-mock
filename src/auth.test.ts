import { parseAuthHeader } from "./auth.js";
import { expect, test } from "vitest";

test("parseAuth", () => {
	const header =
		"AWS4-HMAC-SHA256 Credential=fake-x/20230809/local/dynamodb/aws4_request, SignedHeaders=amz-sdk-invocation-id;amz-sdk-request;content-length;content-type;host;x-amz-content-sha256;x-amz-date;x-amz-target;x-amz-user-agent, Signature=8e785c660821c3f5bdae27210e5b0ef4152ce3a98f57808adfcb3b569a39e644";
	const auth = parseAuthHeader(header);
	expect(auth).toEqual({
		credentials: {
			accessKeyId: "fake-x",
		},
	});
});
