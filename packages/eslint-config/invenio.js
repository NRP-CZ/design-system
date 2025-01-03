const { resolve } = require("node:path");


/*
 * This is a custom ESLint configuration for use with
 * Invenio packages.
 *
 * This config uses the Invenio Style Guide.
 * For more information, see https://github.com/inveniosoftware/eslint-config-invenio
 *
 */

module.exports = {
    extends: [
        "@inveniosoftware/eslint-config-invenio",
    ].map(require.resolve),
    parserOptions: {
    },
    plugins: ["only-warn"],
    ignorePatterns: ["node_modules/", "dist/"],
};
