import ImagePreview from '@/components/ImagePreview/'
export default {
  name: 'SUpload',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: [String, Array],
      default: ''
    },
    fileName: {
      type: String,
      default: 'file'
    },
    accept: {
      type: [String, Array],
      default: () => ['image/bmp', 'image/jpg', 'image/png', 'image/jpeg', 'application/pdf']
    },
    size: {
      type: Number,
      default: 10
    },
    multiple: {
      type: Boolean,
      default: false
    },
    action: {
      type: String,
      default: '/api/back-manage-web/myContract/uploadContractAccessory'
    },
    limit: {
      type: Number,
      default: null
    }
  },
  watch: {
    value(val) {
      if (!val || val?.length <= 0) {
        this.fileList = []
      } else if (this.fileList.length <= 0 || typeof val === 'string') {
        this.setDefault()
      }
    }
  },
  data() {
    return {
      fileList: []
    }
  },
  mounted() {
    this.setDefault()
  },
  methods: {
    setDefault() {
      const { value, multiple } = this
      if (!multiple && value) {
        this.fileList = [{ url: value, status: 'done', uid: '-1', name: 'test.png' }]
      } else if (multiple && value instanceof Array) {
        this.fileList = value.map((x, i) => {
          return { url: x?.url || x, status: 'done', uid: x?.id || i, name: x?.name || `test${i}.png` }
        })
      }
    },
    beforeUpload(file) {
      const { accept, size, limit } = this
      const isAccept = accept instanceof Array ? accept.includes(file.type) : file.type === accept
      const isLimit = file.size / 1024 / 1024 < size
      if (!isAccept) {
        // this.$message.error(`请上传${accept instanceof Array ? accept.join(',') : accept}格式`)
        this.$message.error(`请上传正确的格式`)
        return Promise.reject(new Error(''))
      }
      if (!isLimit) {
        this.$message.error(`请上传小于${size}M文件`)
        return Promise.reject(new Error(''))
      }
      if (limit && this.fileList.length === limit) {
        this.$message.error(`上传限制数量为${limit}`)
        return Promise.reject(new Error(''))
      }
      return true
    },
    handleChange({ file, fileList }) {
      const { multiple } = this
      this.fileList = fileList
      console.log(fileList)
      if (file?.status === 'done') {
        if (file?.response?.code === '0') {
          const data = Array.isArray(file?.response?.data) ? file?.response?.data[0] : file?.response?.data
          const url = data?.url
          const value = !multiple ? url : fileList
          this.$emit('update:value', value)
          this.$emit('change', value)
          this.$emit('aschange', { ...data })
        } else {
          this.fileList = []
        }
      }
    },
    handlePreview(file) {
      const { fileList } = this
      const url = file?.url || file?.response?.data?.url || file?.response?.data[0]?.url
      const type = url?.substring(url.length - 5)
      const isImage = ['bmp', 'jpg', 'png', 'jpeg', 'gif'].some(x => {
        if (type?.toLocaleLowerCase()?.includes(x)) {
          return true
        }
      })
      if (isImage) {
        const list = fileList.map(x => x?.url || x?.response?.data?.url || x?.response?.data[0]?.url)
        const currentIndex = list.findIndex(x => x === url)
        this.$refs.preview.customShow(list, currentIndex)
      } else {
        window.open(file?.url)
      }
    },
    async handleRemove(file) {
      if (!this.multiple) {
        this.$emit('change', '')
      } else {
        const { fileList } = this
        const url = file?.url || file?.response?.data?.url || file?.response?.data[0]?.url
        const list = fileList.filter(x => (x?.url || x?.response?.data?.url || x?.response?.data[0]?.url) !== url)
        this.$emit('change', list || [])
      }
      this.$emit('remove', file)
      return true
    }
  },
  render() {
    const { accept, fileList, action, multiple, fileName } = this
    const props = this.$attrs
    const ace = accept instanceof Array ? accept.join(',') : accept
    return (
      <div class="s-upload">
        <a-upload
          name={fileName}
          accept={ace}
          fileList={fileList}
          action={action}
          beforeUpload={this.beforeUpload}
          onChange={this.handleChange}
          multiple={multiple}
          onPreview={this.handlePreview}
          remove={this.handleRemove}
          {...{ props }}
        >
          {Object.keys(this.$slots).map(name =>
            !multiple && fileList.length <= 0 ? (
              <template slot={name}>{this.$slots[name]}</template>
            ) : multiple ? (
              <template slot={name}>{this.$slots[name]}</template>
            ) : null
          )}
        </a-upload>
        <ImagePreview isThumbnail={false} ref="preview" />
      </div>
    )
  }
}
