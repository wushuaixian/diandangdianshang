/*
 * @Author: your name
 * @Date: 2021-06-26 14:27:07
 * @LastEditTime: 2021-07-03 19:12:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/systemManagement/organization/_utils/index.js
 */

export function treeList(list) {
  const parent = list.filter(x => x.parentCode === '0')
  const data = parent.map(x => {
    const { name, code: key, id, parentCode } = x
    // const title = `${name}${entityName ? `-${entityName}` : ''}`
    // let title
    // if (parentCode === '0') {
    //   title = `德龙集团`
    // } else {
    //   title = `${name}`
    // }
    const title = `${name}`
    return {
      id,
      key,
      title,
      parentCode,
      info: { ...x },
      scopedSlots: { title: 'custom' },
      children: getChildrenList(list, key)
    }
  })
  return data
}
function getChildrenList(list, code) {
  const children = list
    .filter(x => x.parentCode === code)
    .map(x => {
      const { name, code: key, id, parentCode } = x
      // const title = `${name}${entityName ? `-${entityName}` : ''}`
      // let title
      // if (parentCode === '0') {
      //   title = `德龙集团`
      // } else {
      //   title = `${name}`
      // }
      const title = `${name}`
      return {
        id,
        key,
        title,
        parentCode,
        info: { ...x },
        scopedSlots: { title: 'custom' },
        children: getChildrenList(list, key)
      }
    })
  return children
}

export function getSearchList(listMap, searchText) {
  const treeList = listMap.filter(node => {
    if (node.children?.length > 0) {
      node.children = getSearchList(node?.children, searchText)
      // console.log(node.children)
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

export function getSearchListFilter(listMap, searchText) {
  const treeList = listMap.filter(node => {
    if (node.children?.length > 0) {
      node.children = getSearchListFilter(node?.children, searchText)
      if (node.children.length > 0 || hasSearchFilter(node?.info?.name, searchText)) node.style = true
      return node.children.length > 0 || hasSearchFilter(node?.info?.name, searchText)
    }
    if (hasSearchFilter(node?.info?.name, searchText)) {
      node.style = true
      return true
    }
    return false
  })
  return treeList
}
function hasSearchFilter(code, searchText) {
  const bool = searchText.filter((item) => {
    return item.name === code
  })
  return bool.length > 0
}
