<template>
  <div class="undertake-maps-detail">
    <div class="cont-area">
      <elcollapse
        accordion
        @change="okrCheck"
        class="tl-collapse-other"
        v-model="activeList"
      >
        <elcollapseitem
          ref="okrcoll"
          v-for="okrItem in okrInfoList"
          :key="okrItem.okrDetailId"
          :name="okrItem.okrDetailId"
        >
          <template slot="title">
            <dl class="tag-kind">
              <dt :class="{ 'is-o': okrItem.okrDetailType == 0 }">
                <span v-if="okrItem.okrDetailType == 0" class="kind-parent"
                  >目标O</span
                >
                <span v-else class="kind-child">KR</span>
                <em>{{ okrItem.okrDetailObjectKr }}</em>
              </dt>
              <dd>
                <tl-process
                  :data="okrItem.okrDetailProgress"
                  :width="30"
                  :marginLeft="6"
                ></tl-process>
              </dd>
              <dd>
                <i class="el-icon-arrow-right"></i>
                <em>{{ okrItem.undertakeCount }}个</em>
                <span>支撑项可对齐</span>
              </dd>
            </dl>
          </template>
          <!-- 操作按钮 -->
          <dl class="align-history">
            <dt>
              <template v-if="checkStatus === 0">
                <i class="el-icon-time"></i>
                <span
                  class="can-click"
                  @click="okrCheck(okrItem.okrDetailId, 1)"
                  >历史okr对齐</span
                >
              </template>
              <a v-else @click="okrCheck(okrItem.okrDetailId, 0)">返回》</a>
            </dt>
            <!-- 对齐 -->
            <dd>
              <span
                v-if="
                  personList.length > 0 ||
                  (okrItem.undertakeCount > 0 && checkStatus === 0)
                "
                >以下人员承接了你的OKR，他们的工作进展用于你的OKR更新</span
              >
              <el-button
                v-if="
                  okrItem.undertakeCount > 0 &&
                  checkStatus === 0 &&
                  okrItem.okrDetailType == 1
                "
                type="primary"
                @click="openUpdate(okrItem)"
                class="tl-btn amt-bg-slip"
                >更新进展</el-button
              >
              <el-button
                type="primary"
                class="tl-btn amt-bg-slip"
                v-if="
                  okrItem.undertakeCount > 0 &&
                  checkStatus === 0 &&
                  okrItem.okrDetailType == 0
                "
                @click="updateSyncHistoryStatus(okrItem)"
                >已阅</el-button
              >
            </dd>
            <!-- <dd v-else>暂无可对齐的支撑项</dd> -->
          </dl>

          <!-- 历史对齐的内容 -->
          <div v-if="checkStatus === 1">
            <!-- 暂无数据 -->
            <div class="no-data" v-if="personList.length == 0">
              暂无可对齐的支撑项
            </div>
            <dl v-for="pitem in personList" :key="pitem.id">
              <dt class="undertake-name">
                <span>{{ pitem[0].userName }}</span>
                <span>({{ pitem.length }})</span>
              </dt>
              <dd class="tl-custom-timeline">
                <dl class="timeline-list">
                  <dd v-for="okritem in pitem" :key="okritem.createTime">
                    <div class="list-info">
                      <div class="list-title">
                        <span>{{ okritem.createTime }}</span>
                        <div>
                          <span>本次更新进度</span>
                          <em v-if="okritem.okrDetailProgress > 0"
                            >+{{ okritem.okrDetailProgress }}%</em
                          >
                          <em v-else>{{ okritem.okrDetailProgress }}%</em>
                        </div>
                      </div>
                      <div class="list-cont">
                        <div
                          v-if="
                            okritem.operateType == 5 || okritem.operateType == 7
                          "
                        >
                          <span v-if="okritem.okrDetailType == 0">目标O</span>
                          <span v-else>关键结果KR</span>
                          <em>{{ okritem.okrContent }}</em>
                        </div>
                        <div
                          v-if="
                            okritem.operateType == 5 || okritem.operateType == 7
                          "
                        >
                          <span>更新说明</span>
                          <em>{{ okritem.remark }}</em>
                        </div>
                        <div v-if="okritem.operateType == 6">
                          <span>周报周期</span>
                          <em>
                            {{ okritem.weekBegin }} ~ {{ okritem.weekEnd }}
                          </em>
                        </div>
                        <div v-if="okritem.operateType == 6">
                          <span>支撑项</span>
                          <em>{{ okritem.okrContent }}</em>
                        </div>
                        <div>
                          <span
                            >来自-{{
                              CONST.OPERATE_TYPE_MAP[okritem.operateType]
                            }}</span
                          >
                        </div>
                      </div>
                    </div>
                  </dd>
                </dl>
              </dd>
            </dl>
          </div>
          <div v-else>
            <!-- 暂无数据 -->
            <div class="no-data" v-if="okrItem.historyList.length == 0">
              暂无可对齐的支撑项
            </div>
            <dl v-for="pitem in okrItem.historyList" :key="pitem.id">
              <dt class="undertake-name">
                <span>{{ pitem[0].userName }}</span>
                <span>({{ pitem.length }})</span>
              </dt>
              <dd class="tl-custom-timeline">
                <dl class="timeline-list">
                  <dd v-for="okritem in pitem" :key="okritem.createTime">
                    <div class="list-info">
                      <div class="list-title">
                        <div>{{ okritem.createTime }}</div>
                        <div>
                          <span>本次更新进度</span>
                          <em v-if="okritem.okrDetailProgress > 0"
                            >+{{ okritem.okrDetailProgress }}%</em
                          >
                          <em v-else>{{ okritem.okrDetailProgress }}%</em>
                        </div>
                      </div>
                      <div class="list-cont">
                        <div
                          v-if="
                            okritem.operateType == 5 || okritem.operateType == 7
                          "
                        >
                          <span v-if="okritem.okrDetailType == 0">目标O</span>
                          <span v-else>关键结果KR</span>
                          <em>{{ okritem.okrContent }}</em>
                        </div>
                        <div
                          v-if="
                            okritem.operateType == 5 || okritem.operateType == 7
                          "
                        >
                          <span>更新说明</span>
                          <em>{{ okritem.remark }}</em>
                        </div>
                        <div v-if="okritem.operateType == 6">
                          <span>周报周期</span>
                          <em>
                            {{ okritem.weekBegin }} ~ {{ okritem.weekEnd }}
                          </em>
                        </div>
                        <div v-if="okritem.operateType == 6">
                          <span>支撑项</span>
                          <em>{{ okritem.okrContent }}</em>
                        </div>
                        <div>
                          <span
                            >来自-{{
                              CONST.OPERATE_TYPE_MAP[okritem.operateType]
                            }}</span
                          >
                        </div>
                      </div>
                    </div>
                  </dd>
                </dl>
              </dd>
            </dl>
          </div>
        </elcollapseitem>
      </elcollapse>
      <tl-update-progress
        ref="tlokrupdate"
        :server="server"
        :okrForm="choseOkrInfo"
        :dialogExist.sync="dialogExist"
        @success="queryOAndKrList"
      ></tl-update-progress>
    </div>
    <div class="operating-area">
      <div class="operating-area-inside">
        <div class="operating-box">
          <el-button plain @click="goback" class="tl-btn amt-border-slip">
            返回
            <span class="lines"></span>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapState, mapMutations } from 'vuex';
