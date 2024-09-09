provider "aws" {
  region = "us-west-2"  # Specify the AWS region where the resources will be created
}

# Define a security group for EC2 instance (allows SSH and HTTP)
resource "aws_security_group" "nodejs_sg" {
  name        = "nodejs_security_group"
  description = "Allow HTTP and SSH traffic"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Allow SSH access from anywhere (use cautiously)
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Allow HTTP traffic from anywhere
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Define an EC2 instance for Node.js application
resource "aws_instance" "nodejs_instance" {
  ami           = "ami-0c55b159cbfafe1f0"  # Amazon Linux 2 AMI (You may change this based on region)
  instance_type = "t2.micro"
  security_groups = [aws_security_group.nodejs_sg.name]

  # User data to install Node.js, git, and start the application
  user_data = <<-EOF
              #!/bin/bash
              sudo yum update -y
              sudo yum install -y git
              curl -sL https://rpm.nodesource.com/setup_14.x | sudo bash -
              sudo yum install -y nodejs
              
              # Clone your repository (replace with your repo URL)
              git clone https://github.com/yourusername/your-repo.git /home/ec2-user/app
              cd /home/ec2-user/app

              # Install dependencies and start the app
              npm install
              npm start
            EOF

  key_name      = "your-keypair-name"  # Replace with your key pair for SSH access
  associate_public_ip_address = true

  tags = {
    Name = "NodeJSAppInstance"
  }
}

# Optional: Define an RDS instance for MongoDB (You can use MongoDB Atlas instead)
resource "aws_db_instance" "mongodb_instance" {
  allocated_storage    = 20
  engine               = "mysql"             # Note: AWS does not support MongoDB in RDS; use MySQL, or use MongoDB Atlas for managed MongoDB
  engine_version       = "8.0"
  instance_class       = "db.t2.micro"
  name                 = "studentdb"
  username             = "admin"
  password             = "password"  # Replace with a secure password, possibly from AWS Secrets Manager
  parameter_group_name = "default.mysql8.0"
  skip_final_snapshot  = true

  publicly_accessible = true  # Allow public access for dev purposes (use carefully)
  vpc_security_group_ids = [aws_security_group.nodejs_sg.id]
}

# Output EC2 instance public IP for convenience
output "instance_public_ip" {
  value = aws_instance.nodejs_instance.public_ip
}