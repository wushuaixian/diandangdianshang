<template>
  <div class="enter">
    <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="所属集团">
        <a-input v-model="form.name" :disabled="true" />
      </a-form-model-item>
      <a-form-model-item label="企业性质">
        <a-radio-group v-model="form.resource" :disabled="true">
          <a-radio value="1">生产商</a-radio>
          <a-radio value="2">贸易商</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="营业执照编号">
        <a-input v-model="form.name" :disabled="true" />
      </a-form-model-item>
      <a-form-model-item label="注册地址">
        <a-input v-model="form.desc" type="textarea" />
      </a-form-model-item>
      <a-form-model-item label="经营范围">
        <a-input v-model="form.desc" type="textarea" />
      </a-form-model-item>
      <a-form-model-item label="总建筑面积">
        <a-input v-model="form.name" :disabled="true" />
      </a-form-model-item>
      <a-form-model-item label="占地性质">
        <a-radio-group value="1" :disabled="true">
          <a-radio value="1">租赁</a-radio>
          <a-radio value="2">自有</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="是否有研发部门">
        <a-radio-group v-model="form.resource" :disabled="true">
          <a-radio value="1">是</a-radio>
          <a-radio value="2">否</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="研发人数">
        <a-input v-model="form.name" :disabled="true" />
      </a-form-model-item>
      <a-form-model-item label="营业执照">
        <a-input v-model="form.name" :disabled="true" />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 5, offset: 8 }">
        <a-button class="btn" type="primary" size="large"> 查看企业VR </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script>
import * as api from '@/api/supplier'
export default {
  created() {
    this.BindData()
  },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 12 },
      form: {
        factoryAuditOrg: '',
        expectFactoryAuditTime: '',
        factoryAuditNo: '',
        enterpriseNature: '',
        membershipGroup: '',
        businessLicenseNo: '',
        officeAdressDetail: '',
        scope: '',
        plantArea: '',
        landUseStatus: '',
        isDeveloper: '',
        staffAmount: '',
        businessLicenseUrl: ''
      }
    }
  },
  methods: {
    BindData() {
      api.enterpriseBasicDetail().then((ret) => {
        if (ret.code === '0') {
          this.form.factoryAuditOrg = ret.data.factoryAuditOrg
          this.form.expectFactoryAuditTime = ret.data.expectFactoryAuditTime
          this.form.factoryAuditNo = ret.data.factoryAuditNo
          this.form.enterpriseNature = ret.data.enterpriseNature
          this.form.membershipGroup = ret.data.membershipGroup
          this.form.businessLicenseNo = ret.data.businessLicenseNo
          this.form.officeAdressDetail = ret.data.officeAdressDetail
          this.form.scope = ret.data.scope
          this.form.plantArea = ret.data.plantArea
          this.form.landUseStatus = ret.data.landUseStatus
          this.form.isDeveloper = ret.data.isDeveloper
          this.form.staffAmount = ret.data.staffAmount
          this.form.businessLicenseUrl = ret.data.businessLicenseUrl
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.enter {
  padding: 20px 0;
}
</style>
