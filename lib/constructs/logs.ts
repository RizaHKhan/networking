import { RemovalPolicy } from "aws-cdk-lib";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

interface Props {
    scope: Construct;
}

interface Exports {
    logGroup: LogGroup;
}

export default ({ scope }: Props): Exports => {
    const logGroup = new LogGroup(scope, "LogGroup", {
        retention: RetentionDays.ONE_WEEK,
        removalPolicy: RemovalPolicy.DESTROY,
    });

    return {
        logGroup,
    };
};
