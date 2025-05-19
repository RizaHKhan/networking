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
    Subnet,
    CfnNatGateway,
    CfnInternetGateway,
} from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

interface BaseProps {
    name: string;
}

interface CreateVpcProps extends BaseProps {
    cidr: string;
}

interface CreateVpcEndpointProps extends BaseProps {
    vpc: Vpc;
    service: InterfaceVpcEndpointAwsService;
}
interface CreatePeeringConnectionProps extends BaseProps {
    vpcId: string;
    peerVpcId: string;
    scope: Construct;
    name: string;
}

interface CreateNateGatewayProps extends BaseProps {
    subnetId: string;
}
interface CreateInterenetGatewayProps extends BaseProps {}
interface CreateSecurityGroupForVpcProps {
    vpc: Vpc;
    scope: Construct;
    name: string;
}

interface CreateSubnetProps extends BaseProps {
    vpc: Vpc;
    cidrBlock: string;
    availabilityZone: string;
    optionalProps?: {
        assignIpv6AddressOnCreation: boolean;
        ipv6CidrBlock: string;
        mapPublicIpOnLaunch: boolean;
    };
}

interface Exports {
    createVpc: (props: CreateVpcProps) => Vpc;
    createPeeringConnection(
        props: CreatePeeringConnectionProps,
    ): CfnVPCPeeringConnection;

    createSecuritGroupForVpc: (
        props: CreateSecurityGroupForVpcProps,
    ) => SecurityGroup;

    createVpcEndpoint: (props: CreateVpcEndpointProps) => InterfaceVpcEndpoint;
    createSubnet: (props: CreateSubnetProps) => Subnet;
    createNatGateway: (props: CreateNateGatewayProps) => CfnNatGateway;
    createInternetGateway: (
        props: CreateInterenetGatewayProps,
    ) => CfnInternetGateway;
}

export default (scope: Construct): Exports => {
    const createVpc = ({ cidr, name }: CreateVpcProps): Vpc =>
        new Vpc(scope, name, {
            vpcName: `VPC${cidr}`,
            maxAzs: 1, // Default is all AZs in region
            ipAddresses: IpAddresses.cidr(cidr), // 10.16.0.0 -> 10.16.255.255
            defaultInstanceTenancy: DefaultInstanceTenancy.DEFAULT,
            ipProtocol: IpProtocol.DUAL_STACK,
            ipv6Addresses: Ipv6Addresses.amazonProvided(),
        });

    const createPeeringConnection = ({
        vpcId,
        peerVpcId,
        scope,
        name,
    }: CreatePeeringConnectionProps): CfnVPCPeeringConnection =>
        new CfnVPCPeeringConnection(scope, name, {
            vpcId,
            peerVpcId,
        });

    const createSecuritGroupForVpc = ({
        vpc,
        scope,
        name,
    }: CreateSecurityGroupForVpcProps): SecurityGroup =>
        new SecurityGroup(scope, name, {
            vpc,
        });

    const createVpcEndpoint = ({
        name,
        vpc,
        service,
    }: CreateVpcEndpointProps): InterfaceVpcEndpoint =>
        new InterfaceVpcEndpoint(scope, name, {
            vpc,
            service,
        });

    const createSubnet = ({
        name,
        vpc,
        cidrBlock,
        availabilityZone,
        optionalProps,
    }: CreateSubnetProps): Subnet =>
        new Subnet(scope, name, {
            vpcId: vpc.vpcId,
            availabilityZone,
            cidrBlock,
            ...optionalProps,
        });

    const createNatGateway = ({ name }: CreateNateGatewayProps) =>
        new CfnNatGateway(scope, name, {
            subnetId,
        });
    const createInternetGateway = ({ name }: CreateInterenetGatewayProps) =>
        new CfnInternetGateway(scope, name, {});

    return {
        createPeeringConnection,
        createSecuritGroupForVpc,
        createVpc,
        createVpcEndpoint,
        createSubnet,
        createNatGateway,
        createInternetGateway,
    };
};
