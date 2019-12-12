<template>
  <Row>
    <i-col  :sm="{span:12}" :xs="{span:24}">
      <ul v-if="row.workList.length">
        <li v-for="item in row.workList" :key="item.id">
          <Tag>{{typeName[item.type]}}</Tag>
          {{item.content}}
          <span v-if="item.showTime">({{item.time}}h)</span>
        </li>
      </ul>
      <span v-else>无</span>
    </i-col>
    <i-col  :sm="{span:12}" :xs="{span:24}">
      <ul v-if="row.leaveList.length">
        <li v-for="item in row.leaveList" :key="item.id">
          {{item.content}}<span v-if="item.showTime">({{item.time}}h)</span>
        </li>
      </ul>
      <span v-else>无</span>
    </i-col>
  </Row>
</template>

<script>
export default {
  name: 'expand-row',
  props: ['row'],
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