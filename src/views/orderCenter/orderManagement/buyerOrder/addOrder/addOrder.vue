<template>
  <section class="add-order">
    <div class="item-box">
      <header-title class="title"><span>基础信息</span></header-title>
      <Basic ref="basicform" :form="form" />
    </div>
    <div class="item-box">
      <header-title class="title"><span>物料信息</span></header-title>
      <Material :form="form" />
    </div>
    <div class="item-box">
      <header-title class="title"><span>付款方式</span></header-title>
      <Payment ref="paymentform" :form="form" />
    </div>
    <div class="item-box">
      <header-title class="title"><span>收货地址</span></header-title>
      <Address :form="form" type="DEFAULT" />
    </div>
    <div class="item-box">
      <header-title class="title"><span>发票信息</span></header-title>
      <Invoice :form="form" />
    </div>
    <div class="item-box">
      <header-title class="title"><span>发票地址信息</span></header-title>
      <Address :form="form" type="INVOICE" />
    </div>
    <div class="foot-btn">
      <a-button class="btns" @click="$router.back(-1)">返回</a-button>
      <a-button class="btns" type="primary" @click="Save(1011)" :loading="saveLoading">保存</a-button>
      <a-button class="btns" type="primary" @click="Save(1030)" :loading="submitLoading">提交</a-button>
    </div>
  </section>
</template>

