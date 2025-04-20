#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { NetworkingStack } from "../lib/networking-stack";

const app = new cdk.App();
new NetworkingStack(app, "NetworkingStack", {
    env: { account: "713287342529", region: "us-east-1" },
});
