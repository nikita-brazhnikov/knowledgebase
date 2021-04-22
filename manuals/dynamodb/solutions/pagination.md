# Approach 1 (only forward)

```jsx
/*
Would return 
{ items: [ ... ], lastEvaluatedKey: { ... } }
*/
const loadNext = async (lastEvaluatedKey, limit) => {
    // use lsc-dynamodb-patterns
    return client.queryPage({
        // other parameters
        lastEvaluatedKey,
        limit,
    })
}
```

# Approach 2 (using metadata)

Download all records metadata. For example, record's ID and `updatedAt` . Doing this will save you traffic.

```jsx
const items = [];
let lastEvaluatedKey = undefined;
do {
	const result = await dynamoDb.query({
		// other query attributes
		ProjectionExpression: ['partitionKey','updatedAt'],
		ExclusiveStartKey: lastEvaluatedKey,
	}).promise();
	items.push(...result.Items)
	lastEvaluatedKey = result.LastEvaluatedKey;
} while (lastEvaluatedKey);

return items;
```

Now you can sort and split in pages your metadata array. Then download and cache on the front-end only those items, you want to display right now.

```jsx
const keysToDownload = [ ...(partition keys)... ]
return client.batchGet(keysToDownload.map(pk => ({pk}))
```