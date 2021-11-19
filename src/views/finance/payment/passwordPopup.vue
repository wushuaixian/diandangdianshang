<template>
  <a-modal :title="title" :footer="null" :visible="visible" @ok="handleOk" @cancel="handleCancel">
    <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="支付密码" prop="password" v-if="!sendVerificationCode">
        <a-input v-model="password" :maxLength="6" type="password" class="inp1" placeholder="请输入支付密码" /><span
          class="forgetPasswd"
          @click="gopassword"
        >
          忘记密码
        </span>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 20, offset: 6 }" v-if="!sendVerificationCode">
        <a-button type="primary" :loading="buttonLoading" @click="handleOk"> 提交 </a-button>
        <a-button class="passwdClose" @click="handleCancel"> 关闭 </a-button>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>
<script>
// D:\叮当电商\new电商\src\views\finance\payment\supplierPayment\consolidatedPayment.vue
import {
  queryFincePhone,
  // localVerificationCode,
  balanceFirstGetVerificationCode,
  balanceAgainGetVerificationCode
} from '@/api/fince.js'
// import { verifyPassword } from '@/api/invoice'
import { paymentPasswordVerification } from '@/api/fince'
import JSEncrypt from 'jsencrypt'
export default {
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    sceneType: {
      type: Number,
      default: 0
    },
    paymentMethod: {
      type: [String, Number],
      default: ''
    },
    payerType: {
      type: Number,
      default: 0
    },
    orderCode: {
      type: String,
      default: ''
    },
    paymentBalance: {
      type: [String, Number],
      default: ''
    },
    mergePaymentType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      buttonLoading: false,
      title: '支付密码',
      verificationCode: '',
      sendVerificationCode: false,
      sendCodeSec: 0,
      isSandCodeLoading: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      sendCodeInterval: null,
      firstSendCode: false,
      bizOrderNo: '',
      form: {},
      phone: '',
      password: '',
      rules: {
        captchas: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.verificationCode === '') {
                callback(new Error('请输入验证码'))
              } else if (this.verificationCode.length !== 6) {
                callback(new Error('请输入六位验证码'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        password: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.password === '') {
                callback(new Error('请输入密码'))
              } else if (this.password.length !== 6) {
                callback(new Error('请输入六位密码'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  watch: {
    sendVerificationCode: {
      handler(newName, oldName) {
        if (newName) {
          this.title = '短信验证码'
        } else {
          this.title = '支付密码'
        }
      },
      immediate: true
    }
  },
  mounted() {
    queryFincePhone().then((res) => {
      if (res.code === '0') {
        this.phone = res.data + ''
      }
    })
  },
  methods: {
    handleOk() {
      this.$refs.ruleForm.validate((vaild) => {
        if (vaild) {
          this.buttonLoading = true
          const PUBLIC_KEY =
            'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArzvdoYxaE7fYV1xUQS7wHNzoiUDL3XWWq25JbaG33/C7VuUW9PQonUk53bWDByTBN43DnBExyXtzrO3Qnx/lJgtBfJIwL0yRE3BRkXxk+vDB01izYUAWcOOb/ZHMICee5ri7d+8jkwqHBRABue4iP3N7elbMecISPdnaEnGt6gPWpm2NfuSKcYKASaB84oNlO963Hl8Zc0Gcsbi39xXVqUKeWhQBR8bVwotZnsid4ak4a6mN/inmXn7Pd71jTTVOiUYa2FmVGToEaHW6o8JXmMXVBYy6JT7RuNO3NNlt66awR+iNzrjkdEXrJ4L5b1qPZbbtCy2BBrcP4Jmg1i0hnQIDAQAB'
          const encryptor = new JSEncrypt()
          // 设置公钥
          encryptor.setPublicKey(PUBLIC_KEY)
          // 加密数据
          const a = encryptor.encrypt(this.password)
          paymentPasswordVerification({ password: a }).then((res) => {
            if (res.code === '0') {
              if (this.mergePaymentType === 15) {
                this.$emit('close')
                this.$emit('open')
              } else {
                res = balanceFirstGetVerificationCode({
                  sceneType: this.sceneType,
                  frontUrl: 'http://www.baidu.com',
                  paymentMethod: this.paymentMethod,
                  payerType: this.payerType,
                  orderCode: this.orderCode
                }).then((res) => {
                  this.buttonLoading = false
                  this.$router.push({
                    name: 'paymentSuccessful',
                    params: {
                      payeeName: res.data.payeeName,
                      orderCode: res.data.orderCode,
                      realMoney: res.data.paymentAmount,
                      sceneType: res.data.sceneType,
                      paymentMethod: res.data.paymentMethod
                    }
                  })
                })
              }
            } else {
              this.buttonLoading = false
            }
          })
        } else {
        }
      })
    },
    handleCancel() {
      this.$emit('close')
    },
    async SendCode() {
      console.log(this.paymentMethod, this.sceneType, this.payerType, this.orderCode)
      clearInterval(this.sendCodeInterval)
      const that = this
      this.isSandCodeLoading = true
      let res
      if (this.firstSendCode) {
        this.isSandCodeLoading = true
        res = balanceAgainGetVerificationCode({ tradeCode: this.bizOrderNo })
      } else {
        res = balanceFirstGetVerificationCode({
          sceneType: this.sceneType,
          frontUrl: 'http://www.baidu.com',
          paymentMethod: this.paymentMethod,
          payerType: this.payerType,
          orderCode: this.orderCode
        })
      }
      res
        .then((res) => {
          if (!this.firstSendCode) {
            that.bizOrderNo = res.data.bizOrderNo
          }
          that.isSandCodeLoading = false
          if (res.code === '0') {
            that.sendCodeSec = 60
            that.sendCodeInterval = setInterval(function () {
              if (that.sendCodeSec > 0) {
                console.log(that.sendCodeSec)
                that.sendCodeSec--
              } else {
                that.sendCodeSec = 0
                clearInterval(that.sendCodeInterval)
              }
            }, 1000)
            that.firstSendCode = true
          } else {
            that.$message.info('验证码发送失败')
          }
        })
        .catch((error) => {
          console.log(error)
          this.isSandCodeLoading = false
        })
    },
    gopassword() {
      if (this.$hasOpeerate()) {
        this.$router.push({ name: 'SysFinanceSuppliersPaymentManagementTwo' })
      } else {
        this.$router.push({ name: 'FinanceManager' })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.inp {
  width: 95px;
  margin-right: 10px;
}
.forgetPasswd {
  color: #fb6800;
}
.inp1 {
  width: 203px;
  margin-right: 10px;
}
.passwdClose {
  margin-left: 50px;
}
</style>
