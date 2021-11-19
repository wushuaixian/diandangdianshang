<template>
  <div id="userLayout" :class="['user-layout-wrapper', isMobile && 'mobile']">
    <div class="container">
      <header class="header">
        <img class="logo" @click="goLink" :src="require('@/assets/images/logo.png')" alt="" />
        <div class="name">{{ $route.meta.title }}</div>
        <div class="btn">
          <a
            target="_blank"
            href="https://vod.dingdangmro.com/asset/078a77a82b79d2825d1f352d07ef3559/390c96283d560304585d1483d736fca0.mp4"
          >
            <img :src="require('@/assets/images/login/option_button.png')" alt="" />
          </a>
          <customer-service class="serve" />
        </div>
        <div class="login" v-if="$route.meta.title === '用户注册'">
          已有账号？<a @click="Gologin">请登录<a-icon class="icon" type="right" /></a>
        </div>
        <div class="login" v-if="$route.meta.title === '忘记密码'">
          <a @click="Gologin">返回登录页<a-icon class="icon" type="right" /></a>
        </div>
      </header>

      <router-view />

      <footer class="footer" v-if="$route.name !== 'login'">
        <div>
          Copyright 2017 叮当（天津）电子商务有限公司 All Rights Reserved &nbsp; 网站备案号：津ICP备17003187号-1
          &nbsp;&nbsp;
          <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=12019102300014">
            <img :src="require('@/assets/images/beian.png')" />
            津公网安备 12019102300014号
          </a>
          <!-- 营业执照 友情链接：快递查询 -->
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import { deviceMixin } from '@/store/device-mixin'
import SelectLang from '@/components/SelectLang'
import CustomerService from '@/components/GlobalHeader/CustomerService'

export default {
  name: 'UserLayout',
  components: {
    SelectLang,
    CustomerService
  },
  mixins: [deviceMixin],
  mounted() {
    document.body.classList.add('userLayout')
  },
  beforeDestroy() {
    document.body.classList.remove('userLayout')
  },
  methods: {
    Gologin() {
      this.$router.push({ name: 'login' })
    },
    goLink() {
      // window.open('http://yzb.uat.dingdangmro.com/member/login/executeLogin.htm')
      // window.open()
      // window.location.href = 'http://www.uat.dingdangmro.com/#/home'
      window.location.href = process.env.VUE_APP_HOME_URL
    }
  }
}
</script>

<style lang="less" scoped>
#userLayout.user-layout-wrapper {
  height: 100%;

  &.mobile {
    .container {
      .main {
        max-width: 368px;
        width: 98%;
      }
    }
  }
  .header {
    height: 80px;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 160px;
    .logo {
      height: 49.5px;
      width: 90px;
      margin-bottom: 6px;
    }
    .name {
      flex: 1;
      font-family: PingFangSC-Medium;
      font-size: 20px;
      color: #ff6b00;
      line-height: 24px;
      padding-left: 24px;
      border-left: solid 2px #eee;
      margin-left: 19px;
    }
    .btn {
      display: flex;
      margin-right: 100px;
      align-items: center;
    }
    .login {
      font-size: 16px;
      line-height: 16px;
      margin-right: 100px;
      display: flex;
      flex-direction: row;
      align-items: center;
      a {
        color: #ff7006;
        font-size: 16px;
        line-height: 16px;
        display: flex;
        flex-direction: row;
        align-items: center;
        .icon {
          font-size: 14px;
          margin-top: 2px;
        }
      }
    }
  }

  .container {
    width: 100%;
    min-height: 100%;
    background-size: 100%;
    //padding: 50px 0 84px;
    position: relative;

    .user-layout-lang {
      width: 100%;
      height: 40px;
      line-height: 44px;
      text-align: right;

      .select-lang-trigger {
        cursor: pointer;
        padding: 12px;
        margin-right: 24px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        vertical-align: middle;
      }
    }

    .user-layout-content {
      padding: 32px 0 24px;

      .top {
        text-align: center;

        .header {
          height: 44px;
          line-height: 44px;

          .badge {
            position: absolute;
            display: inline-block;
            line-height: 1;
            vertical-align: middle;
            margin-left: -12px;
            margin-top: -10px;
            opacity: 0.8;
          }

          .logo {
            height: 44px;
            vertical-align: top;
            margin-right: 16px;
            border-style: none;
          }

          .title {
            font-size: 33px;
            color: rgba(0, 0, 0, 0.85);
            font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
            font-weight: 600;
            position: relative;
            top: 2px;
          }
        }
        .desc {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.45);
          margin-top: 12px;
          margin-bottom: 40px;
        }
      }

      .main {
        min-width: 260px;
        width: 368px;
        margin: 0 auto;
      }
    }

    a {
      text-decoration: none;
    }

    .footer {
      height: 48px;
      background: #5e5750;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #ffffff;
      text-align: center;
      line-height: 18px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      & > div {
        display: flex;
        align-items: center;
        a {
          color: #fff;
          display: inline-flex;
          align-items: center;
        }
        img {
          margin-right: 5px;
        }
      }
    }
  }
}
.serve {
  margin-left: 20px;
}
</style>
