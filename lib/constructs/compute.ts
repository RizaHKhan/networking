import {
    AmazonLinuxGeneration,
    AmazonLinuxImage,
    Instance,
    InstanceClass,
    InstanceSize,
    InstanceType,
    SecurityGroup,
    SubnetType,
    Vpc,
} from "aws-cdk-lib/aws-ec2";
import { Role } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

interface Props {
    scope: Construct;
    name: string;
    vpc: Vpc;
    securityGroup: SecurityGroup;
    role: Role;
}

interface Exports {
    instance: Instance;
}

export default ({ scope, name, role, vpc, securityGroup }: Props): Exports => {
    const privateWithEgress = vpc.selectSubnets({
        subnetType: SubnetType.PRIVATE_WITH_EGRESS,
    }).subnets;

    const instance = new Instance(scope, name, {
        vpc,
        vpcSubnets: {
            subnets: privateWithEgress,
        },
        associatePublicIpAddress: false,
        requireImdsv2: true,
        securityGroup,
        role,
        ssmSessionPermissions: true,
        instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
        machineImage: new AmazonLinuxImage({
            generation: AmazonLinuxGeneration.AMAZON_LINUX_2,
        }),
    });

    return {
        instance,
    };
};
