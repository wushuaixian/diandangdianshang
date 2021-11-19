<template>
  <div>
    <Tabtitle :titleName="titleName"></Tabtitle>
    <a-button class="mt-16" size="large" type="primary"> 添加联系人 </a-button>
    <s-table :data="[]" name="linkmanInfoTable" :columns="columns" rowKey="userId" :pagination="false">
      <template v-slot:action>
        <span class="bluetext" style="color: #1890ff">指定验厂</span>
      </template>
      <!--      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"-->
      <!--      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"-->
    </s-table>
  </div>
</template>

<script>
import Tabtitle from './tabtitle.vue'
// import { supplieAuthAdminQuyery } from '@/api/supplieAuthAdmin'
// import { formatDate } from '@/utils/util'
export default {
  name: 'LinkmanInfo',
  components: {
    Tabtitle: Tabtitle // 导航标题
  },
  data() {
    return {
      titleName: '联系人信息',
      columns: [
        {
          title: '联系人姓名',
          // scopedSlots: { customRender: 'enterpriseName' },
          width: 150
          // fixed: 'left'
        },
        { title: '联系人手机号', width: 170, dataIndex: 'creditCode' },
        { title: '职务', dataIndex: 'representative', width: 150 },
        { title: '联系人邮箱', key: '2', width: 120 },
        {
          title: '操作',
          key: 'action',
          // fixed: 'right',
          width: 150,
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  methods: {
    // async init() {
    //   await supplieAuthAdminQuyery({
    //     currenPage: 1,
    //     itemsPerPage: 5
    //   }).then((res) => {
    //     console.log(res.data)
    //     const oldData = res.data
    //     const newData = []
    //     for (let i = 0; i < oldData.length; i++) {
    //       newData.push({
    //         key: oldData[i].id,
    //         enterpriseName: oldData[i].enterpriseName,
    //         creditCode: '',
    //         representative: oldData[i].legalPersonName,
    //         authStatus: oldData[i].authStatus, // 待确认数字状态
    //         appointMechanism: oldData[i].factoryAuditOrg,
    //         estimatedTime: formatDate(oldData[i].expectFactoryAuditTime), // 预计验厂时间
    //         actualTime: formatDate(oldData[i].realFactoryAuditTime), // 实际验厂时间
    //         workOrderNo: oldData[i].orgId, // 待确认参数
    //         submitTime: formatDate(oldData[i].factoryAuditCreateTime), // 提交时间
    //         content: '' // 未通过原因
    //       })
    //     }
    //     return { data: newData }
    //   })
    // },
  }
}
</script>

<style scoped>
.mt-16 {
  margin-top: 16px;
}
</style>
