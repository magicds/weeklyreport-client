<template>
  <div class="range-select">
    <Select v-model="rangeType" class="range-type-select">
      <Option v-for="item in rangeList" :key="item.value" :value="item.value">{{item.text}}</Option>
    </Select>
    <DatePicker class="range-date-select" v-if="rangeType==='week'" type="daterange" v-model="date" placement="bottom-start" placeholder="请选择一个时间段" :options="weekPreSetting"></DatePicker>
    <Select v-model="rangeValue" v-if="rangeType != 'year' && rangeType != 'week'" class="range-value-select">
      <OptionGroup v-for="y in optionMap[rangeType]" :key="y.value" :label="y.text">
        <Option v-for="item in y.children" :key="item.value" :value="item.value">{{item.text}}</Option>
      </OptionGroup>
    </Select>
    <Select v-model="rangeValue" v-if="rangeType == 'year'" class="range-value-select">
      <Option v-for="item in optionMap[rangeType]" :key="item.value" :value="item.value">{{item.text}}</Option>
    </Select>
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
  const prev = new Date(d).setDate(d.getDate() - 7 * weeks);
  const startDate = getWeekStart(prev);

  const endDate = toPrev ? getWeekEnd(prev) : getWeekEnd(d);

  return [startDate, endDate];
}

export default {
  name: 'range-select',
  props: {
    value: { type: Object },

    startDate: {
      type: String,
      default: '2018-01'
    }
  },
  data() {
    return {
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
            text: '最近二周',
            value() {
              return getDateRange(1);
            }
          },
          {
            text: '最近三周',
            value() {
              return getDateRange(2);
            }
          },
          {
            text: '最近四周',
            value() {
              return getDateRange(3);
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
        return { start: s, end: e };
      }
      let startDate, endDate;
      if (!this.rangeValue) {
        return { start: '', end: '' };
      }

      if (this.rangeType == 'year') {
        const y = parseInt(this.rangeValue, 10);
        if (!y) return [];
        // 获取上一年年底最后最后一周的周日 再往前后一天即为今年第一周的开始
        const lastYearEnd = getWeekEnd(new Date(y - 1, 11, 31));
        lastYearEnd.setDate(lastYearEnd.getDate() + 1);

        startDate = lastYearEnd;
        endDate = getWeekEnd(new Date(y, 11, 31));
      }

      if (this.rangeType == 'month') {
        const [y, m] = this.rangeValue.split('-').map(v => parseInt(v, 10));
        if (!y || !m) return;
        // 1 号为周一 则第一周就是 否则 +7 再取周一才为真的第一种开始
        const firstDate = new Date(y, m - 1, 1);
        if (firstDate.getDay() === 1) {
          startDate = getWeekStart(firstDate);
        } else {
          firstDate.setDate(firstDate.getDate() + 7);
          startDate = getWeekStart(firstDate);
        }
        // 下月一号往前一天及当前月的最后一天
        endDate = getWeekEnd(new Date(y, m, 0));
      }

      if (this.rangeType == 'quarter') {
        const [y, q] = this.rangeValue
          .replace('q', '')
          .split('-')
          .map(v => parseInt(v, 10));
        const ms = (q - 1) * 3;
        const me = q * 3 - 1;

        // 1 号为周一 则第一周就是 否则 +7 再取周一才为真的第一种开始
        const firstDate = new Date(y, ms, 1);
        if (firstDate.getDay() === 1) {
          startDate = getWeekStart(firstDate);
        } else {
          firstDate.setDate(firstDate.getDate() + 7);
          startDate = getWeekStart(firstDate);
        }
        const lastDate = new Date(y, me + 1, 0);

        endDate = getWeekEnd(lastDate);
      }

      return { start: date2text(startDate), end: date2text(endDate) };
    },
    configStartYear() {
      return parseInt(this.startDate.split('-')[0], 10) || new Date().getFullYear() - 3;
    },
    configStartMonth() {
      return parseInt(this.startDate.split('-')[1], 10) || 1;
    },
    yearList() {
      const year = new Date().getFullYear();
      return [...new Array(year - this.configStartYear + 1 || 3)].map((_, i) => year - i + '');
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
  },
  watch: {
    currentValue(v) {
      this.$emit('input', v);
    },
    rangeType(v) {
      if (v == 'week') return;
      if (v == 'year') {
        debugger;
        if (!/^\d{4}$/.test(this.rangeValue)) {
          this.rangeValue = this.yearList[0];
        }
        return;
      }

      if (v == 'month') {
        if (!/^\d{4}-\d{2}$/.test(this.rangeValue)) {
          this.rangeValue = this.monthList[0].children[0].value;
        }
        return;
      }
      if (v == 'quarter') {
        if (!/^\d{4}-q\d$/.test(this.rangeValue)) {
          this.rangeValue = this.quarterList[0].children[0].value;
        }
        return;
      }
    }
  }
};
</script>

<style>
.range-select {
  display: inline-block;
}
.range-type-select {
  width: 70px;
  margin-right: 8px;
}
.range-value-select {
  width: 140px;
}
.range-date-select {
}
</style>