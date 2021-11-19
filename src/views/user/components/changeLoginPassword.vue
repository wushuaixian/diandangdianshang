<template>
  <a-modal title="修改登录密码" :visible="visible" @ok="handleOk" @cancel="handleCancel">
    <a-form-model ref="ruleForm1" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="手机号码" prop="mobile">
        {{ phone }}
      </a-form-model-item>
      <a-form-model-item label="短信验证码" prop="captchas">
        <a-input
          style="width: 162px; margin-right: 10px"
          :maxLength="6"
          v-model="verificationCode"
          placeholder="请输入短信验证码"
        />
        <a-button class="code" @click="SendCode" :loading="isSandCodeLoading">{{
          sendCodeSec > 0 ? sendCodeSec + '秒后可重发' : '获取验证码'
        }}</a-button>
      </a-form-model-item>
      <a-form-model-item label="设置密码" prop="mobile">
        <a-input v-model="phone" placeholder="必须包含大小写字母，数字的10-20个英文字母、数字" />
      </a-form-model-item>
      <a-form-model-item label="确认密码" prop="mobile">
        <a-input v-model="phone" placeholder="请再输一次密码" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean
    },
    phone: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      verificationCode: '',
      sendCodeSec: 0,
      isSandCodeLoading: false,
      form: {}
    }
  },
  methods: {
    handleOk() {},
    handleCancel() {
      this.$emit('close')
    },
    SendCode() {}
  }
}
</script>
<style lang="less" scoped>
</style>
