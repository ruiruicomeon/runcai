<template>
  <el-dialog
    :append-to-body="true"
    :before-close="close"
    @closed="close"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :visible.sync="dialogTableVisible"
    class="tl-dialog"
    :modal="true"
    :title="title"
  >
    <el-form class="tl-form" :label-position="'left'">
      <el-form-item :label="upDateName" prop="num">
        <el-input-number
          controls-position="right"
          v-model="num"
          :min="0"
          :max="upDateType == 'progress' ? 100 : 100000"
          class="tl-input-number"
        ></el-input-number>
        <span v-if="upDateType == 'update'"> 次</span>
        <span v-if="upDateType == 'progress'"> %</span>
        <span v-if="upDateType == 'time'"> 天，未更新OKR进展</span>
      </el-form-item>
      <!-- <em v-for="(item, index) in selectlist" :key="index"
        >{{ item.orgData.orgName }}({{
          item.remindType == 1 ? "负责人" : "成员"
        }}) <i class="el-icon-error" @click="deleteList(index)"></i
      ></em>
      <el-form-item label="提醒范围：">
        <el-button type="text" @click="selectOrgShow">
          + 选择组织范围</el-button
        >
      </el-form-item> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        @click="alertLink"
        class="tl-btn amt-bg-slip"
        :loading="btnLoad"
        >确定</el-button
      >
      <el-button plain @click="close" class="tl-btn amt-border-fadeout"
        >取 消</el-button
      >
    </div>
    <tl-selectOrg
      ref="selectOrg"
      @getOrgData="getOrgData"
      :selectlist="selectlist"
    ></tl-selectOrg>
  </el-dialog>
</template>
<script>
import Server from '../server';
import selectOrg from './selectOrg';

const server = new Server();
export default {
  data() {
    return {
      title: '',
      dialogTableVisible: false,
      num: 0,
      server,
      options: '',
      orgList: '',
      selectType: '',
      btnLoad: false,
      selectlist: [],
      upDateName: '',
      type: '',
      showUser: false,
      orgRemindTypeList: [],
    };
  },
  props: ['upDateType', 'periodId'],
  mounted() {
    this.queryMenu();
  },
  components: {
    'tl-selectOrg': selectOrg,
  },
  methods: {
    show() {
      this.dialogTableVisible = true;
      this.num = 0;
      this.orgRemindTypeList = [];
      if (this.upDateType == 'update') {
        this.title = 'OKR更新次数提醒';
        this.type = 1;
        this.upDateName = 'OKR更新次数少于';
      } else if (this.upDateType == 'progress') {
        this.title = 'OKR进度更新提醒';
        this.type = 0;
        this.upDateName = 'OKR进度小于';
      } else {
        this.type = 2;
        this.title = '自定义时间更新进展提醒';
        this.upDateName = '超过';
      }
    },
    getOrgData(data, type) {
      this.orgRemindTypeList = data.map((item) => ({ orgId: item, remindType: type }));
    },
    close() {
      this.dialogTableVisible = false;
    },
    queryMenu() {
      this.server.getOrg().then((res) => {
        this.options = res.data;
      });
    },

    alertLink() {
      if (this.orgRemindTypeList.length == 0) {
        this.$message.error('请选择部门');
        return false;
      }
      let text;
      if (this.type == 0) {
        text = `OKR进度小于${this.num}`;
      }
      if (this.type == 1) {
        text = `更新次数OKR小于${this.num}`;
      }
      if (this.type == 2) {
        text = `超过${this.num}天未更新人员`;
      }
      this.$xconfirm({
        title: '',
        content: `确认给${text}的邮箱发送提醒吗？点击确认后，将立即发送`,
      }).then(() => {
        this.submitForm();
      });
    },
    submitForm() {
      const params = {};

      params.type = this.type;
      if (this.type == 0) {
        params.okrProgress = this.num;
      }
      if (this.type == 1) {
        params.okrUpdateCount = this.num;
      }
      if (this.type == 2) {
        params.okrUpdateTimeCount = this.num;
      }
      params.orgRemindTypeList = this.orgRemindTypeList;

      this.server.sendOkrRemindMsg(params).then((res) => {
        if (res.code == 200) {
          this.$message.success('发送成功');
          this.close();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
};
</script>
<style  scoped>
</style>