<template>
  <div class="suppliers-manage">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="form" :model="queryParam">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="企业名称" prop="enterpriseName">
                <a-input v-model="queryParam.enterpriseName" placeholder />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="供应商类型" prop="enterpriseNature">
                <a-select
                  allowClear
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  v-model="queryParam.enterpriseNature"
                >
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="1">生产商</a-select-option>
                  <a-select-option value="2">贸易商</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="审核时间" prop="time">
                <a-range-picker v-model="queryParam.time" />
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <div class="button">
                <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              </div>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <a-card>
      <div class="bottom">
        <a-tabs v-model="queryParam.authStatus" @change="handleTabsChange">
          <a-tab-pane v-for="item in authStatusList" :key="item.value" :tab="item.label" />
        </a-tabs>
        <s-table
          ref="table"
          name="managesTables1"
          rowKey="id"
          :scroll="{ x: 1600 }"
          :columns="columns"
          :data="initTable"
        >
          <template v-slot:enterpriseName="props">
            <router-link :to="{ name: 'SuppliersManageDetail', params: { id: props.id } }">{{
              props.enterpriseName
            }}</router-link>
          </template>
          <template v-slot:authStatus="props">{{
            $$(
              authStatusList.find((x) => x.value === props),
              'label'
            )
          }}</template>
          <template slot="enterpriseNature" slot-scope="text">
            <div v-show="text.enterpriseNature == 1">生产商</div>
            <div v-show="text.enterpriseNature == 2">贸易商</div>
          </template>
          <template v-slot:updateTime="updateTime">
            <div v-if="updateTime">{{ updateTime | moment }}</div>
            <div v-else></div>
          </template>
          <template v-slot:operation="operation">
            <a href="#" :operation="operation">查看企业风险</a>
          </template>
        </s-table>
      </div>
    </a-card>
  </div>
</template>
<script>
import { postSupplier } from '@/api/supplierCollection'
import { authStatusList } from '@/config/constant'
export default {
  name: 'Supplier',
  data() {
    return {
      authStatusList,
      colorList: [],
      queryParam: {
        auditStatus: '1',
        authStatus: '',
        enterpriseName: '',
        enterpriseNature: '',
        time: null,
        sign: '1'
      },
      columns: [
        {
          title: '企业名称',
          key: 'enterpriseName',
          scopedSlots: { customRender: 'enterpriseName' },
          width: 230,
          fixed: 'left'
        },
        {
          title: '管理员手机号',
          key: 'registerMobile',
          dataIndex: 'registerMobile'
        },
        { title: '统一社会信用代码', width: 170, key: 'businessLicenceNo', dataIndex: 'businessLicenceNo' },
        { title: '法定代表人', dataIndex: 'legalPersonName', key: 'legalPersonName' },
        { title: '供应商类型', key: 'enterpriseNature', scopedSlots: { customRender: 'enterpriseNature' } },
        { title: '审核时间', dataIndex: 'updateTime', key: 'updateTime', scopedSlots: { customRender: 'updateTime' } },
        { title: '认证状态', dataIndex: 'authStatus', key: 'authStatus', scopedSlots: { customRender: 'authStatus' } },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 120,
          scopedSlots: { customRender: 'operation' }
        }
      ],
      data: []
    }
  },
  methods: {
    handleReset() {
      this.$refs.form.resetFields()
    },
    handleTabsChange() {
      this.$refs.table.refresh(true)
    },
    async initTable(params) {
      const { queryParam } = this
      const data = {
        ...params,
        ...queryParam
      }
      if (data.time) {
        const [auditStartTime, auditEndTime] = data.time
        data.auditStartTime = auditStartTime
        data.auditEndTime = auditEndTime
      }
      return postSupplier({ ...data })
    },
    viewEnterprise(id) {
      this.$router.push({
        path: '/sysManagement/purchasers-audit-detail',
        query: {
          id: id
        }
      })
    }
  }
}
</script>
 <style lang="less" scoped>
.suppliers-manage {
  .ant-card + .ant-card {
    margin-top: 20px;
  }
  .button {
    text-align: center;
  }
}
</style>
