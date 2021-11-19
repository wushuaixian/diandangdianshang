<template>
  <div class="suppliers-manage">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="form" :model="list">
          <a-row :gutter="40">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="公司名称">
                <!-- <a-select @change="handleChange" v-model="list.merchantId">
                  <a-select-option v-for="(text, index) in datalist" :key="index" :value="text.merchantId">
                    {{ text.merchantName }}</a-select-option
                  >
                </a-select> -->
                <d-select
                  class="max-width"
                  :allowClear="false"
                  @change="handleChange"
                  v-model="list.merchantId"
                  show-search
                  :filterOption="handleFetch"
                  :label-in-value="false"
                  :options="
                    datalist.map((i) => {
                      return { value: i.merchantId, label: i.merchantName }
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
      <div class="export">
        <addmatedete @changs="submer" :merchantName="merchantName" :merchantId="list.merchantId" />
        <!-- <export-file exportTaskText="查看导入任务" :params="exportParams" /> -->
        <export-file :params="exportParams" exportTaskText="查看导入任务" />
        <!-- <a-button class="btn" @click=";(viewTasksVisible = true), (taskType = '')"> 查看导入任务 </a-button> -->
        <a-button @click=";(viewTasksVisible = true), (taskType = 'exportMaterialList')"> 查看导出任务 </a-button>
      </div>
      <div class="bottom">
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
          <template slot="action" slot-scope="text">
            <bulletbox @changs="submer" :merchantName="merchantName" :merchantId="list.merchantId" :data="text" />
          </template>
        </s-table>
      </div>
    </a-card>
    <ViewTasks :visible="viewTasksVisible" @close="viewTasksVisible = false" :taskType="taskType" />
  </div>
</template>
<script>
import ViewTasks from '@/components/exportFile/viewTasks'
import { getSupplierMerchant, all } from '@/api/supplier'
import { getMaterialPage } from '@/api/materialDetailed'
import bulletbox from './bulletbox.vue'
import treeselect from '@/components/_global/TreeSelect'
import addmatedete from './addmaterialDetailed.vue'
import ExportFile from '@/components/exportFile/'

export default {
  components: {
    addmatedete,
    treeselect,
    bulletbox,
    ExportFile,
    ViewTasks
  },
  name: 'Supplier',
  data() {
    return {
      viewTasksVisible: false,
      value: [],
      normalizer(node) {
        return {
          id: node?.id,
          label: node?.name,
          children: node?.children || ''
        }
      },
      taskType: 'exportMaterialList',
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
        exportTypeList: ['materialImport'],
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
      const res = await getSupplierMerchant()
      if (res.code === '0') {
        this.merchantName = res.data[0].merchantName
        this.list.merchantId = res.data[0].merchantId
        this.initData = res.data[0]
        this.datalist = res.data
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
      // const datas = getMaterialPage(data)
      // datas.then((res) => {
      //   this.datas = res.data.listobj
      // })
      return getMaterialPage(data)
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
  .export {
    display: flex;
    margin-bottom: 20px;
    .exportFile {
      margin-left: 16px;
    }
  }
}
.max-width {
  width: 100%;
  // min-width: 200px;
}
/deep/ .ant-form-item-control-wrapper {
  min-width: 0px;
}
/deep/ .ant-select-selection-selected-value {
  // width: 150px;
  // min-width: 100px;
  width: 100%;
  overflow: hidden; //超出的文本隐藏
  text-overflow: ellipsis; //溢出用省略号显示
  white-space: nowrap; //溢出不换行
}
.btn {
  margin-right: 10px;
}
</style>
