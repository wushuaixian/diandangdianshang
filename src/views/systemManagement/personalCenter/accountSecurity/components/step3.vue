<!--
 * @Author: your name
 * @Date: 2021-07-10 15:15:12
 * @LastEditTime: 2021-07-25 14:20:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/systemManagement/personalCenter/accountSecurity/components/step3.vue
-->
<template>
  <div class="big-box">
    <a-icon type="check-circle" theme="twoTone" :style="{ fontSize: '100px' }" two-tone-color="#FF6B00" />
    <div class="text">{{ title }}更新成功</div>
    <div class="re-login">
      <a-button type="primary" class="re-login-btn" @click="Relogin"> 重新登陆 </a-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: () => {}
    }
  },
  methods: {
    Relogin() {
      window.location.href = '/user/login'
    }
  }
}
</script>
<style scoped lang="less">
.big-box {
  text-align: center;
  padding-top: 50px;
  .text {
    margin-top: 30px;
    font-size: 20px;
    font-weight: 600;
  }
  .re-login {
    padding-top: 15px;
    .re-login-btn {
      padding: 0 50px;
      // background-color: #1890ff !important;
      // border-color: #1890ff !important;
    }
  }
}
</style>
