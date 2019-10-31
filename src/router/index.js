import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Snake from '../games/Snake.vue';
import Slither from '../games/Slither.vue';
import Paper from '../games/Paper.vue';
import SpaceInvaders from '../games/SpaceInvaders.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/snake',
    name: 'snake',
    component: Snake,
  },
  {
    path: '/slither',
    name: 'slither',
    component: Slither,
  },
  {
    path: '/spaceinvaders',
    name: 'spaceinvaders',
    component: SpaceInvaders,
  },
  {
    path: '/paper',
    name: 'paper',
    component: Paper,
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
