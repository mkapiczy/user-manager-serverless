import {Construct} from '@aws-cdk/core';
import {ManagedPolicy, Role, ServicePrincipal} from '@aws-cdk/aws-iam';
import {Code, Function, LayerVersion} from '@aws-cdk/aws-lambda';
import {defaultFunctionProps} from './DefaultFunctionProps';
import {resolve} from "path";

export class CreateUserLambda extends Function {

    constructor(scope: Construct, id: string) {
        super(scope, id, {
            ...defaultFunctionProps,
            code: Code.fromAsset(resolve(__dirname, `../../lambdas`)),
            handler: 'handlers/CreateUserHandler.handler',
            role: new Role(scope, `${id}_role`, {
                assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
                managedPolicies: [
                    ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
                ]
            })
        });
    }
}
