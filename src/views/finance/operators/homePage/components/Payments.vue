<template>
  <div>
    <a-modal okText="下一步" v-model="visible" title="基本信息" @ok="nextStep">
      <a-row>
        <a-col :span="24">
          <h3>
            你已缴纳的平台保证金总额<span>{{
              this.all.depositBalance ? this.all.depositBalance : 0 | formatCurrency(2, true)
            }}</span
            >元,保证金类目基准金额<span>{{
              this.all.depositUperAmount ? this.all.depositUperAmount : 0 | formatCurrency(2, true)
            }}</span
            >元
          </h3>
        </a-col>
      </a-row>
      <a-row id="Withdrawal">
        <a-row class="inputs">
          <a-col :span="16">
            <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-form-model-item label="缴纳金额">
                <a-input
                  oninput="value=value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.').replace(/\.{2,}/g,'.').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
                  v-model="form.feeAmt"
                  @change="vonchange"
                />
              </a-form-model-item>
            </a-form-model>
          </a-col>
          <a-col class="montext" :span="7">元</a-col>
        </a-row>
        <a-row>
          <a-col :span="4">收款单位:</a-col>
          <a-col :span="20">叮当(天津)电子商务有限公司</a-col>
        </a-row>
        <a-row>
          <a-col :span="4">付款发起人:</a-col>
          <a-col :span="20">{{ this.all.initiator ? this.all.initiator : '' }}</a-col>
        </a-row>
      </a-row>
    </a-modal>
    <a-modal okText="立即前往" v-model="visibles" title="缴纳保证金" @ok="nextSteps">
      <a-row>已成功为您创建应付单,请前往<span id="go">应付单管理</span>查看</a-row>
    </a-modal>
    <a-modal okText="立即前往" v-model="avisible" title="缴纳保证金" @ok="anextStep">
      <a-row>您的保证金将超<span style="color: #ff6b00">保证金类目基准金额</span>是否确认提交</a-row>
    </a-modal>
  </div>
</template>

<script>
import { depositAndDepositUper, feeCreate } from '@/api/invoice.js'
import JSEncrypt from 'jsencrypt'
import md5 from 'md5'
// import { Base64 } from 'js-base64'
export default {
  data() {
    return {
      visible: false,
      visibles: false,
      avisible: false,
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
      form: {
        type: '13',
        feeAmt: '',
        nonceStr: '',
        timestamp: '',
        sign: ''
      },
      all: '',
      newstring: ''
    }
  },
  methods: {
    vonchange(e) {
      console.log(e)
    },
    anextStep() {
      this.visibles = true
    },
    nextSteps() {
      this.$router.push({ name: 'SupplierPayableManage' })
    },
    nextStep() {
      if (this.form.feeAmt) {
        this.form.timestamp = Date.parse(new Date())
        this.form.nonceStr = this.randomString()
        const PUBLIC_KEY =
          'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArzvdoYxaE7fYV1xUQS7wHNzoiUDL3XWWq25JbaG33/C7VuUW9PQonUk53bWDByTBN43DnBExyXtzrO3Qnx/lJgtBfJIwL0yRE3BRkXxk+vDB01izYUAWcOOb/ZHMICee5ri7d+8jkwqHBRABue4iP3N7elbMecISPdnaEnGt6gPWpm2NfuSKcYKASaB84oNlO963Hl8Zc0Gcsbi39xXVqUKeWhQBR8bVwotZnsid4ak4a6mN/inmXn7Pd71jTTVOiUYa2FmVGToEaHW6o8JXmMXVBYy6JT7RuNO3NNlt66awR+iNzrjkdEXrJ4L5b1qPZbbtCy2BBrcP4Jmg1i0hnQIDAQAB'
        const encryptor = new JSEncrypt()
        // 设置公钥
        encryptor.setPublicKey(PUBLIC_KEY)
        // 加密数据
        const signs = encryptor.encrypt(
          md5(
            String(
              `feeAmt=${this.form.feeAmt}&nonceStr=${this.form.nonceStr}&timestamp=${this.form.timestamp}&type=${this.form.type}`
            )
          )
        )
        this.form.sign = signs
        this.feeCreate(this.form)
        if (this.all.depositBalance + this.form.feeAmt > this.all.depositUperAmount) {
          this.avisible = true
        } else {
          this.visible = false
        }
      }
    },
    randomString() {
      var str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
      var result = ''
      for (var i = 17; i > 0; --i) result += str[Math.floor(Math.random() * str.length)]
      return result
    },
    async depositAndDepositUper() {
      try {
        const data = await depositAndDepositUper()
        if (data.code === '0') {
          const newData = JSON.parse(JSON.stringify(data))
          console.log(this.all)
          this.all = newData.data
        }
      } catch (err) {
        console.log(err)
      }
    },
    async feeCreate(text) {
      try {
        const data = await feeCreate(text)
        console.log(this.all.depositBalance + this.form.feeAmt)
        if (data.code === '0' && this.all.depositBalance + this.form.feeAmt < this.all.depositUperAmount) {
          this.visibles = true
        }
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    }
  },
  mounted() {
    this.depositAndDepositUper()
  }
}
</script>

<style lang="less" scoped>
#Withdrawal {
  line-height: 50px;
  .inputs {
    margin-left: -30px;
  }
  .montext {
    margin-top: -5px;
    margin-left: -50px;
  }
  #success {
    color: red;
    margin-left: 30px;
  }
}
#go {
  color: #38f;
}
</style>
