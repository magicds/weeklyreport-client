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
      },
      userList: []
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
    this.getUserList().then(() => {
      this.getData();
    });
  },
  methods: {
    getUserList() {
      this.loading = true;
      return this.$fetch(`api/user/list?dept=${this.user.dept.id}`).then(res => {
        if (res.code == 200) {
          this.userList = res.data.map(u => {
            const extInfo = u.extInfo;
            return {
              id: u.id,
              name: u.name + (extInfo ? `(${extInfo})` : ''),
              groupId: u.group._id,
              groupName: u.group.name,
              deptId: u.dept._id,
              deptName: u.dept.name,
              reports: []
            };
          });
        } else {
          console.error(res.message);
        }
      });
    },
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

      const userList = JSON.parse(JSON.stringify(this.userList));

      // 范围一周以上时的 多条记录的合并
      const logMap = {};
      data.forEach(item => {
        const uid = item.user.id || item.user._id;
        if (!uid) return;
        if (!logMap[uid]) {
          logMap[uid] = [item];
        } else {
          logMap[uid].push(item);
        }
      });

      userList.forEach(u => {
        const uid = u.id;
        const reports = logMap[uid];

        let summaryReport = {};
        // 未填
        if (!reports || !reports.length) {
          summaryReport = {
            week: '',
            // start: item.startDate,
            // end: item.startEnd,
            taskTime: 0,
            communicationTime: 0,
            studyTime: 0,
            leaveTime: 0,
            workList: [],
            leaveList: [],

            saturationTime: 0,
            saturation: 0,
            standardTime: 40
          };
        } else {
          const report = reports[0].report;
          const { taskList, communicationList, studyList } = report;
          const workList = [...taskList, ...communicationList, ...studyList];
          const leaveList = [...report.leaveList];

          let taskTime = report.taskTime;
          let communicationTime = report.communicationTime;
          let studyTime = report.studyTime;
          let leaveTime = report.leaveTime;

          let saturationTime = taskTime + communicationTime;

          // todo 应从工作日中获取
          let standardTime = 40;

          reports.slice(1).forEach(it => {
            const r = it.report;
            workList.push(...r.taskList, ...r.communicationList, ...r.studyList);
            leaveList.push(...r.leaveList);

            taskTime += r.taskTime;
            communicationTime += r.communicationTime;
            studyTime += r.studyTime;
            leaveTime += r.leaveTime;

            saturationTime += r.taskTime + r.communicationTime;
            leaveTime += r.leaveTime;
            // todo 应从工作日中获取
            standardTime += 40;
          });
          const saturation = saturationTime / standardTime;
          summaryReport = {
            workList,
            leaveList,

            taskTime,
            communicationTime,
            studyTime,
            leaveTime,

            saturationTime,
            standardTime,
            saturation
          };
        }

        Object.keys(summaryReport).forEach(k => {
          u[k] = summaryReport[k];
        });
      });
      console.log(userList);
      return userList;
    }
  }
};
</script>

<style>
</style>