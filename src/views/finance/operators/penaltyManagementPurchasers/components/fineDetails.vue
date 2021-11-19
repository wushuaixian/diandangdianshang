<template>
  <a-modal title="罚款单详情" width="600px" :footer="null" :visible="visible" @cancel="handleCancel">
    <a-form-model :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="罚款单编号" prop="name">
        <a-input v-model="form.forfeitBillCode" :disabled="true" />
      </a-form-model-item>
      <a-form-model-item label="罚款类型">
        <a-select :disabled="true" v-model="params.forfeitType" placeholder="请选择">
          <a-select-option :value="1"> 平台违约罚款</a-select-option>
          <a-select-option :value="2"> 订单违约罚款 </a-select-option>
          <a-select-option :value="3"> 其他罚款 </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="发起单位">
        <a-input v-model="params.merchantName" :disabled="true" />
      </a-form-model-item>
      <a-form-model-item label="付款单位">
        <a-input v-model="params.payerObjName" :disabled="true" />
      </a-form-model-item>
      <a-form-model-item label="罚款金额">
        <a-input
          type="number"
          :disabled="params.billStatus !== 2 || params.initiator === 0"
          class="amount"
          v-model="form.feeAmt"
          placeholder="请输入罚款金额"
        />
        <span>元</span>
      </a-form-model-item>
      <a-form-model-item label="罚款状态">
        <a-select :disabled="true" v-model="form.billStatus" placeholder="请选择">
          <a-select-option v-for="item in fineStatus" :value="item.value" :key="item.value">
            {{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="发起日期">
        <a-input v-model="form.createTime" :disabled="true" />
      </a-form-model-item>
      <a-form-model-item label="订单编号">
        <a-input v-model="form.orderCode" :disabled="params.billStatus !== 2 || params.initiator === 0" />
      </a-form-model-item>
      <a-form-model-item
        label="应付单号"
        v-if="params.billStatus === 6 || (params.billStatus === 4 && params.initiator === 1)"
      >
        <a-input v-model="form.feeBillCode" :disabled="true" />
      </a-form-model-item>
      <a-form-model-item
        label="付款单号"
        v-if="params.billStatus === 6 || (params.billStatus === 4 && params.initiator === 1)"
      >
        <a-input v-model="form.paymentBillCode" :disabled="true" />
      </a-form-model-item>
      <a-form-model-item
        label="收款单号"
        v-if="(params.billStatus === 7 || params.billStatus === 4) && params.initiator === 0"
      >
        <a-input v-model="form.receiptBillCode" :disabled="true" />
      </a-form-model-item>
      <a-form-model-item v-if="params.billStatus === 2" label="拒绝原因">
        <a-input v-model="form.remark" :disabled="true" />
      </a-form-model-item>
      <a-form-model-item label="罚款说明">
        <a-textarea
          :disabled="!(params.initiator === 1 && params.billStatus === 2)"
          v-model="form.description"
          placeholder="请输入罚款说明"
          :auto-size="{
            minRows: 3,
            maxRows: 5
          }"
        />
      </a-form-model-item>
    </a-form-model>
    <div v-if="params.initiator === 1 && params.billStatus === 2" class="return">
      <a-button @click="relaunch">重新发起</a-button>
      <!-- <a-button class="left">申请平台仲裁</a-button> -->
      <a-button @click="handleCancel" class="left">返回</a-button>
    </div>
    <div v-else class="return">
      <a-button v-if="params.billStatus === 7" class="right" type="primary">执行罚款</a-button>
      <a-button @click="examine" v-if="params.billStatus === 1 && params.initiator === 0" class="right">审核</a-button>
      <a-button @click="handleCancel">返回</a-button>
    </div>
  </a-modal>
</template>
<script>
import { fineStatus } from '@/config/constant'
import { resetCreate } from '@/api/fince'
export default {
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // initiator: {
    //   type: Number,
    //   default: 1 // 0是对方发起 1是我 方发起
    // },
    // billStatus: {
    //   type: Number,
    //   default: 4 // 1待确认 2已拒绝 3待支付 4已完成  5重新发起  6待仲裁  7已仲裁
    // },
    params: {
      type: Object,
      default: () => {
        return {
          initiator: 1,
          billStatus: 1
        }
      }
    }
  },
  watch: {
    visible(v) {
      if (v) {
        this.form = { ...this.params }
        this.$set(this.form, 'createTime', this.format(this.params.createTime))
      }
    }
  },
  data() {
    return {
      fineStatus,
      fineExamineVisible: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      form: {
        ...this.params
      },
      rules: {
        name: { required: true, message: '请输入付款单位', trigger: 'blur' }
      }
    }
  },
  mounted() {
    console.log(this.params)
  },
  methods: {
    format(shijianchuo) {
      var time = new Date(shijianchuo)
      var y = time.getFullYear()
      var m = time.getMonth() + 1
      var d = time.getDate()
      var h = time.getHours()
      var mm = time.getMinutes()
      var s = time.getSeconds()
      return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s
    },
    handleOk() {},
    handleCancel() {
      this.$emit('close')
    },
    relaunch() {
      console.log(this.params)
      const params = {
        payerObjName: this.params.payerObjName,
        payerObjId: this.params.payerObjId,
        feeAmt: this.form.feeAmt,
        orderCode: this.form.orderCode,
        remark: this.form.remark,
        description: this.form.description,
        id: this.params.id,
        createType: 0,
        forfeitType: this.params.forfeitType,
        merchantId: this.params.merchantId
      }
      resetCreate({ ...params }).then((res) => {
        if (res.code === '0') {
          this.$message.success('重新发起成功')
          this.handleCancel()
          this.$parent.search()
        }
      })
    },
    examine() {
      console.log(1)
      this.$emit('examine', this.params.id)
    }
  }
}
</script>
<style lang="less" scoped>
.amount {
  width: 150px;
  margin-right: 8px;
}
.return {
  text-align: center;
}
.left {
  margin-left: 10px;
}
.right {
  margin-right: 10px;
}
</style>
