<template>
  <div v-loading="pageLoading" class="teams-weekly">
    <div class="operating-area">
      <div class="operating-box">
        <el-button plain class="tl-btn amt-border-slip" @click="goback"
          >返回<span class="lines"></span
        ></el-button>
      </div>
    </div>
    <div class="cont-area">
      <!-- <template v-if="openOrClose == 'OPEN'"> -->
      <template>
        <div class="weekly">
          <dl class="user-info">
            <dt>当前周报</dt>
            <dd v-if="infoParams.headerUrl">
              <img
                v-if="infoParams.headerUrl"
                :src="infoParams.headerUrl"
                alt
              />
            </dd>
            <dd v-else-if="infoParams.userName" class="user-name">
              <em>{{
                infoParams.userName.substring(infoParams.userName.length - 2)
              }}</em>
            </dd>
            <dd>{{ infoParams.userName }}</dd>
            <dd>
              <em>{{ infoParams.weekDate }}</em>
            </dd>
          </dl>
        </div>
        <div class="weekly-cont">
          <!-- <dl class="user-info">
            <dt>当前周报</dt>
            <dd v-if="true">
              <img
                v-if="infoParams.headerUrl"
                :src="infoParams.headerUrl"
                alt
              />
            </dd>
            <dd v-else-if="infoParams.userName" class="user-name">
              <em>{{
                infoParams.userName.substring(
                  infoParams.userName.length - 2
                )
              }}</em>
            </dd>
            <dd>{{ infoParams.userName }}</dd>
          </dl> -->
          <el-form
            ref="work"
            :model="workForm"
            :key="workForm.workId"
            v-for="(workForm, index) in weeklyWorkVoList"
            label-width="70px"
            class="tl-form"
          >
            <div class="flex-sb">
              <div class="item-title">
                <i></i><span>工作项</span><em>{{ index + 1 }}</em>
              </div>
            </div>
            <div class="form-item">
              <div class="form-item-group">
                <el-form-item label="工作项">
                  <em> {{ workForm.workContent }}</em>
                </el-form-item>
                <el-form-item label="内容">
                  <pre class="font-normal">{{ workForm.workDesc }}</pre>
                </el-form-item>
              </div>
              <div class="form-item-group">
                <el-form-item label="进度">
                  <div class="tl-progress-group">
                    <tl-process
                      :data="parseInt(Number(workForm.workProgress), 10)"
                      :showNumber="true"
                    ></tl-process>
                  </div>
                </el-form-item>
                <el-form-item label="工时" class="time-cascader">
                  <em>{{ getTimes(workForm, "updated", "days") }}</em>
                  <div class="working-hours-info">
                    <span>{{ getTimes(workForm, "updated", "info") }}</span>
                  </div>
                </el-form-item>
                <el-form-item label="项目">
                  <div class="tag-group">
                    <ul>
                      <li v-if="workForm.projectNameCn">
                        <!-- <el-tooltip
                          v-if="workForm.projectId != 'DEFAULT_PROJECT'"
                          class="select-values"
                          effect="dark"
                          placement="top"
                          popper-class="tl-tooltip-popper"
                        >
                          <em slot="content">{{ workForm.projectNameCn }}</em> -->
                        <em>{{ workForm.projectNameCn }}</em>
                        <!-- </el-tooltip>
                        <div v-else>
                          <em>{{ workForm.projectNameCn }}</em>
                        </div> -->
                      </li>
                    </ul>
                  </div>
                </el-form-item>
                <el-form-item label="支撑OKR/价值观">
                  <div
                    class="tag-group"
                    v-if="
                      workForm.okrCultureValueList.length > 0 ||
                      workForm.workOkrList.length > 0
                    "
                  >
                    <ul>
                      <li
                        v-for="value in workForm.okrCultureValueList"
                        :key="value.id"
                      >
                        <!-- <el-tooltip
                          class="select-values"
                          effect="dark"
                          placement="top"
                          popper-class="tl-tooltip-popper"
                        >
                          <em slot="content">{{ value.cultureName }}</em> -->
                        <em>{{ value.cultureName }}</em>
                        <!-- </el-tooltip> -->
                      </li>
                      <li v-for="value in workForm.workOkrList" :key="value.id">
                        <!-- <el-tooltip
                          class="select-values"
                          effect="dark"
                          placement="top"
                          popper-class="tl-tooltip-popper"
                        >
                          <em slot="content">{{ value.okrDetailObjectKr }}</em> -->
                        <em>{{ value.okrDetailObjectKr }}</em>
                        <!-- </el-tooltip> -->
                      </li>
                    </ul>
                  </div>
                  <div v-else>
                    <ul>
                      <li>
                        <em>不关联任何OKR</em>
                      </li>
                    </ul>
                  </div>
                  <div class="tag-group">
                    <ul class="tag-lists">
                      <li
                        v-for="item in workForm.selectedOkr"
                        :key="item.okrDetailId"
                      >
                        <el-tooltip
                          class="select-values"
                          effect="dark"
                          placement="top"
                          popper-class="tl-tooltip-popper"
                        >
                          <em slot="content">{{ item.okrDetailObjectKr }}</em>
                          <em>{{ item.okrDetailObjectKr }}</em>
                        </el-tooltip>
                      </li>
                    </ul>
                  </div>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
        <dl class="dl-card-panel weekly-thoughts">
          <dt class="card-title"><em>本周感想、建议、收获</em></dt>
          <dd v-for="item in weeklyThoughtList" :key="item.thoughtId">
            <div class="tag-group">
              <div
                v-if="item.thoughtType == 0"
                class="tag-kinds"
                @click="thoughtTypeChange(item, 0)"
                :class="{ 'is-thoughts': item.thoughtType == 0 }"
              >
                <span>感想</span>
              </div>
              <div
                v-if="item.thoughtType == 1"
                class="tag-kinds"
                @click="thoughtTypeChange(item, 1)"
                :class="{ 'is-suggest': item.thoughtType == 1 }"
              >
                <span>建议</span>
              </div>
              <div
                v-if="item.thoughtType == 2"
                class="tag-kinds"
                @click="thoughtTypeChange(item, 2)"
                :class="{ 'is-harvest': item.thoughtType == 2 }"
              >
                <span>收获</span>
              </div>
            </div>
            <pre>{{ item.thoughtContent }}</pre>
          </dd>
          <dd v-if="weeklyThoughtList.length < 1" class="no-data">
            <em>本周没有填写感想、建议或者收获！</em>
          </dd>
        </dl>
        <!-- 下周计划-->
        <!-- <dl class="dl-card-panel week-plan" :class="{ 'is-edit': canUpdate }"> -->
        <dl class="dl-card-panel week-plan">
          <dt class="card-title"><em>下周计划</em></dt>
          <dd v-if="weeklyPlanList.length < 1" class="no-data">
            <em>本周未填写下周计划</em>
          </dd>
          <dd v-for="(item, index) in weeklyPlanList" :key="item.workId">
            <div>
              <em>{{ index + 1 }}</em>
            </div>
            <pre>{{ item.planContent }}</pre>
          </dd>
        </dl>
        <dl class="dl-card-panel okr-completion">
          <dt class="card-title"><em>个人OKR完成度</em></dt>
          <dd
            class="undertake-okr-list"
            :class="
              item.parentOkrDetail && item.parentOkrDetail.okrDetailId
                ? 'is-kr'
                : 'is-o'
            "
            v-for="item in weeklyOkrVoList"
            :key="item.okrDetailId"
          >
            <div
              class="o-kr-group"
              v-if="item.parentOkrDetail && item.parentOkrDetail.okrDetailId"
            >
              <div class="tag-kind">
                <span class="kind-parent">目标</span>
                <!-- <el-tooltip
                  class="select-values"
                  effect="dark"
                  placement="top"
                  popper-class="tl-tooltip-popper"
                >
                  <em slot="content">{{
                    item.parentOkrDetail.okrDetailObjectKr
                  }}</em> -->
                <em>{{ item.parentOkrDetail.okrDetailObjectKr }}</em>
                <!-- </el-tooltip> -->
              </div>
            </div>
            <div class="o-kr-group">
              <template
                v-if="item.parentOkrDetail && item.parentOkrDetail.okrDetailId"
              >
                <div class="tag-kind">
                  <span class="kind-child">KR</span>
                  <!-- <el-tooltip
                    class="select-values"
                    effect="dark"
                    placement="top"
                    popper-class="tl-tooltip-popper"
                  >
                    <em slot="content">{{
                      item.okrDetail.okrDetailObjectKr
                    }}</em> -->
                  <em>{{ item.okrDetail.okrDetailObjectKr }}</em>
                  <!-- </el-tooltip> -->
                  <span
                    >被工作项<em>{{ itemIndex(item) }}</em
                    >支撑</span
                  >
                </div>
              </template>
              <template v-else>
                <div class="tag-kind">
                  <span class="kind-parent">目标</span>
                  <!-- <el-tooltip
                    class="select-values"
                    effect="dark"
                    placement="top"
                    popper-class="tl-tooltip-popper"
                  >
                    <em slot="content">{{
                      item.okrDetail.okrDetailObjectKr
                    }}</em> -->
                  <em>{{ item.okrDetail.okrDetailObjectKr }}</em>
                  <!-- </el-tooltip> -->
                  <span
                    >被工作项<em>{{ itemIndex(item) }}</em
                    >支撑</span
                  >
                </div>
              </template>
              <div
                class="okr-risk"
                v-if="item.parentOkrDetail && item.parentOkrDetail.okrDetailId"
              >
                <span>信心指数</span>
                <div class="state-grid">
                  <div
                    :class="{
                      'is-no-risk': item.confidenceAfter == 1,
                      'is-risks': item.confidenceAfter == 2,
                      'is-uncontrollable': item.confidenceAfter == 3,
                    }"
                  ></div>
                  <div
                    :class="{
                      'is-risks': item.confidenceAfter == 2,
                      'is-uncontrollable': item.confidenceAfter == 3,
                    }"
                  ></div>
                  <div
                    :class="{
                      'is-uncontrollable': item.confidenceAfter == 3,
                    }"
                  ></div>
                </div>
                <div class="state-txt">
                  {{ riskMap[item.confidenceAfter] }}
                </div>
              </div>
              <div class="tl-progress-group">
                <span>当前进度</span>
                <tl-process
                  :data="parseInt(item.progressAfter, 10)"
                  :showNumber="false"
                  :width="30"
                  :marginLeft="2"
                ></tl-process>
                <em>{{ item.progressAfter }}</em>
                <span>%</span>
              </div>
              <div class="week-change">
                <span>本周变化</span
                ><em
                  >{{ item.progressAfter - item.progressBefor > 0 ? "+" : ""
                  }}{{ item.progressAfter - item.progressBefor }}%</em
                >
              </div>
            </div>
          </dd>
          <dd v-if="weeklyOkrVoList.length < 1" class="no-data">
            <em>周报暂无支撑OKR或价值观</em>
          </dd>
        </dl>
        <!-- 本周心情 -->
        <dl class="dl-card-panel mood">
          <dt class="card-title"><em>本周心情</em></dt>
          <dd>
            <ul>
              <li
                v-if="weeklyEmotion === 100"
                class="has-harvest"
                :class="{ 'is-selected': weeklyEmotion === 100 }"
              >
                <i></i><i></i>
              </li>
              <li
                v-if="weeklyEmotion === 50"
                class="not-too-bad"
                :class="{ 'is-selected': weeklyEmotion === 50 }"
              >
                <i></i><i></i>
              </li>
              <li
                v-if="weeklyEmotion === 0"
                class="let-quiet"
                :class="{ 'is-selected': weeklyEmotion === 0 }"
              >
                <i></i><i></i>
              </li>
            </ul>
          </dd>
        </dl>
        <dl class="dl-card-panel who-browse">
          <dt class="card-title"><em>谁浏览了</em></dt>
          <dd>
            <div class="img-list">
              <dl v-for="user in visitUserNameList" :key="user">
                <dt class="user-info">
                  <img v-if="user.headerUrl" :src="user.headerUrl" alt />
                  <div class="user-name" v-else>
                    <em>{{
                      user.userName.substring(user.userName.length - 2)
                    }}</em>
                  </div>
                </dt>
                <dd>{{ user.userName }}</dd>
              </dl>
            </div>
          </dd>
          <dd>
            <div class="btn-box">
              <el-button
                type="primary"
                @click="support(1)"
                v-if="hasPower('weekly-support')"
                class="tl-btn amt-bg-slip"
                >送金条({{ supportCount }})
                <el-tooltip
                  effect="dark"
                  placement="top"
                  popper-class="tl-tooltip-popper send-gold"
                >
                  <div slot="content">
                    若有收获，那就送他(她)一根金条吧～～～
                  </div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </el-button>
            </div>
          </dd>
        </dl>
      </template>
      <!-- <template v-if="openOrClose == 'CLOSE'"
        >该用户所在团队未公开周报</template
      > -->
    </div>
  </div>
