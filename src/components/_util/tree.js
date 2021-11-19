export default function tree2arr(
  tree,
  id = 'id',
  children = 'children',
  parentId = 'parentId',
  parentVal = 0,
  _level = 1
) {
  const rtv = []

  loop(rtv, tree, id, children, parentId, parentVal, _level)

  return rtv
}

/**
 * 转换tree 2 arr
 * @param {Array} rtv 返回的数据集合
 * @param {Array} arr 原生数据
 * @param {String} id 映射到数据的 'id'
 * @param {String} children 映射到数据的 'children'
 * @param {String} parentId 映射到数据的 'parentId'
 * @param {String | Number} parentVal 父节点的值， 默认 0
 * @param {Number} _level 等级， 默认 0
 */
function loop(rtv, arr, id, children, parentId, parentVal, _level) {
  Array.isArray(arr) &&
    arr.forEach(item => {
      item[parentId] = parentVal
      item._level = _level
      if (item[children] && item[children].length) {
        item._hasChildren = true
        rtv.push(item)
        loop(rtv, item[children], id, children, parentId, item[id], _level + 1)
      } else {
        rtv.push(item)
      }
    })
}
