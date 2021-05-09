# Essentials

📚 Demo project is located in [templates/unittest-js](https://github.com/nikita-brazhnikov/knowledgebase/tree/master/examples/unittest-js)

- Jest core
    - [https://jestjs.io/docs/getting-started](https://jestjs.io/docs/getting-started)
- Jest extended (useful matchers)
    - [https://github.com/jest-community/jest-extended](https://github.com/jest-community/jest-extended)

## Setup

```
npm i --save-dev jest jest-extended
```

- Create file `jest.config.json`
- Add run scripts in `package.json`

## Placement

## Running

```json
# Run all once
npm run test
# Run in watch mode
npm run test-watch
# Run only specified file(s)
npm run test -- --testPathPattern="test-file-name"
```

# Principles of writing testable code

## SRP (single-responsibility principle)

### Many small files > single large file

```
services/
	survey-results/
		index.js <-- entry points, all exported
		upsert.js <-- responsible for save/update functional
		db.js <-- very small functions without logic, accepts request parameters, do very simple staff
		search.js <-- implementation of search functional
		helpers.js <-- some self-encapsulated code you want to share
		import/
			index.js <-- entry point
			validators.js
			...
			
			
```

### One method for one purpose.

If you want single entry point for different functionality, extract execution flows into separate functions.

```javascript
function findResults(filter) {
	if (canUseIndex(filter)) {
		return findUsingIndex(filter)
	}
	return findResultsInternal(filter);
}
```

## Isolate uncontrollable paths

- Move to separate files all the calls to the AWS API (like DynamoDB, Lambda etc) and the LINE API
    - So you can mock them, using modules mocking feature of Jest
    - See `src/services/appointments/search.js` as an example
- Use "Strategy" pattern
    - Pass functions, that you wish to mock, as parameters in your functions or classes
    - See `src/services/appointments/export.js` (class `AppointmentsExporter`, method `setDatabaseGateway` ) as an example
- Disable side functional (like writing logs to the DB, security checks or something not related to the main purpose of the method you want to test) in unit tests

```javascript
if (process.env.NODE_ENV !== 'test') {
	// something you don't want to run in the current method's unit tests
} 
```

# Mocking

## Functions mocking

See [Mock Functions guide](https://jestjs.io/docs/mock-functions)

```javascript
const mockFunc = jest.fn(); // mockFunc accepts any parameter, returns undefined, record all calls 
mockFunc.mockReturnValue(value) // always returns value
mockFunc.mockResolvedValue(value) // always returns Promise.resolve(value) 
mockFunc.mockImplementation( (arg1, arg2 ) => { /* your implementation */ } ) 
```

## Modules mocking

See [Mocking Modules](https://jestjs.io/docs/mock-functions#mocking-modules)

All methods of imported module becomes mocked function

```javascript
mock('../src/service/db')
const db = require('../src/service/db')

// inside test
const service = require('../src/service/index') // function we want to test

db.query.mockResolvedValue([1,2,4]) // make query to return [1,2,4]

expect(service.loadSomeResults()).resolve.toEqual([1,2,4]) // loadSomeResults() uses db.query, but we mocked it
```

# Using real database

Sometimes you want to test your requests to the database, using real DynamoDb service. This is not unit, but kind of integration test.

1. Create the DynamoDb table by hands, name it that everyone have an idea about the table's owner
2. Make you private configuration file (like `env.json` ) and make it GIT-igored.
3. Write your table's name and AWS profile in this configuration file
4. From your test: load this file using `const config = require('../../env.json')`
5. Set environment variables from this file

```javascript
const config = require('../../env.json')
process.env.AWS_PROFILE = config.AWS_PROFILE
process.env.APPOINTMENTS_DATABASE = config.APPOINTMENTS_DATABASE
```

Clean your database and recreate it in hook

```javascript
// using lsc-dynamodb-patterns
beforeEach(async() => {
	const data = // generate the database
	await dbClient.deleteAll();
	await dbClient.batchPut(data)
})
```

You also can copy the some records from existing database (from dev or stg environment). Put them into single JSON file (as array)

```javascript
const data = require('../../dataset.json')
await dbClient.batchPut(data);
```