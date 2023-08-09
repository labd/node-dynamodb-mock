
declare module "dynalite/db" {
  export type Store = {
		recreate(): void
	}
  export default {
    create(options: any):  Store
  }
}

declare module "dynalite/validations" {
  namespace defaults {
    function checkTypes(data: any, types: any): any
    function checkValidations(data: any, types: any, custom: any, store: Store): any
  }
  export default defaults
}

declare module "dynalite/actions/batchGetItem" {
  export default function BatchGetItem(
    store: any,
    data: any,
    cb: any
  ): Promise<any>;
}

declare module "dynalite/actions/batchWriteItem" {
  export default function BatchWriteItem(
    store: any,
    data: any,
    cb: any
  ): Promise<any>;
}

declare module "dynalite/actions/createTable" {
  export default function CreateTable(
    store: any,
    data: any,
    cb: any
  ): Promise<any>;
}

declare module "dynalite/actions/deleteItem" {
  export default function DeleteItem(
    store: any,
    data: any,
    cb: any
  ): Promise<any>;
}

declare module "dynalite/actions/deleteTable" {
  export default function DeleteTable(
    store: any,
    data: any,
    cb: any
  ): Promise<any>;
}

declare module "dynalite/actions/describeTable" {
  export default function DescribeTable(
    store: any,
    data: any,
    cb: any
  ): Promise<any>;
}

declare module "dynalite/actions/describeTimeToLive" {
  export default function DescribeTimeToLive(
    store: any,
    data: any,
    cb: any
  ): Promise<any>;
}

declare module "dynalite/actions/getItem" {
  export default function GetItem(
    store: any,
    data: any,
    cb: any
  ): Promise<any>;
}

declare module "dynalite/actions/listTables" {
  export default function ListTables(
    store: any,
    data: any,
    cb: any
  ): Promise<any>;
}

declare module "dynalite/actions/putItem" {
  export default function PutItem(
    store: any,
    data: any,
    cb: any
  ): Promise<any>;
}

declare module "dynalite/actions/query" {
  export default function Query(store: any, data: any, cb: any): Promise<any>;
}

declare module "dynalite/actions/scan" {
  export default function Scan(store: any, data: any, cb: any): Promise<any>;
}

declare module "dynalite/actions/tagResource" {
  export default function TagResource(
    store: any,
    data: any,
    cb: any
  ): Promise<any>;
}

declare module "dynalite/actions/untagResource" {
  export default function UntagResource(
    store: any,
    data: any,
    cb: any
  ): Promise<any>;
}

declare module "dynalite/actions/listTagsOfResource" {
  export default function ListTagsOfResource(
    store: any,
    data: any,
    cb: any
  ): Promise<any>;
}

declare module "dynalite/actions/updateItem" {
  export default function UpdateItem(
    store: any,
    data: any,
    cb: any
  ): Promise<any>;
}

declare module "dynalite/actions/updateTable" {
  export default function UpdateTable(
    store: any,
    data: any,
    cb: any
  ): Promise<any>;
}

declare module "dynalite/validations/batchGetItem" {
  export default {
    types: any,
    custom: any,
  };
}

declare module "dynalite/validations/batchWriteItem" {
  export default {
    types: any,
    custom: any,
  };
}

declare module "dynalite/validations/createTable" {
  export default {
    types: any,
    custom: any,
  };
}

declare module "dynalite/validations/deleteItem" {
  export default {
    types: any,
    custom: any,
  };
}

declare module "dynalite/validations/deleteTable" {
  export default {
    types: any,
    custom: any,
  };
}

declare module "dynalite/validations/describeTable" {
  export default {
    types: any,
    custom: any,
  };
}

declare module "dynalite/validations/describeTimeToLive" {
  export default {
    types: any,
    custom: any,
  };
}

declare module "dynalite/validations/getItem" {
  export default {
    types: any,
    custom: any,
  };
}

declare module "dynalite/validations/listTables" {
  export default {
    types: any,
    custom: any,
  };
}

declare module "dynalite/validations/putItem" {
  export default {
    types: any,
    custom: any,
  };
}

declare module "dynalite/validations/query" {
  export default {
    types: any,
    custom: any,
  };
}

declare module "dynalite/validations/scan" {
  export default {
    types: any,
    custom: any,
  };
}

declare module "dynalite/validations/tagResource" {
  export default {
    types: any,
    custom: any,
  };
}

declare module "dynalite/validations/untagResource" {
  export default {
    types: any,
    custom: any,
  };
}

declare module "dynalite/validations/listTagsOfResource" {
  export default {
    types: any,
    custom: any,
  };
}

declare module "dynalite/validations/updateItem" {
  export default {
    types: any,
    custom: any,
  };
}

declare module "dynalite/validations/updateTable" {
  export default {
    types: any,
    custom: any,
  };
}
