import BatchGetItem from "dynalite/actions/batchGetItem";
import BatchWriteItem from "dynalite/actions/batchWriteItem";
import CreateTable from "dynalite/actions/createTable";
import DeleteItem from "dynalite/actions/deleteItem";
import DeleteTable from "dynalite/actions/deleteTable";
import DescribeTable from "dynalite/actions/describeTable";
import DescribeTimeToLive from "dynalite/actions/describeTimeToLive";
import GetItem from "dynalite/actions/getItem";
import ListTables from "dynalite/actions/listTables";
import PutItem from "dynalite/actions/putItem";
import Query from "dynalite/actions/query";
import Scan from "dynalite/actions/scan";
import TagResource from "dynalite/actions/tagResource";
import UntagResource from "dynalite/actions/untagResource";
import ListTagsOfResource from "dynalite/actions/listTagsOfResource";
import UpdateItem from "dynalite/actions/updateItem";
import UpdateTable from "dynalite/actions/updateTable";

export type ActionType = keyof typeof actions;

export const actions = {
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
