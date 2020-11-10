# Lambda development hints

## How to upload Lambda to a dev environment faster

Update the Lambda's code directly, using AWS CLI. This will update only a deployment package and keep current environment variables and runtime settings untouched.

### For Typescript Lambda
[Example script Gist](https://gist.github.com/nikita-brazhnikov/e9a53be9748750a65d927ced69df9810#file-update_lambda_code_js-sh)

Make sure your Lambda satisfies the next requirements:
* there is `build` script in `package.json` that runs `tsc` or other command, that transpiles TS in JS
* the transpiled JS folder is `dist`
### For Javascript Lambda
[Example script Gist](https://gist.github.com/nikita-brazhnikov/e9a53be9748750a65d927ced69df9810#file-update_lambda_code_ts-sh)

### For Python Lambda

:black_square_button:  **TODO**

### How to use
1. Adjust your Lambda folder
```
my_lambda/ 
           lambda/ <--- here is you lambda root
           update_lambda_code.sh
```
2. Change default values of parameters

3. Run it like this
```
./update_lambda_code.sh <environment name> <AWS profile name>
```

