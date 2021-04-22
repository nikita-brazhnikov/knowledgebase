# Local machine API development (JS/TS Lambda only)

The mechanism is currenly implemented in 

* `aws_back/admin_api`
* `aws_back/survey_api/accessor`

## How to start
You can run this Lambda as simple web server on your local machine

1. Provide all necessary environment variables in `env.yaml` file (see `env.example.yaml` for reference)
   You can create this file automatically with values from any Lambda that has been already deployed in AWS.

```bash
$ cd aws_back/{lambda}/lambda/
$ npm run get-lambda-env [full name of Lambda to copy env vars from] [active AWS profile name]
```

For example:

```bash
$ cd aws_back/admin_api/lambda/
$ npm run get-lambda-env lsc-dev-tanaka-platform-dynamic-AdminFunction lsc-fukuoka-dev
```

2. Start development server on port 3000
   `The next command will start a API server on ` http://localhost:3000/
```
$ cd aws_back/{lambda}/lambda/
$ npm run run-dev-watch
```
You can specify path prefix and port
```
$ npm run run-dev-watch -- --rootPath /Prod/api --port 3001
```
HTTP requests to this endpoint will be converted into AWS Gateway -> Lambda calls and redirected to Lambda.
The server is configured to restart automatically if any JS file under src/ folder (or env.yaml file)
has been changed.

It is required that you have AWS profile in your `~/.aws/credentials `, named `lsc-dev`.
The locally started Lambda is using permissions, granted to this profile, to access AWS resources like databases etc.

## How to debug

The server runner is simple JS script `src/runLocalServer.js`, so you can run it with your favorite IDE.
Do not forget to specify the `package.json`'s directory as working directory and pass parameters to the `src/runLocalServer.js`

- `--rootPath`  default is `/` , the app controller's paths' prefix
- `--port` default is 3000



## How it works

The `run-dev-watch` script starts `src/runLocalServer.js` script. This script
copies parameters from `env.yaml` into `process.env`, creates Lambda instance from `src/createApp.js`
and use it as a controller for NodeJs http server.

We use self-written library __lsc-lambda-dev-support__ to convert HTTP requests into AWS API Gateway
event JSON and run simple Koa-powered web server*.

We also use `nodemon` to watch changes in source files and restart server after small delay after the changes have been made.

The `get-lambda-env` NPM script runs `src/createdEnvFile.js`. The code can explain itself.


*The library sources are here: `<root>/aws_back/library/lsc-lambda-dev-support`.

# Fast Lambda code update
Use it for fast test or fixes that should be applied immediately (for example,
front-end developers can test is quickly).

```
./update_lambda_code.sh [your environment name] [AWS profile name]

./update_lambda_code.sh lsc-dev-tanaka lsc-fukuoka-dev
```
You can not use it for initial deployment, the Lambda must be existed in
the specified environment. This script updates source code only.

