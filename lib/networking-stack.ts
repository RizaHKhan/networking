import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import networking from "./constructs/networking";
import compute from "./constructs/compute";

export class NetworkingStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const { createVpc } = networking();
        const { createEc2 } = compute();

        const vpc1 = createVpc({ cidr: "10.16.0.0/16", scope: this });
        const instance1 = createEc2({ scope, name: "Vpc1Instance", vpc: vpc1 });

        const vpc2 = createVpc({ cidr: "10.17.0.0/16", scope: this });
        const instance2 = createEc2({ scope, name: "Vpc2Instance", vpc: vpc2 });

        const vpc3 = createVpc({ cidr: "10.18.0.0/16", scope: this });
        const instance3 = createEc2({ scope, name: "Vpc3Instance", vpc: vpc3 });

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
