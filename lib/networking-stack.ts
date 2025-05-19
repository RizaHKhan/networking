import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import networking from "./constructs/networking";
import compute from "./constructs/compute";
import iam from "./constructs/iam";
import {
    InterfaceVpcEndpointAwsService,
    Peer,
    Port,
} from "aws-cdk-lib/aws-ec2";

export class NetworkingStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const {
            createVpc,
            createSecuritGroupForVpc,
            createVpcEndpoint,
            createSubnet,
            createNatGateway,
            createInternetGateway,
        } = networking(this);
        const { createEc2 } = compute(this);
        const { createSSMRole } = iam(this);
    }
}
