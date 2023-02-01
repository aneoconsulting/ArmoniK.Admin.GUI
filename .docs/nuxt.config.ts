export default defineNuxtConfig({
  app: {
    baseURL: process.env.NODE_ENV === "production" ? "/ArmoniK.Admin.GUI/" : "",
  },

  extends: "@aneoconsultingfr/armonik-docs-theme",
});
