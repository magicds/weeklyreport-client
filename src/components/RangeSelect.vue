<template>
  <div>
    <div>
      <Select v-model="rangeType">
        <Option v-for="item in rangeList" :key="item.value" :value="item.value">{{item.text}}</Option>
      </Select>
      <DatePicker v-if="rangeType==='week'" type="daterange" v-model="date" placement="bottom-start" placeholder="请选择一个时间段" :options="weekPreSetting"></DatePicker>
      {{rangeType}}选择
      <Select v-model="rangeValue" v-if="rangeType != 'year' && rangeType != 'week'">
        <OptionGroup v-for="y in optionMap[rangeType]" :key="y.value" :label="y.text">
          <Option v-for="item in y.children" :key="item.value" :value="item.value">{{item.text}}</Option>
        </OptionGroup>
      </Select>
      <Select v-model="rangeValue" v-if="rangeType == 'year'">
        <Option v-for="item in optionMap[rangeType]" :key="item.value" :value="item.value">{{item.text}}</Option>
      </Select>
      <span>{{currentValue}}</span>
    </div>
  </div>
</template>

<script>
import { getWeekStart, getWeekEnd, date2text } from '@/util/date.js';

const monthList = [...new Array(12)].map((_, i) => i + 1);
function getYearMonth(year, startMonth = 0, endMonth = 12) {
  return monthList
    .slice(startMonth, endMonth + 1)
    .map(m => {
      return {
        value: `${year}-${m}`,
        text: `${year}年${m}月`
      };
    })
    .reverse();
}
const qList = [...new Array(4)].map((_, i) => i + 1);
function getYearQuarter(year, startQ = 1, endQ = 4) {
  return qList
    .slice(startQ - 1, endQ)
    .map(q => {
      return {
        value: `${year}-q${q}`,
        text: `${year}年第${q}季度`
      };
    })
    .reverse();
}

function getDateRange(weeks, toPrev) {
  const d = new Date();
  const prev = d.setDate(d.getDate() - 7 * weeks);
  const startDate = getWeekStart(prev);

  const endDate = toPrev ? getWeekEnd(prev) : getWeekEnd(d);

  return [startDate, endDate];
}

export default {
  name: 'range-select',
  props: {
    value: { type: String },

    startDate: {
      type: String,
      default: '2018-01'
    }
  },
  data() {
    return {
      currentText: '',
      rangeValue: '',
      rangeType: 'week',
      rangeList: [
        { value: 'week', text: '周' },
        { value: 'month', text: '月' },
        { value: 'quarter', text: '季度' },
        { value: 'year', text: '年' }
      ],
      date: getDateRange(0, true),
      weekPreSetting: {
        shortcuts: [
          {
            text: '本周',
            value() {
              return getDateRange(0, true);
            }
          },
          {
            text: '上一周',
            value() {
              return getDateRange(1, true);
            }
          },
          {
            text: '前二周',
            value() {
              return getDateRange(2);
            }
          },
          {
            text: '前三周',
            value() {
              return getDateRange(3);
            }
          },
          {
            text: '前三周',
            value() {
              return getDateRange(4);
            }
          }
        ]
      }
    };
  },
  computed: {
    currentValue() {
      if (this.rangeType == 'week') {
        const s = date2text(getWeekStart(this.date[0]));
        const e = date2text(getWeekEnd(this.date[1]));
        // const weeks = 1
        // return `${s}~${e}`;
        return [s, e];
      }
      if (this.rangeType == 'year') {
        const y = parseInt(this.rangeValue, 10);
        if (!y) return [];
        // 获取上一年年底最后最后一周的周日 再往前后一天即为今年第一周的开始
        const lastYearEnd = getWeekEnd(new Date(y - 1, 11, 31));
        lastYearEnd.setDate(lastYearEnd.getDate() + 1);
        const s = date2text(lastYearEnd);
        const e = date2text(getWeekEnd(new Date(y, 11, 31)));
        return [s, e];
      }
      // todo month and quator
      return this.rangeValue;
    },
    configStartYear() {
      return parseInt(this.startDate.split('-')[0], 10) || new Date().getFullYear() - 3;
    },
    configStartMonth() {
      return parseInt(this.startDate.split('-')[1], 10) || 1;
    },
    yearList() {
      const year = new Date().getFullYear();
      return [...new Array(year - this.configStartYear + 1 || 3)].map((_, i) => year - i);
    },
    monthList() {
      const [startYear, sStartMonth] = [this.configStartYear, this.configStartMonth];

      const year = new Date().getFullYear();
      const yearList = this.yearList;

      return yearList.map(y => {
        const pNode = { value: y, text: `${y}年` };
        let endMonth = y == year ? new Date().getMonth() : 11;
        let startMonth = y == startYear ? sStartMonth - 1 : 0;
        pNode.children = getYearMonth(y, startMonth, endMonth);
        return pNode;
      });
    },
    quarterList() {
      const startQ = Math.ceil(this.configStartMonth / 3);
      const endQ = Math.ceil((new Date().getMonth() + 1) / 3);

      const year = new Date().getFullYear();
      const yearList = this.yearList;

      return yearList.map(y => {
        const pNode = { value: y, text: `${y}年` };
        let e = y == year ? endQ : 4;
        let s = y == this.configStartYear ? startQ : 1;
        pNode.children = getYearQuarter(y, s, e);
        return pNode;
      });
    },
    optionMap() {
      return {
        year: this.yearList.map(y => {
          return { value: y, text: `${y}年` };
        }),
        month: this.monthList,
        quarter: this.quarterList
      };
    }
  }
};
</script>

<style>
</style>