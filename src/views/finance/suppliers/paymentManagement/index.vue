<template>
  <div class="paymentManagement">
    <header-title>
      <span>支付管理</span>
    </header-title>
    <div class="centext">
      <table>
        <tr>
          <td colspan="1" class="grey">绑定支付手机号</td>
          <td colspan="5">
            需要绑定有付款操作权限人员的手机号,更换手机号需要提供变更函，下载<span class="orange" @click="getTemplate">
              变更函模板
            </span>
          </td>
          <!-- <td colspan="5" v-else>账户资金及重要信息变更时进行短信验证或通知</td> -->
          <td colspan="1" class="right">
            <span>{{ bindingMobilePhoneStatus[phoneType - 1] }}</span>
          </td>
          <td colspan="1" class="left">
            <span class="orange" @click="bindingMobilePhoneoptionevent(phoneType)">
              {{ bindingMobilePhoneoption[phoneType - 1] }}
            </span>
          </td>
        </tr>
        <tr>
          <td colspan="1" class="grey">支付密码</td>
          <td colspan="5">账户资金及重要信息变更时进行校验</td>
          <td colspan="1" class="right"></td>
          <td colspan="1" class="orange" v-if="secretType === 0">
            <span @click="setFinancePasswd">设置</span>
          </td>
          <td colspan="1" class="orange" v-else>
            <span @click="changePassword">修改</span>
            <span @click="retrievePasswd" style="margin-left: 10px">找回</span>
          </td>
        </tr>
      </table>
    </div>
    <Popup
      :visible="popupVisible"
      @close="closePopup"
      :statusNum="statusNum"
      :getPhone="phone"
      @resetStatus="resetStatus"
      @updataPhone="updataPhone"
    />
    <SingContract :visible="singContractVisible" @close="closeSingContract" :url="url" />
    <GoBankCard :visible="goBankCardVisible" />
  </div>
</template>
<script>
import {
  paymentManagementStatus,
  queryFincePhone,
  accountStatus,
  signAContract,
  checkFinanceInfo
} from '@/api/fince.js'
import Popup from './Popup'
import GoBankCard from '@/views/finance/suppliers/homePage/components/goBankCard'
import SingContract from './signContract'
export default {
  components: {
    Popup,
    SingContract,
    GoBankCard
  },
  data() {
    return {
      phoneType: 1,
      secretType: 1,
      singContractVisible: false,
      popupVisible: false,
      bindingMobilePhoneStatus: ['待初次绑定', '已绑定', '未绑定(曾绑)', '重绑审核中', '未绑定(曾绑)'],
      bindingMobilePhoneoption: ['绑定', '解绑', '重绑申请', '', '重绑'],
      statusNum: 1,
      phone: '',
      CallbackStatus: null,
      url: '',
      goBankCardVisible: false
    }
  },
  watch: {
    phoneType(val) {
      if (val === 2 || val === 3) {
        this.updataPhone()
      }
      if (val === 3) {
        this.phone = ''
      }
    }
  },
  created() {
    checkFinanceInfo().then((res) => {
      if (res.code !== '0' && !this.$hasOpeerate()) {
        this.goBankCardVisible = true
      }
    })
  },
  mounted() {
    this.getStatus()
    this.updataPhone()
  },
  methods: {
    updataPhone() {
      queryFincePhone().then((res) => {
        if (res.code === '0') {
          this.phone = res.data + ''
        }
      })
    },
    bindingMobilePhoneoptionevent(val) {
      if (val === 1) {
        this.statusNum = 1
        this.Deactivation()
        return
      } else if (val === 2) {
        this.statusNum = 5
      } else if (val === 3) {
        this.statusNum = 3
      } else if (val === 5) {
        this.statusNum = 11
      }
      this.popupVisible = true
    },
    closeSingContract() {
      this.singContractVisible = false
      clearInterval(this.CallbackStatus)
    },
    async Deactivation() {
      clearInterval(this.CallbackStatus)
      await accountStatus().then((res) => {
        console.log(res)
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
        } else {
          this.popupVisible = true
        }
      })
    },
    changePassword() {
      if (this.phone) {
        this.statusNum = 7
        this.popupVisible = true
      } else {
        this.$message.info('请先绑定手机号')
      }
    },
    setPassword() {
      if (this.phone) {
        this.statusNum = 2
        this.popupVisible = true
      } else {
        this.$message.info('请先绑定手机号')
      }
    },
    getcookie(objname) {
      var arrstr = document.cookie.split('; ')
      for (var i = 0; i < arrstr.length; i++) {
        var temp = arrstr[i].split('=')
        if (temp[0] === objname) return unescape(temp[1])
      }
    },
    closePopup() {
      this.popupVisible = false
      this.getStatus()
    },
    getStatus() {
      paymentManagementStatus().then((res) => {
        console.log(res)
        if (res.code === '0') {
          this.phoneType = res.data.phoneType
          // this.phoneType = 3
          this.secretType = res.data.secretType
        }
      })
    },
    resetStatus(v) {
      this.statusNum = v
    },
    // 设置支付密码
    setFinancePasswd() {
      queryFincePhone().then((res) => {
        console.log(res)
        if (res.code === '0') {
          this.phone = res.data + ''
          this.setPassword()
        } else {
          this.$message.info('设置支付密码前，请先绑定手机号码！')
        }
      })
    },
    // 找回密码
    retrievePasswd() {
      queryFincePhone().then((res) => {
        if (res.code === '0') {
          this.phone = res.data + ''
          this.statusNum = 6
          this.popupVisible = true
        } else {
          this.$message.info('找回支付密码前，请先绑定手机号码！')
        }
      })
    },
    async getTemplate() {
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
    }
  }
}
</script>
<style lang="less" scoped>
.paymentManagement {
  width: 100%;
  height: 824px;
  padding: 24px;
  background: #ffffff;
  .centext {
    table {
      width: 100%;
      height: 98px;
      margin: 0 auto;
      border: 1px solid #e5e5e5;
      tr {
        border: 1px solid #e5e5e5;
        td {
          border: 1px solid #e5e5e5;
          text-align: center;
        }
      }
    }
  }
}
.orange {
  cursor: pointer;
  color: #ff6b00;
  border-left: 0px !important;
}
.right {
  border-right: 0px !important;
}
.left {
  border-left: 0px !important;
}
.grey {
  background: rgb(249, 249, 249);
}
</style>
