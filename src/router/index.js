import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Main from "../views/Main.vue";
import Input from "../views/Input.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/login",
    name: "login",
    component: Home
  },
  {
    path: "/signup",
    name: "signup",
    component: Home
  },
  {
    path: "/resetPwd",
    name: "resetPwd",
    component: Home
  },
  {
    path: "/main",
    name: "main",
    component: Main,
    children: [
      {
        path: "input",
        name: "input",
        component: Input
      }
      // {
      //   path:'summary',
      //   name:'summary',
      //   component: Summary
      // }
      // ,
      // {
      //   path:'dept',
      //   name:'dept',
      //   component: DeptManage
      // },
      // {
      //   path:'userinfo',
      //   name:'userinfo',
      //   component: UserInfo
      // }
    ]
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
