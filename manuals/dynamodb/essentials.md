# Essentials

## Table structure

- Unstructured data, simular to JSON
- 1 item max size 4Kb
- Supports **string**, **number**, **boolean, null, list and set** attribute types
- When you create new table, you must specify **partition key** attribute and its type
- You can also specify **sort key** attribute and its type.

### partition key

- Also know as `Hash key`
- Required attribute. Must be **string, number or boolean.** Can not be **null** or **empty string**.
- If the **sort key** is not specified for a table, the item's partition key must be unique across all table (if **sort key** if specified, then (partition key, sort key) pair must be unique ).

### sort key

- Also known as `Range key`
- Optional. Must be **string, number or boolean.** Can not be **null** or **empty string**.
- Must be unique inside the partition

## Operations

### AWS Documentation

- [Low-level client](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB_20111205.html)
- [Document client](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html)

- delete `deleteItem`
    - [Document client [delete]](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#delete-property)
    - delete single item by it's primary key
- put `putItem`
    - [Document client [put]](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property)
    - overrides item with the same primary key fields
- update `updateItem`
    - [Document client [update]](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#update-property)
    - update selected fields or remove it
    - require to provide the primary key of item
    - support atomic ADD operation against attribute
    - support atomic ADD, REMOVE item operation agains list or set attributes
    - can not update primary key fields
    - if there is not record to update, creates new
    - can not change type of fields, that are part of table primary key or some index key
- batchWrite `batchWriteItem`
    - can put or delete list (up to 25 items) of items
- batchGet `batchGetItem`
    - can query up to 25 items by primary keys
- query `query`
    - can make effective query by primary key or index key
    - support rich filtering by other attributes
- scan `scan`
    - can retrieve all elements of table
    - support rich filtering by attributes
    - supports parallel scans
- get `getItem`
    - retrieve one item by it's primary key

### Conditional update

put, update, batchWrite operations support `ConditionalExpression` that perform transactional check of conditions. If the item does not satisfy the condition, the DynamoDb will cancel the update operation and throw `ConditionException`