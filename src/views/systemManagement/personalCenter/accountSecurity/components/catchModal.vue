<!--
 * @Author: your name
 * @Date: 2021-07-25 11:09:02
 * @LastEditTime: 2021-08-02 16:06:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/systemManagement/personalCenter/accountSecurity/components/catchModal.vue
-->
<template>
  <div>
    <a-modal :visible="showPhone" :width="600" :footer="null" title="使用手机验证码验证" @cancel="handleCancel">
      <img class="img" src="@/assets/images/login/mobile.png" alt="" />
      <div class="big-box">
        <div>当前手机号 {{ queryParams.mobile | phoneFilter }}</div>
        <div class="input-box">
          <a-input class="input" v-model="queryParams.captchas" type="text" />
          <a-button
            :class="{ btn: seaconTime === 60 }"
            :disabled="60 > seaconTime"
            :type="!seaconTime === 60 ? 'primary' : ''"
            @click="seaconTime === 60 && sendCatch()"
          >
            {{ 60 > seaconTime ? seaconTime + 's' : '获取验证码' }}</a-button
          >
        </div>
        <div class="footer">
          <a-button type="primary" @click="submit">提交认证</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { getlocalCode, checkCaptchas } from '@/api/fince'
export default {
  props: {
    queryParams: {
      type: Object,
      default: () => {}
    },
    showPhone: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      seaconTime: 60
      // queryParams: {
      //   captchas: '',
      //   mobile: ''
      // }
    }
  },
  methods: {
    async sendCatch() {
      const {
        queryParams: { mobile }
      } = this
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
      const result = await checkCaptchas({
        ...queryParams,
        type: 3
      })
      if (result.code === '0') {
        this.$emit('ok', true)
      } else {
        this.$message.warning('验证码不匹配')
      }
    },
    handleCancel() {
      this.$emit('update:showPhone', false)
    }
  }
}
</script>
<style scoped lang="less">
.img {
  display: block;
  margin: 0 auto;
  margin-bottom: 10px;
  width: 80px;
  margin-bottom: 48px;
}
.big-box {
  padding-left: 80px;
  .input-box {
    margin-top: 20px;
    .input {
      width: 200px;
      margin-right: 20px;
      vertical-align: middle;
    }
    .btn {
      vertical-align: middle;
      width: 120px;
      height: 38px;
      background: #ff6b00;
      border-radius: 4px;
      color: #ffffff;
      line-height: 18px;
      text-align: center;
    }
  }
  .footer {
    margin-top: 40px;
    margin-bottom: 20px;
    /deep/ .ant-btn-primary {
      width: 400px;
      height: 40px;
      line-height: 40px;
    }
  }
}
</style>
