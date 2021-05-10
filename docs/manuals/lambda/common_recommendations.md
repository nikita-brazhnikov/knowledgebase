# 1. Code complexity

* Function max length: 45 lines  
* `if` blocks max depth: 2

Solutions:

1. Extract parts of code into separate non-exported functions.
2. if you feel like this function is pretty generic and reuseable, move it into `*-helper.js` or `*-utils.js` file
3. After you split the your big function into bunch of small, you may want to move them into separate file.
4. If there are too many variables you want to use in the same time inside one function, convert this function into class.

## File naming

- Use hyphens
- If file name is too long, you may want to group the related files in new folder

```javascript
// good
aws-helper.js
platform-async-function.js
app-settings.js

//bad
survey-results-validator.js
survey-results-import-helper.js
survey-results-export-results.js

//　turn the layout in
survey-results/
	validator.js
	import-helper.js
	export-results.js

```

# 2. AWS credentials

Use credentials helper (download here)

Always specify credentials when creating new clients for the AWS resources.

```javascript
// bad
const lambdaClient = new AWS.Lambda(); 

const getEnvironmentCredentials = require('./aws-credentials-helper.js')
// ok
const lambdaClient = new AWS.Lambda(getEnvironmentCredentials())
```

Reason:  default credentials works fine, when the Lambda is running in the AWS environment, but  there could be problems in unit tests or local / Docker environments.