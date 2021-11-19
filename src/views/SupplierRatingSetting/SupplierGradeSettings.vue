<template>
  <div style="padding: 20px; background: #fff">
    <h1>供应商等级设置</h1>
    <a-table :columns="columns" :pagination="false" :data-source="recordData" :rowKey="(record) => record.id">
      <span slot="complaintContent" slot-scope="text">{{ text }}</span>
      <a slot="pic" slot-scope="text, record">
        <ImagePreview :value="record.url"></ImagePreview>
      </a>
      <a slot="operation" slot-scope="text, record, i">
        <span @click="edit(text, record, i)">编辑</span>
      </a>
    </a-table>
    <a-modal v-model="visible" width="650px" title="编辑" on-ok="handleOk">
      <template slot="footer">
        <a-button key="back" @click="handleCancel"> 取消 </a-button>
        <a-button key="submit" type="primary" @click="handleOk"> 保存 </a-button>
      </template>
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
        <a-form-model-item class="shensu" label="等级名称" prop="name">
          <a-input v-model="form.name" placeholder="请输入内容" />
        </a-form-model-item>
        <a-form-model-item label="等级Logo：">
          <s-upload v-model="form.url" list-type="picture-card">
            <div class="upload" v-if="!form.url">
              <div class="plus">
                <img :src="require('@/assets/images/enterprise/plus.png')" alt="" />
              </div>
              <div class="text">上传图片</div>
            </div>
          </s-upload>
          <p>提示：支持上传一张，建议尺寸800*800PX，单张大小不超过4M，支持JPG、JPEG、PNG格式</p>
          <!--          </a-upload>-->
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { ImagePreview } from '@/components/index.js'

import { getQueryPurchaseGrade, postEditGrade } from '@/api/SupplierSettings.js'

export default {
  components: {
    ImagePreview
  },

  data() {
    return {
      rules: {
        name: {
          required: true,
          trigger: 'blur',
          message: '等级名称不能为空'
        }
      },
      form: {
        id: '',
        name: '',
        url: ''
      },
      Inputvalue: '',
      uploadUrl: '',
      visible: false,
      columns: [],
      recordData: []
    }
  },
  created() {},
  mounted() {
    this.getQueryPurchaseGrade()
    var columnsData = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        align: 'center',
        width: 150,
        customRender: (text, record, index) => `${index + 1}`
      },
      {
        title: '等级名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true
      },
      {
        title: '等级LOGO',
        dataIndex: 'complaintUrl',
        key: 'complaintUrl',
        scopedSlots: { customRender: 'pic' }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        scopedSlots: { customRender: 'operation' }
      }
    ]

    this.columns = columnsData
  },
  methods: {
    async getQueryPurchaseGrade() {
      const { data } = await getQueryPurchaseGrade()
      this.recordData = data.listObj

      // return data.listObj
    },
    handleCancel() {
      this.visible = false
    },
    async handleOk() {
      const data = await postEditGrade(this.form)
      if (data.code === '0') {
        this.$message.info('保存成功')
        this.getQueryPurchaseGrade()
        this.visible = false
      } else {
        this.$message.error('网络错误请检查网络 或者重试')
        this.visible = false
      }
    },
    edit(text, record, i) {
      this.visible = true

      this.form.name = ''
      this.form.id = ''
      this.form.url = ''
      this.$nextTick(() => {
        this.form.name = record.name
        this.form.id = record.id
        this.form.url = record.url
      })

      // this.form.setFieldsValue({ note: `${record.name}` })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
