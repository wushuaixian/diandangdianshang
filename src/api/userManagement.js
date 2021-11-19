import request from '@/utils/request'

export function getRoleList(params) {
  return request({
    url: '/ouser-web/role/queryAllRoleDataPage.do',
    method: 'POST',
    data: params
  })
}

export function queryPosition(params) {
  return request({
    url: '/ouser-web/position/queryPosition.do',
    method: 'POST',
    data: params
  })
}

export function getDepartmentList(params) {
  return request({
    url: '/ouser-web/department/list.do',
    method: 'POST',
    data: params
  })
}

export function queryEmployeeByPage(params) {
  return request({
    url: '/ouser-web/employee/queryEmployeeByPage',
    method: 'POST',
    data: params
  })
}

export function addEmployee(params) {
  return request({
    // url: '/ouser-web/employee/addEmployee.do',
    url: '/ouser-web/employee/revAddEmployee',
    method: 'POST',
    data: params
  })
}
export function queryUserManagementInfo(params) {
  return request({
    url: '/back-manage-web/userManagement/queryUserManagementInfo',
    method: 'POST',
    data: params
  })
}

export function deleteUsers(params) {
  return request({
    url: '/back-manage-web/userManagement/deleteUsers',
    method: 'POST',
    data: params
  })
}

export function updateUserStatus(params) {
  return request({
    url: '/back-manage-web/userManagement/updateUserStatus',
    method: 'POST',
    data: params
  })
}

export function detailOne() {
  return request({
    url: '/back-manage-web/merchantOrgInfo/detailOne',
    method: 'GET'
  })
}
export function queryEmployeeById(data) {
  return request({
    url: '/ouser-web/employee/queryEmployeeById',
    method: 'POST',
    data
  })
}

export function getBiddingPurchase() {
  return request({
    url: '/ouser-web/employee/getBiddingPurchase.do',
    method: 'GET'
  })
}
