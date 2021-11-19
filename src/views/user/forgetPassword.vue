<template>
  <div class="forgetPassword">
    <div class="content">
      <Forgetpasswd1 :index="index" />
      <div class="from">
        <a-form-model
          ref="ruleForm1"
          v-if="index === 0"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="手机号码" prop="mobile">
            <a-input v-model="form.phone" :maxLength="11" has-feedback placeholder="请输入手机号" />
          </a-form-model-item>
          <a-form-model-item label="验证">
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
              {{ sendCodeSec > 0 ? sendCodeSec + '秒后可重发' : '获取验证码' }}
            </a-button>
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ span: 20, offset: 6 }">
            <a-button type="primary" class="next" @click="next1" :disabled="!isPassing"> 下一步 </a-button>
          </a-form-model-item>
        </a-form-model>
        <a-form-model
          v-if="index === 1"
          :rules="rules"
          ref="ruleForm2"
          :model="form"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="设置密码" prop="password1">
            <a-input v-model="form.password1" type="password" placeholder="密码为8-20位需同时包含字母、数字" />
          </a-form-model-item>
          <a-form-model-item label="确认密码" prop="password2">
            <a-input v-model="password2" type="password" placeholder="请再次输入密码" />
          </a-form-model-item>
          <a-form-model-item :wrapper-col="{ span: 20, offset: 6 }">
            <a-button type="primary" class="next" @click="next2"> 下一步 </a-button>
          </a-form-model-item>
        </a-form-model>
        <div class="success" v-if="index === 2">
          <img :src="require('@/assets/images/custom/成功2x.png')" alt="" />
          <p>登录密码更新成功</p>
          <p><a-button class="btn" type="primary" @click="$router.push({ name: 'login' })">重新登录</a-button></p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Forgetpasswd1 from './components/forgetpasswd1'
import { DragVerify } from '@/components/Verify/'
import { checkUserPhone, changeSetPasswd } from '@/api/user'
// checkUserPhone
import { getlocalCode, localVerificationCode } from '@/api/fince.js'
import md5 from 'md5'
export default {
  components: {
    Forgetpasswd1,
    DragVerify
  },
  data() {
    return {
      index: 0,
      form: {
        password1: '',
        phone: ''
      },
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      sendCodeSec: 0,
      password2: '',
      verificationCode: '',
      isSandCodeLoading: false,
      isPhoneRegister: false,
      isCaptchasError: false,
      rules: {
        mobile: [
          {
            required: true,
            validator: (rule, value, callback) => {
              const reg1 = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
              if (this.form.phone === '') {
                callback(new Error('请填写手机号'))
              } else if (!reg1.test(this.form.phone)) {
                callback(new Error('请填写正确的手机号'))
              } else {
                this.checkMobileTimeout = setTimeout(() => {
                  checkUserPhone({ mobile: this.form.phone })
                    .then((ret) => {
                      // if (ret.message === '手机号已注册') {
                      if (ret.code === '0') {
                        this.isPhoneRegister = true
                        callback()
                      } else {
                        this.isPhoneRegister = false
                        callback(new Error('手机号未注册'))
                      }
                    })
                    .catch(() => {
                      callback(new Error('手机号未注册'))
                      this.isPhoneRegister = false
                    })
                }, 1000)
              }
            },
            trigger: 'blur'
          }
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
        ],
        password1: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'change'
          },
          {
            min: 8,
            max: 20,
            message: '请输入最小8位到20位密码',
            trigger: 'change'
          },
          {
            required: true,
            pattern: /^(?![a-zA-z]+$)(?!\d+$)(?![_]+$)[a-zA-Z\d_]+$/,
            message: '密码需要同时包含字母和数字',
            trigger: 'change'
          }
        ],
        password2: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.password2 === '') {
                callback(new Error('请输入密码'))
              }
              if (this.form.password1 !== this.password2) {
                callback(new Error('两次输入的密码不一致'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ]
      },
      isPassing: false,
      dv: true,
      sendCodeInterval: null
    }
  },
  methods: {
    // 获取验证码
    SendCode() {
      if (this.form.phone) {
        if (!this.isPhoneRegister) {
          return this.$message.info('手机号未注册')
        }
        clearInterval(this.sendCodeInterval)
        const that = this
        this.isSandCodeLoading = true
        getlocalCode({
          mobile: this.form.phone,
          type: 4
        })
          .then((ret) => {
            this.isSandCodeLoading = false
            if (ret.code === '0') {
              that.sendCodeSec = 60
              that.sendCodeInterval = setInterval(function () {
                if (that.sendCodeSec > 0) {
                  // console.log(that.sendCodeSec)
                  that.sendCodeSec--
                  that.$forceUpdate()
                } else {
                  this.sendCodeSec = 0
                  clearInterval(that.sendCodeInterval)
                }
              }, 1000)
            } else {
              that.$message.info('验证码发送失败')
            }
          })
          .catch(() => {
            this.isSandCodeLoading = false
          })
      } else {
        this.$message.info('请输入手机号')
      }
    },
    next1() {
      this.$refs.ruleForm1.validate((vaild) => {
        if (vaild) {
          // checkUserName({ mobile: this.phone }).then((res) => {
          //   if (res.message === '手机号已注册') {
          localVerificationCode({ mobile: this.form.phone, captchas: this.verificationCode, type: 4 }).then((res) => {
            if (res.code === '0') {
              this.index = 1
            } else {
              this.$message.error('验证码错误')
            }
          })
        }
      })
    },
    next2() {
      this.$refs.ruleForm2.validate((vaild) => {
        if (vaild) {
          changeSetPasswd({
            mobile: this.form.phone,
            password1: md5(this.form.password1),
            password2: md5(this.form.password1),
            captchas: this.verificationCode,
            verificationSign: md5(this.verificationCode)
          }).then((res) => {
            if (res.code === '0') {
              this.index = 2
            }
          })
        }
      })
      // this.index = 2
    }
  }
}
</script>
<style lang="less" scoped>
.forgetPassword {
  width: 100%;
  height: 674px;
  background: #ffffff;
  padding: 40px;
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
