<template>
  <div class="operating-area">
    <div class="operating-area-inside">
      <em @click="changeTest">{{
        testModel ? CONST.DATA_TYPE[0].name : CONST.DATA_TYPE[1].name
      }}</em>
      <i class="el-icon-sort" @click="changeTest"></i>
      <div class="operating-box">
        <dl class="dl-item">
          <dt>目标周期</dt>
          <dd>
            <el-select
              :disabled="options.length == 0"
              v-model="value"
              placeholder="请选择目标周期"
              :popper-append-to-body="false"
              popper-class="tl-select-dropdown"
              class="tl-select"
              @change="selectPeriod"
            >
              <el-option
                v-for="item in options"
                :key="item.periodId"
                :label="item.periodName"
                :value="item.periodId"
              ></el-option>
            </el-select>
          </dd>
        </dl>
        <el-button
          plain
          v-if="$route.query.id"
          @click="back()"
          class="tl-btn amt-border-slip"
        >
          返回
          <span class="lines"></span>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import Server from '../server';
import CONST from '../const';

const server = new Server();
export default {
  name: 'personPage',
  components: {
  },
  data() {
    return {
      server,
      options: [],
      value: '',
      depart: '',
      CONST,
    };
  },
  props: {
    showBack: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.setOrg(this.userInfo.orgId);
    this.getokrQuery();
  },
  mounted() {
    window.addEventListener('beforeunload', () => {
      sessionStorage.removeItem('model');
      sessionStorage.removeItem('modelOkr');
    });
  },
  inject: ['reload'],
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      setOrgId: (state) => state.setOrgId,
      testModel: (state) => state.testModel,
    }),
  },

  methods: {
    ...mapMutations('common', ['setOrg', 'changeTestModel']),
    back() {
      this.$router.back();
      this.reload();
    },
    changeTest() {
      const boolTest = !this.testModel;
      this.changeTestModel(boolTest);
      this.reload();
    },
    getokrQuery() {
      this.server.getOkrCycleList().then((res) => {
        if (res.code == 200) {
          this.options = res.data;
          if (res.data.length == 0 && sessionStorage.getItem('model') !== '1' && !this.$route.query.id) {
            this.changeTestModel(true);
            this.reload();
            sessionStorage.setItem('model', '1');
          }
          if (this.options.length > 0) {
            if (sessionStorage.getItem('selectPer')) {
              this.value = sessionStorage.getItem('selectPer');
            } else {
              this.value = this.options.filter((item) => item.checkStatus == '1')[0].periodId || {};
            }
          } else {
            this.value = '';
          }

          this.$emit('getPeriod', this.value);
        }
      });
    },
    selectPeriod(value) {
      sessionStorage.setItem('selectPer', value);
      this.$emit('getPeriod', value);
      if (this.testModel) {
        this.changeTestModel(false);
        this.reload();
      }
    },
  },
};
</script>