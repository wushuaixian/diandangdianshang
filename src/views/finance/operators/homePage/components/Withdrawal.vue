<template>
  <div>
    <a-modal okText="下一步" v-model="visible" title="提现到银行账户" @ok="nextStep">
      <a-row id="Withdrawal">
        <a-row justify="start">
          <a-col id="textb" :span="5">银行账户:</a-col>
          <a-col id="texta" :span="19">{{ accountInfo.bank }}</a-col>
        </a-row>
        <a-row>
          <a-col id="textb" :span="9">叮当账户现金余额:</a-col>
          <a-col id="texta" :span="15">¥{{ accountInfo.freeBalance }}</a-col>
        </a-row>
        <a-row class="inputs">
          <a-col :span="16">
            <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-form-model-item label="提现金额">
                <a-input
                  @change="onchange"
                  oninput="value=value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.').replace(/\.{2,}/g,'.').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
                  v-model="form.name"
                  placeholder="请输入提现金额"
                />
              </a-form-model-item>
              <span id="success" v-show="success">您输入的提现金额超出当前可提现金额</span>
              <span id="success" v-show="amount">请输入大于0元的金额</span>
            </a-form-model>
          </a-col>
          <a-col class="montext" :span="7">元</a-col>
        </a-row>
      </a-row>
    </a-modal>
    <a-modal okText="提交" v-model="password" title="提现到银行账户" @ok="Submit">
      <a-row id="Submit">
        <a-row>
          <a-col id="textb" :span="5">银行账户:</a-col>
          <a-col id="texta" :span="19">{{ accountInfo.bank }}</a-col>
        </a-row>
        <a-row>
          <a-col id="textb" :span="9">叮当账户现金余额:</a-col>
          <a-col id="texta" :span="15">¥{{ accountInfo.freeBalance }}</a-col>
        </a-row>
        <a-row>
          <a-col id="textb" :span="5">提现金额:</a-col>
          <a-col id="texta" :span="19">¥{{ form.name }}</a-col>
        </a-row>
        <a-row>
          <a-col id="textb" :span="7">预计到账时间:</a-col>
          <a-col id="texta" :span="17">T+1到账</a-col>
        </a-row>
        <a-row class="inputs">
          <a-col :span="16">
            <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-form-model-item label="支付密码">
                <a-input type="password" v-model="form.password" />
              </a-form-model-item>
            </a-form-model>
          </a-col>
          <a-col id="montexts" @click="gopassword" :span="8">忘记密码</a-col>
        </a-row>
      </a-row>
    </a-modal>
    <a-modal
      okText="提交验证码"
      :cancel-button-props="{ style: { display: 'none' } }"
      v-model="Code"
      title="提现到银行账户"
      @ok="Verification"
    >
      <a-row id="code">
        <a-row>
          <a-col id="textb" :span="4">手机号:</a-col>
          <a-col id="texta" :span="20">{{ phoneNumber }}</a-col>
        </a-row>
        <a-row class="inputs">
          <a-col :span="20">
            <a-form-model id="input" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-form-model-item label="验证码"> <a-input v-model="form.code" /></a-form-model-item>
            </a-form-model>
          </a-col>
          <a-col :span="4">
            <!-- <a-button :disabled="true" @click="setCode"> 获取验证码 </a-button> -->
            <a-button id="montexts" type="primary" class="code" @click="SendCodeLocal" :loading="isSandCodeLoading">{{
              sendCodeSec > 0 ? sendCodeSec + '秒后可重发' : '获取验证码'
            }}</a-button>
          </a-col>
        </a-row>
      </a-row>
    </a-modal>
    <a-modal
      :cancel-button-props="{ style: { display: 'none' } }"
      :ok-button-props="{ style: { display: 'none' } }"
      v-model="Successful"
      title="提现成功"
      width="700px"
    >
      <a-row id="image">
        <a-row>
          <a-col :span="7"><img class="img" src="@/assets/images/withdrawal/成功 2.png" alt="" /></a-col>
          <a-col :span="17"><h1>您的提现申请已提现成功</h1></a-col>
        </a-row>
        <div id="text">
          <p>T+1提现至您的银行账户,有疑问请拨打400-900-7186</p>
          <p>如果您的银行账户信息设置不正确导致的提现失败,资金将自动退回到您的叮当账户</p>
        </div>

        <a-row>
          <a-col :span="10"></a-col>
          <a-col :span="12"><a @click="returns">返回账户首页</a></a-col>
        </a-row>
      </a-row>
    </a-modal>
    <a-modal
      :cancel-button-props="{ style: { display: 'none' } }"
      :ok-button-props="{ style: { display: 'none' } }"
      v-model="fail"
      title="提现失败"
      width="700px"
    >
      <a-row id="fail">
        <a-row>
          <a-col :span="7"><img class="img" src="@/assets/images/withdrawal/成功 2.png" alt="" /></a-col>
          <a-col :span="17"><h1>提现失败:密码输入错误</h1></a-col>
        </a-row>
        <a-row>
          <a-col :span="12"><a id="returns" @click="returns">返回账户首页</a></a-col>
          <a-col :span="12"><a @click="continues">继续提现</a></a-col>
        </a-row>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
