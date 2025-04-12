FROM lambda-list-app:latest

# Add Lambda Web Adapter
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.0 /lambda-adapter /opt/extensions/lambda-adapter

# The original app listens on port 3000, we need to tell Lambda Web Adapter about it
ENV PORT=3000
