# Counter implementation

Imagine than you want to store the counter value under partition key `counters` and sort key `user_visits`

Then, using native client

```javascript
const AWS = require('aws');

const client = AWS.Dynamodb();
client.update(
	{
    TableName: 'table-name',
    Key: { partitionKey: 'counters', sortKey: 'users_visits'},
    UpdateExpression: 'ADD #counter :inc',
    ExpressionAttributeNames: {
        '#counter': 'counter',
    },
    ExpressionAttributeValues: {
        ':inc': 1
    }
}
)
```