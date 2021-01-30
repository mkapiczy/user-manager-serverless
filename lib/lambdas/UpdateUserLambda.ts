import {Construct} from '@aws-cdk/core';
import {ManagedPolicy, Role, ServicePrincipal} from '@aws-cdk/aws-iam';
import {Code, Function} from '@aws-cdk/aws-lambda';
import {defaultFunctionProps} from './DefaultFunctionProps';
import {resolve} from "path";

export class UpdateUserLambda extends Function {
    public static readonly ID = 'UpdateUserLambda';

    constructor(scope: Construct, usersTableName: string) {
        super(scope, UpdateUserLambda.ID, {
            ...defaultFunctionProps,
            code: Code.fromAsset(resolve(__dirname, `../../lambdas`)),
            handler: 'handlers/UpdateUserHandler.handler',
            role: new Role(scope, `${UpdateUserLambda.ID}_role`, {
                assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
                managedPolicies: [
                    ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
                ]
            }),
            environment: {
                USERS_TABLE: usersTableName
            }
        });
    }
}
