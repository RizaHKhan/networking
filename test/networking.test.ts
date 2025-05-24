import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { SubnetType } from "aws-cdk-lib/aws-ec2";
import * as Networking from "../lib/networking-stack";

describe("Networking Stack", () => {
    test("VPC Created", () => {
        const app = new App();
        const stack = new Networking.NetworkingStack(app, "MyTestStack");
        const template = Template.fromStack(stack);

        // Has a VPC
        template.hasResourceProperties("AWS::EC2::VPC", {
            CidrBlock: "10.0.0.0/16",
        });

        template.resourceCountIs("AWS::EC2::Subnet", 2);

        // Has a private subnet
        template.hasResourceProperties("AWS::EC2::Subnet", {
            CidrBlock: "10.0.0.0/24",
        });
    });

    test("One EC2 created", () => {
        const app = new App();
        const stack = new Networking.NetworkingStack(app, "MyTestStack");
        const template = Template.fromStack(stack);

        // EC2 instance is in the private subnet
        template.resourceCountIs("AWS::EC2::Instance", 1);
        template.hasResourceProperties("AWS::EC2::Instance", {
            InstanceType: "t3.micro",
        });
    });
});
