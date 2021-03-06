import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  projectPageList(param) {
    return this._ajaxPost('gateway/project-service/project/query/projectPageList', param);
  }

  getProject(param) {
    return this._ajaxPost('gateway/project-service/project/query/getProject', param);
  }

  createProject(param) {
    return this._ajaxPost('gateway/project-service/project/create/project', param);
  }

  getOrgTable(param) {
    return this._ajaxPost('gateway/talent-query/okr/query/orgTable', param);
  }

  getUserList(param) {
    return this._ajaxPost('gateway/system-service/sys/user/listTenantUser', param);
  }

  projectUserList(param) {
    return this._ajaxPost('gateway/system-service/sys/user/projectUserList', param);
  }

  projectDetail(param) {
    return this._ajaxPost('gateway/project-service/project/query/projectDetail', param);
  }

  addProjectUser(param) {
    return this._ajaxPost('gateway/project-service/project/add/projectUser', param);
  }

  removeProjectUser(param) {
    return this._ajaxPost('gateway/project-service/project/remove/projectUser', param);
  }

  summaryList(param) {
    return this._ajaxPost('gateway/project-service/project/query/summaryList', param);
  }

  timeSheetList(param) {
    return this._ajaxPost('gateway/project-service/project/query/timeSheetList', param);
  }

  approvalTimeSheetList(param) {
    return this._ajaxPost('gateway/project-service/project/query/approvalTimeSheetList', param);
  }

  timeSheet(param) {
    return this._ajaxPost('gateway/project-service/project/submit/timeSheet', param);
  }

  approvaledTimeSheetList(param) {
    return this._ajaxPost('gateway/project-service/project/approval/timeSheetList', param);
  }

  setProjectManager(param) {
    return this._ajaxPost('gateway/project-service/project/update/setProjectManager', param);
  }

  projectUserRelation(param) {
    return this._ajaxPost('gateway/project-service/project/query/queryProjectUserRelation', param);
  }

  closeProject(param) {
    return this._ajaxPost('gateway/project-service/project/close/project', param);
  }

  queryByCodes(param) {
    return this._ajaxPost('gateway/system-service/sys/dictionary/queryByCodes', param);
  }

  selectWeeklyTimeSumByUserId(param) {
    return this._ajaxPost('gateway/project-service/project/query/selectWeeklyTimeSumByUserId', param);
  }

  timeSheetListapproval(param) {
    return this._ajaxPost('gateway/project-service/project/approval/timeSheetList', param);
  }

  calendarqurey(param) {
    return this._ajaxPost('gateway/weekly-service/calendar/qurey', param);
  }

  updateTimeWeek(param) {
    return this._ajaxPost('gateway/project-service/project/update/updateTimeWeek', param);
  }

  projectUserTimeList(param) {
    return this._ajaxPost('gateway/project-service/project/query/projectUserTimeList', param);
  }

  // 查询日历
  getCalendar(param) {
    return this._ajaxPost('gateway/weekly-service/calendar/qurey', param);
  }

  //  查询列表
  queryProjectUserList(param) {
    return this._ajaxPost('gateway/project-service/project/query/queryProjectUserList', param);
  }

  //  计算总金额
  queryCalculatingMoney(param) {
    return this._ajaxPost('gateway/project-service/project/query/queryCalculatingMoney', param);
  }

  //  计算总金额提交
  addSupplementTime(param) {
    return this._ajaxPost('gateway/project-service/project/add/addSupplementTime', param);
  }

  querySupplementHistory(param) {
    return this._ajaxPost('gateway/project-service/project/query/querySupplementHistory', param);
  }

  projectUserDetailWork(param) {
    return this._ajaxPost('gateway/project-service/project/allocate/projectUserDetailWork', param);
  }

  projectDetailJoin(param) {
    return this._ajaxPost('gateway/project-service/project/allocate/projectDetail', param);
  }

  allocate(param) {
    return this._ajaxPost('gateway/project-service/project/allocate/projectList', param);
  }

  userCostSummary(param) {
    return this._ajaxPost('gateway/project-service/project/allocate/userCostSummary', param);
  }

  submitAllocateUserWork(param) {
    return this._ajaxPost('gateway/project-service/project/allocate/submitAllocateUserWork', param);
  }

  userWorkHistory(param) {
    return this._ajaxPost('gateway/project-service/project/allocate/userWorkHistory', param);
  }

  queryProjectCostUsed(param) {
    return this._ajaxPost('gateway/project-service/project/query/queryProjectCostUsed', param);
  }

  // 查询组织
  getOrg(param) {
    return this._ajaxPost('gateway/system-service/sys/organization/getOrg', param);
  }

  // 新增小组成员
  addUserProjectTeam(param) {
    return this._ajaxPost('gateway/project-service/project/add/addUserProjectTeam', param);
  }

  // 新增小组
  saveOrUpdateProjectTeam(param) {
    return this._ajaxPost('gateway/project-service/project/add/saveOrUpdateProjectTeam', param);
  }

  // 小组列表
  queryProjectTeam(param) {
    return this._ajaxPost('gateway/project-service/project/query/queryProjectTeam', param);
  }

  queryTeamUser(param) {
    return this._ajaxPost('gateway/project-service/project/query/queryTeamUser', param);
  }

  // 移除小组
  delUserProjectTeam(param) {
    return this._ajaxPost('gateway/project-service/project/delete/delUserProjectTeam', param);
  }

  // 移除小组
  delProjectTeam(param) {
    return this._ajaxPost('gateway/project-service/project/delete/delProjectTeam', param);
  }

  // 设置代理项目经理
  setProjectAgentManager(param) {
    return this._ajaxPost('gateway/project-service/project/update/setProjectAgentManager', param);
  }

  // 设置代理项目经理
  queryProjectCost(param) {
    return this._ajaxPost('gateway/project-service/project/query/queryProjectCost', param);
  }
}