/*
 * @Author: your name
 * @Date: 2021-06-30 23:10:17
 * @LastEditTime: 2021-07-12 21:07:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/components/_util/table.js
 */
import cookie from '@/utils/cookie'
export const Index = (current, pageSize) => {
  return {
    title: '序号',
    key: 'index',
    fixed: 'left',
    ellipsis: true,
    show: true,
    width: 80,
    customRender: (text, record, i) => {
      return Number(pageSize) * (Number(current) - 1) + i + 1
    }
  }
}
export const Action = item => {
  return {
    ...item,
    title: null,
    key: 'action',
    show: true,
    width: !Number(item.width) ? 80 : item.width
  }
}
export const getTbaleRenderItems = (storageColumns, columns) => {
  return storageColumns.map(x => {
    const item = columns.find(c => c.key === x.key)
    return {
      ...item,
      ...x
    }
  })
}
export const setColumnsShow = (key, columns) => {
  const storageColumns = cookie.getItem(key) ? JSON.parse(cookie.getItem(key)) : null
  return columns.map(x => {
    return {
      ...x,
      show: storageColumns?.find(c => c.key === x.key)?.show || false
    }
  })
}
export const getColumns = (...reset) => {
  const [key, columns, current, pageSize, isCanFilter, isShowIndex] = reset
  const storageColumns = cookie.getItem(key) ? JSON.parse(cookie.getItem(key)) : null
  const columnSlots = columns.map(x => x.scopedSlots?.customRender).filter(x => x)
  const columnDataIndex = columns.map(x => x.dataIndex).filter(x => x)
  const columnTitle = columns.map(x => x.title).filter(x => x)
  const allOk = storageColumns
    ?.filter(x => x.scopedSlots || x.dataIndex)
    ?.every(x => {
      if (x.scopedSlots?.customRender) {
        return columnSlots.includes(x.scopedSlots?.customRender)
      }
      if (x.dataIndex) {
        return columnDataIndex.includes(x.dataIndex)
      }
      if (x.title) {
        return columnTitle.includes(x.title)
      }
      return false
    })
  // && storageColumns.length === columns.length
  let useColumns = allOk ? getTbaleRenderItems(storageColumns, columns) : columns
  useColumns = useColumns.map(x => {
    const { key, title } = x
    x.ellipsis = true
    if (key === 'action' || title === '操作') {
      x = Action(x)
    }
    if ((key === 'index' || title === '序号') && isShowIndex) {
      x = { ...Index(current, pageSize), fixed: x.fixed }
    }
    if (!Reflect.has(x, 'show')) {
      x.show = true
    }
    if (!Reflect.has(x, 'key')) {
      x.key = x?.dataIndex
    }
    return {
      ...x
    }
  })
  // 如果没有序号手动添加
  if (!useColumns.find(x => x.key === 'index' || x.title === '序号') && isShowIndex) {
    useColumns.unshift({ ...Index(current, pageSize) })
  }
  if (
    !useColumns.find(x => x.key === 'action' || x.title === '操作') &&
    !useColumns.find(x => x.key === 'setting') &&
    isCanFilter
  ) {
    useColumns.push({
      title: null,
      key: 'setting',
      fixed: useColumns.length > 6 ? 'right' : null,
      show: true,
      width: 60
    })
  }
  if (!allOk) {
    cookie.setItem(key, JSON.stringify(useColumns))
  }
  return useColumns.filter(x => x.show)
}

export function getCustomPageList(pageNum, pageSize, list) {
  const start = (pageNum - 1) * pageSize
  const end = (pageNum - 1) * pageSize + pageSize
  return list?.slice(start, end)
}
