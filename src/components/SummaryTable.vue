<template>
  <Table class="summary-table" :columns="weeks > 1 ? column2 : column1" :data="data" :loading="loading" :class="{'show-content': weeks > 1}">
    <template slot-scope="{ row }" slot="percent">
      <div :style="'color:' + rate2color(row.saturation * 100)">{{row.saturation | toPercent}}</div>
    </template>
    <template slot-scope="{ row }" slot="workList">
      <ListDisplay :data="row.workList" />
    </template>
    <template slot-scope="{ row }" slot="leaveList">
      <ListDisplay :data="row.leaveList" />
    </template>
  </Table>
</template>

<script>
import ExpandRow from './ExpandRow';
import ListDisplay from './ListDisplay';

import rate2color from '@/util/rate2color.js';

export default {
  name: 'summary-table',
  components: {
    // eslint-disable-next-line
    ExpandRow,
    ListDisplay
  },
  props: {
    weeks: {
      type: Number,
      default: 1
    },
    loading: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      column1: [
        { title: '姓名', key: 'name', sortable: true, width: 90 },
        { title: '工作内容', key: 'workList', slot: 'workList' },
        { title: '任务耗时', key: 'taskTime', sortable: true, width: 100 },
        { title: '沟通耗时', key: 'communicationTime', sortable: true, width: 100 },
        { title: '学习耗时', key: 'studyTime', sortable: true, width: 100 },
        { title: '饱和度', key: 'saturation', sortable: true, width: 100, slot: 'percent' },
        { title: '备注', key: 'leaveList', slot: 'leaveList' }
      ].map(c => {
        c.className = 'summary-column ' + (c.key || c.type);
        return c;
      }),
      column2: [
        {
          type: 'expand',
          slot: 'content',
          width: 50,
          render: (h, { row }) => {
            return h(ExpandRow, {
              props: { row }
            });
          }
        },
        { title: '姓名', key: 'name', sortable: true, width: 90 },
        { title: '任务耗时', key: 'taskTime', sortable: true, width: 100 },
        { title: '沟通耗时', key: 'communicationTime', sortable: true, width: 100 },
        { title: '学习耗时', key: 'studyTime', sortable: true, width: 100 },
        { title: '请假耗时', key: 'leaveTime', sortable: true, width: 100 },
        { title: '饱和度', key: 'saturation', sortable: true, width: 100, slot: 'percent' },
        { title: '时间范围', key: 'weekRange' }
      ].map(c => {
        c.className = 'summary-column ' + (c.key || c.type);
        return c;
      })
    };
  },
  methods: { rate2color }
};
</script>

<style lang="scss">
.summary-table {
  // .summary-column.workList,
  // .summary-column.leaveList {
  //   display: none;
  // }
  // &.show-content {

  // }
  .ivu-table-expanded-cell {
    background: #fcfcfc;
  }
}
.summary-column .ivu-table-cell {
  padding-left: 8px;
  padding-right: 8px;
}
</style>