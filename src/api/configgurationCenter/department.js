import request from '@/utils/request'

export function listUserDepartment(data) {
  return request({
    url: '/ouser-web/department/listUserDepartment',
    method: 'post',
    data
  })
}
export function listChildrenCodeAndEmployee(data) {
  return request({
    url: '/ouser-web/department/listChildrenCodeAndEmployee',
    method: 'post',
    data
  })
}
export function searchChildrenCodeAndEmployee(data) {
  return request({
    url: '/ouser-web/department/searchChildrenCodeAndEmployee',
    method: 'post',
    data
  })
}
