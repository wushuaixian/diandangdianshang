<template>
  <div class="appeal-manage-list">
    <a-modal v-model="visible" title="审核" @ok="handleOk">
      <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="审核结果">
          <a-radio-group v-model="form.resource">
            <a-radio value="1"> 审核通过 </a-radio>
            <a-radio value="2"> 审核不通过 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="备注">
          <a-input v-model="form.desc" type="textarea" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 13 },
      form: {
        resource: '1',
        desc: ''
      }
    }
  },
  methods: {
    handleOk() {
      this.visible = false
    }
  },
  watch: {}
}
</script>

<style lang="less" scoped>
</style>
