# Lambda Web Adapter for Legacy Express App

This folder contains the configuration needed to run the Express.js application located in the `../legacy-app` directory as an AWS Lambda function using [AWS Lambda Web Adapter](https://github.com/awslabs/aws-lambda-web-adapter).

## How It Works

1. The Dockerfile in this directory extends the existing `lambda-list-app` Docker image from the legacy application and adds the Lambda Web Adapter.
2. The SAM template (`template.yaml`) defines an AWS Lambda function that uses this Docker image and configures a Lambda URL for HTTP access.

## Prerequisites

- AWS CLI installed and configured
- AWS SAM CLI installed
- Docker installed and running

## Building and Deploying

1. First, ensure the base Docker image is built:

```bash
cd ../legacy-app
npm run build
```

2. Then deploy the Lambda function using SAM:

```bash
cd ../lwa
sam build
sam deploy --guided
```

During the guided deployment, you can set a stack name and choose your region. SAM will package and deploy the function to AWS Lambda and create a Lambda URL.

## Testing

After deployment, SAM will output the Lambda Function URL. You can test the API endpoints using this URL:

- Health check: `<function-url>/health-check`
- List Lambda functions: `<function-url>/lambdas`

## Cleaning Up

To remove the deployed resources:

```bash
sam delete
```

## Notes

- The Lambda function is configured with 512MB of memory and a 30-second timeout. You can adjust these values in the template.yaml file if needed.
- The AWS Lambda Web Adapter automatically handles the translation between HTTP requests and Lambda invocations.
