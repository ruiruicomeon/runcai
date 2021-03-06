<template>
  <div class="tl-card-panel" v-loading="fullscreenLoading">
    <em v-show="testModel">示例数据</em>
    <template v-if="tableList.length > 0">
      <div class="card-panel-head">
        <div class="okr-title">
          {{ testModel ? "2020年下半年的OKR" : okrMain.periodName }}
          <em v-if="!testModel && okrMain.okrBelongType == 1"
            >- {{ cutOrgName(okrMain.orgName) }}</em
          >
        </div>
        <dl class="okr-state">
          <dt>
            <i :class="CONST.STATUS_LIST_MAP[okrMain.status].className"></i>
            <em>状态</em>
          </dt>
          <dd class="is-highlighted">
            <em>{{ CONST.STATUS_LIST_MAP[okrMain.status].name }}</em>
          </dd>
        </dl>
        <dl class="okr-type">
          <dt>
            <em>OKR类型</em>
          </dt>
          <dd>{{ CONST.OKR_TYPE_MAP[okrMain.okrBelongType || 1] }}</dd>
        </dl>
        <dl class="okr-responsible">
          <dt>
            <em>负责人</em>
          </dt>
          <dd>{{ okrMain.userName }}</dd>
        </dl>
        <dl
          class="okr-follow"
          v-if="okrMain.approvalStatus != 2 && okrMain.approvalStatus != 0"
        >
          <dd v-show="okrMain.supported != '1'" @click="addFocus(okrMain)">
            <i class="el-icon-plus"></i><em>关注</em>
          </dd>
          <dd v-show="okrMain.supported == '1'" @click="cancelFocus(okrMain)">
            <div :class="{ 'is-follow': okrMain.supported == '1' }">
              <i class="el-icon-check"></i>
            </div>
            <em>已关注</em>
          </dd>
        </dl>
        <dl class="okr-progress">
          <dt>
            <em>OKR进度</em>
          </dt>
          <dd>
            <el-progress
              type="circle"
              :percentage="parseInt(okrMain.okrProgress, 10) || 0"
              :width="70"
              :stroke-width="5"
              color="#4ccd79"
              class="tl-progress-circle"
            ></el-progress>
          </dd>
        </dl>
      </div>
      <div class="card-panel-body">
        <tl-okr-table
          :tableList="tableList"
          :expands.sync="expands"
        ></tl-okr-table>
      </div>
    </template>
    <template v-else>
      <div class="no-data" v-show="showLoad">
        <div class="no-data-bg"></div>
        <div class="no-data-txt">暂未填写OKR</div>
        <el-button
          v-if="!$route.query.id"
          type="primary"
          icon="el-icon-plus"
          @click="
            $router.push({
              name: 'myOkr',
              query: {
                openWriteOkr: true,
                periodId,
              },
            })
          "
          class="tl-btn amt-bg-slip"
          >去创建OKR</el-button
        >
      </div>
    </template>
    <div class="card-panel-body img-list" v-if="orgUser.length > 0">
      <em>成员：</em>
      <div class="dl-group">
        <dl
          v-for="(item, index) in orgUser"
          :key="item.userId + index"
          @click="getidentity(item)"
        >
          <dt class="user-info">
            <img v-if="item.headUrl" :src="item.headUrl" alt />
            <div class="user-name" v-else>
              <em>{{ cutName(item.userName) }}</em>
            </div>
          </dt>
          <dd>{{ item.userName }}</dd>
        </dl>
      </div>
    </div>
    <div class="card-panel-body img-list" v-if="orgTable.length > 0">
      <em>子部门：</em>
      <div class="dl-group">
        <dl
          v-for="(item, index) in orgTable"
          :key="item.orgId + index"
          @click="getidentity(item)"
        >
          <!-- <dt class="user-info">
            <img v-if="item.headUrl" :src="item.headUrl" alt />
            <div class="user-name" v-else>
              <em>{{ cutName(item.orgName) }}</em>
            </div>
          </dt> -->
          <span class="org-btn">{{ cutOrgName(item.orgName) }}</span>
        </dl>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import okrTable from '@/components/okrTableLittle';

import Server from '../server';
import CONST from '../const';
import { okrData, okrDataTeam, okrUser } from '../testData';

const server = new Server();

