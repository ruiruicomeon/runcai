<template>
  <upload-custom
    ref="uploadFile"
    v-bind="$attrs"
    v-on="$listeners"
    :multiple="true"
    :limit="limit"
    :accept="accept"
    :file-list="fileList"
    :headers="headers"
    :action="action"
    :data="dataParams"
    :before-upload="beforeUpload"
    :on-success="imgUploadSuccess"
    :on-remove="removeImg"
    :on-exceed="handleExceed"
    :sourceKey="sourceKey"
    :sourceType="sourceType"
  >
    <el-button type="text" class="tl-btn up-btn"
      ><i class="icon-upload"></i><em>添加附件</em></el-button
    >
    <span class="el-upload__tip">{{ tips }}</span>
  </upload-custom>
</template>

<script>

import BMF from 'browser-md5-file';
import md5 from 'blueimp-md5';
import Server from './server';
import uploadCustom from './upload/index';

const bmf = new BMF();
const server = new Server();
export default {
  name: 'fileUpload',
  props: {
    params: {
      type: Object,
      default: () => ({}),
    },
    fileList: {
      type: Array,
      default: () => [],
    },
    attachmentList: {
      type: String,
      default: '',
    },
    // 单位M
    maxFileSzie: {
      type: Number,
      default: 10,
    },
    accept: {
      type: String,
      default: 'image/jpeg, image/png, image/bmp, image/gif, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/pdf, .pptx, .xlsx',
    },
    tips: {
      type: String,
      default: '最多上传10个文件，单个文件不超过10M',
    },
    limit: {
      type: Number,
      default: 10,
    },
    actionName: {
      type: String,
      default: '',
    },
    actionIndex: {
      type: Object,
      default() {
        return {};
      },
    },
    // fileFormatFn: {
    //   type: Function,
    //   default: (file) => {
    //     const isJPG = file.type === 'image/jpeg';
    //     const isPNG = file.type === 'image/png';
    //     const isBMP = file.type === 'image/bmp';
    //     const isGIF = file.type === 'image/gif';
    //     const isDOC = file.type === 'application/msword';
    //     const isDOCX = file.type
    //     === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    //     const isPDF = file.type === 'application/pdf';
    //     console.log('文件类型fileFormatFn', file.type);
    //     console.log('文件类型fileFormatFn', (!isJPG && !isPNG && !isBMP && !isGIF && !isDOC && !isPDF && !isDOCX));
    //     this.$message.error(
    //       '上传附件只能是 JPG、PNG、BMP、GIF、DOC、DOCX、PDF格式',
    //     );
    //     if (!isJPG && !isPNG && !isBMP && !isGIF && !isDOC && !isPDF && !isDOCX) {
    //       this.$message.error(
    //         '上传附件只能是 JPG、PNG、BMP、GIF、DOC、DOCX、PDF格式',
    //       );
    //     }
    //     return (isJPG || isPNG || isBMP || isGIF || isDOC || isDOCX || isPDF);
    //   },
    // },
    userId: {
      type: String,
      default: '',
    },
    sourceKey: {
      type: String,
      default: '',
    },
    sourceType: {
      type: String,
      default: 'TASK',
    },
  },
  components: {
    'upload-custom': uploadCustom,
  },
  data() {
    return {
      server,
      dataParams: { },
      fileNum: 0,
      fileUploadList: [],
      validateCode: '',
    };
  },
  created() {
    if (this.sourceType == 'OKRMODIFY' || this.sourceType == 'OKR_REVIEW' || this.sourceType == 'SCORE_REVIEW') {
      this.dataParams = {
        sourceType: this.sourceType, ...this.params, sourceKey: this.sourceKey,
      };
      // this.sourceKey = this.okrId;
    } else {
      this.dataParams = {
        sourceType: this.sourceType, ...this.params,
      };
    }
    if (this.fileList.length == 0 && this.attachmentList) { this.fileList = JSON.parse(this.attachmentList); }
  },
  computed: {
    action() {
      const origin = window.location.origin
        ? window.location.origin
        : window.location.href.split('/#')[0];
      return `${origin}/gateway/system-service/sys/attachment/upload?validateCode=${this.validateCode}`;
    },
    headers() {
      return { token: localStorage.token };
    },
  },
  methods: {
    doMd5(file) {
      const self = this;
      return new Promise((resolve, reject) => {
        let fileMd5 = '';
        let fileNameMd5 = '';
        return bmf.md5(
          file,
          (err, md5Code) => {
            if (err) {
              reject();
            } else {
              fileMd5 = md5Code;
              fileNameMd5 = md5(file.name);
              self.validateCode = md5(fileMd5.substr(0, 6) + fileNameMd5.substr(0, 6));
              console.log(self.validateCode);
              resolve();
            }
          },
        );
      });
    },
    beforeUpload(file) {
      const biggerThanMaxFileSize = file.size / 1024 / 1024 < this.maxFileSzie;
      const isNameLength = file.name && file.name.length < 100;
      console.log('文件大小', file.size);
      if (file.size == 0) {
        this.$message.error(
          '上传附件大小不能为0KB',
        );
        return false;
      }
      console.log('文件大小', !biggerThanMaxFileSize);
      if (!biggerThanMaxFileSize) {
        this.$message.error(
          `上传附件大小不能超过 ${this.maxFileSzie}MB`,
        );
        return false;
      }
      // const fileFormatResult = this.fileFormatFn(file);

      // if (!this.fileFormatFn(file)) {
      //   return false;
      // }
      // console.log('文件类型beforeUpload', fileFormatResult);
      if (!isNameLength) {
        this.$message.error('上传附件文件名长度最多为99个字符');
        return false;
      }
      const isSize = new Promise((resolve, reject) => {
        const fileFormatResult = this.fileFormatFn(file);
        if (!fileFormatResult) {
          reject();
        } else {
          resolve();
        }
      }).then(
        () => true,
      );
      const md5Valid = this.doMd5(file);
      return Promise.all([isSize, md5Valid]);
    },
    triggerChangeByFileList(fileList) {
      const list = fileList.map((file) => {
        let result = null;
        if (file.response && file.response.code == 200) {
          const {
            url, resourceId, resourceName, itsmResourceId, uploadDate, resourceUrl,
          } = file.response.data;
          result = {
            name: resourceName, url, resourceId, resourceName, itsmResourceId, uploadDate, resourceUrl,
          };
        } else {
          const data = this.fileList.filter((item) => item.uid == file.uid)[0];
          if (data) {
            const {
              url, resourceId, resourceName, itsmResourceId, uploadDate, resourceUrl,
            } = data;
            result = {
              name: resourceName, url, resourceId, resourceName, itsmResourceId, uploadDate, resourceUrl,
            };
          }
        }
        return result;
      });
      this.fileNum = list.length;
      // this.$emit('update:fileList', list);
      this.$emit('change', { list, action: this.actionIndex });
    },
    imgUploadSuccess(response, file, fileList) {
      console.log(file);
      if (response.code == 200) {
        this.triggerChangeByFileList(fileList);
      } else {
        this.$message.error('文件上传失败');
        this.$refs.uploadFile.clearFiles(file.uid);
      }
    },
    removeImg(file, fileList) {
      // if (file.resourceId) {
      //   this.server
      //     .deleteFile({ resourceId: file.resourceId })
      //     .then((response) => {
      //       if (response.data.code != 200) {
      //         fileList.push(file);
      //         this.triggerChangeByFileList(fileList);
      //       }
      //     });
      // }
      this.triggerChangeByFileList(fileList);
    },
    handleExceed() {
      this.$message.error('最多上传10个文件！');
    },
    clearFiles() {
      this.$refs.uploadFile.clearFiles();
    },
    fileFormatFn(file) {
      console.log('文件类型fileFormatFn', file.type);
      if (this.sourceType == 'OKRMODIFY') {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isxlsx = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        const isPPTX = file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        const isDOC = file.type === 'application/msword';
        const isDOCX = file.type
        === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        if (!isJPG && !isPNG && !isDOC && !isDOCX && !isPPTX && !isxlsx) {
          this.$message.error(
            '您上传的附件格式不支持',
          );
        }
        return (isJPG || isPNG || isDOC || isDOCX || isPPTX || isxlsx);
      }
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isBMP = file.type === 'image/bmp';
      const isGIF = file.type === 'image/gif';
      const isDOC = file.type === 'application/msword';
      const isDOCX = file.type
        === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      const isPDF = file.type === 'application/pdf';
      const isPPTX = file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      const isxlsx = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      if (!isJPG && !isPNG && !isBMP && !isGIF && !isDOC && !isPDF && !isDOCX && !isPPTX && !isxlsx) {
        this.$message.error(
          '您上传的附件格式不支持',
        );
      }
      return (isJPG || isPNG || isBMP || isGIF || isDOC || isDOCX || isPDF || isPPTX || isxlsx);
    },
  },
};
</script>
