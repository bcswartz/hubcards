import Vue from 'vue'
import Router from 'vue-router'
import Cards from "./views/Cards";
import Settings from "./views/Settings";
import Setup from "./views/Setup";
import Login from "./views/Login";
import Card from "./views/Card";
import CreateAppUser from "./views/CreateAppUser";
import UserAccount from "./views/UserAccount";

Vue.use( Router );

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Cards
    },
    {
      path: '/cards',
      name: 'cards',
      component: Cards
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    },
    {
      path: '/setup',
      name: 'setup',
      component: Setup
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/card',
      name: 'newCard',
      component: Card
    },
    {
      path: '/card/:id',
      name: 'card',
      component: Card
    },
    {
      path: '/create-app-user',
      name: 'createAppUser',
      component: CreateAppUser
    },
    {
      path: '/user-account',
      name: 'userAccount',
      component: UserAccount
    }
  ]
})
