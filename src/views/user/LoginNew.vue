<template>
  <section class="login-index">
    <div class="login-content">
      <div class="login-box">
        <div class="form-box">
          <div class="login-head">
            <a :class="{ sel: index === 0, title: true }" @click="EditIndex(0)"
            >手机登录
              <div class="line"></div
              ></a>
            <a :class="{ sel: index === 1, title: true }" @click="EditIndex(1)"
            >密码登录
              <div class="line"></div
              ></a>
          </div>
          <div class="form">
            <div class="login-input-box">
              <a-input class="login-input" size="large" placeholder="请输入用户名/手机号" />
            </div>
            <div class="check">
              <a-input class="login-input" size="large" placeholder="请输入验证码">
                <template #suffix>
                  <div>
                    <a>发送验证码</a>
                  </div>
                </template>
              </a-input>
            </div>
            <div v-if="index === 0" class="login-input-box"></div>
            <div v-if="index === 1" class="login-input-box">
              <a-input class="login-input" size="large" placeholder="请输入密码" />
            </div>
          </div>
          <a-button class="btn" type="primary" block size="large" html-type="submit"> 登录 </a-button>
          <div class="other">
            <div class="l">忘记密码</div>
            <div class="r">忘记密码</div>
          </div>
        </div>
        <div class="reg-box">
          <div class="flex1"></div>
          <div class="reg">注册账号</div>
          <div class="yuan">
            <RightOutlined class="icon" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data () {
    return {
      index: 0
    }
  },
  methods: {
    EditIndex(val) {
      this.index = val
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

  .login-content {
    width: 100%;
    height: 544px;
    // background: url(../../assets/images/loginbg.png) no-repeat center;
    background-size: 100%;
    min-width: 1280px;
    padding: 80px 302px;

    .login-box {
      display: flex;
      flex-direction: column;
      width: 400px;
      height: 384px;
      background: #fff;
      border-radius: 16px;
      margin-left: auto;

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
            background: #f6f6f6;
            border-radius: 4px;
            margin-bottom: 16px;
            height: 36px;
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

          .online {
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
}
</style>
