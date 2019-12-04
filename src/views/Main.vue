<template>
  <div>
    <Header :user="user" />
    <router-view></router-view>
  </div>
</template>

<script>
import Header from '@/components/Header'
export default {
  components: {Header},
  computed:{
    user() {
      return this.$store.state.userData
    }
  }
}
</script>

<style>

</style>