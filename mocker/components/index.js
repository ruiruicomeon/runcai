const Mock = require('mockjs');
const mockUtil = require('../mockUtil');

const mockData = {
  'POST /gateway/okr/departmentList': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      'ARRAY|2': [
        {
          label: '润联科技',
          id: '@id()',
          children: [{
            label: '华润云',
            id: '@id()',
            children: [{
              label: '云门户',
              id: '@id()',
            }],
          }, {
            label: 'IT产品服务部',
            id: '@id()',
            children: [{
              label: '润工作',
              id: '@id()',
            }],
          }],
        },
      ],
    })));
  },
  'POST /gateway/privilege-service/privilege/function/queryByTenantIdAndUserId': (req, res) => {
    res.send(mockUtil.getSuccessData(Mock.mock({
      headUrl: '',
      orgId: '888822223333',
      prefix: '0755',
      privilegeList: [
        {
          children: null,
          createTime: '2020-08-06T19:42:53',
          createdBy: '1234567890000',
          functionCode: 'workbench',
          functionEvent: null,
          functionFullCode: null,
          functionId: 115,
          functionName: '主页',
          functionSequence: 1,
          functionType: 'MENU',
          parentId: null,
          permissionCode: 'overview1',
          resourceUrl: 'overview',
          status: 'S',
          tenantId: null,
          updateBy: '1234567890003',
          updateTime: '2020-08-19T11:28:59',
        },
        {
          children: [
            {
              children: null,
              createTime: '2020-08-06T19:42:53',
              createdBy: '1234567890000',
              functionCode: 'PSN_INFO',
              functionEvent: null,
              functionFullCode: null,
              functionId: 106,
              functionName: '个人信息',
              functionSequence: 1,
              functionType: 'PAGE',
              parentId: 103,
              permissionCode: null,
              resourceUrl: null,
              status: 'Y',
              tenantId: null,
              updateBy: '1234567890000',
              updateTime: '2020-08-06T19:40:48',
            },
            {
              children: null,
              createTime: '2020-08-06T19:42:53',
              createdBy: '1234567890000',
              functionCode: 'PSN_CONF',
              functionEvent: null,
              functionFullCode: null,
              functionId: 109,
              functionName: '个人设置',
              functionSequence: 2,
              functionType: 'PAGE',
              parentId: 103,
              permissionCode: null,
              resourceUrl: null,
              status: 'Y',
              tenantId: null,
              updateBy: '1234567890000',
              updateTime: '2020-08-06T19:40:48',
            },
          ],
          createTime: '2020-08-06T19:42:53',
          createdBy: '1234567890000',
          functionCode: 'PERSON',
          functionEvent: null,
          functionFullCode: null,
          functionId: 103,
          functionName: '个人中心',
          functionSequence: 2,
          functionType: 'MENU',
          parentId: null,
          permissionCode: null,
          resourceUrl: null,
          status: 'Y',
          tenantId: null,
          updateBy: '1234567890000',
          updateTime: '2020-08-06T19:40:48',
        },
        {
          children: [
            {
              children: null,
              createTime: '2020-08-06T19:42:53',
              createdBy: '1234567890000',
              functionCode: 'PJT_ME',
              functionEvent: null,
              functionFullCode: null,
              functionId: 154,
              functionName: '我的项目',
              functionSequence: 1,
              functionType: 'PAGE',
              parentId: 151,
              permissionCode: null,
              resourceUrl: null,
              status: 'Y',
              tenantId: null,
              updateBy: '1234567890000',
              updateTime: '2020-08-06T19:40:48',
            },
          ],
          createTime: null,
          createdBy: null,
          functionCode: 'PROJECT',
          functionEvent: null,
          functionFullCode: null,
          functionId: 151,
          functionName: '项目管理',
          functionSequence: 6,
          functionType: 'MENU',
          parentId: null,
          permissionCode: null,
          resourceUrl: null,
          status: 'Y',
          tenantId: null,
          updateBy: null,
          updateTime: null,
        },
        {
          children: [
            {
              children: null,
              createTime: '2020-08-06T19:42:53',
              createdBy: '1234567890000',
              functionCode: 'WEEKLY_ME',
              functionEvent: null,
              functionFullCode: null,
              functionId: 160,
              functionName: '我的周报',
              functionSequence: 1,
              functionType: 'PAGE',
              parentId: 157,
              permissionCode: null,
              resourceUrl: null,
              status: 'Y',
              tenantId: null,
              updateBy: '1234567890000',
              updateTime: '2020-08-06T19:40:48',
            },
            {
              children: null,
              createTime: null,
              createdBy: null,
              functionCode: 'WEEKLY_TEAM',
              functionEvent: null,
              functionFullCode: null,
              functionId: 163,
              functionName: '团队周报',
              functionSequence: 2,
              functionType: 'PAGE',
              parentId: 157,
              permissionCode: null,
              resourceUrl: null,
              status: 'Y',
              tenantId: null,
              updateBy: null,
              updateTime: null,
            },
          ],
          createTime: null,
          createdBy: null,
          functionCode: 'weekly-menu',
          functionEvent: null,
          functionFullCode: null,
          functionId: 157,
          functionName: '周报管理',
          functionSequence: 7,
          functionType: 'MENU',
          parentId: null,
          permissionCode: 'myWeekly',
          resourceUrl: 'myWeekly',
          status: 'S',
          tenantId: null,
          updateBy: '1234567890003',
          updateTime: '2020-08-19T15:19:46',
        },
        {
          children: [
            {
              children: null,
              createTime: null,
              createdBy: null,
              functionCode: 'TNT_DEPT',
              functionEvent: null,
              functionFullCode: null,
              functionId: 175,
              functionName: '部门管理',
              functionSequence: 1,
              functionType: 'PAGE',
              parentId: 166,
              permissionCode: null,
              resourceUrl: null,
              status: 'Y',
              tenantId: null,
              updateBy: null,
              updateTime: null,
            },
            {
              children: null,
              createTime: null,
              createdBy: null,
              functionCode: 'TNT_ROLE',
              functionEvent: null,
              functionFullCode: null,
              functionId: 178,
              functionName: '角色管理',
              functionSequence: 2,
              functionType: 'PAGE',
              parentId: 166,
              permissionCode: null,
              resourceUrl: null,
              status: 'Y',
              tenantId: null,
              updateBy: null,
              updateTime: null,
            },
            {
              children: [
                {
                  children: null,
                  createTime: '2020-08-06T19:42:53',
                  createdBy: '1234567890000',
                  functionCode: 'OKR_SET',
                  functionEvent: null,
                  functionFullCode: null,
                  functionId: 88,
                  functionName: '设置OKR',
                  functionSequence: 1,
                  functionType: 'PAGE',
                  parentId: 181,
                  permissionCode: null,
                  resourceUrl: null,
                  status: 'Y',
                  tenantId: null,
                  updateBy: '1234567890000',
                  updateTime: '2020-08-06T19:40:48',
                },
              ],
              createTime: null,
              createdBy: null,
              functionCode: 'TNT_CONF',
              functionEvent: null,
              functionFullCode: null,
              functionId: 181,
              functionName: '设置管理',
              functionSequence: 3,
              functionType: 'MENU',
              parentId: 166,
              permissionCode: null,
              resourceUrl: null,
              status: 'Y',
              tenantId: null,
              updateBy: null,
              updateTime: null,
            },
          ],
          createTime: null,
          createdBy: null,
          functionCode: 'tenant-menu',
          functionEvent: null,
          functionFullCode: null,
          functionId: 166,
          functionName: '租户管理',
          functionSequence: 8,
          functionType: 'MENU',
          parentId: null,
          permissionCode: 'tenantManage',
          resourceUrl: 'tenantManage',
          status: 'S',
          tenantId: null,
          updateBy: '1234567890003',
          updateTime: '2020-08-19T15:20:50',
        },
      ],
      tenantInfo: {
        applyUser: '牛大哥',
        createTime: '2020-08-11T22:37:18',
        createdBy: null,
        endTime: '2020-08-19T16:00:00',
        mobilePhone: '15396396281',
        startTime: '2020-08-17T16:00:00',
        status: 'O',
        tenantBuId: 'CR0012000206',
        tenantId: 'CR0012000206',
        tenantName: '租户大神',
        updateBy: null,
        updateTime: '2020-08-13T21:34:28',
      },
      tenantId: 'CR0012000206',
      userAccount: '',
      userId: null,
      userMail: 'lutao49@crc.com.hk',
      userMobile: '13145850003',
      userName: '测试-HM-3',
      userStatus: 0,
      userType: 0,
    })));
  },
};
module.exports = mockData;