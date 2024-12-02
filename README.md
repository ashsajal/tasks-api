# Serverless CRUD API for Tasks Using AWS CDK

## Overview
This project defines a serverless CRUD API to manage tasks using AWS CDK. The API provides operations to:
- Create a task
- Get a task by ID
- Update a task
- Delete a task

The infrastructure is defined using AWS CDK and includes:
- Lambda functions to handle CRUD operations
- API Gateway to expose the REST API
- DynamoDB table for storing tasks

## Prerequisites
- AWS account with appropriate IAM permissions
- Node.js and npm installed
- AWS CLI installed and configured
- AWS CDK installed (`npm install -g aws-cdk`)

## Setup Instructions

1. Clone this repository:
    ```bash
    git clone https://github.com/ashsajal/tasks-api.git
    cd tasks-api
    ```

2. Install project dependencies:
    ```bash
    npm install
    ```

3. Bootstrap the AWS environment (if you haven't already):
    ```bash
    cdk bootstrap
    ```

## Deploy the Stack

1. Deploy the infrastructure using AWS CDK:
    ```bash
    cdk deploy
    ```

2. After deployment, the API Gateway endpoint URL will be shown. Use this endpoint to interact with the API.

## Test the API

You can test the API using tools like **curl**, **Postman**, or similar tools.

### Example using curl:

**Create Task** (POST):
```bash
curl -X POST https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/tasks \
-H "Content-Type: application/json" \
-d '{"title": "Task 1", "description": "This is task 1", "status": "pending"}'
