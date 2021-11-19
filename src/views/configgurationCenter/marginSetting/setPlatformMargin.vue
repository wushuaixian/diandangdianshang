<!--
 * @Author: your name
 * @Date: 2021-06-19 15:03:50
 * @LastEditTime: 2021-07-05 17:54:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/configgurationCenter/marginSetting/setPlatformMargin.vue
-->
<template>
  <div>
    <a-card :bordered="false">
      <a-form :form="platform">
        <a-form-item
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 9 }"
          label="采购商寻源保证金下限金额"
          props="purchaserLowerAmount"
        >
          <a-input-number
            v-decorator="[
              'purchaserLowerAmount',
              {
                rules: [
                  { required: true, message: '请输入采购商寻源保证金下限金额' },
                  {
                    pattern: /^(\d{1,8}(\.\d{1,2})?$)/,
                    message: '最多输入10位数字(支持两位小数)',
                    trigger: 'change'
                  }
                ]
              }
            ]"
            :max="999999999"
            :step="0.01"
            :formatter="(value) => (value.includes('.') ? value.slice(0, 11) : value.slice(0, 8))"
            :parser="(value) => (value.includes('.') ? value.slice(0, 11) : value.slice(0, 8))"
            @change="handlePurchaserLowerAmount"
          />
          <span class="ant-form-item-children-span">元</span>
        </a-form-item>
        <a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }" label="选择采购商">
          <div class="select-allocaltion">
            <a-button type="primary" class="right" @click="visible = true">新增</a-button>
          </div>
          <s-table
            name="setAllocaltionColumnsTable"
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
            <a-button @click="reset">重置</a-button>
            <a-button type="primary" @click="selectAllocaltionTableColumnsGetList"> 查询 </a-button>
          </a-form-item>
        </a-row>
      </a-form>
      <s-table
        ref="selectAllocaltionTable"
        name="selectAllocaltionTabless"
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
import { merchantOrgInfo, saveBuyerSourceDeposit } from '@/api/configgurationCenter'
export default {
  name: 'SetPlatformMargin',
  data() {
    return {
      rules: {
        purchaserLowerAmount: [{ rules: [{ required: true, message: '请输入采购商寻源保证金下限金额' }] }]
      },
      platform: this.$form.createForm(this, { name: 'updataAllocation' }),
      visible: false, // 控制采购商列表弹窗
      setAllocaltionColumns: [
        {
          title: '采购商名称',
          dataIndex: 'enterpriseName',
          key: 'enterpriseName',
          align: 'center'
        },
        {
          title: '采购商编码',
          dataIndex: 'orgCode',
          key: 'orgCode',
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 110,
          scopedSlots: { customRender: 'operation' }
        }
      ],
      purchasersForm: {
        orgCode: '',
        enterpriseName: ''
      },
      selectedRowKeys: [], // 选择采购商
      selectedRows: [],
      selectAllocaltionTableColumns: [
        {
          title: '采购商名称',
          dataIndex: 'enterpriseName',
          key: 'enterpriseName',
          align: 'center'
        },
        {
          title: '采购商编码',
          dataIndex: 'orgCode',
          key: 'orgCode',
          align: 'center'
        }
      ]
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
      // this.$refs.table.refresh(true)
    },
    async setAllocaltionList() {
      const vue = this
      return new Promise((resolve) => {
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
    reset() {
      this.purchasersForm = {
        orgCode: '',
        enterpriseName: ''
      }
    },
    deleteSelectedRows(scope, row) {
      this.selectedRows = this.selectedRows.filter((item) => {
        return item.id !== row.id
      })
      this.$refs.table.refresh(true)
    },
    handlePurchaserLowerAmount(value) {
      if (!value) return
      this.platform.setFieldsValue({
        purchaserLowerAmount: value
      })
    },
    submitBtn() {
      this.platform.validateFields(async (err, value) => {
        if (!err) {
          this.selectedRows.map((item) => {
            item.purchaserCode = item.orgCode
            item.purchaserName = item.enterpriseName
            item.purchaserId = item.orgId
          })
          // this.addFinance(values)
          const result = await saveBuyerSourceDeposit({ ...value, depositConfigPOList: this.selectedRows })
          if (result.code === '0') {
            this.$message.success(result.message)
            this.$router.push({
              name: 'MarginForSourcing',
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
        name: 'MarginForSourcing',
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
.operation {
  margin: 0px 10px;
  cursor: pointer;
}
.operation:hover {
  color: #ff6b00;
}
/deep/ .ant-input-number {
  display: inline-block;
  width: 300px;
}
/deep/ .ant-modal-body {
  max-height: 600px;
  overflow: scroll;
}
/deep/ .ant-input-number-handler-wrap {
  display: none;
}
/deep/ .action {
  top: 8px !important;
}
</style>
