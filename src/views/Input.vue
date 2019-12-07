<template>
  <div class="person-input">
    <Alert type="error" class="header-alert">
      <p>请大家每周五下班前按要求填写周报，若每月有3次未按要求填写周报，考虑月浮动奖罚，以做规范手段。</p>
      <p>周报的目的：</p>
      <ol class="weekly-aims">
        <li>
          <p>对自己本周工作进行一个如实总结。</p>
        </li>
        <li>
          <p>方便部门管理者、各小组负责人了解团队的整体运行情况。</p>
        </li>
      </ol>
      <p>请大家跳出自我的角度，多从管理者的角度、团队的角度考虑问题，就能理解其中的必要性。</p>
    </Alert>

    <fieldset v-if="user.name">
      <legend>基本信息</legend>
      <div class="user-info">
        <span>{{user.dept.name || ''}} - {{user.group.name || ''}} - {{user.name}}</span>
        <span>周报日期：{{dateRangeText}}</span>
      </div>
    </fieldset>

    <i-form :model="data" :rules="relues" label-position="top" ref="form">
      <fieldset>
        <legend>工作内容</legend>

        <FormItem label="类型" style="margin-top:10px; margin-bottom:0px;">
          <RadioGroup v-model="type">
            <Radio :key="item.key" :label="item.key" v-for="item in types">
              <span>{{item.text}}</span>
            </Radio>
          </RadioGroup>
        </FormItem>

        <alert class="type-info">
          <ul>
            <li :class="item.key == type ? 'light' : ''" :key="item.key" v-for="item in types">{{item.text}}：{{item.info}}</li>
          </ul>
        </alert>

        <!-- <div class="title">{{currType.text}}</div> -->
        <FormItem :label="currType.text" prop="content">
          <i-input :rows="4" element-id="content-input" placeholder="请输入内容，回车将被自动分割为多条" type="textarea" v-model="data.content"></i-input>
        </FormItem>

        <div class="content-info">{{currType.explain}}</div>

        <FormItem :label="timeLabel.title" prop="time">
          <InputNumber :max="100" :min="0.1" :step="1" v-model="data.time" style="width:100%"></InputNumber>
        </FormItem>

        <Button @click="addItem" type="primary">添加并重置</Button>
      </fieldset>
    </i-form>

    <fieldset>
      <legend>事项列表</legend>
      <i-table :columns="tableColumns" :data="reportList"></i-table>
    </fieldset>

    <fieldset>
      <legend>汇总</legend>

      <table class="table table-bordered vertical-middle">
        <thead>
          <tr>
            <th style="width:120px;">姓名</th>
            <th>工作内容</th>
            <th style="width:80px;">任务耗时</th>
            <th style="width:80px;">学习耗时</th>
            <th style="width:80px;">沟通耗时</th>
            <th>其他</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{user.name || ''}}</td>
            <td>
              <ul>
                <li :key="item.id" v-for="item in workList">
                  {{item.content}}
                  <span v-if="item.showTime">（{{item.time}}小时）</span>
                </li>
              </ul>
            </td>
            <td>{{taskTime | toInt}}</td>
            <td>{{studyTime | toInt}}</td>
            <td>{{communicationTime | toInt}}</td>
            <td>
              <ul v-if="leaveList.length">
                <li :key="item.id" v-for="item in leaveList">
                  {{item.content}}
                  <span v-if="item.showTime">（{{item.time}}小时）</span>
                </li>
              </ul>
              <span v-else>无</span>
            </td>
          </tr>
        </tbody>
      </table>

      <Button :disabled="reportList.length < 1" :loading="isSaving" @click="addToCloud" type="primary">提交到云端</Button>
    </fieldset>
  </div>
</template>

