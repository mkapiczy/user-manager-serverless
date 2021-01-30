import {Construct} from '@aws-cdk/core';
import {ManagedPolicy, Role, ServicePrincipal} from '@aws-cdk/aws-iam';
import {Code, Function} from '@aws-cdk/aws-lambda';
import {defaultFunctionProps} from './DefaultFunctionProps';
import {resolve} from "path";

export class GetUserByIdLambda extends Function {
    public static readonly ID = 'GetUserByIdLambda';

    constructor(scope: Construct, usersTableName: string) {
        super(scope, GetUserByIdLambda.ID, {
            ...defaultFunctionProps,
            code: Code.fromAsset(resolve(__dirname, `../../lambdas`)),
            handler: 'handlers/GetUserByIdHandler.handler',
            role: new Role(scope, `${GetUserByIdLambda.ID}_role`, {
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
