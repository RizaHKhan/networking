import {
    Instance,
    InstanceClass,
    InstanceSize,
    InstanceType,
    MachineImage,
    SubnetType,
    Vpc,
} from "aws-cdk-lib/aws-ec2";
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
        instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
        machineImage: MachineImage.latestAmazonLinux2(),
        vpcSubnets: {
            subnetType: SubnetType.PRIVATE_ISOLATED,
        },
        requireImdsv2: true,
        vpc,
    });

    return { instance };
};
