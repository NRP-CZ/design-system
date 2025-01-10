import { join, dirname, resolve } from "path";

// import tsconfigPaths from "vite-tsconfig-paths";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../../../packages/components-sui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-interactions"),
    getAbsolutePath("@storybook/addon-coverage"),
  ],
  docs: {
    autodocs: "tag",
  },
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  typescript: {
    // reactDocgen: "react-docgen",
    skipBabel: true,
    check: false,
    reactDocgen: "react-docgen",
    reactDocgenTypescriptOptions: {
      // Speeds up Storybook build time
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false,
      },
      // Makes union prop types like variant and size appear as select controls
      shouldExtractLiteralValuesFromEnum: true,
      // Makes string and boolean types that can be undefined appear as inputs and switches
      shouldRemoveUndefinedFromOptional: true,
      // Filter out third-party props from node_modules except @mui packages
      propFilter: (prop) =>
        prop.parent ? !/node_modules\//.test(prop.parent.fileName) : true,
    },
  },
  viteFinal: async (config) => {
    if (!config.build) {
      config.build = {};
    }
    config.build.target = [
      "es2022",
      "edge89",
      "firefox89",
      "chrome89",
      "safari15",
    ];
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      resolve(__dirname, "../../../packages/components-sui/src"),
    ];
    return config;
  },
  build: {
    test: {
      disabledAddons: [
        "@storybook/addon-docs",
        "@storybook/addon-essentials/docs",
      ],
    },
  },
};
export default config;
