const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * This is a custom ESLint configuration for use with
 * Invenio packages.
 *
 * This config uses the Vercel Style Guide adapted to Invenio.
 * For more information, see https://github.com/inveniosoftware/eslint-config-invenio
 *
 */

module.exports = {
    extends: [
        "plugin:prettier/recommended",
        "plugin:jsx-a11y/recommended",
        ...[
            "@vercel/style-guide/eslint/browser",
            "@vercel/style-guide/eslint/typescript",
            "@vercel/style-guide/eslint/react",
        ].map(require.resolve)
    ],
    parserOptions: {
        project,
    },
    plugins: ["only-warn", "jsx-a11y", "prettier", "import"],
    globals: {
        JSX: true,
    },
    settings: {
        "import/resolver": {
            typescript: {
                project,
            },
        },
    },
    ignorePatterns: ["node_modules/", "dist/", ".eslintrc.js", "**/*.css"],
    // add rules configurations here
    rules: {
        "import/no-default-export": "off",
        "no-debugger": process.env.NODE_ENV === 'production' ? 2 : 0,
        // allow async-await
        "generator-star-spacing": 0,
        "import/newline-after-import": ["error", { "count": 1 }]
    },
};
