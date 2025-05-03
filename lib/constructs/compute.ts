import {
    AmazonLinuxImage,
    Instance,
    InstanceClass,
    InstanceSize,
    InstanceType,
    MachineImage,
    SubnetType,
    Vpc,
} from "aws-cdk-lib/aws-ec2";
import { ManagedPolicy, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

interface Props {
    scope: Construct;
    vpc: Vpc;
}
interface Exports {
    instance: Instance;
}

export default ({ scope, vpc }: Props): Exports => {
    const instance = new Instance(scope, "NetworkingInstance", {
        vpc,
        vpcSubnets: {
            subnetType: SubnetType.PUBLIC,
        },
        role: new Role(scope, "InstanceRole", {
            assumedBy: new ServicePrincipal("ec2.amazonaws.com"),
            managedPolicies: [
                ManagedPolicy.fromAwsManagedPolicyName(
                    "AmazonSSMManagedInstanceCore",
                ),
            ],
        }),
        instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
        machineImage: MachineImage.latestAmazonLinux2(),
        associatePublicIpAddress: false,
        ssmSessionPermissions: true,
    });

    return { instance };
};
