output "deployment_instructions" {
  value = <<-EOT
  
  🚀 Deployment Successful!
  
  Your SAP ESS Portal has been deployed with:
  
  Frontend URL: https://${aws_cloudfront_distribution.frontend.domain_name}
  Backend API: http://${aws_lb.backend.dns_name}
  ECR Repository: ${aws_ecr_repository.backend.repository_url}
  
  Next steps:
  1. Build and push backend Docker image:
     docker build -t ${aws_ecr_repository.backend.repository_url}:latest ./backend
     aws ecr get-login-password | docker login --username AWS --password-stdin ${aws_ecr_repository.backend.repository_url}
     docker push ${aws_ecr_repository.backend.repository_url}:latest
  
  2. Deploy frontend:
     cd frontend && npm run build
     aws s3 sync dist/ s3://${aws_s3_bucket.frontend.bucket}
  
  3. Check deployment status:
     aws ecs describe-services --cluster ${aws_ecs_cluster.main.name} --services ${aws_ecs_service.backend.name}
  
  EOT
}