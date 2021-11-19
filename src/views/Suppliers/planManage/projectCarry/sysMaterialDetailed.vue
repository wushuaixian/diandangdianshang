<template>
  <div class="suppliers-manage">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="form" :model="list">
          <a-row :gutter="40">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="公司名称">
                <!-- <a-select
                  :filterOption="handleFetch"
                  :label-in-value="true"
                  @change="handleChange"
                  v-model="list.merchantId"
                >
                  <a-select-option v-for="(text, index) in datalist" :key="index" :value="text.id">
                    {{ text.orgName }}</a-select-option
                  >
                </a-select> -->
                <d-select
                  class="max-width"
                  show-search
                  :filterOption="handleFetch"
                  :label-in-value="false"
                  :allowClear="false"
                  @change="handleChange"
                  v-model="list.merchantId"
                  :options="
                    datalist.map((i) => {
                      return { value: i.id, label: i.orgName }
                    })
                  "
                >
                </d-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="物料编码" prop="code">
                <a-input v-model="list.code" placeholder="请输入物料编码" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="物料名称" prop="name">
                <a-input v-model="list.name" placeholder="请输入物料名称" />
              </a-form-model-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-model-item label="规格型号" prop="materialModel">
                <a-input v-model="list.materialModel" placeholder="请输入规格型号" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="创建日期" prop="time">
                <a-range-picker v-model="list.time" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="类目名称" prop="materialCategoryIds">
                <tree-select
                  v-model="list.materialCategoryIds"
                  ref="buole"
                  :normalizer="normalizer"
                  :multiple="true"
                  :options="dataindexobj"
                  search-nested
                  value-consists-of="LEAF_PRIORITY"
                ></tree-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <div class="button">
                <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
                <a-button type="primary" @click="submer">查询</a-button>
              </div>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <a-card>
      <div class="bottom">
        <div class="export">
          <export-file :params="exportParams" />
        </div>
        <s-table
          name="materialDetailedTable"
          v-if="list.merchantId"
          :init-data="initData"
          ref="table"
          :scroll="{ x: 1600 }"
          rowKey="id"
          :columns="columns"
          :data="initTable"
        >
          <template v-slot:createTime="createTime">
            <div v-if="createTime">{{ createTime | moment }}</div>
            <div v-else></div>
          </template>
        </s-table>
      </div>
    </a-card>
  </div>
</template>
<script>
import { all } from '@/api/supplier'
import { getMaterialPage } from '@/api/materialDetailed'
import { getComList } from '@/api/contract'
import ExportFile from '@/components/exportFile/'
export default {
  components: { ExportFile },
  name: 'Supplier',
  data() {
    return {
      value: [],
      normalizer(node) {
        return {
          id: node?.id,
          label: node?.name,
          children: node?.children || ''
        }
      },
      datalist: [],
      colorList: [],
      list: {
        merchantId: '',
        code: '',
        name: '',
        materialCategoryIds: [],
        materialModel: '',
        time: null,
        beginTime: '',
        endTime: ''
      },
      columns: [
        {
          title: '序号',
          key: 'id',
          // scopedSlots: { customRender: 'index' }
          customRender: (text, record, index) => `${index + 1}`
        },
        { title: '一级名称/编码', dataIndex: 'fstNameCode' },
        { title: '二级名称/编码', dataIndex: 'sndNameCode' },
        { title: '三级名称/编码', dataIndex: 'trdNameCode' },
        { title: '物料编码', dataIndex: 'code', scopedSlots: { customRender: 'code' } },
        { title: '物料名称', dataIndex: 'name', scopedSlots: { customRender: 'name' } },
        {
          title: '规格型号',
          dataIndex: 'materialModel',
          width: '220px',
          scopedSlots: { customRender: 'materialModel' }
        },
        { title: '单位', dataIndex: 'mpMeasurementUnit', scopedSlots: { customRender: 'mpMeasurementUnit' } },
        { title: '创建时间', dataIndex: 'createTime', scopedSlots: { customRender: 'createTime' } },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 120,
          scopedSlots: { customRender: 'action' }
        }
      ],
      data: [],
      merchantName: null,
      dataindexobj: [],
      initData: {},
      datas: [],
      exportParams: {
        templateCode: 'materialExport',
        jsonTxt: {},
        exportType: 'exportMaterialList',
        fileName: '物料明细列表'
      }
    }
  },
  mounted() {
    this.getSupplierMerchant()
  },
  methods: {
    handleFetch(inputValue, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
    },
    async all() {
      const res = await all({ merchantId: String(this.list.merchantId) })
      if (res.code === '0') {
        this.dataindexobj = res.data
      }
    },
    handleChange(e) {
      this.list.merchantId = e
      this.merchantName = this.datalist.find((x) => x.merchantId === e)?.merchantName
      this.all()
      this.submer()
    },
    // 查询
    submer() {
      this.$refs.table.refresh(true)
    },
    async getSupplierMerchant() {
      const res = await getComList()
      if (res.code === '0') {
        const { buyerMerchantList } = res.data
        this.merchantName = buyerMerchantList[0]?.orgName
        this.list.merchantId = buyerMerchantList[0]?.id
        this.initData = buyerMerchantList[0]
        this.datalist = buyerMerchantList
      }
      this.all()
    },
    handleReset() {
      this.$refs.form.resetFields()
      this.getSupplierMerchant()
    },
    async initTable(params) {
      const { list } = this
      const { currentPage, itemsPerPage } = params
      const data = {
        currentPage,
        itemsPerPage,
        ...list
      }
      if (data.time) {
        const [beginTime, endTime] = data.time
        if (beginTime && endTime) {
          data.beginTime = beginTime.format('YYYY-MM-DD')
          data.endTime = endTime.format('YYYY-MM-DD')
        }
      }
      this.exportParams.jsonTxt = {
        ...data
      }
      const datas = getMaterialPage(data)
      datas.then((res) => {
        this.datas = res.data.listobj
      })
      return datas
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
