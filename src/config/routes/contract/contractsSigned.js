export default [
  {
    path: '/contract/contractsSigned',
    name: 'contractContractsSigned',
    component: () => import('@/views/contract/suppliers/contractsSigned/contractsSigned.vue'),
    meta: { title: '采购待签合同列表', keepAlive: true, permission: ['Workplace'] }
  }
]