export default {
  name: 'myOkr',
  components: {
    'tl-okr-table': okrTable,
  },
  props: ['periodId'],
  data() {
    return {
      showTable: false,
      server,
      CONST,
      okrMain: '',
      tableList: [],
      orgTable: [],
      orgUser: [],
      showLoad: false,
      fullscreenLoading: true,
      searchForm: {
        status: '1',
      },
      dialogExist: false,
      currentView: '', // 弹框组件
      okrId: '',
      okrItem: {},
      drawer: false,
      writeInfo: {
        canWrite: '',
      },
      drawerTitle: '创建okr',
      okrCycle: {}, // 当前选择的周期
      periodList: [], // 周期列表
      param: [],
      expands: [],
    };
  },
  inject: ['reload'],
  computed: {
    ...mapState('common', {
      setOrgId: (state) => state.setOrgId,
      testModel: (state) => state.testModel,
      userInfo: (state) => state.userInfo,
    }),
    // expands() {
    //   return [this.tableList[0].okrDetailId];
    // },
  },

  methods: {
    ...mapMutations('common', ['setOrg', 'changeTestModel', 'setCycleList']),
    goUndertakeMaps(id, name) {
      this.$router.push({
        name: 'undertakeMaps',
        params: {
          okrDetailId: id, objectName: name, showOne: true, periodId: this.periodId, orgId: this.okrId,
        },
      });
    },
    cutName(userName) {
      const nameLength = userName.length;
      return userName.substring(nameLength - 2, nameLength);
    },
    searchOkr() { // 默认搜索进行时
      this.showTable = false;
      const ApiName = this.$route.name !== 'grassStaff' ? 'getOrgOkr' : 'getmyOkr';
      this.server[ApiName]({
        periodId: this.periodId,
        status: this.searchForm.status,
        myOrOrg: this.$route.name !== 'grassStaff' ? 'org' : 'my',
        userId: this.$route.name == 'grassStaff' ? this.$route.query.userId : '',
        tenantId: this.$route.query.tenantId,
        orgId: this.$route.query.id ? this.$route.query.id : this.setOrgId,
        type: 'INDEX',
      }).then((res) => {
        if (res.code == 200) {
          this.setList(res.data);
        }
      });
    },
    cancelFocus(data) {
      this.cancelParam = [];
      this.param.push({
        focusType: 0,
        targetId: data.okrId,
        supported: 0,
      });
      this.server.addFocus(
        this.param,
      ).then((res) => {
        if (res.code == '200') {
          this.okrMain.supported = '0';
        }
      });
    },
    addFocus(data) {
      this.param = [];
      this.param.push({
        focusType: 0,
        targetId: data.okrId,
        supported: 1,
      });
      this.server.addFocus(
        this.param,
      ).then((res) => {
        if (res.code == '200') {
          this.okrMain.supported = '1';
        }
      });
    },
    setList(listData = {}) {
      if (this.$route.name == 'teamleader') {
        // eslint-disable-next-line no-unused-expressions
        this.testModel ? listData = okrDataTeam.data : listData;
      }
      if (this.$route.name == 'departleader') {
        // eslint-disable-next-line no-unused-expressions
        this.testModel ? listData = okrData.data : listData;
      }
      if (this.$route.name == 'grassStaff') {
        // eslint-disable-next-line no-unused-expressions
        this.testModel ? listData = okrUser.data : listData;
      }
      this.tableList = listData.okrDetails || [];
      this.okrMain = listData.okrMain || {};
      if (listData.okrApprovalVo) {
        const okrInfo = JSON.parse(listData.okrApprovalVo.paramJson) || {};
        this.tableList = okrInfo.okrInfoList || [];
        this.searchForm.status = listData.okrApprovalVo.approvalStatus == 2 ? 8 : 7;
        this.okrMain = {
          userName: listData.okrApprovalVo.userName,
          okrProgress: listData.okrApprovalVo.okrProgress || 0,
          updateTime: listData.okrApprovalVo.updateTime || listData.okrApprovalVo.createTime || '--',
          okrBelongType: okrInfo.okrBelongType,
          status: this.searchForm.status,
          approvalStatus: listData.okrApprovalVo.approvalStatus,
          periodName: listData.okrApprovalVo.periodName,
          orgName: listData.okrApprovalVo.orgName,
        };
      }
      this.okrId = this.okrMain.okrId || '';
      this.$set(this, 'orgUser', listData.orgUser || []);
      // this.orgUser = listData.orgUser || [];
      this.orgTable = listData.orgTable || [];
      if (this.tableList[0]) {
        this.expands = [this.tableList[0].okrDetailId];
      }
      setTimeout(() => {
        this.showLoad = true;
        this.fullscreenLoading = false;
      }, 1000);
      // clearTimeout(time);
      // this.$nextTick(() => {
      //   Bus.$emit('getOrgTable', this.orgTable);
      // });
    },

    // 认证身份跳转对应身份首页
    getidentity(user) {
      if (this.testModel) {
        return false;
      }
      if (this.userInfo.userId == user.userId && !this.$route.query.userId) {
        this.$message.success('此页面已是您要查看的页面');
        return false;
      }
      if (this.$route.query.userId == user.userId) {
        this.$message.success('此页面已是您要查看的页面');
        return false;
      }
      if (!user.userId) {
        this.$message.success('该部门还未创建用户哦～');
        return false;
      }
      this.server.identity({
        user: user.userId,
        orgId: user.orgId,
      }).then((res) => {
        if (res.data.identityType == 'org') {
          this.$router.push({
            name: 'departleader',
            query: {
              id: user.orgId, userId: user.userId,
            },
          });
          // eslint-disable-next-line no-unused-expressions
          this.$route.name == 'departleader' ? this.reload() : '';

          return false;
        }
        if (res.data.identityType == 'team') {
          this.$router.push({
            name: 'teamleader',
            query: {
              id: user.orgId, userId: user.userId,
            },
          });

          // eslint-disable-next-line no-unused-expressions
          this.$route.name == 'teamleader' ? this.reload() : '';

          return false;
        }
        if (res.data.identityType == 'person') {
          this.$router.push({
            name: 'grassStaff',
            query: {
              id: user.orgId, userId: user.userId,
            },
          });
        }
      });
    },
  },

  watch: {
    periodId: {
      handler(newVal) {
        if (newVal) {
          this.searchOkr();
        } else {
          this.setList();
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
<style lang="css">
.org-btn {
  background: #f0effe;
  border-radius: 2px;
  position: relative;
  overflow: hidden;
  color: #685df1;
  padding: 5px 7px;
  margin-right: -8px;
}
</style>