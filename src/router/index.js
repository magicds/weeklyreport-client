import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";
import ResetPwd from "../views/ResetPwd.vue";
import Main from "../views/Main.vue";
import Input from "../views/Input.vue";
import Summary from "../views/Summary.vue";

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
    component: Login
  },
  {
    path: "/signup",
    name: "signup",
    component: Signup
  },
  {
    path: "/resetpwd",
    name: "resetPwd",
    component: ResetPwd
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
      },
      {
        path:'summary',
        name:'summary',
        component: Summary
      }
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
