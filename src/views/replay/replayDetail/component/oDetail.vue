<template>
  <div class="kr-replay">
    <elcollapse class="tl-collapse okr-change-list" v-model="activeNames">
      <elcollapseitem
        ref="o-kr-replay"
        v-for="(item, index) in okrMain.okrReviewPojoList"
        :key="index"
        :name="index"
      >
        <template slot="title">
          <dl class="is-o">
            <dt class="tag-kind">
              <span class="kind-parent">目标</span>
              <em>{{ item.o.okrDetailObjectKr }}</em>
            </dt>
            <dd>
              <div>
                <i class="el-icon-medal"></i>
                <span>权重</span>
                <em>{{ item.o.okrWeight }}%</em>
              </div>
              <div>
                <i class="el-icon-odometer"></i>
                <span>进度</span>
                <tl-process
                  :data="parseInt(item.o.okrDetailProgress, 10)"
                ></tl-process>
              </div>
              <!-- <div>
                <i class="el-icon-attract"></i>
                <span>关联父目标</span>
                <em
                  v-if="
                    oData.undertakeOkrDto &&
                    oData.undertakeOkrDto.undertakeOkrContent
                  "
                  ><em>{{ oData.undertakeOkrDto.undertakeOkrContent }}</em
                  ><em>{{ oData.cultureName }}</em></em
                >
                <em
                  v-else-if="
                    oData.undertakeOkrVo &&
                    oData.undertakeOkrVo.undertakeOkrContent
                  "
                  ><em>{{ oData.undertakeOkrVo.undertakeOkrContent }}</em
                  ><em>{{ oData.cultureName }}</em></em
                >
                <em v-else-if="oData.cultureName">{{ oData.cultureName }}</em>
                <em v-else>暂无</em>
              </div> -->
            </dd>
          </dl>
        </template>
        <dl class="is-kr" v-for="(list, i) in item.krs" :key="i">
          <dt class="tag-kind">
            <span class="kind-child">KR</span>
            <em>{{ list.okrDetailObjectKr }}</em>
          </dt>
          <dd>
            <div>
              <i class="el-icon-medal"></i>
              <span>权重</span>
              <em>{{ list.okrWeight }}%</em>
            </div>
            <div>
              <i class="el-icon-odometer"></i>
              <span>进度</span>
              <tl-process
                :data="parseInt(list.okrDetailProgress, 10)"
              ></tl-process>
            </div>
          </dd>

          <dd>
            <div>
              <span>考核指标</span>
              <em> {{ list.checkQuota }}</em>
            </div>
          </dd>
          <dd>
            <div>
              <span>衡量方法</span>
              <em> {{ list.judgeMethod }}</em>
            </div>
          </dd>
          <!-- <div>
              <i class="el-icon-bell"></i>
              <span>信心指数</span>
              <div class="state-grid">
                <div
                  :class="{
                    'is-no-risk': krData.okrDetailConfidence == 1,
                    'is-risks': krData.okrDetailConfidence == 2,
                    'is-uncontrollable': krData.okrDetailConfidence == 3,
                  }"
                ></div>
                <div
                  :class="{
                    'is-risks': krData.okrDetailConfidence == 2,
                    'is-uncontrollable': krData.okrDetailConfidence == 3,
                  }"
                ></div>
                <div
                  :class="{
                    'is-uncontrollable': krData.okrDetailConfidence == 3,
                  }"
                ></div>
              </div>
              <div class="state-txt">
                {{ CONST.CONFIDENCE_MAP[krData.okrDetailConfidence] }}
              </div>
            </div> -->
        </dl>
        <dl class="is-kr">
          <dd v-show="false"></dd>
          <dd v-show="false"></dd>
          <dd v-show="false"></dd>
          <dd>
            <dl>
              <dt>价值与收获</dt>
              <dd>{{ item.o.advantage }}</dd>
            </dl>

            <dl>
              <dt>问题与不足</dt>
              <dd>{{ item.o.disadvantage }}</dd>
            </dl>

            <dl>
              <dt>改进措施</dt>
              <dd v-for="(li, d) in item.o.measure || []" :key="d">{{ li }}</dd>
            </dl>

            <dl v-if="okrMain.okrMainVo.reviewStatus == 3">
              <dt>复盘沟通</dt>
              <dd>
                {{ item.o.communication }}
              </dd>
            </dl>
            <dl v-if="okrMain.okrMainVo.reviewStatus == 3">
              <dt>评论</dt>
              <dd>
                <dl class="tag-lists">
                  <dd
                    :class="[
                      {
                        'is-selected':
                          item.o.communicationLabel ==
                          selectColor(item.o.communicationLabel).txt,
                      },
                      selectColor(item.o.communicationLabel).clsName,
                    ]"
                  >
                    <em>{{ item.o.communicationLabel }}</em>
                  </dd>
                </dl>
              </dd>
            </dl>
          </dd>
        </dl>
      </elcollapseitem>
    </elcollapse>
  </div>
</template>

<script>
import elcollapse from '@/components/collapse/collapse';
import elcollapseitem from '@/components/collapse/collapse-item';
import process from '@/components/process';
import Server from '../../server';

const server = new Server();
export default {
  name: 'home',
  props: ['okrMain'],
  data() {
    return {
      reviewType: 0,
      form: {},
      activeNames: [0],
      server,
      active: {},
      deficiency: {},
      communication: {},
      communicationLabel: {},
      list: [],
      listBtn: [
        {
          txt: '超级优秀',
          clsName: 'super-good',
        },
        {
          txt: '优秀',
          clsName: 'good',
        },
        {
          txt: '继续努力',
          clsName: 'work-hard',
        },
        {
          txt: '要加油哦',
          clsName: 'refuel',
        },
      ],
    };
  },
  components: {
    elcollapse,
    elcollapseitem,
    'tl-process': process,
  },
  methods: {
    selectColor(txt) {
      const data = this.listBtn.filter((item) => item.txt == txt);
      return data[0];
    },

  },
};
</script>