<template>
  <Table class="summary-table" :columns="columns" :data="data" :loading="loading" :class="{'show-content': !showContent}"></Table>
</template>

<script>
import ExpandRow from './ExpandRow';
export default {
  name: 'summary-table',
  components: {
    // eslint-disable-next-line
    ExpandRow
  },
  props: {
    showContent: {
      type: Boolean,
      default: true
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
      columns: [
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
        // { title: '工作内容', key: 'workList' },
        { title: '任务耗时', key: 'taskTime', sortable: true, width: 100 },
        { title: '沟通耗时', key: 'communicationTime', sortable: true, width: 100 },
        { title: '学习耗时', key: 'studyTime', sortable: true, width: 100 },
        { title: '请假耗时', key: 'leaveTime', sortable: true, width: 100 },
        { title: '饱和度', key: 'saturation', sortable: true, width: 100 },
        // { title: '备注', key: 'leaveList' },
        { title: '时间范围', key: 'weekRange' }
      ].map(c => {
        c.className = 'summary-column ' + (c.key || c.type);
        return c;
      })
    };
  },
  computed: {
    contentColums() {
      return this.allColumns.filter(c => {
        return c.key != 'leaveTime' || c.key != 'weekRange';
      });
    },
    summaryColums() {
      return this.allColumns.filter(c => {
        return c.key != 'workList' || c.key != 'leaveList';
      });
    }
  }
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
}
.summary-column .ivu-table-cell {
  padding-left: 8px;
  padding-right: 8px;
}
</style>