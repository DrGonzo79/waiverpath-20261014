import type {NextConfig} from "next";
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
const basePath = process.env.GITHUB_ACTIONS && repo ? `/${repo}` : "";
const config: NextConfig = {output: "export", trailingSlash: true, basePath, assetPrefix: basePath};
export default config;
