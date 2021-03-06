<template>
  <el-dialog
    :append-to-body="true"
    :visible="visible"
    @close="close"
    :title="title"
    :close-on-click-modal="false"
    custom-class="custom-drawer edit-evaluate"
    class="tl-dialog"
  >
    <div v-show="step == 1">
      <el-form ref="dicForm" :model="performanceData" label-width="100px">
        <el-form-item
          label="自定义名称"
          prop="ruleName"
          :rules="[
            { required: true, message: '请输入自定义名称', reigger: blur },
          ]"
        >
          <el-input
            class="tl-input"
            v-model.trim="performanceData.ruleName"
            maxlength="30"
            placeholder="请填写名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="自定义体系" prop="ruleName">
          <div
            v-for="(ruleItem, index) in performanceData.ruleDetailList"
            :key="ruleItem.detailRandomId"
            class="item-group"
          >
            <div class="flex-start">
              <div class="edit-ipt">
                <el-input
                  class="tl-input w70"
                  :class="{ 'input-color': ruleItem.showContentError }"
                  v-model.trim="ruleItem.value"
                  maxlength="20"
                  @blur="valueInputBlur(ruleItem)"
                  placeholder="请输入值"
                ></el-input>
                <span class="error-text" v-if="ruleItem.showContentError">
                  {{ ruleItem.contentErrorText }}
                </span>
              </div>
              <div class="edit-ipt">
                <el-input
                  class="tl-input w130"
                  v-model.trim="ruleItem.unit"
                  maxlength="20"
                  placeholder="如有单位，请填写"
                ></el-input>
              </div>
              <span>说明</span>
              <div class="edit-ipt">
                <el-input
                  v-model="ruleItem.description"
                  class="tl-textarea"
                  :class="{ 'input-color': ruleItem.showRemarkError }"
                  type="textarea"
                  :autosize="{ minRows: 1, maxRows: 8 }"
                  placeholder="请填写说明"
                  maxlength="100"
                  @blur="inputBlur(ruleItem)"
                ></el-input>
                <span class="error-text" v-if="ruleItem.showRemarkError">
                  {{ ruleItem.remarkErrorText }}
                </span>
              </div>
              <div class="add-delete-btn">
                <el-button
                  class="tl-btn"
                  type="text"
                  v-show="performanceData.ruleDetailList.length - 1 == index"
                  @click="addRuleItem(performanceData)"
                  >添加</el-button
                >
                <el-button
                  class="tl-btn"
                  type="text"
                  @click="
                    performanceData.ruleDetailList.length > 1
                      ? deleteRuleItem(ruleItem)
                      : ''
                  "
                  >删除</el-button
                >
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="应用范围" prop="ruleType">
          <el-radio
            class="tl-radio"
            v-model="performanceData.ruleType"
            label="1"
            >部门</el-radio
          >
          <el-radio
            class="tl-radio"
            v-model="performanceData.ruleType"
            label="2"
            >个人</el-radio
          >
        </el-form-item>
      </el-form>
    </div>
    <div v-show="step == 2" class="evaluation-detail">
      <dl>
        <dt>{{ performanceData.ruleName }}</dt>
        <dd
          v-for="ruleItem in performanceData.ruleDetailList"
          :key="ruleItem.detailRandomId"
        >
          <div class="evaluation-results">
            <em>{{ ruleItem.value }}</em>
            <span>{{ ruleItem.unit }}</span>
          </div>
          <div class="evaluation-describe">
            <span>说明</span>
            <pre>{{ ruleItem.description || "--" }}</pre>
          </div>
        </dd>
        <dd>
          <span>适用范围</span>
          <em>{{ performanceData.ruleType == 1 ? " 部门" : " 个人" }}</em>
        </dd>
      </dl>
    </div>
    <div class="operating-box">
      <el-button
        :loading="loading"
        type="primary"
        class="tl-btn amt-bg-slip"
        @click="addEvaluate"
      >
        {{ step == 1 || performanceData.status > 0 ? "确认" : "提交" }}
      </el-button>
      <el-button
        :disabled="loading"
        plain
        class="tl-btn amt-border-fadeout"
        @click="cancel"
        v-if="performanceData.status < 1 || !hasValue(performanceData.status)"
        >取消</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'addOrEditEvaluate',
  components: {},
  props: {
    server: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      visible: false,
      loading: false,
      step: '1',
      performanceData: {
        ruleName: '',
        ruleType: '1',
        ruleDetailList: [],
      },
      title: '设置绩效评定体系',
    };
  },
  created() { },
  mounted() { },
  computed: {},
  methods: {
    addRuleItem() {
      if (this.performanceData.ruleDetailList.length > 50) {
        this.$message.error('不能超过50条');
        return;
      }
      this.performanceData.ruleDetailList.push({
        unit: '',
        value: '',
        description: '',
        showContentError: false,
        showRemarkError: false,
        contentErrorText: '',
        remarkErrorText: '',
        detailRandomId: this.getRandomId(),
      });
    },
    deleteRuleItem(ruleItem) {
      this.performanceData.ruleDetailList = this.performanceData.ruleDetailList.filter(
        (detail) => detail.detailRandomId != ruleItem.detailRandomId,
      );
    },
    addEvaluate() {
      if (this.performanceData
        && this.performanceData.ruleId
        && this.performanceData.status > 0) {
        this.close();
        return;
      }
      if (this.step == 1) {
        this.$refs.dicForm.validate((valid) => {
          let validateStatus = true;
          this.performanceData.ruleDetailList.forEach((element) => {
            if (!this.hasValue(element.value.trim())) {
              element.showContentError = true;
              element.contentErrorText = '请输入值';
              validateStatus = false;
            }
            if (!this.hasValue(element.description.trim())) {
              element.showRemarkError = true;
              element.remarkErrorText = '请填写说明';
              validateStatus = false;
            }
          });
          if (valid && validateStatus) {
            this.title = '确认后部门将按照以下规则进行配置！';
            this.step = 2;
          } else {
            this.$message.error('您有必填项未填写，请填写后重试');
          }
        });
      } else {
        this.loading = true;
        let requestName = 'addEvaluate';
        if (this.performanceData.ruleId) {
          requestName = 'updateEvaluate';
        }
        // 添加level字段
        for (let i = 0; i < this.performanceData.ruleDetailList.length; i += 1) {
          this.performanceData.ruleDetailList[i].level = i + 1;
        }
        const params = [this.performanceData];

        this.server[requestName](params).then((res) => {
          this.loading = false;
          if (res.code == 200) {
            this.$message.success('成功');
            this.$emit('refreshPage');
            this.close();
          }
        });
      }
    },
    show(rowData) {
      if (rowData && rowData.ruleId) {
        this.performanceData = this.deepCopy(rowData);
        this.performanceData.ruleType = String(this.performanceData.ruleType);
        this.performanceData.ruleDetailList.forEach((detail) => {
          detail.detailRandomId = this.getRandomId();
          detail.showContentError = false;
          detail.contentErrorText = '';
          detail.showRemarkError = false;
          detail.remarkErrorText = '';
        });
        if (rowData.status > 0) {
          this.title = '详情';
          this.step = 2;
        } else {
          this.step = 1;
        }
      } else {
        this.performanceData = {
          ruleName: '',
          ruleType: '1',
          ruleDetailList: [{
            unit: '',
            value: '',
            description: '',
            showContentError: false,
            contentErrorText: '',
            showRemarkError: false,
            remarkErrorText: '',
            detailRandomId: this.getRandomId(),
          }],
        };
      }
      this.$nextTick(() => {
        this.visible = true;
      });
    },
    cancel() {
      if (this.step == 1) {
        this.close();
      } else {
        this.step = 1;
        this.title = '设置绩效评定体系';
      }
    },
    close() {
      this.visible = false;
      this.$emit('update:showDialog', false);
    },
    valueInputBlur(inputData) {
      this.performanceData.ruleDetailList.forEach((element) => {
        if (element.detailRandomId == inputData.detailRandomId) {
          if (!this.hasValue(inputData.value.trim())) {
            element.showContentError = true;
            element.contentErrorText = '请输入值';
          } else {
            element.showContentError = false;
            element.contentErrorText = '';
          }
        }
      });
      this.$forceUpdate();
    },
    inputBlur(inputData) {
      this.performanceData.ruleDetailList.forEach((element) => {
        if (element.detailRandomId == inputData.detailRandomId) {
          if (!this.hasValue(inputData.description.trim())) {
            element.showRemarkError = true;
            element.remarkErrorText = '请填写说明';
          } else {
            element.showRemarkError = false;
            element.remarkErrorText = '';
          }
        }
      });
      this.$forceUpdate();
    },

  },
  watch: {},
  updated() { },
  beforeDestroy() { },
};
</script>