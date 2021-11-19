export default [
  {
    path: '/contract/pendingApproval',
    name: 'contractPendingApproval',
    component: () => import('@/views/contract/purchasers/pendingApproval/pendingApproval.vue'),
    meta: { title: '采购商合同待审核', keepAlive: true, permission: ['contractPendingApproval'] }
  }
]
