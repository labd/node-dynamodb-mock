import BatchGetItem from "dynalite/validations/batchGetItem";
import BatchWriteItem from "dynalite/validations/batchWriteItem";
import CreateTable from "dynalite/validations/createTable";
import DeleteItem from "dynalite/validations/deleteItem";
import DeleteTable from "dynalite/validations/deleteTable";
import DescribeTable from "dynalite/validations/describeTable";
import DescribeTimeToLive from "dynalite/validations/describeTimeToLive";
import GetItem from "dynalite/validations/getItem";
import ListTables from "dynalite/validations/listTables";
import PutItem from "dynalite/validations/putItem";
import Query from "dynalite/validations/query";
import Scan from "dynalite/validations/scan";
import TagResource from "dynalite/validations/tagResource";
import UntagResource from "dynalite/validations/untagResource";
import ListTagsOfResource from "dynalite/validations/listTagsOfResource";
import UpdateItem from "dynalite/validations/updateItem";
import UpdateTable from "dynalite/validations/updateTable";

import { ActionType, actions } from "./actions.js";

export const actionValidations: Record<ActionType, any> = {
	BatchGetItem,
	BatchWriteItem,
	CreateTable,
	DeleteItem,
	DeleteTable,
	DescribeTable,
	DescribeTimeToLive,
	GetItem,
	ListTables,
	PutItem,
	Query,
	Scan,
	TagResource,
	UntagResource,
	ListTagsOfResource,
	UpdateItem,
	UpdateTable,
};
