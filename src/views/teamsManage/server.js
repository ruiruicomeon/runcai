import ServerBase from '@/ajax/serverBase';

export default class Server extends ServerBase {
  queryTeamBaseInfo(param) {
    return this._ajaxPost('/gateway/system-service/sys/teamManagement/queryTeam', param);
  }

  queryOrgParent(param) {
    return this._ajaxPost('/gateway/system-service/sys/teamManagement/queryOrgParent', param);
  }

  listOrgUserPage(param) {
    return this._ajaxPost('/gateway/system-service/sys/teamManagement/listOrgUserPage', param);
  }

  updateReportRelation(param) {
    return this._ajaxPost('/gateway/system-service/sys/reportRelation/updateReportRelation', param);
  }

  listUserAllOrg(param) {
    return this._ajaxPost('/gateway/system-service/sys/teamManagement/listUserAllOrg', param);
  }

  addReportRelation(param) {
    return this._ajaxPost('/gateway/system-service/sys/reportRelation/addReportRelation', param);
  }

  addReportRelationList(param) {
    return this._ajaxPost('/gateway/system-service/sys/reportRelation/addReportRelationList', param);
  }

  updateVirtualOrg(param) {
    return this._ajaxPost('/gateway/system-service/sys/organization/updateVirtualOrg', param);
  }

  getVirtualOrgUser(param) {
    return this._ajaxPost('/gateway/system-service/sys/teamManagement/getVirtualOrgUser', param);
  }

  setTeamAdminRole(param) {
    return this._ajaxPost('/gateway/system-service/sys/userRole/setTeamAdminRole', param);
  }

  delVirtualOrg(param) {
    return this._ajaxPost('/gateway/system-service/sys/organization/delVirtualOrg', param);
  }

  addVirtualOrg(param) {
    return this._ajaxPost('/gateway/system-service/sys/organization/addVirtualOrg', param);
  }

  updateOrgConfig(param) {
    return this._ajaxPost('/gateway/system-service/sys/config/updateOrgConfig', param);
  }

  getOrg(param) {
    return this._ajaxPost('/gateway/system-service/sys/organization/getOrg', param);
  }

  fuzzyQueryUser(param) {
    return this._ajaxPost('/gateway/system-service/sys/user/fuzzyQueryUser', param);
  }

  selectOrgAdminByUserIdAndOrgId(param) {
    return this._ajaxPost('/gateway/system-service/sys/userRole/selectOrgAdminByUserIdAndOrgId ', param);
  }

  // 综合岗是否可以审批OKR
  addOrUpdate(param) {
    return this._ajaxPost('gateway/system-service/sys/config/addOrUpdate', param);
  }

  configQuery(param) {
    return this._ajaxPost('gateway/system-service/sys/config/okr', param);
  }
}