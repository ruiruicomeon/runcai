<template>
  <div class="task-sum">
    <dl class="task-statistical">
      <dt>
        <span>当前任务汇报时间：</span><em>{{ weekName }}</em>
        <em>{{ weekBegin }}</em>
        <span>~</span>
        <em>{{ weekEnd }}</em>
      </dt>
      <dd><span>温馨提示：仅统计当前周时间段内的所有工作任务</span></dd>
    </dl>

    <!-- 我负责的 -->
    <el-table :data="owntableData" class="tl-table" v-loading="loading">
      <el-table-column
        min-width="100px"
        align="left"
        prop="taskTitle"
        label="我负责的"
      >
        <template slot-scope="scope">
          <a @click="openEdit(scope.row.taskId)">{{ scope.row.taskTitle }}</a>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        prop="createByUserName"
        label="创建人"
      ></el-table-column>
      <el-table-column
        min-width="100px"
        align="left"
        prop="createTime"
        label="时长统计"
      >
        <template slot-scope="scope">
          <div>{{ computedTime(scope.row.createTime) }}</div>
        </template>
      </el-table-column>
      <el-table-column align="left" prop="processName" label="过程">
        <template slot-scope="scope">
          <div v-if="scope.row.processName && scope.row.stepName">
            <p>{{ scope.row.processName }}</p>
            <p>{{ scope.row.stepName }}</p>
          </div>
          <div v-else>未设置任务过程</div>
        </template>
      </el-table-column>
      <el-table-column align="left" prop="taskStatus" label="状态">
        <template slot-scope="scope">
          <i
            :class="
              ({ 'is-draft': scope.row.taskStatus == '0' },
              { 'not-confirm': scope.row.taskStatus == '10' },
              { 'is-confirm': scope.row.taskStatus == '20' })
            "
          ></i>
          <span>{{ CONST.TASK_STATUS_MAP[scope.row.taskStatus] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" prop="taskProgress" label="进度">
        <template slot-scope="scope">
          <tl-process :data="parseInt(scope.row.taskProgress, 10)"></tl-process>
        </template>
      </el-table-column>
    </el-table>
    <!-- 我指派的 -->
    <el-table :data="assigntableData" class="tl-table" v-loading="loading">
      <el-table-column
        min-width="100px"
        align="left"
        prop="taskTitle"
        label="我指派的"
      >
        <template slot-scope="scope">
          <a @click="openEdit(scope.row.taskId)">{{ scope.row.taskTitle }}</a>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        prop="createByUserName"
        label="创建人"
      ></el-table-column>
      <el-table-column
        min-width="100px"
        align="left"
        prop="createTime"
        label="时长统计"
      >
        <template slot-scope="scope">
          <div>{{ computedTime(scope.row.createTime) }}</div>
        </template></el-table-column
      >
      <el-table-column align="left" prop="processName" label="过程">
        <template slot-scope="scope">
          <div v-if="scope.row.processName && scope.row.stepName">
            <p>{{ scope.row.processName }}</p>
            <p>{{ scope.row.stepName }}</p>
          </div>
          <div v-else>未设置任务过程</div>
        </template>
      </el-table-column>
      <el-table-column align="left" prop="taskStatus" label="状态">
        <template slot-scope="scope">
          <span>{{ CONST.TASK_STATUS_MAP[scope.row.taskStatus] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" prop="userName" label="进度">
        <template slot-scope="scope">
          <tl-process :data="parseInt(scope.row.taskProgress, 10)"></tl-process>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" @click="submit" class="tl-btn amt-bg-slip"
      >任务汇总到周报</el-button
    >
  </div>
</template>

<script>
import { mapState } from 'vuex';
import process from '@/components/process';
import CONST from '../const';
import Server from '../server';

const server = new Server();

export default {
  name: 'taskSum',
  components: {
    'tl-process': process,
  },
  data() {
    return {
      CONST,
      server,
      pageSize: 10,
      currentPage: 1,
      totalpage: 0,
      tableData: [],
      owntableData: [],
      assigntableData: [],
      monthDate: this.dateFormat('YYYY-mm-dd', new Date()), // 初始化日期
      weekBegin: '',
      weekEnd: '',
      weekName: '',
      loading: false,
      tableListown: [{
        titleLabel: '我负责的',
        userLabel: '创建人',
        createLabel: '时长统计',
        processLabel: '过程',
        statusLabel: '状态',
        progressLabel: '进度',
        tableData: [],
      }],
      tableListassign: [{
        titleLabel: '我指派的',
        userLabel: '创建人',
        createLabel: '时长统计',
        processLabel: '过程',
        statusLabel: '状态',
        progressLabel: '进度',
        tableData: [],
      }],
    };
  },
  props: {

  },
  created() {
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
  },
  methods: {
    show(weekBegin, weekEnd) {
      this.weekBegin = weekBegin;
      this.weekEnd = weekEnd;
      this.getTableList();
    },
    getTableList() {
      const params = {
        weekBegin: this.weekBegin,
        weekEnd: this.weekEnd,
      };
      this.loading = true;
      this.server.selectTaskForWeek(params).then((res) => {
        if (res.code == 200) {
          this.tableData = res.data || [];
          this.owntableData = [];
          this.assigntableData = [];
          // this.tableListown[0].tableData = [];
          // this.tableListassign[0].tableData = [];
          this.tableData.forEach((item) => {
            if (item.taskUserId == this.userInfo.userId && item.taskStatus !== 0) {
              this.owntableData.push(item);
              // this.tableListown[0].tableData.push(item);
            }
            if (item.createBy == this.userInfo.userId && item.taskStatus !== 0) {
              this.assigntableData.push(item);
              // this.tableListassign[0].tableData.push(item);
            }
          });
        }
        this.loading = false;
      });
    },
    computedTime(row) {
      if (row) {
        const yearNum = this.dateFormat('YYYY', new Date()) - this.dateFormat('YYYY', new Date(row));
        const mouthNum = this.dateFormat('mm', new Date()) - this.dateFormat('mm', new Date(row));
        let dayNum = this.dateFormat('dd', new Date()) - this.dateFormat('dd', new Date(row));
        let hourNum = this.dateFormat('HH', new Date()) - this.dateFormat('HH', new Date(row));
        let minuteNum = this.dateFormat('MM', new Date()) - this.dateFormat('MM', new Date(row));
        if (dayNum >= 0 && hourNum < 0) {
          hourNum = 1 * 24 + hourNum;
          dayNum -= 1;
        }
        if (hourNum >= 0 && minuteNum < 0) {
          minuteNum = 1 * 60 + minuteNum;
          hourNum -= 1;
        }
        const dateNum = yearNum * 365 + mouthNum * 30 + dayNum;
        return `已用时长 ${dateNum}天 ${hourNum}小时 ${minuteNum}分`;
      }
      return '已用时长 0天 0小时 0分';
    },
    submit() {
      this.go('myWeekly', { params: { weeklySumParams: this.owntableData } });
    },
  },
};
</script>

<style>
</style>