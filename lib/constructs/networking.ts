import {
    DefaultInstanceTenancy,
    FlowLog,
    FlowLogDestination,
    FlowLogMaxAggregationInterval,
    FlowLogResourceType,
    IpAddresses,
    IpProtocol,
    Ipv6Addresses,
    Port,
    SecurityGroup,
    SubnetType,
    Vpc,
} from "aws-cdk-lib/aws-ec2";
import { Role } from "aws-cdk-lib/aws-iam";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

interface Props {
    scope: Construct;
    logGroup: LogGroup;
    logRole: Role;
}

interface Exports {
    vpc: Vpc;
    securityGroup: SecurityGroup;
}

export default ({ scope, logGroup, logRole }: Props): Exports => {
    // NOTE: Creates an internet gateway and a NAT gateway depending on the subnet types. Public subnets creates a internet gateway and isolated subnets creates a NAT gateway.
    const vpc = new Vpc(scope, "VPC", {
        vpcName: "a4l-vpc1",
        maxAzs: 4,
        ipAddresses: IpAddresses.cidr("10.16.0.0/16"), // 10.16.0.0 -> 10.16.255.255
        defaultInstanceTenancy: DefaultInstanceTenancy.DEFAULT,
        ipProtocol: IpProtocol.DUAL_STACK,
        ipv6Addresses: Ipv6Addresses.amazonProvided(),
        subnetConfiguration: [
            {
                name: "DB",
                subnetType: SubnetType.PRIVATE_ISOLATED,
                cidrMask: 20,
            },
            {
                name: "App",
                subnetType: SubnetType.PRIVATE_ISOLATED,
                cidrMask: 20,
            },
            {
                name: "Web",
                subnetType: SubnetType.PRIVATE_WITH_EGRESS,
                cidrMask: 20,
            },
            {
                name: "Reserved",
                subnetType: SubnetType.PUBLIC,
                cidrMask: 20,
            },
        ],
    });

    const securityGroup = new SecurityGroup(scope, "SecurityGroup", {
        vpc,
    });

    securityGroup.addIngressRule(
        securityGroup,
        Port.allTcp(),
        "Allow ICMP traffic",
    );

    new FlowLog(scope, "FlowLog", {
        resourceType: FlowLogResourceType.fromVpc(vpc),
        destination: FlowLogDestination.toCloudWatchLogs(logGroup, logRole),
        maxAggregationInterval: FlowLogMaxAggregationInterval.ONE_MINUTE,
    });

    return { vpc, securityGroup };
};
