/*
 * @Author: your name
 * @Date: 2021-07-25 21:09:14
 * @LastEditTime: 2021-08-12 18:48:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/Suppliers/package/setNewTableList.js
 */
export function setNewTableList (left, right) {
  const newLeftList = left.map((item, index) => {
    return item.equityInfoPOS.map((v, i) => {
      return v
    })
  }).flat()
  const list = newLeftList.map((item, index) => {
    item['equityValueList'] = []
    right.forEach((rightItem, rightIndex) => {
      rightItem.equityInfoVOS.forEach((v, i) => {
        if (v.equityId === item.id) {
          item['equityValue' + rightIndex] = v.equityValue
          item['isPossess' + rightIndex] = v.isPossess
          item['equityValueList'].push('equityValue' + rightIndex)
        }
      })
    })
    return item
  })
  return list.map((item, index) => {
    if (index / 2 % 1) {
      item['background'] = 'rgba(255, 107, 0, 0.06)'
    } else {
      item['background'] = 'rgba(255, 107, 0, 0.16)'
    }
    if (item.equityType === list[index - 1]?.equityType && list[index - 1] && index !== 0) {
      item['background'] = list[index - 1].background
    }
    const { length } = list.filter((i) => {
      return i.equityType === item.equityType
    })
    return { ...item, length: index + length }
  })
}
export function setNewTableColums (list, data, e) {
  const nameColums = data.map((item, index) => {
    const newColums = {
      title: item.packageName,
      dataIndex: `equityValue${index}`,
      key: `equityValue${index}`,
      scopedSlots: { customRender: `packageName${index}` }
    }
    return newColums
  })
  const columns = [
    {
      title: '名称',
      colSpan: 2,
      dataIndex: 'equityType',
      customCell(value, index) {
        return {
          style: {
            'background-color': value.background
          }
        }
      },
      customRender: (value, row, index) => {
        const { length } = list.filter((item) => {
          return row.equityType === item.equityType
        })
        const { tableList } = e
        return {
          children: <span>{ value }</span>,
          attrs: {
            rowSpan: row.equityType === tableList[index - 1]?.equityType && tableList[index - 1] ? 0 : length
          }
        }
      }
    },
    {
      title: '名称',
      colSpan: 0,
      dataIndex: 'equityName',
      customCell(value, index) {
        return {
          style: {
            'background-color': value.background
          }
        }
      }
    },
    ...nameColums
  ]
  return columns
}

export function getItemTableList(dataList, packageName, e) {
  // const nameColums = dataList.map((item, index) => {
  //   const newColums = {
  //     title: packageName,
  //     dataIndex: `equityValue${index}`,
  //     key: `equityValue${index}`,
  //     scopedSlots: { customRender: `packageName${index}` }
  //   }
  //   return newColums
  // })
  const list = dataList.map((item, index) => {
    if (index / 2 % 1) {
      item['background'] = 'rgba(255, 107, 0, 0.06)'
    } else {
      item['background'] = 'rgba(255, 107, 0, 0.16)'
    }
    if (item.equityType === dataList[index - 1]?.equityType && dataList[index - 1] && index !== 0) {
      item['background'] = dataList[index - 1].background
    }
    item.rowSpan = dataList.filter((i) => {
      return i.equityType === item.equityType
    }).length
    // return { ...item,
    //   title: packageName,
    //   dataIndex: 'equityValue',
    //   key: 'equityValue',
    //   scopedSlots: { customRender: 'packageName' }
    // }
    return item
  })
  const columns = [
    {
      title: '名称',
      colSpan: 2,
      dataIndex: 'equityType',
      customCell(value, index) {
        return {
          style: {
            'background-color': value.background
          }
        }
      },
      customRender: (value, row, index) => {
        const { length } = list.filter((item) => {
          return row.equityType === item.equityType
        })
        const { tableList } = e
        return {
          children: value,
          attrs: {
            rowSpan: row.equityType === tableList[index - 1]?.equityType && tableList[index - 1] ? 0 : length
          }
        }
      }
    },
    {
      title: '名称',
      colSpan: 0,
      dataIndex: 'equityName',
      customCell(value, index) {
        return {
          style: {
            'background-color': value.background
          }
        }
      }
    },
    {
      title: packageName,
      colSpan: 1,
      dataIndex: 'equityValue',
      scopedSlots: { customRender: 'packageName' }
      // customCell(value, index) {
      //   return {
      //     style: {
      //       'background-color': value.background
      //     }
      //   }
      // }
    }
    // ...nameColums
  ]
  return { list, columns }
}
