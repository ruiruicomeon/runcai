<template>
  <el-form
    :model="formData"
    ref="changeForm"
    v-if="formData.tableList.length > 0"
    class="tl-form"
  >
    <elcollapse v-model="activeList" class="tl-collapse" @change="expand">
      <elcollapseitem
        ref="okrcoll"
        v-for="(item, index) in formData.tableList"
        :key="item.okrDetailId + index"
        :name="index"
        :disabled="disabled"
      >
        <template slot="title">
          <dl
            class="collpase-panel"
            :class="{ 'has-third-child': item.okrParentId }"
          >
            <dt :class="{ 'is-edit': canWrite && item.showTitleEdit }">
              <span>目标{{ index + 1 }}</span>
              <div>
                <el-form-item
                  v-if="canWrite && item.showTitleEdit"
                  :prop="'tableList.' + index + '.okrDetailObjectKr'"
                  :rules="[
                    {
                      trigger: 'blur',
                      validator: validateObjectName,
                      required: true,
                    },
                  ]"
                >
                  <el-input
                    placeholder="请输入目标名称"
                    v-model="item.okrDetailObjectKr"
                    class="tl-input"
                    maxlength="200"
                  ></el-input>
                </el-form-item>
                <em v-else>{{ item.okrDetailObjectKr }}</em>
                <i
                  v-if="canWrite && !item.showTitleEdit"
                  class="el-icon-edit"
                  @click="showInput(index, 'showTitleEdit')"
                ></i>
              </div>
              <slot name="head-bar" :okritem="item"></slot>
            </dt>
            <dd
              :class="{
                'has-third-child': item.okrParentId,
                'is-edit': canWrite && item.showWeightEdit,
              }"
            >
              <div>
                <i class="el-icon-medal"></i>
                <span>权重</span>
                <el-form-item
                  v-if="canWrite && item.showWeightEdit"
                  :prop="'tableList.' + index + '.okrWeight'"
                  :rules="[
                    {
                      trigger: 'blur',
                      validator: validatePercent,
                      required: true,
                    },
                  ]"
                >
                  <el-input-number
                    v-model="item.okrWeight"
                    controls-position="right"
                    :min="0"
                    :max="100"
                    :step="0.1"
                    step-strictly
                    class="tl-input-number"
                  ></el-input-number>
                  <span>%</span>
                </el-form-item>
                <em v-else>{{ item.okrWeight }}%</em>
                <i
                  v-if="canWrite && !item.showWeightEdit"
                  class="el-icon-edit"
                  @click="showInput(index, 'showWeightEdit')"
                ></i>
              </div>
              <div>
                <i class="el-icon-odometer"></i>
                <span>当前进度</span>
                <tl-process :data="item.okrDetailProgress"></tl-process>
              </div>
              <!-- 变更时父目标有变更 -->
              <div v-if="canWrite && item.parentUpdate">
                <i class="el-icon-attract"></i>
                <span>关联父目标</span>
                <el-popover
                  placement="top"
                  width="200"
                  trigger="hover"
                  :append-to-body="false"
                  v-if="!item.hasUpdate"
                >
                  <span>
                    您关联的父目标有变更，
                    <a @click="goUndertake(index, 'change')">查看详情</a>
                  </span>
                  <i class="icon-remind" slot="reference"></i>
                </el-popover>
                <el-button
                  v-if="
                    item.hasUpdate &&
                    !item.undertakeOkrVo.undertakeOkrContent &&
                    !item.cultureName
                  "
                  type="text"
                  plain
                  @click.native="goUndertake(index, 'change')"
                  class="tl-btn dotted-line"
                >
                  <i class="el-icon-plus"></i>
                  关联
                </el-button>
                <em
                  v-else-if="
                    item.undertakeOkrVo &&
                    item.undertakeOkrVo.undertakeOkrContent
                  "
                  @click="goUndertake(index, 'change')"
                  :class="{ 'is-change': canWrite }"
                  >{{ item.undertakeOkrVo.undertakeOkrContent }}
                </em>
                <em
                  v-else
                  @click="goUndertake(index, 'change')"
                  :class="{ 'is-change': canWrite }"
                  >{{ item.parentObjectKr }}
                </em>
                <em
                  @click="goUndertake(index, 'change')"
                  :class="{ 'is-change': canWrite }"
                  >{{ item.cultureName }}</em
                >
              </div>
              <!-- 变更 原来有承接-->
              <div v-else-if="canWrite && item.parentObjectKr">
                <i class="el-icon-attract"></i>
                <span>关联父目标</span>
                <em v-if="!item.hasUpdate" @click="goUndertake(index, 'new')">{{
                  item.parentObjectKr
                }}</em>
                <em
                  v-else-if="
                    item.undertakeOkrVo &&
                    item.undertakeOkrVo.undertakeOkrContent
                  "
                  @click="goUndertake(index, 'new')"
                  >{{ item.undertakeOkrVo.undertakeOkrContent }}</em
                >
                <em @click="goUndertake(index, 'new')">{{
                  item.cultureName
                }}</em>
                <el-button
                  v-if="
                    item.hasUpdate &&
                    !(
                      item.undertakeOkrVo &&
                      item.undertakeOkrVo.undertakeOkrContent
                    ) &&
                    !item.cultureName
                  "
                  type="text"
                  plain
                  @click.native="goUndertake(index, 'new')"
                  class="tl-btn dotted-line"
                >
                  <i class="el-icon-plus"></i>
                  关联
                </el-button>
              </div>
              <!-- 变更 原无承接 -->
              <div v-else-if="canWrite">
                <i class="el-icon-attract"></i>
                <span>关联父目标</span>
                <template
                  v-if="
                    (item.undertakeOkrVo &&
                      item.undertakeOkrVo.undertakeOkrContent) ||
                    item.cultureName
                  "
                >
                  <em
                    @click="goUndertake(index, 'new')"
                    v-if="
                      item.undertakeOkrVo &&
                      item.undertakeOkrVo.undertakeOkrContent
                    "
                    >{{ item.undertakeOkrVo.undertakeOkrContent }}</em
                  >

                  <em
                    @click="goUndertake(index, 'new')"
                    v-if="item.cultureName"
                    >{{ item.cultureName }}</em
                  >
                </template>
                <el-button
                  type="text"
                  plain
                  @click.native="goUndertake(index, 'new')"
                  class="tl-btn dotted-line"
                  v-else
                >
                  <i class="el-icon-plus"></i>
                  关联
                </el-button>
              </div>
              <!-- 详情 -->
              <div v-else-if="item.parentObjectKr">
                <i class="el-icon-attract"></i>
                <span>关联父目标</span>
                <el-popover
                  v-if="item.parentUpdate"
                  placement="top"
                  width="200"
                  trigger="hover"
                  :append-to-body="false"
                >
                  <span>关联的父目标有变更</span>
                  <i class="icon-remind" slot="reference"></i>
                </el-popover>
                <em>{{ item.parentObjectKr }}</em>
                <em>{{ item.cultureName }}</em>
              </div>
            </dd>
          </dl>
        </template>
        <dl
          v-for="(kritem, krIndex) in item.krList"
          :key="kritem.okrDetailId + krIndex"
          class="collpase-panel"
          :class="{ 'has-third-child': kritem.okrDetailConfidence }"
        >
          <dt :class="{ 'is-edit': canWrite && kritem.showTitleEdit }">
            <span>KR{{ krIndex + 1 }}</span>
            <div>
              <el-form-item
                v-if="canWrite && kritem.showTitleEdit"
                :prop="
                  'tableList.' +
                  index +
                  '.krList.' +
                  krIndex +
                  '.okrDetailObjectKr'
                "
                :rules="[
                  {
                    required: true,
                    trigger: 'blur',
                    validator: validateKRName,
                  },
                ]"
              >
                <el-input
                  placeholder="请输入关键结果"
                  v-model="kritem.okrDetailObjectKr"
                  class="tl-input"
                  maxlength="500"
                ></el-input>
              </el-form-item>
              <span v-else>{{ kritem.okrDetailObjectKr }}</span>
              <i
                v-if="canWrite && !kritem.showTitleEdit"
                class="el-icon-edit"
                @click="showKRInput(index, krIndex, 'showTitleEdit')"
              ></i>
            </div>
            <slot name="body-bar" :okritem="kritem"></slot>
          </dt>
          <dd
            :class="{
              'has-third-child': kritem.okrDetailConfidence,
              'is-edit': canWrite && kritem.showWeightEdit,
            }"
          >
            <div>
              <i class="el-icon-medal"></i>
              <span>权重</span>
              <el-form-item
                v-if="canWrite && kritem.showWeightEdit"
                :prop="
                  'tableList.' + index + '.krList.' + krIndex + '.okrWeight'
                "
                :rules="[
                  {
                    trigger: 'blur',
                    validator: validatePercent,
                    required: true,
                  },
                ]"
              >
                <el-input-number
                  v-model="kritem.okrWeight"
                  controls-position="right"
                  :min="0"
                  :max="100"
                  :step="0.1"
                  step-strictly
                  class="tl-input-number"
                ></el-input-number>
                <span>%</span>
              </el-form-item>
              <em v-else>{{ kritem.okrWeight }}%</em>
              <i
                v-if="canWrite && !kritem.showWeightEdit"
                class="el-icon-edit"
                @click="showKRInput(index, krIndex, 'showWeightEdit')"
              ></i>
            </div>
            <div>
              <i class="el-icon-odometer"></i>
              <span>当前进度</span>
              <tl-process
                :ref="'process' + index + krIndex"
                :data="kritem.okrDetailProgress"
              ></tl-process>
            </div>
            <div>
              <i class="el-icon-bell"></i>
              <span>信心指数</span>
              <div class="state-grid">
                <div
                  :class="{
                    'is-no-risk': kritem.okrDetailConfidence == 1,
                    'is-risks': kritem.okrDetailConfidence == 2,
                    'is-uncontrollable': kritem.okrDetailConfidence == 3,
                  }"
                ></div>
                <div
                  :class="{
                    'is-no-risk': kritem.okrDetailConfidence == 1,
                    'is-risks': kritem.okrDetailConfidence == 2,
                  }"
                ></div>
                <div
                  :class="{
                    'is-no-risk': kritem.okrDetailConfidence == 1,
                  }"
                ></div>
              </div>
              <div class="state-txt">
                {{ CONST.CONFIDENCE_MAP[kritem.okrDetailConfidence] }}
              </div>
            </div>
          </dd>
          <dd
            v-if="canWrite"
            :class="{
              'is-edit':
                (canWrite && kritem.showCheckEdit) || kritem.showJudgeEdit,
            }"
          >
            <div>
              <span>考核指标</span>
              <el-form-item v-if="kritem.showCheckEdit">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 1, maxRows: 8 }"
                  placeholder="请输入考核指标"
                  v-model="kritem.checkQuota"
                  maxlength="1500"
                  class="tl-textarea"
                ></el-input>
              </el-form-item>
              <em v-else>{{ kritem.checkQuota }}</em>
              <i
                v-if="!kritem.showCheckEdit"
                class="el-icon-edit"
                @click="showKRInput(index, krIndex, 'showCheckEdit')"
              ></i>
            </div>
            <div>
              <span>衡量办法</span>
              <el-form-item v-if="kritem.showJudgeEdit">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 1, maxRows: 8 }"
                  placeholder="请输入衡量办法"
                  v-model="kritem.judgeMethod"
                  maxlength="1500"
                  class="tl-textarea"
                ></el-input>
              </el-form-item>
              <em v-else>{{ kritem.judgeMethod }}</em>
              <i
                v-if="!kritem.showJudgeEdit"
                class="el-icon-edit"
                @click="showKRInput(index, krIndex, 'showJudgeEdit')"
              ></i>
            </div>
          </dd>
        </dl>
        <template v-if="item.newkrList">
          <dl
            v-for="(newItem, kindex) in item.newkrList"
            :key="kindex"
            class="collpase-panel"
          >
            <dt class="is-edit">
              <span>KR{{ item.krList.length + kindex + 1 }}</span>
              <div>
                <el-form-item
                  :prop="
                    'tableList.' +
                    index +
                    '.newkrList.' +
                    kindex +
                    '.okrDetailObjectKr'
                  "
                  :rules="[
                    {
                      required: true,
                      trigger: 'blur',
                      validator: validateKRName,
                    },
                  ]"
                >
                  <!-- 不强制刷新无法输入 -->
                  <el-input
                    placeholder="请输入关键结果"
                    v-model="newItem.okrDetailObjectKr"
                    @input="updateokrCollapse"
                    class="tl-input"
                    maxlength="500"
                  ></el-input>
                </el-form-item>
              </div>
              <el-tooltip
                class="icon-clear"
                :class="{ 'is-disabled': false }"
                effect="dark"
                content="删除"
                placement="top"
                popper-class="tl-tooltip-popper"
                @click.native="deletekr(item, kindex)"
              >
                <i class="el-icon-minus"></i>
              </el-tooltip>
            </dt>
            <dd class="has-third-child">
              <el-form-item
                label="权重"
                :prop="
                  'tableList.' + index + '.newkrList.' + kindex + '.okrWeight'
                "
                :rules="[
                  {
                    trigger: 'blur',
                    validator: validatePercent,
                    required: true,
                  },
                ]"
              >
                <el-input-number
                  @input="updateokrCollapse"
                  v-model="newItem.okrWeight"
                  controls-position="right"
                  :min="0"
                  :max="100"
                  :step="0.1"
                  step-strictly
                  class="tl-input-number"
                ></el-input-number>
                <span>%</span>
              </el-form-item>
              <el-form-item label="当前进度">
                <el-input-number
                  @input="updateokrCollapse"
                  v-model="newItem.okrDetailProgress"
                  controls-position="right"
                  :min="0"
                  :max="100"
                  :step="1"
                  :precision="0"
                  class="tl-input-number"
                  @blur="progressChange(newItem)"
                ></el-input-number>
                <span>%</span>
              </el-form-item>
              <el-form-item label="信心指数">
                <tl-confidence
                  v-model="newItem.okrDetailConfidence"
                  @change="updateokrCollapse"
                ></tl-confidence>
              </el-form-item>
            </dd>
            <dd>
              <div class="open-more" @click="openMore(newItem)">
                <span>考核办法（如有）</span>
                <i
                  class="el-icon-arrow-right"
                  :class="{ 'is-active': newItem.openMore }"
                ></i>
              </div>
              <el-form-item label="考核指标" v-show="newItem.openMore">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 1, maxRows: 8 }"
                  placeholder="请输入考核指标"
                  v-model="newItem.checkQuota"
                  maxlength="1500"
                  class="tl-textarea"
                  @input="updateokrCollapse"
                ></el-input>
              </el-form-item>
              <el-form-item label="衡量办法" v-show="newItem.openMore">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 1, maxRows: 8 }"
                  placeholder="请输入衡量办法"
                  v-model="newItem.judgeMethod"
                  maxlength="1500"
                  class="tl-textarea"
                  @input="updateokrCollapse"
                ></el-input>
              </el-form-item>
            </dd>
          </dl>
        </template>
        <el-button
          type="text"
          v-if="canWrite"
          @click="addkr(item, 'kr')"
          class="tl-btn sub-list-add"
        >
          <i class="el-icon-plus"></i>添加关键结果
        </el-button>
      </elcollapseitem>
    </elcollapse>
  </el-form>
