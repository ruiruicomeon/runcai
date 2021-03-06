import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  // 查询组织
  getOrg(param) {
    return this._ajaxPost('gateway/system-service/sys/organization/getOrg', param);
  }

  // 查询组织包含的用户列表
  getUserListByOrgId(param) {
    return this._ajaxPost('gateway/system-service/sys/user/listUserPage', param);
  }

  // 创建用户
  createUser(param) {
    return this._ajaxPost('gateway/system-service/sys/user/insertOrgUser', param);
  }

  // 获取用户信息用户
  getUserInfo(param) {
    return this._ajaxPost('gateway/system-service/sys/user/getUser', param);
  }

  // 编辑用户
  updateOrgUser(param) {
    return this._ajaxPost('gateway/system-service/sys/user/updateOrgUser', param);
  }

  // 校验是否已被使用
  judgeUser(param) {
    return this._ajaxPost('gateway/system-service/sys/user/judgeUser', param);
  }

  // 创建部门
  createOrg(param) {
    return this._ajaxPost('gateway/system-service/sys/organization/insertOrg', param);
  }

  // 编辑部门
  updateOrg(param) {
    return this._ajaxPost('gateway/system-service/sys/organization/updateOrg', param);
  }

  // 查询所有租户
  getAllTenant(param) {
    return this._ajaxPost('gateway/system-service/sys/tenant/listTenant', param);
  }

  // 删除部门
  deleteDepart(param) {
    return this._ajaxPost('gateway/system-service/sys/userRole/delUserRole', param);
  }

  // 设置部门负责人
  setDepartLeader(param) {
    return this._ajaxPost('gateway/system-service/sys/userRole/setUserRole', param);
  }

  // 取消部门负责人
  removeDepartLeder(param) {
    return this._ajaxPost('gateway/system-service/sys/userRole/cancelUserRole', param);
  }

  queryOrgAndUser(param) {
    return this._ajaxPost('gateway/system-service/sys/organization/queryOrgAndUser', param);
  }

  fuzzyQueryUser(param) {
    return this._ajaxPost('gateway/system-service/sys/user/fuzzyQueryUser', param);
  }

  // 设置用户状态
  updateOrgUserStatus(param) {
    return this._ajaxPost('gateway/system-service/sys/user/updateOrgUserStatus', param);
  }
}
