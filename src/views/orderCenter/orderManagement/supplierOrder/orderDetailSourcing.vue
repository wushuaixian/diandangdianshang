<template>
  <section class="add-order">
    <div class="item-box"><Header :disableds="disableds" @resetOrder="resetOrder" :form="form" /></div>
    <div class="item-box">
      <header-title class="title"><span>基础信息</span></header-title>
      <Basic :form="form" />
    </div>
    <div class="item-box">
      <header-title class="title"><span>物料明细</span></header-title>
      <Material ref="materialList" :disableds="true" :form="form" />
    </div>
    <div class="item-box">
      <header-title class="title"><span>付款方式</span></header-title>
      <Payment ref="paymentform" :disableds="true" :form="form" />
    </div>
    <div class="item-box">
      <header-title class="title"><span>收货地址</span></header-title>
      <Address :form="form" :disableds="true" type="DEFAULT" />
    </div>
    <div class="item-box">
      <header-title class="title"><span>发票信息</span></header-title>
      <Invoice :disableds="true" :form="form" />
    </div>
    <div class="item-box">
      <header-title class="title"><span>发票地址信息</span></header-title>
      <Address :disableds="true" :form="form" type="INVOICE" />
    </div>
    <div class="foot-btn">
      <a-button class="btns" @click="$router.back(-1)">返回</a-button>
    </div>
  </section>
</template>

