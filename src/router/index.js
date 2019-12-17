import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Signup from '../views/Signup.vue';
// import ResetPwd from '../views/ResetPwd.vue';
import Main from '../views/Main.vue';
import Input from '../views/Input.vue';
import Summary from '../views/Summary.vue';
import DeptManage from '../views/DeptManage.vue';
import StaffList from '../views/StaffList.vue';
import Verify from '../views/Verify.vue';
import UserInfo from '../views/UserInfo.vue';

Vue.use(VueRouter);

function anonymityAccess(to) {
  return ['signup', 'login', 'home', 'resetPwd', 'setNewPwd'].indexOf(to.name) !== -1;
}
function biggerThanGroup(to, from, next) {
  console.log('admin check 1');
  const user = store.state.userData;
  // next();
  if (user && user.role >= 10) {
    next();
  } else {
    alert('无权限');
    next('/login');
  }
}
function biggerThenDept(to, from, next) {
  console.log('admin check 2');
  const user = store.state.userData;
  // next();
  if (user && user.role >= 10) {
    
    next();
  } else {
    alert('无权限');
    next('/login');
  }
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
    path: '/resetPwd',
    name: 'resetPwd',
    // component: ResetPwd
    component:  () => import(/* webpackChunkName: "slide" */ '../views/ResetPwd.vue')
  },
  {
    path: '/setNewPwd',
    name: 'setNewPwd',
    component: () => import(/* webpackChunkName: "slide" */ '../views/SetNewPwd.vue')
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
        component: Verify,
        beforeEnter: biggerThanGroup
      },
      {
        path: 'dept',
        name: 'dept',
        component: DeptManage,
        beforeEnter: biggerThenDept
      },
      {
        path: 'person',
        name: 'person',
        component: StaffList,
        beforeEnter: biggerThanGroup
      },
      {
        path: 'userinfo',
        name: 'userinfo',
        component: UserInfo
      }
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
