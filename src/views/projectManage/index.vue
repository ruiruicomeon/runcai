<template>
  <div class="project-manage">
    <div class="operating-area">
      <div class="operating-box-group">
        <div class="operating-box">
          <el-button
            v-show="hasPower('project-create')"
            v-if="isTalent"
            :disabled="!codes.length > 0"
            type="primary"
            icon="el-icon-plus"
            @click="addProject"
            class="tl-btn amt-bg-slip"
            >创建虚拟项目</el-button
          >
        </div>
        <div class="operating-box">
          <div class="dl-group">
            <dl class="dl-item">
              <dt>项目状态</dt>
              <dd>
                <el-select
                  v-model="formData.projectStatus"
                  :popper-append-to-body="false"
                  popper-class="tl-select-dropdown"
                  class="tl-select has-bg w100"
                  @change="searchManage"
                >
                  <el-option
                    v-for="item in CONST.PROJECT_STATUS_LIST"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </dd>
            </dl>
            <dl class="dl-item">
              <dt>项目类型</dt>
              <dd>
                <el-select
                  v-model="formData.projectType"
                  :popper-append-to-body="false"
                  popper-class="tl-select-dropdown"
                  class="tl-select has-bg w120"
                  @change="searchManage"
                >
                  <el-option
                    v-for="item in CONST.PROJECT_TYPE_LIST"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </dd>
            </dl>
            <dl class="dl-item">
              <dt>投入类型</dt>
              <dd>
                <el-select
                  v-model="formData.projectInputTypeCode"
                  :popper-append-to-body="false"
                  popper-class="tl-select-dropdown"
                  class="tl-select has-bg w120"
                  @change="searchManage"
                >
                  <el-option
                    v-for="item in CONST.THROW_TYPE_LIST"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </dd>
            </dl>
            <dl class="dl-item">
              <dt>是否部门级项目</dt>
              <dd>
                <el-select
                  v-model="formData.projectOrgType"
                  :popper-append-to-body="false"
                  popper-class="tl-select-dropdown"
                  class="tl-select has-bg w100"
                  @change="searchManage"
                >
                  <el-option
                    v-for="item in CONST.PROJECT_ORG_TYPE_ARR"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </dd>
            </dl>
          </div>
          <el-input
            maxlength="64"
            @keyup.enter.native="searchManage"
            v-model="keyWord"
            placeholder="项目名称或项目经理"
            class="tl-input-search"
          >
            <i class="el-icon-search" slot="prefix" @click="searchManage"></i>
          </el-input>
          <el-button plain class="tl-btn light" @click="searchManage">
            搜索
          </el-button>
        </div>
      </div>
    </div>
    <div class="cont-area">
      <tl-crcloud-table
        :total="total"
        :currentPage.sync="currentPage"
        :pageSize.sync="pageSize"
        @searchList="searchManage"
      >
        <div slot="tableContainer" class="table-container">
          <el-table :data="tableData" class="tl-table">
            <el-table-column
              prop="projectNameCn"
              label="项目名称"
              min-width="180"
            >
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.projectNameCn)">{{
                  scope.row.projectNameCn
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="projectManager"
              label="项目经理"
              min-width="100"
            ></el-table-column>
            <el-table-column
              prop="projectStatus"
              label="项目状态"
              min-width="120"
            >
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.projectStatus)">
                  <i
                    :class="{
                      'el-icon-basketball1111': scope.row.projectStatus == '0',
                      'el-icon-basketball2222': scope.row.projectStatus == '1',
                    }"
                  ></i>
                  {{ CONST.PROJECT_STATUS_MAP[scope.row.projectStatus] }}</span
                >
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="projectOrgType"
              label="是否部门级项目"
              min-width="180"
            >
              <template slot-scope="scope">
                {{ CONST.PROJECT_ORG_TYPE[scope.row.projectOrgType] }}
              </template>
            </el-table-column>
            <!-- <el-table-column
              prop="projectBudget"
              label="项目总预算(元)"
              min-width="120"
            >
              <template slot-scope="scope">
                <em
                  v-money="{ value: scope.row.projectBudget, precision: 2 }"
                ></em>
              </template>
            </el-table-column> -->
            <el-table-column label="内部顾问预算(元)" min-width="140">
              <template slot-scope="scope">
                <em
                  v-money="{ value: scope.row.insideBudget, precision: 2 }"
                ></em>
              </template>
            </el-table-column>
            <el-table-column label="外部顾问预算(元)" min-width="140">
              <template slot-scope="scope">
                <em
                  v-money="{
                    value: scope.row.outerConsultBudget,
                    precision: 2,
                  }"
                ></em>
              </template>
            </el-table-column>
            <!-- <el-table-column
              prop="projectCurrency"
              label="币种"
              min-width="100"
            >
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.projectCurrency)">{{
                  scope.row.projectCurrency
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column> -->
            <el-table-column
              prop="projectUserCount"
              label="项目成员(位)"
              min-width="120"
            ></el-table-column>
            <el-table-column
              prop="projectBeginDate"
              label="开始时间"
              min-width="120"
            ></el-table-column>
            <el-table-column
              prop="projectEndDate"
              label="结束时间"
              min-width="120"
            >
            </el-table-column>
            <el-table-column
              prop="projectApplyDepName"
              label="申请部门"
              min-width="160"
            >
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.projectApplyDepName)">{{
                  scope.row.projectApplyDepName
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="projectType"
              label="项目类型"
              min-width="120"
            >
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.projectType)">{{
                  scope.row.projectType
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="projectInputType"
              label="投入类型"
              min-width="120"
            >
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.projectInputType)">{{
                  scope.row.projectInputType
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <!-- <el-table-column
              prop="projectApplyDate"
              label="申请时间"
              min-width="180"
            >
            </el-table-column> -->
            <el-table-column
              fixed="right"
              label="操作"
              width="100"
              v-if="tableData.length > 0"
            >
              <template slot-scope="scope">
                <el-button @click="manage(scope.row)" type="text" class="tl-btn"
                  >管理</el-button
                >
                <el-button
                  @click="setTime(scope.row)"
                  type="text"
                  class="tl-btn"
                  :disabled="scope.row.projectStatus == 1"
                  v-show="isTalent"
                  >设置</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </tl-crcloud-table>
    </div>
    <tl-create-manage
      ref="createUser"
      v-if="showCreateManage"
      :server="server"
      @success="addSuccess"
      :codes="codes"
    ></tl-create-manage>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import crcloudTable from '@/components/crcloudTable';
