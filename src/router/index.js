import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Signup from '../views/Signup.vue';
import ResetPwd from '../views/ResetPwd.vue';
import Main from '../views/Main.vue';
import Input from '../views/Input.vue';
import Summary from '../views/Summary.vue';
import DeptManage from '../views/DeptManage.vue';
import StaffList from '../views/StaffList.vue';
import Verify from '../views/Verify.vue';

Vue.use(VueRouter);

function anonymityAccess(to) {
  return ['signup', 'login', 'home', 'resetpwd'].indexOf(to.name) !== -1;
}
function adminRequired(to, from, next) {
  console.log(store.state);
  const user = store.state.currentUserData;
  next();
  // if (user.level >= 100) {
  //   next();
  // } else {
  //   if (store.state.isLogin) {
  //     alert("您无权限访问此页面");
  //   }
  //   console.error("无权限");
  //   next("/login");
  // }
}
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup
  },
  {
    path: '/resetpwd',
    name: 'resetPwd',
    component: ResetPwd
  },
  {
    path: '/main',
    name: 'main',
    component: Main,
    children: [
      {
        path: 'input',
        name: 'input',
        component: Input
      },
      {
        path: 'summary',
        name: 'summary',
        component: Summary
      },
      {
        path: 'verify',
        name: 'verify',
        component: Verify
      },
      {
        path: 'dept',
        name: 'dept',
        component: DeptManage
      },
      {
        path: 'person',
        name: 'person',
        component: StaffList
      }
      // {
      //   path:'userinfo',
      //   name:'userinfo',
      //   component: UserInfo
      // }
    ]
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});
router.beforeEach((to, from, next) => {
  // 排除无需登录即可进入的页面
  if (anonymityAccess(to)) {
    next();
    return;
  }
  // 登录 要求
  const { userData } = store.state;
  if (userData && userData.id) {
    next();
  } else {
    // 到登录
    next({
      name: 'login',
      params: {
        originPath: to.path
      }
    });
  }
});
export default router;
