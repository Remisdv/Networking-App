import type { Config } from "jest";

const config: Config = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "./",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testRegex: ".*\\.spec\\.ts$",
  collectCoverageFrom: ["src/**/*.{ts,tsx}"],
  coverageDirectory: "./coverage",
};

export default config;
