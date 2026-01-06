import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "angular",
      bundler: "webpack",
      options: {
        projectConfig: {
          root: '',
          sourceRoot: '',
          buildOptions: {
            outputPath: 'dist/admin',
          }
        }
      }
    },
    specPattern: "**/*.cy.ts",
  },
});
