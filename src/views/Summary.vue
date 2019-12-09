<template>
  <div>
    <div style="margin-bottom:16px;">
      <RangeSelect v-model="dateRange" class="mr-m" />
      <span>{{dateRange.start}} ~ {{dateRange.end}} {{weeksText}}</span>
    </div>
    <SummaryChart :loading="loading" :data="list" :show-content="weeks > 3" style="margin-bottom:16px;" />
    <SummaryTable :loading="loading" :data="list" />
  </div>
</template>

<script>
import { getWeekStart, getWeekEnd, date2text, getDateByText } from '@/util/date.js';
import SummaryTable from '@/components/SummaryTable';
import SummaryChart from '@/components/SummaryChart';
import RangeSelect from '@/components/RangeSelect';

const WEEK_MILLISECONDS = 1000 * 60 * 60 * 24 * 7;
export default {
  name: 'week-summary',
  components: { RangeSelect, SummaryTable, SummaryChart },
  data() {
    return {
      loading: false,
      list: [],
      dateRange: {
        start: date2text(getWeekStart(new Date())),
        end: date2text(getWeekEnd(new Date()))
      }
    };
  },
  computed: {
    user() {
      return this.$store.state.userData;
    },
    weeks() {
      const { start, end } = this.dateRange;
      let s = getDateByText(start);
      let e = getDateByText(end);
      e.setDate(e.getDate() + 1);
      return Math.ceil((e - s) / WEEK_MILLISECONDS) || 0;
    },
    weeksText() {
      if (this.weeks <= 1) return '';
      return `(共${this.weeks}周)`;
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;
      const cond = {
        ...this.dateRange,
        dept: this.user.dept.id
      };
      this.$fetch('api/weeklyLog/weekRange', cond).then(res => {
        if (res.code === 200) {
          this.list = this.dealData(res.data);
        } else {
          this.$Message.error(res.message);
        }

        this.loading = false;
      });
    },
    dealData(data) {
      if (!Array.isArray(data)) return [];

      // 范围一周以上时的 多条记录的合并

      return data.map(item => {
        const name = item.user.name;
        const extInfo = item.user.extInfo;
        const { taskList, communicationList, studyList, taskTime, communicationTime } = item.report;
        const workList = [...taskList, ...communicationList, ...studyList];

        const saturationTime = taskTime + communicationTime;
        
        const standardTime = 40 * 1;
        const saturation = parseFloat((saturationTime / standardTime).toFixed(2));
        

        const obj = {
          id: item.id,
          userId: item.user.id || item.user._id,
          name: name + (extInfo ? `(${extInfo})` : ''),
          week: item.week,
          start: item.startDate,
          end: item.startEnd,
          taskTime: taskTime,
          communicationTime: communicationTime,
          studyTime: item.report.studyTime,
          leaveTime: item.report.leaveTime,
          workList: workList,
          leaveList: item.report.leaveList,

          saturationTime: saturationTime,
          saturation: saturation,
          standardTime: standardTime
        };

        return obj;
      });
    }
  }
};
</script>

<style>
</style>