import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import networking from "./constructs/networking";
import compute from "./constructs/compute";
import iam from "./constructs/iam";
import {
    InterfaceVpcEndpointAwsService,
    Peer,
    Port,
    SubnetType,
} from "aws-cdk-lib/aws-ec2";

export class NetworkingStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const { createVpc } = networking(this);
        const { createEc2 } = compute(this);
        const { createSSMRole } = iam(this);

        const { vpc, privateSubnets, createVpcEndpoint } = createVpc({
            name: "TestVpc",
            cidr: "10.0.0.0/16",
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: "Private",
                    subnetType: SubnetType.PRIVATE_ISOLATED,
                },
                {
                    cidrMask: 24,
                    name: "Public",
                    subnetType: SubnetType.PUBLIC,
                },
            ],
        });

        createVpcEndpoint({
            name: "TestVpcEndpoint",
            service: InterfaceVpcEndpointAwsService.SSM,
            subnets: privateSubnets,
        });
        createVpcEndpoint({
            name: "TestVpcEndpointSSMMessages",
            service: InterfaceVpcEndpointAwsService.SSM_MESSAGES,
            subnets: privateSubnets,
        });
        createVpcEndpoint({
            name: "TestVpcEndpointEC2Messages",
            service: InterfaceVpcEndpointAwsService.EC2_MESSAGES,
            subnets: privateSubnets,
        });

        const ec2 = createEc2({
            name: "TestEc2",
            vpc,
            role: createSSMRole({ name: "TestEc2Role" }),
            vpcSubnets: privateSubnets,
        });
    }
}
