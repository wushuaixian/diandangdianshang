<template>
  <div class="the-busiiness">
    <header-title>
      <span>工商信息</span>
    </header-title>
    <a-form-model :label-col="{ span: 3 }" :wrapper-col="{ span: 12 }">
      <a-form-model-item label="企业性质">
        {{ businessDetail.enterpriseNature === '1' ? '生产商' : '贸易商' }}
      </a-form-model-item>
      <a-form-model-item label="企业名称:">
        <a-input disabled v-model="businessDetail.enterpriseName" />
      </a-form-model-item>
      <a-form-model-item label="管理员手机号:">
        <a-input disabled v-model="businessDetail.registerMobile" />
      </a-form-model-item>
      <a-form-model-item label="统一社会信用代码:">
        <a-input disabled v-model="businessDetail.businessLicenceNo" />
      </a-form-model-item>
      <a-form-model-item label="法人名称:">
        <a-input disabled v-model="businessDetail.legalPersonName" />
      </a-form-model-item>
      <a-form-model-item label="成立日期:">
        <a-input disabled :value="businessDetail.businessLicencePeriodBegin | moment" />
      </a-form-model-item>
      <a-form-model-item label="注册资金:">
        <a-input disabled v-model="businessDetail.registeredCapital" />
      </a-form-model-item>
      <a-form-model-item label="公司类型:">
        <a-input disabled v-model="businessDetail.enterpriseType" />
      </a-form-model-item>
      <a-form-model-item label="截止日期:">
        <a-input disabled :value="businessDetail.businessLicencePeriodEnd | moment" />
      </a-form-model-item>
      <a-form-model-item label="注册币种:">
        <a-input disabled v-model="businessDetail.currency" />
      </a-form-model-item>
      <a-form-model-item label="经营范围:">
        <a-textarea disabled v-model="businessDetail.businessScope" />
      </a-form-model-item>
      <a-form-model-item label="注册地:">
        <a-input
          disabled
          :value="`${businessDetail.registeredProvinceName}${businessDetail.registeredCityName}${businessDetail.registeredRegionName}`"
        />
      </a-form-model-item>
      <a-form-model-item label="详细地址:">
        <a-textarea disabled v-model="businessDetail.registeredDetailAddress" />
      </a-form-model-item>
      <a-form-model-item label="授权委托书:" v-if="businessDetail.powerOfAttorneyUrl">
        <ImagePreview style="width: 80px" :value="businessDetail.powerOfAttorneyUrl"></ImagePreview>
      </a-form-model-item>
      <a-form-model-item label="营业执照:" v-if="businessDetail.businessLicenceUrl">
        <ImagePreview style="width: 80px" :value="businessDetail.businessLicenceUrl"></ImagePreview>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script>
import { ImagePreview } from '@/components/'
export default {
  components: { ImagePreview },
  props: {
    businessDetail: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="less" scoped>
.the-busiiness {
  .ant-form {
    margin-top: 20px;
  }
}
</style>
