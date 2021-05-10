## Common pattern

Query and Scan operations can retrieve a maximum of 1 MB of data, this limit applies before the filter expression is evaluated.
In that case, the result from database contains not null  `LastEvaluatedKey` attribute. If there is `LastEvaluatedKey` in the result, there are more items to be retrieved, so you should loop

```javascript
const items = [];
let lastEvaluatedKey = undefined;
do {
	const result = await dynamoDb.query({
		// other query attributes
		ExclusiveStartKey: lastEvaluatedKey,
	}).promise();
	items.push(...result.Items)
	lastEvaluatedKey = result.LastEvaluatedKey;
} while (lastEvaluatedKey);
```

`LastEvaluatedKey` is an object, containing primary keys of table and primary keys of index (if query against index).

## Parallel download

Serial querying of the big amount of records is slow.

### Use Promise.all

If you need several independent queries to get necessary data, try to do them in parallel

```javascript
const customersRequest = dynamoDb.query( { ... } ).promise();
const productsRequest = dynamoDb.query( {... } ).promise();
const results = await Promise.all(customers,products);

const customers = results[0].Items;
const products = reqults[1].Items;
```

### Use promise pool

If there is many short requests you want to perform in parallel, use promises pool

```javascript
const PromisePool = require('es6-promise-pool');

const promisePoolSize = 10; // smaller for fast queries, larger for slow

const userIds = [ ... ]; // user ids of users you want to download

const users = [];

const download = async (userId) => {
	const user = await dynamoDb.getItem({
		TableName: "..",
		Key: { id: userId },
  }
	).promise();
	users.push(user);
}

const pool = new PromisePool(() => {
  if (users.length > 0) {
    return download(userIds.pop());
  } else {
    return null;
  }
}, promisePoolSize);
await pool.start();
```

### Combine the upper approaches with batchGet

You also can improve the performance by using the `batchGet` operation. There is a limit of 25 items per call, and you have to provide full primary keys of items (you can not query in batch). You can use the lodash's `partition` function to split your array in chunks.

```javascript
const _ = require('lodash')

const batchTasks = _.partition(userIds, 25)
// batchTasks is an array of chunks like [ [1,2..25],[26...50]...]

const download = async (chunk) => {
	// using lsc-dynamodb-patterns 
	const usersBatch = await client.batchGet(chunk.map(userId => ({ pk: userId})))
	users.push(...usersBatch)
}
```

# Things to keep in mind

- Scan operations are slow.
- Filtering with only  `FilterExpression`  is slow.
- Doing long series of request is rather slow.
- Filtering with `KeyExpression` is fast.
- `batchGet` is fast.
- It's may be better to do 1 `query` request for 100 items and filter 10 from them, then doing 10 `getItem` requests.