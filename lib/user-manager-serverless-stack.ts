import * as cdk from '@aws-cdk/core';
import {AuthorizationType, CfnAuthorizer, LambdaIntegration, RestApi} from "@aws-cdk/aws-apigateway";
import {CreateUserLambda} from "./lambdas/CreateUserLambda";
import {CognitoConstruct} from "./Cognito/CognitoConstruct";
import UsersDynamoDbTable from "./dynamodb/UsersDynamoDbTable";
import {IFunction} from '@aws-cdk/aws-lambda';

export class UserManagerServerlessStack extends cdk.Stack {
    private static readonly API_ID = 'UserManagerApi';

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const api = new RestApi(this, UserManagerServerlessStack.API_ID, {
            restApiName: 'User Manager API'
        })

        const cognitoConstruct = new CognitoConstruct(this)

        const authorizer = new CfnAuthorizer(this, 'cfnAuth', {
            restApiId: api.restApiId,
            name: 'UserManagerApiAuthorizer',
            type: 'COGNITO_USER_POOLS',
            identitySource: 'method.request.header.Authorization',
            providerArns: [cognitoConstruct.userPoolArn],
        })

        let usersDynamoDbTable = new UsersDynamoDbTable(this);
        const createUserLambda = new CreateUserLambda(this, 'CreateUserLambda', usersDynamoDbTable.tableName);
        usersDynamoDbTable.grantWriteData(createUserLambda);

        const usersResource = api.root.addResource('users');
        usersResource.addMethod('GET',
            new LambdaIntegration(createUserLambda), {
                authorizationType: AuthorizationType.COGNITO,
                authorizer: {
                    authorizerId: authorizer.ref
                },
                authorizationScopes: ['https://my-secure-api.example.com/admin']
            }
        )
    }
}