<script>
const config = {
  // 类型分类
  types: [
    {
      key: 'task',
      text: '实际任务',
      title: '任务描述',
      info: '能够获取到外部预算的开发任务，任务跟进过程中的沟通工作也包括在内。',
      explain:
        '请填写任务名称，并简要说明任务的进展情况，如存在风险，请一并说明。如：招投标大数据平台页面开发，涉及大量图表，部分页面需求还在变更，确定的已完成80%，暂无风险。'
    },
    {
      key: 'communication',
      text: '沟通管理',
      info: '主要针对团队内部的沟通管理工作，包括：工作督导、人员安排、代码评审等。',
      title: '沟通内容',
      explain: '请填写沟通内容，如：评审某某的代码，形成评审纪要，并沟通明确整改。'
    },
    {
      key: 'study',
      text: '学习研究',
      info: '在自身工作有余力的情况下，进行的自我学习和技术研究，也包括新人的练习与学习。',
      title: '学习内容',
      explain: '请填写学习内容，如：学习handlebars模版引擎，并进行实践。'
    },
    {
      key: 'leave',
      text: '请假调休',
      info: '能确有急事请假 或者 正常调休。',
      title: '请假说明',
      explain: '请如实填写请假缘由，如：近期加班较多，目前手头任务可控，调休一天，自我调节。'
    }
  ],
  // 默认的类型
  defaultType: 'task',
  // 时间描述说明
  time: {
    title: '所花时间',
    info: '不要求完全精确，分秒不差，但尽可能客观，不要虚报注水。',
    explain: '请填写该事项所花费的时间，如果周末有加班时间，可以预先填报。'
  },
  // 每周基准工作时间
  fullTime: 40,
  // 计算为任务饱和度的工作类型 值为类型配置中的key
  saturationTyps: ['task', 'communication']
};

import { getWeekDate, getWeekDateText } from '@/util/date.js';

// 从输入的内容中分隔出多条
function getItems(content) {
  let items = content.split(/\n|\r|\r\n/);
  for (var i = items.length - 1; i > 0; --i) {
    if (items[i].trim() === '') {
      items.splice(i, 1);
    }
  }
  return items;
}

const MILLI_SECONDS = (2000 - 1970) * 365 * 24 * 60 * 60 * 1000;

