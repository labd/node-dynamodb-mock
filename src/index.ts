import express from "express";
import nock from "nock";

// @ts-ignore
import db from "dynalite/db";

// @ts-ignore
import validations from "dynalite/validations";

// @ts-ignore
import supertest from "supertest";

export class MockDynamoDB {
  validOperations = [
    "BatchGetItem",
    "BatchWriteItem",
    "CreateTable",
    "DeleteItem",
    "DeleteTable",
    "DescribeTable",
    "DescribeTimeToLive",
    "GetItem",
    "ListTables",
    "PutItem",
    "Query",
    "Scan",
    "TagResource",
    "UntagResource",
    "ListTagsOfResource",
    "UpdateItem",
    "UpdateTable",
  ];
  actions: Record<string, any> = {};
  actionValidations: Record<string, any> = {};

  constructor() {}

  async load() {
    for (let action of this.validOperations) {
      action = validations.toLowerFirst(action);
      this.actions[action] = await import("dynalite/actions/" + action).then(
        (m) => m.default
      );
      this.actionValidations[action] = await import(
        "dynalite/validations/" + action
      ).then((m) => m.default);
    }
  }

  async start() {
    await this.load();
    const app = express();
    const store = db.create({});

    const self = this;
    const api = nock("http://localhost:4000")
      .persist()
      .post("/")
      .reply(async function (uri, body) {
        const target = (this.req.headers["x-amz-target"] || "").split(".");
        const action = validations.toLowerFirst(target[1]);

        let data = JSON.parse(body as string);

        var actionValidation = self.actionValidations[action];
        try {
          data = validations.checkTypes(data, actionValidation.types);
          validations.checkValidations(
            data,
            actionValidation.types,
            actionValidation.custom,
            store
          );
        } catch (err) {
          return [err.statusCode, err.body];
        }

        let resData = {};
        let resStatus = 200;
        const p = new Promise((resolve, reject) => {
          self.actions[action](store, data, function (err: any, data: any) {
            if (err) {
              reject(err);
            }
            resolve(data);
          });
        });

        return await p
          .then((data) => {
            return [200, data];
          })
          .catch((err) => {
            return [err.statusCode, err.body];
          });
      });
  }
}
