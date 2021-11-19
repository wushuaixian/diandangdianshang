<!--
 * @Author: your name
 * @Date: 2021-06-25 23:02:33
 * @LastEditTime: 2021-07-01 16:27:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/Suppliers/Materials/components/statr.vue
-->
<template>
  <div class="mid">
    <a-modal v-if="visible" v-model="visible" title="导入" @ok="handleOk" @cancel="handleCancel" width="400px">
      <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="公司名称">
          <div>{{ merchantName }}</div>
        </a-form-model-item>
        <a-form-model-item label="导入文件" prop="file">
          <s-import
            ref="import"
            action="/back-manage-web/materialcategory/asyncImportMaterialCategory"
            :fileData="fileData"
            file-name="file"
          >
            <a-button>选择文件</a-button>
          </s-import>
        </a-form-model-item>
        <a-form-model-item label="导入模板下载">
          <!-- <a href="javascript:void(0)" @click="downLoad">下载</a> -->
          <a @click="download">下载</a>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { getPageInfoByKey } from '@/api/supplier'
export default {
  props: {
    merchantId: {
      type: String,
      default: () => {}
    },
    merchantList: {
      type: Array,
      default: () => []
    },
    merchantName: {
      type: String,
      default: () => []
    }
  },
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
      url: '',
      visible: false,
      headers: {
        authorization: 'authorization-text'
      },
      // 上传附加Id
      fileData: {}
      // merchantName: ''
    }
  },
  mounted() {
    // this.merchantName = this.merchantList.filter((item) => {
    //   return item.value.toString() === this.merchantId
    // })[0]?.merchantName
  },
  methods: {
    async download() {
      try {
        const { data } = await getPageInfoByKey({ key: 'material_category_import' })
        console.log(data.material_category_import)
        window.open(data.material_category_import)
      } catch (err) {
        console.log(err)
      }
    },
    handleChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    },
    init() {
      this.visible = true
      this.merchantName = this.merchantList.filter((item) => {
        return item.value.toString() === this.merchantId
      })[0]?.label
    },
    showModal() {
      this.visible = true
    },
    handleCancel() {
      this.visible = false
    },
    async handleOk(e) {
      this.fileData.merchantId = this.merchantId
      const isOk = await this.$refs?.import?.uploadFile().finally(() => (this.confirmLoading = false))
      if (isOk) {
        this.$emit('refresh')
        this.$message.success('导入成功')
        this.handleCancel()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.mid {
  .margin {
    margin: 20px;
  }
}
.title {
  margin-left: 50px;
  font-size: 14px;
  color: #262626;
}
.m-check {
  display: inline-block;
}
.m-check input[type='radio'] {
  display: none;
}
.m-check input[type='radio']:checked + div {
  border: solid 2px #ff6b00;
  background: #ff6b00;
}
.m-check input[type='radio']:checked + div:after {
  background-color: #fff;
}
</style>
