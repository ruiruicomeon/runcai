<template>
  <div class="working-hours">
    <div class="operating-area">
      <div class="operating-box">
        <dl class="dl-item">
          <dt>项目</dt>
          <dd>
            <el-select
              v-model="formData.projectId"
              :popper-append-to-body="false"
              placeholder="请选择项目"
              @change="changeProject"
              style="width: 400px"
              popper-class="tl-select-dropdown"
              class="tl-select has-bg"
            >
              <el-option
                v-for="(item, index) in projectList"
                :key="index"
                :label="item.projectNameCn"
                :value="item.projectId"
              ></el-option>
            </el-select>
          </dd>
        </dl>
      </div>
      <dl class="dl-item">
        <dd>
          <el-button
            type="primary"
            class="tl-btn amt-bg-slip"
            :disabled="closeProject == '1'"
            @click="goToHours()"
            v-if="!projectList.length == 0"
            >工时调入</el-button
          >
          <a v-if="!projectList.length == 0" @click="showHistory"
            >历史调入记录>></a
          >
        </dd>
      </dl>
    </div>
    <div class="cont-area">
      <div class="dl-list">
        <div class="dl-item-group cancel">
          <dl class="dl-item">
            <dt>
              <span> 项目：{{ projectName }} </span>
            </dt>
          </dl>
        </div>
        <div class="dl-item-group">
          <dl class="dl-item">
            <dt>
              <span> 上一周 {{ week }} </span>
            </dt>
          </dl>
          <dl class="dl-item">
            <dt><span>项目成员</span></dt>
            <dd>
              <em>{{ projectUserSum || 0 }} </em><span>人</span>
              <span></span>
            </dd>
          </dl>
          <dl class="dl-item">
            <dt><span>预计提交工时</span></dt>
            <dd>
              <em>{{ submissionHours || 0 }} </em><span>天</span> <span></span>
            </dd>
          </dl>
          <dl class="dl-item">
            <dt><span>实际提交工时</span></dt>
            <dd>
              <em>{{ actualSubmissionHours || 0 }} </em><span>天</span>
              <span></span>
            </dd>
          </dl>
        </div>
        <dl class="dl-item">
          <dd
            @click="
              $router.push({
                name: 'queryHistory',
                query: { projectId: formData.projectId, page: 1 },
              })
            "
          >
            包含已确认补录人力成本<em
              v-money="{ value: queryPrice, precision: 2 }"
            ></em
            >元<a>查看></a>
          </dd>
        </dl>
      </div>
      <div class="dl-list">
        <dl class="dl-item">
          <dt><span>内部顾问预算</span></dt>
          <dd>
            <em v-money="{ value: insideBudget, precision: 2 }"></em
            ><span>元</span
            ><span>{{ projectConfirmCurrency || "人民币" }}</span>
          </dd>
        </dl>
        <dl class="dl-item">
          <dt><span>外部顾问预算</span></dt>
          <dd>
            <em v-money="{ value: outerConsultBudget, precision: 2 }"></em
            ><span>元</span
            ><span>{{ projectConfirmCurrency || "人民币" }}</span>
          </dd>
        </dl>
      </div>
      <div class="dl-list">
        <dl class="dl-item">
          <dt><span>已确认人力成本</span></dt>
          <dd>
            <em
              v-money="{
                value: externalConsultants + internalConsultant,
                precision: 2,
              }"
            ></em
            ><span>元</span
            ><span>{{ projectConfirmCurrency || "人民币" }}</span>
            <em
              ><span>=</span><span>外部顾问已确认人力成本</span
              ><em
                v-money="{ value: externalConsultants || 0, precision: 2 }"
                >{{ externalConsultants || 0 }}</em
              ><span>{{ projectConfirmCurrency || "人民币" }}</span
              ><span>+</span><span>内部顾问已确认人力成本</span
              ><em v-money="{ value: internalConsultant || 0, precision: 2 }">{{
                internalConsultant || 0
              }}</em
              ><span>{{ projectConfirmCurrency || "人民币" }}</span></em
            >
          </dd>
        </dl>
      </div>
      <div class="operating-box">
        <div class="dl-list">
          <dl class="dl-item">
            <dt>所属组</dt>
            <dd>
              <el-select
                v-model="projectTeamId"
                placeholder="请选择"
                filterable
                style="width: 118px"
                @change="changeList"
                popper-class="tl-select-dropdown"
                class="tl-select"
              >
                <el-option label="全部" value=""> </el-option>
                <el-option
                  v-for="(item, index) in teamList"
                  :key="index"
                  :label="item.projectTeamName"
                  :value="item.projectTeamId"
                >
                </el-option>
              </el-select>
            </dd>
          </dl>
          <dl class="dl-item">
            <dt>团队成员</dt>
            <dd>
              <el-select
                v-model="userId"
                placeholder="请选择"
                filterable
                style="width: 140px"
                @change="searchList"
                popper-class="tl-select-dropdown"
                class="tl-select"
              >
                <el-option label="全部" value=""> </el-option>
                <el-option
                  v-for="(item, index) in options"
                  :key="index"
                  :label="item.userName"
                  :value="item.userId"
                >
                </el-option>
              </el-select>
            </dd>
          </dl>
        </div>
      </div>
      <tl-crcloud-table
        :total="total"
        :currentPage.sync="currentPage"
        :pageSize.sync="pageSize"
        @searchList="searchList"
      >
        <div slot="tableContainer" class="table-container project-members">
          <el-table :data="tableData" class="tl-table" row-key="index">
            <el-table-column prop="applyTime" label="团队成员" min-width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.userName }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="userPost" label="职能" min-width="150">
              <template slot-scope="scope">
                <span>{{ getName(scope.row.userPost, funcList) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="userLevel" label="职级" min-width="100">
              <template slot-scope="scope">
                <span>{{ getName(scope.row.userLevel, levelList) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ldapType" label="成员类型" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.ldapType == 'Contractor'">外部</span>
                <span v-if="scope.row.ldapType == 'OTHER'">其他</span>
                <span v-if="scope.row.ldapType == 'Full-Time'">内部</span>
                <span v-if="!scope.row.ldapType">--</span>
              </template>
            </el-table-column>
            <el-table-column
              label="所属组"
              prop="projectTeamName"
              min-width="120"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.projectTeamName">{{
                  scope.row.projectTeamName
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              label="已审批工时"
              prop="approvedTimeSum"
              min-width="120"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.approvedTimeSum }} 天</span>
              </template>
            </el-table-column>
            <el-table-column
              label="待审批工时"
              prop="pendingApprovalTimeSum"
              min-width="120"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.pendingApprovalTimeSum }} 天</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="submitTime"
              label="最新提交时间"
              min-width="180"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.submitTime">{{
                  scope.row.submitTime
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="80"
              v-if="tableData.length > 0"
            >
              <template slot-scope="scope">
                <el-button @click="goTo(scope.row)" type="text" class="tl-btn"
                  >工时管理</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </tl-crcloud-table>
    </div>

    <tl-approval
      ref="approval"
      v-if="showApproval"
      :server="server"
      @success="approvalSuccess"
    ></tl-approval>
    <tl-approval-detail
      ref="approvalDetail"
      v-if="showApprovalDetail"
      :server="server"
    ></tl-approval-detail>
    <tl-hours-history ref="hoursHistory"></tl-hours-history>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import crcloudTable from '@/components/crcloudTable';
