<template>
  <a-modal :title="title" :destroyOnClose="true" :visible="visible" @cancel="handleCancel" :footer="null">
    <!-- 绑定手机号 -->
    <a-form-model
      v-if="statusNum == 1 || statusNum == 11"
      ref="ruleForm1"
      :rules="rules"
      :model="form1"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="手机号码" prop="mobile">
        <a-input v-model="phone" :disabled="statusNum === 11" placeholder="请输入手机号" />
      </a-form-model-item>
      <a-form-model-item label="验证码" prop="captchas">
        <a-input style="width: 150px" :maxLength="6" v-model="verificationCode" placeholder="请输入短信验证码" />
        <a-button class="code" :disabled="sendCodeSec > 0" @click="SendCode('绑定手机号')" :loading="isSandCodeLoading">
          {{ sendCodeSec > 0 ? sendCodeSec + '秒后可重发' : '获取验证码' }}
        </a-button>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 20, offset: 10 }">
        <a-button type="primary" @click="bindingMobilePhone"> 提交 </a-button>
      </a-form-model-item>
    </a-form-model>
    <div class="successReturn" v-if="statusNum == 0">
      <p>{{ text }}</p>
      <p>
        <span>{{ countDown }}秒后返回</span>
      </p>
    </div>
    <!-- 设置支付密码 -->
    <a-form-model
      v-if="statusNum == 2"
      ref="ruleForm2"
      :model="form2"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="支付密码">
        <a-input
          :maxLength="6"
          type="password"
          v-model="form2.password1"
          oninput="value=value.replace(/[^\d]/g,'')"
          placeholder="请输入6位数字密码"
        />
      </a-form-model-item>
      <a-form-model-item label="确认支付密码" prop="password2">
        <a-input
          type="password"
          v-model="form2.password2"
          oninput="value=value.replace(/[^\d]/g,'')"
          :maxLength="6"
          placeholder="请再次输6位数字密码"
        />
      </a-form-model-item>
      <a-form-model-item label="手机号码"> {{ getPhone }} </a-form-model-item>
      <a-form-model-item label="验证码" prop="captchas">
        <a-input
          style="width: 150px"
          oninput="value=value.replace(/[^\d]/g,'')"
          :maxLength="6"
          v-model="verificationCode"
          placeholder="请输入短信验证码"
        />
        <a-button
          class="code"
          :disabled="sendCodeSec > 0"
          @click="SendCodeLocal(getPhone)"
          :loading="isSandCodeLoading"
        >
          {{ sendCodeSec > 0 ? sendCodeSec + '秒后可重发' : '获取验证码' }}
        </a-button>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 20, offset: 10 }">
        <a-button type="primary" @click="submitPaymentPassword(form2.password2)"> 提交 </a-button>
      </a-form-model-item>
    </a-form-model>
    <!-- 绑定手机授权申请 -->
    <a-form-model
      ref="ruleForm3"
      v-if="statusNum == 3"
      :rules="rules"
      :model="form3"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="手机号码" prop="mobile">
        <a-input v-model="phone" placeholder="请输入手机号" />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 20, offset: 4 }">
        <div class="uploadBox">
          <s-upload
            v-model="fileUrl"
            action="/api/back-manage-web/media/uploadFile"
            name="Filedata"
            class="supload"
            list-type="picture"
          >
            <a-button style="width: 152px"> <a-icon type="upload" /> 上传变更函 </a-button>
          </s-upload>
          <a-button @click.stop="templateDownload" style="margin-left: 20px">
            <a-icon type="download" />变更函模板下载
          </a-button>
          <!-- <button @click="$refs.file.click()">上传</button>
          <input type="file" ref="file" @change="xx" /> -->
        </div>
      </a-form-model-item>

      <a-form-model-item :wrapper-col="{ span: 20, offset: 10 }">
        <a-button type="primary" @click="rebalancingApplication"> 提交 </a-button>
      </a-form-model-item>
    </a-form-model>
    <!-- 重新绑定手机号 -->
    <a-form-model
      v-if="statusNum == 4"
      ref="ruleForm"
      :model="form4"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="手机号码">
        <span>{{ phone }}</span>
      </a-form-model-item>
      <a-form-model-item label="验证码" prop="captchas">
        <a-input style="width: 150px" v-model="verificationCode" placeholder="请输入短信验证码" />
        <a-button class="code">获取验证码</a-button>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 20, offset: 10 }">
        <a-button type="primary" @click="bindingMobilePhone"> 提交 </a-button>
      </a-form-model-item>
    </a-form-model>
    <!-- 解绑手机号 -->
    <a-form-model
      v-if="statusNum == 5"
      :rules="rules"
      ref="ruleForm5"
      :model="form5"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="原绑定手机号码">
        <!-- <a-input v-model="phone" placeholder="请输入手机号" /> -->
        {{ getPhone }}
      </a-form-model-item>
      <a-form-model-item label="验证码" prop="captchas">
        <a-input style="width: 150px" v-model="verificationCode" placeholder="请输入短信验证码" />
        <a-button class="code" :disabled="sendCodeSec > 0" @click="SendCode(UNBNID_PHONE)" :loading="isSandCodeLoading">
          {{ sendCodeSec > 0 ? sendCodeSec + '秒后可重发' : '获取验证码' }}
        </a-button>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 20, offset: 10 }">
        <a-button type="primary" @click="UnbindingMobilePhone"> 提交验证 </a-button>
      </a-form-model-item>
    </a-form-model>
    <!-- 找回密码 -->
    <!-- 1绑定手机信息 -->
    <a-form-model
      v-if="statusNum == 6"
      :rules="rules"
      ref="ruleForm6"
      :model="form6"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="手机号码"> {{ getPhone }} </a-form-model-item>
      <a-form-model-item label="验证码" prop="captchas">
        <a-input
          style="width: 150px"
          v-model="verificationCode"
          oninput="value=value.replace(/[^\d]/g,'')"
          :maxLength="6"
          placeholder="请输入短信验证码"
        />
        <a-button
          class="code"
          :disabled="sendCodeSec > 0"
          @click="SendCodeLocal(getPhone)"
          :loading="isSandCodeLoading"
        >
          {{ sendCodeSec > 0 ? sendCodeSec + '秒后可重发' : '获取验证码' }}
        </a-button>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 20, offset: 10 }">
        <a-button type="primary" @click="nextStep"> 下一步 </a-button>
      </a-form-model-item>
    </a-form-model>
    <!-- 2 修改密码 -->
    <a-form-model
      v-if="statusNum == 8"
      ref="ruleForm8"
      :rules="rules"
      :model="form6"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="新支付密码">
        <a-input
          :maxLength="6"
          type="password"
          v-model="form7.password1"
          oninput="value=value.replace(/[^\d]/g,'')"
          placeholder="请输入6位数字密码"
        />
      </a-form-model-item>
      <a-form-model-item label="确认支付密码" prop="password5">
        <a-input
          type="password"
          v-model="form7.password2"
          oninput="value=value.replace(/[^\d]/g,'')"
          :maxLength="6"
          placeholder="请再次输6位数字密码"
        />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 20, offset: 10 }">
        <a-button type="primary" @click="RetrieveChangePasswd(form7.password2)"> 提交 </a-button>
      </a-form-model-item>
    </a-form-model>
    <!-- 修改支付密码 -->
    <a-form-model
      v-if="statusNum == 7"
      ref="ruleForm7"
      :model="form7"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="原支付密码">
        <a-input
          :maxLength="6"
          type="password"
          v-model="form7.password"
          oninput="value=value.replace(/[^\d]/g,'')"
          placeholder="请输入6位数字密码"
        />
      </a-form-model-item>
      <a-form-model-item label="新支付密码">
        <a-input
          :maxLength="6"
          type="password"
          v-model="form7.password1"
          oninput="value=value.replace(/[^\d]/g,'')"
          placeholder="请输入6位数字密码"
        />
      </a-form-model-item>
      <a-form-model-item label="确认支付密码" prop="password5">
        <a-input
          type="password"
          v-model="form7.password2"
          oninput="value=value.replace(/[^\d]/g,'')"
          :maxLength="6"
          placeholder="请再次输6位数字密码"
        />
      </a-form-model-item>
      <a-form-model-item label="手机号码">
        {{ getPhone }}
      </a-form-model-item>
      <a-form-model-item label="验证码" prop="captchas">
        <a-input
          style="width: 150px"
          oninput="value=value.replace(/[^\d]/g,'')"
          :maxLength="6"
          v-model="verificationCode"
          placeholder="请输入短信验证码"
        />
        <a-button class="code" @click="SendCodeLocal(getPhone)" :loading="isSandCodeLoading">
          {{ sendCodeSec > 0 ? sendCodeSec + '秒后可重发' : '获取验证码' }}
        </a-button>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 20, offset: 10 }">
        <a-button type="primary" @click="submitChangePassword"> 提交 </a-button>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>
