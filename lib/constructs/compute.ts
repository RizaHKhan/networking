import { CfnOutput } from "aws-cdk-lib";
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
import { Cluster } from "aws-cdk-lib/aws-ecs";
import { Role } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

interface Ec2Props {
    name: string;
    vpc: Vpc;
    role?: Role;
    securityGroup?: SecurityGroup;
    vpcSubnets: SubnetSelection;
}

interface ClusterProps {
    vpc: Vpc;
    name: string;
    clusterName?: string;
}

interface ComputeExports {
    createEc2: (props: Ec2Props) => Instance;
    createCluster: (props: ClusterProps) => Cluster;
}

export default (scope: Construct): ComputeExports => {
    const createEc2 = ({
        name,
        vpc,
        role,
        securityGroup,
        vpcSubnets,
    }: Ec2Props): Instance => {
        const instance = new Instance(scope, name, {
            vpc,
            instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
            machineImage: MachineImage.latestAmazonLinux2(),
            vpcSubnets,
            role,
            requireImdsv2: true,
            ssmSessionPermissions: true,
            securityGroup,
        });

        new CfnOutput(scope, `${name}PublicIp`, {
            value: instance.instanceId,
            description: "Instance ID",
        });

        return instance;
    };

    const createCluster = ({ vpc, name, clusterName }: ClusterProps): Cluster =>
        new Cluster(scope, name, {
            vpc,
            clusterName,
        });

    return { createEc2, createCluster };
};
