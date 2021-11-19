<template>
  <div>
    <a-card :bordered="false">
      <div class="right-log">
        <span class="right" @click=";[(visible = true), $refs.table.refresh(true)]">查看操作日志</span>
      </div>
      <a-form :form="form">
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="保证金罚扣比例"
        >
          <a-input-number
            :max="100"
            v-decorator="[
              'deductionRatioOfDepositValue',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入正确的保证金罚扣比例',
                    validator: validatorDeductionRatioOfDepositValue
                  }
                ]
              }
            ]"
            placeholder="请输入保证金罚扣比例"
            @blur="changeDeductionRatioOfDepositValue"
          />
          <span class="ant-form-item-children-span">%</span>
        </a-form-item>
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="保证金罚扣天数"
        >
          <a-input-number
            :max="4"
            :step="1"
            v-decorator="[
              'depositRatioDay',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入正确的保证金罚扣天数',
                    validator: validatorDepositRatioDay
                  }
                ]
              }
            ]"
            placeholder="请输入保证金罚扣天数"
            @blur="changeDepositRatioDay"
          />
          <span class="ant-form-item-children-span">天</span>
        </a-form-item>
        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="{ span: 8, offset: 4 }">
          <a-button class="submit-btn" type="primary" @click="submit"> 保存 </a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <!-- 日志弹窗 -->
    <a-modal v-if="visible" title="查看操作日志" :width="800" :visible="visible" @ok="handleOk" @cancel="handleCancel">
      <s-table
        v-if="visible"
        ref="DeductionRatioOfDeposit"
        name="logsTable"
        :columns="columns"
        :data="getList"
        rowKey="id"
        :pagination="true"
        :isCanFilter="false"
        :scroll="{ x: 300, y: 400 }"
      >
        <template slot="createTime" slot-scope="scope">
          <div>{{ scope | moment('YYYY-MM-DD HH:mm:ss') }}</div>
        </template>
      </s-table>
      <template slot="footer">
        <a-button @click="handleCancel">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { findDepositPOIsFK, SaveDepositPOIsFK, selectAllFKLog } from '@/api/configgurationCenter'
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 }
}
export default {
  name: 'DeductionRatioOfDepositIndex',
  data() {
    return {
      deductionRatioOfDepositValue: null,
      formItemLayout,
      form: this.$form.createForm(this, { name: 'dynamic_rule' }),
      visible: false, // 控制弹框
      // getList: [], // 列表数据
      id: null,
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          align: 'center'
        },
        {
          title: '保证金罚扣比例%',
          dataIndex: 'depositPenaltyRatio',
          key: 'depositPenaltyRatio',
          width: 250,
          align: 'center'
        },
        {
          title: '保证金罚扣天数(天)',
          dataIndex: 'depositRatioDay',
          key: 'depositRatioDay',
          width: 250,
          align: 'center'
        },
        {
          title: '操作人',
          dataIndex: 'createUsername',
          key: 'createUsername',
          align: 'center',
          width: 250
        },
        {
          title: '操作时间',
          dataIndex: 'createTime',
          key: 'createTime',
          scopedSlots: { customRender: 'createTime' },
          align: 'center',
          width: 250
        }
      ]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async getList(params) {
      const result = await selectAllFKLog(params)
      result.data.listObj = result.data.data
      result.data.total = result.data?.total
      result.data.listObj.map((item, index) => {
        this.$set(item, 'index', index + 1)
      })
      return result
    },
    // 检验数值大小
    async validatorDeductionRatioOfDepositValue(rule, value, cbfn) {
      if (!value) {
        cbfn(rule.message)
      } else {
        const num = Math.abs(value) * 100
        if (num > 10000 || num < 0) {
          cbfn('请输入0-100的数值')
        }
      }
    },
    async validatorDepositRatioDay(rule, value, cbfn) {
      if (!value) {
        cbfn(rule.message)
      } else {
        const num = Math.abs(value) * 100
        if (num > 400 || num < 0 || num.toString().includes('.')) {
          cbfn('请输入0-4的数值')
        }
      }
    },

    submit() {
      this.form.validateFields(async (err, value) => {
        if (!err) {
          const result = await SaveDepositPOIsFK({
            id: this.id,
            depositPenaltyRatio: value.deductionRatioOfDepositValue,
            depositRatioDay: value.depositRatioDay
          })
          if (result.code === '0') {
            this.$message.success(result.message || '保存成功')
          }
        }
      })
    },
    // 点击确认
    handleOk() {
      this.visible = false
    },
    // 关闭弹窗
    handleCancel() {
      this.visible = false
    },
    changeDeductionRatioOfDepositValue(value) {
      if (!value.target.value) return
      this.form.setFieldsValue({ deductionRatioOfDepositValue: Math.abs(value.target.value.slice(0, 5)).toFixed(2) })
    },
    changeDepositRatioDay(value) {
      if (!value.target.value) return
      this.form.setFieldsValue({ depositRatioDay: Math.ceil(value.target.value) })
    },
    async init() {
      const { data } = await findDepositPOIsFK()
      this.id = data.id
      this.form.setFieldsValue({
        deductionRatioOfDepositValue: data.depositPenaltyRatio,
        depositRatioDay: data.depositRatioDay
      })
    }
  }
}
</script>
<style lang="less" scoped>
.submit-btn {
  margin-top: 10px;
}
/deep/ .ant-form-item-children {
  white-space: nowrap;
  .ant-form-item-children-span {
    margin-left: 5px;
  }
}
.right-log:hover {
  color: #ff6b00;
}
.right-log {
  text-align: right;
  cursor: pointer;
}
/deep/ .ant-input-number {
  display: inline-block;
  width: 200px;
}
/deep/ .ant-modal-body {
  max-height: 600px;
  overflow: scroll;
}
/deep/ .ant-input-number-handler-wrap {
  display: none;
}
</style>
