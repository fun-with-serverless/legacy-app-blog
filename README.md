# Legacy App Deployment Example

This repository demonstrates how to move legacy applications to the cloud using cloud-native tools, showcasing multiple deployment options for a Node.js Express application.

Related blog post (in Hebrew) - https://pashut.cloud/lift-and-shift-app-runner-part-1

## Repository Structure

- **legacy-app/** - Contains the Express application that lists AWS Lambda functions
  - `index.mjs` - Main application code
  - `Dockerfile` - Container definition for the application
  - `package.json` - Node.js dependencies and scripts

- **apprunner/** - Contains AWS App Runner deployment configuration
  - `app-runner-service.yaml` - CloudFormation template for deploying to App Runner
  - `create-role.yaml` - CloudFormation template for creating necessary IAM roles

- **lwa/** - Contains AWS Lambda Web Adapter configuration
  - `Dockerfile` - Extends the legacy app image and adds Lambda Web Adapter
  - `template.yaml` - SAM template for deploying as a Lambda function

## Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later)
- [Docker](https://www.docker.com/)
- [AWS CLI](https://aws.amazon.com/cli/) configured with appropriate credentials
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) (for Lambda deployment)
- AWS account with permissions to:
  - Create and push to ECR repositories
  - Deploy CloudFormation stacks
  - Create App Runner services and Lambda functions
  - List Lambda functions

## Running the Legacy App Locally

### Using Node.js directly

1. Navigate to the legacy app directory:
   ```
   cd legacy-app
   ```

2. Install dependencies:
   ```
   npm ci
   ```

3. Start the application:
   ```
   npm start
   ```

4. Access the application at http://localhost:3000/lambdas

### Using Docker

1. Build the Docker image:
   ```
   cd legacy-app
   npm run build
   ```

2. Run the Docker container:
   ```
   npm run docker:start
   ```

3. Access the application at http://localhost:3000/lambdas

## Deploying to AWS App Runner

The application includes scripts to deploy to AWS App Runner using the CloudFormation templates in the `apprunner/` directory.

1. First, create the ECR repository (if you haven't already):
   ```
   aws cloudformation deploy --template-file legacy-app/template.yaml --stack-name lambda-list-app-ecr
   ```

2. Deploy the application to AWS:
   ```
   cd legacy-app
   npm run aws:deploy
   ```

   This command performs the following actions:
   - Builds the Docker image (`npm run build`)
   - Authenticates with AWS ECR (`npm run aws:authenticate`)
   - Tags and pushes the image to ECR (`npm run aws:push`)

3. Deploy the App Runner service:
   ```
   aws cloudformation deploy --template-file apprunner/app-runner-service.yaml --stack-name lambda-list-app-apprunner --capabilities CAPABILITY_NAMED_IAM
   ```

After deployment, you can find the App Runner service URL in the AWS Console or by checking the CloudFormation stack outputs.

## Deploying as Lambda with AWS Lambda Web Adapter

The application can also be deployed as an AWS Lambda function using the AWS Lambda Web Adapter.

### How It Works

1. The Dockerfile in the `lwa` directory extends the existing `lambda-list-app` Docker image and adds the Lambda Web Adapter.
2. The SAM template (`template.yaml`) defines an AWS Lambda function that uses this Docker image and configures a Lambda URL for HTTP access.

### Building and Deploying

1. First, ensure the base Docker image is built:
   ```
   cd legacy-app
   npm run build
   ```

2. Then deploy the Lambda function using SAM:
   ```
   cd lwa
   sam build
   sam deploy --guided
   ```

   During the guided deployment, you can set a stack name and choose your region. SAM will package and deploy the function to AWS Lambda and create a Lambda URL.

### Testing

After deployment, SAM will output the Lambda Function URL. You can test the API endpoints using this URL:

- Health check: `<function-url>/health-check`
- List Lambda functions: `<function-url>/lambdas`

### Cleaning Up

To remove the deployed Lambda resources:
   ```
   sam delete
   ```

### Notes
- The Lambda function is configured with 512MB of memory and a 30-second timeout. You can adjust these values in the template.yaml file if needed.
- The AWS Lambda Web Adapter automatically handles the translation between HTTP requests and Lambda invocations.