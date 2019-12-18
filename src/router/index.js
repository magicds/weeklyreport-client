import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Main from '../views/Main.vue';
import Input from '../views/Input.vue';
import Summary from '../views/Summary.vue';

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
  if (user && user.role >= 100) {
    
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
    // component: Signup
    component: () => import(/* webpackChunkName: "Signup" */ '../views/Signup.vue')
  },
  {
    path: '/resetPwd',
    name: 'resetPwd',
    // component: ResetPwd
    component:  () => import(/* webpackChunkName: "resetPwd" */ '../views/ResetPwd.vue')
  },
  {
    path: '/setNewPwd',
    name: 'setNewPwd',
    component: () => import(/* webpackChunkName: "resetPwd" */ '../views/SetNewPwd.vue')
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
        // component: Verify,
        component: () => import(/* webpackChunkName: "admin" */ '../views/Verify.vue'),
        beforeEnter: biggerThanGroup
      },
      {
        path: 'dept',
        name: 'dept',
        // component: DeptManage,
        component: () => import(/* webpackChunkName: "admin" */ '../views/DeptManage.vue'),
        beforeEnter: biggerThenDept
      },
      {
        path: 'person',
        name: 'person',
        // component: StaffList,
        component: () => import(/* webpackChunkName: "admin" */ '../views/StaffList.vue'),
        beforeEnter: biggerThanGroup
      },
      {
        path: 'userinfo',
        name: 'userinfo',
        // component: UserInfo
        component: () => import(/* webpackChunkName: "userInfo" */ '../views/UserInfo.vue')
      }
    ]
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
