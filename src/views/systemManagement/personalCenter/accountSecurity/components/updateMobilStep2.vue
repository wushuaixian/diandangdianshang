<!--
 * @Author: your name
 * @Date: 2021-07-25 11:01:47
 * @LastEditTime: 2021-08-10 14:21:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/systemManagement/personalCenter/accountSecurity/components/updateMobil.vue
-->
<template>
  <div>
    <!-- <div class="password1">更换手机号</div> -->
    <a-form-model ref="ruleForm" :model="queryParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="输入新手机号" prop="mobile">
        <a-input v-model="queryParams.mobile" :maxLength="11" />
      </a-form-model-item>
      <a-form-model-item label="短信验证码" prop="captchas">
        <div class="input-box">
          <a-input class="input" v-model="queryParams.captchas" type="text" />
          <a-button
            :class="{ btn: seaconTime === 60 }"
            :disabled="60 > seaconTime && canUse"
            :type="!seaconTime === 60 ? 'primary' : ''"
            @click="seaconTime === 60 && sendCatch()"
          >
            {{ 60 > seaconTime ? seaconTime + 's' : '获取验证码' }}</a-button
          >
        </div>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 10, offset: 8 }">
        <a-button class="btn" type="primary" @click="submit">提交</a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script>
import { checkUserName, updateMobile } from '@/api/user.js'
import { getlocalCode, checkCaptchas } from '@/api/fince'
export default {
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
      canUse: false,
      seaconTime: 60,
      queryParams: {
        captchas: '',
        mobile: ''
      },
      rules: {
        mobile: [
          {
            required: true,
            message: '请输入新手机号',
            trigger: 'change'
          },
          { validator: this.validate_mobile, trigger: 'change' }
        ],
        password2: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.queryParams.password2 === '') {
                callback(new Error('请输入密码'))
              }
              if (this.queryParams.password1 !== this.queryParams.password2) {
                callback(new Error('两次输入的密码不一致'))
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
    async sendCatch() {
      const {
        canUse,
        queryParams: { mobile }
      } = this
      if (!canUse) return
      if (!mobile) {
        return this.$message.warning('请先输入新手机号！')
      }
      const result = await getlocalCode({
        mobile,
        type: 3
      })
      if (result.code === '0') {
        const that = this
        const time = setInterval(() => {
          that.seaconTime--
          if (that.seaconTime === 0) {
            that.seaconTime = 60
            clearInterval(time)
          }
        }, 1000)
      } else {
        this.$message.warning(result.message)
      }
    },
    async submit() {
      const { queryParams } = this
      if (!queryParams.mobile) {
        return
      }
      const result = await checkCaptchas({
        ...queryParams,
        type: 3
      })
      if (result.code !== '0') return
      const res = await updateMobile({
        mobile: queryParams.mobile
      })
      if (result.code === '0' && res.code === '0') {
        this.$emit('stepChange')
      }
    },
    validate_mobile(rule, value, callback) {
      const reg = new RegExp(/^[1][3,4,5,6,7,8,9][0-9]{9}$/)
      const vm = this
      if (!reg.test(value)) {
        callback(new Error('请填写正确的手机号'))
      } else {
        checkUserName({ mobile: value })
          .then((res) => {
            if (res.code === '0' || res.code === 0) {
              vm.canUse = true
              callback()
            } else {
              callback(new Error(res.message))
              vm.canUse = false
            }
          })
          .catch(() => {
            callback(new Error('查询失败'))
            vm.canUse = false
          })
      }
    }
  }
}
</script>
<style scoped lang="less">
.input-box {
  display: flex;
  /deep/ .ant-input {
    width: 264px !important;
    margin-right: 16px;
  }
}
.btn {
  width: 100%;
  height: 40px;
  line-height: 40px;
}
</style>
