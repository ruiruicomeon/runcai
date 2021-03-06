/* eslint-disable operator-linebreak */
import Vue from 'vue';
import axios from 'axios';

const $bus = new Vue();
export default {
  methods: {
    exportExcel(url, param = {}, fileName) {
      const origin = window.location.origin ?
        window.location.origin :
        window.location.href.split('/#')[0];
      return new Promise((resolve) => {
        axios({
          method: 'post', // 方法
          url: `${origin}${url}`, // 地址
          responseType: 'blob',
          headers: {
            token: localStorage.token,
          },
          data: param || {},
        }).then((response) => {
          resolve();
          if (!response.data) {
            return;
          }
          const fileUrl = window.URL.createObjectURL(new Blob([response.data]));
          // try {
          //   const _fileName = response.headers['content-disposition'].split('=');
          //   fileName =
          //     param.name ||
          //     (!!_fileName && _fileName.length > 1 ? _fileName[1] : 'file');
          // } catch (err) {
          //   console.log(err);
          // }
          // 兼容IE10+、edge
          if (
            window.URL.createObjectURL(new Blob()).indexOf(window.location.host) < 0
          ) {
            if (window.navigator.msSaveOrOpenBlob) {
              // IE10+方法
              const blobObject = new Blob([response.data], {
                type: 'application/vnd.ms-excel',
              });
              window.navigator.msSaveOrOpenBlob(
                blobObject,
                decodeURI(fileName),
              );
            }
            // 兼容chrome、fireFox
          } else {
            const link = document.createElement('a');
            link.style.display = 'none';
            link.href = fileUrl;
            link.setAttribute('download', decodeURI(fileName));
            document.body.appendChild(link);
            link.click();
          }
          this.$message.success('导出成功');
        });
      });
    },
    replaceName(data) {
      const parentName = data.orgName;
      if (data.children && data.children.length > 0) {
        data.children.forEach((item) => {
          if (item.orgName.indexOf(parentName) > -1) {
            item.orgName = item.orgName.replace(`${parentName}-`, '');
          }
          this.replaceName(item);
        });
      }
    },
    hasPower(power) {
      // console.log(power);
      const userPowers = (window.$store.state.common.userInfo.allMenuList || []).map((item) => item
        .functionCode);
      if (typeof power == 'string') {
        return !!userPowers.includes(power) || (power == '');
      } if (Array.isArray(power)) {
        let result = true;
        if (!userPowers.includes('admin')) {
          power.forEach((item) => {
            if (!userPowers.includes(item)) {
              result = false;
            }
          });
        }
        return result;
      }
    },
    // 读取缓存
    localRead(key) {
      return localStorage.getItem(key) || '';
    },
    // 缓存
    localSave(key, value) {
      localStorage.setItem(key, value);
    },
    // 查询域名
    getOrigin() {
      const origin = window.location.origin ? window.location.origin : window.location.href.split(
        '/#',
      )[0];
      return origin;
    },
    // 查询链接参数
    getParams(url) {
      const keyValueArr = url.split('?')[1] ? url.split('?')[1].split('&') : [];
      const paramObj = {};
      keyValueArr.forEach((item) => {
        const keyValue = item.split('=');
        // eslint-disable-next-line prefer-destructuring
        paramObj[keyValue[0]] = keyValue[1];
      });
      return paramObj;
    },
    // 直接下载nginx上资源
    downloadDoc(docName, locale) {
      const url = locale == 'N' ?
        `${process.env.API.VUE_APP_PORTAL}/resource/${docName}` :
        `${process.env.API.VUE_APP_PORTAL}/resource/${this.localRead('locale')}/${docName}`;
      window.open(url);
    },
    // 清除cookie
    clearCookie() {
      // eslint-disable-next-line no-useless-escape
      const keys = document.cookie.match(/[^ =;]+(?=\=)/g);
      if (keys) {
        // eslint-disable-next-line no-plusplus
        for (let i = keys.length; i--;) {
          document.cookie =
            `${keys[i]}=0;path=/;expires=${new Date(0).toUTCString()}`; // 清除当前域名下的,例如：m.kevis.com
          document.cookie =
            `${keys[i]}=0;path=/;domain=${document.domain};expires=${new Date(0).toUTCString()}`; // 清除当前域名下的，例如 .m.kevis.com
          document.cookie =
            `${keys[i]}=0;path=/;domain=kevis.com;expires=${new Date(0).toUTCString()}`; // 清除一级域名下的或指定的，例如 .kevis.com
        }
      }
    },
    // 跳转
    go(name, config = {}, isResetScroll = false) {
      this.$router.push({
        name,
        ...config,
      });
      if (isResetScroll) {
        this.$resetScroll();
      }
    },
    // 重置滚动条 跳转时调用
    resetScroll() {
      this.$busEmit('resetScroll');
    },
    busEmit(eventName, params = {}) {
      $bus.$emit(eventName, params);
    },
    /* 用法
         dateFormat("YYYY-mm-dd HH:MM:SS", date) */
    dateFormat(fmt, dateRep) {
      let date = '';
      if (dateRep instanceof Date) {
        date = dateRep;
      } else {
        let dateCheck;
        if (dateRep.indexOf('T') != -1) {
          dateCheck = dateRep.replace('T', ' ');
        } else {
          dateCheck = dateRep;
        }

        // eslint-disable-next-line no-useless-escape
        date = new Date(dateCheck.replace(/\-/g, '/'));
      }

      let ret;
      const opt = {
        'Y+': date.getFullYear().toString(), // 年
        'm+': (date.getMonth() + 1).toString(), // 月
        'd+': date.getDate().toString(), // 日
        'H+': date.getHours().toString(), // 时
        'M+': date.getMinutes().toString(), // 分
        'S+': date.getSeconds().toString(), // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      // eslint-disable-next-line guard-for-in
      for (const k in opt) {
        ret = new RegExp(`(${k})`).exec(fmt);
        if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1]
            .length, '0')));
        }
      }
      return fmt;
    },
    isDate(str) {
      if (!/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/.test(str)) { return false; }
      const year = RegExp.$1 - 0;
      const month = RegExp.$2 - 1;
      const date = RegExp.$3 - 0;
      const obj = new Date(year, month, date);
      return !!(obj.getFullYear() == year && obj.getMonth() == month && obj.getDate() == date);
    },
    /**
     * @author: 王益
     * @description: 简化版信息确认弹框
     * @param content: 确认内容，title：弹窗标题， obj：element组件其他配置，其中obj.callback为确定后回调
     * @return: 无
     * @example：
     * this.$simpleConfirm('恭喜你中福彩大奖500万，点击确定按钮跳转到领奖页面，确认继续？', '温馨提示', {
     *   confirmButtonText: '确定',
     *   cancelButtonText: '取消',
     *   callback() {// instance为提示弹窗实例，done为关闭弹窗实例函数引用，具体查看element文档
     *     return server.doSomething();
     *   }
     * })
     */
    $simpleConfirm(text, title, obj) {
      const {
        callback,
      } = obj;
      delete obj.callback;
      this.$confirm(text, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        ...obj,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            callback(instance, done).then(() => {
              instance.confirmButtonLoading = false;
              done();
            }).catch(() => {
              instance.confirmButtonLoading = false;
            });
          } else {
            instance.confirmButtonLoading = false;
            try {
              done();
            } catch (error) {
              console.info(error);
            }
          }
        },
      });
    },
    createXmsgboxMsg(obj) {
      function createContent(content) {
        if (typeof content === 'object') {
          return `${content.map((item) => `
            <dd>${item}</dd>
          `).join('')}`;
        }
        if (typeof content === 'string') {
          return `<dd>${content}</dd>`;
        }
      }
      const tailMsg = `
        <dl class="dialog-title">
          <dt>${obj.title}</dt>
          ${createContent(obj.content)}
        </dl>
      `;
      obj.title = ''; // 删除弹框自带的title,保留关闭按钮
      return `
          <div class="tip-icon"><i></i></div>
          ${tailMsg}
        `;
    },
    $xmsgbox(obj) {
      const {
        callback,
        cancelCallback,
        refuseCallback,
      } = obj;
      delete obj.callback;
      delete obj.cancelCallback;
      delete obj.refuseCallback;
      return this.$msgbox({
        message: this.createXmsgboxMsg(obj),
        showClose: false,
        showCancelButton: false,
        showConfirmButton: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        closeOnClickModal: false,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            if (typeof callback == 'function') {
              instance.confirmButtonLoading = true;
              callback(instance, done).then(() => {
                instance.confirmButtonLoading = false;
                done();
              }).catch(() => {
                instance.confirmButtonLoading = false;
              });
            } else {
              done();
            }
          } else if (action === 'cancel' && !cancelCallback) {
            if (typeof refuseCallback == 'function') {
              instance.cancelButtonLoading = true;
              refuseCallback(instance, done).then(() => {
                instance.cancelButtonLoading = false;
                done();
              }).catch(() => {
                instance.cancelButtonLoading = false;
              });
            } else {
              done();
            }
          } else {
            instance.confirmButtonLoading = false;
            try {
              if (typeof cancelCallback == 'function') {
                cancelCallback();
              }
              done();
            } catch (error) {
              console.info(error);
            }
          }
        },
        ...obj,
      });
    },

    $xconfirm(obj) {
      obj.msgType = 'confirm';
      obj.showConfirmButton = true;
      obj.showCancelButton = obj.showCancelButton !== false;
      obj.customClass = 'confirm has-close-icon';
      return this.$xmsgbox(obj);
    },
    $xwarning(obj) {
      obj.msgType = 'warning';
      obj.customClass = 'warning';
      obj.showConfirmButton = true;
      return this.$xmsgbox(obj);
    },
    $xsuccess(obj) {
      obj.msgType = 'success';
      obj.customClass = 'success';
      return this.$xmsgbox(obj);
    },
    $xerror(obj) {
      obj.msgType = 'error';
      obj.customClass = 'error';
      return this.$xmsgbox(obj);
    },
    $xwaiting(obj) {
      obj.msgType = 'waiting';
      obj.customClass = 'waiting';
      return this.$xmsgbox(obj);
    },
    $busOn(eventName, callback = () => { }) {
      $bus.$on(eventName, callback);
    },
    $busEmit(eventName, params = {}) {
      $bus.$emit(eventName, params);
    },
    // 下载附件
    openFile(obj) {
      const origin = window.location.origin
        ? window.location.origin
        : window.location.href.split('/#')[0];
      const url = `${origin}/gateway/crcloud-cert/outside/resource/download?resourceId=${obj.resourceId}`;
      const temp = obj.resourceName.split('.');
      const fileType = temp[temp.length - 1];
      const images = {
        jpg: true,
        jpeg: true,
        png: true,
        bmp: true,
        gif: true,
      };
      if (images[fileType]) {
        this.$refs.imgDialog.show(url);
      } else {
        window.open(url);
      }
    },
    cutOrgName(orgName) {
      if (this.hasValue(orgName)) {
        const namelist = orgName.split('-');
        if (namelist.length) {
          return namelist[namelist.length - 1];
        }
      }
      return orgName;
    },
    hasValue(value) {
      return ((value !== false) && ![undefined, null, ''].includes(value)) || (value === 0) || (value === '0');
    },
    getRandomId() {
      return Math.random().toString(36).substr(3);
    },
    // 深拷贝
    deepCopy(obj) {
      const newObj = obj.constructor === Array ? [] : {};
      if (typeof obj !== 'object') {
        return obj;
      }
      for (const i in obj) {
        if (typeof obj[i] === 'object' && this.hasValue(obj[i])) { // 判断对象的这条属性是否为对象
          newObj[i] = this.deepCopy(obj[i]); // 若是对象进行嵌套调用
        } else {
          newObj[i] = obj[i];
        }
      }

      return newObj; // 返回深度克隆后的对象
    },

    getPageTable(list, page, pageSzie) {
      const pageOne = page - 1;
      // const pageNum = list.length / page;
      const listPage = list.slice(pageOne * pageSzie, pageOne * pageSzie + pageSzie);
      return {
        total: list.length,
        list: listPage,
      };
    },
    // 根据日期判断是月的第几周
    getWeekInMonth(t) {
      if (t == undefined || t == '' || t == null) {
        t = new Date();
      } else {
        const _t = new Date();
        _t.setYear(t.getFullYear());
        _t.setMonth(t.getMonth());
        _t.setDate(t.getDate());

        const date = _t.getDate(); // 给定的日期是几号

        _t.setDate(1);
        const d = _t.getDay(); // 1. 得到当前的1号是星期几。
        let fisrtWeekend = d;
        if (d == 0) {
          fisrtWeekend = 1;
          // 1号就是星期天
        } else {
          fisrtWeekend = 7 - d + 1; // 第一周的周未是几号
        }
        if (date <= fisrtWeekend) {
          return 1;
        }
        return 1 + Math.ceil((date - fisrtWeekend) / 7);
      }
    },

  },

};
