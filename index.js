'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var virtual = _interopDefault(require('rollup-plugin-virtual'));
var fsExtra = require('fs-extra');

var name = "@topl/stable-plugin-fixture";
var version = "0.5.1";
var description = "bundle fixture data as modules";
var main = "index.js";
var author = "Lil Thorny <hi@lilthorny.party";
var license = "MIT";
var scripts = {
	build: "rollup -c rollup.config.js"
};
var devDependencies = {
	"fs-extra": "^7.0.1",
	rollup: "^1.6.0",
	"rollup-plugin-json": "^3.1.0",
	"rollup-plugin-virtual": "^1.0.1"
};
var packageJson = {
	name: name,
	version: version,
	description: description,
	main: main,
	author: author,
	license: license,
	scripts: scripts,
	devDependencies: devDependencies
};

async function fixture(config) {
  config = [].concat(config).pop(); // TODO: handle multiple options hashes

  const { files, moduleName = "fixture" } = config;

  const fixtureData = await Promise.all(
    files.map(async file => {
      return {
        file,
        contents: await fsExtra.readFile(file, "utf-8"),
      };
    }),
  );

  const fixtureModule = `${files
    .map(
      file =>
        `import ${mangle(file)} from ${JSON.stringify(`fixture:${file}`)}`,
    )
    .join(";\n")}
export default {
${files.map(it => `  ${JSON.stringify(it)}: ${mangle(it)}`).join(",\n")}
};`;

  return {
    package: packageJson,

    provides: {
      plugins() {
        return [
          virtual({
            [moduleName]: fixtureModule,
          }),
          ...fixtureData.map(({ file, contents }) =>
            virtual({
              [`fixture:${file}`]: `export default ${JSON.stringify(contents)}`,
            }),
          ),
        ];
      },
    },
  };
}

function mangle(str) {
  return `_${str.toLowerCase().replace(/[^a-z0-9]/g, "_")}`;
}

exports.fixture = fixture;
