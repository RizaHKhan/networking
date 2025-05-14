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

interface Ec2Props {
    scope: Construct;
    name: string;
    vpc: Vpc;
}

interface ComputeExports {
    createEc2: ({ scope, name }: Ec2Props) => Instance;
}

export default (): ComputeExports => {
    const createEc2 = ({ scope, name, vpc }: Ec2Props): Instance =>
        new Instance(scope, name, {
            vpc,
            instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
            machineImage: MachineImage.latestAmazonLinux2(),
            vpcSubnets: {
                subnetType: SubnetType.PRIVATE_ISOLATED,
            },
        });

    return { createEc2 };
};
