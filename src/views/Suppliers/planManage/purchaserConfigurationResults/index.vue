<template>
  <div class="appeal-manage-list">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="ruleForm" :model="queryParam">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="公司名称" :labelCol="{ lg: { span: 8 } }">
                <a-select v-model="ids" default-value="1" style="width: 174px" @change="handleChange">
                  <a-select-option v-for="(text, index) in company" :key="index" :value="String(text.merchantId)">
                    {{ text.merchantName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8">
              <a-form-item label="姓名" :labelCol="{ lg: { span: 8 } }">
                <a-input v-model="queryParambusinessName" placeholder="请输入姓名" />
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="24" class="button">
              <a-button @click="reset">重置</a-button>
              <a-button type="primary" @click="search">查询</a-button>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <a-card>
      <s-table
        v-if="ids"
        name="identityCardNameTables"
        :init-data="initData"
        rowKey="id"
        ref="table"
        :columns="columns"
        :data="getList"
      >
        <span slot="action" slot-scope="identityCardName, record">
          <importbox @search="search" :ids="ids" :file-data="record" :merchantName="merchantName" />
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { getMerchantConfigMaterial, getSupplierMerchant } from '@/api/supplier'
import importbox from './importBox.vue'
export default {
  components: { importbox },
  data() {
    return {
      ids: '',
      columns: [
        {
          title: '序号',
          key: 'Id',
          dataIndex: 'index',
          scopedSlots: { customRender: 'index' }
        },
        {
          title: '姓名',
          key: 'identityCardName',
          dataIndex: 'identityCardName'
        },
        {
          title: '手机号',
          key: 'mobile',
          dataIndex: 'mobile'
        },
        {
          title: '组织',
          key: 'departmentName',
          dataIndex: 'departmentName'
        },
        {
          title: '角色',
          key: 'roleName',
          dataIndex: 'roleName'
        },
        {
          title: '已分配物料类目',
          key: 'categoryName',
          dataIndex: 'categoryName',
          customRender: (text) => {
            return text.replace(',', ',')
          }
        },
        {
          title: '操作',
          fixed: 'right',
          key: 'action',
          dataIndex: 'action',
          width: 200,
          scopedSlots: { customRender: 'action' }
        }
      ],
      queryParam: {
        identityCardName: '',
        merchantId: '12'
      },
      advanced: false,
      list: [],
      company: [],
      queryParambusinessName: '',
      initData: null,
      merchantName: ''
    }
  },
  // created() {},
  mounted() {
    this.getSupplierMerchant()
  },
  methods: {
    async getSupplierMerchant() {
      const res = await getSupplierMerchant()
      if (res.code === '0') {
        this.merchantName = res.data[0]?.merchantName
        this.ids = String(res.data[0].merchantId)
        this.initData = res.data[0]
        this.company = res.data
      }
    },
    reset() {
      this.queryParambusinessName = ''
    },
    search() {
      this.$refs.table.refresh(true)
    },
    handleChange(value) {
      this.merchantName = this.company.find((x) => x.merchantId === Number(value))?.merchantName
      this.search()
    },
    // 获取列表
    async getList(pagination) {
      const { currentPage, itemsPerPage } = pagination
      const data = {
        identityCardName: this.queryParambusinessName,
        merchantId: String(this.ids),
        currentPage,
        itemsPerPage
      }
      return getMerchantConfigMaterial({ ...data })
    }
  }
}
</script>

<style lang="less" scoped>
.appeal-manage-list {
  .ant-card + .ant-card {
    margin-top: 20px;
  }
  .button {
    text-align: center;
  }
}
</style>
