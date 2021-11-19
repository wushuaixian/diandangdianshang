<template>
  <section class="login-index">
    <div class="login-content">
      <div class="login-box">
        <div class="form-box">
          <div class="login-head">
            <a :class="{ sel: index === 1, title: true }" @click="EditIndex(1)">
              密码登录
              <div class="line"></div>
            </a>
            <a :class="{ sel: index === 0, title: true }" @click="EditIndex(0)">
              手机登录
              <div class="line"></div>
            </a>
          </div>
          <div class="form">
            <div class="login-input-box">
              <a-input
                v-if="index === 1"
                class="login-input"
                size="large"
                v-model="username"
                placeholder="请输入用户名/手机号"
              />
              <a-input
                v-else
                class="login-input"
                size="large"
                v-model="username"
                oninput="value=value.replace(/[^\d]/g,'')"
                :maxLength="number"
                @blur="numberblur"
                placeholder="请输入手机号"
              />
            </div>
            <div v-if="index === 1" class="login-input-box" style="margin-bottom: 13px">
              <a-input class="login-input" type="password" size="large" v-model="password" placeholder="请输入密码" />
            </div>
            <DragVerify ref="verify" :value.sync="isPassing" v-if="dv" width="320" style="margin-bottom: 16px" />
            <div class="check" v-show="index === 0">
              <a-input class="login-input" size="large" v-model="code" placeholder="请输入验证码">
                <template #suffix>
                  <div>
                    <a-button
                      class="sendcode"
                      type="link"
                      :disabled="sendCodeSec > 0 || !isPassing"
                      :loading="isSandCodeLoading"
                      @click="sendSMSCode"
                    >
                      {{ sendCodeSec > 0 ? sendCodeSec + '秒后可重发' : '发送验证码' }}
                    </a-button>
                  </div>
                </template>
              </a-input>
            </div>
          </div>
          <a-button
            class="btn"
            type="primary"
            block
            size="large"
            html-type="submit"
            :disabled="!isPassing"
            :loading="loginLoading"
            @click="GoLogin"
          >
            登录
          </a-button>
          <!-- <div class="other">
            <div class="l">记住用户名</div>
            <div class="r">忘记密码</div>
          </div> -->
        </div>
        <div class="reg-box">
          <div class="flex1 forgetpasswd" @click="forgetpasswd">忘记密码</div>
          <a class="reg" @click="$router.push('/user/register')">注册账号</a>
          <div class="yuan">
            <a-icon class="icon" type="right" />
          </div>
        </div>
      </div>
    </div>

    <footer class="footer">
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
    <!-- <Footer /> -->
  </section>
