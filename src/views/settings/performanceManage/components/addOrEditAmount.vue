<template>
  <el-dialog
    :append-to-body="true"
    :visible="visible"
    @close="close"
    :close-on-click-modal="false"
    custom-class="custom-drawer edit-amount"
    class="tl-dialog"
    :title="title"
  >
    <div class="dl-group">
      <dl v-for="item in selectedRule.ruleDetailList" :key="item.ruleDetailId">
        <dd>
          <div>
            <span>{{ item.value + item.unit }}</span
            ><el-input
              class="tl-input w40"
              v-model="item.applyValue"
              @blur="inputBlur(item)"
            ></el-input
            ><span>个</span>
          </div>
          <span v-if="item.showError">{{ item.errorText }}</span>
        </dd>
      </dl>
    </div>
    <div class="operating-box">
      <el-button
        :loading="loading"
        type="primary"
        class="tl-btn amt-bg-slip"
        @click="submit"
        >确认</el-button
      >
      <el-button
        :disabled="loading"
        plain
        class="tl-btn amt-border-fadeout"
        @click="close"
        >取消</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'addOrEditAmount',
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
      formData: {
        // ruleId: '',
        // applyId: '1', // 1-租户；2-部门；3-个人
        // periodId: '',
        periodRuleDetailList: [

        ],
      },
      selectedRule: {},
      title: '',
    };
  },
  created() { },
  mounted() {},
  computed: {},
  methods: {
    show(selectedRule, searchForm, tenantId) {
      this.formData.periodId = searchForm.periodId;
      this.formData.applyId = tenantId;
      // 深拷贝
      this.selectedRule = this.deepCopy(selectedRule);
      if (this.selectedRule.periodRuleId) {
        this.formData.ruleId = this.selectedRule.ruleId;
        this.formData.periodRuleId = this.selectedRule.periodRuleId;
        this.selectedRule.ruleDetailList = [...this.selectedRule.periodRuleDetailList];
      } else {
        this.formData.ruleId = searchForm.ruleId;
        this.selectedRule.ruleDetailList.forEach((item) => {
          this.$set(item, 'applyValue', 0);
        });
      }
      this.selectedRule.ruleDetailList.forEach((item) => {
        this.$set(item, 'showError', false);
        this.$set(item, 'errorText', '');
      });
      this.$nextTick(() => {
        this.visible = true;
        this.$forceUpdate();
      });
      this.title = `请线下确认“${this.selectedRule.ruleName}”总数量，再进行设置`;
    },
    cancel() {

    },
    close() {
      this.visible = false;
      this.$emit('update:showDialog', false);
    },
    inputBlur(item) {
      this.selectedRule.ruleDetailList.forEach((element) => {
        console.log(this.selectedRule.ruleDetailList);
        if (item.ruleDetailId == element.ruleDetailId) {
          // 1、正整数数字
          if (!(/(^[0-9]\d*$)/.test(Number(item.applyValue))) || !this.hasValue(item.applyValue)) {
            element.showError = true;
            element.errorText = '请填写不小于零的整数';
          } else if (item.applyValue > 1000) {
            element.showError = true;
            element.errorText = '最大值为1000';
          } else {
            element.showError = false;
            element.errorText = '';
          }
          // if (element.applyValue < element.minValue) {
          //   element.showError = true;
          //   element.errorText = '修改后的值不能小于已分配的数量值';
          // } else {
          //   element.showError = false;
          //   element.errorText = '';
          // }
          this.$forceUpdate();
        }
      });
    },
    submit() {
      this.formData.applyType = 1;

      this.formData.periodRuleDetailList = [];
      // 编辑
      if (this.selectedRule.periodRuleId) {
        this.selectedRule.ruleDetailList.forEach((item) => {
          this.formData.periodRuleDetailList.push({
            applyValue: item.applyValue || 0,
            ruleDetailId: item.ruleDetailId,
            periodRuleId: item.periodRuleId,
            periodRuleDetailId: item.periodRuleDetailId,
          });
        });
      } else { // 新增
        this.selectedRule.ruleDetailList.forEach((item) => {
          this.formData.periodRuleDetailList.push({
            applyValue: item.applyValue || 0,
            ruleDetailId: item.ruleDetailId,
          });
        });
      }
      this.validateStatus = true;
      this.selectedRule.ruleDetailList.forEach((element) => {
        // 1、正整数数字
        if (!(/(^[0-9]\d*$)/.test(Number(element.applyValue))) || !this.hasValue(element.applyValue)) {
          element.showError = true;
          element.errorText = '请填写不小于零的整数';
        } else if (element.applyValue > 1000) {
          element.showError = true;
          element.errorText = '最大值为1000';
        } else {
          element.showError = false;
          element.errorText = '';
        }
        // if (element.applyValue < element.minValue) {
        //   element.showError = true;
        //   element.errorText = '修改后的值不能小于已分配的数量值';
        // } else {
        //   element.showError = false;
        //   element.errorText = '';
        // }
        this.$forceUpdate();
      });
      this.selectedRule.ruleDetailList.forEach((element) => {
        if (element.showError) {
          this.validateStatus = false;
        }
      });
      if (this.validateStatus) {
        this.server.addOrUpdateAmount([this.formData]).then((res) => {
          if (res.code == 200) {
            this.$message.success('处理成功');
            this.$emit('refreshRule');
            this.$emit('refreshPage');
            this.close();
          } else if (res.code == 30000) { // 设置数量超过了已分配出去的数量
            if (res.data && res.data.length > 0) {
              // 匹配到具体的值，展示报错提示
              this.selectedRule.ruleDetailList.forEach((item) => {
                res.data[0].periodRuleDetailList.forEach((element) => {
                  if (item.periodRuleDetailId == element.periodRuleDetailId) {
                    item.showError = true;
                    item.errorText = `数量不能小于已分配出去的数量(${Number(element.applyValueOffset) + Number(item.applyValue)}个)`;
                  }
                });
              });
            }
          }
        });
      } else {
        this.$message.error('表单校验未通过，请修改后重试');
      }
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>