import request from '@/utils/request'
export default {
  name: 'SImport',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    action: {
      type: String,
      default: '/back-manage-web/buyer/plan/excel/load'
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
    size: {
      type: Number,
      default: 10
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileList: []
    }
  },
  methods: {
    beforeUpload(file) {
      const { accept, size } = this
      const isAccept = accept instanceof Array ? accept.includes(file.type) : file.type === accept
      const isLimit = file.size / 1024 / 1024 < size
      if (!isAccept) {
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
      this.fileList = fileList.slice(-2)?.map(x => {
        return {
          ...x,
          status: 'done'
        }
      })
    },
    customRequest(file) {},
    async uploadFile() {
      const { action: url, fileName, fileData } = this
      const [file] = this.fileList
      if (!file) {
        this.$message.warning('请选择文件')
        return
      }
      console.log(file)
      const formData = new FormData()
      formData.append(fileName, file?.originFileObj)
      if (Object.keys(fileData).length > 0) {
        Object.keys(fileData).forEach(x => {
          formData.append(x, fileData[x])
        })
      }
      const res = await request({
        url,
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      if (res.code === '0') {
        this.$emit('ok')
        return true
      }
      // else if (res.code === '-1') {
      //   this.$notification.error({
      //     message: '提示',
      //     description: res?.message
      //   })
      // }
      return false
    }
  },
  render() {
    const { accept, fileList, action, fileName, fileData } = this
    const props = this.$attrs
    const ace = accept instanceof Array ? accept.join(',') : accept
    return (
      <div class="s-import">
        <a-upload
          data={fileData}
          name={fileName}
          customRequest={this.customRequest}
          accept={ace}
          fileList={fileList}
          action={action}
          onChange={this.handleChange}
          beforeUpload={this.beforeUpload}
          multiple={false}
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
      </div>
    )
  }
}
