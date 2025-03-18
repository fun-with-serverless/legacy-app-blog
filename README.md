# Legacy App Deployment Example

This repository demonstrates how to move legacy applications to the cloud using cloud-native tools, specifically showcasing the deployment of a Node.js Express application to AWS App Runner.


Related blog post (in Hebrew) - https://pashut.cloud/lift-and-shift-app-runner-part-1

## Repository Structure

- **legacy-app/** - Contains the Express application that lists AWS Lambda functions
  - `index.mjs` - Main application code
  - `Dockerfile` - Container definition for the application
  - `package.json` - Node.js dependencies and scripts

- **apprunner/** - Contains AWS App Runner deployment configuration
  - `app-runner-service.yaml` - CloudFormation template for deploying to App Runner
  - `create-role.yaml` - CloudFormation template for creating necessary IAM roles

## Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later)
- [Docker](https://www.docker.com/)
- [AWS CLI](https://aws.amazon.com/cli/) configured with appropriate credentials
- AWS account with permissions to:
  - Create and push to ECR repositories
  - Deploy CloudFormation stacks
  - Create App Runner services
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