<script>
import { Basic, Material, Payment, Address, Invoice } from './components/index'
import * as api from '@/api/orderCenter'
import moment from 'moment'
export default {
  components: { Basic, Material, Payment, Address, Invoice },
  created() {
    this.form.purchaseOrderSource = Number(this.$route.query.purchaseOrderSource)
    this.form.purchaseOrderSourceType = Number(this.$route.query.purchaseOrderSource)
    this.form.orderSysSource = [1, 5].includes(Number(this.$route.query.purchaseOrderSource)) ? 220002 : 220001
  },
  data() {
    return {
      saveLoading: false,
      submitLoading: false,
      form: {
        orderSysSource: '',
        purchaseOrderSourceType: null,
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
          goodReceiverProvinceName: '',
          goodReceiverCityName: '',
          goodReceiverAreaName: '',
          exactAddress: '' // 收票地址-详细地址
        },
        // 物料信息
        manualOrderItemVOList: []
      }
    }
  },
  methods: {
    Save(confirmStatus) {
      this.formValidate(() => {
        const { form } = this
        const data = {
          ...form,
          manualOrderItemVOList: form?.manualOrderItemVOList?.map((x) => {
            return {
              ...x,
              qualityRetentionPeriod: x?.qualityRetentionPeriod || form?.qualityRetentionPeriod
            }
          })
        }
        const formData = JSON.parse(JSON.stringify(data))
        formData.confirmStatus = confirmStatus
        formData.jinGaugingEndDate = formData.jinGaugingEndDate
          ? `${moment(formData.jinGaugingEndDate).format('yyyy-MM-DD')} 00:00:00`
          : null
        formData.jinGaugingStartDate = formData.jinGaugingStartDate
          ? `${moment(formData.jinGaugingStartDate).format('yyyy-MM-DD')} 00:00:00`
          : null
        formData.manualOrderPaymentList[0].phasePayment = JSON.stringify(
          formData.manualOrderPaymentList[0].phasePayment
        )
        formData.manualOrderItemVOList.map((x) => ({
          ...x,
          deliveryTime: x.deliveryTime ? `${moment(x.deliveryTime).format('yyyy-MM-DD')} 00:00:00` : null
        }))
        if (confirmStatus === 1011) {
          this.saveLoading = true
        } else {
          this.submitLoading = true
        }
        formData.manualOrderInvoiceVo.buyerTel = formData.manualOrderInvoiceVo.mobileNo
        api.setAddOrder(formData).then((res) => {
          this.saveLoading = false
          this.submitLoading = false
          if (res.code === '0') {
            this.$notification.success({
              message: `${confirmStatus === 1011 ? '保存' : '提交'}成功`
            })
            this.$router.push({ name: 'orderManagementBuyerOrderList' })
          } else {
            this.$notification.error({
              message: `${confirmStatus === 1011 ? '保存' : '提交'}失败`,
              description: res.message
            })
          }
        })
      })
    },
    formValidate(callback) {
      this.$refs.basicform.$refs.basicforms.validate((valid) => {
        if (valid) {
          if (this.form.manualOrderPaymentList[0].paymentType === 2) {
            this.validate(() => {
              callback()
            })
          } else {
            this.$refs.paymentform.$refs.paymentforms.validate((valid) => {
              if (valid) {
                this.validate(() => {
                  callback()
                })
              }
            })
          }
        } else {
          this.$refs.paymentform.$refs.paymentforms.validate()
        }
      })
    },
    /**
     * 验证表单外内容
     * @param {Function} callback 成功回调
     */
    validate(callback) {
      const form = this.form
      const phasePayment = form.manualOrderPaymentList[0].phasePayment
      if (form.manualOrderPaymentList[0].paymentType === 2) {
        if (phasePayment.length > 0) {
          let count = 0
          for (let i = 0; i < phasePayment.length; i++) {
            count += Number(phasePayment[i].percent)
            if (phasePayment[i].day === '' || !phasePayment[i].day) {
              this.$message.warning('请填写付款方式中的付款时间')
              return
            }
            if (phasePayment[i].percent === '' || !phasePayment[i].percent) {
              this.$message.warning('请填写付款方式中的付款比例')
              return
            }
          }
          if (count !== 100) {
            this.$message.warning('分阶段付款方式的付款占比和需为100%')
            return
          }
        }
      }
      if (form.manualOrderItemVOList.length > 0) {
        for (let i = 0; i < form.manualOrderItemVOList.length; i++) {
          const item = form.manualOrderItemVOList[i]
          // const materialCode = item.materialCode !== '' && item.materialCode !== null
          const materialName = item.materialName !== '' && item.materialName !== null
          // const saleAttribute = item.saleAttribute !== '' && item.saleAttribute !== null
          // const brandName = item.brandName !== '' && item.brandName !== null
          const mainUnitName = item.mainUnitName !== '' && item.mainUnitName !== null
          const productItemNum = item.productItemNum !== '' && item.productItemNum !== null
          const salePriceWithTax = item.salePriceWithTax !== '' && item.salePriceWithTax !== null
          const taxRate = item.taxRate !== '' && item.taxRate !== null
          // const productTotalAmount = item.productTotalAmount !== '' && item.productTotalAmount !== null
          // const deliveryTime = item.deliveryTime !== '' && item.deliveryTime !== null
          if (form.purchaseOrderSource === 1) {
            if (!productItemNum) {
              this.$message.warning(`请填写物料第${i + 1}条的“数量”`)
              return
            }
            if (!salePriceWithTax) {
              this.$message.warning(`请填写物料第${i + 1}条的“含税单价”`)
              return
            }
            if (!taxRate) {
              this.$message.warning(`请填写物料第${i + 1}条的“税率”`)
              return
            }
          } else if (form.purchaseOrderSource === 3) {
            if (!productItemNum) {
              this.$message.warning(`请填写物料第${i + 1}条的“数量”`)
              return
            }
          } else if (form.purchaseOrderSource === 4) {
            if (!productItemNum) {
              this.$message.warning(`请填写物料第${i + 1}条的“数量”`)
              return
            }
          } else if (form.purchaseOrderSource === 5) {
            // if (!materialCode) {
            //   this.$message.warning(`请填写物料第${i + 1}条的“物料编码”`)
            //   return
            // }
            if (!materialName) {
              this.$message.warning(`请填写物料第${i + 1}条的“物料名称”`)
              return
            }
            // if (!saleAttribute) {
            //   this.$message.warning(`请填写物料第${i + 1}条的“型号规格”`)
            //   return
            // }
            if (!mainUnitName) {
              this.$message.warning(`请填写物料第${i + 1}条的“单位”`)
              return
            }
            if (!productItemNum) {
              this.$message.warning(`请填写物料第${i + 1}条的“数量”`)
              return
            }
            if (!salePriceWithTax) {
              this.$message.warning(`请填写物料第${i + 1}条的“含税单价”`)
              return
            }
            if (!taxRate) {
              this.$message.warning(`请填写物料第${i + 1}条的“税率”`)
              return
            }
          }
        }
      } else {
        this.$message.warning('请添加物料信息')
        return
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
