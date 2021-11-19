<template>
  <div class="step1">
    <a-form-model :model="form" ref="step1Form" :rules="rules" v-bind="layout">
      <a-form-model-item label="身份选择">
        <a-space :size="20">
          <a class="checks" :class="{ sel: form.userRole === 1 }" @click="form.userRole = 1">
            我要销售
            <div class="yes" v-show="form.userRole === 1">
              <a-icon class="icon" type="check" />
            </div>
          </a>
          <a class="checks" :class="{ sel: form.userRole === 2 }" @click="form.userRole = 2">
            我要采购
            <div class="yes" v-show="form.userRole === 2">
              <a-icon class="icon" type="check" />
            </div>
          </a>
          <a class="checks" :class="{ sel: form.userRole === 3 }" @click="form.userRole = 3">
            两者都是
            <div class="yes" v-show="form.userRole === 3">
              <a-icon class="icon" type="check" />
            </div>
          </a>
        </a-space>
      </a-form-model-item>
      <a-form-model-item label="用户名" has-feedback prop="username">
        <a-input size="large" :maxLength="20" v-model="form.username" placeholder="请输入用户名" />
      </a-form-model-item>
      <a-form-model-item label="手机号" has-feedback prop="mobile">
        <a-input size="large" :maxLength="11" v-model="form.mobile" placeholder="请输入手机号码" />
      </a-form-model-item>
      <a-form-model-item label="验证">
        <DragVerify :value.sync="isPassing" width="370" />
      </a-form-model-item>
      <a-form-model-item class="erro" label="短信验证码" has-feedback prop="captchas">
        <a-space>
          <a-input size="large" style="width: 234px" v-model="form.captchas" placeholder="请输入短信验证码" />
          <a-button
            :disabled="!isPassing || sendCodeSec > 0 || !checkMobile"
            :loading="isSandCodeLoading"
            type="primary"
            size="large"
            style="width: 130px"
            @click="checkMobile && isPassing && SendCode()"
          >
            {{ sendCodeSec > 0 ? sendCodeSec + '秒后可重发' : '获取验证码' }}
          </a-button>
        </a-space>
      </a-form-model-item>
      <a-form-model-item label="设置密码" has-feedback prop="password">
        <a-input size="large" type="password" v-model="form.password" placeholder="密码为8-20位需同时包含字母、数字" />
      </a-form-model-item>
      <a-form-model-item label="确认密码" has-feedback prop="secPassword">
        <a-input size="large" type="password" v-model="form.secPassword" placeholder="请再次输入密码" />
      </a-form-model-item>
      <a-form-model-item label="邀请码">
        <a-input size="large" v-model="form.inviteCode" placeholder="请输入邀请码" />
      </a-form-model-item>
      <div class="agree-box">
        <a-checkbox class="agree" v-model="isAgree" size="small">我已阅读并同意</a-checkbox>
        <div class="agree">
          <a @click="readService">《叮当网站服务协议》</a>
          <a @click="readUserPolicy">《叮当网隐私政策》</a>
        </div>
      </div>
      <a-form-model-item :wrapper-col="{ span: 16, offset: 5 }">
        <a-button
          type="primary"
          block
          size="large"
          html-type="submit"
          @click="Continue('step1Form')"
          :disabled="!isAgree"
        >
          下一步
        </a-button>
      </a-form-model-item>
    </a-form-model>
    <service :visable="serviceVisable" />
    <user-policy :visable="userPolicyVisable" />
  </div>
</template>