</template>

<script>
import process from '@/components/process';
import confidenceSelect from '@/components/confidenceSelect';
import validateMixin from '@/mixin/validateMixin';
import elcollapse from '@/components/collapse/collapse';
import elcollapseitem from '@/components/collapse/collapse-item';
import CONST from './const';

export default {
  name: 'okrCollapse',
  mixins: [validateMixin],
  components: {
    'tl-confidence': confidenceSelect,
    elcollapse,
    elcollapseitem,
    'tl-process': process,
  },
  data() {
    return {
      CONST,
      okrmain: {},
      formData: { tableList: [] },
      // errormsg
      oerror: '',
      krerror: '',
      checkerror: '',
      judgeerror: '',
      weighterror: '',
      activeList: [],
    };
  },
  props: {
    tableList: {
      type: Array,
      default() {
        return [];
      },
    },
    okrid: {
      type: String,
      default: '',
    },
    // disabled(不能收起：true;能收起展开：false)
    disabled: {
      type: Boolean,
      default: false,
    },
    // true写okr false okr详情
    canWrite: {
      type: Boolean,
      default: false,
    },
    // 是否显示承接
    showParentOkr: {
      type: Boolean,
      default: true,
    },

  },
  mounted() {
  },
  created() {

  },
  methods: {
    showInput(index, name) {
      this.tableList[index][name] = true;
      this.$forceUpdate();
    },
    showKRInput(index, krIndex, name) {
      this.tableList[index].krList[krIndex][name] = true;
      this.$forceUpdate();
    },
    goUndertake(index, type) {
      // 给父组件传打开的命令
      const undertakeInfo = {
        num: parseInt(index, 10),
        type,
      };
      this.$emit('openUndertake', undertakeInfo);
    },
    // 改变tableList后强制渲染
    updateokrCollapse() {
      this.$forceUpdate();
    },
    // 增加kr
    addkr(okritem) {
      if (!okritem.newkrList) {
        okritem.newkrList = [];
      }
      okritem.newkrList.push({
        okrDetailObjectKr: '',
        okrWeight: 0,
        okrDetailProgress: 0,
        okrDetailConfidence: 1,
      });
      this.$forceUpdate();
    },
    // 删除kr
    deletekr(okritem, krindex) {
      console.log(okritem.newkrList);
      okritem.newkrList.splice(krindex, 1);
      this.$forceUpdate();
    },
    // 展开考核指标衡量办法
    openMore(item) {
      item.openMore = !item.openMore;
      this.$forceUpdate();
    },
    // 进度默认值
    progressChange(newItem) {
      if (!newItem.okrDetailProgress) {
        newItem.okrDetailProgress = 0;
        this.$forceUpdate();
      }
    },
    // 重新触发进度条计算
    expand(activeList) {
      activeList.forEach((item) => {
        this.tableList[item].krList.forEach((kritem, krIndex) => {
          this.$nextTick(() => {
            this.$refs[`process${item}${krIndex}`][0].changeWidth();
          });
        });
      });
    },
  },
  watch: {
    tableList: {
      handler(newVal) {
        if (newVal) {
          this.formData.tableList = this.tableList;
          this.$forceUpdate();
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>