<template>
  <div id="okrUpdate"></div>
</template>

<script>
import echarts from 'echarts';
import { mapState } from 'vuex';

export default {
  name: 'okrUpdate',
  data() {
    return {
    };
  },
  computed: {
    ...mapState('common', {
      testModel: (state) => state.testModel,

    }),
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const myChart = echarts.init(document.getElementById('okrUpdate'));

      const option = {
        xAxis: {
          type: 'category',
          data: [],
        },
        yAxis: [
          {
            type: 'value',
            show: true,
          },

        ],
        series: [{
          // eslint-disable-next-line max-len
          data: [],
          type: 'bar',
          barWidth: 20,
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(220, 220, 220, 0.8)',
          },

        }],
      };

      myChart.setOption(option);
      myChart.resize();
      window.addEventListener('resize', myChart.resize);
    },
  },
};
</script>
