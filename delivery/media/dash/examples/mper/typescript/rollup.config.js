import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";

export default {
  input: "src/main.ts",
  output: {
    dir: "dist",
    format: "es",
  },
  external: ['http-request', 'log' ],
  plugins: [typescript({ target: 'es2017'}), commonjs(), resolve()]
};
