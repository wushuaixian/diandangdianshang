<template>
  <div class="qualification">
    <a-form-model style="width: 900px" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="所属集团">
        <a-input v-model="form.membershipGroup" :disabled="true" />
      </a-form-model-item>
      <a-form-model-item label="企业性质">
        <a-radio-group v-model="form.enterpriseNature" :disabled="true">
          <a-radio value="1">生产商</a-radio>
          <a-radio value="2">贸易商</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <!-- <a-form-model-item label="营业执照编号">
        <a-input v-model="form.businessLicenseNo" :disabled="true" />
      </a-form-model-item> -->
      <a-form-model-item label="认证注册地址">
        <a-input v-model="form.officeAdressDetail" type="textarea" :disabled="true" />
      </a-form-model-item>
      <a-form-model-item label="认证经营范围">
        <a-input v-model="form.businessScope" type="textarea" :disabled="true" />
      </a-form-model-item>
      <a-form-model-item label="总建筑面积">
        <a-input v-model="form.plantArea" :disabled="true" />
      </a-form-model-item>
      <a-form-model-item label="占地性质">
        <a-radio-group v-model="form.landUseStatus" :disabled="true">
          <a-radio value="0">租赁</a-radio>
          <a-radio value="1">自有</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="是否有研发部门">
        <a-radio-group v-model="form.isDeveloper" :disabled="true">
          <a-radio value="1">是</a-radio>
          <a-radio value="0">否</a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="研发人数">
        <a-input v-model="form.staffAmount" :disabled="true" />
      </a-form-model-item>
      <a-form-model-item label="营业执照">
        <ImagePreview :value="form.businessLicenseUrl" :width="100" :height="100" />
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import ImagePreview from '@/components/ImagePreview'
// import { getMerchantOrgInfoDetail } from '@/api/supplieAuthAdmin'
export default {
  props: {
    form: {
      type: Object,
      default: () => {}
    }
  },
  components: { ImagePreview },
  // created() {
  //   this.BindData()
  // },
  data() {
    return {
      labelCol: { span: 3 },
      wrapperCol: { span: 14 }
    }
  },
  methods: {
    // async BindData() {
    //   const res = await getMerchantOrgInfoDetail()
    //   if (res.code === '0') {
    //     this.form = res.data
    //   }
    // }
  }
}
</script>

<style lang="less" scoped>
.qualification {
  margin: 0 24px;
  .ant-row.ant-form-item {
    margin-bottom: 14px;
  }
}
</style>
