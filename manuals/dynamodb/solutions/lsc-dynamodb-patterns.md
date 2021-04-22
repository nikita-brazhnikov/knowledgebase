Uses AWS.DynamoDb.DocumentClient internally, so you should not use DynamoDb JSON to describe arguments and there is no need to unmarshall the query results into JSON.

# Install

```jsx
npm i --save lsc-dynamodb-patterns
```

# Usage

```jsx
// JS
const { DDClient } = require('lsc-dynamodb-patterns')
// TS
import { DDClient } from 'lsc-dynamodb-patterns';

const client = new DDClient.Table('tableName', null, awsCredentials);

const results = await client.query({
// request
}); // get records array
```

# Methods

## Put item

`putItem(item: any, key?: Key) ⇒ void`

Calls  `DocumentClient.putItem` internally.

## Query items

`queryItems(query: Query) => any[]`

```jsx
const params = {
	query: '#partitionKey = :pk and begins_with(sortKey, :sk)'
	mapping: {
		'#partitionKey': 'surveyId',
		':pk': 'xxx-0000-yyyy',
		':sk': '4j2o720#',
		'#value': 'value',
		':marker': 'XXX'
	},
	index: 'surveyId-sortKey-index',
	filter: 'contains(#value, :marker)',
	attributes: ['userId', 'updatedAt'],	
}
const results = await client.queryItems(params);
console.log(results[0])
/* 
{ userId: "U4734YRJE", updatedAt: 4724724 }
*/
```

- `query` = KeyExpression, required
- `mapping` merged ExpressionAttributeNames map and ExpressionAttributeValues map. Values placeholders should start from colon, attribute names placeholders - from hash.
- `filter` = FilterExpression
- `index` = IndexName
- `attributes` string array. Maps to ProjectedAttributes parameter.
- `reverseSearch` boolean (default: false). If true, `ScanIndexForward` parameter is `false`