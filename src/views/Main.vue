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
      if (this.user.role >= 100) {
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
      } else if (type == 'verify') {
        return this.$router.push({ name: 'verify' });
      } else {
        return alert('功能即将上线，请稍后');
      }
    }
  }
};
</script>

<style>
</style>