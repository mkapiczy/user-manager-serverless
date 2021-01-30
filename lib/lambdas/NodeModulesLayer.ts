import { Construct } from '@aws-cdk/core';
import { Runtime } from '@aws-cdk/aws-lambda/lib/runtime';
import { Code, LayerVersion } from '@aws-cdk/aws-lambda';
import { resolve } from 'path';

export class NodeModulesLayer extends LayerVersion {
    public static readonly ID = 'LambdaNodeModulesLayer';
    constructor(scope: Construct) {
        super(scope, NodeModulesLayer.ID, {
            code: Code.fromAsset(resolve(__dirname, '../../node_modules_layer')),
            compatibleRuntimes: [Runtime.NODEJS_12_X],
            description: 'Node modules lambda layer',
        });
    }
}
