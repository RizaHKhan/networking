import {
    DefaultInstanceTenancy,
    IpAddresses,
    IpProtocol,
    Ipv6Addresses,
    SubnetType,
    Vpc,
} from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

interface VpcProps {
    cidr: string;
    scope: Construct;
}

interface Exports {
    createVpc: ({ cidr, scope }: VpcProps) => Vpc;
}

export default (): Exports => {
    const createVpc = ({
        cidr,
        scope,
    }: {
        cidr: string;
        scope: Construct;
    }): Vpc =>
        new Vpc(scope, `VPC-${cidr}`, {
            vpcName: `vpc-${cidr}`,
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

    return { createVpc };
};
