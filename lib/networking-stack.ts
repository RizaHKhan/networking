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

        const { createSecurityGroup } = createVpc({
            cidr: "10.0.0.0/16",
            name: "FargateNetworkingVpc",
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: "Public",
                    subnetType: SubnetType.PUBLIC, // This will create a internet gateway for us.
                },
                {
                    cidrMask: 24,
                    name: "AppSubet",
                    subnetType: SubnetType.PRIVATE_ISOLATED,
                },
                {
                    cidrMask: 24,
                    name: "DBSubnet",
                    subnetType: SubnetType.PRIVATE_ISOLATED,
                },
            ],
            props: {
                maxAzs: 2,
                natGateways: 1,
                enableDnsHostnames: true,
                enableDnsSupport: true,
            },
        });

        const albSg = createSecurityGroup({
            name: "ApplicationLoadBalancer",
            props: {
                description: "Security group for Application Load Balancer",
            },
        });

        albSg.addIngressRule(
            Peer.anyIpv4(),
            Port.tcp(80),
            "Allow HTTP traffic from anywhere",
        );

        const appSg = createSecurityGroup({
            name: "Application",
            props: {
                description: "Security group for Application Load Balancer",
            },
        });

        appSg.addIngressRule(
            albSg,
            Port.tcp(80),
            "Allow HTTP traffic from ALB",
        );

        const dataSg = createSecurityGroup({
            name: "Database",
            props: {
                description: "Database security group",
            },
        });

        dataSg.addIngressRule(
            appSg,
            Port.tcp(3306),
            "Allow MySQL traffic from Application",
        );
    }
}
