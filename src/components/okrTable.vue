<template>
  <div class="tl-table-fix">
    <ul class="tl-thead">
      <li
        class="fold"
        :class="{ 'is-toggle': expands.length == tableList.length }"
      >
        <span v-if="expands.length == tableList.length" @click="handleOpen"
          >全部收起</span
        >
        <span v-else @click="handleOpen">全部展开</span>
        <i class="el-icon-arrow-right" @click="handleOpen"></i>
      </li>
      <li>权重</li>
      <li>
        <em v-if="!overview">关联父目标</em>
      </li>
      <li>
        <em v-if="!overview">信心指数</em>
      </li>
      <li>
        <span>进度</span>
        <el-tooltip
          :disabled="!showUpdate"
          effect="dark"
          placement="top"
          popper-class="tl-tooltip-popper"
        >
          <div slot="content">目标进度由关键结果权重及进度自动计算得来</div>
          <div class="progress-number">
            <i v-if="showUpdate" class="icon-help"></i>
          </div>
        </el-tooltip>
      </li>
    </ul>
    <el-table
      :data="tableList"
      class="tl-table"
      row-key="okrDetailId"
      :expand-row-keys="expands"
      @expand-change="echange"
    >
      <el-table-column type="expand" width="5%">
        <template slot-scope="scope">
          <dl
            v-for="(kritem, krindex) in scope.row.krList"
            :key="kritem.krId"
            class="sub-tr"
          >
            <dd class="okr-line"></dd>
            <!-- kr名称 -->
            <dd class="okr-kr-name tag-kind">
              <span class="kind-child">KR{{ krindex + 1 }}</span>
              <el-tooltip
                effect="dark"
                placement="top"
                popper-class="tl-tooltip-popper"
              >
                <div slot="content">{{ kritem.okrDetailObjectKr }}</div>
                <em>{{ kritem.okrDetailObjectKr }}</em>
              </el-tooltip>
            </dd>
            <!-- kr权重 -->
            <dd class="okr-proportion">{{ kritem.okrWeight }}%</dd>
            <!-- kr承接项 -->
            <!-- <dd class="okr-undertake">
              <slot name="body-bar" :okritem="kritem"></slot>
            </dd> -->
            <!-- kr风险状态 -->
            <dd class="okr-risk">
              <div class="state-grid" v-if="!overview">
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
              <div v-if="!overview" class="state-txt">
                {{ CONFIDENCE_MAP[kritem.okrDetailConfidence] }}
              </div>
            </dd>
            <!-- kr进度 -->
            <dd class="okr-progress">
              <slot name="progress-krbar" :okritem="kritem"></slot>
              <tl-process
                v-if="!showUpdate"
                :data="parseInt(kritem.okrDetailProgress, 10)"
              ></tl-process>
            </dd>

            <!-- kr无更新进度 仅占位-->
            <!-- <dd class="okr-update"></dd> -->
            <!-- kr更多操作 -->
            <dd class="okr-operating">
              <slot name="moreHandle-krbar" :okritem="kritem"></slot>
            </dd>
          </dl>
        </template>
      </el-table-column>
      <!-- 目标O名称 无label -->
      <el-table-column prop="okrDetailObjectKr" width="43%">
        <template slot-scope="scope">
          <div class="tag-kind">
            <span class="kind-parent">目标{{ scope.$index + 1 }}</span>
            <!-- kr数量  -->
            <span class="kr-num">「{{ scope.row.krList.length }}个KR」</span>
            <el-tooltip
              effect="dark"
              placement="top"
              popper-class="tl-tooltip-popper"
            >
              <div slot="content">{{ scope.row.okrDetailObjectKr }}</div>
              <em>{{ scope.row.okrDetailObjectKr }}</em>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <!-- o label="权重" -->
      <el-table-column prop="okrWeight" width="5%">
        <template slot-scope="scope"
          ><em class="okr-weight">{{ scope.row.okrWeight }}%</em></template
        >
      </el-table-column>
      <!-- o label="承接地图" -->
      <!-- <el-table-column width="8%">
        <template slot-scope="scope">
          <slot name="head-undertake" :okritem="scope.row"></slot>
        </template>
      </el-table-column> -->
      <!-- o label="关联父目标" -->
      <el-table-column prop="parentObjectKr" width="20%">
        <template slot-scope="scope" v-if="!overview">
          <el-popover
            v-if="scope.row.parentUpdate"
            placement="bottom"
            width="200"
            trigger="hover"
            :append-to-body="true"
          >
            <span v-if="showUpdate && ['1', 1, 3, '3'].includes(status)">
              您关联的父目标有变更，请在变更中处理。
              <a @click="opensome">申请变更</a>
            </span>
            <span v-else>关联的父目标有变更</span>
            <i class="icon-remind" slot="reference"></i>
          </el-popover>
          <el-tooltip
            v-if="scope.row.parentObjectKr"
            effect="dark"
            placement="top"
            popper-class="tl-tooltip-popper"
          >
            <div slot="content">{{ scope.row.parentObjectKr }}</div>
            <em class="hide-more">{{ scope.row.parentObjectKr }}</em>
          </el-tooltip>
          <el-tooltip
            v-else-if="
              scope.row.undertakeOkrDto &&
              scope.row.undertakeOkrDto.undertakeOkrContent
            "
            effect="dark"
            placement="top"
            popper-class="tl-tooltip-popper"
          >
            <div slot="content">
              {{ scope.row.undertakeOkrDto.undertakeOkrContent }}
            </div>
            <em class="hide-more"
              >{{ scope.row.undertakeOkrDto.undertakeOkrContent }}
            </em>
          </el-tooltip>
          <el-tooltip
            v-else-if="
              scope.row.undertakeOkrVo &&
              scope.row.undertakeOkrVo.undertakeOkrContent
            "
            effect="dark"
            placement="top"
            popper-class="tl-tooltip-popper"
          >
            <div slot="content">
              {{ scope.row.undertakeOkrVo.undertakeOkrContent }}
            </div>
            <em class="hide-more">{{
              scope.row.undertakeOkrVo.undertakeOkrContent
            }}</em>
          </el-tooltip>
          <el-tooltip
            v-else-if="scope.row.cultureName"
            effect="dark"
            placement="top"
            popper-class="tl-tooltip-popper"
          >
            <div slot="content">
              {{ scope.row.cultureName }}
            </div>
            <em class="hide-more">{{ scope.row.cultureName }}</em>
          </el-tooltip>
          <em v-else>暂无</em>
        </template>
      </el-table-column>
      <!-- o无风险状态 label="信心指数" -->
      <el-table-column width="9%"></el-table-column>

      <!-- o label="进度" -->
      <el-table-column prop="okrDetailProgress" width="14%">
        <template slot-scope="scope">
          <em class="progress-number">{{ scope.row.okrDetailProgress }}%</em>
        </template>
      </el-table-column>
      <!-- label="操作"  -->
      <el-table-column width="4%">
        <template slot-scope="scope">
          <slot name="moreHandle-obar" :okritem="scope.row"></slot>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import process from '@/components/process';

