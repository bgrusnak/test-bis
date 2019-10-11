import Vue from 'vue';
import Router from 'vue-router';
import Accounts from './views/Accounts.vue';
import Days from './views/Days.vue';
import Operations from './views/Operations.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'accounts',
      component: Accounts,
    },
    {
      path: '/days',
      name: 'days',
      component: Days,
    },
    {
      path: '/operations',
      name: 'operations',
      component: Operations,
    },

  ],
});
