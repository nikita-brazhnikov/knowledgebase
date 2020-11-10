# Key concepts
[Key concepts in AWS official reference](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html)
* Each item must have __partition key__ field (and optional __sort key__ field). Their combination is calling **item key**
* If there is only partition key in the table, it must be unique. If there are partition key and sort key, the keys combination must be unique inside the table.
* INSERT / UPDATE operations are calling `putItem`.
  * You can not update item - only replace with new one with the same item key.
* You can GET one item by its **item key** with `getItem` operation
* You can list items with SCAN or QUERY requests (`scan` and `query`)
  * SCAN just retrieves all records and is **slow** request.
  * QUERY can select records by __partition key__ and __sort key__ with limited set of comparison operations. This request is **fast**.
  * One SCAN or QUERY request cat get at most 1 MB of data. To get all requested data, you have to repeat the request, providing the **LastEvaluatedKey**.
  * If the table's __partition key__ and __sort key__ are not suitable for your request, you can change this keys to others by creating the new **index**.

## QUERY

### Query against index
```javascript
const client = new AWS.DynamoDB.DocumentClient({
    region: getRegion(),
  });

const result = client.query({
    TableName: TABLE_NAME,
    IndexName: 'updated_month-updated_at-index', // index to query 
    KeyConditionExpression: 'updated_month = :v_month and updated_at >= :v_after', // required
    FilterExpression: 'is_active > :v_active AND reservation_incharge <> :v_incharge', // optional filter
    ScanIndexForward: false,
    ExpressionAttributeValues: { // values for placeholders in the KeyConditionExpression and the FilterExpression 
      ':v_after': updatedAfter,
      ':v_month': targetMonth,
      ':v_active': -1,
      ':v_incharge': '電子カルテ'
    }
});

const items = result.Items; // table items list
```

