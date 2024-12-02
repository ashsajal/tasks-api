import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class TasksApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table
    const tasksTable = new dynamodb.Table(this, 'TasksTable', {
      partitionKey: { name: 'taskId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    // Common Lambda Properties
    const lambdaProps: lambda.FunctionProps = {
      runtime: lambda.Runtime.NODEJS_18_X,
      environment: {
        TABLE_NAME: tasksTable.tableName,
      },
    };

    // Create Task Lambda
    const createTaskLambda = new lambda.Function(this, 'CreateTaskFunction', {
      ...lambdaProps,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/create-task'),
    });

    // Get Task Lambda
    const getTaskLambda = new lambda.Function(this, 'GetTaskFunction', {
      ...lambdaProps,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/get-task'),
    });

    // Update Task Lambda
    const updateTaskLambda = new lambda.Function(this, 'UpdateTaskFunction', {
      ...lambdaProps,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/update-task'),
    });

    // Delete Task Lambda
    const deleteTaskLambda = new lambda.Function(this, 'DeleteTaskFunction', {
      ...lambdaProps,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/delete-task'),
    });

    // Grant DynamoDB Access
    tasksTable.grantReadWriteData(createTaskLambda);
    tasksTable.grantReadData(getTaskLambda);
    tasksTable.grantWriteData(updateTaskLambda);
    tasksTable.grantWriteData(deleteTaskLambda);

    // API Gateway
    const api = new apigateway.RestApi(this, 'TasksApi');

    // /tasks resource
    const tasks = api.root.addResource('tasks');
    tasks.addMethod('POST', new apigateway.LambdaIntegration(createTaskLambda));

    // /tasks/{taskId} resource
    const task = tasks.addResource('{taskId}');
    task.addMethod('GET', new apigateway.LambdaIntegration(getTaskLambda));
    task.addMethod('PUT', new apigateway.LambdaIntegration(updateTaskLambda));
    task.addMethod('DELETE', new apigateway.LambdaIntegration(deleteTaskLambda));
  }
}
