import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as Networking from "../lib/networking-stack";
import { SubnetType } from "aws-cdk-lib/aws-ec2";

test("VPC Created", () => {
    const app = new App();
    const stack = new Networking.NetworkingStack(app, "MyTestStack");
    const template = Template.fromStack(stack);

    // Has a VPC
    const vpc = template.hasResourceProperties("AWS::EC2::VPC", {
        CidrBlock: "10.0.0.0/16",
    });

    // Has a private subnet
    template.hasResourceProperties("AWS::EC2::Subnet", {
        CidrBlock: "10.0.0.0/24",
    });

    // EC2 instance is in the private subnet
    template.hasResourceProperties("AWS::EC2::Instance", {
        InstanceType: "t3.micro",
    });
});
