<template>
  <div>
    <a-form-model ref="ruleForm" :model="formData" :rules="rules" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
      <a-form-model-item ref="auditStatus" label="审核" prop="auditStatus">
        <a-radio-group v-model="formData.auditStatus" :options="options" />
      </a-form-model-item>
      <a-form-model-item ref="message" label="备注" prop="message">
        <a-textarea v-model="formData.message" :maxLength="300" :rows="4" />
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
export default {
  name: 'AppealSubmit',
  data() {
    return {
      formData: {
        auditStatus: '',
        message: ''
      },
      options: [
        { label: '审核通过', value: '10' },
        { label: '审核不通过', value: '20' }
      ]
    }
  },
  computed: {
    rules() {
      let ru = {}
      if (this.formData?.auditStatus === '20') {
        ru = {
          auditStatus: [{ required: true, message: '请选择审批类型', trigger: 'blur' }],
          message: [{ required: true, message: '请填写驳回原因', trigger: 'blur' }]
        }
      } else {
        ru = {
          auditStatus: [{ required: true, message: '请选择审批类型', trigger: 'blur' }]
        }
      }
      return ru
    }
  },
  created() {},

  methods: {}
}
</script>

<style scoped lang="less">
</style>
