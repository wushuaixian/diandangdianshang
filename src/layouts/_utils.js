export function genterMenu(list) {
  return list.map(x => {
    // if (['InquirySetting', 'InquiryConfigList'].includes(x.id)) {
    //   console.log(getIframePath(x))
    // }
    return {
      ...x,
      meta: { title: x?.name },
      // path: x.url || '',
      // name: x.id,
      ...getIframePath(x),
      children: x?.childs ? genterMenu(x.childs) : null
    }
  })
}

function getIframePath(item) {
  return {
    path: !item.isNew && item.url ? item.url || '' : item.url ? `/iframe${item.url}` : '',
    name: !item.isNew ? item.id : 'iframe'
  }
}
