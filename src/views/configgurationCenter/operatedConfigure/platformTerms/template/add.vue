<template>
  <div>
    <a-form-model ref="form" :model="form" :rules="rules" v-bind="layout">
      <a-form-model-item label="模板类型" prop="type">
        <a-select v-if="form.type" v-model="form.type" placeholder="请选择模板类型" style="width: 230px">
          <a-select-option v-for="item in list" :key="item.key" :value="item.value"> {{ item.key }} </a-select-option>
        </a-select>
        <a-select v-else placeholder="请选择模板类型" style="width: 230px" @change="(v) => (form.type = v)">
          <a-select-option v-for="item in list" :key="item.key" :value="item.value">
            {{ item.key }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="模板标题" prop="title">
        <a-input v-model="form.title" style="width: 230px" maxLength="20" />
      </a-form-model-item>
      <a-form-model-item label="模板编码" prop="code">
        <a-input v-model="form.code" style="width: 230px" maxLength="20" />
      </a-form-model-item>
      <a-form-model-item label="上传模板" prop="url">
        <a-upload
          accept=".xls,.xlsx,.doc,.docx,.pdf"
          action="/api/back-manage-web/myContract/uploadContractAccessory"
          :file-list="fileList"
          @download="(e) => handleDownload(e)"
          @change="handleChangeImport"
        >
          <a-button :disabled="fileList.length > 0"> <a-icon type="upload" /> 上传文件 </a-button>
        </a-upload>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 15, offset: 8 }">
        <a-button type="primary" @click="Save"> 保存 </a-button>
        <a-button style="margin-left: 10px" @click="Close"> 关闭 </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import * as api from '@/api/configgurationCenter/operatedConfigure/platformTerms/template.js'
import { getDictionary } from '@/api/utils.js'
export default {
  created() {
    this.bindDictionary()
    if (this.id) {
      api.getTemplateDetail(this.id).then((ret) => {
        if (ret.code === '0') {
          this.form.type = ret.data.type
          this.form.title = ret.data.title
          this.form.code = ret.data.code
          this.form.url = ret.data.url
          this.form.id = ret.data.id
          this.fileList = [
            {
              uid: '1',
              name: ret.data.url.substr(ret.data.url.lastIndexOf('/') + 1),
              response: '2',
              status: 'done',
              url: ret.data.url
            }
          ]
        }
      })
    }
  },
  props: {
    id: {
      type: Number,
      default: null
    }
  },
  data() {
    const titleValidator = (rule, value, callback) => {
      if (value.trim().length === 0) {
        return callback(new Error('请填写模板标题'))
      } else if (value.length > 20) {
        return callback(new Error('模板标题不能超过20个字符'))
      } else {
        callback()
      }
    }
    const codeValidator = (rule, value, callback) => {
      const reg = /^\w+$/
      if (value === '') {
        callback(new Error('请填写模板编码'))
      } else if (!reg.test(value)) {
        callback(new Error('模板编码只能包含字母和数字'))
      } else {
        callback()
      }
    }
    return {
      list: [],
      fileList: [],
      layout: {
        labelCol: { span: 8 },
        wrapperCol: { span: 15 }
      },
      rules: {
        type: [{ required: true, message: '请填写模板类型', trigger: 'change' }],
        title: [{ required: true, validator: titleValidator, trigger: 'change' }],
        code: [{ required: true, validator: codeValidator, trigger: 'change' }],
        url: [{ required: true, message: '请上传模板文件', trigger: 'change' }]
      },
      form: {
        type: null,
        title: '',
        code: '',
        url: ''
      }
    }
  },
  methods: {
    async bindDictionary() {
      const res = await getDictionary(['TEMPLATE_OF_TYPE'])
      if (res.code === '0') {
        this.list = res.data.TEMPLATE_OF_TYPE.map((x) => ({ key: x.name, value: x.code }))
      }
    },
    handleDownload(e) {
      console.log(e)
      const a = document.createElement('a')
      a.href = e.url
      a.download = e.name
      a.click()
      a.remove()
    },
    handleRemove() {
      this.fileList = []
      this.form.url = ''
      this.$forceUpdate()
    },
    handleChangeImport(file) {
      console.log(file)

      this.fileList = file.fileList
      if (file.file.status === 'done') {
        this.form.url = file.file?.response?.data[0]?.url
      } else {
        this.form.url = ''
      }
    },
    Save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.id) {
            api.editTemplate(this.form).then((ret) => {
              if (ret.code === '0') {
                this.$message.success('修改成功')
                this.$emit('ok')
              }
            })
          } else {
            api.addTemplate(this.form).then((ret) => {
              if (ret.code === '0') {
                this.$message.success('添加成功')
                this.$emit('ok')
              }
            })
          }
        }
      })
    },
    Close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
