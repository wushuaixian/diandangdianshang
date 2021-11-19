// import { ImagePreview } from '@/components/'
export default {
  name: 'SUploadFile',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    action: {
      type: String,
      default: '/api/back-manage-web/buyer/plan/excel/load'
    },
    fileData: {
      type: [Object, Function],
      default: () => {}
    },
    fileName: {
      type: String,
      default: 'Filedata'
    },
    value: {
      type: [String, Array],
      default: ''
    },
    accept: {
      type: [String, Array],
      default: () => ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
    },
    disabledAccept: {
      type: String,
      default: () => ''
    },
    size: {
      type: Number,
      default: 10
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value(val) {
      if (!val) {
        this.fileList = []
      } else if (this.fileList.length <= 0) {
        this.fileList = [{ url: val, status: 'done', uid: '-1', name: 'test.png' }]
      }
    }
  },
  data() {
    return {
      fileList: []
    }
  },
  mounted() {
    const { value } = this
    if (value) {
      this.fileList = [{ url: value, status: 'done', uid: '-1', name: 'test.png' }]
    }
  },
  methods: {
    beforeUpload(file) {
      const { accept, size, disabledAccept } = this
      const isAccept = accept ? (accept instanceof Array ? accept.includes(file.type) : file.type === accept) : true
      const isLimit = file.size / 1024 / 1024 < size
      if (!isAccept || file.type === disabledAccept) {
        // this.$message.error(`请上传${accept instanceof Array ? accept.join(',') : accept}格式`)
        this.$message.error(`请上传正确的格式`)
        return Promise.reject(new Error(''))
      }
      if (!isLimit) {
        this.$message.error(`请上传小于${size}M文件`)
        return Promise.reject(new Error(''))
      }
      return true
    },
    handleChange({ file, fileList }) {
      this.fileList = fileList
      if (file?.status === 'done') {
        if (file?.response?.code === '0') {
          const url = file?.response?.data?.url
          this.$emit('update:value', url)
          this.$emit('change', { ...file?.response?.data })
          this.$emit('changefile', { ...file?.response })
        } else {
          this.$notification.error({
            message: '提示',
            description: file?.response?.message
          })
          this.fileList = []
        }
      }
    },
    handlePreview(file) {
      const { fileList } = this
      const list = fileList.map(x => x?.response?.data?.url || x?.url)
      const currentIndex = list.findIndex(x => x === file?.response?.data?.url || file?.url)
      this.$refs.preview.customShow(list, currentIndex)
    },
    async handleRemove(file) {
      this.$emit('change', '')
      return true
    }
  },
  render() {
    const { accept, fileList, action, fileName, fileData } = this
    const props = this.$attrs
    const ace = accept instanceof Array ? accept.join(',') : accept
    return (
      <div class="s-upload-file">
        <a-upload
          data={fileData}
          name={fileName}
          accept={ace}
          fileList={fileList}
          action={action}
          beforeUpload={this.beforeUpload}
          onChange={this.handleChange}
          multiple={false}
          onPreview={this.handlePreview}
          remove={this.handleRemove}
          {...{ props }}
        >
          {Object.keys(this.$slots).length > 0 ? (
            Object.keys(this.$slots).map(name =>
              fileList.length <= 0 ? <template slot={name}>{this.$slots[name]}</template> : null
            )
          ) : (
            <a-button>上传文件</a-button>
          )}
        </a-upload>
        {/* <ImagePreview isThumbnail={false} ref="preview" /> */}
      </div>
    )
  }
}
