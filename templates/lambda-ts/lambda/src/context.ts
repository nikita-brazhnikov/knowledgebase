/*
 * Copyright 2020 LINE Fukuoka Corporation
 *
 * LINE Corporation licenses this file to you under the Apache License,
 * version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at:
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 */

import * as AWS from 'aws-sdk';

export const keys = {
  DEPLOY_ENV: 'DEPLOY_ENV',
  DATABASE_TABLE: 'DATABASE_TABLE',
};

export const config = {};

const printIt = (arg) => {
  if (typeof arg === 'object') {
    if (arg.toString === Object.prototype.toString) {
      try {
        return JSON.stringify(arg, null, 2);
      } catch (e) {
        return arg;
      }
    } else {
      return arg;
    }
  }
  return arg;
};

export const infoLog = (...args: any) => {
  console.log(...(args.map(printIt)))
}

export const debugLog = (...args: any) => {
  if (isDevEnvironment()) {
    console.log(...(args.map(printIt)));
  }
}

const merge = (map: {[key: string]: any}) => {
  Object.assign(config, map);
}

export const setUpConfiguration = (map: {[key: string]: any} = {}) => {
  merge({
    [keys.DEPLOY_ENV]: map[keys.DEPLOY_ENV] || 'local',
    [keys.DATABASE_TABLE]: map[keys.DATABASE_TABLE] ,
  });
}

export const isDevEnvironment = () => {
  const env = config[keys.DEPLOY_ENV];
  return env === 'local' || env.match(/(-dev$)|(-dev-)/g)
}

const isAwsEnvironment = () => {
  // check whether it is SAM local-api Docker env
  if (process.env.AWS_SAM_LOCAL === 'true') {
    return false;
  }
  return !!process.env.AWS_LAMBDA_LOG_STREAM_NAME;
};


export const getEnvironmentCredentials = (profileName = 'xxxxx-dev') => {
  if (isAwsEnvironment()) {
    return undefined;
  }
  if (profileName) {
    return {
      credentials: new AWS.SharedIniFileCredentials({
        profile: profileName
      }),
      region: 'ap-northeast-1',
    };
  }
  return new AWS.Credentials({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  });
};

