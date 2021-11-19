const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export default [
  {
    path: '/iframe/',
    hidden: true,
    meta: { keepAlive: true },
    component: RouteView,
    children: [
      {
        path: '',
        name: 'iframe',
        hidden: true,
        query: {
          url: ''
        },
        component: () => import('@/views/iframe/index')
      }
    ]
  }
]
