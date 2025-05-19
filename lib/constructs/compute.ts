import {
    Instance,
    InstanceClass,
    InstanceSize,
    InstanceType,
    MachineImage,
    SecurityGroup,
    SubnetType,
    Vpc,
} from "aws-cdk-lib/aws-ec2";
import { Role } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

interface Ec2Props {
    name: string;
    vpc: Vpc;
    role: Role;
    securityGroup: SecurityGroup;
}

interface ComputeExports {
    createEc2: (props: Ec2Props) => Instance;
}

export default (scope: Construct): ComputeExports => {
    const createEc2 = ({
        name,
        vpc,
        role,
        securityGroup,
    }: Ec2Props): Instance =>
        new Instance(scope, name, {
            vpc,
            instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
            machineImage: MachineImage.latestAmazonLinux2(),
            vpcSubnets: {
                subnetType: SubnetType.PRIVATE_ISOLATED,
            },
            role,
            requireImdsv2: true,
            ssmSessionPermissions: true,
            securityGroup,
        });

    return { createEc2 };
};
