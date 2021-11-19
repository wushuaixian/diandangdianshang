import request from '@/utils/request'

export function getMenus(params) {
  return request({
    url: '/ouser-web/platform/queryMenuTree.do',
    method: 'post',
    data: params
  })
}
