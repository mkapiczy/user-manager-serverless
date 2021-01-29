import {Aws, Construct, RemovalPolicy} from '@aws-cdk/core';
import {Attribute, AttributeType, Table} from '@aws-cdk/aws-dynamodb';

export class UsersDynamoDbTable extends Table {

    public static readonly TABLE_ID = 'Users';
    public static readonly PARTITION_KEY = 'id';

    constructor(scope: Construct) {
        super(scope, UsersDynamoDbTable.TABLE_ID, {
            tableName: `${Aws.STACK_NAME}-Users`,
            partitionKey: {
                name: UsersDynamoDbTable.PARTITION_KEY,
                type: AttributeType.STRING
            } as Attribute,
            removalPolicy: RemovalPolicy.DESTROY,
        });
    }

}

export default UsersDynamoDbTable;
