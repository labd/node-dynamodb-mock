import BatchGetItem from "dynalite/actions/BatchGetItem";
import BatchWriteItem from "dynalite/actions/BatchWriteItem";
import CreateTable from "dynalite/actions/CreateTable";
import DeleteItem from "dynalite/actions/DeleteItem";
import DeleteTable from "dynalite/actions/DeleteTable";
import DescribeTable from "dynalite/actions/DescribeTable";
import DescribeTimeToLive from "dynalite/actions/DescribeTimeToLive";
import GetItem from "dynalite/actions/GetItem";
import ListTables from "dynalite/actions/ListTables";
import PutItem from "dynalite/actions/PutItem";
import Query from "dynalite/actions/Query";
import Scan from "dynalite/actions/Scan";
import TagResource from "dynalite/actions/TagResource";
import UntagResource from "dynalite/actions/UntagResource";
import ListTagsOfResource from "dynalite/actions/ListTagsOfResource";
import UpdateItem from "dynalite/actions/UpdateItem";
import UpdateTable from "dynalite/actions/UpdateTable";


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
