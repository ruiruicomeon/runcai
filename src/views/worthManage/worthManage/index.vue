<template>
  <div class="event-book">
    <el-form
      ref="ruleForm"
      :inline="true"
      class="tl-form-inline"
      v-if="hasPower('culture-event-query')"
    >
      <el-form-item label="组织">
        <el-cascader
          ref="cascader"
          v-model="orgIdLIst"
          :options="departmentData"
          :show-all-levels="false"
          @change="selectIdChange"
          :props="{
            checkStrictly: true,
            expandTrigger: 'click',
            value: 'orgId',
            label: 'orgName',
            children: 'children',
          }"
          popper-class="tl-cascader-popper"
          class="tl-cascader"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="价值观">
        <el-select
          v-model.trim="formData.worthId"
          placeholder="请选择"
          @change="changeSearch"
          popper-class="tl-select-dropdown"
          class="tl-select"
        >
          <el-option
            v-for="item in worthList"
            :key="item.id"
            :label="item.cultureName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="评价">
        <el-select
          v-model.trim="formData.scoreId"
          placeholder="请选择"
          @change="changeSearch"
          popper-class="tl-select-dropdown"
          class="tl-select"
        >
          <el-option
            v-for="item in CONST.SCORE_LIST"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <tl-crcloud-table
      :total="total"
      :currentPage.sync="currentPage"
      :pageSize.sync="pageSize"
      @searchList="searchList"
    >
      <div slot="tableContainer" class="table-container">
        <el-table :data="tableData" class="tl-table">
          <el-table-column prop="userName" label="员工" min-width="220">
            <template slot-scope="scope">
              <div class="user-info">
                <img
                  v-if="scope.row.headImageUrl"
                  :src="scope.row.headImageUrl"
                  alt
                />
                <div v-else-if="scope.row.userName" class="user-name">
                  <em>{{
                    scope.row.userName.substring(scope.row.userName.length - 2)
                  }}</em>
                </div>
              </div>
              <div class="user-name-txt">
                <em>{{ scope.row.userName }}</em>
                <em>{{ scope.row.forgName }} - {{ scope.row.orgName }}</em>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="cultureName"
            label="支撑价值观"
            min-width="80"
          ></el-table-column>
          <el-table-column
            prop="workContent"
            label="工作项"
            min-width="320"
          ></el-table-column>
          <el-table-column prop="score" label="评价" min-width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.score == '50' && scope.row.scoreLabel">{{
                `${CONST.SCORE_MAP[scope.row.score]}(${scope.row.scoreLabel})`
              }}</span>
              <span
                v-else-if="
                  scope.row.score == '10' ||
                  scope.row.score == '20' ||
                  scope.row.score == '30' ||
                  scope.row.score == '40' ||
                  scope.row.score == '50'
                "
                >{{ CONST.SCORE_MAP[scope.row.score] }}</span
              >
              <span v-else>--</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="scoreTime" label="评价时间" min-width="160">
            <template slot-scope="scope">
              <span v-if="scope.row.scoreTime">{{ scope.row.scoreTime }}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="支撑时间"
            min-width="160"
          ></el-table-column> -->
          <el-table-column label="操作" width="220">
            <template slot-scope="scope">
              <el-button @click="goWeekly(scope.row)" type="text" class="tl-btn"
                >查看周报</el-button
              >
              <el-button
                v-if="!scope.row.score"
                @click="score(scope.row, 'create')"
                type="text"
                class="tl-btn"
                >评价</el-button
              >
              <el-button
                v-if="scope.row.score"
                @click="score(scope.row, 'edit')"
                type="text"
                class="tl-btn"
                >修改评价</el-button
              >
              <el-button
                v-if="scope.row.score"
                @click="detail(scope.row)"
                type="text"
                class="tl-btn"
                >评价详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </tl-crcloud-table>
    <tl-score
      v-if="scoreExist"
      ref="score"
      :server="server"
      @success="closedScore"
    ></tl-score>
    <tl-detail
      v-if="scoreDetailExist"
      ref="scoreDetail"
      :server="server"
    ></tl-detail>
  </div>
