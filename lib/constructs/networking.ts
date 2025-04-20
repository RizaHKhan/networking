import { SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

interface Props {
    scope: Construct;
}

interface Exports {
    vpc: Vpc;
}

export default ({ scope }: Props): Exports => {
    const vpc = new Vpc(scope, "VPC", {
        maxAzs: 3,
        natGateways: 1,
        cidr: "10.16.0.0/24",
        subnetConfiguration: [
            {
                name: "public",
                subnetType: SubnetType.PUBLIC,
            },
            {
                name: "private",
                subnetType: SubnetType.PRIVATE_WITH_EGRESS,
            },
        ],
    });

    return { vpc };
};
