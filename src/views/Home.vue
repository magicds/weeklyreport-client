<template>
  <div class="home-wrap">
    <img alt="Epoint Fe Logo" class="logo" src="../assets/logo.png" />
    <h3>新点前端周报</h3>
    <nav>
      <router-link :to="{ name: 'login'}" class="nav-link">去登录</router-link>
      <router-link :to="{ name: 'signup'}" class="nav-link">去注册</router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'home',
  components: {
    // HelloWorld
  },
  mounted() {
    // this.$router.push('/login');
  }
};
</script>

<style lang="scss">
.logo {
  margin-bottom: 32px;
}
.home-wrap {
  padding-top: 30px;
  margin-left: auto;
  margin-right: auto;
  width: 240px;
  text-align: center;
  nav {
    margin-top: 24px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
