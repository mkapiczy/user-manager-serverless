import {Construct} from '@aws-cdk/core';
import {AuthorizationType, CfnAuthorizer, LambdaIntegration, RestApi} from "@aws-cdk/aws-apigateway";
import {LambdaConstruct} from "../lambdas/LambdaConstruct";
import {CognitoConstruct} from "../cognito/CognitoConstruct";

export class ApiGatewayConstruct extends Construct {
    public static readonly ID = 'UserManagerApiGateway';

    constructor(scope: Construct, cognitoUserPoolArn: string, lambdas: LambdaConstruct) {
        super(scope, ApiGatewayConstruct.ID);
        const api = new RestApi(this, ApiGatewayConstruct.ID, {
            restApiName: 'User Manager API'
        })

        const authorizer = new CfnAuthorizer(this, 'cfnAuth', {
            restApiId: api.restApiId,
            name: 'UserManagerApiAuthorizer',
            type: 'COGNITO_USER_POOLS',
            identitySource: 'method.request.header.Authorization',
            providerArns: [cognitoUserPoolArn],
        })

        const authorizationParams = {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: {
                authorizerId: authorizer.ref
            },
            authorizationScopes: [`${CognitoConstruct.USER_POOL_RESOURCE_SERVER_ID}/user-manager-client`]
        };


        const usersResource = api.root.addResource('users');
        usersResource.addMethod('POST', new LambdaIntegration(lambdas.createUserLambda), authorizationParams);
        usersResource.addMethod('GET', new LambdaIntegration(lambdas.getUsersLambda), authorizationParams);
        const userResource = usersResource.addResource('{userId}');
        userResource.addMethod('GET', new LambdaIntegration(lambdas.getUserByIdLambda), authorizationParams);
        userResource.addMethod('POST', new LambdaIntegration(lambdas.updateUserLambda), authorizationParams);
        userResource.addMethod('DELETE', new LambdaIntegration(lambdas.deleteUserLambda), authorizationParams);
    }
}
