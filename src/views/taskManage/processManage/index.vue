<template>
  <div v-if="showpic" class="no-data">
    <div class="task-wait-bg"></div>
    <div class="task-wait-txt">更多功能敬请期待~</div>
  </div>
  <div v-else class="process-manage">
    <div class="operating-area">
      <div class="page-title">过程管理</div>
      <div class="operating-box">
        <dl class="dl-item">
          <dd>
            <el-select
              v-model="keyWord"
              placeholder="请选择使用范围"
              clearable
              class="tl-select"
              :popper-append-to-body="false"
              popper-class="tl-select-dropdown"
            >
              <el-option :value="1" label="团队使用">团队使用</el-option>
              <el-option :value="2" label="小范围使用">小范围使用</el-option>
              <el-option :value="3" label="个人使用">个人使用</el-option>
            </el-select>
          </dd>
        </dl>
        <el-button
          plain
          icon="el-icon-document-add"
          class="tl-btn amt-border-slip"
          @click="customProcess"
          ><em>新建任务过程</em><span class="lines"></span
        ></el-button>
      </div>
    </div>
    <div class="cont-area">
      <crcloud-table
        :total="total"
        :pageSize.sync="pageSize"
        :currentPage.sync="currentPage"
        @searchList="searchList"
      >
        <div slot="tableContainer" class="table-container">
          <el-table v-loading="loading" :data="tableData" class="tl-table">
            <el-table-column
              min-width="100px"
              align="left"
              prop="processName"
              label="任务过程"
            >
              <template slot-scope="scope">
                <span
                  class="can-click"
                  @click="editProcess(scope.row, 'detail')"
                  >{{ scope.row.processName }}</span
                >
              </template>
            </el-table-column>
            <el-table-column
              min-width="100px"
              align="left"
              prop="indexNumber"
              label="排序"
            ></el-table-column>
            <el-table-column
              min-width="100px"
              align="left"
              prop="processType"
              label="使用范围"
            >
              <template slot-scope="scope">
                <span>{{ processTypeMap[scope.row.processType] }}</span>
              </template>
            </el-table-column>
            <el-table-column
              min-width="100px"
              align="left"
              prop="enable"
              label="状态"
            >
              <template slot-scope="scope">
                <el-switch
                  :disabled="
                    (!roleCode.includes('ORG_ADMIN') &&
                      !roleCode.includes('TEAM_ADMIN') &&
                      scope.row.processType == 1) ||
                    (scope.row.processType == 2 &&
                      scope.row.createBy != userInfo.userId) ||
                    scope.row.innerType == 1
                  "
                  v-model.trim="scope.row.enable"
                  :active-text="scope.row.enable == 1 ? '启用' : '禁用'"
                  :active-value="1"
                  :inactive-value="0"
                  @change="updateEnable(scope.row)"
                  class="tl-switch"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column
              min-width="100px"
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
              width="130px"
              fixed="right"
              align="left"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  :disabled="
                    (!roleCode.includes('ORG_ADMIN') &&
                      !roleCode.includes('TEAM_ADMIN') &&
                      scope.row.processType == 1) ||
                    (scope.row.processType == 2 &&
                      scope.row.createBy != userInfo.userId) ||
                    scope.row.innerType == 1
                  "
                  type="text"
                  @click="editProcess(scope.row, 'edit')"
                  class="tl-btn"
                  >编辑</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </crcloud-table>
    </div>
    <tl-add-process
      ref="customProcess"
      :processObj="processObj"
      @closeAddProcess="closeAddProcess"
      v-if="showCustomProcess"
      :exist.sync="showCustomProcess"
    ></tl-add-process>

    <tl-edit-process
      ref="editProcess"
      v-if="showEditProcessDialog"
      :exist.sync="showEditProcessDialog"
      :server="server"
      :processObj="processObj"
      @closeDialog="closeDialog"
    ></tl-edit-process>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import editProcess from './components/editProcess';
import tlAddProcess from './components/addProcess';
import Server from './server';

const server = new Server();
const processTypeMap = {
  1: '团队使用',
  2: '小范围使用',
  3: '个人使用',
};
export default {
  name: 'dataDictionary',
  components: {
    tlAddProcess,
    tlEditProcess: editProcess,
  },
  data() {
    return {
      server,
      showCustomProcess: false,
      showEditProcessDialog: false,
      processObj: {},
      keyWord: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      loading: false,
      // codeId: '',
      optionType: 'create',
      processTypeMap,
      showpic: process.env.VUE_APP_PORTAL == 'https://talent.crcloud.com', // 展示图片
    };
  },
  created() {
    if (process.env.VUE_APP_PORTAL != 'https://talent.crcloud.com') {
      this.searchList();
    }
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      roleCode: (state) => state.roleCode,
    }),
  },
  methods: {
    searchList(params = { currentPage: 1 }) {
      console.log(this.keyWord);
      params.processType = this.keyWord;
      params.currentPage = this.currentPage;
      params.pageSize = this.pageSize;
      this.loading = true;
      this.server.queryTaskProcessList(params).then((res) => {
        if (res.code == 200) {
          this.total = res.data.total;
          this.currentPage = res.data.currentPage;
          this.pageSize = res.data.pageSize;
          this.tableData = res.data.content;
        }
        this.loading = false;
      });
    },
    customProcess(process) {
      this.optionType = 'create';
      if (process && process.processId) {
        this.optionType = 'edit';
        this.processObj = process;
        this.processId = process.processId;
      }
      this.showCustomProcess = true;
      this.$nextTick(() => {
        this.$refs.customProcess.show();
      });
    },
    closeAddProcess() {
      // 需要刷新则刷新页面;
      this.searchList();
      // this.showCustomProcess = false;
    },
    editProcess(process, type) {
      this.processObj = process;
      this.showEditProcessDialog = true;
      this.$nextTick(() => {
        this.$refs.editProcess.show(type);
      });
    },
    updateEnable(row) {
      this.server.updateEnable(row).then((res) => {
        if (res.code == 200) {
          if (res.data === false) {
            this.$xwarning({
              title: '您当前任务过程有任务项，不可禁用',
              content: '',
            });
          }
          this.searchList();
        }
      });
    },
    // *********************************************************

    closeDialog(data) {
      // 需要刷新则刷新页面;
      if (data.refreshPage) {
        this.searchList();
      }
      // this.showCustomProcess = false;
      // this.showEditProcessDialog = false;
    },
    clear() {
      this.searchList();
    },
  },
  watch: {
    keyWord: {
      handler() {
        this.searchList();
      },
    },
  },
};
</script>