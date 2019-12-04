<template>
  <Modal></Modal>
</template>

<script>
export default {
  name:'department-editor',
  props:{
    deptData:{
      type:Object,
      default: ()=>{
        return {
          name: '',
          leaderId: '',
          note: ''
        }
      }
    }
  },
  data() {
    return {
      
    }
  }
};
</script>

<style>
</style>