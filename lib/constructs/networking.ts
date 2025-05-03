import {
    DefaultInstanceTenancy,
    IpAddresses,
    IpProtocol,
    Ipv6Addresses,
    SecurityGroup,
    SubnetType,
    Vpc,
} from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

interface Props {
    scope: Construct;
}

interface Exports {
    vpc: Vpc;
    securityGroup: SecurityGroup;
}

export default ({ scope }: Props): Exports => {
    const vpc = new Vpc(scope, "VPC", {
        vpcName: "a4l-vpc1",
        maxAzs: 1,
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
                subnetType: SubnetType.PUBLIC,
                cidrMask: 20,
            },
            {
                name: "Reserved",
                subnetType: SubnetType.PRIVATE_ISOLATED,
                cidrMask: 20,
                reserved: true,
            },
        ],
    });

    const securityGroup = new SecurityGroup(scope, "SecurityGroup", {
        vpc,
    });

    return { vpc, securityGroup };
};
