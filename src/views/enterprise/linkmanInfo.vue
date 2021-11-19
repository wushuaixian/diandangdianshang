<template>
  <div class="link-main-info">
    <Tabtitle :titleName="titleName"></Tabtitle>
    <a-button class="mt-16" size="large" type="primary" @click="addInfo"> 添加联系人 </a-button>
    <a-table class="mt-16" :data-source="linkmanInfoList" :columns="columns" rowKey="id">
      <div slot="tags" class="button" slot-scope="text, tags, i">
        <a @click="edit(text, tags, i)">编辑</a>
        <a @click="deleteInfo(text, tags, i)">删除</a>
      </div>
    </a-table>
    <a-modal v-model="visible" width="650px" title="添加联系人" on-ok="handleOk">
      <template slot="footer">
        <a-button key="back" @click="handleCancel"> 取消 </a-button>
        <a-button key="submit" type="primary" @click="handleOk"> 保存 </a-button>
      </template>
      <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" :form="form">
        <a-form-item label="联系人姓名">
          <a-input
            v-decorator="['name', { rules: [{ required: true, message: '请输入联系人姓名' }], trigger: 'blur' }]"
            placeholder="请输入联系人姓名"
            autocomplete="off"
          />
        </a-form-item>
        <a-form-item label="联系人邮箱">
          <a-input
            v-decorator="[
              'email',
              {
                rules: [{ type: 'email', message: '请输入正确的E-mail格式!' }],
                trigger: 'blur'
              }
            ]"
            placeholder="请输入联系人邮箱"
            autocomplete="off"
          />
        </a-form-item>
        <a-form-item label="联系人手机号" prop="mobileNo">
          <a-input
            v-decorator="[
              'mobileNo',
              {
                rules: [{ required: true, message: '请输入联系人手机号' }, { validator: validatorPhone }],
                trigger: 'blur'
              }
            ]"
            placeholder="请输入联系人手机号"
            autocomplete="off"
          />
        </a-form-item>
        <a-form-item label="职务">
          <a-input v-decorator="['position']" placeholder="请输入联系人职务" autocomplete="off" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import Tabtitle from './tabtitle.vue'
import { getLinkmanInfo, addLinkmanInfo, linkmanInfoUpdateApi, linkmanInfoDeleteApi } from '@/api/enterprise'
// import * as userAPI from '@/api/user'
export default {
  components: {
    Tabtitle: Tabtitle // 导航标题
  },
  data() {
    return {
      titleName: '联系人信息',
      columns: [
        {
          title: '联系人姓名',
          dataIndex: 'name',
          width: 150
          // fixed: 'left'
        },
        { title: '联系人手机号', width: 170, dataIndex: 'mobileNo' },
        { title: '职务', dataIndex: 'position', width: 150 },
        { title: '联系人邮箱', key: '2', width: 120, dataIndex: 'email' },
        {
          title: '操作',
          dataIndex: 'tags',
          width: 120,
          key: 'action',
          scopedSlots: { customRender: 'tags' }
        }
      ],
      visible: false,
      name: '', // 联系人姓名
      pageNumber: 10,
      id: '',
      linkmanInfoList: []
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'form_in_modal' })
  },
  mounted() {
    this.init()
  },
  methods: {
    validatorPhone(rule, value, callback) {
      if (!value) {
        callback()
      } else {
        if (!/^1[3456789]\d{9}$/.test(value)) {
          callback(new Error('手机号格式不正确!'))
        } else {
          callback()
        }
      }
    },
    handleOk(e) {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.id !== '') {
            const id = this.id
            const data = { id, ...values }
            this.linkmanInfoUpdate(data)
          } else {
            const params = { ...values }
            this.linkmanInfoAdd(params)
          }
        }
      })
    },
    handleCancel(e) {
      this.visible = false
    },
    addInfo() {
      this.visible = true
      this.id = ''
      setTimeout(() => {
        this.form.setFieldsValue({ name: '' })
        this.form.setFieldsValue({ email: '' })
        this.form.setFieldsValue({ mobileNo: '' })
        this.form.setFieldsValue({ position: '' })
      }, 100)
    },
    async init() {
      const data = await getLinkmanInfo()
      this.linkmanInfoList = data.data
    },
    async linkmanInfoAdd(params) {
      this.visible = false
      const data = await addLinkmanInfo(params)
      if (data.success === true) {
        this.$message.success(data.message)
      } else {
        this.$message.warning(data.message)
      }
      this.init()
    },
    edit(record, row, key) {
      this.visible = true
      this.id = row.id
      setTimeout(() => {
        this.form.setFieldsValue({ name: row.name })
        this.form.setFieldsValue({ email: row.email })
        this.form.setFieldsValue({ mobileNo: row.mobileNo })
        this.form.setFieldsValue({ position: row.position })
      }, 100)
    },
    async linkmanInfoUpdate(params) {
      this.visible = false
      const data = await linkmanInfoUpdateApi(params)
      if (data.success === true) {
        this.$message.success(data.message)
      } else {
        this.$message.warning(data.message)
      }
      this.init()
    },

    deleteInfo(record, row, key) {
      const _this = this
      this.$confirm({
        title: '是否删除当前联系人?',
        okText: '删除',
        cancelText: '返回',
        async onOk() {
          const params = { id: row.id }
          const data = await linkmanInfoDeleteApi(params)
          if (data.success === true) {
            _this.$message.success(data.message)
          } else {
            _this.$message.warning(data.message)
          }
          _this.init()
        },
        onCancel() {},
        class: 'test'
      })
    },
    onchangePage() {}
  }
}
</script>

<style  lang="less" scoped>
.link-main-info {
  .button {
    a + a {
      margin-left: 10px;
    }
  }
}
.mt-16 {
  margin-top: 16px;
}
</style>
