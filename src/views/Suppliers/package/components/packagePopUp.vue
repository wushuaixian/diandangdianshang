<template>
  <div>
    <a-modal v-model="visible" title="套餐费" ok-text="前往" cancel-text="返回" @ok="hideModal">
      <div>
        <p>
          <span v-if="numItem.validPackageOrder">
            <span v-if="data1.id == 4">行业头部企业战略合作套餐</span>
            <span v-if="data1.id == 3">大型企业套餐</span>
            <span v-if="data1.id == 2">中小型企业套餐</span>
            金额
            <span>{{ data1.moeny }}</span
            >元， 已生成应付单

            <span class="span">{{ numItem.feeBillCode }}</span
            >， 可前往应付单详情查看管理。
          </span>
          <span v-else>
            您之前已创建其他套餐应付单，请去操作应付单 <span class="span">{{ numItem.feeBillCode }}</span>
            再进行购买。 前往操作
          </span>
        </p>
        <!-- <p>
          已生成应付单
          <span class="span">YF1234567</span>，可前往应付单详情
        </p>
        <p>查看管理</p>-->
      </div>
    </a-modal>
  </div>
</template>
<script>
export default {
  props: {
    data1: {
      type: Object,
      default: () => ({
        type: '',
        moeny: '',
        id: ''
      })
    },
    numItem: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      visible: false,
      package: '',
      OddNumbers: '',
      moeny: ''
    }
  },
  methods: {
    showModal() {
      this.visible = true
    },
    hideModal() {
      this.visible = false
      // this.$emit('enterprisePayment')
      this.$router.push({ name: 'SupplierPayableManage', params: { feeBillCode: this.numItem.feeBillCode } })
    },
    init(id) {
      this.visible = true
      console.log(id)
    }
  }
}
</script>
<style lang='less' scoped>
div {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #262626;
  p {
    .span {
      color: #ff6b00 !important;
      line-height: 16px;
    }
  }
}
</style>
