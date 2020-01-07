import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/streamer",
      name: "streamer",
      component: () =>
        import(/* webpackChunkName: "streamer" */ "./views/Streamer.vue")
    },
    {
      path: "/:room",
      name: "receiver",
      component: () =>
        import(/* webpackChunkName: "receiver" */ "./views/Receiver.vue")
    }
  ]
});
