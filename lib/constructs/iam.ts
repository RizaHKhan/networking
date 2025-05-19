import { ManagedPolicy, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

interface BaseProps {
    name: string;
}

interface SsmRoleProps extends BaseProps {}

interface IamExports {
    createSSMRole: ({}: SsmRoleProps) => Role;
}

export default (scope: Construct): IamExports => {
    const createSSMRole = ({ name }: SsmRoleProps): Role =>
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