import createManage from './components/createManage';
import Server from './server';
import CONST from './const';

const server = new Server();
export default {
  name: 'projectManage',
  data() {
    return {
      CONST,
      server,
      formData: {
        projectStatus: '',
        projectInputTypeCode: '',
        projectType: '',
        keyWord: '',
      },
      keyWord: '',
      total: 0,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      showCreateManage: false,
      isTalent: false,
      codes: [],
    };
  },
  components: {
    'tl-crcloud-table': crcloudTable,
    'tl-create-manage': createManage,
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
    isTenantAdmin() {
      if (this.userInfo.roleList && this.userInfo.roleList.length > 0
       && this.userInfo.roleList[0].roleCode == 'TENANT_ADMIN') {
        return true;
      }
      return false;
    },
  },
  mounted() {
    this.server.queryByCodes({
      codes: ['PROJECT_TECH_TYPE', 'PROJECT_EMPLOYEE_LEVEL', 'PROJECT_EMPLOYEE_COMPANY'],
    }).then((res) => {
      if (res.code == '200') {
        this.codes = res.data;
      }
    });
    this.searchManage();
  },
  methods: {
    getprojectInfo(row) {
      sessionStorage.setItem('projectInfo', JSON.stringify(row));
    },

    searchManage() {
      this.isTalent = false;
      this.userInfo.roleList.forEach((item) => {
        if (item.roleCode == 'TENANT_ADMIN') {
          this.isTalent = true;
        }
      });
      const param = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        projectName: this.keyWord,
        projectStatus: this.formData.projectStatus,
        projectInputTypeCode: this.formData.projectInputTypeCode,
        projectTypeCode: this.formData.projectType,
        userAccount: this.isTalent ? '' : this.userInfo.userAccount,
        projectOrgType: this.formData.projectOrgType,
      };
      this.server.projectPageList(param).then((res) => {
        if (res.code == '200') {
          this.tableData = res.data.content;
          this.total = res.data.total;
        }
      });
    },
    addProject() {
      this.showCreateManage = true;
      this.$nextTick(() => {
        this.$refs.createUser.show();
      });
    },
    addSuccess() {
      this.showCreateManage = false;
      this.currentPage = 1;
      this.searchManage();
    },
    manage(data) {
      this.$router.push({
        name: 'projectDetail',
        query: {
          projectId: data.projectId,
        },
      });
    },
    setTime(row) {
      this.getprojectInfo(row);
      this.$router.push({
        name: 'hoursCollection',
        query: {
          projectId: row.projectId,
        },
      });
    },
  },
};
</script>