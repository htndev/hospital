module.exports = {
  transpileDependencies: ['vuetify'],
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "~@/assets/css/main.sass"'
      }
    }
  }
};
