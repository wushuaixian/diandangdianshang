<template>
  <div class="material-modal">
    <a-modal
      destroyOnClose
      wrapClassName="material-modal-container"
      :visible.sync="visible"
      title="选择物料"
      width="1000px"
      @cancel="handleCancel"
      @ok="handleOk"
    >
      <div class="table-page-search-wrapper-custom">
        <a-form-model
          layout="inline"
          ref="form"
          :model="params"
          v-bind="{
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
          }"
        >
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="物料编码" prop="code">
                <a-input v-model="params.code"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="物料名称" prop="name">
                <a-input v-model="params.name"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="规格型号" prop="materialModel">
                <a-input v-model="params.materialModel"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="创建时间" prop="time">
                <a-range-picker v-model="params.time" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="类目名称" prop="materialCategoryIds">
                <tree-select
                  multiple="multiple"
                  v-model="params.materialCategoryIds"
                  :normalizer="normalizer"
                  :options="treeList"
                  value-consists-of="LEAF_PRIORITY"
                ></tree-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <div class="button">
                <a-button @click="Reset"> 重置</a-button>
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              </div>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
      <s-table
        name="materalModal"
        rowKey="id"
        ref="table"
        :rowSelection="rowSelection"
        class="table"
        :data="getMaterialList"
        :scroll="{ x: 2000 }"
        :columns="columns"
      >
        <template v-slot:createTime="createTime">
          {{ createTime | moment('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </s-table>
    </a-modal>
  </div>
</template>

<script>
import { getMaterialList, getCategoryAll } from '@/api/plan'
// import { filter } from 'vue/types/umd'
const columns = [
  {
    title: '一级名称/编码',
    key: 'fstNameCode',
    dataIndex: 'fstNameCode'
  },
  {
    title: '二级名称/编码',
    key: 'sndNameCode',
    dataIndex: 'sndNameCode'
  },
  {
    title: '三级名称/编码',
    key: 'trdNameCode',
    dataIndex: 'trdNameCode'
  },
  { title: '规格型号', dataIndex: 'materialModel', key: 'materialModel', show: true },
  {
    title: '物料编码',
    key: 'code',
    dataIndex: 'code'
  },
  {
    title: '物料名称',
    key: 'name',
    dataIndex: 'name'
  },
  {
    title: '单位',
    key: 'mpMeasurementUnit',
    dataIndex: 'mpMeasurementUnit'
  },
  {
    title: '创建时间',
    key: 'createTime',
    dataIndex: 'createTime',
    scopedSlots: { customRender: 'createTime' }
  }
]
export default {
  name: 'MaterialModal',
  props: {
    visible: {
      type: Boolean,
      deafault: false
    },
    merchantId: {
      type: [String, Number],
      default: ''
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.getCategoryAll()
      }
    }
  },
  data() {
    return {
      value: [],
      columns,
      params: {
        status: '0',
        materialCategoryIds: []
      },
      treeList: [],
      normalizer(node) {
        return {
          id: node?.id,
          label: node?.name,
          children: node?.children || []
        }
      },
      selectRows: [],
      rowSelection: {
        onChange: (selectRowKeys, selectRows) => {
          this.selectRows = selectRows
        }
      }
    }
  },
  methods: {
    Reset() {
      this.$refs.form.resetFields()
      // this.getCategoryAll()
      // this.value = []
      // this.$refs.child.updateValue([])
    },
    async getCategoryAll() {
      const { merchantId } = this
      const res = await getCategoryAll({ merchantId })
      if (res.code === '0') {
        this.treeList = res?.data
      }
    },
    async getMaterialList(paramsQuery) {
      const { merchantId } = this
      const data = {
        merchantId,
        ...paramsQuery,
        ...this.params
      }
      if (data.time) {
        const [beginTime, endTime] = data.time
        data.beginTime = beginTime
        data.endTime = endTime
      }
      return getMaterialList(data)
    },
    handleCancel() {
      this.$refs.form.resetFields()
      this.$emit('update:visible', false)
    },
    handleOk() {
      this.$emit('ok', this.selectRows)
      this.handleCancel()
    }
  }
}
</script>

<style lang="less" scoped>
.material-modal-container {
  .table {
    margin-top: 20px;
  }
}
</style>
