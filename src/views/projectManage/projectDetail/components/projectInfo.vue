<template>
  <div class="project-info">
    <div class="project-description">
      <dl>
        <dt>
          <span
            v-if="hasValue(baseInfo.projectStatus)"
            :class="{
              'is-ongoing': baseInfo.projectStatus == '0',
              'is-over': baseInfo.projectStatus == '1',
            }"
            >{{ CONST.PROJECT_STATUS_MAP[baseInfo.projectStatus] }}</span
          >
          <em>{{ `${baseInfo.projectNameCn || "--"}` }}</em>
          <el-dropdown trigger="click" v-show="baseInfo.projectStatus == '0'">
            <span class="el-dropdown-link">
              <i class="el-icon-more"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="closeProject"
                >结束项目</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </dt>
        <dd>
          <span>项目描述:</span>
          <p
            ref="projectDesc"
            id="projectDesc"
            :class="openFlag ? 'unfold' : 'fold'"
          >
            <em id="projectDescInside">{{
              `${baseInfo.projectDescription || "--"}`
            }}</em>
          </p>
          <!-- <div class="toggle-state" v-if="pWidth == emWidth">
            <span @click="openFlag = !openFlag">{{
              openFlag ? "收起" : "展开"
            }}</span
            ><i></i>
          </div> -->
        </dd>
      </dl>
      <div class="dl-list">
        <dl class="dl-item">
          <dt><span>项目经理</span></dt>
          <dd>
            <div class="user-info">
              <img
                v-if="hasValue(baseInfo.headUrl)"
                :src="baseInfo.headUrl"
                alt
              />
              <div v-else-if="baseInfo.projectManager" class="user-name">
                <em>{{
                  baseInfo.projectManager.substring(
                    baseInfo.projectManager.length - 2
                  )
                }}</em>
              </div>
            </div>
            <div class="user-name-txt">
              <em>{{ baseInfo.projectManager }}</em>
            </div>
          </dd>
        </dl>

        <dl class="dl-item">
          <dt><span>代理项目经理</span></dt>
          <dd>
            <em>{{ baseInfo.projectAgentManagerUserName }}</em>
            <tl-create-select
              v-if="baseInfo.projectAgentManagerUserId !== userInfo.userId"
              @getSelectUser="getSelectUser"
              @cancelSetAc="getSelectUser('')"
              :cancelSet="true"
              :btnText="baseInfo.projectAgentManagerUserName ? '修改' : '设置'"
              :selectId="baseInfo.projectAgentManagerUserId"
              placeholderText="请输入成员"
              :userList="setUseDai"
              :type="'user'"
            ></tl-create-select>
          </dd>
        </dl>
        <dl class="dl-item">
          <dt><span>项目所属部门</span></dt>
          <dd>
            <em v-if="hasValue(baseInfo.parentOrgName)">{{
              `${baseInfo.parentOrgName}-`
            }}</em>
            <em>{{ baseInfo.orgName }}</em>
          </dd>
        </dl>
        <dl class="dl-item">
          <dt><span>投入类型</span></dt>
          <dd>
            <em>{{ baseInfo.projectInputType || "--" }}</em>
          </dd>
        </dl>
        <!-- <dl class="dl-item">
          <dt><span>项目总预算</span></dt>
          <dd>
            <em v-money="{ value: baseInfo.projectBudget, precision: 2 }"></em
            ><span>元</span
            ><span>({{ baseInfo.projectCurrency || "人民币" }})</span>
          </dd>
        </dl> -->
        <dl class="dl-item">
          <dt><span>内部顾问预算</span></dt>
          <dd>
            <em v-money="{ value: baseInfo.insideBudget, precision: 2 }"></em
            ><span>元</span
            ><span>({{ baseInfo.projectCurrency || "人民币" }})</span>
          </dd>
        </dl>
        <dl class="dl-item">
          <dt><span>外部顾问预算</span></dt>
          <dd>
            <em
              v-money="{ value: baseInfo.outerConsultBudget, precision: 2 }"
            ></em
            ><span>元</span
            ><span>({{ baseInfo.projectCurrency || "人民币" }})</span>
          </dd>
        </dl>
        <dl class="dl-item project-type">
          <dt><span>项目类型</span></dt>
          <dd>
            <em>{{ baseInfo.projectType || "--" }}</em>
            <div v-if="baseInfo.projectSourceSystem == 'TENANT'">虚拟项目</div>
          </dd>
        </dl>
        <dl class="dl-item">
          <dt><span>申请时间</span></dt>
          <dd>
            <em>{{ baseInfo.projectApplyDate || "--" }}</em>
          </dd>
        </dl>
        <dl class="dl-item">
          <dt><span>项目时间</span></dt>
          <dd>
            <em>{{ baseInfo.projectBeginDate || "--" }}</em
            ><span>至</span><em>{{ baseInfo.projectEndDate || "--" }}</em>
          </dd>
        </dl>
      </div>
    </div>
    <div class="dl-card-panel project-members">
      <dt class="card-title">
        <em>项目成员</em
        ><el-button
          plain
          class="tl-btn"
          @click="addMembers"
          v-if="baseInfo.projectStatus == '0'"
          ><i class="el-icon-plus"></i><em>添加成员</em></el-button
        >
      </dt>
      <tl-crcloud-table :isPage="false">
        <div slot="tableContainer" class="table-container">
          <el-table :data="baseInfo.projectUserVoList" class="tl-table">
            <el-table-column prop="userName" label="姓名" min-width="130">
              <template slot-scope="scope">
                <div class="user-info">
                  <img
                    v-if="hasValue(scope.row.headUrl)"
                    :src="scope.row.headUrl"
                    alt
                  />
                  <div v-else-if="scope.row.userName" class="user-name">
                    <em>{{
                      scope.row.userName.substring(
                        scope.row.userName.length - 2
                      )
                    }}</em>
                  </div>
                </div>
                <div class="user-name-txt">
                  <em>{{ scope.row.userName }}</em>
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column label="项目经理" min-width="110">
              <template slot-scope="scope">
                <div
                  v-if="scope.row.projectUserType == '1'"
                  :class="{ 'is-focus': scope.row.projectUserType == '1' }"
                >
                  <i class="el-icon-medal"></i>
                  <span>项目经理</span>
                </div>
                <div
                  v-else-if="
                    scope.row.projectUserType == '0' &&
                    baseInfo.projectStatus == '0'
                  "
                  @click="setManager(scope.row)"
                >
                  <el-tooltip
                    effect="dark"
                    placement="top"
                    popper-class="tl-tooltip-popper"
                  >
                    <div slot="content">设置项目经理</div>
                    <span class="can-click">
                      <i class="el-icon-medal"></i>
                      <span>--</span>
                    </span>
                  </el-tooltip>
                </div>
                <div v-else>--</div>
              </template>
            </el-table-column> -->
            <el-table-column prop="userLevelName" label="级别" min-width="80">
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.userLevelName)">{{
                  scope.row.userLevelName
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column label="所属组" min-width="100"
              >>
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.projectTeamName)">{{
                  scope.row.projectTeamName
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>

            <el-table-column prop="orgName" label="所属部门" min-width="160">
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.orgName)">{{
                  scope.row.orgName
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="userPostName" label="职能" min-width="180">
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.userPostName)">{{
                  scope.row.userPostName
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="createDate" label="加入时间" min-width="180">
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.createDate)">{{
                  dateFormat("YYYY-mm-dd HH:MM:SS", scope.row.createDate)
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="userCompanyName"
              label="所属公司"
              min-width="170"
            >
              <template slot-scope="scope">
                <span v-if="hasValue(scope.row.userCompanyName)">{{
                  scope.row.userCompanyName
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="130"
              v-if="
                baseInfo.projectUserVoList &&
                baseInfo.projectUserVoList.length > 0
              "
            >
              <template slot-scope="scope">
                <el-button
                  v-if="
                    scope.row.projectUserType != '1' &&
                    baseInfo.projectStatus == '0'
                  "
                  @click="deleteMember(scope.row)"
                  type="text"
                  class="tl-btn"
                  style="margin-right: 10px"
                  >移除</el-button
                >
                <tl-create-select
                  :userList="queryList"
                  @getSelectId="getSelectId"
                  v-if="scope.row.projectTeamLeader !== scope.row.userId"
                  btnText="小组管理"
                  :removeBtn="true"
                  @changeTab="$emit('changeTab')"
                  :listData="scope.row"
                  placeholderText="请输入组名"
                  :selectId="scope.row.projectTeamId"
                ></tl-create-select>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </tl-crcloud-table>
    </div>
    <tl-add-member
      ref="addMember"
      v-if="showAddMember"
      :server="server"
      :codes="codes"
      @addSuccess="addSuccess"
      :model="true"
      :DisuserId="DisuserId"
    ></tl-add-member>
    <tl-check-manager
      ref="checkManager"
      v-if="checkManager"
      :server="server"
      :baseInfo="baseInfo"
      @checkSuccess="checkSuccess"
    ></tl-check-manager>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import crcloudTable from '@/components/crcloudTable';
import createSelect from '../../components/createSelect';
import addMember from './addMember';
import checkManager from './checkManager';
import CONST from '../../const';

export default {
  name: 'projectInfo',
  data() {
    return {
      CONST,
      total: 0,
      currentPage: 0,
      pageSize: 0,
      isTalentAdmin: false,
      showAddMember: false,
      checkManager: false,
      tableData: [],
      isManage: false,
      openFlag: false,
      codes: [],
      pWidth: '',
      emWidth: '',
      DisuserId: {},
      userList: [],
      setUseDai: [],
    };
  },
  components: {
    'tl-crcloud-table': crcloudTable,
    'tl-add-member': addMember,
    'tl-check-manager': checkManager,
    'tl-create-select': createSelect,
  },
  props: {
    server: {
      type: Object,
      default() {
        return {};
      },
    },
    baseInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    queryList: {
      type: Array,
      default() {
        return [];
      },
    },
    summaryList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      listenerWidth: (state) => state.listenerWidth,
    }),
  },
  mounted() {
    if (this.baseInfo.projectUserVoList) {
      this.setUseDai = JSON.parse(JSON.stringify(this.baseInfo.projectUserVoList));
      const indexs = this.baseInfo.projectUserVoList.findIndex((item) => item.userPost == 'Project-Mng');
      console.log(indexs);
      this.setUseDai.splice(indexs, 1);
      this.baseInfo.projectUserVoList.forEach((item) => {
        if (item.projectUserType == '1') {
          if (item.userId == this.userInfo.userId) {
            this.isManage = true;
          }
        }
      });
    } else {
      this.isManage = true;
    }
    this.server.queryByCodes({
      codes: ['PROJECT_TECH_TYPE', 'EMPLOYEE_COMPANY_INTERNAL', 'EMPLOYEE_COMPANY_PROVIDER', 'EMPLOYEE_LEVEL_INTERNAL', 'EMPLOYEE_LEVEL_PROVIDER'],
    }).then((res) => {
      if (res.code == '200') {
        this.codes = res.data;
      }
    });
  },
  methods: {
    getSelectUser(userId) {
      this.server.setProjectAgentManager({
        projectId: this.$route.query.projectId,
        userId,
      }).then((res) => {
        if (res.code == 200) {
          this.$emit('changeTab');
          this.$message.success('设置代理负责人成功');
        }
      });
    },
    getSelectId(row, id) {
      const params = {
        userId: row.userId,
        projectId: row.projectId,
        projectTeamId: id,
      };
      this.server.addUserProjectTeam(params).then((res) => {
        if (res.code == 200) {
          this.$emit('changeTab');
          this.$message.success('移动成功');
        }
      });
    },
    deleteMember(data) {
      this.$xconfirm({
        title: '删除确认',
        content: '是否确认删除该数据，删除将无法恢复',

      }).then(() => {
        this.server.removeProjectUser({
          projectId: data.projectId,
          userId: data.userId,
        }).then((res) => {
          if (res.code == 200) {
            this.searchProject();
          }
        });
      });
    },
    closeProject() {
      this.$xconfirm({
        title: '结束项目',
        content: '确定结束该项目吗?结束后将不可进行管理。',
      }).then(() => {
        this.server.closeProject({
          projectId: this.$route.query.projectId || '',
        }).then((res) => {
          if (res.code == '200') {
            this.$router.push({
              name: 'projectManage',
            });
          }
        });
      });
    },
    setManager(data) {
      const self = this;
      if (data.projectUserType == '0') {
        let managerName = '';
        self.baseInfo.projectUserVoList.forEach((item) => {
          if (item.projectUserType == '1') {
            managerName = item.userName;
          }
        });
        let content = '';
        if (managerName == '') {
          content = `是否设置「${data.userName}」为项目经理?`;
        } else {
          content = `当前项目已设置「${managerName}」为项目经理，是否替换成「${data.userName}」?`;
        }
        self.$xconfirm({
          title: '设置项目经理',
          content,
        }).then(() => {
          self.server.setProjectManager({
            userId: data.userId,
            projectId: data.projectId,
          }).then((res) => {
            if (res.code == '200') {
              // 1，进入项目详情页优先检测项目经理信息是否完整，如果不完整就弹框提示，让其在弹框中完善项目经理信息，否则不弹框
              // 2，设置完项目经理后，如果自己不是项目经理或者租户管理员就跳转项目管理列表，否则还在当前页
              let isManager = false;
              self.userInfo.roleList.forEach((item) => {
                if (item.roleCode == 'TENANT_ADMIN') {
                  isManager = true;
                }
              });
              if (data.userId == self.userInfo.userId) {
                isManager = true;
              }
              if (isManager == true) {
                self.searchProject();
              } else {
                self.$router.push({
                  name: 'projectManage',
                });
              }
              this.$forceUpdate();
            }
          });
        });
      }
    },
    addMembers() {
      this.showAddMember = true;
      this.$nextTick(() => {
        this.$refs.addMember.show();
      });
    },
    addSuccess() {
      this.showAddMember = false;
      this.searchProject();
    },
    checkSuccess() {
      this.checkManager = false;
      this.searchProject();
    },
    searchProject() {
      this.server.projectDetail({
        projectId: this.$route.query.projectId || '',
      }).then((res) => {
        if (res.code == '200') {
          this.baseInfo = res.data;

          this.isManage = false;
          this.DisuserId = {};
          if (this.baseInfo.projectUserVoList) {
            this.setUseDai = JSON.parse(JSON.stringify(this.baseInfo.projectUserVoList));
            const indexs = this.baseInfo.projectUserVoList.findIndex((item) => item.userPost == 'Project-Mng');
            console.log(indexs);
            this.setUseDai.splice(indexs, 1);
            this.baseInfo.projectUserVoList.forEach((item) => {
              this.DisuserId[item.userId] = true;
              if (item.projectUserType == '1') {
                if (item.userId == this.userInfo.userId) {
                  this.isManage = true;
                }
              }
            });
          }
        }
      });
    },
    userChange(userId) {
      this.baseInfo.projectUserVoList.forEach((element) => {
        if (element.userId == userId) {
          this.setManager(element);
        }
      });
    },
  },
  watch: {
    'baseInfo.projectDescription': {
      handler(val) {
        console.log(val);
        this.$nextTick(() => {
          this.pWidth = document.getElementById('projectDesc').clientWidth;
          this.emWidth = document.getElementById('projectDescInside').clientWidth;
        });
      },
    },
    'baseInfo.projectId': {
      handler() {
        let flag = false;
        if (this.baseInfo.projectUserVoList.length > 0) {
          this.setUseDai = JSON.parse(JSON.stringify(this.baseInfo.projectUserVoList));
          const indexs = this.baseInfo.projectUserVoList.findIndex((item) => item.userPost == 'Project-Mng');
          console.log(indexs);
          this.setUseDai.splice(indexs, 1);
          this.DisuserId = {};
          this.baseInfo.projectUserVoList.forEach((item) => {
            this.DisuserId[item.userId] = true;
            if (this.baseInfo.projectManagerCode.toLocaleLowerCase() == item.userAccount.toLocaleLowerCase()) {
              if (this.hasValue(item.userCompany) && this.hasValue(item.userLevel)) {
                flag = true;
              }
            }
            if (item.projectUserType == '1') {
              if (item.userId == this.userInfo.userId) {
                this.isManage = true;
              }
            }
          });
        } else {
          flag = false;
        }
        if (flag == false) {
          this.checkManager = true;
          this.$nextTick(() => {
            this.$refs.checkManager.show();
          });
        }
      },
    },
    listenerWidth: {
      handler(val) {
        console.log(val);
        this.pWidth = document.getElementById('projectDesc').clientWidth;
        this.emWidth = document.getElementById('projectDescInside').clientWidth;
      },
      deep: true,
    },
  },
};
</script>
<style lang="css">
.project-manager-select .el-input--suffix .el-input__inner {
  background: #f4f6f8;
  border: unset;
  margin-left: -15px;
  color: #685df1;
}
.project-manager-select .el-icon-arrow-up:before {
  content: unset;
}
.user-icon {
  z-index: 9999;
}
</style>