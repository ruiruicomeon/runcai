<template>
  <el-drawer
    :wrapperClosable="false"
    :modal-append-to-body="true"
    :append-to-body="true"
    :visible.sync="visible"
    @closed="closed"
    :before-close="close"
    custom-class="custom-drawer edit-task"
    class="tl-drawer"
  >
    <div slot="title" class="flex-sb">
      <div class="drawer-title">任务</div>
    </div>
    <el-scrollbar>
      <div class="cont-box flex-sb">
        <el-form ref="dataForm" :model="formData" class="tl-form">
          <dl>
            <dt>
              <el-form-item
                prop="taskTitle"
                :rules="[
                  {
                    required: true,
                    trigger: 'blur',
                    message: '请输入任务标题',
                  },
                ]"
              >
                <el-input
                  :disabled="canEdit"
                  type="text"
                  placeholder="请输入任务标题"
                  v-model.trim="formData.taskTitle"
                  maxlength="100"
                  show-word-limit
                  class="tl-input"
                ></el-input>
              </el-form-item>
              <!-- 更多操作 -->
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  <i class="el-icon-more el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    @click.native="deleteTask"
                    :disabled="formData.taskStatus !== 0"
                    >删除</el-dropdown-item
                  >
                  <el-dropdown-item
                    @click.native="filedTask"
                    :disabled="formData.taskProgress != 100"
                    >任务归档</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </dt>
            <dd>
              <div>
                <span>创建时间：</span>
                <em>{{ formData.createTime }}</em>
              </div>
              <el-form-item label="指派给">
                <el-select
                  :disabled="canEdit"
                  v-model.trim="formData.taskUserId"
                  placeholder="添加执行人"
                  filterable
                  popper-class="tl-select-dropdown set-manage"
                  class="tl-select"
                >
                  <el-option
                    v-for="item in userList"
                    :key="item.userId"
                    :label="item.userName"
                    :value="item.userId"
                  >
                    <dl>
                      <dd>
                        <em>{{ item.userName }}</em>
                        <em v-if="item.userAccount">{{
                          `(${item.userAccount})`
                        }}</em>
                        <el-checkbox
                          v-model="item.checkStatus"
                          class="tl-checkbox"
                        ></el-checkbox>
                      </dd>
                    </dl>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="任务时间" prop="timeVal">
                <el-date-picker
                  :disabled="canEdit"
                  v-model.trim="timeVal"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  popper-class="tl-range-popper"
                  class="tl-range-editor"
                  :clearable="false"
                >
                  ></el-date-picker
                >
              </el-form-item>
              <el-form-item label="优先级" prop="taskLevel">
                <el-select
                  :disabled="canEdit"
                  v-model.trim="formData.taskLevel"
                  placeholder="请选择优先级"
                  class="tl-select"
                  popper-class="tl-select-dropdown"
                  :popper-append-to-body="false"
                >
                  <el-option
                    v-for="item in CONST.PRIORITY_LIST"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                    <tl-levelblock :value="item.value"></tl-levelblock>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="归属任务过程" prop="processId">
                <el-select
                  v-if="processList.length > 0"
                  :disabled="canEdit"
                  v-model.trim="formData.processId"
                  placeholder="请选择任务过程"
                  class="tl-select"
                  popper-class="tl-select-dropdown"
                  :popper-append-to-body="false"
                >
                  <el-option
                    v-for="item in processList"
                    :key="item.processId"
                    :label="item.processName"
                    :value="item.processId"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="时长统计">
                <span>{{ formData.timeSum }}</span>
              </el-form-item>
              <el-form-item label="当前进度">
                <div class="tl-progress-group">
                  <tl-process
                    :data="parseInt(formData.taskProgress, 10)"
                    :showNumber="false"
                    :width="55"
                    :marginLeft="6"
                  ></tl-process>
                  <el-slider
                    :disabled="canEdit"
                    v-model.trim="formData.taskProgress"
                    :step="1"
                    tooltip-class="slider-tooltip"
                    @change="showRemark = true"
                  ></el-slider>
                  <el-input-number
                    :disabled="canEdit"
                    v-model.trim="formData.taskProgress"
                    controls-position="right"
                    :min="0"
                    :max="100"
                    :step="1"
                    :precision="0"
                    class="tl-input-number"
                    @focus="showRemark = true"
                  ></el-input-number>
                  <span>%</span>
                </div>
              </el-form-item>
              <el-form-item
                v-if="showRemark"
                label="进度更新原因说明"
                prop="taskProgressRemark"
              >
                <el-input
                  :disabled="canEdit"
                  type="textarea"
                  :rows="3"
                  maxlength="220"
                  placeholder="请输入进度更新原因"
                  v-model="formData.taskProgressRemark"
                  show-word-limit
                  resize="none"
                  class="tl-textarea"
                ></el-input>
              </el-form-item>
              <el-form-item
                v-if="formData.taskProgress == 100"
                label="归属项目"
                prop="projectId"
                :rules="[
                  {
                    required: true,
                    trigger: 'blur',
                    message: '任务还未归属项目，请选择',
                  },
                ]"
              >
                <el-select
                  :disabled="canEdit"
                  v-model.trim="formData.projectId"
                  placeholder="请选择关联项目"
                  @change="projectChange(scope.row)"
                  class="tl-select"
                  popper-class="tl-select-dropdown"
                  :popper-append-to-body="false"
                >
                  <el-option
                    v-for="item in projectList"
                    :key="item.projectId"
                    :label="item.projectNameCn"
                    :value="item.projectId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="formData.taskProgress == 100"
                label="归属OKR"
                prop="okrDetailId"
                :rules="[
                  {
                    required: true,
                    trigger: 'blur',
                    message: '任务还未归属OKR，请选择',
                  },
                ]"
              >
                <el-select
                  :disabled="canEdit"
                  v-model.trim="formData.okrDetailId"
                  placeholder="请选择归属OKR"
                  class="tl-select"
                  popper-class="tl-select-dropdown"
                  :popper-append-to-body="false"
                >
                  <el-option
                    v-for="item in okrList"
                    :key="item.okrDetailId"
                    :label="item.okrDetailObjectKr"
                    :value="item.okrDetailId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="任务描述" prop="taskDesc">
                <el-input
                  placeholder="请输入任务描述"
                  :disabled="canEdit"
                  type="textarea"
                  :rows="5"
                  maxlength="800"
                  show-word-limit
                  v-model="formData.taskDesc"
                  resize="none"
                  class="tl-textarea"
                ></el-input>
              </el-form-item>
              <el-form-item label="附件">
                <ul v-if="canEdit">
                  <li v-if="formData.attachmentList.length == 0 && canEdit">
                    暂无文件
                  </li>
                  <li
                    v-for="file in formData.attachmentList"
                    :key="file.resourceId"
                  >
                    <i class="el-icon-document"></i>
                    <em>{{ file.resourceName }}</em>
                    <span @click="downFile(file)">下载</span>
                    <span
                      v-if="images_map[file.resourceType]"
                      @click="openFile(file)"
                      >预览</span
                    >
                    <!-- <span @click="deleteFile(index, file)">删除</span> -->
                  </li>
                </ul>
                <file-upload
                  v-if="!canEdit"
                  ref="fileUpload"
                  :fileList="fileList"
                  :limit="10"
                  :taskId="this.formData.taskId"
                  @change="fileChange"
                ></file-upload>
              </el-form-item>
            </dd>
          </dl>
        </el-form>
        <!-- 右侧 -->
        <div class="task-tab">
          <tl-tabs :current.sync="currentIndex" :tabMenuList="tabMenuList">
          </tl-tabs>
          <el-scrollbar>
            <div class="tab-cont" v-if="currentIndex === 0">
              <div class="tl-custom-timeline">
                <dl class="timeline-list">
                  <dd
                    v-for="(item, pindex) in historyList"
                    :key="item.createTime"
                  >
                    <div class="list-info">
                      <div class="list-title">{{ item.createTime }}</div>
                      <div
                        class="list-cont"
                        v-for="(content, cindex) in item.contentList"
                        :key="content.operationId"
                      >
                        <div
                          v-if="pindex == historyList.length - 1 && cindex == 0"
                        >
                          <em>{{ content.userName }}</em>
                          <span>创建了</span>
                        </div>
                        <div
                          v-else-if="pindex != historyList.length - 1"
                          class="operate-type"
                        >
                          <em>{{ content.userName }}</em>
                          <span v-if="content.contents.operate == 'ADD'"
                            >添加了</span
                          >
                          <span v-else-if="content.contents.operate == 'SET'"
                            >设置了</span
                          >
                          <span v-else-if="content.contents.operate == 'DELETE'"
                            >删除了</span
                          >
                        </div>
                        <div
                          class="operate-kind"
                          v-if="
                            pindex != historyList.length - 1 ||
                            content.contents.field != 'taskProgress'
                          "
                        >
                          <span>{{
                            CONST.FIEID_MAP[content.contents.field]
                          }}</span>
                          <span v-if="content.contents.field == 'taskProgress'">
                            {{ content.contents.value }}%</span
                          >
                          <span
                            v-else-if="content.contents.field == 'taskLevel'"
                          >
                            {{
                              CONST.PRIORITY_MAP[content.contents.value]
                            }}</span
                          >
                          <span v-else>{{ content.contents.value }}</span>
                        </div>
                      </div>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
            <div class="tab-cont" v-else>
              <div class="tl-custom-timeline">
                <dl class="timeline-list">
                  <dd v-for="item in updateList" :key="item.operationId">
                    <div class="list-info">
                      <div class="list-title">{{ item.createTime }}</div>
                      <div class="list-cont">
                        <div class="operate-type">
                          <span>操作人：</span>
                          <em>{{ item.userName }}</em>
                        </div>
                        <div class="operate-kind">
                          <span>更新进度为：</span>
                          <em>{{ item.contents.value }}%</em>
                        </div>
                        <div class="operate-kind">
                          <span>进度更新进度说明：</span>
                          <em>{{ item.contents.explain || "暂无" }}</em>
                        </div>
                      </div>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </el-scrollbar>
    <div class="operating-box">
      <div class="flex-auto">
        <el-button
          v-if="formData.taskStatus == 0"
          plain
          class="tl-btn amt-border-fadeout"
          @click="save"
          >暂存</el-button
        >
      </div>
      <el-button
        v-if="formData.taskStatus == 0"
        type="primary"
        class="tl-btn amt-bg-slip"
        @click="summitAssign"
        :loading="loading"
        >指派</el-button
      >
      <el-button
        v-else-if="formData.taskStatus != 0 && !canEdit"
        type="primary"
        class="tl-btn amt-bg-slip"
        @click="save"
        :loading="loading"
      >
        <span>确认</span>
      </el-button>
      <el-button
        v-if="formData.taskStatus == 10 && taskUserId == userInfo.userId"
        type="primary"
        class="tl-btn amt-bg-slip"
        @click="acceptTask"
        :loading="loading"
        >确认接收</el-button
      >
      <el-button plain class="tl-btn amt-border-fadeout" @click="close"
        >取消</el-button
      >
    </div>
    <img-dialog ref="imgDialog" width="75%" top="5vh"></img-dialog>
  </el-drawer>
