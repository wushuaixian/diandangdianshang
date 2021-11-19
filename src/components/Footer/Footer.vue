<template>
  <div class="login-footer">
    <div class="introduce">
      <div class="item">
        <div class="l">正</div>
        <div class="r">
          <div class="title">正品保障</div>
          <div class="content">正品行货、品类齐全</div>
        </div>
      </div>
      <div class="item">
        <div class="l">专</div>
        <div class="r">
          <div class="title">专业优势</div>
          <div class="content">专业服务、所托必达</div>
        </div>
      </div>
      <div class="item">
        <div class="l">售</div>
        <div class="r">
          <div class="title">售后无忧</div>
          <div class="content">退换无忧、维修无忧</div>
        </div>
      </div>
      <div class="item">
        <div class="l">阳</div>
        <div class="r">
          <div class="title">阳光采购</div>
          <div class="content">阳光采购、一站服务</div>
        </div>
      </div>
    </div>
    <div class="tag">
      <div class="l">
        <ul class="row">
          <li class="row-item">
            <div class="title">电子招标</div>
            <ul class="col">
              <li class="col-item"><a>微招标</a></li>
            </ul>
          </li>
          <li class="row-item">
            <div class="title">金融中心</div>
            <ul class="col">
              <li class="col-item"><a>支付结算</a></li>
              <li class="col-item"><a>区块链</a></li>
              <li class="col-item"><a>智能风控</a></li>
              <li class="col-item"><a>数字资产</a></li>
            </ul>
          </li>
          <li class="row-item">
            <div class="title">数据中心</div>
            <ul class="col">
              <li class="col-item"><a>数据中心</a></li>
            </ul>
          </li>
          <li class="row-item">
            <div class="title">数据仓储</div>
            <ul class="col">
              <li class="col-item"><a>数据仓储</a></li>
            </ul>
          </li>
          <li class="row-item">
            <div class="title">关于叮当</div>
            <ul class="col">
              <li class="col-item"><a>公司简介</a></li>
              <li class="col-item"><a>企业文化</a></li>
              <li class="col-item"><a>发展历程</a></li>
              <li class="col-item"><a>联系我们</a></li>
            </ul>
          </li>
          <li class="row-item">
            <div class="title">新闻中心</div>
            <ul class="col">
              <li class="col-item"><a>公司新闻</a></li>
              <li class="col-item"><a>行业新闻</a></li>
            </ul>
          </li>
          <li class="row-item">
            <div class="title">平台规则</div>
            <ul class="col">
              <li class="col-item"><a>会员注册规则</a></li>
              <li class="col-item"><a>隐私权和商业机密保护隐私权和商业机密保护</a></li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="r">
        <div class="cs">
          <div class="contact">
            <div class="tel">400-900-7186</div>
            <div class="work-time">周一至周日 8:00-18:00</div>
          </div>
          <div class="online">
            <div></div>
            <div>在线客服</div>
          </div>
        </div>
        <div class="qrcode">
          <div class="item">
            <img class="qrcode-pic" :src="require('@/assets/images/login/qrcode.png')" alt="" />
            <div class="name">官方微信</div>
          </div>
          <div class="item">
            <img class="qrcode-pic" :src="require('@/assets/images/login/qrcode.png')" alt="" />
            <div class="name">移动客户端</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
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
        width: 68px;
        height: 68px;
        margin-right: 8px;
        background-image: url(../../assets/images/login/login_tag_outline.png);
        background-size: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: PingFangSC-Medium;
        font-size: 20px;
        color: #ff6b00;
        text-align: center;
        padding-bottom: 8px;
        padding-left: 2px;
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
            border-radius: 4px;
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
</style>
