<template>
  <div>
    <a-card :bordered="false">
      <a-form :form="platform">
        <a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 8 }" label="采购商标书费金额">
          <a-input-number
            v-decorator="[
              'tenderAmount',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入标书费金额'
                  },
                  {
                    pattern: /^(\d{1,8}(\.\d{1,2})?$)/,
                    message: '最多输入10位数字(支持两位小数)',
                    trigger: 'change'
                  }
                ]
              }
            ]"
            :max="999999999"
            :formatter="(value) => (value.includes('.') ? value.slice(0, 11) : value.slice(0, 8))"
            :parser="(value) => (value.includes('.') ? value.slice(0, 11) : value.slice(0, 8))"
            :step="0.01"
            @change="changePrice($event)"
          />
          <span class="ant-form-item-children-span">元</span>
        </a-form-item>
        <a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }" label="选择采购商">
          <div class="select-allocaltion">
            <a-button type="primary" class="right" @click="visible = true">新增</a-button>
          </div>
          <s-table
            name="allocationOfTenderSetTable"
            ref="table"
            rowKey="id"
            :columns="setAllocaltionColumns"
            :data="setAllocaltionList"
          >
            <template slot="operation" slot-scope="scope, row">
              <span class="operation" @click="deleteSelectedRows(scope, row)">删除</span>
            </template>
          </s-table>
        </a-form-item>
        <a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 8 }" class="search-btn">
          <a-button type="primary" @click="submitBtn">保存</a-button>
          <a-button @click="back">返回</a-button>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 采购商列表弹窗 -->
    <a-modal title="采购商列表" width="800px" :visible="visible" @ok="handleOk" @cancel="handleCancel" okText="保存">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" label="采购商名称">
              <a-input v-model="purchasersForm.enterpriseName" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" label="采购商编码">
              <a-input v-model="purchasersForm.orgCode" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-form-item class="selectAllocaltionTable-btn">
            <a-button type="primary" @click="selectAllocaltionTableColumnsGetList">查询</a-button>
            <a-button @click=";[(purchasersForm.enterpriseName = ''), (purchasersForm.orgCode = '')]"> 重置 </a-button>
          </a-form-item>
        </a-row>
      </a-form>
      <s-table
        name="selectAllocaltionTable"
        ref="selectAllocaltionTable"
        :columns="selectAllocaltionTableColumns"
        :data="selectAllocaltionTableColumnsGetList"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        rowKey="id"
        :isCanFilter="false"
      />
    </a-modal>
  </div>
</template>
<script>
import { merchantOrgInfo, tenderAdd } from '@/api/configgurationCenter'
export default {
  name: 'SetAllocationOfTender',
  data() {
    return {
      platform: this.$form.createForm(this, { name: 'setAllocationOfTender' }),
      visible: false, // 控制采购商列表弹窗
      setAllocaltionColumns: [
        {
          title: '采购商名称',
          dataIndex: 'enterpriseName',
          key: 'enterpriseName'
        },
        {
          title: '采购商编码',
          dataIndex: 'orgCode',
          key: 'orgCode'
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          width: 110,
          scopedSlots: { customRender: 'operation' },
          algin: 'center'
        }
      ],
      purchasersForm: {
        enterpriseName: '',
        orgCode: ''
      },
      selectedRowKeys: [], // 选择采购商
      selectedRows: [], // 选择采购商
      selectAllocaltionTableColumns: [
        {
          title: '采购商名称',
          dataIndex: 'enterpriseName',
          key: 'enterpriseName'
        },
        {
          title: '采购商编码',
          dataIndex: 'orgCode',
          key: 'orgCode'
        }
      ]
      // selectAllocaltionTableColumnsGetList: []
    }
  },
  methods: {
    handleOk() {
      this.visible = false
      this.$refs.table.refresh(true)
    },
    handleCancel() {
      this.visible = false
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    setAllocaltionList() {
      const vue = this
      return new Promise((resolve, reject) => {
        const result = {
          data: {
            listObj: vue.selectedRows,
            total: vue.selectedRows.length
          }
        }
        resolve(result)
      })
    },
    async selectAllocaltionTableColumnsGetList(params) {
      if (params.isTrusted) {
        this.$refs.selectAllocaltionTable.refresh(true)
        params = { ...params, ...{ currentPage: 1, itemsPerPage: 10 } }
      }
      const result = await merchantOrgInfo({
        ...this.purchasersForm,
        isPurchasers: 1,
        ...params
      })
      return result
    },
    changePrice(value) {
      if (!value) return
      this.platform.setFieldsValue({ tenderAmount: value })
    },
    deleteSelectedRows(scope, row) {
      this.selectedRows = this.selectedRows.filter((item) => {
        return item.id !== row.id
      })
      this.$refs.table.refresh(true)
    },
    submitBtn() {
      this.platform.validateFields(async (err, value) => {
        if (!err) {
          var merchantIds = ''
          this.selectedRows.map((item) => {
            merchantIds += item.id.toString() + ','
          })
          // this.addFinance(values)
          const result = await tenderAdd({ ...value, ...{ merchantIds } })
          if (result.code === '0') {
            this.$message.success(result.message || '新增成功')
            this.$router.push({
              name: 'AllocationOfTenderSetIndex',
              query: {
                tabsKey: '2'
              }
            })
          }
        }
      })
    },
    back() {
      this.$router.push({
        name: 'AllocationOfTenderSetIndex',
        query: {
          tabsKey: '2'
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .ant-form-item-children {
  white-space: nowrap;
  .ant-form-item-children-span {
    margin-left: 5px;
  }
}
.select-allocaltion {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  .right {
    // float: right;
    cursor: pointer;
  }
}
.search-btn {
  text-align: center;
  display: flex;
  justify-content: center;
  margin-top: 30px;
  .ant-btn {
    margin: 0px 10px;
  }
}
.selectAllocaltionTable-btn {
  display: block;
  text-align: center;
  margin: 20px 0px;
  /deep/ .ant-btn-primary {
    margin: 0px 10px;
  }
}
/deep/ .ant-input-number {
  display: inline-block;
  width: 200px;
}
.operation {
  cursor: pointer;
}
.operation:hover {
  color: #ff6b00;
}
/deep/ .ant-modal-body {
  max-height: 600px;
  overflow: scroll;
}
/deep/ .ant-input-number-handler-wrap {
  display: none;
}
.search-btn {
  text-align: center;
  display: flex;
  justify-content: center;
  margin-top: 30px;
  .ant-btn {
    margin: 0px 10px;
  }
}
/deep/ .action {
  top: 8px !important;
}
</style>
