<template>
  <el-dialog
    :append-to-body="true"
    :visible="visible"
    @close="close"
    :before-close="close"
    :title="info.projectNameCn"
    :close-on-click-modal="false"
    class="tl-dialog"

    width="900px"
  >
   <tl-crcloud-table
        :total="total"
        :currentPage.sync="currentPage"
        :pageSize.sync="pageSize"
        @searchList="searchList"
      >
       <!-- <tl-crcloud-table
        :isPage="false"
      > -->
        <div slot="tableContainer" class="table-container project-members">
    <el-table :data="tableData"  class="tl-table"  style="height:500px;overflow-y: scroll;">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="changeDate(props.row.contentJson)" row-key="supplementId">

            <el-table-column prop="userName" label="姓名"></el-table-column>
            <el-table-column prop="userLevel" label="级别"></el-table-column>
            <el-table-column prop="workContent" label="工作项">

            </el-table-column>
             <el-table-column prop="weekDateStr" label="工作日期">
                <template slot-scope="scope">
                {{checkDate(scope.row.weekDateStr)}}
                </template>
            </el-table-column>
              <el-table-column prop="weekTime" label="工时投入(天)">
            </el-table-column>
                 <el-table-column prop="workDesc" label="工时内容">
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column  label="调入时间" prop="createTime">
         <template slot-scope="scope">
           {{dateFormat('YYYY-mm-dd HH:MM:SS',scope.row.createTime)}}
         </template>
      </el-table-column>
      <el-table-column  label="提交人" prop="userName"></el-table-column>
      <el-table-column prop="weekTimeCount" label="工时投入(天)">
      </el-table-column>
      <el-table-column prop="costAmt" label="人力成本(人民币)">
      </el-table-column>

    </el-table>
        </div>
   </tl-crcloud-table>
  </el-dialog>
</template>

<script>

import crcloudTable from '@/components/crcloudTable';
import CONST from '../../const';
import Server from '../../server';

const server = new Server();
export default {
  name: 'approval',
  data() {
    return {
      server,
      CONST,
      visible: false,
      popoverVisible: false,
      loading: false,
      timeSheet: 0.5,
      confirmSheet: 0.5,
      info: {},
      remark: '',
      editRemark: '',
      tableData: [],
      companyList: [],
      funcList: [],
      levelList: [],
      currentPage: 1,
      pageSize: 10,
      projectId: '',
      total: 0,
    };
  },

  computed: {},
  components: {
    'tl-crcloud-table': crcloudTable,
  },
  mounted() {
    this.getCode();
  },
  methods: {
    unique(arr) {
      // Set数据结构，它类似于数组，其成员的值都是唯一的
      return Array.from(new Set(arr)); // 利用Array.from将Set结构转换成数组
    },
    checkDate(time) {
      const arrTime = time.split(',');
      const list = arrTime.map((item) => this.dateFormat('mm月dd日', item));
      return this.unique(list).join(',');
    },
    changeDate(date) {
      console.log(date);
      return JSON.parse(date);
    },
    show(projectId) {
      this.projectId = projectId;
      this.searchList();
      this.visible = true;
    },
    searchList() {
      this.server.userWorkHistory({ projectId: this.projectId, currentPage: this.currentPage, pageSize: this.pageSize })
        .then((res) => {
          this.tableData = res.data.content;
          this.total = res.data.total;
        });
    },

    close() {
      this.visible = false;
    },
    getCode() {
      this.server.queryByCodes({
        codes: ['PROJECT_TECH_TYPE', 'PROJECT_EMPLOYEE_LEVEL', 'PROJECT_EMPLOYEE_COMPANY'],
      }).then((res) => {
        if (res.code == '200') {
          this.codes = res.data;
          this.codes.forEach((item) => {
            switch (item.code) {
              case 'PROJECT_EMPLOYEE_LEVEL':
                this.levelList = item.subList;
                break;
              case 'PROJECT_TECH_TYPE':
                this.funcList = item.subList;
                break;
              case 'PROJECT_EMPLOYEE_COMPANY':
                this.companyList = item.subList;
                break;
              default:
                break;
            }
          });
        }
      });
    },
    getName(code, arr) {
      let name = arr.filter((item) => item.value == code);
      if (name.length == 0) {
        name = [{ meaning: '' }];
      }
      return name[0].meaning;
    },
  },
  watch: {},
};
</script>
