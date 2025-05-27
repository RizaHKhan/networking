import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import networking from "./constructs/networking";
import compute from "./constructs/compute";
import iam from "./constructs/iam";
import {
    CfnRoute,
    InterfaceVpcEndpointAwsService,
    Peer,
    Port,
    SubnetType,
} from "aws-cdk-lib/aws-ec2";

export class NetworkingStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const { createVpc, createPeeringConnection } = networking(this);
        const { createEc2 } = compute(this);
        const { createSSMRole } = iam(this);
        const ssmRole = createSSMRole({ name: "TestEc2Role" });

        const {
            vpc,
            createSecurityGroup,
            publicSubnets,
            privateSubnets,
            createVpcEndpoint,
        } = createVpc({
            name: "TestingVPC",
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

        const privateSecurityGroup = createSecurityGroup(
            "PrivateSecurityGroup",
        );

        const publicSecurityGroup = createSecurityGroup("PublicSecurityGroup");

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

        const privateInstance = createEc2({
            name: "TestEc2Private",
            vpc,
            role: ssmRole,
            vpcSubnets: privateSubnets,
        });

        const publicInstance = createEc2({
            name: "TestEc2Public",
            vpc,
            role: ssmRole,
            vpcSubnets: publicSubnets,
        });
    }
}
