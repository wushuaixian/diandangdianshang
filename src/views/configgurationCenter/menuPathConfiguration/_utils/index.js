/*
 * @Author: your name
 * @Date: 2021-07-26 17:48:50
 * @LastEditTime: 2021-07-27 00:43:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/configgurationCenter/menuPathConfiguration/_utils/index.js
 */
// 1 菜单 2按钮 3 功能 4 菜单
export function treeList(list) {
  const parent = list.filter(x => x.pId === '0')
  const data = parent.map(x => {
    const { name, code: key, id, pId } = x
    const title = `${name}`
    return {
      id,
      key,
      title,
      pId,
      info: { ...x },
      scopedSlots: { title: 'custom' },
      children: getChildrenList(list, id, parent[0].name)
    }
  })
  return data
}
function getChildrenList(list, code, parentName) {
  const children = list
    .filter(x => x.pId === code)
    .map(x => {
      const { name, code: key, id, pId } = x
      const title = `${name}`
      return {
        id,
        key,
        title,
        pId,
        info: { ...x, parentName },
        scopedSlots: { title: 'custom' },
        children: getChildrenList(list, id, x.name)
      }
    })
  return children
}

export function getSearchList(listMap, searchText) {
  const treeList = listMap.filter(node => {
    if (node.children?.length > 0) {
      node.children = getSearchList(node?.children, searchText)
      return node.children.length > 0 || hasSearch(node?.title, searchText)
    }
    if (hasSearch(node?.title, searchText)) {
      return true
    }
    return false
  })
  return treeList
}

function hasSearch(title, seachText) {
  return title?.toLocaleLowerCase()?.includes(seachText.toLocaleLowerCase())
}
