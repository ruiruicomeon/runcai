<template>
  <div class="tl-item-cont">
    <!-- <el-input
      placeholder="输入用户名称/LDAP账号"
      minlength="64"
      @keyup.native="fuzzyQueryUser()"
      v-model="keyWord"
      class="tl-input-search"
    >
      <i class="el-icon-search" slot="prefix"></i>
    </el-input>-->
    <div class="tl-transfer-select">
      <div class="select-target">
        <div class="transfer-head">
          <div class="crumbs">
            <!-- <em @click="clearUser" :class="light==0?'is-subset':''">润联科技</em> -->
            <em
              :class="light==item.id?'is-subset':''"
              v-for="(item,index) in selectList"
              :key="index"
              @click="getqueryOrgAndUser(item)"
            >{{item.name}}</em>
          </div>
        </div>
        <el-scrollbar>
          <ul class="txt-list" v-show="showLoad">
            <li v-for="(item,index) in data" :key="index" @click="getqueryOrgAndUser(item)">
              <el-checkbox
                :key="item.id"
                class="tl-checkbox"
                @change="checkMember($event,item)"
                v-model="value[item.id]"
                v-if="item.type=='USER'"
              >
                <div class="img-user">
                  <img v-if="false" src="@/assets/images/user/user.jpg" alt />
                  <div class="user-name" v-else>{{checkName(item.name)}}</div>
                </div>
                <em>{{item.name}}</em>
              </el-checkbox>
              <!-- <div v-else class="flex-sb">
                <em>{{item.name}}</em>
                <i class="el-icon-arrow-right"></i>
              </div>-->
            </li>
          </ul>
        </el-scrollbar>
      </div>
      <!-- <div class="selected-target">
        <div class="transfer-head">
          <div class="selected-number">
            <span>已选</span>
          </div>
          <div class="clear" @click="clearMember">清空</div>
        </div>
        <el-scrollbar>
          <ul class="txt-list">
            <li v-for="(item,index) in roulelist" :key="index">
              <div class="img-user">
                <img v-if="false" src="@/assets/images/user/user.jpg" alt />
                <div class="user-name" v-else>{{checkName(item.userName)}}</div>
              </div>
              <em>{{item.userName}}</em>
              <i class="el-icon-close" @click="deleteMember(index,item.userId)"></i>
            </li>
          </ul>
        </el-scrollbar>
      </div>-->
    </div>
  </div>
</template>
<script>
import Server from '../server';

const server = new Server();
export default {
  name: 'selectMember',
  props: {
    orgInfo: {
      type: [Object, String],
    },
  },
  data() {
    return {
      server,
      filterText: '',
      dialogTableVisible: false,
      roulelist: [],
      data: [],
      form: {},
      member: '',
      value: {},
      selectList: [],
      keyWord: '',
      light: 0,
      showLoad: true,
    };
  },
  mounted() {
    this.dialogTableVisible = true;
    console.log(this.orgInfo);
    this.orgInfo.id = this.orgInfo.orgId;
    this.orgInfo.level = 2;
    this.getqueryOrgAndUser(this.orgInfo);
  },
  methods: {
    checkName(name) {
      return name.substring(name.length - 2);
    },
    clearUser() {
      this.getqueryOrgAndUser({});
      this.selectList = [];
      this.light = 0;
    },
    getqueryOrgAndUser(item) {
      if (item.type == 'USER') return false;
      this.showLoad = false;
      this.selectList[item.level - 2] = item;
      this.light = item.id;
      this.selectList.splice((item.level - 1), this.selectList.length - (item.level - 2));
      this.server.queryOrgAndUser({
        orgId: item.id,
      }).then((res) => {
        if (res.code == 200) {
          this.data = res.data.reverse();
          this.showLoad = true;
        }
      });
    },
    clearMember() {
      this.roulelist = [];
      // eslint-disable-next-line guard-for-in
      for (const key in this.value) {
        this.value[key] = false;
      }
      this.member = this.roulelist;
      this.$emit('getMember', this.member);
    },
    checkMember(node, data) {
      this.value[data.id] = node;
      // eslint-disable-next-line guard-for-in
      for (const keys in this.value) {
        if (data.id !== keys) {
          this.value[keys] = false;
        }
      }
      if (node) {
        this.roulelist = [{
          userName: data.name,
          userId: data.id,
          roleId: this.$route.query.roleId,
          orgId: data.parentId,
        }];
      } else {
        this.roulelist.forEach((item) => {
          if (item.userId == data.id) {
            this.roulelist = [];
          }
        });
      }
      this.member = this.roulelist;
      this.$emit('getMember', this.member);
    },
    getRember(data) {
      this.server.listOrgUser({
        orgId: data.id,
      }).then((res) => {
        this.data = res.data.content.map((item) => ({
          label: item.userName,
          id: item.id,
          type: 'user',
          userId: item.userId,
          orgId: item.orgId,
        }));
      });
    },
    fuzzyQueryUser() {
      if (this.keyWord == '') {
        this.getqueryOrgAndUser({});
        return false;
      }
      this.server.fuzzyQueryUser({
        keyWord: this.keyWord,
      }).then((res) => {
        this.data = res.data.map((item) => ({
          id: item.userId,
          name: item.userName,
          parentId: item.orgId,
          type: 'USER',
        }));
      });
    },
    deleteMember(index, id) {
      console.log({ value: this.value, id });
      this.$set(this.value, id, false);
      this.roulelist.splice(index, 1);
    },

  },
};
</script>