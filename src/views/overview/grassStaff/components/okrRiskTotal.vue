<template>
  <div class="weeking">
    <div class="tl-card-panel">
      <div class="card-panel-head">
        <div class="panner-title">
          <em>OKR信心指数统计</em>
          <span v-show="testModel">示例数据</span>
        </div>
      </div>
      <div class="card-panel-body">
        <div id="okr-risk-line"></div>
      </div>
    </div>

    <div class="tl-card-panel">
      <div class="card-panel-head">
        <div class="panner-title">
          <em>周报</em>
          <span v-show="testModel">示例数据</span>
        </div>
      </div>
      <div class="card-panel-body flex-column">
        <div class="flex-end">
          <el-date-picker
            format="yyyy-MM"
            value-format="yyyy-MM"
            v-model="dateTime"
            :editable="false"
            @change="getDate"
            :picker-options="pickerBeginDateBefore"
            type="month"
            :clearable="false"
            placeholder="选择日期"
            popper-class="tl-month-popper"
            class="tl-month-editor"
          ></el-date-picker>
        </div>
        <el-table
          :data="tableData"
          :show-header="true"
          class="tl-table"
          style="width: 100%"
        >
          <el-table-column label="周报">
            <template slot-scope="scope">
              <span>{{ scope.row.weekBegin }}~{{ scope.row.weekEnd }}</span>
            </template>
          </el-table-column>
          <el-table-column label="本周心情">
            <template slot-scope="scope">
              <span v-if="scope.row.weeklyEmotion !== null"
                >本周心情:{{
                  CONST.WEEKLYEMOTION[scope.row.weeklyEmotion]
                }}</span
              >
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="提交时间">
            <template slot-scope="scope">
              <span v-if="scope.row.updateTime">{{
                scope.row.updateTime
              }}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts';
import { mapState } from 'vuex';
import Server from '../../server';
import CONST from '../../const';
import { userData } from '../../testData';

const server = new Server();
export default {
  name: 'okrRisk',
  props: {
    okrData: {
      type: [Object, Array, String],
    },
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      setOrgId: (state) => state.setOrgId,
      testModel: (state) => state.testModel,
    }),
  },
  data() {
    return {
      calendarId: '',
      CONST,
      server,
      dateTime: '',
      dateOption: [],
      tableData: [],
      echartDataX: [],
      echartDataY: [],
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
  mounted() {
    this.fetchData();
    // this.changeTime();
    if (this.testModel) {
      this.init();
      return false;
    }
  },
  methods: {
    changeTime() {
      const that = this;
      const echartData = JSON.parse(JSON.stringify(this.okrData));
      this.echartDataX = [];
      const startDate = `${echartData.months[0]}-01`;

      const endtDate = `${echartData.months.pop()}-31`;
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
        if (now.getDate() < 9) {
          day = `0${now.getDate()}`;
        } else {
          day = now.getDate();
        }
        this.echartDataX.push([now.getFullYear(), months, day].join('-'));
      }

      if (echartData.datas) {
        const echartDataFil = echartData.datas.filter((item) => item);

        this.echartDataY = {
          type: 'line',
          symbol: 'circle',
          symbolSize: 10,
          showAllSymbol: true,

          data: echartDataFil.map((item) => [item.createDate, item.allScore]),
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
              lineStyle: {
                color: '#3F7DFF',
              },
            },
          },
        };
      } else {
        this.echartDataY = {
          type: 'line',
          symbolSize: 10,
          symbol: 'circle',
          showAllSymbol: true,
          itemStyle: {
            color: '#3F7DFF',
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
              lineStyle: {
                color: '#3F7DFF',
              },
            },
          },
          data: that.testModel ? userData.riskDataY : [],
        };
      }
      this.init();
    },
    changeLeek() {
      this.userWeekly();
    },
    fetchData() {
      const date = new Date();
      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const time = `${y}-${m}`;
      this.dateTime = time;
      this.getDate(this.dateTime);
    },
    getDate(date) {
      this.calendarQurey(`${date}-01`);
    },
    calendarQurey(date) {
      this.server.calendarQurey(
        {
          date,
        },
      ).then((res) => {
        this.dateOption = res.data;
        this.calendarId = res.data[0].calendarId;
        this.changeLeek();
      });
    },
    userWeekly() {
      this.server.userWeekly({
        date: `${this.dateTime}-01`,
        userId: this.$route.query.id ? this.$route.query.id : '',
      }).then((res) => {
        this.tableData = this.testModel ? userData.userTable.data : res.data;
      });
    },
    init() {
      const that = this;
      const myChart = echarts.init(document.getElementById('okr-risk-line'));
      const option = {
        xAxis: {
          data: that.testModel ? userData.riskDataX : that.echartDataX,
          axisLabel: {
            show: true,
            textStyle: {
              color: '#879099', // 更改坐标轴文字颜色
              fontSize: 14, // 更改坐标轴文字大小
            },
          },
          axisLine: {
            lineStyle: {
              color: '#F4F6F8', // 颜色
              width: 1, // 粗细
            },
          },
        },
        tooltip: {
          trigger: 'item',
          position: 'top',
          formatter(params) {
            if (params.value[1] == 1) {
              return `${params.value[0]},高`;
            } if (params.value[1] == 4) {
              return `${params.value[0]},中`;
            } if (params.value[1] == 7) {
              return `${params.value[0]},低`;
            }
          },
        },
        yAxis: {
          min: 0,
          max: 7,
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#F4F6F8'],
              width: 1,
              type: 'solid',
            },
          },
          axisLabel: {
            formatter(value) {
              const texts = [];
              if (value == 0) {
                console.log('');
              } else if (value == 1) {
                texts.push('信心指数高');
              } else if (value == 4) {
                texts.push('信心指数中');
              } else if (value == 7) {
                texts.push('信心指数低');
              }
              return texts;
            },
            textStyle: {
              color: '#879099', // 更改坐标轴文字颜色
              fontSize: 14, // 更改坐标轴文字大小
            },
          },
          axisLine: {
            lineStyle: {
              color: '#F4F6F8', // 颜色
              width: 1, // 粗细
            },
          },
        },
        series: [
          that.testModel ? userData.riskDataY : that.echartDataY,
        ],
      };

      myChart.setOption(option);
    },
  },
  watch: {
    okrData: {
      handler() {
        this.changeTime();
      },
      deep: true,
    },
  },
};
</script>
