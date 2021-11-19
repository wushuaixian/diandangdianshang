<template>
  <div class="bindAccount">
    <div class="content">
      <a-form-model ref="ruleForm1" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules">
        <a-form-model-item label="手机号码" prop="phone">
          <a-input v-model="form.phone" :maxLength="11" placeholder="请输入手机号" />
        </a-form-model-item>
        <a-form-model-item label="验证" prop="">
          <DragVerify ref="verify" :value.sync="isPassing" v-if="dv" width="373" />
        </a-form-model-item>
        <a-form-model-item label="短信验证码" prop="captchas">
          <a-input
            style="width: 223px; margin-right: 10px"
            :maxLength="6"
            v-model="verificationCode"
            placeholder="请输入短信验证码"
          />
          <a-button
            class="code"
            :disabled="sendCodeSec > 0 || !isPassing || !isPhoneRegister"
            @click="SendCode"
            :loading="isSandCodeLoading"
          >
            {{ sendCodeSec > 0 ? sendCodeSec + 's' : '获取验证码' }}</a-button
          >
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 20, offset: 6 }">
          <a-button type="primary" class="next" @click="determine"> 确定 </a-button>
        </a-form-model-item>
        <a-button style="display: flex; margin-left: auto; margin-right: 90px" type="link" @click="GoLogin">
          去登陆
        </a-button>
      </a-form-model>
    </div>
  </div>
</template>
<script>
import { DragVerify } from '@/components/Verify/'
import { checkUserName } from '@/api/user.js'
import { getlocalCode, checkCaptchas, updateMobile } from '@/api/fince.js'
export default {
  components: {
    DragVerify
  },
  data() {
    return {
      form: {},
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      phone: null,
      dv: true,
      verificationCode: '',
      isSandCodeLoading: false,
      sendCodeSec: 0,
      isPassing: false,
      visible: false,
      isPhoneRegister: false,
      rules: {
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: this.validate_mobile, trigger: 'change' }
        ],
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
        ]
      }
    }
  },
  methods: {
    GoLogin() {
      this.$store.dispatch('Logout').then(() => {
        location.href = '/user/login'
      })
    },
    SendCode() {
      // const that = this
      this.isSandCodeLoading = true
      getlocalCode({
        mobile: this.form.phone,
        type: 3
      })
        .then((ret) => {
          this.isSandCodeLoading = false
          // const that = this
          if (ret.code === '0') {
            this.sendCodeSec = 60
            this.sendCodeInterval = setInterval(() => {
              if (this.sendCodeSec > 0) {
                // console.log(that.sendCodeSec)
                this.sendCodeSec--
                this.$forceUpdate()
              } else {
                this.sendCodeSec = 0
                clearInterval(this.sendCodeInterval)
              }
            }, 1000)
          }
        })
        .catch(() => {
          this.isSandCodeLoading = false
        })
    },
    async determine() {
      const vm = this
      this.$refs.ruleForm1.validate(async (valid) => {
        if (valid) {
          const res = await checkCaptchas({
            captchas: vm.verificationCode,
            mobile: vm.form.phone,
            type: 3
          })
          if (res.code !== '0') {
            return
          }
          const result = await updateMobile({
            mobile: vm.form.phone
          })
          if (result.code === '0') {
            vm.$router.push('/')
          }
        }
      })
    },
    validate_mobile(rule, value, callback) {
      const reg = new RegExp(/^[1][3,4,5,6,7,8,9][0-9]{9}$/)
      if (!reg.test(value)) {
        callback(new Error('请填写正确的手机号'))
      } else {
        checkUserName({ mobile: value })
          .then((res) => {
            if (res.code === '0' || res.code === 0) {
              callback()
              this.isPhoneRegister = true
            } else {
              callback(new Error(res.message))
              this.isPhoneRegister = false
            }
          })
          .catch(() => {
            callback(new Error('查询失败'))
            this.isPhoneRegister = false
          })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.bindAccount {
  width: 100%;
  height: 674px;
  background: #ffffff;
  padding: 40px;
  padding-top: 50px;
  .content {
    width: 640px;
    margin: 0 auto;
    .from {
      padding-top: 32px;
    }
    .success {
      text-align: center;
      img {
        margin-bottom: 20px;
      }
      p {
        font-size: 24px;
        color: #262626;
        .btn {
          width: 360px;
          height: 40px;
        }
      }
    }
  }
}
.next {
  width: 70%;
  height: 40px;
}
.code {
  width: 140px;
}
</style>
