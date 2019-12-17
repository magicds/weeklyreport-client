<template>
  <div>
    <Header :user="user" :ext-items="extItems" :onItemClick="onItemClick" />
    <router-view></router-view>
  </div>
</template>

<script>
import Header from '@/components/Header';
export default {
  components: { Header },
  computed: {
    user() {
      return this.$store.state.userData;
    },
    extItems() {
      if (this.user.role >= 10) {
        return [{ id: 'verify', name: 'verify', text: '未验证用户审核' }];
      } else {
        return [];
      }
    }
  },
  methods: {
    onItemClick(type) {
      if (type == 'logout') {
        return this.logout();
      } else if (type == 'verify' || type == 'userinfo') {
        return this.$router.push({ name: type });
      }
    },
    logout() {
      return this.$fetch('api/user/logout').then(res => {
        if (res.code == 200) {
          this.$store.commit('updateUserData', { data: null });
          this.$router.push('/');
        } else {
          this.$Message.error(res.message);
        }
      });
    }
  }
};
</script>

<style>
</style>