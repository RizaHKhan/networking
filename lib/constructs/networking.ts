import { CfnOutput } from "aws-cdk-lib";
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
    SelectedSubnets,
    SubnetSelection,
    Peer,
    Port,
} from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

interface BaseProps {
    name: string;
}

interface SubnetConfiguration {
    cidrMask: number;
    name: string;
    subnetType: SubnetType;
}

interface CreateVpcProps extends BaseProps {
    cidr: string;
    subnetConfiguration: SubnetConfiguration[];
}

interface CreateVpcEndpointProps extends BaseProps {
    service: InterfaceVpcEndpointAwsService;
    subnets: SubnetSelection;
}
interface CreatePeeringConnectionProps extends BaseProps {
    vpcId: string;
    peerVpcId: string;
    name: string;
}

interface CreateNateGatewayProps extends BaseProps {
    subnetId: string;
}
interface CreateInterenetGatewayProps extends BaseProps {}
interface CreateSecurityGroupForVpcProps {
    vpc: Vpc;
    name: string;
}

export default (scope: Construct) => {
    const createVpc = ({
        cidr,
        name,
        subnetConfiguration,
    }: CreateVpcProps): {
        vpc: Vpc;
        createSecurityGroup: (name: string) => SecurityGroup;
        privateSubnets: SubnetSelection;
        publicSubnets: SubnetSelection;
        createVpcEndpoint: (
            props: CreateVpcEndpointProps,
        ) => InterfaceVpcEndpoint;
    } => {
        const vpc = new Vpc(scope, name, {
            vpcName: `${name}-${cidr}`,
            maxAzs: 1,
            ipAddresses: IpAddresses.cidr(cidr),
            defaultInstanceTenancy: DefaultInstanceTenancy.DEFAULT,
            ipProtocol: IpProtocol.DUAL_STACK,
            ipv6Addresses: Ipv6Addresses.amazonProvided(),
            subnetConfiguration,
        });

        new CfnOutput(scope, `${name}-VpcId`, {
            description: "VPC",
            value: vpc.vpcId,
        });

        const publicSubnets = vpc.selectSubnets({
            subnetType: SubnetType.PUBLIC,
        });

        const privateSubnets = vpc.selectSubnets({
            subnetType: SubnetType.PRIVATE_ISOLATED,
        });

        const createVpcEndpoint = ({
            name,
            service,
            subnets,
        }: CreateVpcEndpointProps): InterfaceVpcEndpoint =>
            new InterfaceVpcEndpoint(scope, name, {
                vpc,
                service,
                subnets,
            });

        const createSecurityGroup = (name: string) =>
            new SecurityGroup(scope, `${name}-securityGroup`, {
                vpc,
            });

        return {
            vpc,
            createSecurityGroup,
            privateSubnets,
            publicSubnets,
            createVpcEndpoint,
        };
    };

    const createPeeringConnection = ({
        vpcId,
        peerVpcId,
        name,
    }: CreatePeeringConnectionProps): CfnVPCPeeringConnection =>
        new CfnVPCPeeringConnection(scope, name, {
            vpcId,
            peerVpcId,
        });

    const createInternetGateway = ({ name }: CreateInterenetGatewayProps) =>
        new CfnInternetGateway(scope, name, {});

    return {
        createPeeringConnection,
        createVpc,
        createInternetGateway,
    };
};
