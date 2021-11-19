<template>
  <div>
    <div class="item-box">
      <div style="padding: 24px 80px"><Steps :list="stepsList" :status="String(billStatus)" /></div>
      <a-row>
        <a-col :span="5">
          <div class="left">
            <span>状态</span>
            <h3>待审核</h3>
          </div>
        </a-col>
        <a-col :span="17" class="right">
          <a-row class="right_top_title">
            <a-col>
              <h3>
                <span>
                  订单编号:11111111111111
                  <a @click="copy(all.paymentBillCode)" style="margin-left: 10px">
                    <a-icon type="copy" />
                  </a>
                </span>
                <span>
                  采购单号:{{ data1.orderCode }}
                  <a @click="copy(all.paymentBillCode)" style="margin-left: 10px">
                    <a-icon type="copy" />
                  </a>
                </span>
              </h3>
            </a-col>
          </a-row>
          <a-row class="right_top_center">
            <a-col :span="12">
              订单来源: {{ data1.purchaseOrderSource ? purchaseOrderSource[data1.purchaseOrderSource] : '' }}
            </a-col>
            <a-col :span="12"> 订单状态: {{ data1.confirmStatus }} </a-col>
          </a-row>
          <a-row>
            <a-col :span="12"> 下单人: {{ data1.userName }} </a-col>
            <a-col :span="12"> 下单备注: 11111111111111111 </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <div class="basicInformation item-box">
      <header-title>
        <span>基础信息</span>
      </header-title>
      <a-form-model ref="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="采购单号"> {{ data1.orderCode }} </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="供应商"> {{ data1.merchantName }} </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="创建时间"> {{ data1.createTime }} </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="联系人"> {{ data1.contact }} </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="联系方式"> {{ data1.contactInformation }} </a-form-model-item>
          </a-col>
          <!-- <a-col :span="8">
            <a-form-model-item label="要求到货日期"> 1111111111 </a-form-model-item>
          </a-col> -->
          <a-col :span="8">
            <a-form-model-item label="采购项目编号"> 1111111111 </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <!-- <a-col :span="8">
            <a-form-model-item label="采购员"> 1111111111 </a-form-model-item>
          </a-col> -->
          <!-- <a-col :span="8">
            <a-form-model-item label="采购计划编号"> 1111111111 </a-form-model-item>
          </a-col> -->
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="项目名称"> {{ data1.extField3 }} </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="合同编号"> {{ data1.contractCode }} </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="合同名称"> {{ data1.paymentName }} </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div class="item-box materialInformation">
      <header-title class="materialInformationTitle">
        <span>物料信息</span>
      </header-title>
      <a-form-model layout="inline" ref="form" :model="queryParams" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-model-item label="物料编号" prop="">
              <a-input placeholder="请输入物料编号" v-model="queryParams.materialCode" />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="物料名称" prop="materialName">
              <a-input placeholder="请输入物料名称" v-model="queryParams.materialName" />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="规格型号" prop="standard">
              <a-input placeholder="请输入规格型号" v-model="queryParams.standard" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-model-item label="商品编码" prop="">
              <a-input placeholder="请输入平台商品编码" v-model="queryParams.productCode" />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="商品名称" prop="productCname">
              <a-input placeholder="请输入平台商品编码" v-model="queryParams.productCname" />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="申请组织" prop="">
              <a-input placeholder="请输入申请组织" v-model="queryParams.applyDepartment" />
            </a-form-model-item>
          </a-col>
          <!-- <a-col :md="8" :sm="24">
            <a-form-model-item label="商品型号" prop="buyerUserName">
              <a-input placeholder="请输入商品型号" v-model="queryParams.xx" />
            </a-form-model-item>
          </a-col> -->
        </a-row>
        <a-row :gutter="48" v-show="showMore">
          <a-col :md="8" :sm="24">
            <a-form-model-item label="品牌/产地" prop="brandName">
              <a-input placeholder="请输入品牌/产地" v-model="queryParams.brandName" />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="交货期" prop="time">
              <a-range-picker v-model="queryParams.time" style="width: 170px; margin-right: 20px" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-col :md="24" :sm="24">
          <div class="button">
            <a-button type="primary" @click="ok">查询</a-button>
            <a-button class="reset" @click=";[$refs.form.resetFields(), resetForm()]">重置</a-button>
            <span @click="showMore = !showMore" class="show-more">
              {{ showMore ? '收起' : '展开' }}
              <a-icon :style="{ color: '#ff6b00' }" :type="showMore ? 'up' : 'down'" />
            </span>
          </div>
        </a-col>
      </a-form-model>
    </div>
    <a-card class="item-box">
      <s-table
        ref="orderListTable"
        name="orderListDetails"
        rowKey="id"
        :scroll="{ x: 2000 }"
        :data="getList"
        :columns="columns"
      >
      </s-table>
    </a-card>
    <div class="item-box">
      <header-title class="title"><span>付款方式</span></header-title>
      <Payment ref="paymentform" :disabled="true" :form="form" />
    </div>
    <div class="item-box">
      <header-title class="title"><span>收货地址</span></header-title>
      <Address :form="form" :disabled="true" type="DEFAULT" />
    </div>
    <div class="item-box">
      <header-title class="title"><span>发票信息</span></header-title>
      <Invoice :disabled="true" :form="form" />
    </div>
    <div class="item-box">
      <header-title class="title"><span>发票地址信息</span></header-title>
      <Address :disabled="true" :form="form" type="INVOICE" />
    </div>
  </div>
