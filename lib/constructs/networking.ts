import {
    DefaultInstanceTenancy,
    IpAddresses,
    IpProtocol,
    Ipv6Addresses,
    SubnetType,
    Vpc,
    CfnVPCPeeringConnection,
    SecurityGroup,
    InterfaceVpcEndpoint,
    InterfaceVpcEndpointAwsService,
} from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

interface VpcProps {
    cidr: string;
    scope: Construct;
}

type CreateVpcEndpoint = ({
    scope,
    name,
    vpc,
    service,
}: {
    scope: Construct;
    name: string;
    vpc: Vpc;
    service: InterfaceVpcEndpointAwsService;
}) => InterfaceVpcEndpoint;

interface Exports {
    createVpc: ({ cidr, scope }: VpcProps) => Vpc;
    createPeeringConnection({
        vpcId,
        peerVpcId,
        scope,
        name,
    }: {
        vpcId: string;
        peerVpcId: string;
        scope: Construct;
        name: string;
    }): CfnVPCPeeringConnection;

    createSecuritGroupForVpc: ({
        vpc,
        scope,
        name,
    }: {
        vpc: Vpc;
        scope: Construct;
        name: string;
    }) => SecurityGroup;

    createVpcEndpoint: CreateVpcEndpoint;
}

export default (): Exports => {
    const createVpc = ({
        cidr,
        scope,
    }: {
        cidr: string;
        scope: Construct;
    }): Vpc =>
        new Vpc(scope, `VPC${cidr}`, {
            vpcName: `VPC${cidr}`,
            maxAzs: 1, // Default is all AZs in region
            ipAddresses: IpAddresses.cidr(cidr), // 10.16.0.0 -> 10.16.255.255
            defaultInstanceTenancy: DefaultInstanceTenancy.DEFAULT,
            ipProtocol: IpProtocol.DUAL_STACK,
            ipv6Addresses: Ipv6Addresses.amazonProvided(),
            subnetConfiguration: [
                {
                    name: "Web",
                    subnetType: SubnetType.PRIVATE_ISOLATED,
                    cidrMask: 20,
                },
            ],
        });

    const createPeeringConnection = ({
        vpcId,
        peerVpcId,
        scope,
        name,
    }: {
        vpcId: string;
        peerVpcId: string;
        scope: Construct;
        name: string;
    }): CfnVPCPeeringConnection =>
        new CfnVPCPeeringConnection(scope, name, {
            vpcId,
            peerVpcId,
        });

    const createSecuritGroupForVpc = ({
        vpc,
        scope,
        name,
    }: {
        vpc: Vpc;
        scope: Construct;
        name: string;
    }): SecurityGroup =>
        new SecurityGroup(scope, name, {
            vpc,
        });

    const createVpcEndpoint: CreateVpcEndpoint = ({
        scope,
        name,
        vpc,
        service,
    }) =>
        new InterfaceVpcEndpoint(scope, name, {
            vpc,
            service,
        });

    return {
        createVpc,
        createPeeringConnection,
        createSecuritGroupForVpc,
        createVpcEndpoint,
    };
};
