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


# TLDR
- **Data design for DynamoDb is not easy** 🤯
  Especially when big data is expected. If you are not full of confidence, ask somebody experienced for help and design review. You'll be able to fix the poor design later with indexes (and rise the operation costs ), but sometimes you'll not. Database migration on production is terrifying (esp. obtaining permission to do that).
- **Do not use table scan**  🐢
  It's really slow and costly. Exception: scanning over a sparse index
- **Do not use FilterExpression**  🐢
  It's really slow and costly. Use only in combination with KeyExpression on limited count of items.
- **Do not create many large indexes** 💸
  New index can become a rescue, but it slows down put operations and dramatically increases operation costs. Also limit number of attributes you include in your index.
- **Avoid calling the database inside loops** 🐢
  Unless you are confident that count of loops is very limited. Think about parallelization of database requests, try to batch them or cache results to improve performance.
- **Do not forget to support the 1 Mb limitation** 😱
  LastEvaluatedKey is your friend. Unless you are confident that the number of extracted items does not exceed 1 Mb. If you had to rely on FilterExpression, you can not be so confident.
- **4 Kb limitation for 1 record** 📚
  You can not store long text, base64 image, web page etc in single record. Use S3.
- **Forget about beautiful front-end grid with server-side pagination and sorting.** ❌
  It's key-value database. You can not select page by number freely or sort by any field. If you really want to, download all table data to the front-end and do all stuff there. Long, ugly, expensive.
- **You can not set `null` to the field that is a part of primary key or index key** 0️⃣
  It's convenient to nullify something you do not understand. But it would be safer to delete this field at all (with `REMOVE` operator) or set some null-like value (like 'none', or 0 ).
- ❗Just because you can, doesn't mean you should 💣

Difficult (or nearly impossible) tasks for DynamoDb.
( if you have got such task, think twice and ask for help )

- get total number of records in table
- perform complex queries with multiple ( > 2 ) parameters involved
- string fuzzy search ( SQL `LIKE` operator )
- delete many (> 1000) records quickly
- put a great amount (> 100000) records quickly
- put many ( > 10000 ) records with the same Partition key quickly
- perform BI tasks (collect analytics, merge, group, count, flexible sort, filtering)
- custom backups and restores

!> These tasks seems possible on a small amount of data, or is case when execution time does not matter, but keep in mind, that such operations are really ineffective and not scalable.

## About costs

RRU - read request unit. 1 eventually consistent read request (query, scan etc), that extracts up to 4 Kb of data, costs 0.5 RRU.

- Keep the index size smaller.
- Limit number of indexes.
- Prefer LSI to GSI where you can.
- When create new index, use ProjectionType parameter to limit the number of attributes in your index.

You have to pay for index's storage, for index fields updates and for index's items extraction.

When you query an index, if the index row's size is 1 Kb, you will spend 0.5 RRU to get 4 items. If the index row's size is 4 Kb, you will spend 0.5 RRU to get only 1 item.

When you updates some attribute in 1 table item, all indexes, that contains this attribute, would also be updated. It gets update operation slower and costly.

❗ using of ProjectionExpression parameter in query, scan does not lower your extraction costs (only reduces the data transfer timeout and the amount of memory )

If you want to estimate your request's cost, add the `ReturnConsumedCapacity: 'TOTAL'` option in the DB request parameter's map. Then, pick the number of RRU from the response

```javascript
const costs = result.ConsumedCapacity //may be single record or array (if batch request)
// if single
const rru = costs.CapacityUnits
// if array
const rru = costs.reduce((sum, c) => sum + (c.CapacityUnits || 0), 0)
```

## It's important to understand

Maximum amount of data you can extract in 1 Db request (query, scan, getItem etc) is 1 Mb. But in doesn't mean that the result Items array's size would be 1 Mb.

The extracted data is the database rows, extracted from storage before applying FilterExpression. It means, for example, if you table has 10000 rows 1 Kb each, and after applying FilterExpression you get 1 row, you still have to extract 10000 rows (and spend (10000 Kb / 4 Kb)*0.5 = 1750 RRU ).

The situation is different when you are using KeyExpression. If your table has 10000 rows 1 Kb each and your KeyExpression matches 1 row, you have to do only 1 request and extract only 1 row to find it (and spend 0.5 RRU) for it.

There is Limit parameter you can pass into query and scan operations to limit the amount of extracted items. You can not specify the exact amount of items you want to receive as a result, when you are using FilterExpression (with or without KeyExpression). If you have a large table and  try to filter something with Limit: 1000, you will spend 500 RRU and might get 0 results, because matching data may be located in the rest of the table.

If you want to download a lot of data from Db into Lambda, you are limited in time: 1) HTTP request timeout ( < 30 sec ) 2) Lambda work timeout (max 15 min).

- try do query the data in parallel
- limit the amount of data you have to extract, using partition key [and sort key] ( `KeyExpression` )
- limit the amount of data you have to download, using other attributes ( `FilterExpression` )
- create GSI, that
    - let you to split data in chunks, that you can download in parallel
    - let you filter the data with `KeyExpression`