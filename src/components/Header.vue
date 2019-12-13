<template>
  <nav class="header">
    <div class="left">
      <router-link :to="{ name: 'input'}" class="nav-link" v-if="!user.noReport">周报填写</router-link>
      <router-link :to="{ name: 'summary'}" class="nav-link">周报汇总</router-link>
      <router-link :to="{ name: 'dept'}" class="nav-link" v-if="user.role >= 10">部门管理</router-link>
      <router-link :to="{ name: 'person'}" class="nav-link" v-if="user.role >= 10">人员管理</router-link>
    </div>

    <UserIcon class="header-user-icon" :data="user" :ext-items="extItems" :onItemClick="onItemClick" />
  </nav>
</template>

<script>
import UserIcon from './UserIcon.vue';
export default {
  name: 'header-nav',
  components: {
    UserIcon
  },
  props: {
    user: Object,
    extItems: {
      type: Array,
      default: () => []
    },
    onItemClick: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss">
.header {
  height: 38px;
  margin-bottom: 10px;
  margin-top: 10px;
  border-bottom: 1px solid #ddd;

  &:after {
    display: table;
    clear: both;
    content: '';
  }
  .left {
    line-height: 37px;
    float: left;
    height: 38px;
  }
  .right {
    float: right;
  }
  .nav-link {
    display: block;
    float: left;
    margin-bottom: -1px;
    padding: 0 15px;
    border: 1px solid transparent;
    border-bottom: none;
    border-radius: 4px 4px 0 0;
    text-decoration: none;
    color: #353535;
  }
  .nav-link:hover {
    text-decoration: none;
    color: #2d8cf0;
  }
  .router-link-exact-active.router-link-active {
    border-color: #ddd;
    background: #fff;
    color: #2d8cf0;
  }
  .ivu-avatar {
    background: #2d8cf0;
  }
}

.header-user-icon {
  float: right;
}
</style>