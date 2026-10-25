
/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: {
          module: "CommonJS",
          moduleResolution: "Node",
          esModuleInterop: true,
          strict: true,
          types: ["node", "jest"],
          skipLibCheck: true
        },
        diagnostics: false
      }
    ]
  },
  moduleFileExtensions: ["ts", "js", "json"]
};
