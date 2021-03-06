import Vue from 'vue';
import ElementUI from 'element-ui';
Vue.use(ElementUI);

import App from './App.vue';
import router from './router';
import store from './store/index';
import './registerServiceWorker';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
