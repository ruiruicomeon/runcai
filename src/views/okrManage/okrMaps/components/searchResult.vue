<template>
  <div class="tab-cont-list">
    <div v-if="searchData.length == 0" class="no-data">
      <div class="bg-no-data-search"></div>
      <div class="no-data-txt">暂无数据</div>
    </div>
    <dl
      v-for="item in searchData"
      :key="item.resource_id"
      @click="gotoView(item)"
    >
      <dt v-if="searchType == '1'">{{ item.periodName }}</dt>
      <dd>
        <div class="user-info">
          <span>负责人</span>
          <img v-if="true" src="@/assets/images/user/user.jpg" alt />
          <em v-else class="user-name">{{ cutName(item.userName) }}</em>
          <em>{{ item.userName }}</em>
        </div>
        <div v-if="searchType == '3'">
          <span>部门</span>
          <em>{{ item.orgName }}</em>
        </div>
        <div>
          <span>目标数(O)</span>
          <em>{{ item.ocount }}</em>
        </div>
        <div>
          <span>关键结果(KR)</span>
          <em>{{ item.krCount }}</em>
        </div>
        <div>
          <span>状态</span>
          <i></i>
          <em>{{ CONST.STATUS_MAP[item.status] }}</em>
        </div>
        <div>
          <span>当前进度</span>
          <el-progress
            type="circle"
            :percentage="`${parseInt(item.okrDetailProgress, 10)}`"
            :width="60"
            :stroke-width="5"
            color="#4ccd79"
            class="tl-progress-circle"
          ></el-progress>
        </div>
      </dd>
    </dl>
  </div>
  <!-- <div v-for="item in searchData" :key="item.resource_id" style="display:flex;">
      <div style="display:flex;">
        <div v-html="item.okr_detail_content"></div>
        <div style="display:flex;">
          <div>
            <span>负责人</span>
            <el-avatar icon="el-icon-user-solid"></el-avatar>
            <span>{{item.user_name}}</span>
          </div>
          <div>
            <span>目标数(O)</span>
            <span>{{item.ocount}}</span>
          </div>
          <div>
            <span>关键结果(KR)</span>
            <span>{{item.krCount}}</span>
          </div>
          <div>
            <span>状态(O)</span>
            <span>{{CONST.STATUS_MAP[item.status]}}</span>
          </div>
        </div>
      </div>
      <div style="display: flex;">
        <div>当前进度</div>
        <el-progress type="circle" :percentage="item.okrDetailProgress"></el-progress>
      </div>
  </div>-->
</template>

<script>
import CONST from '../const';

export default {
  name: 'searchResult',
  components: {},
  props: {
    searchData: {
      type: Array,
      default() {
        return [];
      },
    },
    searchType: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      CONST,
    };
  },
  mounted() {},
  computed: {},
  methods: {
    goDetail(okrid) {
      this.$emit('showDetail', okrid);
    },
    gotoView(row) {
      // const data = { node: row };
      this.$emit('takeOvierview', row);
    },
  },
  watch: {},
};
</script>