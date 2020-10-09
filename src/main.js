import Vue from 'vue';
import App from './App.vue';
import router from './router';
import VueMeta from 'vue-meta';

// import store from './store';

Vue.config.productionTip = false;

Vue.use(VueMeta);

new Vue({
  router,
  // store,
  created() {
    if (sessionStorage.redirect) {
      const redirect = sessionStorage.redirect;
      delete sessionStorage.redirect;
      this.$router.push(redirect);
    }
  },
  render: (h) => h(App),
}).$mount('#app');