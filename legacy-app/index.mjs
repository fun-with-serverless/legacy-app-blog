// app.js
import express from 'express';
import { LambdaClient, ListFunctionsCommand } from '@aws-sdk/client-lambda';


import pino from 'pino';



const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  timestamp: pino.stdTimeFunctions.isoTime
});

const app = express();
const port = process.env.PORT || 3000;

const lambdaClient = new LambdaClient({});

app.get('/lambdas', async (req, res) => {
  try {
    logger.info('Listing Lambda functions');
    const command = new ListFunctionsCommand({});
    const response = await lambdaClient.send(command);
    
    const functions = response.Functions.map(func => ({
      functionName: func.FunctionName,
      runtime: func.Runtime,
      memory: func.MemorySize,
      timeout: func.Timeout,
      lastModified: func.LastModified,
      description: func.Description || 'No description provided'
    }));

    res.json({
      count: functions.length,
      functions: functions
    });
  } catch (error) {
    logger.error({
      error: error,
      message: 'Failed to list Lambda functions'
    });
    res.status(500).json({
      error: 'Failed to list Lambda functions',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

app.listen(port, () => {
  
  logger.info({ port }, 'Server started');
});