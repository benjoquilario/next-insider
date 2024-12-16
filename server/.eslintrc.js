module.exports = {
  env: {
    es2018: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "es2018",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
}
