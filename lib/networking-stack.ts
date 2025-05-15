import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import networking from "./constructs/networking";
import compute from "./constructs/compute";
import iam from "./constructs/iam";
import { Peer, Port } from "aws-cdk-lib/aws-ec2";

export class NetworkingStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const { createVpc, createPeeringConnection, createSecuritGroupForVpc } =
            networking();
        const { createEc2 } = compute();
        const { createSSMRole } = iam();

        const vpc1 = createVpc({ cidr: "10.16.0.0/16", scope: this });
        const sg1 = createSecuritGroupForVpc({
            scope: this,
            vpc: vpc1,
            name: "Vpc1SG",
        });
        sg1.addIngressRule(
            Peer.anyIpv4(),
            Port.tcp(443),
            "Allow HTTPS traffic from anywhere",
        );
        sg1.addEgressRule(Peer.anyIpv4(), Port.tcp(443), "Allow SSM traffic");
        const instance1 = createEc2({
            scope: this,
            name: "Vpc1Instance",
            vpc: vpc1,
            role: createSSMRole({ scope: this, name: "Vpc1InstanceSSMRole" }),
            securityGroup: sg1,
        });

        const vpc2 = createVpc({
            cidr: "10.17.0.0/16",
            scope: this,
        });
        const sg2 = createSecuritGroupForVpc({
            scope: this,
            vpc: vpc2,
            name: "Vpc2SG",
        });
        sg2.addIngressRule(
            Peer.anyIpv4(),
            Port.tcp(443),
            "Allow HTTPS traffic from anywhere",
        );
        const instance2 = createEc2({
            scope: this,
            name: "Vpc2Instance",
            vpc: vpc2,
            role: createSSMRole({ scope: this, name: "Vpc2InstanceSSMRole" }),
            securityGroup: sg2,
        });
        createPeeringConnection({
            scope: this,
            name: "VPCPeer1-2",
            vpcId: vpc1.vpcId,
            peerVpcId: vpc2.vpcId,
        });

        const vpc3 = createVpc({ cidr: "10.18.0.0/16", scope: this });
        const sg3 = createSecuritGroupForVpc({
            scope: this,
            vpc: vpc3,
            name: "Vpc3SG",
        });
        sg3.addIngressRule(
            Peer.anyIpv4(),
            Port.tcp(443),
            "Allow HTTPS traffic from anywhere",
        );
        const instance3 = createEc2({
            scope: this,
            name: "Vpc3Instance",
            vpc: vpc3,
            role: createSSMRole({ scope: this, name: "Vpc3InstanceSSMRole" }),
            securityGroup: sg3,
        });

        new CfnOutput(this, "Vpc1", {
            value: vpc1.vpcId,
            description: "VPC 1 ID",
        });
        new CfnOutput(this, "Instance1Ouput", {
            value: instance1.instanceId,
        });

        new CfnOutput(this, "Vpc2", {
            value: vpc2.vpcId,
            description: "VPC 2 ID",
        });
        new CfnOutput(this, "Instance2Ouput", {
            value: instance2.instanceId,
        });

        new CfnOutput(this, "Vpc3", {
            value: vpc3.vpcId,
            description: "VPC 3 ID",
        });
        new CfnOutput(this, "Instance3Ouput", {
            value: instance3.instanceId,
        });
    }
}
