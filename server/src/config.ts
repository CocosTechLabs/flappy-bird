import dotenv from 'dotenv';
import { Address } from "@ton/core";
import { deployConfig, DeployConfig } from "./deploy-config";

dotenv.config();

export const config: DeployConfig = {
  ...deployConfig,
};
