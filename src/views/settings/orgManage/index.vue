<template>
  <div class="organize-management">
    <div class="operating-area">
      <div class="operating-box">
        <div class="flex-auto">
          <el-form @keyup.enter.native="searchList()" class="tl-form">
            <el-form-item>
              <el-select
                v-model.trim="searchData.userType"
                placeholder="用户类型"
                :popper-append-to-body="false"
                clearable
                popper-class="tl-select-dropdown"
                class="tl-select"
              >
                <el-option
                  v-for="item in CONST.USER_TYPE_LIST"
                  :key="item.key"
                  :label="item.label"
                  :value="item.key"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model.trim="searchData.userStatus"
                placeholder="用户状态"
                :popper-append-to-body="false"
                clearable
                popper-class="tl-select-dropdown"
                class="tl-select"
              >
                <el-option
                  v-for="item in CONST.USER_STATUS_LIST"
                  :key="item.key"
                  :label="item.label"
                  :value="item.key"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                placeholder="输入姓名/账号/手机号"
                v-model.trim="searchData.keyWord"
                clearable
                class="tl-input"
              ></el-input>
            </el-form-item>
          </el-form>
          <el-button plain class="tl-btn" @click="searchList">查询</el-button>
        </div>
        <div class="operating-right">
          <el-button
            v-if="hasPower('tenant-user-add')"
            type="primary"
            icon="el-icon-plus"
            @click="createUser"
            class="tl-btn amt-bg-slip"
            >创建用户</el-button
          >
          <el-button
            v-if="hasPower('tenant-org-add')"
            type="primary"
            icon="el-icon-plus"
            @click="createDepart"
            class="tl-btn amt-bg-slip"
            >创建部门</el-button
          >
          <el-button
            v-if="hasPower('tenant-user-batch-import')"
            plain
            icon="el-icon-minus"
            @click="batchImport"
            class="tl-btn amt-border-slip"
          >
            批量导入
            <span class="lines"></span>
          </el-button>
          <!-- <el-button @click="showAddRoule">添加部门负责人</el-button> -->
        </div>
      </div>
    </div>
    <div class="cont-area">
      <div class="department-tree">
        <el-input
          placeholder="输入部门名称"
          v-model.trim="filterText"
          clearable
          class="tl-input"
        >
          <i class="el-icon-search el-input__icon" slot="prefix"></i>
        </el-input>
        <el-tree
          ref="organizeTree"
          :data="treeData"
          node-key="orgId"
          :default-expanded-keys="defaultExpandNode"
          :props="defaultProps"
          @node-click="searchList"
          :expand-on-click-node="false"
          :highlight-current="true"
          :filter-node-method="filterNode"
          class="tl-tree"
        >
          <div class="tree-title" slot-scope="{ node, data }">
            <em>{{ node.label }}</em>
            <el-dropdown v-show="showMenuOption(data)">
              <span class="el-dropdown-link">
                <i class="el-icon-more el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-if="hasPower('tenant-org-add')"
                  @click.native="createDepart(data, 'create')"
                  >创建部门</el-dropdown-item
                >
                <el-dropdown-item
                  v-if="hasPower('TNT_ORG_EDIT') && data.orgSource == 0"
                  @click.native="createDepart(data, 'edit')"
                  >编辑部门</el-dropdown-item
                >
                <el-dropdown-item
                  v-if="hasPower('TNT_ORG_EDIT') && data.orgSource == 0"
                  @click.native="deleteDepart(data)"
                  >删除</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-tree>
      </div>
      <crcloud-table
        :total="total"
        :pageSize.sync="pageSize"
        :currentPage.sync="currentPage"
        @searchList="searchList"
      >
        <div slot="tableContainer" class="table-container">
          <el-table v-loading="loading" :data="tableData" class="tl-table">
            <el-table-column
              min-width="200"
              align="left"
              prop="userId"
              label="用户ID"
            ></el-table-column>
            <el-table-column
              min-width="150"
              align="left"
              prop="userName"
              label="姓名"
            ></el-table-column>
            <el-table-column
              min-width="150"
              align="left"
              prop="userAccount"
              label="账号/LDAP账号"
            ></el-table-column>
            <el-table-column
              min-width="120"
              align="left"
              prop="userMobile"
              label="手机号"
            ></el-table-column>
            <el-table-column
              min-width="120"
              align="left"
              prop="orgName"
              label="所属部门"
            ></el-table-column>
            <el-table-column
              min-width="130"
              align="left"
              prop="agentOrgName"
              label="代理部门"
            >
              <template slot-scope="scope">
                <el-tooltip popper-class="tl-tooltip-popper" placement="top">
                  <span slot="content">{{ orgTip(scope.row.agentOrg) }} </span>
                  <span
                    type="text"
                    v-if="hasValue(scope.row.agentOrg)"
                    @click="showexistEdit(scope.row)"
                    >{{ changeOrgAndId(scope.row.agentOrg) }}</span
                  >
                </el-tooltip>
                <span v-if="!hasValue(scope.row.agentOrg)">
                  <el-button type="text" @click="showexistEdit(scope.row)"
                    >设置</el-button
                  >
                </span>
              </template>
            </el-table-column>
            <el-table-column min-width="100" align="left" label="部门负责人">
              <template slot-scope="scope">
                <div
                  @click="
                    hasPower('set-depart-leader') &&
                    hasPower('cancel-depart-leader')
                      ? queryOrgAdmin(scope.row)
                      : ''
                  "
                  style="cursor: pointer"
                >
                  <el-tooltip
                    popper-class="tl-tooltip-popper"
                    effect="dark"
                    content="部门负责人"
                    placement="top-start"
                  >
                    <i v-if="scope.row.leader" class="el-icon-user-solid">
                      <span>取消</span>
                    </i>
                  </el-tooltip>
                  <i v-if="!scope.row.leader" class="el-icon-user">
                    <span>设置</span>
                  </i>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              min-width="130"
              align="left"
              prop="agentOrgName"
              label="综合岗"
            >
              <template slot-scope="scope">
                <el-tooltip
                  effect="dark"
                  popper-class="tl-tooltip-popper"
                  placement="top"
                >
                  <span slot="content">
                    {{ orgTip(scope.row.teamAdmin) }}
                  </span>
                  <span
                    type="text"
                    style="cursor: pointer"
                    v-if="hasValue(scope.row.teamAdmin)"
                    @click="showSecretary(scope.row)"
                    >{{ changeOrgAndId(scope.row.teamAdmin) }}</span
                  >
                </el-tooltip>
                <span v-if="!hasValue(scope.row.teamAdmin)">
                  <el-button type="text" @click="showSecretary(scope.row)"
                    >设置</el-button
                  >
                </span>
              </template>
            </el-table-column>
            <el-table-column
              min-width="100"
              align="left"
              prop="userStatus"
              label="状态"
            >
              <template slot-scope="scope">
                <!-- 0：注册 1：LDAP 2：创建 -->
                <div v-if="scope.row.userType == '1'">--</div>
                <div v-else @click.capture.stop="dataChange(scope.row)">
                  <el-switch
                    active-value="0"
                    inactive-value="50"
                    v-model="scope.row.userStatus"
                    class="tl-switch"
                    :disabled="!hasPower('TNT_ORG_EDIT')"
                  ></el-switch>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              min-width="120"
              align="left"
              prop="userType"
              label="用户类型"
            >
              <template slot-scope="scope">
                <div>{{ CONST.USER_TYPE_MAP[scope.row.userType] }}</div>
              </template>
            </el-table-column>
            <el-table-column
              min-width="180"
              align="left"
              prop="createTime"
              label="创建时间"
            >
              <template slot-scope="scope">
                <div>
                  {{
                    scope.row.createTime
                      ? dateFormat(
                          "YYYY-mm-dd HH:MM:SS",
                          scope.row.createTime
                        )
                      : "--"
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              width="100px"
              align="left"
              prop="corpGroupName"
              label="操作"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  v-if="scope.row.userType == '2' && hasPower('TNT_ORG_EDIT')"
                  @click="editUser(scope.row)"
                  class="tl-btn"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  v-if="scope.row.userType == '2'"
                  @click="info(scope.row)"
                  class="tl-btn"
                  >详情</el-button
                >
                <div v-else>--</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </crcloud-table>
    </div>
    <!-- 创建部门 -->
    <create-department
      ref="createDepart"
      v-if="showcreateDepart"
      :exist.sync="showcreateDepart"
      :departOptionType="departOptionType"
      :treeData="treeData"
      :initDepartment="initDepartment"
      :server="server"
      @closeOrgDialog="closeOrgDialog"
    ></create-department>
    <!-- 创建用户 -->
    <create-user
      ref="createUser"
      v-if="showCreateUser"
      :treeData="treeData"
      :server="server"
      :userId="userId"
      :tenantName="tenantName"
      :globalOrgId="globalOrgId"
      @closeUserDialog="closeUserDialog"
    ></create-user>
    <!-- 编辑用户 -->
    <tl-edit-user
      v-if="showEditUser"
      :exist.sync="showEditUser"
      :treeData="treeData"
      :server="server"
      :userId="userId"
      :tenantName="tenantName"
      :globalOrgId="globalOrgId"
      @closeUserDialog="closeUserDialog"
    ></tl-edit-user>
    <!-- 用户详情 -->
    <tl-user-info
      v-if="showUserInfo"
      :exist.sync="showUserInfo"
      :treeData="treeData"
      :server="server"
      :userId="userId"
      :tenantName="tenantName"
      :globalOrgId="globalOrgId"
      @closeUserDialog="closeUserDialog"
    ></tl-user-info>
    <create-departOrg
      v-if="exist"
      :exist.sync="exist"
      :title="'添加部门负责人'"
      :treeData="treeData"
      @createLeader="createLeader"
    ></create-departOrg>
    <edit-departOrg
      v-if="existEdit"
      :exist.sync="existEdit"
      :title="'添加部门负责人'"
      :rowData="rowData"
      @createLeader="createLeader"
      @searchList="searchList"
    ></edit-departOrg>
    <set-secretary
      v-if="existSecretary"
      :exist.sync="existSecretary"
      :title="'设置综合岗'"
      :userData="userData"
      @setSecretary="setSecretary"
      @searchList="searchList"
    ></set-secretary>
  </div>
</template>

<script>

import createDepart from './components/createDepartment';
import editUser from './components/editUser';
import userInfo from './components/userInfo';
import createDepartOrg from './components/createDepartOrg';
import editDepartOrg from './components/editDepartOrg';
import setSecretary from './components/setSecretary';
import createUser from './components/createUser';
import Server from './server';
import CONST from './const';

const server = new Server();

export default {
  name: 'orgManage',
  components: {
    'create-department': createDepart,
    'create-user': createUser,
    'tl-edit-user': editUser,
    'tl-user-info': userInfo,
    'create-departOrg': createDepartOrg,
    'edit-departOrg': editDepartOrg,
    'set-secretary': setSecretary,
  },
  data() {
    return {
      exist: false,
      existEdit: false,
      isShow: false,
      rowData: [],
      server,
      CONST,
      globalOrgId: '',
      userId: '',
      loading: false,
      showEditUser: false,
      showUserInfo: false,
      defaultExpandNode: [],
      filterText: '',
      showcreateDepart: false,
      showCreateUser: false,
      tenantName: '',
      orgFullId: '',
      orgIdList: [],
      departOptionType: 'create',
      initDepartment: {},
      total: 0,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      searchData: {
        userType: '',
        userStatus: '',
        keyWord: '',
      },
      treeData: [],
      defaultProps: {
        children: 'sonTree',
        label: 'orgName',
      },
      userData: {},
      existSecretary: false,
    };
  },
  created() {
    this.getOrgTree();
  },
  computed: {
    showMenuOption() {
      return (menu) => {
        const arr = menu.orgFullId.split(':');
        if (arr.length < 3) {
          return false;
        }
        return true;
      };
    },
  },
  methods: {
    showAddRoule() {
      this.exist = true;
    },
    changeOrgAndId(data) {
      if (data) {
        const list = data.split(',');
        const orgName = list.map((item) => item.split('/')[0]);
        if (orgName.length > 2) {
          return `${orgName[0]},${orgName[1]}...`;
        }
        return orgName.join(',');
      }
    },
    orgTip(data) {
      if (data) {
        const list = data.split(',');
        const orgName = list.map((item) => item.split('/')[0]);
        return orgName.join(',');
      }
    },
    showexistEdit(row) {
      this.rowData = row;
      this.existEdit = true;
    },
    showSecretary(row) {
      this.userData = row;
      this.existSecretary = true;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.orgName.indexOf(value) !== -1;
    },
    createLeader(user) {
      this.server.setDepartLeader({
        tenantId: this.tenantId, userId: user.userId, orgId: user.orgId, roleCode: 'ORG_ADMIN',
      }).then((res) => {
        if (res.code == 200) {
          this.searchList();
        }
      });
    },
    setSecretary(user) {
      this.server.setDepartLeader({
        tenantId: this.tenantId, userId: user.userId, orgId: user.orgId, roleCode: 'ORG_ADMIN',
      }).then((res) => {
        if (res.code == 200) {
          this.searchList();
        }
      });
    },
    getOrgTree() {
      this.server.getOrg().then((res) => {
        if (res.code == 200) {
          this.treeData = res.data;
        }
        this.defaultExpandNode = [this.treeData[0].orgId];
        this.globalOrgId = this.treeData[0].orgId;
        this.tenantName = this.treeData[0].orgName;
        this.searchList();
      });
    },
    searchList(org) {
      if (org && org.orgId) { // 切换组织
        this.globalOrgId = org.orgId;
        this.searchData.userType = '';
        this.searchData.userStatus = '';
        this.searchData.keyWord = '';
        this.currentPage = 1;
        this.pageSize = 10;
      }
      this.setOrgIdList(this.globalOrgId);
      this.orgFullId = this.orgIdList.join(':');
      const params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        orgFullId: this.orgFullId,
        userType: this.searchData.userType,
        userStatus: this.searchData.userStatus,
        keyWord: this.searchData.keyWord,
      };
      this.server.getUserListByOrgId(params).then((res) => {
        if (res.code == 200) {
          this.total = res.data.total;
          this.currentPage = res.data.currentPage;
          this.pageSize = res.data.pageSize;
          this.tableData = res.data.content;
        }
      });
    },
    setOrgIdList(orgId) {
      // 遍历嵌套数组，转换为一维数组
      const queue = [...this.treeData];
      const result = [];
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const next = queue.shift();
        if (!next) {
          break;
        }
        result.push({
          orgId: next.orgId,
          orgName: next.orgName,
          orgParentId: next.orgParentId,
        });
        if (Array.isArray(next.sonTree)) {
          queue.push(...next.sonTree);
        }
      }
      this.orgIdList = [];
      this.getOrgIdList(result, orgId);
      this.orgIdList.reverse();
    },
    getOrgIdList(result, orgId) {
      let orgParentId = '';
      for (const org of result) {
        if (org.orgId == orgId) {
          orgParentId = org.orgParentId;
          this.orgIdList.push(org.orgId);
          this.getOrgIdList(result, orgParentId);
        }
      }
    },
    // 创建部门
    createDepart(depart, type) {
      this.departOptionType = type;
      depart.isShow = false;
      if (depart && depart.orgId) {
        this.initDepartment = depart;
        this.globalOrgId = depart.orgId;
      } else {
        this.initDepartment = {};
      }
      this.showcreateDepart = true;
      this.$nextTick(() => {
        if (type == 'create') {
          this.$refs.createDepart.show(depart);
        } else if (type == 'edit') {
          this.$refs.createDepart.show(depart);
        } else {
          this.$refs.createDepart.show();
        }
      });
    },
    deleteDepart(depart) {
      this.$xconfirm({
        title: '删除确认',
        content: '是否确认删除该数据，删除将无法恢复',

      }).then(() => {
        this.server.updateOrg({ orgId: depart.orgId, orgAvailable: 1 }).then((res) => {
          if (res.code == 200) {
            this.$message.success('部门删除成功');
            this.getOrgTree();
          }
        });
      });
    },
    // 创建/编辑用户
    createUser() {
      this.showCreateUser = true;
      this.$nextTick(() => {
        this.$refs.createUser.show();
      });
    },
    editUser(user) {
      if (user.userId) {
        this.userId = user.userId;
        this.$nextTick(() => {
          this.showEditUser = true;
        });
      }
    },
    info(user) {
      if (user.userId) {
        this.userId = user.userId;
        this.$nextTick(() => {
          this.showUserInfo = true;
        });
      }
    },
    // 关闭弹窗
    closeOrgDialog(data) {
      // 需要刷新则刷新页面;
      if (data.refreshPage) {
        this.getOrgTree();
        this.searchList();
      }
      this.showcreateDepart = false;
    },
    // 关闭弹窗
    closeUserDialog(data) {
      // 需要刷新页面;
      if (data.refreshPage) {
        this.searchList();
      }
      this.showCreateUser = false;
      this.showEditUser = false;
      this.showUserInfo = false;
    },
    // 批量导入
    batchImport() {

    },
    dataChange(user) {
      if (!this.hasPower('TNT_ORG_EDIT')) {
        return;
      }
      this.$confirm('确认更改用户状态？').then(() => {
        const params = {
          userStatus: user.userStatus == '0' ? '50' : '0', // 状态 0有效50：禁用
          userId: user.userId,
        };
        this.server.updateOrgUserStatus(params).then((res) => {
          if (res.code == 200) {
            this.searchList();
          }
        });
      });
    },
    // 检测是否已经有部门负责人
    queryOrgAdmin(user) {
      this.server.queryOrgAdmin({
        orgId: user.orgId,
      }).then((res) => {
        if (!res.data.userName) {
          this.setLeader(user);
        } else {
          const name = res.data.userName;
          this.setLeader(user, name);
        }
      });
    },
    // 设置负责人
    setLeader(user, name) {
      const option = user.leader ? 'removeDepartLeder' : 'setDepartLeader';
      let title;
      if (name) {
        title = user.leader ? `是否取消部门负责人${user.userName}?` : `当前部门已经设置${name}为部门负责人,是否设置${user.userName}为部门负责人，将覆盖？`;
      } else {
        title = user.leader ? `是否取消部门负责人${user.userName}?` : `是否设置${user.userName}为部门负责人？`;
      }

      this.$confirm(title).then(() => {
        this.server[option]({ userId: user.userId, orgId: user.orgId, roleCode: 'ORG_ADMIN' }).then((res) => {
          if (res.code == 200) {
            this.searchList();
          }
        });
      });
    },
    hoverDepart(depart) {
      depart.isShow = true;
    },
    outDepart(depart) {
      depart.isShow = false;
    },
  },
  watch: {
    filterText(val) {
      this.$refs.organizeTree.filter(val);
    },
  },
};
</script>