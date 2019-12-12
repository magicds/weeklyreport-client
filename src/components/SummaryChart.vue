<template>
  <div class="summary-chart">
    <div class="chart-loading" v-show="loading">
      <div class="ivu-spin ivu-spin-large ivu-spin-fix">
        <div class="ivu-spin-main">
          <span class="ivu-spin-dot"></span>
          <div class="ivu-spin-text">加载中</div>
        </div>
      </div>
    </div>
    <!-- <div ref="person-charts" style="width:100%;height:400px;margin-bottom:16px"></div>
    <div ref="group-charts" style="width:100%;height:300px;"></div>-->
    <v-chart autoresize :options="personOpt" style="width:100%;height:400px;margin-bottom:16px" />
    <!-- <v-chart :options="groupOpt" style="width:100%;height:300px;" /> -->
  </div>
</template>

<script>
import ECharts from 'vue-echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/markLine';

function getMax(list) {
  let max = 0;
  let maxIndex = -1;
  list.forEach((r, i) => {
    if (r > max) {
      max = r;
      maxIndex = i;
    }
  });
  return [max, maxIndex];
}

export default {
  components: {
    'v-chart': ECharts
  },
  props: {
    data: { type: Array, default: () => [] },
    loading: { type: Boolean }
  },
  data() {
    return {};
  },
  computed: {
    personOpt() {
      const names = [];
      const rates = [];
      const userInfoMap = {};
      this.data.forEach(item => {
        names.push(item.name);
        rates.push(item.saturation);

        userInfoMap[item.name] = item;
      });

      // 记录最大值 以备在markline上显示
      const [maxRate, maxIndex] = getMax(rates);
      const maxNameMap = { [maxRate]: names[maxIndex] };

      return {
        title: {
          text: '成员工作饱和度',
          show: true,
          textStyle: {
            color: '#333',
            fontWeight: 'normal',
            fontSize: 16,
            // fontFamily:'"Helvetica Neue",Helvetica,Tahoma,Arial,"Microsoft Yahei","Hiragino Sans GB","WenQuanYi Micro Hei",sans-serif;'
            fontFamily: 'Microsoft Yahei'
          }
        },
        tooltip: {
          // trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function(data) {
            let item = data instanceof Array ? data[0] : data;
            const v = (item.value * 100).toFixed(0);
            if (item.componentType == 'markLine') {
              let personName = maxNameMap[item.value];
              let prefix = personName ? item.name + '<br/>' + personName : item.name;
              return prefix + ': ' + v + '%';
            }
            const { saturationTime, standardTime } = userInfoMap[item.name];
            const addTime = saturationTime - standardTime;

            return [
              // prettier-ignore
              item.marker + item.name + '<br/>' + item.seriesName + ': ' + v + '%',
              // prettier-ignore
              `<br>工作总时间：${saturationTime}h`,
              `<br> 标准工作时间：${standardTime}h`,
              addTime > 0 ? `<br> 加班时间：${addTime}h` : '',
            ].join('');
          }
        },
        grid: {
          left: 50,
          right: 50,
          bottom: 80
        },
        toolbox: {},
        xAxis: {
          type: 'category',
          // name: '姓名',
          nameRotate: 10,
          axisTick: {
            alignWithLabel: true //坐标轴刻度与标签对齐
          },
          axisLabel: {
            interval: 0,
            rotate: 60
          },
          data: names
        },
        yAxis: {
          axisLabel: {
            // formatter: '{value * 100} %'
            formatter: function(value) {
              return (value * 100).toFixed(0) + '%';
            }
          }
        },
        series: [
          {
            name: '工作饱和度',
            type: 'bar',
            data: rates,
            markLine: {
              symbol: ['circle', 'circle'],
              // symbolSize: [0, 0, 0, 0],
              data: [
                {
                  name: '平均值工作饱和度',
                  type: 'average',
                  valueIndex: 1,
                  valueDim: 'x',
                  lineStyle: {
                    type: 'solid'
                  },
                  label: {
                    // position: 'middle',
                    formatter: function(v) {
                      return (v.value * 100).toFixed(0) + '%';
                    }
                  }
                },
                {
                  name: '最高工作饱和度',
                  type: 'max',
                  valueIndex: 1,
                  lineStyle: {
                    type: 'dashed'
                  },
                  label: {
                    // position: 'middle',
                    formatter: function(v) {
                      return (v.value * 100).toFixed(0) + '%';
                    }
                  }
                }
              ]
            },
            barMinHeight: 10,
            barMaxWidth: 50,
            label: {
              normal: {
                show: true,
                position: 'top',
                formatter: function(item) {
                  return (item.data * 100).toFixed(0) + '%';
                }
              }
            },
            itemStyle: {
              normal: {
                color: function(item) {
                  let rate = item.data * 100;
                  if (rate >= 140) {
                    return '#ea644a';
                  }
                  if (rate > 120) {
                    return '#f1a325';
                  }
                  if (rate > 90) {
                    return '#38b03f';
                  }
                  if (rate >= 70) {
                    return '#f1a325';
                  } else {
                    return '#ea644a';
                  }
                }
              }
            },
            animationDelay: 100,
            animationDurationUpdate: function(idx) {
              return idx * 30;
            }
          }
        ],
        animationEasing: 'easeOut',
        animationDelayUpdate: function(idx) {
          return idx * 15;
        }
      };
    }
  },
  methods: {}
};
</script>

<style>
.summary-chart {
  position: relative;
}
.chart-loading {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
</style>