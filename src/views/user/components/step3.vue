<template>
  <div class="step3">
    <div class="box">
      <div class="icon">
        <a-icon class="check" type="check" />
      </div>
      <div class="title">注册成功</div>
      <div class="message">请耐心等待审核结果，审核结果将以短信提醒通知到您注册的手机上</div>
      <div class="btns">
        <a-button class="btn" size="large" @click="backHome">返回首页</a-button>
        <a-button class="btn" size="large" @click="handleToNext" type="primary">继续完善信息</a-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    backHome() {
      // location.href = 'http://www.uat.dingdangmro.com/#/home'
      window.location.href = process.env.VUE_APP_HOME_URL
      // this.$store.state.register.dingDangOnlineUrl
    },
    async handleToNext() {
      this.$router.push({ name: 'Enterprise', query: { tabsKey: 2 } })
    }
  }
}
</script>

<style lang="less" scoped>
.step3 {
  .box {
    display: flex;
    flex-direction: column;
    align-items: center;

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 56px;
      width: 80px;
      height: 80px;
      background: #70c88e;
      border-radius: 50%;

      .check {
        font-size: 46px;
        color: #fff;
      }
    }

    .title {
      margin-top: 40px;
      font-size: 24px;
      color: #262626;
      text-align: center;
      line-height: 30px;
    }

    .message {
      margin-top: 12px;
      font-size: 14px;
      color: #999999;
      text-align: center;
      line-height: 18px;
    }

    .btns {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 48px;
      margin-bottom: 124px;

      .btn {
        width: 360px;
        height: 40px;
        margin-bottom: 16px;
        font-size: 16px;
        line-height: 20px;
      }
    }
  }
}
</style>