import approval from './components/approval';
import approvalDetail from './components/approvalDetail';
import hoursHistory from './components/hoursHistory';
import Server from '../server';
import CONST from '../const';

const server = new Server();
export default {
  name: 'mainHours',
  data() {
    return {
      weekLine: [],
      userId: '',
      monDayList: [
        '周一',
        '周二',
        '周三',
        '周四',
        '周五',
        '周六',
        '周日',
      ],
      options: [],
      weekBegin: '',
      startTime: '',
      checkItem: {},
      CONST,
      server,
      keyWord: '',
      total: 0,
      currentPage: 1,
      pageSize: 10,
      showApproval: false,
      showApprovalDetail: false,
      tableData: [],
      textMay: [],
      timeMay: [],
      checkList: [],
      showPop: false,
      projectList: [],
      formData: {
        projectId: '',
        approvalStatus: '',
      },
      projectBudgetAmount: 0,
      projectBudgetCurrency: '',
      projectConfirmAmount: 0,
      projectConfirmCurrency: '',
      actualSubmissionHours: 0,
      workList: [],
      closeProject: 0,
      listDis: [],
      week: '',
      projectUserSum: 0,
      submissionHours: 0,
      isTalent: false,
      levelList: [],
      funcList: [],
      companyList: [],
      internalConsultant: 0,
      externalConsultants: 0,
      insideBudget: 0,
      outerConsultBudget: 0,
      queryPrice: 0,
      teamList: [],
      projectTeamId: '',
      projectName: '',
    };
  },

  components: {
    'tl-crcloud-table': crcloudTable,
    'tl-approval': approval,
    'tl-approval-detail': approvalDetail,
    'tl-hours-history': hoursHistory,
  },
  props: {},
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  mounted() {
    this.getCode();
    this.projectPageList();
    this.getWeekDate();
  },
  methods: {
    goToHours() {
      this.$router.push({ path: '/HoursJoin', query: { projectId: this.formData.projectId } });
    },
    getMoneyPrice() {
      this.server.querySupplementHistory({ projectId: this.formData.projectId }).then((res) => {
        const list = res.data;
        this.queryPrice = 0;
        list.forEach((item) => {
          this.queryPrice += item.laborCost;
        });
      });
    },
    showHistory() {
      this.$refs.hoursHistory.show(this.formData.projectId);
    },
    getName(code, arr) {
      let name = arr.filter((item) => item.value == code);
      if (name.length == 0) {
        name = [{ meaning: '' }];
      }
      return name[0].meaning;
    },
    getCode() {
      this.server.queryByCodes({
        codes: ['PROJECT_TECH_TYPE', 'PROJECT_EMPLOYEE_LEVEL', 'PROJECT_EMPLOYEE_COMPANY'],
      }).then((res) => {
        if (res.code == '200') {
          this.codes = res.data;
          this.codes.forEach((item) => {
            switch (item.code) {
              case 'PROJECT_EMPLOYEE_LEVEL':
                this.levelList = item.subList;
                break;
              case 'PROJECT_TECH_TYPE':
                this.funcList = item.subList;
                break;
              case 'PROJECT_EMPLOYEE_COMPANY':
                this.companyList = item.subList;
                break;
              default:
                break;
            }
          });
        }
      });
    },
    getWeekDate() {
      const oneDate = 24 * 60 * 60 * 1000;
      const prevDate = new Date().getTime() - oneDate * 6;
      const date = this.dateFormat('YYYY-mm-dd', new Date(prevDate));
      console.log(date);
      this.server.getCalendar({ date }).then((res) => {
        // eslint-disable-next-line max-len
        const indexs = res.data.findIndex((item) => new Date(item.weekBegin.replace(/-/g, '/')).getTime() <= prevDate && prevDate < (new Date(item.weekEnd.replace(/-/g, '/')).getTime() + oneDate));
        console.log(new Date('2020-12-27'.replace(/-/g, '/')).getTime());

        if (indexs) {
          this.week = `${this.dateFormat('mm月dd日', res.data[indexs].weekBegin)}至${this.dateFormat('mm月dd日', res.data[indexs].weekEnd)}`;
        }
      });
    },
    goTo(row) {
      this.$router.push({ name: 'approvalList', query: { userId: row.userId, projectId: this.formData.projectId } });
    },
    searchList() {
      this.server.projectUserTimeList({
        projectId: this.formData.projectId,
        userId: this.userId,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        projectTeamId: this.projectTeamId,
      }).then((res) => {
        this.tableData = res.data.content;
        this.total = res.data.total;
        this.pageSize = res.data.pageSize;
      });
    },
    changeProject(projectId) {
      const projectName = this.projectList.filter((item) => item.projectId == projectId)[0].projectNameCn;
      this.projectName = projectName;
      sessionStorage.setItem('projectName', projectName);
      sessionStorage.setItem('projectId', this.formData.projectId);
      this.closeProject = this.projectList.filter((item) => item.projectId == projectId)[0].projectStatus;
      this.userId = '';
      this.timeSheetList();

      this.searchList();
      this.getMoneyPrice();
      this.queryProjectTeam();
    },
    summaryList() {
      this.server.queryTeamUser({ projectId: this.formData.projectId, projectTeamId: this.projectTeamId }).then((res) => {
        if (res.code == 200) {
          this.options = res.data;
        }
      });
    },
    changeList() {
      this.userId = '';
      this.searchList();
      this.summaryList();
    },
    queryProjectTeam() {
      this.server.queryProjectTeam({
        projectId: this.formData.projectId,

      }).then((res) => {
        this.teamList = res.data;
      });
    },
    timeSheetList() {
      this.server.queryProjectCostUsed({

        projectId: this.formData.projectId,
      }).then((res) => {
        sessionStorage.setItem('costPrice', JSON.stringify(res.data));
        this.projectBudgetAmount = res.data.projectBudgetAmount || 0;
        this.projectBudgetCurrency = res.data.projectBudgetCurrency;
        this.projectConfirmAmount = res.data.projectConfirmAmount || 0;
        this.projectConfirmCurrency = res.data.projectConfirmCurrency;
        this.actualSubmissionHours = res.data.actualSubmissionHours;
        this.submissionHours = res.data.submissionHours;
        this.projectUserSum = res.data.projectUserSum;
        this.externalConsultants = res.data.externalConsultants;
        this.internalConsultant = res.data.internalConsultant;
        this.outerConsultBudget = res.data.outerConsultBudget;
        this.insideBudget = res.data.insideBudget;
      });
    },
    projectPageList() {
      this.isTalent = false;
      this.userInfo.roleList.forEach((item) => {
        if (item.roleCode == 'TENANT_ADMIN') {
          this.isTalent = true;
        }
      });
      this.server.getProject({
        currentPage: 1,
        pageSize: 9999,
        projectName: '',
        userAccount: this.isTalent ? '' : this.userInfo.userAccount,
      }).then((res) => {
        if (res.code == '200') {
          this.projectList = res.data;
          if (this.projectList.length > 0) {
            //  this.formData.projectId = this.projectList[0].projectId;
            const list = this.projectList.filter((item) => Number(item.projectCount) > 0);
            this.closeProject = this.projectList[0].projectStatus;
            console.log(list);
            if (list.length > 0) {
              this.formData.projectId = list[0].projectId;
            } else {
              this.formData.projectId = this.projectList[0].projectId;
            }
            if (this.$route.query.projectId) {
              this.formData.projectId = this.$route.query.projectId;
            }
            // eslint-disable-next-line no-trailing-spaces
            // eslint-disable-next-line max-len
            const projectName = this.projectList.filter((item) => item.projectId == this.formData.projectId)[0].projectNameCn;
            this.projectName = projectName;
            this.timeSheetList();
            this.summaryList();
            this.searchList();
            this.getMoneyPrice();
            this.queryProjectTeam();
          }
        }
      });
    },
  },

};
</script>