export default {
  data() {
    return {
      date: new Date(),
      type: config.defaultType,
      types: config.types,
      timeLabel: config.time,
      data: {
        content: '',
        time: 0
      },
      taskList: [],
      studyList: [],
      communicationList: [],
      leaveList: [],
      itemId: 1,
      relues: {
        content: [
          {
            required: true,
            message: '请输入任务描述',
            trigger: 'blur'
          }
        ],
        time: [
          {
            required: true,
            type: 'number',
            message: '必须输入花费时间',
            trigger: 'blur',
            min: 0.1
          }
        ]
      },
      tableColumns: [
        {
          title: '工作内容',
          key: 'content'
        },
        {
          title: '类型',
          width: 140,
          key: 'typeText'
        },
        {
          title: '时间',
          key: 'time',
          width: 100,
          render: (h, params) => {
            if (params.row.showTime) {
              return h('span', params.row.time);
            } else {
              return h('span', '--');
            }
          }
        },
        {
          title: '操作',
          width: 120,
          render: (h, params) => {
            return h('div', [
              // prettier-ignore
              h('a', { props: { type: 'normal', size: 'small' }, style: { marginRight: '5px' }, on: {click: () => {this.editItem(params.row, params.index);} } }, '编辑'),
              // prettier-ignore
              h('a', { props: { type: 'danger', size: 'small' }, on: { click: () => {  this.deleteItem(params.row, params.index);} } },'删除')
            ]);
          }
        }
      ],
      isSaving: false
    };
  },
  computed: {
    user() {
      return this.$store.state.userData;
    },
    dateRange() {
      return getWeekDate(this.date);
    },
    dateRangeText() {
      return getWeekDateText(this.date);
    },
    currType() {
      return this.types.filter(item => item.key === this.type)[0];
    },
    taskTime() {
      let time = 0;
      this.taskList.forEach(task => {
        time += task.time;
      });
      return time;
    },
    studyTime() {
      let time = 0;
      this.studyList.forEach(study => {
        time += study.time;
      });
      return time;
    },
    communicationTime() {
      let time = 0;
      this.communicationList.forEach(communication => {
        time += communication.time;
      });
      return time;
    },
    leaveTime() {
      let time = 0;
      this.leaveList.forEach(leave => {
        time += leave.time;
      });
      return time;
    },
    workList() {
      return this.taskList.concat(this.studyList, this.communicationList);
    },
    reportList() {
      return this.workList.concat(this.leaveList);
    }
  },
  watch: {
    currType() {
      this.relues.content[0].message = '请输入' + this.currType.title;
      this.$refs.form.validate();
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getItemIndex() {
      return (+new Date() - MILLI_SECONDS).toString(16) + '-' + (Math.random() * 10000).toString(16);
    },
    getData() {
      return this.$fetch('api/weeklyLog/week', {
        week: this.dateRangeText,
        user: this.user.id
      }).then(res => {
        if (res.code != 200) {
          return;
        }
        if (res.data && res.data.length) {
          this.$Message.config({
            top: window.innerHeight * 0.4
          });
          this.$Message.info({
            content: '本周已经填写，已经为您自动还原数据，您可进一步修改',
            closable: true,
            duration: 5
          });
          this.$Message.config({
            top: 50
          });

          const data = res.data[0];
          const report = data.report;

          this.taskList = report.taskList;
          this.studyList = report.studyList;
          this.leaveList = report.leaveList;
          this.communicationList = report.communicationList;
        }
      });
    },
    addItem() {
      this.$refs.form.validate(isValidated => {
        // 验证通过才处理
        if (isValidated) {
          let items = getItems(this.data.content);
          let length = items.length;
          let showTime = length > 1 ? false : true;

          items.forEach(item => {
            this[this.currType.key + 'List'].push({
              id: this.getItemIndex(),
              type: this.currType.key,
              typeText: this.currType.text,
              content: item,
              showTime,
              time: parseFloat(this.data.time / length)
            });
          });

          this.data.content = '';
          this.data.time = 0;
        }
      });
    },
    deleteItem(row, index) {
      this[row.type + 'List'].splice(index, 1);
    },
    editItem(row, index) {
      if (this.data.content.trim() || this.data.time) {
        this.$Message.warning('请先处理当前正在输入的内容');
        return;
      }

      let currData = this[row.type + 'List'].splice(index, 1)[0];

      console.log(currData);
      this.type = currData.type;
      this.data.content = currData.content;
      this.data.time = currData.time;
    },
    addToCloud() {
      if (!this.reportList.length) {
        return this.$Message.error('你还未填写！');
      }
      this.isSaving = true;
      try {
        const saveData = {
          week: this.dateRangeText,
          user: this.user.id,
          group: this.user.group.id,
          dept: this.user.dept.id,
          report: {
            taskList: this.taskList,
            studyList: this.studyList,
            leaveList: this.leaveList,
            communicationList: this.communicationList,
            taskTime: this.taskTime,
            studyTime: this.studyTime,
            communicationTime: this.communicationTime,
            leaveTime: this.leaveTime
          }
        };

        this.$fetch('api/weeklyLog/addOrUpdate', saveData).then(res => {
          if (res.code === 200) {
            this.$Message.success('保存成功');
          } else {
            console.error(res.message);
            this.$Message.error(res.message);
          }
          this.isSaving = false;
        });
      } catch (error) {
        this.$Message.error(error.message);
        this.isSaving = false;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.person-input {
  line-height: 2;

  .ivu-alert {
    line-height: 2;
  }
}
.header-alert {
  color: #ed4014;
  line-height: 2;
}
.type-info .light {
  color: #000;
  font-weight: 700;
}
ol,
ul {
  padding-left: 24px;
}
fieldset {
  border: 0;
  margin-top: 24px;
}
legend {
  margin-bottom: 8px;
}

.user-info {
  display: flex;
  span + span {
    margin-left: 24px;
  }
}
</style>