const CONFIDENCE_MAP = {
  1: '高',
  2: '中',
  3: '低',
};

export default {
  name: 'okrTable',
  components: {
    'tl-process': process,
  },
  data() {
    return {
      CONFIDENCE_MAP,
      okrmain: {},
      formData: {},
      innerActiveList: [],
    };
  },
  props: {
    tableList: {
      type: Array,
    },
    okrid: {
      type: String,
    },
    // 默认展开的序号数组
    // 如果 disabled为true，需传入activeList
    expands: {
      type: Array,
      default() {
        return [];
      },
    },
    overview: {
      type: Boolean,
      default() {
        return false;
      },
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
    // 是否显示label
    showUpdate: {
      type: Boolean,
      default: true,
    },
    status: {
      defalut: 1,
    },
  },
  mounted() {
  },
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
      roleCode: (state) => state.roleCode,
    }),
    showUndertake() {
      if (this.roleCode.includes('ORG_ADMIN') || this.roleCode.includes('TEAM_ADMIN')) {
        return true;
      } if (this.showUpdate) {
        return false;
      }
      return true;
    },
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
    goUndertake(index) {
      // 给父组件传打开的命令
      console.log('dakai');
      this.$emit('openUndertake', index);
    },
    // 改变tableList后强制渲染
    updateokrCollapse() {
      this.$forceUpdate();
    },
    opensome() {
      this.$emit('openchange');
    },
    // 展示收起
    handleOpen() {
      if (this.expands.length < this.tableList.length) {
        let allexpands = [];
        allexpands = this.tableList.map((item) => item.okrDetailId);
        // this.tableList.forEach((item) => {
        //   this.expands.push(item.okrDetailId);
        //   console.log(item);
        // });
        this.$emit('update:expands', allexpands);
      } else {
        this.$emit('update:expands', []);
        // this.expands = [];
      }
    },
    echange(a, b) {
      const result = b.map((ii) => ii.okrDetailId);
      this.$emit('update:expands', result);
    },
  },
  watch: {

  },
};
</script>