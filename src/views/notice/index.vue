<template>
  <div class="msg-notice">
    <div class="operating-area">
      <div class="page-title">消息通知</div>
      <div class="operating-box">
        <el-radio-group
          v-model="messageType"
          @change="change"
          class="tl-radio-group"
        >
          <el-radio-button label="10">系统消息</el-radio-button>
          <el-radio-button label="30">互动消息</el-radio-button>
        </el-radio-group>
        <el-radio-group
          v-model="readValue"
          @change="change"
          class="tl-radio-group"
        >
          <el-radio-button label>全部</el-radio-button>
          <el-radio-button label="0">未读</el-radio-button>
          <el-radio-button label="1">已读</el-radio-button>
        </el-radio-group>
        <el-button
          plain
          @click="$router.go('-1')"
          class="tl-btn amt-border-slip"
        >
          <em>返回</em><span class="lines"></span>
        </el-button>
      </div>
    </div>
    <div class="cont-area">
      <!-- 业务通知，系统消息 -->
      <tl-crcloud-table
        v-if="messageType == '10' && loading"
        :total="totalSystem"
        :currentPage.sync="currentPageSystem"
        :pageSize.sync="pageSizeSystem"
        @searchList="searchList('10')"
      >
        <div slot="tableContainer" class="table-container">
          <el-table :data="tableDataSystem" class="tl-table">
            <el-table-column
              prop="msgContent"
              label="通知内容"
              align="left"
              min-width="200px"
            >
              <template slot-scope="scope">
                <a @click="showDetail(scope.row)">{{ scope.row.msgContent }}</a>
              </template>
            </el-table-column>
            <el-table-column
              v-if="messageType == '10'"
              prop="msgType"
              label="通知类型"
              align="left"
            >
              <template slot-scope="scope">
                <span>{{ CONST.MSG_MAP[scope.row.msgType] }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="sendUserName" label="通知人" align="left">
            </el-table-column>
            <el-table-column
              prop="createDate"
              label="通知时间"
              align="left"
            ></el-table-column>
          </el-table>
        </div>
      </tl-crcloud-table>
      <!-- 互动消息 -->
      <tl-crcloud-table
        v-if="messageType == '30' && loading"
        :total="total"
        :currentPage.sync="currentPage"
        :pageSize.sync="pageSize"
        @searchList="searchList('30')"
      >
        <div slot="tableContainer" class="table-container">
          <el-table :data="tableData" class="tl-table">
            <el-table-column
              prop="msgContent"
              label="通知内容"
              min-width="200px"
              align="left"
            >
              <template slot-scope="scope">
                <a @click="showDetail(scope.row)">{{ scope.row.msgContent }}</a>
              </template>
            </el-table-column>
            <el-table-column
              prop="createDate"
              label="通知时间"
              align="left"
            ></el-table-column>
          </el-table>
        </div>
      </tl-crcloud-table>
    </div>
    <tl-notice-detail
      v-if="detailExist"
      ref="detail"
      @close="close"
    ></tl-notice-detail>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import crcloudTable from '@/components/crcloudTable';
import noticeDetail from './components/noticeDetail';
import Server from './server';
import CONST from './const';

const server = new Server();
export default {
  name: 'notice',
  data() {
    return {
      CONST,
      server,
      messageType: '10',
      readValue: '0',
      total: 0,
      totalSystem: 0,
      currentPage: 1,
      currentPageSystem: 1,
      pageSize: 10,
      pageSizeSystem: 10,
      tableData: [],
      tableDataSystem: [],
      detailExist: false,
      loading: true,
    };
  },
  components: {
    'tl-crcloud-table': crcloudTable,
    'tl-notice-detail': noticeDetail,
  },
  mounted() {
    this.searchList(this.messageType);
  },
  mixins: [global],
  methods: {
    ...mapMutations('common', ['setTotalMeaasge']),
    searchList(type) {
      let params = {};
      if (type == '10') {
        params = {
          currentPage: this.currentPageSystem,
          pageSize: this.pageSizeSystem,
        };
      } else if (type == '30') {
        params = {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
        };
      }
      params.msgType = this.messageType;
      params.readedStatus = this.readValue;
      this.loading = false;
      this.server.innermsg(params).then((res) => {
        if (res.code == '200') {
          if (type == '10') {
            this.tableDataSystem = res.data.content;
            this.totalSystem = res.data.total;
          } else if (type == '30') {
            this.tableData = res.data.content;
            this.total = res.data.total;
          }
          this.loading = true;
        }
      });
    },
    change() {
      this.currentPage = 1;
      this.currentPageSystem = 1;
      this.pageSize = 10;
      this.pageSizeSystem = 10;
      this.searchList(this.messageType);
    },
    close() {
      this.searchList(this.messageType);
    },
    showDetail(data) {
      if (data.readedStatus == '0') {
        this.server.readed({
          msgIds: data.msgId,
        }).then((response) => {
          if (response.code == '200') {
            this.server.unread().then((res) => {
              if (res.code == '200') {
                this.setTotalMeaasge(res.data);
              }
            });
          }
        });
      }
      this.detailExist = true;
      this.$nextTick(() => {
        this.$refs.detail.show(data);
      });
    },
  },

};
</script>