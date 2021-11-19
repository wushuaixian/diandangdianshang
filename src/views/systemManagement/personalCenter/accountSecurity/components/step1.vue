<!--
 * @Author: your name
 * @Date: 2021-07-10 15:14:57
 * @LastEditTime: 2021-08-02 16:06:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/systemManagement/personalCenter/accountSecurity/components/step1.vue
-->
<template>
  <div>
    <div class="step1-text">为确认是你本人操作，请选择验证方式完成身份验证：</div>
    <a-button class="right" type="primary" @click="getmoblie">手机号验证</a-button>
    <CatchModal v-if="showPhone" :queryParams="queryParams" :showPhone.sync="showPhone" @ok="submit"></CatchModal>
  </div>
</template>
<script>
import { userMobile } from '@/api/recevingAddress'
import CatchModal from './catchModal'
export default {
  components: {
    CatchModal
  },
  data() {
    return {
      showPhone: false,
      // seaconTime: 60,
      queryParams: {
        captchas: '',
        mobile: ''
      }
    }
  },
  methods: {
    async getmoblie() {
      const result = await userMobile()
      if (result.code === '0') {
        this.showPhone = true
        this.queryParams.mobile = result.data
      } else {
        this.$message.warning('获取手机号失败')
      }
    },
    submit(bool) {
      if (bool) {
        this.$emit('stepChange')
      }
    }
  }
}
</script>
<style scoped lang="less">
.step1-text {
  margin-bottom: 16px;
  text-align: center;
}
.box {
  border: 1px solid #999;
  display: flex;
  padding: 20px;
  border-radius: 4px;
  justify-content: space-between;
  align-items: center;
}
.right {
  display: block;
  margin: 0 auto;
  width: 360px;
  height: 48px;
  background: #ff6b00;
  border-radius: 4px;
  border: 1px solid #ff6b00;
}
</style>
