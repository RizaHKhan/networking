import { ManagedPolicy, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

interface SsmRoleProps {
    scope: Construct;
    name: string;
}

interface IamExports {
    createSSMRole: ({}: SsmRoleProps) => Role;
}

export default (): IamExports => {
    const createSSMRole = ({ scope, name }: SsmRoleProps): Role =>
        new Role(scope, name, {
            assumedBy: new ServicePrincipal("ec2.amazonaws.com"),
            managedPolicies: [
                ManagedPolicy.fromAwsManagedPolicyName(
                    "AmazonSSMManagedInstanceCore",
                ),
            ],
        });

    return { createSSMRole };
};
