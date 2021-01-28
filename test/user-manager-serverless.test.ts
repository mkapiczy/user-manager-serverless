import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as UserManagerServerless from '../lib/user-manager-serverless-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new UserManagerServerless.UserManagerServerlessStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
