import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}
export default [
  {
    path: '/message',
    name: 'message',
    hidden: false,
    component: RouteView,
    meta: { title: '消息中心', icon: bxAnaalyse, keepAlive: true, permission: ['message'] },
    children: [
      {
        path: '/message/messageEvent',
        name: 'message-messageEvent',
        component: () => import('@/views/sysManagement/message/event/index.vue'),
        meta: { title: '系统消息', keepAlive: true, permission: ['message-messageEvent'] }
      },
      {
        path: '/message/messageEventList',
        name: 'message-messageEventList',
        hidden: true,
        component: () => import('@/views/sysManagement/message/event/list.vue'),
        meta: { title: '系统消息记录', keepAlive: true, permission: ['message-messageEvent'] }
      },
      {
        path: '/message/messageCustom',
        name: 'message-messageCustom',
        component: () => import('@/views/sysManagement/message/custom/index.vue'),
        meta: { title: '自定义消息', keepAlive: true, permission: ['message-messageCustom'] }
      },
      {
        path: '/message/messageCustomList',
        name: 'message-messageCustomList',
        hidden: true,
        component: () => import('@/views/sysManagement/message/custom/list.vue'),
        meta: { title: '自定义消息记录', keepAlive: true, permission: ['message-messageCustom'] }
      },
      {
        path: '/message/messageCustomEdit',
        name: 'message-messageCustomEdit',
        hidden: true,
        component: () => import('@/views/sysManagement/message/custom/edit.vue'),
        meta: { title: '编辑-自定义消息', keepAlive: true, permission: ['message-messageCustom'] }
      }
    ]
  }
]
