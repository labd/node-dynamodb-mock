import BatchGetItem from "dynalite/validations/BatchGetItem";
import BatchWriteItem from "dynalite/validations/BatchWriteItem";
import CreateTable from "dynalite/validations/CreateTable";
import DeleteItem from "dynalite/validations/DeleteItem";
import DeleteTable from "dynalite/validations/DeleteTable";
import DescribeTable from "dynalite/validations/DescribeTable";
import DescribeTimeToLive from "dynalite/validations/DescribeTimeToLive";
import GetItem from "dynalite/validations/GetItem";
import ListTables from "dynalite/validations/ListTables";
import PutItem from "dynalite/validations/PutItem";
import Query from "dynalite/validations/Query";
import Scan from "dynalite/validations/Scan";
import TagResource from "dynalite/validations/TagResource";
import UntagResource from "dynalite/validations/UntagResource";
import ListTagsOfResource from "dynalite/validations/ListTagsOfResource";
import UpdateItem from "dynalite/validations/UpdateItem";
import UpdateTable from "dynalite/validations/UpdateTable";

import { ActionType, actions} from "./actions.js";


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
