<template>
  <div class="template-import">
    <a-modal
      destroyOnClose
      title="导入"
      :confirmLoading="confirmLoading"
      :visible="visible"
      @cancel="handleCancel"
      @ok="handleOk"
    >
      <a-form-model :model="form" ref="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="导入文件" prop="file">
          <s-import ref="import" :fileData="fileData" file-name="file" :action="importUrl">
            <a-button>选择文件</a-button>
          </s-import>
        </a-form-model-item>
        <!-- <a-form-model-item label="模板下载">
          <a href="#">下载</a>
        </a-form-model-item> -->
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    merchantId: {
      type: String,
      default: ''
    },
    enterpriseNature: {
      type: [String, Number],
      default: ''
    },
    save: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      importUrl: '/back-manage-web/merchantOrgInfo/importCheckoutInfo',
      confirmLoading: false,
      fileData: {},
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
      form: {},
      rules: {
        file: [{ required: true, message: '请上传文件', trigger: 'changes' }]
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        const { merchantId, enterpriseNature } = this
        this.fileData = {
          merchantId,
          enterpriseNature
        }
      }
    }
  },
  methods: {
    handleCancel() {
      this.$emit('update:visible', false)
    },
    async handleOk() {
      this.confirmLoading = true
      if (this.save instanceof Function) {
        if (!(await this.save('import'))) return
      }
      // eslint-disable-next-line no-unused-expressions
      const isOk = await this.$refs?.import?.uploadFile().finally(() => (this.confirmLoading = false))
      if (isOk) {
        this.$message.success('导入成功')
        this.$emit('ok')
        this.handleCancel()
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-upload-list-item-name {
  width: 240px;
}
</style>
