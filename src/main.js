import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

import ViewUI from "view-design";
import "view-design/dist/styles/iview.css";
Vue.use(ViewUI);

Vue.config.productionTip = false;

// 全局过滤器
Vue.filter("toInt", function(v = "") {
  return parseInt(v.toFixed(0), 10);
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

