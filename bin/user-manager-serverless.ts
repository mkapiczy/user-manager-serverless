#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { UserManagerServerlessStack } from '../lib/user-manager-serverless-stack';

const app = new cdk.App();
new UserManagerServerlessStack(app, 'UserManagerServerlessStack');
