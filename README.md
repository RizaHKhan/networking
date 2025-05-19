# Task 1

1. **Create a VPC**: Define a VPC with a CIDR block (e.g., `10.0.0.0/16`).
2. **Add Subnets**: Create one public subnet and one private subnet within the VPC.
3. **Attach an Internet Gateway**: Attach an Internet Gateway to the VPC and associate it with the public subnet.
4. **Add a NAT Gateway**: Deploy a NAT Gateway in the public subnet to allow outbound internet access for the private subnet.
5. **Deploy EC2 Instances**: Launch one EC2 instance in the public subnet and another in the private subnet.
6. **Configure Security Groups**: Set up security groups to allow SSH access to the public instance and private communication between the two instances.
