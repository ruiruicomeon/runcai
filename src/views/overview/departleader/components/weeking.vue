<template>
  <div>
    <div class="tl-card-panel">
      <div class="card-panel-inside">
        <div class="card-panel-head">
          <div class="panner-title">
            <em>OKR信心指数统计</em>
            <span v-show="testModel">示例数据</span>
          </div>
        </div>
        <div class="card-panel-body">
          <div id="week-depart" v-if="orgTable.length > 0"></div>
          <div class="tl-card-panel no-data" style="box-shadow: none" v-else>
            <span class="bg-no-data"></span>
          </div>
          <ul class="data-list">
            <li
              v-for="(item, index) in orgTable"
              :key="index"
              :class="{ active: active[item.orgId] }"
              @click="
                testModel
                  ? legendList(item.orgName, item.orgId)
                  : changIdAction(item.orgId, index)
              "
            >
              {{ item.orgName }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="tl-card-panel">
      <div class="card-panel-inside">
        <div class="card-panel-head">
          <div class="panner-title">
            <em>员工情绪大屏</em>
            <span v-show="testModel">示例数据</span>
          </div>
        </div>
        <div class="card-panel-body flex-column">
          <div class="flex-end">
            <el-date-picker
              format="yyyy-MM"
              value-format="yyyy-MM"
              v-model="mooddate"
              :editable="false"
              @change="getDateMood"
              :clearable="false"
              type="month"
              placeholder="选择日期"
            ></el-date-picker>
          </div>
          <div id="mood-depart"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts';
import { mapState } from 'vuex';

import Server from '../../server';
import { mainData } from '../../testData';

const server = new Server();
export default {
  props: {
    periodId: {
      type: [String, Number],
    },
  },
  name: 'weeking',
  data() {
    return {
      mooddate: '',
      value: '',
      server,
      orgId: '',
      calendarId: '',
      dateTime: '',
      options: [],
      legendTable: [],
      dateOption: [],
      echartDataY: [],
      echartDataX: [],
      tableData: [],
      moodDataX: [],
      moodDataY: [],
      myChartmood: '',
      myChart: '',
      active: {},
      orgTable: [],
      pickerBeginDateBefore: {
        disabledDate(time) {
          const times = new Date();
          const startValue = `${times.getFullYear()}-01`;
          const startTime = new Date(startValue);
          return time.getTime() < startTime.getTime();
        },
      },
    };
  },

  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      setOrgId: (state) => state.setOrgId,
      testModel: (state) => state.testModel,
    }),
  },
  mounted() {
    this.fetchData();

    this.getqueryMyOkr();
  },

  methods: {
    legendList(name, id) {
      if (this.active[id]) {
        this.$set(this.active, id, false);
      } else {
        this.$set(this.active, id, true);
      }
      this.myChart.dispatchAction({
        type: 'legendToggleSelect',
        // 图例名称
        name,
      });
    },
    fetchData() {
      const date = new Date();
      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const time = `${y}-${m}`;
      this.dateTime = time;
      this.mooddate = time;
      // this.getDate(this.dateTime);
      this.getDateMood(this.mooddate);
    },
    getDate(date) {
      this.calendarQurey(`${date}-01`);
    },
    getDateMood(date) {
      this.$nextTick(() => {
        this.orgEmotion(`${date}-01`);
      });
    },
    calendarQurey(date) {
      this.server.calendarQurey(
        {
          date,
        },
      ).then((res) => {
        this.dateOption = res.data;
        // eslint-disable-next-line max-len
        const dateArr = this.dateOption.map((item) => [new Date(item.weekBegin).getTime(), new Date(item.weekEnd).getTime()]);
        const eq = dateArr.findIndex((item) => item[0] <= new Date().getTime() && new Date().getTime() <= item[1]);
        if (eq >= 0) {
          this.calendarId = res.data[eq].calendarId;
        } else {
          this.calendarId = res.data[0].calendarId;
        }

        this.$nextTick(() => {
          this.orgWeekly();
        });
      });
    },
    orgWeekly() {
      this.server.orgWeekly({
        calendarId: this.calendarId,
        date: `${this.dateTime}-01`,
        orgId: this.$route.query.id ? this.$route.query.id : this.userInfo.orgId,
      }).then((res) => {
        this.tableData = this.testModel ? mainData.tableData.data : res.data;
      });
    },
    async changIdAction(id, index) {
      this.orgId = id;
      if (this.periodId == '') {
        await this.init();
        return false;
      }

      const departData = await this.getDepartData(id);

      if (this.active[id]) {
        this.$set(this.active, id, false);
        this.$set(this.echartDataY[index], 'data', []);
      } else {
        this.$set(this.active, id, true);
        this.$set(this.echartDataY[index], 'data', departData);
      }

      await this.init();
    },
    getqueryMyOkr() {
      const ApiName = this.$route.name !== 'grassStaff' ? 'getOrgOkr' : 'getmyOkr';
      this.server[ApiName]({
        periodId: this.periodId,
        status: '1',
        myOrOrg: this.$route.name !== 'grassStaff' ? 'org' : 'my',
        userId: this.$route.name !== 'grassStaff' ? this.$route.query.userId : '',
        tenantId: this.$route.query.tenantId,
        orgId: this.$route.query.id ? this.$route.query.id : this.setOrgId,
        type: 'INDEX',
      }).then((res) => {
        if (res.code == 200) {
          const { orgTable } = res.data;
          const orgTableData = this.testModel ? mainData.orkData.data : orgTable;
          this.$set(this, 'orgTable', orgTableData);
          this.active = {};
          this.echartDataY = [];

          this.orgId = this.orgTable[0].orgId;
          this.$set(this.active, this.orgId, true);
          this.legendTable = this.orgTable.map((item) => item.orgName);
          this.getInit(this.orgTable);
          this.changIdAction(this.orgTable[0].orgId, 0);
          this.$watch('periodId', () => {
            this.changIdAction(this.orgTable[0].orgId, 0);
          }, { immediate: true });
        }
      });
    },

    getDepartData(orgId) {
      return new Promise((reslove) => {
        this.server.riskStatistics({
          periodId: this.periodId,
          orgId,
          personOrOrg: 'org',
        }).then((res) => {
          const datasY = res.data.datas ? res.data.datas.map((item) => [item.createDate, item.allScore]) : [];
          // eslint-disable-next-line no-unused-expressions
          this.echartDataX = [];
          this.listTime(res.data);
          reslove(datasY);
        });
      });
    },
    getInit(orgTable) {
      this.echartDataY = orgTable.map((item) => ({
        type: 'line',
        symbol: 'circle',
        showAllSymbol: true,
        name: item.orgName,
        symbolSize: 7,
        itemStyle: {
          normal: {
            color(params) {
              if (params.value[1] == 1) {
                return '#4CCD79';
              }
              if (params.value[1] == 4) {
                return '#FFBC20';
              }
              if (params.value[1] == 7) {
                return '#FB4C59 ';
              }
            },

          },
        },
        data: [],
      }));
    },
    listTime(dateTime) {
      const startDate = `${dateTime.months[0]}-01`;
      const endtDate = `${dateTime.months.pop()}-31`;
      const cheTime = new Date(endtDate).getTime() - new Date(startDate).getTime();
      const oneDay = 24 * 3600 * 1000;
      let startche = +new Date(startDate) - oneDay;
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < cheTime / oneDay; i++) {
        // eslint-disable-next-line no-const-assign
        startche += oneDay;
        const now = new Date(startche);
        let months = '';
        let day = '';
        if (now.getMonth() < 9) {
          months = `0${now.getMonth() + 1}`;
        } else {
          months = now.getMonth() + 1;
        }
        if (now.getDate() < 10) {
          day = `0${now.getDate()}`;
        } else {
          day = now.getDate();
        }
        this.echartDataX.push([now.getFullYear(), months, day].join('-'));
      }
    },
    init() {
      const that = this;

      that.myChart = echarts.init(document.getElementById('week-depart'));
      const option = {
        xAxis: {
          data: that.testModel ? mainData.timeData : that.echartDataX,
          axisLine: {
            lineStyle: {
              color: '#F4F6F8', // 颜色
              width: 1, // 粗细
            },
          },
          axisLabel: {
            textStyle: {
              color: '#879099', // 更改坐标轴文字颜色
              fontSize: 14, // 更改坐标轴文字大小
            },
          },
        },
        legend: {
          data: that.testModel ? that.echartDataY.map((item) => item.name) : that.legendTable,
          bottom: 'bottom',
          show: false,
          icon: 'rect',
        },

        yAxis: {
          min: 0,
          max: 7,
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#F4F6F8', // 颜色
              width: 1, // 粗细
            },

          },
          axisLabel: {
            textStyle: {
              color: '#879099', // 更改坐标轴文字颜色
              fontSize: 14, // 更改坐标轴文字大小
            },
            formatter(value) {
              const texts = [];
              if (value == 0) {
                console.log(1);
              } else if (value == 1) {
                texts.push('信心指数高');
              } else if (value == 4) {
                texts.push('信心指数中');
              } else if (value == 7) {
                texts.push('信心指数低');
              }
              return texts;
            },
          },
        },
        tooltip: {
          formatter(params) {
            console.log(params);
            if (params.value[1] == 1) {
              return `${params.value[0]},${params.seriesName}：高`;
            } if (params.value[1] == 4) {
              return `${params.value[0]},${params.seriesName}：中`;
            } if (params.value[1] == 7) {
              return `${params.value[0]},${params.seriesName}：低`;
            }
          },
        },
        series: that.testModel ? mainData.lineData : that.echartDataY,

      };

      that.myChart.setOption(option, true);
      that.myChart.resize();
      window.addEventListener('resize', that.myChart.resize);
      that.orgTable.forEach((item, index) => {
        if (index > 0) {
          this.myChart.dispatchAction({
            type: 'legendToggleSelect',
            // 图例名称
            name: item.orgName,
          });
        }
      });

      // if (myChart._$handlers.legendselectchanged) {
      //   myChart._$handlers.legendselectchanged.length = 0;
      // }
      // myChart.on('legendselectchanged', (data) => {
      //   console.log(data);
      //   const orgData = that.orgTable.filter((item) => item.orgName == data.name)[0];
      //   const index = that.orgTable.findIndex((item) => item.orgName == data.name);

      //   that.changIdAction(orgData.orgId, index);
      // });
    },
    initMood() {
      const that = this;
      const myChartmood = echarts.init(document.getElementById('mood-depart'));
      let endLength;
      if (that.moodDataX.length > 9) {
        endLength = (100 / that.moodDataX.length).toFixed(2) * 9;
      } else {
        endLength = 100;
      }
      const option = {
        dataset: {
          source: that.testModel ? mainData.moodData : that.moodDataY,
        },
        legend: {
          top: 'top',
          data: ['0', '50', '100'],
          formatter(params) {
            if (params == '0') {
              return '让我静静';
            }
            if (params == '50') {
              return '还行吧';
            }
            if (params == '100') {
              return '有收获';
            }
          },
        },
        dataZoom: [{
          type: 'slider', // slider表示有滑动块的，inside表示内置的
          // startValue: 8,//可用于设置开始显示的柱子的长度
          // endValue: 1,//可用于设置结束显示的柱子的长度
          show: that.moodDataX.length > 9 && !that.testModel,
          xAxisIndex: [0],
          handleSize: 0, // 滑动条的 左右2个滑动条的大小
          height: 12, // 组件高度
          left: '10%', // 左边的距离
          right: '10%', // 右边的距离
          bottom: -3, // 右边的距离
          borderColor: '#F4F4F4',
          fillerColor: '#E7E7E7',
          backgroundColor: '#F4F4F4', // 两边未选中的滑动条区域的颜色
          showDataShadow: false, // 是否显示数据阴影 默认auto
          showDetail: false, // 即拖拽时候是否显示详细数值信息 默认true
          realtime: true, // 是否实时更新
          filterMode: 'filter',
          handleColor: '#FFBC20',
          // eslint-disable-next-line no-dupe-keys
          start: 0,
          // eslint-disable-next-line no-dupe-keys
          end: that.testModel ? 100 : endLength,
          handleStyle: {
            borderRadius: '20',
            background: '#F4F6F8',
          },
        }],
        tooltip: {
          trigger: 'item',
          position: 'top',
          formatter(params) {
            return `<div>让我静静${params.data[1]}</div>
            <div>还行吧${params.data[2] ? params.data[2] : 0}</div>
            <div>有收获${params.data[3] ? params.data[3] : 0}</div>`;
          },
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            interval: 0,
            textStyle: {
              color: '#879099', // 更改坐标轴文字颜色
              fontSize: 14, // 更改坐标轴文字大小
            },
            // formatter(value) {
            //   let ret = '';// 拼接加\n返回的类目项
            //   const maxLength = 4;// 每项显示文字个数
            //   const valLength = value.length;// X轴类目项的文字个数
            //   const rowN = Math.ceil(valLength / maxLength); // 类目项需要换行的行数
            //   if (rowN > 1)// 如果类目项的文字大于3,
            //   // eslint-disable-next-line brace-style
            //   {
            //     // eslint-disable-next-line no-plusplus
            //     for (let i = 0; i < rowN; i++) {
            //       let temp = '';// 每次截取的字符串
            //       const start = i * maxLength;// 开始截取的位置
            //       const end = start + maxLength;// 结束截取的位置
            //       // 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
            //       temp = `${value.substring(start, end)}...`;
            //       ret = temp; // 拼接最终的字符串
            //     }
            //     return ret;
            //   }
            //   return value;
            // },
          },
          axisLine: {
            lineStyle: {
              color: '#F4F6F8', // 颜色
              width: 1, // 粗细
            },
          },
        },
        yAxis: {
          min: 0,
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#F4F6F8', // 颜色
              width: 1, // 粗细
            },
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#879099', // 更改坐标轴文字颜色
              fontSize: 14, // 更改坐标轴文字大小

            },

          },
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          {
            type: 'bar',
            barWidth: 7,
            itemStyle: {

              normal: { barBorderRadius: 5, color: '#FB4C59' },
            },
          },
          {
            type: 'bar',
            barWidth: 7,
            itemStyle: {
              normal: { barBorderRadius: 5, color: '#3F7DFF' },
            },
          },
          {
            type: 'bar',
            barWidth: 7,
            itemStyle: {
              normal: { barBorderRadius: 5, color: '#FFBC20' },
            },
          },
        ],
      };

      myChartmood.setOption(option);
      myChartmood.resize();
      window.addEventListener('resize', myChartmood.resize);
    },
    orgEmotion(date) {
      this.server.orgEmotion({
        date,
        orgId: this.$route.query.id ? this.$route.query.id : this.setOrgId,
      }).then((res) => {
        this.moodDataX = res.data.map((item) => item.orgName);
        this.moodDataY = res.data.map((item) => ([
          item.orgName,
          ...item.emotionList.map((li) => (li.weeklyNumber)),
        ]));
        this.moodDataY = [['product', '0', '50', '100'], ...this.moodDataY];
        this.initMood();
      });
    },
  },
};
</script>
<style  scoped>
.data-list {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}
.data-list li {
  font-size: 14px;
  cursor: pointer;
  margin: 0px 20px;
}

.card-panel-body {
  flex-direction: column;
}
.active {
  color: #ffbc20;
}
</style>