</template>

<script>
import { mapState } from 'vuex';
import fileUpload from '@/components/fileUpload/index';
import process from '@/components/process';
import tabs from '@/components/tabs';
import imgDialog from '@/components/imgDialog';
import levelblock from '@/components/levelblock';
import Server from '../server';
import CONST from '../const';

const server = new Server();

export default {
  name: 'editTask',
  components: {
    'tl-process': process,
    'tl-tabs': tabs,
    'file-upload': fileUpload,
    'img-dialog': imgDialog,
    'tl-levelblock': levelblock,
  },
  data() {
    return {
      CONST,
      server,
      formData: {
        taskTitle: '',
        timeVal: [],
        taskLevel: 10,
        projectVal: {},
        taskProgressRemark: '',
        taskProgress: 0,
        timeSum: '当前已用时长 0天 0小时 0分',
        attachmentList: [],
      },
      timeVal: [],
      taskUserId: '', // 原执行人
      okrList: [], // 归属okr列表
      projectList: [], // 项目列表
      userList: [], // 执行人列表
      processList: [], // 过程列表
      showRemark: false,
      historyallList: [],
      historyList: [],
      updateList: [],
      visible: false,
      canEdit: true, // 是否能编辑
      loading: false,
      periodId: '',
      // tab
      currentIndex: 0,
      tabMenuList: [{
        menuName: '操作历史',
      },
      {
        menuName: '进度更新说明',
      }],
      // 文件
      fileList: [],
      acceptType: '.jpeg, .jpg, .png, .bmp, .gif, .tif, .word, .excel, .txt, .ppt, .pptx',
      images_map: {
        jpg: true,
        jpeg: true,
        png: true,
        bmp: true,
        gif: true,
      },
      // 富文本编辑器
      editorOption: {
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'image'], // toggled buttons
              [{ header: 1 }, { header: 2 }],
              [{ color: [] }],
            ], // 工具栏
          },
        },
      },
    };
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      orgFullId: (state) => state.orgFullId,
    }),
    action() {
      const origin = window.location.origin
        ? window.location.origin
        : window.location.href.split('/#')[0];
      return `${origin}/gateway/system-service/sys/attachment/upload`;
    },
    headers() {
      return { token: localStorage.token };
    },
  },

  created() {
    this.freshTime();
  },
  methods: {
    show(id, canedit) {
      this.visible = true;
      this.canEdit = canedit;
      this.getUserList();
      this.getOkrCycleList();
      this.getProjectList();
      if (id) {
        this.server.queryTaskDetail({ taskId: id }).then((res) => {
          if (res.code == 200 && res.data) {
            this.formData = res.data;
            this.getProcess(res.data.processId);

            this.taskUserId = this.formData.taskUserId;
            this.fileList = this.formData.attachmentList;
            if (res.data.taskBegDate) {
              this.timeVal = [this.dateFormat('YYYY-mm-dd', res.data.taskBegDate), this.dateFormat('YYYY-mm-dd', res.data.taskEndDate)];
            }
            if (this.formData.createTime) {
              const yearNum = this.dateFormat('YYYY', new Date()) - this.dateFormat('YYYY', this.formData.createTime);
              const mouthNum = this.dateFormat('mm', new Date()) - this.dateFormat('mm', this.formData.createTime);
              let dayNum = this.dateFormat('dd', new Date()) - this.dateFormat('dd', this.formData.createTime);
              let hourNum = this.dateFormat('HH', new Date()) - this.dateFormat('HH', this.formData.createTime);
              let minuteNum = this.dateFormat('MM', new Date()) - this.dateFormat('MM', this.formData.createTime);
              if (dayNum >= 0 && hourNum < 0) {
                hourNum = 1 * 24 + hourNum;
                dayNum -= 1;
              }
              if (hourNum >= 0 && minuteNum < 0) {
                minuteNum = 1 * 60 + minuteNum;
                hourNum -= 1;
              }
              const dateNum = yearNum * 365 + mouthNum * 30 + dayNum;
              this.formData.timeSum = `当前已用时长 ${dateNum}天 ${hourNum}小时 ${minuteNum}分`;
            }
            this.historyallList = res.data.operationList || [];
            this.updateList = [];
            let ctime = '';
            let timeCount = 0;
            this.historyallList.forEach((item, index) => {
              // 操作历史
              item.contents = JSON.parse(item.remark);
              if (index == 0) {
                ctime = item.createTime;
                this.historyList.push({
                  createTime: ctime,
                  contentList: [],
                });
              }
              if (ctime == item.createTime) {
                this.historyList[timeCount].contentList.push(item);
              } else {
                timeCount += 1;
                ctime = item.createTime;
                this.historyList.push({
                  createTime: ctime,
                  contentList: [item],
                });
              }
              // 进度更新
              if (item.operationType == 'taskProgress') {
                this.updateList.push(item);
              }
            });
          }
        });
      }
    },
    close() {
      this.visible = false;
    },
    closed() {
      this.$emit('update:existEditTask', false);
    },
    // 周期
    getOkrCycleList() {
      this.server.getOkrCycleList().then((res) => {
        if (res.code == 200) {
          // this.periodList = res.data || [];
          const periodList = res.data || [];
          const okrCycle = periodList.filter((item) => item.checkStatus == '1')[0] || {};
          this.periodId = okrCycle.periodId;
          this.queryOkr();
        }
      });
    },
    // 查询okr
    queryOkr() {
      const params = {
        myOrOrg: 'org',
        status: '1',
        orgId: this.userInfo.orgId,
        periodId: this.periodId,
      };
      this.server.getorgOkr(params).then((res) => {
        if (res.code == 200) {
          this.okrList = res.data.okrDetails || [];
        }
      });
    },
    // 查询执行人
    getUserList() {
      this.server.listOrgUserPage({ orgFullId: this.orgFullId }).then((res) => {
        if (res.code == 200) {
          this.userList = res.data || [];
        }
      });
    },
    // 查询过程
    getProcess(id) {
      this.server.queryProcess({
        currentPage: 1,
        pageSize: 1000,
        enable: 1,
        processId: id,
      }).then((res) => {
        if (res.code == 200) {
          this.processList = res.data.content || [];
        }
      });
    },
    // 查询项目
    getProjectList() {
      this.server.queryOrgProject().then((res) => {
        if (res.code == 200) {
          this.projectList = res.data || [];
        }
      });
    },
    // 时长统计
    freshTime() {
      this.timedInterval = setInterval(() => {
        this.timeSum();
      }, 30 * 1000);
    },
    // 时长计算
    timeSum() {
      if (this.formData.createTime) {
        const yearNum = this.dateFormat('YYYY', new Date()) - this.dateFormat('YYYY', this.formData.createTime);
        const mouthNum = this.dateFormat('mm', new Date()) - this.dateFormat('mm', this.formData.createTime);
        let dayNum = this.dateFormat('dd', new Date()) - this.dateFormat('dd', this.formData.createTime);
        let hourNum = this.dateFormat('HH', new Date()) - this.dateFormat('HH', this.formData.createTime);
        let minuteNum = this.dateFormat('MM', new Date()) - this.dateFormat('MM', this.formData.createTime);
        if (dayNum >= 0 && hourNum < 0) {
          hourNum = 1 * 24 + hourNum;
          dayNum -= 1;
        }
        if (hourNum >= 0 && minuteNum < 0) {
          minuteNum = 1 * 60 + minuteNum;
          hourNum -= 1;
        }
        const dateNum = yearNum * 365 + mouthNum * 30 + dayNum;
        this.formData.timeSum = `当前已用时长 ${dateNum}天 ${hourNum}小时 ${minuteNum}分`;
        this.$forceUpdate();
      } else {
        this.formData.timeSum = '当前已用时长 0天 0小时 0分';
      }
    },
    // --------文件---------
    fileChange(data) {
      this.formData.attachmentList = data.list;
      console.log(data);
    },
    // 下载or预览
    openFile(fileObj) {
      const images = {
        jpg: true,
        jpeg: true,
        png: true,
        bmp: true,
        gif: true,
      };
      if (images[fileObj.resourceType]) {
        this.$refs.imgDialog.show(fileObj.resourceUrl);
      }
    },
    // 下载
    downFile(fileObj) {
      const origin = window.location.origin
        ? window.location.origin
        : window.location.href.split('/#')[0];
      const url = `${origin}/gateway/system-service/sys/attachment/outside/download?resourceId=${fileObj.resourceId}&sourceType=TASK&sourceKey=${this.formData.taskId}`;
      window.open(url);
    },
    // eslint-disable-next-line no-unused-vars
    deleteFile(index, fileObj) {
      // this.server.removeFile({ resourceId: fileObj.resourceId, taskId: this.formData.taskId }).then();
      if (this.formData.attachmentList.length > 0) {
        this.formData.attachmentList.splice(index, 1);
      }
    },
    // 保存任务
    async save() {
      let checkres = {};
      if (this.formData.taskUserId && this.formData.processId) {
        const checkparams = {
          userId: this.formData.taskUserId,
          processId: this.formData.processId,
        };
        checkres = await this.server.checkUserInProcess(checkparams);
      } else {
        checkres.data = {};
        checkres.data.inProcess = true;
      }

      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          const userVal = this.userList.filter((item) => item.userId == this.formData.taskUserId)[0] || {};
          if (checkres.data.inProcess) {
            const okrVal = this.okrList.filter((item) => item.okrDetailId == this.formData.okrDetailId)[0] || {};
            const projectVal = this.projectList.filter((item) => item.projectId == this.formData.projectId)[0] || {};
            this.formData.okrDetailName = okrVal.okrDetailObjectKr;
            this.formData.userName = userVal.userName;
            if (projectVal) {
              this.formData.projectId = projectVal.projectId;
              this.formData.projectName = projectVal.projectNameCn;
            }

            if (this.timeVal) {
              this.formData.taskBegDate = this.timeVal[0] ? `${this.timeVal[0]}  00:00:00` : null;
              this.formData.taskEndDate = this.timeVal[1] ? `${this.timeVal[1]}  23:59:59` : null;
            }
            // this.formData.attachmentList = this.fileList;
            this.loading = true;
            this.server.saveTask(this.formData).then((res) => {
              if (res.code == 200) {
                this.$message.success('保存成功');
                this.close();
                this.$emit('success');
              }
              this.loading = false;
            });
          } else {
            const processVal = this.processList.filter((item) => item.processId == this.formData.processId)[0] || {};
            this.$xconfirm({
              content: '',
              title: `执行人「${userVal.userName}」无任务过程「${processVal.processName}」的使用权限，请重新选择或在「过程管理」中为其添加权限`,
            });
          }
        }
      });
    },
    deleteTask() {
      this.$xconfirm({
        content: '确定要删除这个任务吗？',
        title: '删除任务',
      }).then(() => {
        // 提交确认弹窗
        this.server.deleteTask({ taskId: this.formData.taskId }).then((res) => {
          if (res.code == 200) {
            this.$message.success('删除成功');
            this.close();
            this.$emit('success');
          }
        });
      }).catch(() => {});
    },
    filedTask() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$xconfirm({
            content: '',
            title: '确定要将该任务归档吗？',
          }).then(() => {
            this.server.filedTask({ taskId: this.formData.taskId }).then((res) => {
              if (res.code == 200) {
                this.$message.success('归档成功');
                this.close();
                this.$emit('success');
              }
            });
          }).catch(() => {});
        }
      });
    },
    acceptTask() {
      this.loading = true;
      this.server.acceptTask({ taskId: this.formData.taskId }).then((res) => {
        if (res.code == 200) {
          this.$message.success('接收成功');
          this.close();
          this.$emit('success');
        }
        this.loading = false;
      });
    },
    async summitAssign() {
      if (!this.formData.taskUserId) {
        this.$message.error('请选择执行人');
        return;
      }
      let checkres = {};
      if (this.formData.processId) {
        const checkparams = {
          userId: this.formData.taskUserId,
          processId: this.formData.processId,
        };
        checkres = await this.server.checkUserInProcess(checkparams);
      } else {
        checkres = {
          data: {
            inProcess: true,
          },
        };
      }

      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          const userVal = this.userList.filter((item) => item.userId == this.formData.taskUserId)[0] || {};
          if (checkres.data.inProcess) {
            const okrVal = this.okrList.filter((item) => item.okrDetailId == this.formData.okrDetailId)[0] || {};
            this.formData.okrDetailName = okrVal.okrDetailObjectKr;
            this.formData.userName = userVal.userName;
            if (this.formData.projectVal) {
              this.formData.projectId = this.formData.projectVal.projectId;
              this.formData.projectName = this.formData.projectVal.projectNameCn;
            }

            if (this.timeVal) {
              this.formData.taskBegDate = this.timeVal[0] ? `${this.timeVal[0]}  00:00:00` : null;
              this.formData.taskEndDate = this.timeVal[1] ? `${this.timeVal[1]}  23:59:59` : null;
            }
            // this.formData.attachmentList = this.fileList;
            this.loading = true;
            this.server.appointSave(this.formData).then((res) => {
              if (res.code == 200) {
                this.$message.success('指派成功');
                this.$emit('success');
                this.close();
              }
              this.loading = false;
            });
          } else {
            const processVal = this.processList.filter((item) => item.processId == this.formData.processId)[0] || {};
            this.$xconfirm({
              content: '',
              title: `执行人「${userVal.userName}」无任务过程「${processVal.processName}」的使用权限，请重新选择或在「过程管理」中为其添加权限`,
            });
          }
        }
      });
    },
  },
  beforeDestroy() {
    clearInterval(this.timedInterval);
  },
  watch: {
    'formData.taskUserId': {
      handler(newVal) {
        if (newVal) {
          this.userList.forEach((item) => {
            if (newVal == item.userId) {
              item.checkStatus = true;
            } else {
              item.checkStatus = false;
            }
          });
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>