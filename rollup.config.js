import json from "rollup-plugin-json";

export default {
  input: './src/index.js',
  output: {
    file: "./index.js",
    format: "cjs"
  },
  plugins: [
    json()
  ]
};
