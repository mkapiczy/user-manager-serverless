import {Construct} from '@aws-cdk/core';
import {CreateUserLambda} from "./CreateUserLambda";
import {IFunction} from "@aws-cdk/aws-lambda";
import {Table} from "@aws-cdk/aws-dynamodb";
import {DeleteUserLambda} from "./DeleteUserLambda";
import {GetUserByIdLambda} from "./GetUserByIdLambda";
import {GetUsersLambda} from "./GetUsersLambda";
import {UpdateUserLambda} from "./UpdateUserLambda";
import {NodeModulesLayer} from "./NodeModulesLayer";

export class LambdaConstruct extends Construct {
    public static readonly ID = 'LambdaConstruct';

    public readonly createUserLambda: IFunction;
    public readonly deleteUserLambda: IFunction;
    public readonly getUserByIdLambda: IFunction;
    public readonly getUsersLambda: IFunction;
    public readonly updateUserLambda: IFunction;

    constructor(scope: Construct, usersDynamoDbTable: Table) {
        super(scope, LambdaConstruct.ID);
        const nodeModulesLayer = new NodeModulesLayer(this);

        this.createUserLambda = new CreateUserLambda(this, usersDynamoDbTable.tableName, nodeModulesLayer);
        usersDynamoDbTable.grantWriteData(this.createUserLambda);

        this.deleteUserLambda = new DeleteUserLambda(this, usersDynamoDbTable.tableName, nodeModulesLayer);
        usersDynamoDbTable.grantWriteData(this.deleteUserLambda);

        this.getUserByIdLambda = new GetUserByIdLambda(this, usersDynamoDbTable.tableName, nodeModulesLayer);
        usersDynamoDbTable.grantReadData(this.getUserByIdLambda);

        this.getUsersLambda = new GetUsersLambda(this, usersDynamoDbTable.tableName, nodeModulesLayer);
        usersDynamoDbTable.grantReadData(this.getUsersLambda);

        this.updateUserLambda = new UpdateUserLambda(this, usersDynamoDbTable.tableName, nodeModulesLayer);
        usersDynamoDbTable.grantReadWriteData(this.updateUserLambda);
    }
}
