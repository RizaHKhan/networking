import {
    DefaultInstanceTenancy,
    IpAddresses,
    IpProtocol,
    Ipv6Addresses,
    Vpc,
} from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

interface Props {
    scope: Construct;
}

interface Exports {
    vpc: Vpc;
}

export default ({ scope }: Props): Exports => {
    const vpc = new Vpc(scope, "VPC", {
        vpcName: "a4l-vpc1",
        ipAddresses: IpAddresses.cidr("10.16.0.0/16"),
        defaultInstanceTenancy: DefaultInstanceTenancy.DEFAULT,
        ipProtocol: IpProtocol.DUAL_STACK,
        ipv6Addresses: Ipv6Addresses.amazonProvided(),
    });

    return { vpc };
};
