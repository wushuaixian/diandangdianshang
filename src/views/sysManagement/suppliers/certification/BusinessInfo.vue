<template>
  <a-card type="inner" :bordered="false">
    <header-title>
      <span>工商信息</span>
    </header-title>
    <a-form :form="datalistsupplierbusiness" style="margin-top: 20px">
      <a-form-item label="营业执照" :labelCol="apart" :wrapperCol="format">
        <!-- <img class="avatar" :src="datalistsupplierbusiness.businessLicenceUrl" /> -->
        <ImagePreview :value="datalistsupplierbusiness.businessLicenceUrl" />
      </a-form-item>
      <a-form-item label="授权委托书" :labelCol="apart" :wrapperCol="format" style="margin-top: 10px">
        <!-- <img class="avatar" :src="datalistsupplierbusiness.powerOfAttorneyUrl" /> -->
        <ImagePreview :value="datalistsupplierbusiness.powerOfAttorneyUrl" />
      </a-form-item>
      <a-form-item label="企业名称" :labelCol="apart" :wrapperCol="format">
        <span>{{ datalistsupplierbusiness.enterpriseName }}</span>
      </a-form-item>
      <a-form-item label="统一社会信用代码" :labelCol="apart" :wrapperCol="format">
        <span>{{ datalistsupplierbusiness.businessLicenceNo }}</span>
      </a-form-item>
      <a-form-item label="公司类型" :labelCol="apart" :wrapperCol="format">
        <span>{{ datalistsupplierbusiness.enterpriseType }}</span>
      </a-form-item>
      <a-form-item label="成立日期" :labelCol="apart" :wrapperCol="format">
        <span>{{ datalistsupplierbusiness.businessLicencePeriodBegin | moment }}</span>
      </a-form-item>
      <a-form-item label="截止日期" :labelCol="apart" :wrapperCol="format">
        <span>{{ datalistsupplierbusiness.businessLicencePeriodEnd | moment }}</span>
      </a-form-item>
      <a-form-item label="注册资金" :labelCol="apart" :wrapperCol="format">
        <span>{{ datalistsupplierbusiness.registeredCapital }}</span>
      </a-form-item>
      <!-- <a-form-item label="注册币种" :labelCol="apart" :wrapperCol="format">
            <span>{{ datalistsupplierbusiness.currency }}</span>
          </a-form-item> -->
      <a-form-item label="经营范围" :labelCol="apart" :wrapperCol="format">
        <span>{{ datalistsupplierbusiness.businessScope }}</span>
      </a-form-item>
      <a-form-item label="注册地" :labelCol="apart" :wrapperCol="format">
        <!-- {{ datalistsupplierbusiness.registrationSplicing }} -->
        {{ datalistsupplierbusiness.registeredProvinceName }}

        {{ datalistsupplierbusiness.registeredCityName }}

        {{ datalistsupplierbusiness.registeredRegionName }}
      </a-form-item>
      <a-form-item label="详细地址" :labelCol="apart" :wrapperCol="format">
        <span>{{ datalistsupplierbusiness.registeredDetailAddress }}</span>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import { getMerchatInfo } from '@/api/supplier'
import { ImagePreview } from '@/components/'
var apart = { lg: { span: 5 }, sm: { span: 7 } }
var format = { lg: { span: 10 }, sm: { span: 17 } }
export default {
  components: { ImagePreview },
  data() {
    return {
      apart,
      format,
      datalistsupplierbusiness: {},
      merchantId: this.$route.params.id,
      form: this.$form.createForm(this)
    }
  },
  mounted() {
    this.supplierbusiness()
  },
  methods: {
    // 工商信息展示数据
    async supplierbusiness() {
      const { merchantId: orgId } = this
      const { data } = await getMerchatInfo({
        orgId
      })
      this.datalistsupplierbusiness = data
    }
  }
}
</script>

<style lang="less" scoped>
</style>
