<template>
  <section class="Cashier">
    <div class="content">
      <div class="content_1">
        <div class="left">
          <img class="img" :src="require('@/assets/images/user/单号@2x.png')" alt />
          <!-- <span>交易单号: {{ this.$route.params.orderNo }}</span> -->
        </div>
        <div class="right">
          结算金额:
          <span>59800</span>
          元
        </div>
      </div>
      <div class="content_2">
        <span></span>
        <span>订单明细</span>
      </div>
      <div class="content_3"></div>
      <div class="content_4">
        <table class="table">
          <tr class="table_1">
            <th width="35%" class="th1">
              <span>序号</span>
            </th>
            <th width="30%" class="th2">
              <span>说明</span>
            </th>
            <th width="35%" class="th3">
              <span>金额(元)</span>
            </th>
          </tr>
          <tr class="tableTr" v-for="(item, index) in itemVOS" :key="index">
            <td class="td1">
              <span>{{ item.equityName }}</span>
            </td>
            <td class="td2">
              <span>一年</span>
            </td>
            <td class="td3">
              <span>{{ item.packageDiscountPrice }}</span>
            </td>
          </tr>
          <tr class="tableTr Rspan">
            <td class="td1 Tdnode" colspan>
              <span>1</span>
            </td>
            <td class="td2 Tdnode" colspan>
              <span>行业头部企业战略合作套餐</span>
            </td>
            <td class="td3 Tdnode" colspan>
              <span>59800</span>
            </td>
          </tr>
        </table>
      </div>
      <div class="content_5">
        <div class="c_left">
          <img class="img" :src="require('@/assets/images/user/xxx.png')" alt />
        </div>
        <div class="c_right">
          <div class="right_1">注意事项</div>
          <p class="tips-text">系统暂时只支持线下支付,付款要求及付款信息如下:</p>
          <p>1、请按结算金额如实付款</p>
          <p>2、在【汇款用途】，【摘要】，【附言】等位置，标明：“套餐费”</p>
          <p>3、如有疑问请咨询客服：400-900-7186</p>
          <div class="right_2">
            <div class="item">
              <div class="key">开户行：</div>
              <div class="val">兴业银行天津城厢支行</div>
            </div>
            <div class="item">
              <div class="key">账户名称：</div>
              <div class="val">叮当 (天津) 电子商务有限公司</div>
            </div>
            <div class="item">
              <div class="key">账号：</div>
              <div class="val">441260100100159245</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  created() {
    this.price = this.$route.query.price
    this.name = this.$route.query.name
    this.BindData()
  },
  data() {
    return {
      price: '',
      name: '',
      sumAmount: '0.00',
      itemVOS: []
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.Cashier {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f6f6f6;

  .content {
    overflow: hidden;
    width: 1000px;
    border-radius: 8px;
    background: #fff;
    color: #262626;
    margin: 20px 0;
    padding: 0 24px;
    font-family: PingFangSC-Regular;
    font-size: 14px;

    letter-spacing: 0;

    .content_1 {
      height: 40px;
      display: flex;
      justify-content: space-between;
      margin-top: 39px;
      margin: bottom 44px;
      font-weight: bold;

      .left {
        .img {
          width: 40px;
          height: 40px;
          vertical-align: middle;
        }
        & > span {
          vertical-align: middle;
          font-family: PingFangSC-Medium;
          font-size: 22px;
          font-weight: bold;
          color: #333333;

          letter-spacing: 0;
          margin-left: 20px;
        }
      }
      .right {
        font-family: PingFangSC-Regular;
        color: #333333;
        & > span {
          font-family: PingFangSC-Medium;
          font-size: 26px;
          color: #ff6b00;
          letter-spacing: 0;
        }
      }
    }
    .content_2 {
      margin-top: 44px;
      font-family: PingFangSC-Semibold;
      font-size: 14px;
      color: #262626;
      line-height: 18px;
      font-weight: bold;
      & > :nth-of-type(1) {
        display: inline-block;
        width: 4px;
        height: 16px;
        background-image: linear-gradient(-180deg, #ff8323 0%, #ff663e 100%);
        border-radius: 2px;
        vertical-align: middle;
      }
      & > :nth-of-type(2) {
        display: inline-block;
        margin-left: 8px;
        vertical-align: middle;
      }
    }
    .content_3 {
      margin-top: 8.8px;
      border-bottom: 1px solid #e5e5e5;
    }
    .content_4 {
      margin-top: 17.2px;
      .table {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #262626;
        letter-spacing: 0;
        line-height: 18px;
        width: 100%;

        .table_1 {
          width: 100%;
          border: 1px solid #e5e5e5;
          height: 48px;
          background: #f9f9f9;
        }
        td {
          border: 1px solid #e5e5e5;
        }
        .tableTr {
          border: 1px solid #e5e5e5;
          height: 48px;
          .td1 {
            text-align: left;
            padding-left: 32px;
          }
          .td2 {
            text-align: center;
          }
          .td3 {
            text-align: right;
            padding-right: 38px;
          }
          .Tdnode {
            border: none;
          }
        }
        .th1 {
          text-align: left;
          padding-left: 32px;
          font-family: PingFangSC-Medium;
          color: #262626;
          font-weight: bold;
        }
        .th2 {
          text-align: center;
          color: #262626;
          font-weight: bold;
        }
        .th3 {
          text-align: right;
          padding-right: 38px;
          color: #262626;
          font-weight: bold;
        }
        .Rspan {
          position: relative;
        }
        .Aspan {
          position: absolute;
          right: 0;
          top: 16px;
          & > span {
            color: #ff6b00;
          }
        }
      }
    }
    .content_5 {
      margin-top: 40px;
      margin-bottom: 24px;
      height: 296px;
      padding-left: 24px;
      background: rgba(255, 107, 0, 0.1);
      display: flex;

      .c_left {
        margin-top: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 18px;
        }
      }
      .c_right {
        margin-top: 24px;
        margin-left: 11px;
        .right_1 {
          width: 80px;
          height: 24px;
          font-family: PingFangSC-Medium;
          font-size: 20px;
          color: #ff6b00;
          letter-spacing: 0;
          line-height: 24px;
          font-weight: bold;
        }
        & > {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          letter-spacing: 0;
          // line-height: 24px;
          font-weight: 500;
        }

        .tips-text {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #ff6b00;
          letter-spacing: 0;
          line-height: 24px;
          margin-top: 16px;
          margin-bottom: 10px;
        }
        & > p {
          font-family: PingFangSC-Regular;
          line-height: 20px;
          font-size: 14px;
          color: #262626;
          margin-bottom: 0;
        }
        .right_2 {
          margin-top: 9px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 410px;
          height: 108px;
          background: #ff6b00;
          border-radius: 8px;
          padding: 0 26.4px;
          .item {
            display: flex;
            flex-direction: row;
            align-items: center;
            .key {
              width: 81px;
              font-family: PingFangSC-Regular;
              font-size: 14px;
              line-height: 26px;
              color: #ffffff;
            }
            .val {
              font-family: PingFangSC-Medium;
              font-size: 14px;
              line-height: 26px;
              color: #ffffff;
            }
          }
        }
      }
    }
  }
}
</style>
