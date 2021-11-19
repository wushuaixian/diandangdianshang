<template>
  <div class="template-import">
    <a-modal title="导入" :confirmLoading="confirmLoading" :visible="visible" @cancel="handleCancel" @ok="handleOk">
      <a-form-model :model="form" ref="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="导入文件" prop="file">
          <s-import ref="import" :fileData="fileData" file-name="file" name="file" :key="numbe">
            <a-button>选择文件</a-button>
          </s-import>
        </a-form-model-item>
        <a-form-model-item label="采购计划模板">
          <a @click="download">下载</a>
        </a-form-model-item>
      </a-form-model>
      <a-form-model-item style="margin-left: 70px">
        <h3>温馨提示：</h3>
        <p>1. 支持xlsx格式的excel文件，大小≤2M，建议物料条数≤5000条。</p>
        <p>2. 物料名称、单位、计划数量必填，否则将导入失败。</p>
      </a-form-model-item>
    </a-modal>
  </div>
</template>

<script>
import { getPageInfoByKey } from '@/api/supplier'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    merchantId: {
      type: [String, Number],
      default: ''
    },
    id: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      numbe: 1,
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
        const { id: planId, merchantId } = this
        this.fileData = {
          materialSource: '1', // 来源写死
          planId,
          merchantId
        }
      }
    }
  },
  methods: {
    async download() {
      try {
        const { data } = await getPageInfoByKey({ key: 'plan_import' })
        window.open(data.plan_import)
      } catch (err) {
        console.log(err)
      }
    },
    handleCancel() {
      this.numbe++
      this.$emit('update:visible', false)
    },
    async handleOk() {
      this.confirmLoading = true
      // eslint-disable-next-line no-unused-expressions
      const isOk = await this.$refs?.import?.uploadFile().finally(() => (this.confirmLoading = false))
      if (isOk) {
        this.numbe++
        this.$message.success('导入成功')
        this.$emit('ok')
        this.handleCancel()
      }
    }
  }
}
</script>

<style lang="less" scoped>
// .ant-form-item-control {
//   line-height: 0;
// }
p {
  line-height: 15px;
}
</style>
