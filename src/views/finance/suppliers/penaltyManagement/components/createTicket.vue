<template>
  <a-modal title="发起罚款单" width="600px" :visible="visible" @ok="handleOk" @cancel="handleCancel" okText="提交">
    <a-form-model :model="form" ref="ruleForm1" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="付款单位" prop="payerObjName">
        <a-select
          v-if="!isRelaunch"
          style="width: 210px"
          class="input"
          v-model="form.payerObjName"
          show-search
          :default-active-first-option="false"
          :show-arrow="false"
          :notFoundContent="' '"
          :filter-option="false"
          @search="handleSearch"
          placeholder="请输入付款款单位"
          :allowClear="true"
          :getPopupContainer="
            (triggerNode) => {
              return triggerNode.parentNode || document.body
            }
          "
        >
          <a-select-option v-for="(item, index) in searchMerchantLis" :key="index" :value="item">
            {{ item }}
          </a-select-option>
        </a-select>
        <a-input v-model="form.payerObjName" :disabled="true" v-else />
      </a-form-model-item>
      <a-form-model-item label="罚款类型" prop="forfeitType">
        <a-select v-model="form.forfeitType" placeholder="请选择">
          <a-select-option :value="2"> 订单违规罚款</a-select-option>
          <a-select-option :value="3"> 其他罚款 </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="罚款金额" prop="feeAmt">
        <a-input type="number" class="amount" v-model="form.feeAmt" placeholder="请输入罚款金额" /> <span>元</span>
      </a-form-model-item>
      <a-form-model-item label="订单编号" prop="orderCode">
        <a-input v-model="form.orderCode" placeholder="请输入订单编号" />
      </a-form-model-item>
      <a-form-model-item label="罚款说明" prop="description">
        <a-textarea
          placeholder="请输入罚款说明"
          v-model="form.description"
          :auto-size="{
            minRows: 3,
            maxRows: 5
          }"
        />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>
<script>
import { createForfeit, queryCompanyName, resetCreate } from '@/api/fince'
import _ from 'loadsh'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isRelaunch: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    form: {
      handler(val, oldVal) {
        if (this.form.forfeitType === 2) {
          this.rules.orderCode = { required: true, message: '请输入订单编号', trigger: 'change' }
        } else {
          this.rules.orderCode = { required: false, message: '请输入订单编号', trigger: 'change' }
        }
      },
      deep: true
    },
    isRelaunch(v) {
      if (v) {
        this.$set(this.form, 'payerObjName', this.params.payerObjName)
        this.$set(this.form, 'feeAmt', Number(this.params.feeAmt))
        this.$set(this.form, 'forfeitType', this.params.forfeitType)
        this.$set(this.form, 'orderCode', this.params.orderCode)
        this.$set(this.form, 'merchantId', this.params.merchantId)
      } else {
        this.$set(this.form, 'payerObjName', [])
      }
    },
    visible(v) {
      if (v) {
        // queryCompanyName({ likeName: '' }).then((res) => {
        //   if (res.code === '0') {
        //     const list = []
        //     for (let i = 0; i < res.data.length; i++) {
        //       list.push(res.data[i].merchantName)
        //     }
        //     this.searchMerchantLis = new Set(list)
        //     this.serchList = res.data
        //   }
        // })
      }
    }
  },
  data() {
    return {
      disabledOk: true,
      fetching: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      serchList: [],
      form: {
        payerObjName: [],
        feeAmt: null,
        forfeitType: [],
        orderCode: '',
        description: '',
        merchantId: ''
      },
      rules: {
        orderCode: { required: false, message: '请输入订单编号', trigger: 'change' },
        description: { required: true, message: '请输入罚款说明', trigger: 'change' },
        payerObjName: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (Array.isArray(value) || value === undefined) {
                callback(new Error('请选择付款单位'))
              } else if (value.length <= 0) {
                callback(new Error('请选择付款单位'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        feeAmt: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value <= 0) {
                callback(new Error('请输入正确的罚款金额'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        forfeitType: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (Array.isArray(value) || value === undefined) {
                callback(new Error('请选择罚款类型'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ]
      },
      searchMerchantLis: [] // 搜索下拉框值
    }
  },
  mounted() {},
  methods: {
    handleOk() {
      this.$refs.ruleForm1.validate((valid) => {
        if (valid) {
          if (this.disabledOk) {
            this.disabledOk = false
            const data = { ...this.form }
            data.feeAmt = Number(data.feeAmt)
            if (this.isRelaunch) {
              data.payerObjId = this.params.payerObjId
              data.id = this.params.id
              resetCreate({ ...data })
                .then((res) => {
                  this.disabledOk = true
                  if (res.code === '0') {
                    this.handleCancel()
                    this.$message.success('重新发起罚款单成功！')
                    this.$emit('search')
                  }
                })
                .catch(() => {
                  this.disabledOk = true
                })
            } else {
              data.payerObjId = [...this.serchList].find((item) => item.merchantName === data.payerObjName).merchantId
              if (this.form.forfeitType === 2 && !this.form.orderCode) {
                this.$message.error('请输入订单编号')
                return
              }
              createForfeit({ ...data })
                .then((res) => {
                  this.disabledOk = true
                  if (res.code === '0') {
                    this.handleCancel()
                    this.$message.success('创建罚款单成功！')
                    this.$emit('search')
                  }
                })
                .catch(() => {
                  this.disabledOk = true
                })
            }
          }
        } else {
        }
      })
    },
    handleCancel() {
      this.$refs.ruleForm1.resetFields()
      this.$emit('close')
      this.form = {
        payerObjName: [],
        feeAmt: null,
        forfeitType: [],
        orderCode: '',
        description: '',
        merchantId: ''
      }
    },
    handleSearch(settleObjName) {
      if (settleObjName.length === 0) {
        this.searchMerchantLis = []
      }
      if (settleObjName.length < 5) return
      if (!settleObjName.trim()) return
      _.debounce(async () => {
        const res = await queryCompanyName({ likeName: settleObjName })
        if (res.code === '0') {
          const list = []
          for (let i = 0; i < res.data.length; i++) {
            list.push(res.data[i].merchantName)
          }
          this.searchMerchantLis = new Set(list)
          this.serchList = res.data
        }
      }, 1000)()
    }
  }
}
</script>
<style lang="less" scoped>
.amount {
  width: 150px;
  margin-right: 8px;
}
</style>
