import { ManagedPolicy, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
interface Props {
    scope: Construct;
}

interface Exports {
    role: Role;
    logRole: Role;
}

export default ({ scope }: Props): Exports => {
    const role = new Role(scope, "InstanceRole", {
        assumedBy: new ServicePrincipal("ec2.amazonaws.com"),
        managedPolicies: [
            ManagedPolicy.fromAwsManagedPolicyName(
                "AmazonSSMManagedInstanceCore",
            ),
        ],
    });

    const logRole = new Role(scope, "LogRole", {
        assumedBy: new ServicePrincipal("vpc-flow-logs.amazonaws.com"),
    });

    return { role, logRole };
};
