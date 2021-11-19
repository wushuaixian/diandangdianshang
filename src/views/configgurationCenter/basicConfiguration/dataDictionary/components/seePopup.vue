<template>
  <div class="detail-box">
    <a-card :bordered="false" v-if="edit.isEdit">
      <a-form-model
        layout="inline"
        ref="form"
        :rules="rules"
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-col :md="8">
          <a-form-model-item label="编码" prop="code">
            <a-input v-model="form.code" placeholder="请输入编码名称" />
          </a-form-model-item>
        </a-col>
        <a-col :md="8">
          <a-form-model-item label="描述" prop="name">
            <a-input v-model="form.name" placeholder="请输入描述" />
          </a-form-model-item>
        </a-col>
        <a-col :md="8">
          <a-form-model-item>
            <a-button type="primary" :loading="addLoading" @click="addItem">新增</a-button>
          </a-form-model-item>
        </a-col>
      </a-form-model>
    </a-card>
    <s-table
      name="dataDictionary"
      ref="table"
      rowKey="id"
      size="middle"
      :list="data"
      :customPage="true"
      :columns="columns"
      :pagination="false"
    >
      <template slot="name" slot-scope="item">
        <span v-show="item.id != id">{{ item.name }}</span>
        <a-input v-show="item.id == id" v-model="item.name" placeholder="请填写描述"></a-input>
      </template>
      <template slot="opera" slot-scope="item">
        <a-button
          class="btn"
          type="link"
          v-show="item.id != id"
          :disabled="id != null && item.id != id"
          @click="editItem(item)"
        >
          编辑
        </a-button>
        <a-popconfirm title="确定删除该字典吗?" ok-text="删除" cancel-text="取消" @confirm="delItem(item)">
          <a-button class="btn" type="link" v-show="item.id != id" :disabled="id != null && item.id != id">
            删除
          </a-button>
        </a-popconfirm>

        <a-button class="btn" type="link" v-show="item.id == id" :loading="editLoading" @click="saveItem(item)">
          保存
        </a-button>
        <a-button class="btn" type="link" v-show="item.id == id && editLoading == false" @click="cancelItem(item)">
          取消
        </a-button>
      </template>
    </s-table>
  </div>
</template>
<script>
import * as api from '@/api/basicConfiguration'
const codeValidator = (rule, value, callback) => {
  const reg = /^[a-zA-Z0-9]+$/u
  if (value === '') {
    callback(new Error('请填写编码'))
  } else if (!reg.test(value)) {
    callback(new Error('只能包含字母和数字'))
  } else {
    callback()
  }
}
const nameValidator = (rule, value, callback) => {
  const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/u
  if (value === '') {
    callback(new Error('请填写描述'))
  } else if (!reg.test(value)) {
    callback(new Error('只能包含汉字、字母和数字'))
  } else {
    callback()
  }
}
const columns = [
  { title: '编码', key: 'code', dataIndex: 'code' },
  { title: '描述', key: 'name', scopedSlots: { customRender: 'name' } }
]
const columnsEdit = [
  { title: '编码', key: 'code', dataIndex: 'code' },
  { title: '描述', key: 'name', scopedSlots: { customRender: 'name' } },
  { title: '操作', key: 'opera', width: 120, align: 'left', scopedSlots: { customRender: 'opera' } }
]
export default {
  created() {
    this.BindData()
    if (!this.edit.isEdit) {
      this.columns = columns
    } else {
      this.columns = columnsEdit
    }
  },
  props: {
    edit: {
      type: Object,
      default: () => ({ pool: '', category: '', language: '', isEdit: false })
    }
  },
  data() {
    return {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
      addLoading: false,
      editLoading: false,
      id: null,
      cache: { name: '' },
      form: { name: '', code: '' },
      rules: {
        name: [{ required: true, validator: nameValidator, trigger: 'change' }],
        code: [{ required: true, validator: codeValidator, trigger: 'change' }]
      },
      columns: [],
      data: []
    }
  },
  methods: {
    editItem(item) {
      this.cache.name = item.name
      this.id = item.id
    },
    cancelItem(item) {
      item.name = this.cache.name
      this.cache.name = ''
      this.id = null
    },
    saveItem(item) {
      const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/u
      if (!reg.test(item.name)) {
        this.$message.error('描述只能包含汉字、字母和数字')
        return
      }
      this.editLoading = true
      api.setEditCode(item.id, item.name).then((ret) => {
        this.editLoading = false
        if (ret.code === '0') {
          this.$message.success('保存成功')
          this.cache.name = ''
          this.id = null
        }
      })
    },
    delItem(item) {
      api.setDelCode(item.id).then((res) => {
        if (res.code === '0') {
          this.$message.success('删除成功')
          this.BindData()
        }
      })
    },
    addItem() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.addLoading = true
          api.setAddCode(Object.assign(this.form, this.edit)).then((ret) => {
            this.addLoading = false
            if (ret.code === '0') {
              this.$message.success('添加成功')
              this.$refs.form.resetFields()
              this.BindData()
            }
          })
        }
      })
    },
    BindData() {
      api.getCode(this.edit.pool, this.edit.category).then((ret) => {
        if (ret.code === '0') {
          this.data = ret.data
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.btn {
  min-width: 40px;
  padding: 0;
}
</style>
