import {
    AmazonLinuxGeneration,
    AmazonLinuxImage,
    Instance,
    InstanceClass,
    InstanceSize,
    InstanceType,
    MachineImage,
    SecurityGroup,
    SubnetType,
    Vpc,
} from "aws-cdk-lib/aws-ec2";
import { ManagedPolicy, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

interface Props {
    scope: Construct;
    vpc: Vpc;
    securityGroup: SecurityGroup;
    name: string
}

interface Exports {
    instance: Instance;
}

export default ({ scope, vpc, securityGroup, name }: Props): Exports => {
    const instance = new Instance(scope, name, {
        vpc,
        vpcSubnets: {
            subnetType: SubnetType.PUBLIC,
        },
        securityGroup,
        requireImdsv2: true,
        role: new Role(scope, "InstanceRole", {
            assumedBy: new ServicePrincipal("ec2.amazonaws.com"),
            managedPolicies: [
                ManagedPolicy.fromAwsManagedPolicyName(
                    "AmazonSSMManagedInstanceCore",
                ),
            ],
        }),
        instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
        associatePublicIpAddress: false,
        ssmSessionPermissions: true,
        machineImage: new AmazonLinuxImage({
            generation: AmazonLinuxGeneration.AMAZON_LINUX_2,
        }),
    });

    return { instance };
};
