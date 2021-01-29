import {CfnOutput, Construct} from '@aws-cdk/core';
import {OAuthScope, UserPool, UserPoolClient, UserPoolDomain} from "@aws-cdk/aws-cognito";

export class CognitoConstruct extends Construct {
    public static readonly USER_POOL_ID = 'UserManagerUserPool';
    public static readonly USER_POOL_CLIENT_ID = 'user-manager-client';
    public static readonly USER_POOL_DOMAIN_ID = 'user-manager-user-pool-domain';
    public readonly userPoolArn: string;

    constructor(scope: Construct) {
        super(scope, CognitoConstruct.USER_POOL_ID);
        const cognitoUserPool = new UserPool(this, CognitoConstruct.USER_POOL_ID, {})

        new UserPoolClient(this, CognitoConstruct.USER_POOL_CLIENT_ID, {
            userPool: cognitoUserPool,
            generateSecret: true,
            oAuth: {
                flows: {
                    clientCredentials: true
                },
                scopes: [OAuthScope.custom('https://my-secure-api.example.com/admin')]
            },
        })

        const userPoolDomain = new UserPoolDomain(this, CognitoConstruct.USER_POOL_DOMAIN_ID, {
            userPool: cognitoUserPool,
            cognitoDomain: {
                domainPrefix: 'user-manager-serverless'
            }
        })

        this.userPoolArn = cognitoUserPool.userPoolArn;

        new CfnOutput(this, 'UserPoolUrl', {
            exportName: `UserPoolUrl`,
            value: `https://${userPoolDomain.domainName}.auth.us-east-1.amazoncognito.com`
        });
    }
}
