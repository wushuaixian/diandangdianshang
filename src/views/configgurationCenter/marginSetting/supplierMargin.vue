<!--
 * @Author: your name
 * @Date: 2021-06-19 15:56:11
 * @LastEditTime: 2021-07-05 17:06:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/configgurationCenter/marginSetting/supplierMargin.vue
-->
<template>
  <div>
    <a-card>
      <div class="supplier-title">
        <span>供应商寻源保证金下限金额：</span>
        <span class="right-log" @click="visible = true">查看操作日志</span>
      </div>
      <s-table
        name="supplierMatgin"
        ref="supplierMatginTable"
        :columns="supplierMatginColumns"
        :data="supplierMatginList"
        rowKey="id"
      >
        <span slot="customTitle"><span class="icon">*</span>最低金额</span>
        <template slot="supplierType" slot-scope="scope">
          <div>{{ supplierTypeJson[scope] }}</div>
        </template>
        <template slot="supplierRatio" slot-scope="scope, v">
          <a-input-number
            v-model="v.supplierRatio"
            :disabled="!v.operation.isEdie"
            :min="0"
            :max="100"
            :step="0.01"
            :formatter="(value) => `${value.slice(0, 5)}%`"
            :parser="(value) => value.slice(0, 5).replace('%', '')"
          />
        </template>
        <template slot="supplierLowerAmount" slot-scope="scope, v">
          <a-input-number
            :value="v.supplierLowerAmount"
            :maxLength="10"
            :disabled="!v.operation.isEdie"
            v-decorator="[
              'supplierLowerAmount',
              {
                rules: [
                  { required: true, message: '请输入供应商寻源保证金最低金额' },
                  {
                    pattern: /^(\d{1,8}(\.\d{1,2})?$)/,
                    message: '最多输入10位数字(支持两位小数)',
                    trigger: 'change'
                  }
                ]
              }
            ]"
            :step="0.01"
            :formatter="(value) => (value.includes('.') ? value.slice(0, 11) : value.slice(0, 8))"
            :parser="(value) => (value.includes('.') ? value.slice(0, 11) : value.slice(0, 8))"
            @change="handleChange($event, v, 'supplierLowerAmount')"
          />
          (元)
        </template>
        <template slot="supplierHighAmount" slot-scope="scope, v">
          <a-input-number
            :value="v.supplierHighAmount"
            :step="0.01"
            :maxLength="10"
            v-decorator="[
              'supplierHighAmount',
              {
                rules: [
                  { required: true, message: '请输入采购商寻源保证金上限金额' },
                  {
                    pattern: /^(\d{1,8}(\.\d{1,2})?$)/,
                    message: '最多输入10位数字(支持两位小数)',
                    trigger: 'change'
                  }
                ]
              }
            ]"
            :formatter="(value) => (value.includes('.') ? value.slice(0, 11) : value.slice(0, 8))"
            :parser="(value) => (value.includes('.') ? value.slice(0, 11) : value.slice(0, 8))"
            :disabled="!v.operation.isEdie"
            @change="handleChange($event, v, 'supplierHighAmount')"
          />
          (元)
        </template>
        <template slot="operation" slot-scope="scope, v, i">
          <span class="operation" @click="saveOperation(scope, v, i)">{{ v.operation.isEdie ? '保存' : '编辑' }}</span>
          <span class="operation" v-if="v.operation.isEdie" @click="canceOperation(scope, v, i)">取消</span>
          <!-- <span class="operation" v-if="!v.operation.isEdie" @click="editOperation(scope, v, i)">编辑</span> -->
        </template>
      </s-table>
    </a-card>
    <a-modal
      v-if="visible"
      title="查看操作日志"
      :width="800"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      okText="保存"
    >
      <s-table
        name="supplierMatginModalTabls"
        ref="table"
        :columns="supplierMatginModalColumns"
        :data="supplierMatginModalList"
        rowKey="id"
        :scroll="{ x: 800 }"
        :isCanFilter="false"
      >
        <template slot="supplierType" slot-scope="scope">
          <div>{{ supplierTypeJson[scope] }}</div>
        </template>
        <template slot="createTime" slot-scope="scope"> {{ scope | moment('YYYY-MM-DD HH:mm:ss') }} </template>
      </s-table>
      <template slot="footer">
        <a-button @click="handleCancel">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import {
  findSupplierSourceDepositLog,
  findSupplierSourceDeposit,
  updateSupplierSourceDeposit
} from '@/api/configgurationCenter'
export default {
  data() {
    return {
      supplierMatginColumns: [
        {
          title: '寻招标维度',
          dataIndex: 'supplierType',
          key: 'supplierType',
          align: 'center',
          scopedSlots: { customRender: 'supplierType' }
        },
        {
          title: '预算比例(%)',
          dataIndex: 'supplierRatio',
          key: 'supplierRatio',
          align: 'center',
          scopedSlots: { customRender: 'supplierRatio' }
        },
        {
          title: '* 最低金额(必填)',
          dataIndex: 'supplierLowerAmount',
          key: 'supplierLowerAmount',
          align: 'center',
          scopedSlots: { customRender: 'supplierLowerAmount' }
        },
        {
          title: '最高金额(元)',
          dataIndex: 'supplierHighAmount',
          key: 'supplierHighAmount',
          align: 'center',
          scopedSlots: { customRender: 'supplierHighAmount' }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          width: 110,
          scopedSlots: { customRender: 'operation' }
        }
      ],
      supplierMatginModalColumns: [
        {
          title: '序号',
          dataIndex: 'index',
          width: 100,
          align: 'center'
        },
        {
          title: '寻招标维度',
          dataIndex: 'supplierType',
          key: 'supplierType',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'supplierType' }
        },
        {
          title: '预算比例(%)',
          dataIndex: 'supplierRatio',
          key: 'supplierRatio',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'supplierRatio' }
        },
        {
          title: '最低金额(元)',
          dataIndex: 'supplierLowerAmount',
          key: 'supplierLowerAmount',
          align: 'center',
          width: 100,
          scopedSlots: { customRender: 'supplierLowerAmount' }
        },
        {
          title: '最高金额(元)',
          dataIndex: 'supplierHighAmount',
          key: 'supplierHighAmount',
          align: 'center',
          width: 100,
          scopedSlots: { customRender: 'supplierHighAmount' }
        },
        {
          title: '操作人',
          dataIndex: 'createUsername',
          key: 'createUsername',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'createUsername' }
        },
        {
          title: '操作时间',
          dataIndex: 'createTime',
          key: 'createTime',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'createTime' }
        }
      ],
      visible: false,
      supplierTypeJson: {
        1: '法定招标',
        2: '询比价',
        3: '正向竞价',
        4: '反向竞价',
        5: '单一来源',
        6: '企业招标'
      }
    }
  },
  methods: {
    async supplierMatginList(params) {
      const result = await findSupplierSourceDeposit(params)
      result.data.forEach((item) => {
        this.$set(item, 'operation', { ...item, ...{ isEdie: false } })
      })
      const res = {
        data: {
          listObj: result.data,
          total: result.data.length
        }
      }
      return res
    },
    async supplierMatginModalList(params) {
      const result = await findSupplierSourceDepositLog(params)
      result.data.listObj = result.data.data
      result.data.listObj.forEach((item, index) => {
        this.$set(item, 'index', index + 1)
      })
      return result
    },
    handleOk() {
      this.visible = false
    },
    handleCancel() {
      this.visible = false
    },
    changeBuggetProportion(item, value, index, e) {
      value.supplierRatio = e
    },
    handleChange(e, value, key) {
      if (e) {
        value[key] = Math.abs(e.toFixed(2))
      } else {
        value[key] = null
      }
    },
    // 保存
    async saveOperation(item, value, index) {
      if (value.operation.isEdie) {
        if (!value.supplierLowerAmount) {
          this.$message.warning('请输入供应商寻源保证金最低金额')
          return
        }
        const params = {
          id: value.id,
          depositConfigType: value.depositConfigType,
          supplierType: value.supplierType,
          supplierRatio: value.supplierRatio,
          supplierLowerAmount: value.supplierLowerAmount,
          supplierHighAmount: value.supplierHighAmount
        }
        const result = await updateSupplierSourceDeposit(params)
        if (result.code === '0') {
          this.$message.success(result.message)
          value.operation.isEdie = !value.operation.isEdie
        }
      } else {
        value.operation.isEdie = !value.operation.isEdie
      }
    },
    // 取消
    canceOperation(item, value, index) {
      value.operation.isEdie = !value.operation.isEdie
      this.$refs.supplierMatginTable.refresh(true)
    }
  }
}
</script>
<style lang="less" scoped>
.supplier-title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.right-log:hover {
  color: #ff6b00;
}
.right-log {
  text-align: right;
  cursor: pointer;
}
// .operation {
//   margin: 0px 10px;
//   cursor: pointer;
// }
// .operation:hover {
//   color: #ff6b00;
// }
.operation {
  color: #888;
  cursor: pointer;
  margin-right: 10px;
  color: #ff6b00;
}
/deep/ .ant-modal-body {
  max-height: 600px;
  overflow: scroll;
}
/deep/ .ant-input-number-handler-wrap {
  display: none;
}
.icon {
  color: red;
  margin-right: 4px;
}
</style>
