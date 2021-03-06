/* eslint-disable indent */
export default [{
  path: '/',
  name: 'consoleIndex',
  redirect: {
    name: 'overview',
  },
  component: () => import('@/views/consoleIndex'),
  children: [{
    // 综合首页
    path: '/overview',
    name: 'overview',
    meta: {
      hasMainMenu: true,
      noSubMenu: true,
      parentRoute: 'overview',
      title: 'overview',
      power: 'workbench',
    },
    component: () => import('@/views/overview/index'),
    children: [{
      path: '/teamleader',
      name: 'teamleader',
      meta: {
        hasMainMenu: true,
        noSubMenu: true,
        parentRoute: 'overview',
        title: 'teamleader',
        power: 'workbench',
      },
      component: () => import('@/views/overview/teamleader/index'),
    },
    {
      path: '/departleader',
      name: 'departleader',
      meta: {
        hasMainMenu: true,
        noSubMenu: true,
        parentRoute: 'overview',
        title: 'departleader',
        power: 'workbench',
      },
      component: () => import('@/views/overview/departleader/index'),
    },
    {
      path: '/grassStaff',
      name: 'grassStaff',
      meta: {
        hasMainMenu: true,
        noSubMenu: true,
        parentRoute: 'overview',
        title: 'grassStaff',
        power: 'workbench',
      },
      component: () => import('@/views/overview/grassStaff/index'),
    },
    ],
  },
  {
    // OKR管理
    // 我的OKR
    path: '/okr',
    name: 'okr',
    redirect: {
      name: 'myOkr',
    },
    meta: {
      title: 'okr',
      power: 'okr-menu',
    },
    component: () => import('@/views/okrManage/myOkr/index'),
    children: [{
      path: '/myOkr',
      name: 'myOkr',
      meta: {
        hasMainMenu: true,
        isSubMenu: true,
        parentRoute: 'myOkr',
        title: 'myOkr',
        power: 'my-okr-menu',
      },
      component: () => import('@/views/okrManage/myOkr/myOkr'),
    },
    {
      path: '/departmentOkr',
      name: 'departmentOkr',
      meta: {
        hasMainMenu: true,
        isSubMenu: true,
        parentRoute: 'myOkr',
        belongsTo: 'myOkr',
        title: 'departmentOkr',
        power: 'my-okr-menu',
      },
      component: () => import('@/views/okrManage/myOkr/departmentOkr'),
    },
    {
      path: '/okrTable',
      name: 'okrTable',
      meta: {
        hasMainMenu: true,
        isSubMenu: true,
        parentRoute: 'myOkr',
        belongsTo: 'myOkr',
        title: 'okrTable',
        power: 'my-okr-menu',
      },
      component: () => import('@/views/okrManage/myOkr/okrTable'),
    },
    ],
  },
  {
    // OKR管理
    // OKR审批
    path: '/okrApproval',
    name: 'okrApproval',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'myOkr',
      title: 'okrApproval',
      power: 'approval-menu',
    },
    component: () => import('@/views/okrManage/okrApproval/index'),
  },
  {
    // OKR管理
    // 我关注的OKR
    path: '/concernedOkr',
    name: 'concernedOkr',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'myOkr',
      title: 'concernedOkr',
      power: 'concerned-menu',
    },
    component: () => import('@/views/okrManage/concernedOkr/index'),
  },
  {
    // OKR管理
    // 承接树
    path: '/undertakeMaps',
    name: 'undertakeMaps',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'myOkr',
      title: 'undertakeMaps',
      power: 'undertake-menu',
    },
    component: () => import('@/views/okrManage/undertakeMaps/index'),
  },
  {
    // OKR管理
    // OKR地图
    path: '/okrMaps',
    name: 'okrMaps',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'myOkr',
      title: 'okrMaps',
      power: 'maps-menu',
    },
    component: () => import('@/views/okrManage/okrMaps/index'),
  },
  {
    // OKR管理
    // OKR汇总
    path: '/okrSummarize',
    name: 'okrSummarize',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'myOkr',
      title: 'okrSummarize',
      power: 'all-okr',
    },
    component: () => import('@/views/okrManage/okrSummarize/index'),
  },
  {
    // 考核管理
    // 我的考核
    path: '/myAssess',
    name: 'myAssess',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'myAssess',
      title: 'myAssess',
      power: '',
    },
    component: () => import('@/views/assessManage/myAssess/index'),
  },
  {
    // 考核管理
    // 考核PK
    path: '/assessPk',
    name: 'assessPk',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'myAssess',
      title: 'assessPk',
      power: '',
    },
    component: () => import('@/views/assessManage/assessPk/index'),
  },
  {
    // 复盘
    path: '/replay',
    name: 'replay',
    redirect: {
      title: 'replay',
      name: 'replayList',
    },
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'myOkr',
      title: 'replay',
      power: 'replay-menu',
    },

    component: () => import('@/views/replay/index'),
    children: [
      {
        path: '/replayEdit',
        name: 'replayEdit',
        meta: {
          hasMainMenu: false,
          isSubMenu: false,
          parentRoute: 'myOkr',
          title: 'replay',
          power: 'replay-menu',
        },
        component: () => import('@/views/replay/replayEdit/index'),
      },

      {
        path: '/replayDetail',
        name: 'replayDetail',
        meta: {
          hasMainMenu: false,
          isSubMenu: false,
          parentRoute: 'myOkr',
          title: 'replay',
          power: 'replay-menu',
        },
        component: () => import('@/views/replay/replayDetail/index'),
      },
      {
        path: '/replayLink',
        name: 'replayLink',
        meta: {
          hasMainMenu: false,
          isSubMenu: false,
          parentRoute: 'myOkr',
          title: 'replay',
          power: 'replay-menu',
        },
        component: () => import('@/views/replay/replayLink/index'),
      },
      {
        path: '/replayList',
        name: 'replayList',
        meta: {
          hasMainMenu: true,
          isSubMenu: true,
          parentRoute: 'myOkr',
          title: 'replay',
          power: 'replay-menu',
        },
        component: () => import('@/views/replay/component/replayList'),
      },
      // okr复核得分
      {
        path: '/replayScore',
        name: 'replayScore',
        meta: {
          hasMainMenu: true,
          isSubMenu: true,
          parentRoute: 'myOkr',
          title: 'replayScore',
          belongsTo: 'replayList',
          power: 'replay-menu',
        },
        component: () => import('@/views/replay/replayScore/replayScoreList'),
      },
      // okr复核得分详情
      {
        path: '/replayScoreDetail',
        name: 'replayScoreDetail',
        meta: {
          hasMainMenu: false,
          isSubMenu: false,
          parentRoute: 'myOkr',
          title: 'replayScoreDetail',
          belongsTo: 'replayList',
          power: 'replay-menu',
        },
        component: () => import('@/views/replay/replayScore/replayScoreDetail'),
      },
      // 绩效排名
      {
        path: '/assessRank',
        name: 'assessRank',
        meta: {
          hasMainMenu: true,
          isSubMenu: true,
          parentRoute: 'myOkr',
          title: 'assessRank',
          belongsTo: 'replayList',
          power: 'replay-menu',
        },
        component: () => import('@/views/replay/assessRank/assessRankList'),
      },
      // 绩效复核
      {
        path: '/replayAssess',
        name: 'replayAssess',
        meta: {
          hasMainMenu: true,
          isSubMenu: true,
          parentRoute: 'myOkr',
          title: 'replayAssess',
          belongsTo: 'replayList',
          power: 'replay-menu',
        },
        component: () => import('@/views/replay/replayAssess/replayAssessList'),
      },
      // 复盘审批
      {
        path: '/replayApproval',
        name: 'replayApproval',
        meta: {
          hasMainMenu: false,
          isSubMenu: false,
          parentRoute: 'myOkr',
          title: 'replayApproval',
          belongsTo: 'replayList',
          power: 'replay-menu',
        },
        component: () => import('@/views/replay/replayApproval/index'),
      },
    ],
  },
  // 项目
  {
    path: '/projectManage',
    name: 'projectManage',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'projectManage',
      title: 'projectManage',
      power: 'project-menu',
    },
    component: () => import('@/views/projectManage/index'),
  },
  {
    path: '/hoursCollection',
    name: 'hoursCollection',
    meta: {
      hasMainMenu: true,
      noSubMenu: true,
      parentRoute: 'projectManage',
      belongsTo: 'projectManage',
      title: 'hoursCollection',
      power: '',
    },
    component: () => import('@/views/projectManage/hoursCollection/index'),
  },
  {
    path: '/queryHistory',
    name: 'queryHistory',
    meta: {
      hasMainMenu: true,
      noSubMenu: true,
      parentRoute: 'projectManage',
      belongsTo: 'projectManage',
      title: 'queryHistory',
      power: '',
    },
    component: () => import('@/views/projectManage/hoursCollection/components/queryHistory'),
  },
  {
    path: '/projectDetail',
    name: 'projectDetail',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'projectManage',
      belongsTo: 'projectManage',
      title: 'projectDetail',
      power: 'projectList',
    },
    component: () => import('@/views/projectManage/projectDetail/index'),
  },
  {
    path: '/approvalList',
    name: 'approvalList',
    meta: {
      hasMainMenu: true,
      noSubMenu: true,
      parentRoute: 'projectManage',
      title: 'approvalList',
      power: '',
    },
    component: () => import('@/views/projectManage/mainHours/components/approvalList'),
  },
  {
    path: '/HoursJoin',
    name: 'HoursJoin',
    meta: {
      hasMainMenu: true,
      noSubMenu: true,
      parentRoute: 'HoursJoin',
      title: 'HoursJoin',
      power: '',
    },
    component: () => import('@/views/projectManage/mainHours/components/HoursJoin'),
  },
  {
    path: '/mainHours',
    name: 'mainHours',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'projectManage',
      title: 'mainHours',
      power: 'mainHours',
    },
    component: () => import('@/views/projectManage/mainHours/index'),
  },
  {
    path: '/approvalList',
    name: 'approvalList',
    meta: {
      hasMainMenu: true,
      isSubMenu: false,
      parentRoute: 'projectManage',
      title: 'approvalList',
      power: '',
    },
    component: () => import('@/views/projectManage/mainHours/components/approvalList'),
  },
  {
    path: '/HoursJoin',
    name: 'HoursJoin',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'HoursJoin',
      title: 'HoursJoin',
      power: '',
    },
    component: () => import('@/views/projectManage/mainHours/components/HoursJoin'),

  },
  {
    // 周报管理
    // 我的周报
    path: '/myWeekly',
    name: 'myWeekly',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'myWeekly',
      title: 'myWeekly',
      power: '',
    },
    component: () => import('@/views/weeklyManage/myWeekly/index'),
  },
  {
    // 周报管理
    // 团队周报
    path: '/teamWeekly',
    name: 'teamWeekly',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'myWeekly',
      title: 'teamWeekly',
      power: '',
    },
    component: () => import('@/views/weeklyManage/teamWeekly/index'),
  },
  {

    // 团队周报详情
    path: '/teamWeeklyInfo',
    name: 'teamWeeklyInfo',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'myWeekly',
      belongsTo: 'teamWeekly',
      title: 'teamWeeklyInfo',
      power: '',
    },
    component: () => import('@/views/weeklyManage/teamWeekly/components/teamWeeklyInfo'),
  },
  {
    // 使用手册
    path: '/serviceManual',
    name: 'serviceManual',
    meta: {
      hasMainMenu: true,
      noSubMenu: true,
      parentRoute: 'serviceManual',
      title: 'serviceManual',
      power: '',
    },
    component: () => import('@/views/serviceManual/index'),
  },
  {
    // 团队管理
    path: '/teamsManage',
    name: 'teamsManage',
    meta: {
      hasMainMenu: true,
      noSubMenu: true,
      parentRoute: 'teamsManage',
      title: 'teamsManage',
      power: '',
    },
    component: () => import('@/views/teamsManage/index'),
  },
  {
    // 价值观管理
    path: '/valuesManage',
    name: 'valuesManage',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'projectManage',
    },
    component: () => import('@/views/projectManage/index'),
  },
  // {
  //   // 项目管理
  //   path: '/projectManage',
  //   name: 'projectManage',
  //   meta: {
  //     hasMainMenu: true,
  //     noSubMenu: true,
  //     parentRoute: 'projectManage',
  //   },
  //   component: () => import('@/views/projectManage/index'),
  // },
  {
    // 个人中心
    path: '/personalCenter',
    name: 'personalCenter',
    meta: {
      hasMainMenu: true,
      noSubMenu: true,
      parentRoute: 'personalCenter',
      title: 'personalCenter',
      power: '',
    },
    component: () => import('@/views/personalCenter/index'),
  },
  {
    // 任务管理
    // 我的任务
    path: '/myTask',
    name: 'myTask',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      longMenu: true,
      parentRoute: 'myTask',
      title: 'myTask',
      power: '',
    },
    component: () => import('@/views/taskManage/myTask/index'),
  },
  {
    // 任务管理
    // 我的任务
    path: '/createTask',
    name: 'createTask',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'myTask',
      title: 'createTask',
      power: '',
    },
    component: () => import('@/views/taskManage/myTask/components/createTask'),
  },
  // 消息通知
  {
    path: '/notice',
    name: 'notice',
    meta: {
      hasMainMenu: true,
      noSubMenu: true,
      parentRoute: 'notice',
      title: 'notice',
      power: '',
    },
    component: () => import('@/views/notice/index'),
  },
  // 个人设置
  {
    path: '/personConfig',
    name: 'personConfig',
    meta: {
      hasMainMenu: true,
      noSubMenu: true,
      parentRoute: 'personConfig',
      title: 'personConfig',
      power: '',
    },
    component: () => import('@/views/personConfig/index'),
  },
  {
    // 任务管理
    // 任务流程
    path: '/taskProcess',
    name: 'taskProcess',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      isLevelThree: true,
      longMenu: true,
      parentRoute: 'myTask',
      title: 'taskProcess',
      power: '',
    },
    component: () => import('@/views/taskManage/taskProcess/index'),
  },
  {
    path: '/note',
    name: 'note',
    meta: {
      hasMainMenu: true,
      noSubMenu: true,
      parentRoute: 'note',
      title: 'note',
      power: 'note',
    },
    component: () => import('@/views/note/index'),
  },
  {
    // 任务管理
    // 过程管理
    path: '/processManage',
    name: 'processManage',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      longMenu: true,
      parentRoute: 'myTask',
      title: 'processManage',
      power: '',
    },
    component: () => import('@/views/taskManage/processManage/index'),
  },
  {
    // 任务管理
    // 归档任务
    path: '/filedTaskList',
    name: 'filedTaskList',
    meta: {
      hasMainMenu: true,
      isSubMenu: true,
      parentRoute: 'myTask',
      title: '归档任务',
      power: '',
    },
    component: () => import('@/views/taskManage/taskProcess/components/filedTaskList'),

  },

  ],
}];