<script>
import {
  getCode,
  bindingMobilePhone,
  getlocalCode,
  // localVerificationCode,
  setPaymentPassword,
  // checkCaptchas,
  ChangePassword,
  UnbindingMobilePhone,
  rebalancingApplication,
  rebalancePhone,
  sendPaymentPwdCode,
  checkPaymentPwdCode,
  getrebalancePhone
} from '@/api/fince.js'
import JSEncrypt from 'jsencrypt'
// import axios from 'axios'
import { BIND_PHONE, UNBNID_PHONE } from '@/config/constant'
export default {
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    statusNum: {
      type: Number,
      default: 5
    },
    getPhone: {
      type: String,
      default: ''
    },
    stop: {
      type: String,
      default: ''
    }
  },
  watch: {
    statusNum(val) {
      this.sendCodeSec = 0
      if (val === 1 || val === 11) {
        this.title = '设置绑定手机'
      } else if (val === 2) {
        this.title = '设置支付密码'
      } else if (val === 3) {
        this.title = '绑定手机授权申请'
      } else if (val === 4) {
        this.title = '设置绑定手机'
      } else if (val === 5) {
        this.title = '解绑手机号'
      } else if (val === 6) {
        this.title = '密码找回'
      } else if (val === 7) {
        this.title = '修改支付密码'
      }
      if (val === 11) {
        getrebalancePhone().then((res) => {
          if (res.code === '0') {
            this.phone = res.data
          }
        })
      }
    }
  },
  data() {
    return {
      fileList: null,
      UploadId: '',
      fileUrl: '',
      BIND_PHONE,
      UNBNID_PHONE,
      phone: '',
      verificationCode: '',
      title: '设置绑定手机',
      passwordTitle: '设置支付密码',
      phoneNumberTitle: '设置绑定手机',
      AuthorizationApplication: '绑定手机授权申请',
      sendCodeSec: 0,
      isSandCodeLoading: false,
      sendCodeInterval: null,
      cleanTime: null,
      text: '',
      texts: [
        '手机号绑定成功',
        '支付密码设置成功',
        '授权申请已提交成功，请关注支付管理页面审核结果，审核通过后绑定手机号',
        '手机号绑定成功',
        '手机号码解绑成功',
        '支付密码修改成功'
      ],
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      countDown: 5,
      form1: {},
      form2: {
        password1: '',
        password2: '',
        captchas: ''
      },
      form3: {},
      form4: {},
      form5: {},
      form6: {},
      form7: {
        password: '',
        password1: '',
        password2: ''
      },
      rules: {
        password5: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.form7.password2 === '') {
                callback(new Error('请输入密码'))
              }
              if (this.form7.password2 !== this.form7.password1) {
                callback(new Error('两次输入的密码不一致'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        password2: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入密码'))
              }
              if (value !== this.form2.password1) {
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
        mobile: [
          {
            required: true,
            validator: (rule, value, callback) => {
              const reg1 = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
              if (this.phone === '') {
                callback(new Error('请填写手机号'))
              } else if (!reg1.test(this.phone)) {
                callback(new Error('请填写正确的手机号'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        passwordLength: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.value.length > 6) {
                callback(new Error('请填写6位密码'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    handleOk() {},
    // xx(e) {
    //   console.log()
    //   var file = new FormData()
    //   file.append('Filedata', this.$refs.file.files[0])
    //   axios.post('/api/back-manage-web/media/uploadFile', file)
    // },
    onSubmit() {
      this.cleanTime = setInterval(() => {
        this.countDown--
        if (this.countDown <= 0) {
          clearInterval(this.cleanTime)
          this.handleCancel()
        }
      }, 1000)
    },
    handleCancel() {
      const that = this
      this.$emit('close')
      clearInterval(this.cleanTime)
      setTimeout(() => {
        that.countDown = 5
        that.phone = ''
        that.fileUrl = ''
        that.verificationCode = ''
        that.sendCodeSec = 0
      }, 1000)
    },
    uploadChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    },
    // 获取验证码
    SendCode(verificationCode) {
      clearInterval(this.sendCodeInterval)
      const that = this
      // const reg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
      // if (reg.test(this.phone)) {
      this.isSandCodeLoading = true
      let phone
      if (this.statusNum === 1 || this.statusNum === 11) {
        phone = this.phone
      } else {
        phone = this.getPhone + ''
      }
      getCode({
        verificationCode,
        phone
      })
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
      // } else {
      // that.$message.info('请填写正确的手机号')
      // }
    },
    // 非通联二维码
    SendCodeLocal(val) {
      clearInterval(this.sendCodeInterval)
      const that = this
      const reg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
      if (reg.test(this.getPhone)) {
        this.isSandCodeLoading = true
        let res
        if (this.statusNum === 7 || this.statusNum === 6 || this.statusNum === 2) {
          res = sendPaymentPwdCode({ mobile: val, type: 62 })
        } else {
          res = getlocalCode({
            // mobile: that.getPhone,
            mobile: val,
            type: 5
          })
        }

        res
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
    },
    // 绑定手机号
    bindingMobilePhone() {
      const that = this
      this.$refs.ruleForm1.validate((valid) => {
        if (valid) {
          console.log(this.statusNum)
          if (this.statusNum === 11) {
            rebalancePhone({
              verificationCode: this.verificationCode,
              phone: this.phone
            }).then((res) => {
              if (res.code === '0') {
                that.text = this.texts[0]
                that.$emit('resetStatus', 0)
                console.log(that.stop)
                that.onSubmit()
              }
            })
          } else {
            bindingMobilePhone({
              verificationCode: this.verificationCode,
              phone: this.phone
            }).then((res) => {
              if (res.code === '0') {
                that.text = this.texts[0]
                that.$emit('resetStatus', 0)
                if (that.stop !== 'stop') {
                  that.onSubmit()
                } else {
                  this.verificationCode = ''
                }
              }
            })
          }
        } else {
          console.log('false')
        }
      })
    },
    // 设置支付密码
    submitPaymentPassword(val) {
      const that = this
      this.$refs.ruleForm2.validate((valid) => {
        if (valid) {
          // ***** 这里的手机为 this.getPhone
          checkPaymentPwdCode({ mobile: this.getPhone, captchas: this.verificationCode, type: 62 }).then((res) => {
            if (res.code === '0') {
              const PUBLIC_KEY =
                'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArzvdoYxaE7fYV1xUQS7wHNzoiUDL3XWWq25JbaG33/C7VuUW9PQonUk53bWDByTBN43DnBExyXtzrO3Qnx/lJgtBfJIwL0yRE3BRkXxk+vDB01izYUAWcOOb/ZHMICee5ri7d+8jkwqHBRABue4iP3N7elbMecISPdnaEnGt6gPWpm2NfuSKcYKASaB84oNlO963Hl8Zc0Gcsbi39xXVqUKeWhQBR8bVwotZnsid4ak4a6mN/inmXn7Pd71jTTVOiUYa2FmVGToEaHW6o8JXmMXVBYy6JT7RuNO3NNlt66awR+iNzrjkdEXrJ4L5b1qPZbbtCy2BBrcP4Jmg1i0hnQIDAQAB'
              const encryptor = new JSEncrypt()
              // 设置公钥
              encryptor.setPublicKey(PUBLIC_KEY)
              // 加密数据
              const a = encryptor.encrypt(val)
              setPaymentPassword({ paysecret: a }).then((res) => {
                if (res.code === '0') {
                  that.text = this.texts[1]
                  that.$emit('resetStatus', 0)
                  that.onSubmit()
                }
              })
            }
          })
        }
      })
    },
    // 提交修改密码
    submitChangePassword() {
      const that = this
      this.$refs.ruleForm7.validate((valid) => {
        if (valid) {
          // ***** 这里的手机为 this.getPhone
          checkPaymentPwdCode({ mobile: this.getPhone, captchas: this.verificationCode, type: 62 }).then((res) => {
            if (res.code === '0') {
              const PUBLIC_KEY =
                'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArzvdoYxaE7fYV1xUQS7wHNzoiUDL3XWWq25JbaG33/C7VuUW9PQonUk53bWDByTBN43DnBExyXtzrO3Qnx/lJgtBfJIwL0yRE3BRkXxk+vDB01izYUAWcOOb/ZHMICee5ri7d+8jkwqHBRABue4iP3N7elbMecISPdnaEnGt6gPWpm2NfuSKcYKASaB84oNlO963Hl8Zc0Gcsbi39xXVqUKeWhQBR8bVwotZnsid4ak4a6mN/inmXn7Pd71jTTVOiUYa2FmVGToEaHW6o8JXmMXVBYy6JT7RuNO3NNlt66awR+iNzrjkdEXrJ4L5b1qPZbbtCy2BBrcP4Jmg1i0hnQIDAQAB'
              const encryptor = new JSEncrypt()
              // 设置公钥
              encryptor.setPublicKey(PUBLIC_KEY)
              // 加密数据
              const a = encryptor.encrypt(this.form7.password)
              const b = encryptor.encrypt(this.form7.password2)
              ChangePassword({ oldSecret: a, paysecret: b }).then((res) => {
                if (res.code === '0') {
                  that.text = this.texts[5]
                  that.$emit('resetStatus', 0)
                  that.onSubmit()
                }
              })
            }
          })
        } else {
          console.log('faile')
        }
      })
    },
    // 解绑手机
    // UnbindingMobilePhone() {
    //   const that = this
    //   this.$refs.ruleForm5.validate((valid) => {
    //     if (valid) {
    //       console.log('success')
    //       console.log(valid)
    //       checkCaptchas({
    //         captchas: this.verificationCode,
    //         mobile: that.phone,
    //         type: 5
    //       }).then((res) => {
    //         if (res.code === '0') {
    //           UnbindingMobilePhone({
    //             verificationCode: this.verificationCode,
    //             phone: this.phone
    //           }).then((res) => {
    //             if (res.code === '0') {
    //               that.text = this.texts[1]
    //               that.$emit('resetStatus', 0)
    //               that.onSubmit()
    //             }
    //           })
    //         }
    //       })
    //     } else {
    //       console.log('false')
    //     }
    //   })
    async UnbindingMobilePhone() {
      const { verificationCode } = this
      const res = await UnbindingMobilePhone({ verificationCode, phone: this.getPhone })
      if (res.code === '0') {
        this.$message.success('解绑成功')
        this.$emit('resetStatus', 0)
        this.onSubmit()
      }
    },
    //  重绑手机号申请
    rebalancingApplication() {
      this.$refs.ruleForm3.validate((validate) => {
        if (validate) {
          const that = this
          rebalancingApplication({
            authorizationUrl: this.fileUrl,
            changePhone: this.phone
          }).then((res) => {
            console.log(res)
            if (res.code === '0') {
              that.text = this.texts[2]
              this.$emit('resetStatus', 0)
              that.onSubmit()
            }
          })
        }
      })
    },
    // 找回密码
    nextStep() {
      this.$refs.ruleForm6.validate((validate) => {
        if (validate) {
          checkPaymentPwdCode({ mobile: this.getPhone, captchas: this.verificationCode, type: 62 }).then((res) => {
            if (res.code === '0') {
              this.$emit('resetStatus', 8)
              this.text = this.texts[7]
            }
          })
        } else {
          console.log('faild')
        }
      })
    },
    RetrieveChangePasswd(val) {
      const that = this
      this.$refs.ruleForm8.validate((validate) => {
        if (validate) {
          const PUBLIC_KEY =
            'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArzvdoYxaE7fYV1xUQS7wHNzoiUDL3XWWq25JbaG33/C7VuUW9PQonUk53bWDByTBN43DnBExyXtzrO3Qnx/lJgtBfJIwL0yRE3BRkXxk+vDB01izYUAWcOOb/ZHMICee5ri7d+8jkwqHBRABue4iP3N7elbMecISPdnaEnGt6gPWpm2NfuSKcYKASaB84oNlO963Hl8Zc0Gcsbi39xXVqUKeWhQBR8bVwotZnsid4ak4a6mN/inmXn7Pd71jTTVOiUYa2FmVGToEaHW6o8JXmMXVBYy6JT7RuNO3NNlt66awR+iNzrjkdEXrJ4L5b1qPZbbtCy2BBrcP4Jmg1i0hnQIDAQAB'
          const encryptor = new JSEncrypt()
          // 设置公钥
          encryptor.setPublicKey(PUBLIC_KEY)
          // 加密数据
          const a = encryptor.encrypt(val)
          setPaymentPassword({ paysecret: a }).then((res) => {
            if (res.code === '0') {
              that.text = this.texts[1]
              that.$emit('resetStatus', 0)
              that.onSubmit()
            }
          })
        }
      })
    },
    // 模板下载
    async templateDownload(url) {
      const response = await fetch(
        'https://public-2020.ks3-cn-shanghai.ksyun.com/dev/back-manage-web/1624871540850_34.67941508892234_3f6d6261-3421-4449-a7d5-a6efdd1a6706.doc'
      )
      const blob = await response.blob()
      const objectUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = '变更函模板'
      a.click()
      a.remove()
    },
    handleChangeFile(file) {
      console.log(this.fileList)
    }
  }
}
</script>
<style lang="less" scoped>
.code {
  margin-left: 7px;
  width: 114px;
}
.successReturn {
  font-size: 20px;
  p {
    text-align: center;
    span {
      width: 130px;
      height: 41px;
      line-height: 40px;
      border: 1px solid #d9d9d9;
      display: inline-block;
    }
  }
}
.supload {
  width: 150px;
  display: inline-block;
  .left {
    margin-left: 20px;
  }
}
.uploadBox {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}
</style>