</template>

<script>
import tlProcess from '@/components/process';
import { mapState } from 'vuex';
import Server from '../server';
import mixin from '../../myWeekly/mixin';

const server = new Server();
export default {
  name: 'teamWeeklyInfo',
  mixins: [mixin],
  components: {
    'tl-process': tlProcess,
  },
  props: {
    infoParams: {
      type: Object,
    },
  },
  data() {
    return {
      server,
      pageLoading: true,
      weeklyWorkVoList: [],
      weeklyThoughtList: [],
      weeklyPlanList: [],
      weeklyOkrVoList: [],
      visitUserNameList: [],
      // openOrClose: '',
      supportCount: 0,
      weeklySupport: {},
      weeklyEmotion: '',
      riskMap: {
        1: '高',
        2: '中',
        3: '低',
      },

    };
  },
  created() { this.init(); },
  mounted() {},
  computed: {
    ...mapState('common', {
      userInfo: (state) => state.userInfo,
    }),
    setOkrStyle() {
      return (item) => {
        if (item && item.length > 5) {
          return `${item.slice(0, 5)}...`;
        }
        return item;
      };
    },
    itemIndex() {
      return (okr) => {
        const result = [];
        this.weeklyWorkVoList.forEach((item) => {
          item.workOkrList.forEach((element) => {
            if (okr.okrDetailId == element.okrDetailId) {
              result.push(this.weeklyWorkVoList.indexOf(item) + 1);
            }
          });
        });
        return result.join('、');
      };
    },

  },
  methods: {
    init() {
      // this.judgePower();
      this.queryWeekly();
    },
    // judgePower() {
    // 是否是本部门
    // if (!!this.infoParams.orgId && this.userInfo.orgId != this.infoParams.orgId) {
    //   // 该部门是否开放周报
    //   this.server.getTypeConfig({
    //     sourceId: this.infoParams.orgId, configType: 'WEEKLY', configTypeDetail: 'W-1', level: 'O',
    //   }).then((res) => {
    //     if (res.code == 200) {
    //       if (res.data.length > 0 && res.data[0].configItemCode == 'O') {
    //         this.queryWeekly();
    //       } else {
    //         this.openOrClose = 'CLOSE';
    //         this.pageLoading = false;
    //       }
    //     }
    //   });
    // } else {
    //   this.queryWeekly();
    // }
    // },
    queryWeekly() {
      this.server.queryWeekly({ weeklyId: this.infoParams.weeklyId }).then((res) => {
        if (res.code == 200) {
          // this.weeklyType = res.data.weeklyType;
          this.weeklyEmotion = res.data.weeklyEmotion;
          this.weeklyWorkVoList = res.data.weeklyWorkVoList;
          this.weeklyThoughtList = res.data.weeklyThoughtList;
          this.weeklyPlanList = res.data.weeklyPlanList;
          this.weeklyOkrVoList = res.data.weeklyOkrVoList;
          this.visitUserNameList = res.data.visitUserNameList;
          this.supportCount = res.data.supportCount;
          this.weeklySupport = res.data.weeklySupport || {};
        }
        // this.openOrClose = 'OPEN';
        this.pageLoading = false;
      });
    },
    errorHandler() {
      return true;
    },
    support(type) {
      const params = {
        weeklyId: this.infoParams.weeklyId,
        supported: type,
        id: '', // 没点过赞
      };
      // 被点赞过
      if (this.weeklySupport && this.weeklySupport.id) {
        if (type == this.weeklySupport.supported) { // 已点赞，取消点赞
          params.supported = 0;
        }
        params.id = this.weeklySupport.id;
      }
      this.server.support(params).then((res) => {
        if (res.code == 200) {
          this.queryWeekly();
        }
      });
    },
    format(percentage) {
      return percentage === 100 ? '完成' : `${percentage}%`;
    },
    goback() {
      this.$emit('showList');
    },
    cutName(userName) {
      const nameLength = userName.length;
      return userName.substring(nameLength - 2, nameLength);
    },
  },
  watch: {},
  updated() {},
  beforeDestroy() {},
};
</script>
<style lang="css">
.is-thoughts {
  background: rgb(123, 243, 197);
}
.is-suggest {
  background: rgb(228, 241, 151);
}
.is-harvest {
  background: rgb(95, 138, 218);
}
.no-risk {
  background: green;
}
.risk-is-controlled {
  background: yellow;
}
.risk-cannot-be-controlled {
  background: red;
}
.support-is-selected {
  color: red;
}
</style>
