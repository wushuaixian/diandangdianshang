<template>
  <div class="deactivation">
    <p><a-icon class="icon" type="exclamation" />银行卡未激活，请激活后绑定手机号</p>
    <div>
      <a-button @click="Deactivation" class="goActivation" type="primary">去激活</a-button>
    </div>
    <Popup
      :visible="visible"
      :statusNum="statusNum"
      @close="visible = false"
      :getPhone="getPhone"
      @resetStatus="resetStatus"
    />
    <SingContract :visible="singContractVisible" @close="closeSingContract" :url="url" />
  </div>
</template>
<script>
import Popup from './Popup'
import SingContract from './signContract'
import { accountStatus, queryFincePhone, signAContract } from '@/api/fince.js'
export default {
  components: {
    Popup,
    SingContract
  },
  data() {
    return {
      visible: false,
      statusNum: 1,
      getPhone: '',
      singContractVisible: false,
      CallbackStatus: null,
      status: true,
      url: ''
    }
  },
  mounted() {
    queryFincePhone().then((res) => {
      if (res.code === '0') {
        this.getPhone = res.data + ''
      }
    })
  },
  methods: {
    async Deactivation() {
      clearInterval(this.CallbackStatus)
      await accountStatus().then((res) => {
        if (!res.data.protocol) {
          signAContract({
            jumpUrl: 'http://www.baidu.com',
            ut: this.getcookie('ut')
          }).then((res) => {
            if (res.code === '0') {
              this.url = res.data
              this.singContractVisible = true
              this.CallbackStatus = setInterval(() => {
                accountStatus().then((res) => {
                  if (res.data.protocol) {
                    this.singContractVisible = false
                    clearInterval(this.CallbackStatus)
                    return this.Deactivation()
                  }
                })
              }, 2000)
            }
          })
        } else if (!res.data.phone) {
          this.statusNum = 1
          this.visible = true
        } else if (!res.data.password) {
          queryFincePhone().then((res) => {
            if (res.code === '0') {
              this.getPhone = res.data + ''
            }
          })
          this.statusNum = 2
          this.visible = true
        } else {
          this.$message.info('激活引导完成')
          if (this.$hasOpeerate()) {
            this.$router.push({ name: 'SysOperatorsHome' })
          } else {
            this.$router.push({ name: 'FinanceHome' })
          }
        }
      })
    },
    getcookie(objname) {
      var arrstr = document.cookie.split('; ')
      for (var i = 0; i < arrstr.length; i++) {
        var temp = arrstr[i].split('=')
        if (temp[0] === objname) return unescape(temp[1])
      }
    },
    resetStatus(val) {
      if (val === 0) {
        this.Deactivation()
      }
    },
    closeSingContract() {
      this.singContractVisible = false
      clearInterval(this.CallbackStatus)
    }
  },
  beforeDestroy() {
    clearInterval(this.CallbackStatus)
  }
}
</script>
<style lang="less" scoped>
.deactivation {
  width: 100%;
  background: #ffffff;
  height: 670px;
  padding: 185px 80px;
  p {
    color: rgb(217, 0, 27);
    text-align: center;
    font-size: 40px;
    .icon {
      background: red;
      color: #ffff;
      border-radius: 50%;
      margin-right: 13px;
    }
  }
  div {
    text-align: center;
    .goActivation {
      width: 198px;
      height: 43px;
      font-size: 20px;
    }
  }
}
</style>
