<template>
  <div >
    <ul v-if="data.length" style="padding:8px 0;">
      <li v-for="item in data" :key="item.id">
        <Tag v-if="item.type">{{typeName[item.type]}}</Tag>
        {{item.content}}
        <span v-if="item.showTime">({{item.time}}h)</span>
      </li>
    </ul>
    <span v-else>无</span>
  </div>
</template>

<script>
export default {
  name: 'list-display',
  props: ['data'],
  computed: {
    typeName() {
      return {
        task: '任务',
        communication: '沟通',
        study: '学习',
        leave: '休息'
      };
    }
  }
};
</script>

<style>
</style>