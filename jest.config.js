module.exports = {
  "roots": [
      "<rootDir>/packages",
  ],
  testEnvironment: "node",
  collectCoverage: true,
  "setupFilesAfterEnv": ["<rootDir>/setupTests.js"],
  "transform": {
      "^.+\\.tsx?$": "ts-jest"
  },
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  "coveragePathIgnorePatterns": [
      "/node_modules/",
      "/dist/",
      "/application-web-manager/"
  ],
  "moduleFileExtensions": [
      "ts",
      "tsx",
      "js",
      "jsx",
      "json",
      "node"
  ],
}
