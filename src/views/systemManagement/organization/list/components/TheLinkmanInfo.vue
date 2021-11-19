<!--
 * @Author: your name
 * @Date: 2021-07-07 17:06:07
 * @LastEditTime: 2021-07-25 02:59:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/systemManagement/organization/list/components/TheLinkmanInfo.vue
-->
<template>
  <div class="the-link-manInfo">
    <header-title>
      <span>联系人信息</span>
    </header-title>
    <a-button v-if="!edit" class="mt-16" size="large" type="primary" @click="addInfo"> 添加联系人 </a-button>
    <div class="table">
      <s-table :columns="columns" ref="TheLinkmanInfoTable" rowKey="id" name="TheLinkmanInfoTable" :data="init">
        <template slot="operation" slot-scope="text, tags, i">
          <a class="tags" @click="editPhone(text, tags, i)">编辑</a>
          <a @click="detelePhone(text, tags, i)">删除</a>
        </template>
      </s-table>
    </div>
    <a-modal v-model="visible" :title="titleModal" @ok="handleOk">
      <a-form-model
        ref="linkmanLinkForm"
        rowKey="id"
        :model="queryParams"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :rules="rules"
      >
        <a-form-model-item label="联系人姓名" prop="name">
          <a-input v-model="queryParams.name" />
        </a-form-model-item>
        <a-form-model-item label="联系人邮箱" prop="email">
          <a-input v-model="queryParams.email" />
        </a-form-model-item>
        <a-form-model-item label="联系人手机号" prop="mobileNo">
          <a-input v-model="queryParams.mobileNo" />
        </a-form-model-item>
        <a-form-model-item label="职务" prop="position">
          <a-input v-model="queryParams.position" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <div class="class-btn">
      <!-- <a-button class="save-btn" type="primary" v-if="!edit">保存</a-button> -->
      <a-button @click="$router.back()">返回</a-button>
    </div>
  </div>
</template>

<script>
import { addLinkmanInfo, getLinkmanInfo, linkmanInfoDeleteApi, linkmanInfoUpdateApi } from '@/api/enterprise'
import template from '@/views/contract/purchasers/template.vue'

export default {
  components: { template },
  props: {
    edit: {
      type: Boolean,
      default: () => false
    },
    list: {
      type: Array,
      default: () => []
    },
    merchantId: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 15 },
      columns: [
        {
          title: '序号',
          width: 150,
          customRender: (value, item, index) => {
            return index + 1
          }
        },
        {
          title: '联系人姓名',
          dataIndex: 'name',
          width: 150
        },
        { title: '联系人手机号', width: 170, dataIndex: 'mobileNo' },
        { title: '职务', dataIndex: 'position', width: 150 },
        { title: '联系人邮箱', key: '2', width: 120, dataIndex: 'email' },
        { title: '操作', key: 'action', width: 120, fixed: 'right', scopedSlots: { customRender: 'operation' } }
      ],
      rules: {
        name: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
        mobileNo: [{ required: true, validator: this.validatorPhone, trigger: 'blur' }],
        position: [{ required: false, message: '请输入联系人姓名', trigger: 'blur' }],
        email: [{ validator: this.validate_email, trigger: 'blur' }]
      },
      visible: false,
      queryParams: {},
      titleModal: '添加联系人'
    }
  },
  methods: {
    async init() {
      const { merchantId } = this
      const result = await getLinkmanInfo({ merchantId })
      return {
        data: {
          listObj: result.data,
          total: result?.data?.length
        }
      }
    },
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
    validate_email(rule, value, callback) {
      const regEmail = new RegExp(/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/)
      if (value === '' || typeof value === 'undefined') {
        callback()
      } else if (!regEmail.test(value)) {
        callback(new Error('邮箱格式不正确'))
      } else {
        callback()
      }
    },
    addInfo() {
      this.visible = true
      this.titleModal = '添加联系人'
      this.queryParams = {}
    },
    async handleOk() {
      const { queryParams, $message, merchantId } = this
      const _this = this
      this.$refs.linkmanLinkForm.validate(async (valid) => {
        if (valid) {
          const result =
            _this.titleModal === '添加联系人'
              ? await addLinkmanInfo({ ...queryParams, merchantId })
              : await linkmanInfoUpdateApi({ ...queryParams })
          if (result.code === '0') {
            // _this.titleModal === '添加联系人' ? $message.success('保存成功') : $message.success('修改成功')
            $message.success(result.message)
            _this.visible = false
            _this.queryParams = {}
            _this.$refs.TheLinkmanInfoTable.refresh(true)
          }
        }
      })
    },
    editPhone(record, row, key) {
      console.log(row)
      const { name, email, position, mobileNo, id } = row
      this.titleModal = '编辑联系人'
      this.visible = true
      this.queryParams = {
        name,
        email,
        position,
        mobileNo,
        id
      }
    },
    detelePhone(record, row, key) {
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
            _this.visible = false
            _this.$refs.TheLinkmanInfoTable.refresh(true)
          } else {
            _this.$message.warning(data.message)
          }
          _this.init()
        },
        onCancel() {},
        class: 'test'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.the-link-manInfo {
  .table {
    margin-top: 20px;
  }
}
.class-btn {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10px;
  .save-btn {
    margin-right: 20px;
  }
}
.mt-16 {
  margin-top: 20px;
}
.tags {
  margin-right: 15px;
}
</style>
