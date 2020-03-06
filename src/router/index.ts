import Vue from 'vue';
import { Store } from 'vuex';
import VueRouter, { RouteConfig } from 'vue-router';
// @ts-ignore
import Home from '@/views/Home';
// @ts-ignore
import Authorization from '@/views/Authorization';
import store from '@/store';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: false,
      adminAccess: false
    }
  },
  {
    path: '/about',
    name: 'About',
    // @ts-ignore
    component: () => import(/* webpackChunkName: "about" */ '@/views/About'),
    meta: {
      requiresAuth: false,
      adminAccess: false
    }
  },
  {
    path: '/auth',
    name: 'Authorization',
    redirect: '/auth/login',
    component: Authorization,
    meta: {
      requiresAuth: false,
      adminAccess: false
    },
    children: [
      {
        path: 'login',
        name: 'Login',
        // @ts-ignore
        component:  () => import(/* webpackChunkName: "login" */ '@/views/Login'),
        meta: {
          requiresAuth: false,
          adminAccess: false
        }
      },
      {
        path: 'register',
        name: 'Register',
        // @ts-ignore
        component: () => import(/* webpackChunkName: "register" */ '@/views/Register'),
        meta: {
          requiresAuth: false,
          adminAccess: false
        }
      }
    ]
  },
  {
    path: '/services',
    name: 'Services',
    // @ts-ignore
    component: () => import(/* webpackChunkName: "register" */ '@/views/Services'),
    meta: {
      requiresAuth: false,
      adminAccess: false
    }
  },
  {
    path: '/doctors',
    name: 'doctors',
    // @ts-ignore
    component: () => import(/* webpackChunkName: "register" */ '@/views/Doctors'),
    meta: {
      requiresAuth: false,
      adminAccess: false
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    // @ts-ignore
    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard'),
    meta: {
      requiresAuth: true,
      adminAccess: true
    }
  },
  {
    path: '*',
    name: 'Page Not Found',
    // @ts-ignore
    component: () => import(/* webpackChunkName: "not-found" */ '@/views/NotFound'),
    meta: {
      requiresAuth: false,
      adminAccess: false
    }
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if(to.meta.requiresAuth) {
    const isAuthenticated = (store as Store<any>).getters.isUserAuthenticated;

    if(isAuthenticated) {
      console.log('Authed');
    } else {
      console.log('Not authed');
      next('/');
    }
  }
  else {
    next();
  }
});

export default router;