</template>
<script>
import { Steps } from '@/components/Steps'
import { Payment, Address, Invoice } from '@/views/orderCenter/orderManagement/buyerOrder/addOrder/components/index.js'
import { systemctlOrderListDetails, quyerOrderLineListPage } from '@/api/systemctlOrder'
export default {
  components: {
    Steps,
    Payment,
    Address,
    Invoice
  },
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      stepsList: [
        { label: '待提交', value: '0', other: '2020-12-23  23:23:23' },
        { label: '提交订单', value: '1' },
        { label: '供应商确认', value: '3' },
        { label: '采购商审核完成', value: '4' },
        { label: '供应商发货', value: '6' },
        { label: '入库完成', value: '8' },
        { label: '订单完成', value: '9' }
      ],
      purchaseOrderSource: {
        1: '计划',
        2: '待下单',
        3: '项目',
        4: '合同',
        5: '新增',
        6: '点选'
      },
      data1: {},
      form: {
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
          exactAddress: '' // 收票地址-详细地址
        },
        // 物料信息
        manualOrderItemVOList: []
      },
      billStatus: '',
      queryParams: {},
      showMore: false,
      columns: [
        { title: '物料编码', key: 'materialCode', dataIndex: 'materialCode' },
        { title: '物料名称', key: 'materialName', dataIndex: 'materialName' },
        {
          title: '型号规格',
          key: 'standard',
          dataIndex: 'standard'
        },
        {
          title: '单位',
          key: 'unit',
          dataIndex: 'unit'
        },
        {
          title: '数量',
          key: 'productItemNum',
          dataIndex: 'productItemNum'
        },
        {
          title: '未税单价(元)',
          key: 'priceWith',
          dataIndex: 'priceWith'
        },
        {
          title: '含税单价(元)',
          key: 'productPriceSale',
          dataIndex: 'productPriceSale'
        },
        {
          title: '未税总价(元)',
          key: 'withoutTaxTotalPrice',
          dataIndex: 'withoutTaxTotalPrice'
        },
        {
          title: '含税总价(元)',
          key: 'productItemAmount',
          dataIndex: 'productItemAmount'
        },
        {
          title: '税率 (%)',
          key: 'taxRate',
          dataIndex: 'taxRate'
        },
        {
          title: '交货期',
          key: 'deliveryTime',
          dataIndex: 'deliveryTime'
        },
        {
          title: '质保期',
          key: 'qualityRetentionPeriod',
          dataIndex: 'qualityRetentionPeriod'
        },
        {
          title: '品牌/产地',
          key: 'brandName',
          dataIndex: 'brandName'
        },
        // {
        //   title: '已发货数量',
        //   key: '',
        //   dataIndex: ''
        // },
        // {
        //   title: '已到货数量',
        //   key: '',
        //   dataIndex: ''
        // },
        // {
        //   title: '已入库数量',
        //   key: '',
        //   dataIndex: ''
        // },
        {
          title: '申请组织',
          key: 'applyDepartment',
          dataIndex: 'applyDepartment'
        },
        {
          title: '使用部门',
          key: 'useDepartment',
          dataIndex: 'useDepartment'
        },
        {
          title: '备注',
          key: 'remark',
          dataIndex: 'remark'
        },
        {
          title: '计划编号',
          key: 'planItemCode',
          dataIndex: 'planItemCode'
        }
        // {
        //   title: '项目编号',
        //   key: '',
        //   dataIndex: ''
        // },
        // {
        //   title: '项目名称',
        //   key: '',
        //   dataIndex: ''
        // },
        // {
        //   title: '合同编号',
        //   key: '',
        //   dataIndex: ''
        // },
        // {
        //   title: '项目编号',
        //   key: '',
        //   dataIndex: ''
        // },
        // {
        //   title: '合同编号',
        //   key: '',
        //   dataIndex: ''
        // },
        // {
        //   title: '合同名称',
        //   key: '',
        //   dataIndex: ''
        // },
        // {
        //   title: '平台商品编码',
        //   key: '',
        //   dataIndex: ''
        // },
        // {
        //   title: '商品名称',
        //   key: '',
        //   dataIndex: ''
        // }
        // {
        //   title: '商品型号',
        //   key: '',
        //   dataIndex: ''
        // }
      ]
    }
  },
  mounted() {
    systemctlOrderListDetails({ orderCode: this.$route.params.id }).then((res) => {
      if (res.code === '0') {
        console.log(res.data.so)
        this.data1 = res.data.so
        // this.form.manualOrderInvoiceVo = {
        //   invoiceId: this.data1.invoiceId, // 发票id
        //   invoiceType: this.data1.invoiceType, // 发票类型（1:增值税普通发票，2:增值税专用发票）
        //   dutyParagraph: this.data1.dutyParagraph, // 纳税人识别号
        //   bankDeposit: this.data1.bankDeposit, // 开户银行
        //   bankAccount: this.data1.bankAccount, // 开户行账号
        //   buyerTel: this.data1.buyerTel, // 电话
        //   detailAddress: this.data1.detailAddress, // 注册地址
        //   userName: this.data1.userName, // 收票人
        //   mobile: this.data1.mobile, // 收票手机号
        //   countryCode: this.data1.countryCode, // 收票地址-国家code
        //   provinceCode: this.data1.provinceCode, // 省份code
        //   cityCode: this.data1.cityCode, // 城市code
        //   regionCode: this.data1.regionCode, // 区域code
        //   exactAddress: this.data1.exactAddress // 收票地址-详细地址
        // }
      }
    })
  },
  methods: {
    getList(params) {
      const data = {
        ...this.queryParams,
        ...params
      }
      return quyerOrderLineListPage({ ...data })
    },
    copy(url) {
      const domUrl = document.createElement('input')
      domUrl.value = url
      domUrl.id = 'creatDom'
      document.body.appendChild(domUrl)
      domUrl.select() // 选择对象
      document.execCommand('Copy') // 执行浏览器复制命令
      const creatDom = document.getElementById('creatDom')
      creatDom.parentNode.removeChild(creatDom)
      this.$message.success('复制成功')
    },
    search() {
      this.$refs.orderListTable.refresh(true)
    },
    ok() {
      this.search()
    }
  }
}
</script>
<style lang="less" scoped>
.left {
  width: 100%;
  height: 150px;
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-right: 1px solid #f1f2f5;
}
.right {
  margin-left: 55px;
}
.right_top_title {
  padding-top: 38px;
}
.right_top_center {
  margin: 20px 0;
}
.basicInformation {
  .ant-col-8 {
    height: 30px;
  }
}
.button {
  text-align: center;
  margin-top: 20px;
}
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
.materialInformation {
  padding-bottom: 70px;
}
.materialInformationTitle {
  margin-bottom: 10px;
}
</style>
