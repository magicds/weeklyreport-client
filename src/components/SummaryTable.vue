<template>
  <div>

  </div>
</template>

<script>
export default {
name:'summary-table',
props: {
  showContent: {
    type:Boolean,
    default: true
  },
  loading: {
    type:Boolean,
    default:false
  },
  data:{
    type:Array,
    default: () => []
  }
}
}
</script>

<style>

</style>