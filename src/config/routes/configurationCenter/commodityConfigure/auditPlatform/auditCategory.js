export default [
  {
    path: '/commodityConfigure/auditing/index',
    name: 'auditingIndex',
    component: () => import('@/views/configgurationCenter/commodityConfigure/auditing/index'),
    meta: { title: '商品审核', keepAlive: true, permission: ['Workplace'] }
  },
  {
    path: '/commodityConfigure/auditing/supplier/add-update',
    name: 'auditingSupplierAddUpdate',
    component: () => import('@/views/configgurationCenter/commodityConfigure/auditing/supplier/add-update'),
    hidden: true,
    meta: { title: '新增-供应商维度', keepAlive: true, permission: ['Workplace'] }
  }
]
