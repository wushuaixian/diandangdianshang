import mrequest from '@/utils/mrequest'

// 消息事件获取列表
export function messageEventListGet(params) {
  return mrequest({
    url: '/msgCenterEvent/select/list/page',
    method: 'post',
    data: params
  })
}
// 消息事件的模板开关
export function templateSwitch(params) {
  return mrequest({
    url: '/msgCenterEvent/templateSwitch',
    method: 'post',
    data: params
  })
}
// 消息启用禁用
export function selective(params) {
  return mrequest({
    url: '/msgCenterEvent/update/selective',
    method: 'post',
    data: params
  })
}
// 查询系统消息推送记录
export function msgCenterEvent(params) {
  return mrequest({
    url: '/msgCenterEventLog/selectByVO',
    method: 'post',
    data: params
  })
}
// 根据消息事件查询消息模板
export function messageTemplatesGet(params) {
  return mrequest({
    url: '/msgCenterEventTemplate/queryMessageTemplatesByMessageEvents',
    // url: '/msgCenterEventTemplate/querySMSTemplatesCode',
    method: 'post',
    data: params
  })
}
// 根据消息事件查询消息模板
export function phoneTemplatesGet(params) {
  return mrequest({
    // url: '/msgCenterEventTemplate/queryMessageTemplatesByMessageEvents',
    url: '/msgCenterEventTemplate/querySMSTemplatesCode',
    method: 'post',
    data: params
  })
}
// 根据短信编码选择内容
export function byCodeGetMsg(params) {
  return mrequest({
    // url: '/msgCenterEventTemplate/queryTemplateByCode',
    url: '/msgCenterEventTemplate/queryTemplateByCode',
    method: 'post',
    data: params
  })
}
// 修改消息事件对应模板信息
export function byCodeUpdateMsg(params) {
  return mrequest({
    url: '/msgCenterEventTemplate/update',
    method: 'post',
    data: params
  })
}
// 消息记录查询
export function msgRecordsDetail(params) {
  return mrequest({
    url: '/msgCenterEventLog/select',
    method: 'post',
    data: params
  })
}
// 自定义消息列表
export function msgCustomList(params) {
  return mrequest({
    url: '/msgCenterCustom/select/list/page',
    method: 'post',
    data: params
  })
}
// 查询自定义条件列表
export function msgCustomObject(params) {
  return mrequest({
    url: '/msgCenterCustomObject/select/list/page',
    method: 'post',
    data: params
  })
}
// 添加自定义消息
export function msgCustomAdd(params) {
  return mrequest({
    url: '/msgCenterCustom/add/object',
    method: 'post',
    data: params
  })
}
// 根据id查询自定义详情
export function msgCustomById(params) {
  return mrequest({
    url: '/msgCenterCustom/select/object/id',
    method: 'post',
    data: params
  })
}
// 编辑自定义消息
export function msgCustomEdit(params) {
  return mrequest({
    url: '/msgCenterCustom/update/object',
    method: 'post',
    data: params
  })
}
// 根绝id删除自定义消息
export function msgCenterCustomDelete(params) {
  return mrequest({
    url: '/msgCenterCustom/delete/object/id',
    method: 'post',
    data: params
  })
}
// 查询推送对象列表
export function merchantOrgInfo(params) {
  return mrequest({
    url: '/msguser/select/list/page',
    method: 'post',
    data: params
  })
}
// 重新推送
export function pushAgain(params) {
  return mrequest({
    url: '/msgCenterEventLog/pushAgain',
    method: 'post',
    data: params
  })
}
// 批量推送
export function pushAll(params) {
  return mrequest({
    url: '/msgCenterEventLog/batchAgain',
    method: 'get',
    params: params
  })
}
// 自定义消息批量推送
export function pushCustom(params) {
  return mrequest({
    url: '/msgCenterCustom/send/list',
    method: 'post',
    data: params
  })
}
// 自定义消息立即推送
export function pushCustomAgain(params) {
  return mrequest({
    url: '/msgCenterCustom/forwardMsg',
    method: 'post',
    data: params
  })
}
// 自定义消息记录
export function msgCustomRecordsList(params) {
  return mrequest({
    url: '/msgCustomSendLog/select/code',
    method: 'post',
    data: params
  })
}
// 查询所有短信模板code
export function querySMSTemplatesCode(params) {
  return mrequest({
    url: '/msgCenterEventTemplate/querySMSTemplatesCode',
    method: 'post',
    data: params
  })
}
// 查询当前用户的消息列表
export function msgCenterEventLog(params, ut) {
  return mrequest({
    url: '/msgCenterEventLog/selectByUt?ut=' + ut,
    method: 'post',
    data: params
  })
}
// 更新消息的已读状态：站内信点开消息代表已读，更改是否已读状态
export function updateMsgReadStatus(params) {
  return mrequest({
    url: '/msgCenterEventLog/updateMsgReadStatus',
    method: 'post',
    data: params
  })
}
