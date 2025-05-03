import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import networking from "./constructs/networking";
import compute from "./constructs/compute";

export class NetworkingStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const { vpc } = networking({ scope: this });
        compute({ scope: this, vpc });
    }
}
