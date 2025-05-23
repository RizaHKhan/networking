import {
    Instance,
    InstanceClass,
    InstanceSize,
    InstanceType,
    MachineImage,
    SecurityGroup,
    Subnet,
    SubnetSelection,
    SubnetType,
    Vpc,
} from "aws-cdk-lib/aws-ec2";
import { Role } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

interface Ec2Props {
    name: string;
    vpc: Vpc;
    role?: Role;
    securityGroup?: SecurityGroup;
    vpcSubnets: SubnetSelection;
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
        vpcSubnets,
    }: Ec2Props): Instance =>
        new Instance(scope, name, {
            vpc,
            instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
            machineImage: MachineImage.latestAmazonLinux2(),
            vpcSubnets,
            role,
            requireImdsv2: true,
            ssmSessionPermissions: true,
            securityGroup,
        });

    return { createEc2 };
};
