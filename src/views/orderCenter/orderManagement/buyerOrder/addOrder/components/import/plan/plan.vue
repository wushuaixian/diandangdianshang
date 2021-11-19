<template>
  <div class="material-table" ref="material">
    <a-modal
      destroyOnClose
      :getContainer="() => this.$refs.material"
      width="1000px"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      title="选择计划"
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
            <!-- <a-col :md="8" :sm="24">
              <a-form-model-item label="采购员" prop="buyerUserName">
                <a-input placeholder="请输入采购员" v-model="queryParam.buyerUserName" />
              </a-form-model-item>
            </a-col> -->
            <a-col :md="24" :sm="24">
              <div class="button">
                <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
                <a-button type="primary" @click="handleSearch">查询</a-button>
              </div>
            </a-col>
          </a-row>
        </a-form-model>
        <a-tabs>
          <a-tab-pane key="1" tab="待执行">
            <div class="table">
              <s-table
                name="queryBuyerPlanProcessPage"
                ref="queryBuyerPlanProcessPage"
                :rowSelection="rowSelection"
                :rowKey="(record) => record.id"
                :data="(page) => init('queryBuyerPlanProcessPage', page)"
                :columns="columns"
                :scroll="{ x: 1300, y: 270 }"
              >
                <template v-slot:action="">
                  <span> &nbsp; </span>
                </template>
              </s-table>
              <div class="count" v-show="selectRows.length > 0">
                已选
                <font class="num">{{ selectRows.length }}</font>
                条
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="待下单">
            <div class="table">
              <s-table
                name="queryplanMatchingContractPage"
                ref="queryplanMatchingContractPage"
                :rowSelection="rowSelection"
                :rowKey="(record) => record.id"
                :data="(page) => init('queryplanMatchingContractPage', page)"
                :columns="columns"
                :scroll="{ x: 1300, y: 270 }"
              >
              </s-table>
              <div class="count" v-show="selectRows.length > 0">
                已选
                <font class="num">{{ selectRows.length }}</font>
                条
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-modal>
  </div>
</template>

<script>
import * as api from '@/api/projectCarry'
export default {
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    selectParams: {
      type: Object,
      default: () => []
    }
  },
  watch: {
    visible(v) {
      if (v) {
        this.selectRows = []
      }
    }
  },
  data() {
    return {
      showTable: false,
      confirmLoading: false,
      queryParam: {
        materialCode: '',
        materialName: '',
        materialModel: '',
        buyerUserName: '',
        status: '2',
        closeStatus: '0'
      },
      columns: [
        { title: '采购申请单号', dataIndex: 'buyerPlanCode', key: 'buyerPlanCode', width: 200 },
        { title: '采购计划编码', dataIndex: 'planItemCode', key: 'planItemCode', width: 200 },
        { title: '采购项目编号', dataIndex: 'planProjectItemCode', key: 'planProjectItemCode', width: 150 },

        { title: '物料编码', dataIndex: 'materialCode', key: 'materialCode', width: 100 },
        { title: '物料名称', dataIndex: 'materialName', key: 'materialName', width: 100 },
        { title: '规格型号', dataIndex: 'materialModel', key: 'materialModel', width: 100 },

        { title: '计划数量', dataIndex: 'planNum', key: 'planNum', width: 100 },
        { title: '待下单数量', dataIndex: 'executoryNum', key: 'executoryNum', width: 100 },

        { title: '单位', dataIndex: 'mpMeasurementUnit', key: 'mpMeasurementUnit', width: 100 },
        { key: 'action', scopedSlots: { customRender: 'action' }, fixed: 'right' }
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
  methods: {
    async init(apiFunc, page) {
      const { queryParam } = this
      const data = {
        ...page,
        ...queryParam
      }
      const res = await api[apiFunc](data)
      if (res.data.total !== 0) {
        res.data.listObj = res.data.listObj.map((x) => ({
          ...x,
          purchaseOrderSourceType: apiFunc === 'queryBuyerPlanProcessPage' ? 1 : 2
        }))
      }
      return res
    },
    handleReset() {
      this.$refs.form.resetFields()
      this.$refs.queryBuyerPlanProcessPage.refresh(true)
      this.$refs.queryplanMatchingContractPage.refresh(true)
    },
    handleSearch() {
      this.$refs.queryBuyerPlanProcessPage.refresh(true)
      this.$refs.queryplanMatchingContractPage.refresh(true)
    },
    handleOk() {
      this.$emit('ok', [...this.selectRows])
      this.$emit('update:visible', false)
    },
    handleCancel() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="less" scoped>
.material-table {
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
