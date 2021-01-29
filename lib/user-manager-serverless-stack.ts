import * as cdk from '@aws-cdk/core';
import {CfnOutput} from '@aws-cdk/core';
import {AuthorizationType, CfnAuthorizer, LambdaIntegration, RestApi} from "@aws-cdk/aws-apigateway";
import {OAuthScope, UserPool, UserPoolClient, UserPoolDomain} from "@aws-cdk/aws-cognito";
import {CreateUserLambda} from "./lambdas/CreateUserLambda";

export class UserManagerServerlessStack extends cdk.Stack {
    private static readonly API_ID = 'UserManagerApi';

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const api = new RestApi(this, UserManagerServerlessStack.API_ID, {
            restApiName: 'User Manager API'
        })

        // const iamRole = this.createApiGatewayInvokeLambdasIamRole()


        const cognitoUserPool = new UserPool(this, 'userPool', {})
        new UserPoolClient(this, 'client', {
            userPool: cognitoUserPool,
            generateSecret: true,
            oAuth: {
                flows: {
                    clientCredentials: true
                },
                scopes: [OAuthScope.custom('https://my-secure-api.example.com/admin')]
            },
        })
        const userPoolDomain = new UserPoolDomain(this, 'id', {
            userPool: cognitoUserPool,
            cognitoDomain: {
                domainPrefix: 'user-manager-serverless'
            }
        })

        new CfnOutput(this, 'UserPoolUrl', {
            exportName: `UserPoolUrl`,
            value: `https://${userPoolDomain.domainName}.auth.us-east-1.amazoncognito.com`
        });

        const authorizer = new CfnAuthorizer(this, 'cfnAuth', {
            restApiId: api.restApiId,
            name: 'UserManagerApiAuthorizer',
            type: 'COGNITO_USER_POOLS',
            identitySource: 'method.request.header.Authorization',
            providerArns: [cognitoUserPool.userPoolArn],
        })

        const createUserLambda = new CreateUserLambda(this, 'CreateUserLambda');

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