<script>
import { Header, Basic, Material, Payment, Address, Invoice } from './components/orderDetailSourcingComponents'
import * as api from '@/api/orderCenter'
export default {
  components: { Payment, Address, Invoice, Header, Basic, Material },
  props: {
    disableds: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.$emit('update:disableds', this.disableds ? true : this.$route.query?.type === 'read')
    this.form.purchaseOrderSource = Number(this.$route.query.purchaseOrderSource)
    this.BindData()
  },
  data() {
    return {
      form: {
        remark: '',
        orderCanceOperateId: '', // 取消人
        orderLabel: '',
        purchaseOrderSource: null, // 订单来源（1.计划  2.待下单 3.项目 4.合同 5.新增 6.点选）
        confirmStatus: null, // 订单状态（1011 保存，1030 提交）
        contact: '', // 联系人
        contactInformation: '', // 联系方式
        isQuality: 0, // 是否优质优价(0.否 1.是)
        isJinGauging: 0, // 是否检斤检尺(0.否 1.是)
        qualityRetentionMoney: '', // 质保金
        qualityRetentionPeriod: '', // 质保期
        jinGaugingStartDate: null, // 检斤开始时间(yyyy-mm-dd hh:mm:ss)
        jinGaugingEndDate: null, // 检斤结束时间(yyyy-mm-dd hh:mm:ss)
        customerRemark: '', // 订单备注(用户)
        planItemCode: '', // 采购计划编码
        merchantId: null, // 供应商ID
        merchantName: '', // 供应商名称
        storeId: null, // 供应商商铺ID
        storeName: '', // 供应商商铺名称

        deliveryDate: null, // 预计发货日期(yyyy-MM-dd)
        productTotalAmount: '', // 订单合计
        // 付款相关
        manualOrderPaymentList: [
          {
            contractCode: '', // 合同编号
            paymentName: '', // 付款名称
            paymentType: 1, // 付款方式(1:账期 2:分阶段)
            payType: 1, // 支付方式(1:电汇 2:承兑汇票 3:两者都是)
            paymentDaysType: 1, // 结算账期类型(1:每年 2:每季度 3:每月 4:每周 5:每日 6:自定义)
            month: null, // 每月 每周 使用
            day: null, // 结算账期类型 使用
            phasePayment: [
              { type: 1, day: '', percent: '' },
              { type: 2, day: '', percent: '' },
              { type: 3, day: '', percent: '' },
              { type: 4, day: '', percent: '' }
            ] // 分阶段付款设置JSON
          }
        ],
        userAddressId: null, // 收货地址ID
        consigneeName: '', // 收货人姓名
        consigneePhone: '', // 收货人手机
        goodReceiverProvinceCode: '', // 收货人省份code
        goodReceiverProvince: '', // 收货人省份
        goodReceiverCityCode: '', // 收货人城市code
        goodReceiverCity: '', // 收货人城市
        goodReceiverAreaCode: '', // 收货人四级区域code
        goodReceiverArea: '', // 收货人四级区域
        receiveDetailAddress: '', // 详细地址
        // 发票信息
        manualOrderInvoiceVo: {
          invoiceAddressId: null, // 发票地址ID
          invoiceId: null, // 发票id
          invoiceType: 1, // 发票类型（1:增值税普通发票，2:增值税专用发票）
          dutyParagraph: '', // 纳税人识别号
          bankDeposit: '', // 开户银行
          bankAccount: '', // 开户行账号
          buyerTel: '', // 电话
          detailAddress: '', // 注册地址
          userName: '', // 收票人
          mobile: '', // 收票手机号
          countryCode: '', // 收票地址-国家code
          provinceCode: '', // 省份code
          cityCode: '', // 城市code
          regionCode: '', // 区域code
          province: '',
          city: '',
          region: '',
          exactAddress: '' // 收票地址-详细地址
        },
        // 物料信息
        manualOrderItemVOList: []
      },
      saveLoading: false,
      submitLoading: false
    }
  },
  methods: {
    BindData() {
      api.getOrderDetail(this.$route.query.orderCode).then((res) => {
        console.log(res)
        if (res.code === '0') {
          const form = {
            remark: res.data.so.remark,
            extField3: res.data.so.extField3,
            extField4: res.data.so.extField4,
            orderCanceOperateId: res.data.so.orderCanceOperateId,
            orderLabel: res.data.so.orderLabel,
            id: res.data.so.id,
            purchaseOrderSource: res.data.so.purchaseOrderSource, // 订单来源（1.计划  2.待下单 3.项目 4.合同 5.新增 6.点选）
            confirmStatus: res.data.so.orderStatusCode, // 订单状态（1011 保存，1030 提交）
            contact: res.data.so.contact, // 联系人
            contactInformation: res.data.so.contactInformation, // 联系方式
            isQuality: 0, // 是否优质优价(0.否 1.是)
            isJinGauging: 0, // 是否检斤检尺(0.否 1.是)
            qualityRetentionMoney: '', // 质保金
            qualityRetentionPeriod: '', // 质保期
            jinGaugingStartDate: null, // 检斤开始时间(yyyy-mm-dd hh:mm:ss)
            jinGaugingEndDate: null, // 检斤结束时间(yyyy-mm-dd hh:mm:ss)
            customerRemark: '', // 订单备注(用户)
            planItemCode: res.data.so.planItemCode, // 采购计划编码
            merchantId: res.data.so.merchantId, // 供应商ID
            merchantName: res.data.so.merchantName, // 供应商名称
            storeId: null, // 供应商商铺ID
            storeName: '', // 供应商商铺名称
            createTime: res.data.so.createTime,
            orderCode: res.data.so.orderCode,
            deliveryDate: null, // 预计发货日期(yyyy-MM-dd)
            productTotalAmount: res.data.so.orderAmount, // 订单合计
            purchaseOrderSourceStr: res.data.so.purchaseOrderSourceStr, // 订单来源名称
            orderTypeStr: res.data.so.orderTypeStr, // 订单类型
            userName: res.data.so.userName, // 创建人
            orderRemarkUser: res.data.so.orderRemarkUser, // 订单备注
            // 付款相关
            manualOrderPaymentList: [
              {
                id: res.data.so?.soPaymentDTOList?.length > 0 ? res.data.so?.soPaymentDTOList[0]?.id : null, // 付款ID
                contractCode: '', // 合同编号
                paymentName:
                  res.data.so?.soPaymentDTOList?.length > 0 ? res.data.so?.soPaymentDTOList[0]?.paymentName : null, // 付款名称
                paymentType:
                  res.data.so?.soPaymentDTOList?.length > 0 ? res.data.so?.soPaymentDTOList[0]?.paymentType : null, // 付款方式(1:账期 2:分阶段)
                payType: res.data.so?.soPaymentDTOList?.length > 0 ? res.data.so?.soPaymentDTOList[0]?.payType : null, // 支付方式(1:电汇 2:承兑汇票 3:两者都是)
                paymentDaysType:
                  res.data.so?.soPaymentDTOList?.length > 0 ? res.data.so?.soPaymentDTOList[0]?.paymentDaysType : null, // 结算账期类型(1:每年 2:每季度 3:每月 4:每周 5:每日 6:自定义)
                month: res.data.so?.soPaymentDTOList?.length > 0 ? res.data.so?.soPaymentDTOList[0]?.month : null, // 每月 每周 使用
                day: res.data.so?.soPaymentDTOList?.length > 0 ? res.data.so?.soPaymentDTOList[0]?.day : null, // 结算账期类型 使用
                phasePayment:
                  res.data.so?.soPaymentDTOList?.length > 0 &&
                  typeof res.data.so?.soPaymentDTOList[0]?.phasePayment === 'string'
                    ? JSON.parse(res.data.so?.soPaymentDTOList[0]?.phasePayment)
                    : res.data.so?.soPaymentDTOList?.length > 0 &&
                      typeof res.data.so?.soPaymentDTOList[0]?.phasePayment !== 'string'
                    ? res.data.so?.soPaymentDTOList[0]?.phasePayment
                    : null // 分阶段付款设置JSON
              }
            ],
            userAddressId: res.data.so?.userAddressId,
            consigneeName: res.data.so.goodReceiverName, // 收货人姓名
            consigneePhone: res.data.so.goodReceiverMobile, // 收货人手机
            goodReceiverProvinceCode: res.data.so.goodReceiverProvinceCode, // 收货人省份code
            goodReceiverProvince: res.data.so.goodReceiverProvince, // 收货人省份
            goodReceiverCityCode: res.data.so.goodReceiverCityCode, // 收货人城市code
            goodReceiverCity: res.data.so.goodReceiverCity, // 收货人城市
            goodReceiverAreaCode: res.data.so.goodReceiverAreaCode, // 收货人四级区域code
            goodReceiverArea: res.data.so.goodReceiverArea, // 收货人四级区域
            receiveDetailAddress: res.data.so.goodReceiverAddress, // 详细地址
            // 发票信息
            manualOrderInvoiceVo: {
              invoiceAddressId: res.data.so.soInvoiceDTO?.invoiceAddressId,
              invoiceId: res.data.so?.soInvoiceDTO?.id, // 发票id
              invoiceType: res.data.so.soInvoiceDTO?.invoiceType, // 发票类型（1:增值税普通发票，2:增值税专用发票）
              dutyParagraph: res.data.so.soInvoiceDTO?.taxpayerIdentificationCode, // 纳税人识别号
              bankDeposit: res.data.so.soInvoiceDTO?.bankDeposit, // 开户银行
              bankAccount: res.data.so.soInvoiceDTO?.bankAccount, // 开户行账号
              buyerTel: res.data.so.soInvoiceDTO?.registerPhone, // 电话
              detailAddress: res.data.so.soInvoiceDTO?.registerAddress, // 注册地址
              userName: res.data.so.soInvoiceDTO?.goodReceiverName, // 收票人
              mobile: res.data.so.soInvoiceDTO?.goodReceiverMobile, // 收票手机号
              countryCode: '', // 收票地址-国家code
              provinceCode: res.data.so.soInvoiceDTO?.goodReceiverProvince, // 省份code
              cityCode: res.data.so.soInvoiceDTO?.goodReceiverCity, // 城市code
              regionCode: res.data.so.soInvoiceDTO?.goodReceiverArea, // 区域code
              province: res.data.so.soInvoiceDTO?.goodReceiverProvinceName, // 省份
              city: res.data.so.soInvoiceDTO?.goodReceiverCityName, // 城市
              region: res.data.so.soInvoiceDTO?.goodReceiverAreaName, // 区域
              exactAddress: res.data.so.soInvoiceDTO?.goodReceiverAddress // 收票地址-详细地址
            },
            // 物料信息
            manualOrderItemVOList: []
          }
          // console.log(JSON.stringify(form))
          // console.log(form.manualOrderPaymentList, 'asdasdasd')
          this.form = { ...form, ...{ newForm: res?.data?.so } }
        }
      })
    },
    async Cancel() {
      const res = await api.setCancelBuyerOrder({
        id: this.form.id,
        orderCode: this.$route.query?.orderCode,
        orderCanceOperateType: 0,
        cancelSource: 0
      })
      if (res.code === '0') {
        this.$notification.success({
          message: '取消订单成功'
        })
        this.BindData()
      } else {
        this.$notification.error({
          message: '取消订单失败',
          description: res.message
        })
      }
    },
    Save(confirmStatus) {
      this.validate(() => {
        confirmStatus === 1011 ? (this.saveLoading = true) : (this.submitLoading = true)
        const formData = {
          orderStatus: confirmStatus,
          orderCode: this.$route?.query?.orderCode,
          userAddressId: this.form.userAddressId,
          goodReceiverAddress: this.form.receiveDetailAddress,
          goodReceiverName: this.form.consigneeName,
          goodReceiverMobile: this.form.consigneePhone,
          goodReceiverProvince: this.form.goodReceiverProvince,
          goodReceiverCity: this.form.goodReceiverCity,
          goodReceiverArea: this.form.goodReceiverArea,
          goodReceiverProvinceCode: this.form.goodReceiverProvinceCode,
          goodReceiverCityCode: this.form.goodReceiverCityCode,
          goodReceiverAreaCode: this.form.goodReceiverAreaCode,

          soInvoiceDTO: {
            id: this.form.manualOrderInvoiceVo.invoiceId,
            invoiceAddressId: this.form.manualOrderInvoiceVo.invoiceAddressId,
            invoiceType: this.form.manualOrderInvoiceVo.invoiceType,
            taxpayerIdentificationCode: this.form.manualOrderInvoiceVo.dutyParagraph,
            bankDeposit: this.form.manualOrderInvoiceVo.bankDeposit,
            bankAccount: this.form.manualOrderInvoiceVo.bankAccount,
            registerPhone: this.form.manualOrderInvoiceVo.buyerTel,
            registerAddress: this.form.manualOrderInvoiceVo.detailAddress,
            invoiceGoodReceiverAddress: this.form.manualOrderInvoiceVo.exactAddress,
            invoiceGoodReceiverName: this.form.manualOrderInvoiceVo.userName,
            invoiceGoodReceiverMobile: this.form.manualOrderInvoiceVo.mobile,
            invoiceGoodReceiverProvince: this.form.manualOrderInvoiceVo.provinceCode,
            invoiceGoodReceiverCity: this.form.manualOrderInvoiceVo.cityCode,
            invoiceGoodReceiverArea: this.form.manualOrderInvoiceVo.regionCode,
            goodReceiverProvinceName: this.form.manualOrderInvoiceVo.province,
            goodReceiverCityName: this.form.manualOrderInvoiceVo.city,
            goodReceiverAreaName: this.form.manualOrderInvoiceVo.region
          },
          soPaymentDTOList: [
            {
              paymentType: this.form.manualOrderPaymentList[0].paymentType,
              payType: this.form.manualOrderPaymentList[0].payType,
              paymentName: this.form.manualOrderPaymentList[0].paymentName,
              paymentDaysType: this.form.manualOrderPaymentList[0].paymentDaysType,
              month: this.form.manualOrderPaymentList[0].month,
              day: this.form.manualOrderPaymentList[0].day,
              phasePayment: JSON.stringify(this.form.manualOrderPaymentList[0].phasePayment)
            }
          ]
        }
        api.setEditOrder(formData).then((res) => {
          this.saveLoading = false
          this.submitLoading = false
          if (res.code === '0') {
            this.$notification.success({
              message: `${confirmStatus === 1011 ? '保存' : '提交'}成功`
            })
            this.BindData()
          } else {
            this.$notification.error({
              message: `${confirmStatus === 1011 ? '保存' : '提交'}失败`,
              description: res.message
            })
          }
        })
      })
    },
    validate(callback) {
      const form = this.form
      const phasePayment = form.manualOrderPaymentList[0].phasePayment
      if (form.manualOrderPaymentList[0].paymentType === 2) {
        if (phasePayment.length > 0) {
          for (let i = 0; i < phasePayment.length; i++) {
            if (phasePayment[i].day === '' || !phasePayment[i].day) {
              this.$message.warning('请填写付款方式中的付款时间')
              return
            }
            if (phasePayment[i].percent === '' || !phasePayment[i].percent) {
              this.$message.warning('请填写付款方式中的付款比例')
              return
            }
          }
        }
      } else {
        this.$refs.paymentform.$refs.paymentforms.validate((valid) => {
          if (!valid) {
            return false
          }
        })
      }
      if (form.consigneeName === '') {
        this.$message.warning('请选择收货地址')
        return
      }
      if (form.manualOrderInvoiceVo.invoiceId === null) {
        this.$message.warning('请填写发票信息')
        return
      }
      if (form.manualOrderInvoiceVo.userName === '') {
        this.$message.warning('请选择发票地址')
        return
      }
      callback()
    },
    resetOrder() {
      this.BindData()
    }
  }
}
</script>

<style lang="less" scoped>
.add-order {
  display: flex;
  flex-direction: column;
  padding-bottom: 48px;
  .item-box {
    background: #ffffff;
    border-radius: 8px;
    padding: 26px 24px;
    margin-bottom: 20px;
    transition: all 0.3s;
    &:hover {
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    }
  }
  .foot-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: fixed;
    z-index: 10;
    bottom: 0;
    right: 0;
    height: 64px;
    background: #fff;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    width: calc(100% - 256px);
    .btns {
      margin: 10px;
      height: 40px !important;
      width: 100px !important;
    }
  }
}
</style>
