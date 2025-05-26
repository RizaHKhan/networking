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

        const [vpc1, vpc2] = [
            { name: "vpc1", cidr: "10.1.0.0/16" },
            { name: "vpc2", cidr: "10.2.0.0/16" },
        ].map(({ name, cidr }) => {
            const { vpc, privateSubnets, createVpcEndpoint } = createVpc({
                name,
                cidr,
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
                name: `${name}-TestVpcEndpoint`,
                service: InterfaceVpcEndpointAwsService.SSM,
                subnets: privateSubnets,
            });
            createVpcEndpoint({
                name: `${name}-TestVpcEndpointSSMMessages`,
                service: InterfaceVpcEndpointAwsService.SSM_MESSAGES,
                subnets: privateSubnets,
            });
            createVpcEndpoint({
                name: `${name}-TestVpcEndpointEC2Messages`,
                service: InterfaceVpcEndpointAwsService.EC2_MESSAGES,
                subnets: privateSubnets,
            });

            createEc2({
                name: `${name}-TestEc2`,
                vpc,
                role: ssmRole,
                vpcSubnets: privateSubnets,
            });

            return vpc;
        });

        const peeringConnection = createPeeringConnection({
            name: "TestVpcPeering",
            vpcId: vpc1.vpcId,
            peerVpcId: vpc2.vpcId,
        });

        // Add routes to VPC1's route tables to route traffic to VPC2
        vpc1.publicSubnets.forEach((subnet) => {
            new CfnRoute(this, `RouteToVpc2-${subnet.node.id}`, {
                routeTableId: subnet.routeTable.routeTableId,
                destinationCidrBlock: "10.2.0.0/16",
                vpcPeeringConnectionId: peeringConnection.ref,
            });
        });

        // Add routes to VPC2's route tables to route traffic to VPC1
        vpc2.publicSubnets.forEach((subnet) => {
            new CfnRoute(this, `RouteToVpc1-${subnet.node.id}`, {
                routeTableId: subnet.routeTable.routeTableId,
                destinationCidrBlock: "10.1.0.0/16",
                vpcPeeringConnectionId: peeringConnection.ref,
            });
        });
    }
}