</template>

<script>
import crcloudTable from '@/components/crcloudTable';
import score from './components/score';
import detail from './components/detail';
import Server from '../server';
import CONST from '../const';

const server = new Server();
export default {
  name: 'worthManage',
  data() {
    return {
      server,
      CONST,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      formData: {
        scoreId: '',
        worthId: '',
        orgName: '',
        orgFullId: '',
      },
      tableData: [],
      worthList: [],
      scoreWorthList: [],
      departmentData: [],
      // orgFullIdList: [],
      // showCascader: false,
      orgIdLIst: [],
      scoreExist: false,
      scoreDetailExist: false,

    };
  },
  components: {
    'tl-crcloud-table': crcloudTable,
    'tl-score': score,
    'tl-detail': detail,
  },
  mixins: [global],
  mounted() {
    this.server.queryCultureList().then((res) => {
      if (res.code == '200') {
        this.worthList = res.data;
        this.scoreWorthList = res.data;
        if (this.worthList.length > 0) {
          this.worthList.unshift({
            id: '',
            cultureName: '全部',
          });
        }
      }
    });
    this.getOrgTable();
  },
  methods: {
    searchList() {
      if (this.hasPower('culture-event-query')) {
        if (this.formData.orgFullId) {
          this.server.weeklyEvents({
            cultureId: this.formData.worthId,
            score: this.formData.scoreId,
            orgFullId: this.formData.orgFullId,
            currentPage: this.currentPage,
            pageSize: this.pageSize,
          }).then((res) => {
            if (res.code == '200') {
              this.tableData = res.data.content;
              this.total = res.data.total;
            }
          });
        }
      }
    },
    selectIdChange(data) {
      this.orgIdLIst = data;
      this.$refs.cascader.dropDownVisible = false;
      this.formData.orgFullId = data.join(':');
      // this.orgFullIdList = this.formData.orgFullId.split(':');
      // this.orgFullIdList.splice(this.orgFullIdList.length - 1, 1);
      // this.getOrgName(this.departmentData, 0);
      this.searchList();
    },
    getOrgTable() {
      // 查询组织树
      this.server.getOrgTable().then((res) => {
        if (res.code == '200') {
          if (res.data) {
            this.departmentData.push(res.data);
            this.formData.orgFullId = this.departmentData[0].orgFullId;
            // this.orgFullIdList = this.formData.orgFullId.split(':');
            // this.orgFullIdList.splice(this.orgFullIdList.length - 1, 1);
            this.orgIdLIst = [res.data.orgId];
            // this.getOrgName(this.departmentData, 0);
            this.searchList();
          }
        }
      });
    },
    // getOrgName(data, index) {
    //   data.forEach((item) => {
    //     if (this.orgFullIdList[index] == item.orgId) {
    //       if (item.children && item.children.length > 0 && this.orgFullIdList[index + 1]) {
    //         this.getOrgName(item.children, index + 1);
    //       } else if ((index + 1) == this.orgFullIdList.length) {
    //         this.formData.orgName = item.orgName;
    //       }
    //     }
    //   });
    // },
    changeSearch() {
      this.searchList();
    },
    score(data, type) {
      const self = this;
      self.scoreExist = true;
      self.$nextTick(() => {
        self.$refs.score.show(data, type);
      });
    },
    detail(data) {
      const self = this;
      self.scoreDetailExist = true;
      self.$nextTick(() => {
        self.$refs.scoreDetail.show(data);
      });
    },
    closedScore() {
      this.scoreExist = false;
      this.searchList();
    },
    scoreDetal() {},
    goWeekly(data) {
      this.$router.push({
        name: 'teamWeeklyInfo',
        query: {
          weeklyId: data.weeklyId,
          userName: data.userName,
          orgId: data.orgId,
          headerUrl: data.headImageUrl,
        },
      });
    },
  },

};
</script>