import { select, verifyPassword, queryPhoneNo, preProcessor, confirm } from '@/api/invoice'
import JSEncrypt from 'jsencrypt'
export default {
  data() {
    return {
      sendCodeSec: 0,
      sendCodeInterval: null,
      isSandCodeLoading: false,
      success: false,
      amount: false,
      paCode: false,
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
      visible: false,
      password: false,
      Code: false,
      Successful: false,
      fail: false,
      form: {
        name: '',
        password: '',
        code: ''
      },
      accountInfo: {},
      passwordCode: '',
      phoneNumber: '',
      withdrawCode: ''
    }
  },
  mounted() {
    this.select()
  },
  watch: {
    visible(val) {
      if (val) {
        this.form = {
          name: '',
          password: '',
          code: ''
        }
        this.queryPhoneNo()
      }
    }
  },
  methods: {
    SendCodeLocal() {
      clearInterval(this.sendCodeInterval)
      const that = this
      this.isSandCodeLoading = true
      preProcessor({ amount: this.form.name })
        .then((ret) => {
          this.isSandCodeLoading = false
          if (ret.code === '0') {
            that.sendCodeSec = 60
            this.withdrawCode = ret.data.withdrawCode
            console.log(ret)
            that.sendCodeInterval = setInterval(function () {
              if (that.sendCodeSec > 0) {
                console.log(that.sendCodeSec)
                that.sendCodeSec--
                that.$forceUpdate()
              } else {
                this.sendCodeSec = 0
                clearInterval(that.sendCodeInterval)
              }
            }, 1000)
          } else {
            that.$message.info('验证码发送失败')
          }
        })
        .catch(() => {
          this.isSandCodeLoading = false
        })
    },
    onchange() {
      this.success = false
      this.amount = false
    },
    nextStep() {
      if (this.form.name > this.accountInfo.freeBalance) {
        this.success = true
      } else if (!this.form.name) {
      } else if (this.form.name <= 0) {
        this.amount = true
      } else {
        this.visible = false
        this.password = true
        this.form.password = ''
      }
    },
    Submit() {
      const PUBLIC_KEY =
        'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArzvdoYxaE7fYV1xUQS7wHNzoiUDL3XWWq25JbaG33/C7VuUW9PQonUk53bWDByTBN43DnBExyXtzrO3Qnx/lJgtBfJIwL0yRE3BRkXxk+vDB01izYUAWcOOb/ZHMICee5ri7d+8jkwqHBRABue4iP3N7elbMecISPdnaEnGt6gPWpm2NfuSKcYKASaB84oNlO963Hl8Zc0Gcsbi39xXVqUKeWhQBR8bVwotZnsid4ak4a6mN/inmXn7Pd71jTTVOiUYa2FmVGToEaHW6o8JXmMXVBYy6JT7RuNO3NNlt66awR+iNzrjkdEXrJ4L5b1qPZbbtCy2BBrcP4Jmg1i0hnQIDAQAB'
      const encryptor = new JSEncrypt()
      // 设置公钥
      encryptor.setPublicKey(PUBLIC_KEY)
      // 加密数据
      const a = encryptor.encrypt(this.form.password)
      this.verifyPassword(a)
    },
    Verification() {
      this.confirm({ amount: this.form.name, withdrawCode: this.withdrawCode, verificationCode: this.form.code })
      console.log(this.withdrawCode)
      // this.fail = true
    },
    returns() {
      this.fail = false
      this.Successful = false
      this.$parent.search()
      this.$parent.updataTitle()
    },
    continues() {
      this.fail = false
      this.visible = true
      this.$parent.search()
      this.$parent.updataTitle()
    },
    // setCode() {
    //   this.disableds = false
    // },
    gopassword() {
      this.$router.push({
        // name: 'FinanceManager'
        name: this.$hasOpeerate() ? 'SysFinanceSuppliersPaymentManagement' : 'FinanceManager'
      })
      // console.log('点击忘记密码')
    },
    // 银行卡信息
    async select() {
      try {
        const data = await select()
        if (data.code === '0') {
          const newData = JSON.parse(JSON.stringify(data))
          this.accountInfo = newData.data
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 验证码
    // async preProcessor(text) {
    //   try {
    //     const data = await preProcessor({ amount: text })
    //     console.log(data)
    //     if (data.code === '0') {
    //       console.log(data.data)
    //     }
    //   } catch (err) {
    //     console.log(err)
    //   }
    // },
    // 确认提现
    async confirm(text) {
      try {
        const data = await confirm(text)
        if (data.code === '0') {
          this.Code = false
          this.Successful = true
          this.$parent.search()
        }
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    },
    // 手机号 queryPhoneNo
    async queryPhoneNo() {
      try {
        const data = await queryPhoneNo()
        if (data.code === '0') {
          const newData = JSON.parse(JSON.stringify(data))
          this.phoneNumber = newData.data
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 验证密码
    async verifyPassword(text) {
      try {
        const data = await verifyPassword({ password: text })
        if (data.code === '0') {
          const newData = JSON.parse(JSON.stringify(data))
          if (newData.code === '0') {
            this.password = false
            this.Code = true
          }
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
<style lang="less" scoped>
#Withdrawal {
  line-height: 50px;
  margin-left: 130px;
  color: #555555;
  .inputs {
    color: #555555;
  }
  #textb {
    color: rgba(0, 0, 0, 0.85);
  }
  #texta {
    color: black;
    font-weight: bold;
    margin-left: -5px;
  }
  .montext {
    margin-top: -5px;
    margin-left: -35px;
  }
  #success {
    color: red;
    margin-left: -10px;
  }
}
#Submit {
  line-height: 50px;
  margin-left: 130px;
  #textb {
    color: rgba(0, 0, 0, 0.85);
  }
  #texta {
    color: black;
    font-weight: bold;
    margin-left: -5px;
  }
  #montexts {
    margin-top: -5px;
    margin-left: -30px;
    cursor: pointer;
    color: #ff6b00;
  }
}
#code {
  line-height: 50px;
  margin-left: 100px;
  #textb {
    color: rgba(0, 0, 0, 0.85);
  }
  #texta {
    color: black;
    font-weight: bold;
    margin-left: -5px;
  }
  #input {
    margin-top: 7px;
    margin-left: -40px;
  }
  #montexts {
    margin-top: -5px;
    margin-left: -40px;
    cursor: pointer;
  }
}
#image {
  .img {
    margin-left: 120px;
  }
  #text {
    margin-left: 75px;
  }
}
#fail {
  .img {
    margin-left: 120px;
  }
  #returns {
    margin-left: 200px;
  }
}
</style>
