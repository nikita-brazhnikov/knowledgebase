Full generator example here

There is special module under `aws_back/dummy-data-generators` where you can place and commit your own generators. Put them under `/src` into some personal folder (do not name is with your account name or other human name, due to OSS  they don't like it).

If you have written it in JS, cd to module root (folder, where package.json is) run it with

```bash
node src/<your folder>/<generator>.js
```

If in Typescript

```bash
npm run generator -- src/<your folder>/<generator>.ts
```

### Common pattern (JS)

```javascript

const generate = () => {
	const results = [];
	// ... make an array of records
	return results;
}
const upload = async () => {
	const results = generate();

	const client = new DDClient.Table(tableName, null, credentials);
	await client.batchPut(results);
}
upload().then(() => console.log('Finished')).catch((e) => console.log('ERROR', e));

```

### ❗Externalize configuration

Load table name and AWS profile name from git-ignored file (`env.yaml`)
If you want to share you generators, you should externalize your configuration. Put the `env.yaml` in the root of module

```yaml
AWS_PROFILE: lsc-dev
AWS_REGION: ap-northeast-1
TARGET_TABLE: lsc-dev-sometable
```

And read it in the top of generator script

```javascript
const yaml = require('yaml');
const fs = require('fs');
const AWS = require('aws-sdk');

const config = yaml.parse(fs.readFileSync('env.yaml', {encoding: 'utf-8'}));
const tableName = config['TARGET_TABLE'];
const credentials = {
  credentials: new AWS.SharedIniFileCredentials({profile: config['AWS_PROFILE']}),
  region: config['AWS_REGION']
}

```

### ‼️ Check generated results before upload

Before you start uploading you dummy data into the database, check your generated results with your eyes (and text editor)
To do this, generate small amount of results and write them into the file instead of the DB

```javascript
const fs = require('fs');

// ....

// await client.batchPut(results)
fs.writeFileSync('out.json', JSON.stringify(results,null,2))
```