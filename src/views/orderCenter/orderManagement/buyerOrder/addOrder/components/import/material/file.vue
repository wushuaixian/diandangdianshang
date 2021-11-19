<template>
  <a-modal
    title="物料导入"
    :visible="visible"
    :confirm-loading="importLoading"
    :okText="importLoading ? '正在上传' : '确定'"
    @ok="handleOkImport"
    @cancel="handleCancelImport"
    :width="620"
  >
    <div class="file-box">
      <div class="file-name">导入文件：</div>
      <a-upload
        accept=".xls,.xlsx"
        class="file-list"
        :file-list="fileList"
        :remove="handleRemove"
        :before-upload="beforeUpload"
        @change="handleChangeImport"
      >
        <a-button> <a-icon type="upload" /> 上传文件 </a-button>
      </a-upload>
    </div>
    <div class="file-box">
      <div class="file-name">导入模板下载：</div>
      <a class="file-text" @click="dowlod">点击下载</a>
    </div>
    <div class="file-box">
      <div class="file-name">温馨提示：</div>
      <div class="file-text">
        <div class="item">支持xlsx格式的excel文件，大小≤2M，建议物料条数≤5000条。</div>
        <div class="item">1. 支持xlsx格式的excel文件，大小≤2M，建议物料条数≤5000条。</div>
        <div class="item">2. 物料名称、单位、含税单价、税率（%）必填，否则将导入失败。</div>
        <div class="item">
          3.交货日期：零采合同的交货日期必填；交货日期的单元格格式为文本；请依如下格式输入：2021-07-09
        </div>
        <div class="item">4.交货天数：长协合同的交货天数必填</div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import * as api from '@/api/orderCenter'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileList: [],
      importLoading: false
    }
  },
  methods: {
    async dowlod() {
      const response = await fetch('/api/back-manage-web/buyer/plan/excel/downloadExcelTemplate')
      const blob = await response.blob()
      const objectUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = '物料清单导入模板'
      a.click()
      a.remove()
    },
    handleRemove() {
      this.fileList = []
      this.$forceUpdate()
    },
    beforeUpload(file) {
      this.fileList = [file]
      return false
    },
    handleChangeImport(file) {
      if (file.file.status !== 'removed') {
        this.fileList = [file.file]
      } else {
        this.fileList = []
      }
    },
    handleCancelImport() {
      this.fileList = []
      this.importLoading = false
      this.$emit('update:visible', false)
    },
    handleOkImport() {
      if (this.fileList.length > 0) {
        this.importLoading = true
        const { fileList } = this
        const formData = new FormData()
        formData.append('file', fileList[0])
        api.importFile(formData).then((ret) => {
          this.importLoading = false
          if (ret.code === '0') {
            this.$emit('ok', [...ret.data])
            if (ret.data?.stringList?.length > 0) {
              this.$notification.error({
                message: '导入成功，但是有错误',
                description: (h) => ret.data?.stringList.map((x) => h('div', x))
              })
            }
            this.handleCancelImport()
          }
        })
      } else {
        this.$message.info('请选择要导入的文件')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.file-box {
  display: flex;
  flex-direction: row;
  margin: 8px 0;
  .file-name {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #262626;
    text-align: right;
    line-height: 34px;
    width: 140px;
  }
  .file-text {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    line-height: 34px;
    width: 530px;
    .item {
      line-height: 20px;
      margin-top: 7px;
    }
  }
  .file-list {
    width: 530px;
  }
}
</style>