<script>
import { DragVerify } from '@/components/Verify/'
import * as userAPI from '@/api/user'
import Service from './service.vue'
import UserPolicy from './userPolicy.vue'
export default {
  components: { DragVerify, Service, UserPolicy },
  data() {
    return {
      checkUserNameTimeout: null,
      checkMobileTimeout: null,
      sendCodeInterval: null,
      checkSMSCodeTimeout: null,
      isPassing: false,
      sendCodeSec: 0,
      isSandCodeLoading: false,
      layout: {
        labelCol: { span: 5 },
        wrapperCol: { span: 16 }
      },
      isAgree: false,
      checkMobile: false,
      form: {
        username: '',
        mobile: '',
        password: '',
        secPassword: '',
        userRole: 1,
        captchas: '',
        inviteCode: ''
      },
      rules: {
        username: [
          {
            required: true,
            validator: (rule, value, callback) => {
              clearTimeout(this.checkUserNameTimeout)
              const reg = /^\w+$/
              var re = new RegExp(/^[a-zA-Z0-9_]{6,20}$/)
              if (value === '') {
                callback(new Error('请填写用户名'))
              } else if (!reg.test(value)) {
                callback(new Error('用户名只支持英文，数字和下划线'))
              } else if (!re.test(value)) {
                callback(new Error('长度在6到20个字符'))
              } else {
                this.checkUserNameTimeout = setTimeout(() => {
                  userAPI
                    .checkUserName({ username: value })
                    .then((ret) => {
                      if (ret.code === '0') {
                        callback()
                      } else {
                        callback(new Error(ret.message))
                      }
                    })
                    .catch(() => {
                      callback(new Error('查询失败'))
                    })
                }, 1000)
              }
            },
            trigger: 'change'
          }
        ],
        mobile: [
          {
            required: true,
            validator: (rule, value, callback) => {
              clearTimeout(this.checkMobileTimeout)

              const reg1 = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
              const vm = this
              if (value === '') {
                callback(new Error('请填写手机号'))
              } else if (!reg1.test(value)) {
                callback(new Error('请填写正确的手机号'))
              } else {
                this.checkMobileTimeout = setTimeout(() => {
                  userAPI
                    .checkUserName({ mobile: value })
                    .then((ret) => {
                      if (ret.code === '0') {
                        vm.checkMobile = true
                        callback()
                      } else {
                        vm.checkMobile = false
                        callback(new Error(ret.message))
                      }
                    })
                    .catch(() => {
                      callback(new Error('查询失败'))
                    })
                }, 1000)
              }
            },
            trigger: 'blur'
          }
        ],
        password: [
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
        secPassword: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入密码'))
              }
              if (value !== this.form.password) {
                callback(new Error('两次输入的密码不一致'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        captchas: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入验证码'))
              } else if (value.length !== 6) {
                callback(new Error('请输入六位验证码'))
              } else {
                callback()
                // clearTimeout(this.checkSMSCodeTimeout)
                // this.checkSMSCodeTimeout = setTimeout(() => {
                //   userAPI
                //     .checkCaptchas(this.form.mobile, value, 2)
                //     .then((ret) => {
                //       if (ret.code === '0') {
                //         callback()
                //       } else {
                //         callback(new Error('验证码错误'))
                //       }
                //     })
                //     .catch(() => {
                //       callback(new Error('查询失败'))
                //     })
                // }, 1000)
              }
            },
            trigger: 'change'
          }
        ]
      },
      serviceVisable: false,
      userPolicyVisable: false
    }
  },
  methods: {
    readService() {
      this.userPolicyVisable = false
      this.serviceVisable = true
      this.$forceUpdate()
    },
    readUserPolicy() {
      this.serviceVisable = false
      this.userPolicyVisable = true
      this.$forceUpdate()
    },
    Continue(formName) {
      if (this.isAgree) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            userAPI
              .checkCaptchas(this.form.mobile, this.form.captchas, 2)
              .then((ret) => {
                if (ret.code === '0') {
                  this.$store.state.register.registerForm = this.form
                  this.$parent.index = 1
                } else {
                  this.$message.error('验证码错误，请重新输入')
                }
              })
              .catch(() => {
                this.$message.error('验证码识别失败')
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else {
        this.$message.error('请阅读并同意服务协议和隐私政策')
      }
    },
    SendCode() {
      clearInterval(this.sendCodeInterval)
      const that = this
      const reg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
      if (reg.test(this.form.mobile)) {
        this.isSandCodeLoading = true
        userAPI
          .sendCaptchas(this.form.mobile, 2)
          .then((ret) => {
            this.isSandCodeLoading = false
            if (ret.code === '0') {
              that.sendCodeSec = 60
              that.sendCodeInterval = setInterval(function () {
                if (that.sendCodeSec > 0) {
                  console.log(that.sendCodeSec)
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
        that.$message.info('请填写正确的手机号')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.step1 {
  .checks {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #d8d8d8;
    position: relative;
    border-radius: 4px;
    height: 38px;
    width: 111px;
    font-size: 14px;
    color: #262626;
    line-height: 18px;
    overflow: hidden;

    &.sel {
      background: #fcf0e6;
      color: #fd6901;
      border-color: #fd6901;
    }

    .yes {
      display: block;
      height: 0px;
      width: 0px;
      position: absolute;
      bottom: -1px;
      right: -1px;
      color: #fff;
      border: 8px solid;
      border-color: transparent #fd6901 #fd6901 transparent;

      .icon {
        position: absolute;
        font-size: 7px;
        top: -1px;
        left: -1px;
        font-weight: bold;
        z-index: 1;
      }
    }
  }

  .agree-box {
    display: flex;
    flex-direction: row;
    margin-left: 116px;
    font-size: 12px;
    color: #6a707d;
    line-height: 16px;
    margin-bottom: 20px;

    .agree {
      font-size: 12px;
    }
  }

  .content {
    overflow: auto;
    padding: 10px 30px;

    .title {
      font-size: 14px;
      color: #262626;
      letter-spacing: 0;
      line-height: 22px;
      font-weight: bold;
      margin-top: 10px;
    }

    .message {
      font-size: 14px;
      color: #666666;
      letter-spacing: 0;
      line-height: 22px;
      margin-top: 8px;
      margin-bottom: 10px;
    }
  }

  .btn-box {
    display: flex;
    align-items: center;
    justify-content: center;

    .btn {
      width: 240px;
    }
  }
}
</style>
<style>
.step1 .erro .ant-form-item-children-icon {
  right: 140px;
}
</style>
