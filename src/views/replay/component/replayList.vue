<template>
  <div class="replay-list">
    <div class="operating-box">
      <dl class="dl-item">
        <dt>周期</dt>
        <dd>
          <el-select
            :disabled="periodIdList.length == 0"
            v-model.trim="periodId"
            placeholder="请选择目标周期"
            :popper-append-to-body="false"
            @change="okrReviewList"
            popper-class="tl-select-dropdown"
            class="tl-select has-bg w180"
          >
            <el-option
              :label="item.periodName"
              :value="item.periodId"
              v-for="(item, index) in periodIdList"
              :key="index"
            ></el-option>
          </el-select>
        </dd>
      </dl>
      <dl class="dl-item">
        <dt>复盘状态</dt>
        <dd>
          <el-select
            v-model.trim="reviewStatus"
            placeholder="请选择复盘状态"
            :popper-append-to-body="false"
            @change="okrReviewList"
            clearable
            popper-class="tl-select-dropdown"
            class="tl-select has-bg w100"
          >
            <el-option
              :label="item.name"
              :value="item.status"
              v-for="(item, index) in CONST.REVIEW_STATUS_LIST"
              :key="index"
            ></el-option>
          </el-select>
        </dd>
      </dl>
      <dl class="dl-item">
        <dd>
          <el-input
            maxlength="64"
            v-model.trim="userName"
            placeholder="请输入用户名称"
            clearable
            @keyup.enter.native="okrReviewList"
            @clear="okrReviewList"
            class="tl-input-search"
          >
            <i class="el-icon-search" slot="prefix" @click="okrReviewList"></i>
          </el-input>
        </dd>
      </dl>
      <el-button plain class="tl-btn light" @click="okrReviewList"
        >搜索</el-button
      >
    </div>
    <div class="cont-area">
      <tl-crcloud-table
        :total="totalpage"
        :currentPage.sync="currentPage"
        :pageSize.sync="pageSize"
        @searchList="okrReviewList"
      >
        <div slot="tableContainer" class="table-container">
          <el-table :data="tableData" class="tl-table">
            <el-table-column
              prop="userName"
              label="姓名"
              width="90"
            ></el-table-column>
            <el-table-column
              prop="orgName"
              label="部门名称"
              min-width="135"
            ></el-table-column>
            <el-table-column
              prop="okrBelongType"
              label="OKR所属类型"
              min-width="110"
            >
              <template slot-scope="scope">
                {{ CONST.OKR_BELONGTYPE[scope.row.okrBelongType] }}
              </template>
            </el-table-column>
            <el-table-column
              prop="periodName"
              label="OKR周期"
              min-width="160"
            ></el-table-column>
            <el-table-column prop="okrProgress" label="OKR进度" min-width="150">
              <template slot-scope="scope">
                <tl-process
                  :data="parseInt(scope.row.okrProgress || 0, 10)"
                ></tl-process>
              </template>
            </el-table-column>
            <el-table-column
              prop="selfAssessmentScore"
              label="OKR自评得分"
              min-width="110"
            >
              <template slot-scope="scope">
                <span> {{ scope.row.selfAssessmentScore || "--" }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="finalScore"
              label="OKR复核得分"
              min-width="110"
            >
              <template slot-scope="scope">
                <span> {{ scope.row.finalScore || "--" }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="reviewStatusCn"
              label="复盘状态"
              min-width="160"
            >
              <template slot-scope="scope">
                <i
                  :class="
                    CONST.REVIEW_STATUS_MAP[scope.row.reviewStatus].classname
                  "
                ></i>
                <span>{{
                  CONST.REVIEW_STATUS_MAP[scope.row.reviewStatus].name
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="reviewCommitTime"
              label="提交复盘时间"
              min-width="170"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.reviewCommitTime">{{
                  scope.row.reviewCommitTime
                }}</span>
                <span v-else>--</span>
              </template></el-table-column
            >
            <el-table-column
              prop="reviewCommunicateTime"
              label="复盘沟通时间"
              min-width="170"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.reviewCommunicateTime">{{
                  scope.row.reviewCommunicateTime
                }}</span>
                <span v-else>--</span>
              </template></el-table-column
            >

            <el-table-column label="操作" width="80" fixed="right">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  class="tl-btn"
                  v-if="!scope.row.ownerFlag && scope.row.reviewStatus == 2"
                  @click="
                    $router.push({
                      name: 'replayLink',
                      query: {
                        okrId: scope.row.okrId,
                      },
                    })
                  "
                  >复盘沟通</el-button
                >
                <el-button
                  type="text"
                  class="tl-btn"
                  v-else-if="scope.row.ownerFlag && scope.row.reviewStatus == 1"
                  @click="
                    $router.push({
                      name: 'replayEdit',
                      query: {
                        okrId: scope.row.okrId,
                      },
                    })
                  "
                  >复盘</el-button
                >

                <!-- 条件要加 -->
                <el-button
                  type="text"
                  class="tl-btn"
                  v-else-if="
                    scope.row.reviewStatus == 4 &&
                    roleCode.includes('ORG_ADMIN')
                  "
                  @click="
                    $router.push({
                      name: 'replayApproval',
                      query: {
                        okrId: scope.row.okrId,
                      },
                    })
                  "
                  >复盘审批</el-button
                >
                <el-button
                  type="text"
                  class="tl-btn"
                  v-else
                  @click="
                    $router.push({
                      name: 'replayDetail',
                      query: {
                        okrId: scope.row.okrId,
                      },
                    })
                  "
                  >查看</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </tl-crcloud-table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import crcloudTable from '@/components/crcloudTable';
import process from '@/components/process';
import processenv from './processenv';
import Server from '../server';
import CONST from '../const';

const server = new Server();
export default {
  name: 'replayList',
  mixins: [processenv],
  data() {
    return {
      form: {},
      server,
      keyWord: '',
      periodId: '',
      periodIdList: [],
      tableData: [],
      CONST,
      currentPage: 1,
      userName: '',
      pageSize: 20,
      totalpage: 0,
      reviewStatus: '',
    };
  },
  created() {
    console.log(process);
    this.getOkrCycleList();
  },
  computed: {
    ...mapState('common', {
      roleCode: (state) => state.roleCode,
    }),
  },
  methods: {
    okrReviewList() {
      sessionStorage.setItem('historyPer', this.periodId);
      let reviewStatus = [];
      if (this.reviewStatus === '') {
        reviewStatus = null;
      } else {
        reviewStatus[0] = this.reviewStatus;
      }
      this.server.getOkrReviewPage({
        periodId: this.periodId, // 周期id，必传
        reviewStatus, // 复盘状态 1、待复盘，2、待沟通，3、复盘结束[0,3];<不传参数，则表示查询全部>
        userName: this.userName, // 支持精确搜索
        currentPage: this.currentPage, // 可以不传，默认是1
        pageSize: this.pageSize, // 可以不传，默认是20

      }).then((res) => {
        this.tableData = res.data.content;
        this.totalpage = res.data.total;
      });
    },
    getOkrCycleList() {
      this.server.getOkrCycleList().then((res) => {
        this.periodIdList = res.data;
        if (sessionStorage.getItem('historyPer')) {
          this.periodId = sessionStorage.getItem('historyPer');
        } else {
          this.periodId = this.periodIdList.filter((item) => item.checkStatus == 1)[0].periodId || {};
        }

        this.okrReviewList();
      });
    },
  },
  components: {
    'tl-crcloud-table': crcloudTable,
    'tl-process': process,
  },
};
</script>