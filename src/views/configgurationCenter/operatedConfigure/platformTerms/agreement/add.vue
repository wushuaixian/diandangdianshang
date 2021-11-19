<template>
  <div>
    <a-form-model ref="form" :model="form" :rules="rules" v-bind="layout">
      <a-form-model-item label="条款类型" prop="entryType">
        <a-select v-if="form.entryType" v-model="form.entryType" placeholder="请选择条款类型" style="width: 230px">
          <a-select-option v-for="item in list" :key="item.key" :value="item.value"> {{ item.key }} </a-select-option>
        </a-select>
        <a-select v-else placeholder="请选择条款类型" style="width: 230px" @change="(v) => (form.entryType = v)">
          <a-select-option v-for="item in list" :key="item.key" :value="item.value">
            {{ item.key }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="条款标题" prop="title">
        <a-input v-model="form.title" style="width: 230px" maxLength="20" />
      </a-form-model-item>
      <a-form-model-item label="条款编码" prop="entryCode">
        <a-input v-model="form.entryCode" style="width: 230px" maxLength="20" />
      </a-form-model-item>
      <a-form-model-item label="条款内容" prop="content">
        <tinymce-editor v-if="visible" :height="400" v-model="form.content" />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 3 }">
        <a-button type="primary" @click="Save"> 保存 </a-button>
        <a-button style="margin-left: 10px" @click="Close"> 关闭 </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import TinymceEditor from '@/components/Editor/TinymceEditor.vue'
import * as api from '@/api/configgurationCenter/operatedConfigure/platformTerms/agreement.js'
import { getDictionary } from '@/api/utils.js'
export default {
  name: 'AddAgreement',
  components: { TinymceEditor },
  created() {
    setTimeout(() => {
      this.visible = true
    }, 100)
    this.bindDictionary()
    if (this.id) {
      api.getAgreementDetail(this.id).then((ret) => {
        if (ret.code === '0') {
          this.form.entryType = ret.data.entryType
          this.form.title = ret.data.title
          this.form.entryCode = ret.data.entryCode
          this.form.content = ret.data.content
          this.form.id = ret.data.id
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
    return {
      list: [],
      layout: {
        labelCol: { span: 3 },
        wrapperCol: { span: 20 }
      },
      rules: {
        entryType: [{ required: true, message: '请选择条款类型', trigger: 'blur' }],
        title: [{ required: true, message: '请填写条款标题', trigger: 'blur' }],
        entryCode: [
          {
            required: true,
            validator: (rule, value, callback) => {
              const reg = /^\w+$/
              if (value === '') {
                callback(new Error('请填写条款编码'))
              } else if (!reg.test(value)) {
                callback(new Error('条款编码只能包含字母和数字'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        content: [{ required: true, message: '请填写条款内容', trigger: 'blur' }]
      },
      form: {
        entryType: null,
        title: '',
        entryCode: '',
        content: ''
      },
      visible: false
    }
  },
  methods: {
    async bindDictionary() {
      const res = await getDictionary(['CLAUSE_OF_TYPE'])
      if (res.code === '0') {
        this.list = res.data.CLAUSE_OF_TYPE.map((x) => ({ key: x.name, value: x.code })).filter(
          (x) => x.key !== '采购商免保证金协议'
        )
      }
    },
    Save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.id) {
            api.editAgreement(this.form).then((ret) => {
              if (ret.code === '0') {
                this.$message.success('修改成功')
                this.$emit('ok')
              }
            })
          } else {
            api.addAgreement(this.form).then((ret) => {
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
