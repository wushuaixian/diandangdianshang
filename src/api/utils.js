import request from '@/utils/request'

/**
 * 获取数据字典
 * @param {Array} categories 字典数组
 */
export function getDictionary(categories) {
  return request({ url: '/back-manage-web/code/listMulti', method: 'post', data: { categories: categories } })
}
