import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  // 查询所有任务过程
  queryTaskProcessList(param) {
    return this._ajaxPost('gateway/task-service/task/taskProcess/query', param);
  }

  // 新增自定义任务过程
  addProcess(param) {
    return this._ajaxPost('gateway/task-service/task/taskProcess/addProcess', param);
  }

  // 编辑任务过程
  updateProcess(param) {
    return this._ajaxPost('gateway/task-service/task/taskProcess/update', param);
  }

  // 查询组织包含的用户列表
  getUserListByOrgId(param) {
    return this._ajaxPost('gateway/system-service/sys/user/listUserPage', param);
  }

  // // 查询任务过程适用人群
  queryProcessInfo(param) {
    return this._ajaxPost(`gateway/task-service/task/taskProcess/get?processId=${param}`, param);
  }

  // ********************************************************************************************
  // 查询数据字典列表
  queryOfPage(param) {
    return this._ajaxPost('gateway/system-service/sys/dictionary/queryOfPage', param);
  }

  // 新增、编辑数据字典
  addOrUpdate(param) {
    return this._ajaxPost('gateway/system-service/sys/dictionary/addOrUpdate', param);
  }

  // 查询数据字详情典
  queryDicDetail(param) {
    return this._ajaxPost('gateway/system-service/sys/dictionary/value/queryOfPage', param);
  }

  // 删除数据字典
  deleteDic(param) {
    return this._ajaxPost('gateway/system-service/sys/dictionary/deleteById', param);
  }

  // 删除数据字典项
  deleteDicItem(param) {
    return this._ajaxPost('gateway/system-service/sys/dictionary/value/deleteById', param);
  }

  // 更新启用禁用
  updateEnable(param) {
    return this._ajaxPost(`gateway/task-service/task/taskProcess/enable?enable=${param.enable}&processId=${param.processId}`);
  }

  // 查询组织包含的实体和虚线汇报成员
  listOrgUserPage(param) {
    return this._ajaxPost('/gateway/system-service/sys/teamManagement/listOrgUserPage', param);
  }
}
