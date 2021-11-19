<template>
  <section>
    <div class="regedit">
      <div class="title">
        注册须知
        <div class="line"></div>
      </div>
      <div class="tips">
        <div class="text">欢迎入驻叮当工业品交易平台，为了更快的完成入驻，您需要提前准备下列文件：</div>
        <ul class="content">
          <li class="list">1.最新企业营业执照扫描件或照片（正副本均可）；</li>
          <li class="list">2.法人身份证正反面扫描件或照片；</li>
          <li class="list">
            3.签字并加盖企业公章后的《授权委托书》扫描件或照片，
            <a @click="download">点击下载模版</a>。
          </li>
          <li class="list">
            注：扫描件或照片内容要求清晰，文件格式支持：bmp、tiff、jpg、jpeg、png文件大小不能超过1.5M。
          </li>
        </ul>
      </div>
      <div class="other">
        <ul class="content">
          <li class="list">1.在线提交注册申请时，请您根据提示说明认真填写，并与上传的资料仔细核对，确保信息一致；</li>
          <li class="list">2.注册提交后，平台会在1个工作日内审核完毕，审核状态请登录平台，点击“工商信息”进行查看；</li>
          <li class="list">3.注册成功后，登录平台点击“企业信息”进行企业信息的完善。</li>
        </ul>
        <div class="notes">友情提示：叮当工业品交易平台注册不收取费用，平台提供的增值收费服务以网站公示为准。</div>
      </div>
      <div class="btns">
        <a-button class="btn" size="large" @click="Close">返回首页</a-button>
        <a-button class="btn jbg" size="large" type="primary" @click="readPolicy">免费注册</a-button>
      </div>
      <SettleIn :visable="visible" />
    </div>
  </section>
</template>

<script>
import * as api from '@/api/configgurationCenter/operatedConfigure/platformTerms/template.js'
import SettleIn from './settleIn.vue'
export default {
  components: { SettleIn },
  data() {
    return {
      visible: false
    }
  },
  methods: {
    Close() {
      // this.$router.push('/user/login')
      // window.location.href = 'http://www.dingdangmro.com/#/'
      // window.location.href = 'http://www.uat.dingdangmro.com/#/home'
      window.location.href = process.env.VUE_APP_HOME_URL
    },
    readPolicy() {
      this.visible = true
      this.$forceUpdate()
    },
    readAgreeMent() {
      this.$parent.isReadPolicy = true
    },
    async download() {
      const res = await api.getTemplateDetailWithType(1)
      if (res.code === '0') {
        console.log(res)
        const response = await fetch(res.data.url)
        const blob = await response.blob()
        const objectUrl = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = objectUrl
        const ext = res.data.url.substr(res.data.url.lastIndexOf('.') + 1)
        a.download = `授权委托书.${ext}`
        a.click()
        a.remove()
      }
    }
  }
}
</script>

<style lang="less" scoped>
ul,
li {
  padding: 0;
  margin: 0;
  list-style: none;
}
section {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f6f6f6;
  .regedit {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 1020px;
    padding: 40px 50px;
    border-radius: 8px;
    background: #fff;
    color: #262626;
    margin: 20px 0 100px 0;
    .title {
      position: relative;
      font-size: 32px;
      font-weight: bold;
      line-height: 32px;
      margin: 4px 0;
      z-index: 99;
      .line {
        height: 8px;
        background: #ee732e;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -1;
      }
    }
    .tips {
      display: flex;
      flex-direction: column;
      margin-top: 30px;
      padding: 30px;
      width: 100%;
      background: rgba(255, 106, 0, 0.1);
      .text {
        font-size: 16px;
        line-height: 20px;
      }
    }
    .other {
      display: flex;
      flex-direction: column;
      padding: 14px 30px;
      width: 100%;
      .notes {
        margin-top: 6px;
        font-size: 12px;
        width: 100%;
        color: #ff6b00;
      }
    }

    .content {
      margin-top: 6px;
      .list {
        margin-top: 10px;
        font-size: 14px;
        line-height: 16px;
        & > span {
          color: rgb(59, 157, 248);
        }
        a {
          color: rgb(59, 157, 248);
        }
      }
    }
    .btns {
      margin-top: 56px;
      .btn {
        width: 120px;
        height: 40px;
        margin: 0 10px;
      }
    }
  }
}

.content {
  overflow: auto;
  padding: 10px 0px;
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
</style>
