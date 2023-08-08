import express from "express";
import nock, { ReplyFnContext } from "nock";

import { ClientRequest } from "http";
// @ts-ignore
import db from "dynalite/db";

// @ts-ignore
import validations from "dynalite/validations";

// @ts-ignore
import supertest from "supertest";

import { ActionType, actions } from "./actions.js";
import { actionValidations } from "./validations.js";

type Response = {
  statusCode: number;
  body: any;
};

const handler = async (
  req: ReplyFnContext["req"],
  body: string,
  store: any
): Promise<Response> => {
  const target = (req.headers["x-amz-target"] || "").split(".");
  const action = target[1] as ActionType;
  let data = JSON.parse(body as string);

  var actionValidation = actionValidations[action];
  try {
    data = validations.checkTypes(data, actionValidation.types);
    validations.checkValidations(
      data,
      actionValidation.types,
      actionValidation.custom,
      store
    );
  } catch (err: any) {
    return {
      statusCode: err.statusCode,
      body: err.body,
    };
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
    .then((data) => {
      return {
        statusCode: 200,
        body: data,
      };
    })
    .catch((err) => {
      return {
        statusCode: err.statusCode,
        body: err.body,
      };
    });
};

type Options = {
  endpoint: string;
};

export const mockDynamoDB = (options: Options) => {
  const store = db.create({});
  const api = nock(options.endpoint)
    .persist()
    .post("/")
    .reply(async function (uri, body) {
      const data = await handler(this.req, body as string, store);
      return [data.statusCode, data.body];
    });
};
