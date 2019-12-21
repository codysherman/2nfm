module.exports = {
  lintOnSave: false,
  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/assets/sass/global-setup.sass"',
      },
    },
  },
};