import elcollapse from '@/components/collapse/collapse';
import elcollapseitem from '@/components/collapse/collapse-item';
import process from '@/components/process';
import updateProgress from './updateProgress';
import Server from '../server';
import CONST from '../const';

const server = new Server();

export default {
  name: 'undertakeDetail',
  components: {
    elcollapse,
    elcollapseitem,
    'tl-update-progress': updateProgress,
    'tl-process': process,
  },
  data() {
    return {
      CONST,
      server,
      personList: [],
      dialogExist: false,
      checkStatus: 0,
      okrInfoList: [],
      choseOkrInfo: {},
      undertakeCount: 0,
      loading: true,
      activeList: [],
    };
  },
  created() {
    this.queryOAndKrList();
  },
  computed: {
    ...mapState('common', {
      undertakeDetail: (state) => state.undertakeDetail,
      undertakePeriodId: (state) => state.undertakePeriodId,
    }),
  },
  methods: {
    ...mapMutations('common', ['setUndertakeMapsStep', 'setundertakeDetail']),
    queryOAndKrList() {
      this.server.queryOAndKrList({
        okrDetailId: this.undertakeDetail.okrDetailId,
        periodId: this.undertakePeriodId,
      }).then((res) => {
        if (res.code == 200) {
          this.activeList = [];
          this.okrInfoList = res.data || [];
          this.okrInfoList.forEach((item) => {
            if (item.historyList) {
              item.undertakeCount = 0;
              item.historyList.forEach((hitem) => {
                item.undertakeCount += hitem.length;
                if (hitem.length > 0) {
                  this.undertakeCount += hitem.length;
                  hitem.forEach((citem) => {
                    const contentObject = JSON.parse(citem.content) || {};
                    // eslint-disable-next-line max-len
                    if (citem.operateType == 5) {
                      citem.okrDetailProgress = (contentObject.afterProgress - contentObject.beforeProgress) || 0;
                    } else if (
                      citem.operateType == 6
                    ) {
                      citem.okrDetailProgress = (contentObject.progressAfter - contentObject.progressBefor) || 0;
                      citem.weekBegin = this.dateFormat('YYYY-mm-dd', contentObject.weekBegin);
                      citem.weekEnd = this.dateFormat('YYYY-mm-dd', contentObject.weekEnd);
                    } else if (
                      citem.operateType == 7
                    ) {
                      citem.okrDetailProgress = (contentObject.afterProgress - contentObject.beforeProgress) || 0;
                    }
                    citem.remark = citem.reason || '暂无';
                  });
                }
              });
            }
          });
        }
      });
    },
    okrCheck(okrDetailId, checkStatus = 0) {
      this.checkStatus = checkStatus;
      this.okrDetailId = okrDetailId || '';
      if (this.checkStatus == 0) {
        return;
      }
      this.server.okrCheck({
        checkStatus,
        okrDetailId: this.okrDetailId,
      }).then((res) => {
        if (res.code == 200) {
          this.personList = res.data || [];
          this.personList.forEach((pitem) => {
            if (pitem.length > 0) {
              this.undertakeCount += pitem.length;
              pitem.forEach((citem) => {
                const contentObject = JSON.parse(citem.content) || {};
                // eslint-disable-next-line max-len
                if (citem.operateType == 5) {
                  citem.okrDetailProgress = (contentObject.afterProgress - contentObject.beforeProgress) || 0;
                } else if (
                  citem.operateType == 6
                ) {
                  citem.okrDetailProgress = (contentObject.progressAfter - contentObject.progressBefor) || 0;
                  citem.weekBegin = this.dateFormat('YYYY-mm-dd', contentObject.weekBegin);
                  citem.weekEnd = this.dateFormat('YYYY-mm-dd', contentObject.weekEnd);
                } else if (
                  citem.operateType == 7
                ) {
                  citem.okrDetailProgress = (contentObject.afterProgress - contentObject.beforeProgress) || 0;
                }
                citem.remark = citem.reason || '暂无';
              });
            }
          });
        }
      });
    },
    openUpdate(info) {
      this.choseOkrInfo = info;
      // 打开更新okr
      this.dialogExist = true;

      this.$nextTick(() => {
        this.$refs.tlokrupdate.showOkrDialog();
      });
    },
    updateSyncHistoryStatus(info) {
      this.$xconfirm({
        content: '',
        title: '确认已阅？',
      }).then(() => {
        this.server.updateSyncHistoryStatus({ detailId: info.detailId }).then((res) => {
          if (res.code == 200) {
            this.queryOAndKrList();
          }
        });
      }).catch(() => {});
    },
    goback() {
      this.setUndertakeMapsStep('1');
      this.setundertakeDetail({});
    },
  },
};
</script>

<style>
</style>