</template>
<script>
import { GetCurrentBrowser, GetOs } from '@/utils/getBrowser'
import Footer from '@/components/Footer/Footer.vue'
import * as userAPI from '@/api/user'
import md5 from 'md5'
import cookie from '@/utils/cookie'
import { DragVerify } from '@/components/Verify/'
import _ from 'loadsh'
import { mapActions } from 'vuex'
export default {
  components: { Footer, DragVerify },
  data() {
    return {
      sendCodeInterval: null,
      index: 1,
      username: '',
      code: '',
      password: '',
      sendCodeSec: 0,
      isPassing: false,
      dv: true,
      isSandCodeLoading: false,
      loginLoading: false,
      number: 11,
      LoginData: { platformId: '21' }
    }
  },
  mounted() {
    this.numberblur = _.debounce(this.numberblur, 500)
  },
  watch: {
    /**
     * 手机号修改后 重置验证
     */
    username() {
      this.$refs.verify.resume()
    }
  },
  methods: {
    forgetpasswd() {
      this.$router.push({ name: 'forgetpasswd' })
    },
    ...mapActions(['GetUserPlatformList', 'refreshFrontPlatform']),
    async numberblur() {
      const { username: mobile } = this
      if (!mobile) return
      const data = new FormData()
      data.append('mobile', mobile)
      await userAPI.isRepeatPhoneForm(data)
    },
    EditIndex(val) {
      this.$refs.verify.resume()
      this.index = val
      this.username = ''
      this.code = ''
      this.password = ''
      this.isPassing = false
    },
    GoLogin() {
      const that = this
      if (that.index === 0) {
        that.LoginData.mobile = that.username
        that.LoginData.captchas = that.code
      } else if (that.index === 1) {
        that.LoginData.userName = that.username
        that.LoginData.password = md5(that.password)
      }
      this.loginLoading = true
      userAPI
        .login({ ...that.LoginData, browser: GetCurrentBrowser(), os: GetOs() })
        .then(async (ret) => {
          this.loginLoading = false
          if (ret.code === '0') {
            cookie.set('ut', ret.ut)
            // 拉取当前用户平台集合
            await this.GetUserPlatformList()
            await this.refreshFrontPlatform()
            this.$router.push('/')
          }
        })
        .catch((err) => {
          this.loginLoading = false
          console.log(err)
        })
    },
    sendSMSCode() {
      clearInterval(this.sendCodeInterval)
      const that = this
      const reg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
      if (reg.test(this.username)) {
        this.isSandCodeLoading = true
        userAPI
          .sendCaptchas(this.username, 1)
          .then((ret) => {
            this.isSandCodeLoading = false
            if (ret.code === '0') {
              that.sendCodeSec = 60
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
      } else {
        that.$message.info('请填写正确的手机号')
      }

      // clearInterval(this.sendCodeInterval)
      // const that = this
      // const reg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
      // if (reg.test(this.username)) {
      //   that.sendCodeSec = 60
      //   that.sendCodeInterval = setInterval(function () {
      //     if (that.sendCodeSec > 0) {
      //       console.log(that.sendCodeSec)
      //       that.sendCodeSec--
      //       that.$forceUpdate()
      //     } else {
      //       this.sendCodeSec = 0
      //       clearInterval(that.sendCodeInterval)
      //     }
      //   }, 1000)
      // } else {
      //   that.$message.info('请填写正确的手机号')
      // }
    }
  }
}
</script>
<style lang="less" scoped>
.flex1 {
  flex: 1;
}
.login-index {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  min-width: 100%;
  top: 80px;
  bottom: 0;
  left: 0;
  right: 0;

  .login-content {
    width: 100%;
    height: 850px;
    background: url(/denglu.png) no-repeat center center;
    // background: url(/denglu.png);
    background-size: 100% 100%;
    background-position: center;
    min-width: 1000px;
    position: relative;
    display: flex;
    align-items: center;
    // padding: 80px 302px;

    .login-box {
      display: flex;
      flex-direction: column;
      width: 400px;
      height: 384px;
      background: #fff;
      border-radius: 16px;
      margin-left: auto;
      position: absolute;
      right: 100px;

      .form-box {
        display: flex;
        flex-direction: column;
        padding: 30px 40px 0 40px;
        flex: 1;

        .login-head {
          display: flex;
          flex-direction: row;
          height: 30px;
          margin-bottom: 30px;

          .title {
            display: flex;
            align-items: flex-end;
            position: relative;
            font-size: 18px;
            color: #262626;
            line-height: 18px;
            margin: 4px 56px 0 0;
            z-index: 99;
            transition: all 0.3s ease-out;

            .line {
              height: 6px;
              background: #ee732e;
              position: absolute;
              width: 0%;
              bottom: 0;
              z-index: -1;
              transition: all 0.3s;
            }

            &.sel {
              font-size: 24px;
              color: #262626;
              line-height: 22px;

              & .line {
                width: 100%;
              }
            }
          }
        }

        .form {
          width: 100%;
          display: flex;
          flex-direction: column;

          .check {
            height: 27px;
            width: 100%;
            border-radius: 4px;
            margin-bottom: 16px;
            height: 36px;
            .sendcode {
              color: #ff6b00;
              &:disabled {
                color: #999;
                &:hover {
                  color: #666;
                }
              }
              &:hover {
                color: #fd8c3b;
              }
            }
            .login-input {
              border-radius: 4px;
              background-color: #f6f6f6 !important;
              background: #f6f6f6 !important;
              font-size: 14px;
              color: #666;
              border: none !important;
              .ant-input {
                border-radius: 4px;
                background-color: #f6f6f6 !important;
                background: #f6f6f6 !important;
                font-size: 14px;
                color: #666;
                border: none !important;
              }
            }
          }
          .login-input-box {
            margin-bottom: 16px;

            .login-input,
            .ant-input {
              border-radius: 4px;
              background: #f6f6f6 !important;
              font-size: 14px;
              color: #666;
              border: none;
            }
          }
        }

        .other {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          margin-top: 8px;

          .l,
          .r {
            font-size: 12px;
            color: #6a707d;
            line-height: 16px;
          }
        }
      }

      .btn {
        background-image: linear-gradient(270deg, #ff8720 0%, #ff6241 100%);
        border-radius: 4px;
        height: 40px;
        &:disabled {
          background: #f6f6f6;
          border: none;
        }
      }

      .reg-box {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 40px;
        background: #f6f6f6;
        border-radius: 0px 0px 16px 16px;
        padding-right: 40px;

        .reg {
          font-size: 14px;
          color: #ff6b00;
          line-height: 18px;
          margin-right: 8px;
        }

        .yuan {
          display: flex;
          align-items: center;
          justify-content: center;
          background-image: linear-gradient(-270deg, #ff8720 0%, #ff6241 100%);
          border-radius: 8px;
          width: 16px;
          height: 16px;

          .icon {
            font-size: 10px;
            color: #fff;
          }
        }
      }
    }
  }

  .login-footer {
    display: flex;
    flex-direction: column;
    width: 1200px;

    .introduce {
      display: flex;
      flex-direction: row;
      border-bottom: solid 1px #e5e5e5;

      .item {
        flex: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 108px;

        .l {
          margin-left: 60px;
          width: 48px;
          height: 48px;
          background: #f6f6f6;
          margin-right: 8px;
        }

        .r {
          display: flex;
          flex-direction: column;
          justify-content: center;

          .title {
            font-size: 20px;
            color: #262626;
            line-height: 24px;
            margin: 2px;
          }

          .content {
            font-size: 14px;
            color: #999999;
            line-height: 18px;
            margin: 2px;
          }
        }
      }
    }

    .tag {
      display: flex;
      flex-direction: row;
      margin: 32px 0;

      .l {
        width: 875px;
        height: 183px;
        border-right: solid 1px #e5e5e5;
        padding-right: 40px;

        .row {
          display: flex;
          flex-direction: row;
          list-style: none;

          .row-item {
            flex: 1;
            list-style: none;

            .title {
              font-size: 14px;
              color: #262626;
              line-height: 18px;
              font-weight: bold;
            }

            .col {
              margin-top: 18px;
              list-style: none;
              padding: 0;

              .col-item {
                list-style: none;
                font-size: 12px;
                color: #6a707d;
                line-height: 16px;
                margin-bottom: 10px;
                max-width: 120px;

                a {
                  color: #6a707d;
                  display: block;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  /* 无用 */

                  &:active {
                    color: #9a9ea8;
                  }

                  &:hover {
                    color: #ff6b00;
                  }
                }
              }
            }
          }
        }
      }

      .r {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        padding: 0 40px;

        .cs {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          width: 100%;
          align-items: center;

          .contact {
            display: flex;
            flex-direction: column;

            .tel {
              font-family: DINAlternate-Bold;
              font-size: 24px;
              line-height: 24px;
              color: #262626;
            }

            .work-time {
              font-family: PingFangSC-Regular;
              font-size: 12px;
              color: #6a707d;
              letter-spacing: 0.6px;
            }
          }
        }

        .qrcode {
          margin-top: 32px;
          display: flex;
          flex-direction: row;

          .item {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;

            .qrcode-pic {
              width: 80px;
              height: 80px;
              border: solid 1px #e5e5e5;
              margin: 0 20px;
              border-right: 4px;
              background: #fff;
            }

            .name {
              margin-top: 4px;
              font-size: 12px;
              color: #6a707d;
              line-height: 16px;
            }
          }
        }
      }
    }
  }

  .footer {
    width: 100%;
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
// @media screen and (max-width: 1920px) {
//   .login-content {
//     height: 820px !important;
//   }
// }
// @media screen and (max-width: 1440px) {
//   .login-content {
//     height: 590px !important;
//   }
// }
.forgetpasswd {
  color: #ff6b00;
  cursor: pointer;
  margin-left: 40px;
}
</style>
