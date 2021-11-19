<template>
  <div class="material-table" ref="material">
    <a-modal
      destroyOnClose
      :getContainer="() => this.$refs.material"
      width="1000px"
      v-if="visible"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      title="选择物料"
    >
      <div class="table-page-search-wrapper-custom">
        <a-form-model
          layout="inline"
          ref="form"
          :model="queryParam"
          v-bind="{
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
          }"
        >
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="物料编码" prop="materialCode">
                <a-input placeholder="请输入物料编码" v-model="queryParam.materialCode"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="物料名称" prop="materialName">
                <a-input placeholder="请输入物料名称" v-model="queryParam.materialName" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="规格型号" prop="materialModel">
                <a-input placeholder="请输入规格型号" v-model="queryParam.materialModel" />
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <div class="button">
                <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
                <a-button type="primary" @click="handleSearch">查询</a-button>
              </div>
            </a-col>
          </a-row>
        </a-form-model>
        <div class="table">
          <s-table
            name="materiaTables"
            ref="table"
            :rowSelection="rowSelection"
            :rowKey="(record) => record.id"
            :data="getList"
            :columns="columns"
            :scroll="{ x: 1000 }"
          >
          </s-table>
          <div class="count" v-show="selectRows.length > 0">
            已选
            <font class="num">{{ selectRows.length }}</font>
            条
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { getProjectMaterial } from '@/api/orderCenter'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    contractPurchaseSignId: {
      type: [String, Number],
      default: ''
    },
    buyerProjectCode: {
      type: String,
      default: ''
    },
    buyerProjectName: {
      type: String,
      default: ''
    },
    selectParams: {
      type: Object,
      default: () => []
    }
  },
  data() {
    return {
      confirmLoading: false,
      queryParam: {
        materialCode: '',
        materialName: '',
        materialModel: ''
      },
      columns: [
        { title: '项目编码', dataIndex: 'buyerProjectCode', key: 'buyerProjectCode' },
        { title: '项目名称', dataIndex: 'buyerProjectName', key: 'buyerProjectName' },
        { title: '物料编码', dataIndex: 'materialCode', key: 'materialCode' },
        { title: '物料名称', dataIndex: 'materialName', key: 'materialName' },
        { title: '规格型号', dataIndex: 'materialModel', key: 'materialModel' },
        { title: '单位', dataIndex: 'mpMeasurementUnit', key: 'mpMeasurementUnit' }
      ],
      selectRows: [],
      rowSelection: {
        onSelect: (record, selected) => {
          if (selected) this.selectRows.push(record)
          else this.selectRows.splice(this.selectRows.map((x) => x.id).indexOf(record.id), 1)
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          if (selected) this.selectRows.push(...changeRows)
          else {
            changeRows.map((x) => {
              this.selectRows.splice(this.selectRows.map((m) => m.id).indexOf(x.id), 1)
            })
          }
        },
        getCheckboxProps: (record) => ({
          props: {
            disabled: this.selectParams.includes(record.id), // Column configuration not to be checked
            name: record.name
          }
        })
      }
    }
  },
  watch: {
    visible() {
      this.selectRows = []
    }
  },
  methods: {
    async getList(page) {
      const { queryParam, contractPurchaseSignId } = this
      const data = {
        ...page,
        ...queryParam,
        contractPurchaseSignId: contractPurchaseSignId
      }
      const res = await getProjectMaterial(data)
      res.data.listObj = res.data?.listObj?.map((x) => ({
        ...x,
        buyerProjectCode: this.buyerProjectCode,
        buyerProjectName: this.buyerProjectName
      }))
      return res
    },
    handleReset() {
      this.$refs.form.resetFields()
    },
    handleSearch() {
      this.$refs.table.refresh(true)
    },
    handleOk() {
      this.$emit('ok', [...this.selectRows])
    },
    handleCancel() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="less" scoped>
.material-table {
  .s-table {
    margin-top: 20px;
  }
  .table {
    position: relative;
    .count {
      position: absolute;
      bottom: 23px;
      left: 12px;
      .num {
        color: #ff6b00;
        font-weight: bold;
      }
    }
  }
}
</style>
