import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import networking from "./constructs/networking";
import compute from "./constructs/compute";
import iam from "./constructs/iam";
import logs from "./constructs/logs";

export class NetworkingStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const { logGroup } = logs({ scope: this });
        const { role, logRole } = iam({ scope: this });
        const { vpc, securityGroup } = networking({
            scope: this,
            logGroup,
            logRole,
        });
        const compute1 = compute({
            scope: this,
            name: "Instance1",
            role,
            vpc,
            securityGroup,
        });

        // const compute2 = compute({
        //     scope: this,
        //     name: "instance2",
        //     role,
        //     vpc,
        //     securityGroup,
        // });

        new CfnOutput(this, "Instance1Id", {
            value: compute1.instance.instanceId,
        });
        // new CfnOutput(this, "Instance1Ip", {
        //     value: compute1.instance.instancePublicIp,
        // });
        // new CfnOutput(this, "Instance2Id", {
        //     value: compute2.instance.instanceId,
        // });
        // new CfnOutput(this, "Instance2Ip", {
        //     value: compute2.instance.instancePublicIp,
        // });
    }
}

// NetworkingStack.Instance1Id = i-02cfd6c723fe7bde5
