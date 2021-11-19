<template>
  <div class="mid">
    <a style="margin" type="primary" @click="look">编辑</a>
    <a-modal
      destroy-on-close
      :visible="popupStatus"
      title="编辑物料"
      @ok="handleOk"
      @cancel="closePupup"
      width="500px"
      okText="确定"
      cancelText="取消"
      class="table-page-search-wrapper-custom"
    >
      <a-form-model
        layout="inline"
        :rules="rules"
        ref="form"
        :model="list"
        v-bind="{
          labelCol: { span: 5 },
          wrapperCol: { span: 24 }
        }"
      >
        <a-row :gutter="48">
          <a-col :md="24" style="margin-bottom: 10px">
            <a-form-model-item label="公司名称">
              {{ merchantName }}
            </a-form-model-item>
          </a-col>
          <a-col :md="24" style="margin-bottom: 10px">
            <a-form-model-item label="物料类目" prop="materialCategoryId">
              <tree-select
                :disable-branch-nodes="true"
                :normalizer="normalizer"
                :options="dataindexobj"
                v-model="list.materialCategoryId"
                search-nested
              ></tree-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" style="margin-bottom: 10px">
            <a-form-model-item label="物料编码" prop="code">
              <a-input :maxLength="100" v-model="list.code" placeholder />
            </a-form-model-item>
          </a-col>
          <a-col :md="24" style="margin-bottom: 10px">
            <a-form-model-item label="物料名称" prop="name">
              <a-input :maxLength="100" v-model="list.name" placeholder />
            </a-form-model-item>
          </a-col>
          <a-col :md="24" style="margin-bottom: 10px">
            <a-form-model-item label="规格型号" prop="materialModel">
              <a-input :maxLength="100" v-model="list.materialModel" placeholder />
            </a-form-model-item>
          </a-col>
          <a-col :md="24" style="margin-bottom: 10px">
            <a-form-model-item label="单位" prop="mpMeasurementUnit">
              <a-input :maxLength="3" v-model="list.mpMeasurementUnit" placeholder />
            </a-form-model-item>
          </a-col>
          <a-col :md="24" style="margin-bottom: 10px">
            <a-form-model-item label="状态" prop="status">
              <a-radio-group v-model="list.status">
                <a-radio :value="0">启用</a-radio>
                <a-radio :value="1">停用</a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { update, all } from '@/api/supplier'
export default {
  props: {
    merchantId: {
      type: [String, Number],
      default: () => {}
    },
    merchantName: {
      type: String,
      default: () => {}
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      rules: {
        materialCategoryId: [{ required: true, message: '请选择物料类目', trigger: 'change' }],
        code: [
          { required: true, message: '请输入物料编码', trigger: 'change' }
          // { max: 30, message: '最多允许输入30个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入物料名称', trigger: 'change' }
          // { max: 30, message: '最多允许输入30个字符', trigger: 'blur' }
        ],
        materialModel: [
          { required: true, message: '请输入规格型号', trigger: 'change' }
          // { max: 10, message: '最多允许输入10个字符', trigger: 'blur' }
        ],
        mpMeasurementUnit: [
          { required: true, message: '请输入单位', trigger: 'change' }
          // { max: 30, message: '最多允许输入30个字符', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
          // { max: 50, message: '最多允许输入50个字符', trigger: 'blur' }
        ],
        enterpriseName: [
          { required: true, message: '请选择物料类目', trigger: 'change' }
          // { max: 20, message: '最多允许输入20个字符', trigger: 'blur' }
        ]
      },
      popupStatus: false,
      failReason: '',
      radioStatus: this.defaultValue || 1,
      list: {
        id: '',
        merchantId: '',
        materialCategoryId: [],
        code: '',
        name: '',
        materialModel: '',
        mpMeasurementUnit: '',
        status: '0'
      },
      dataindexobj: []
    }
  },
  methods: {
    async all() {
      const res = await all({ merchantId: this.merchantId })
      if (res.code === '0') {
        this.dataindexobj = res.data
      }
    },
    normalizer(node) {
      return {
        id: node?.id,
        label: node?.name,
        children: node?.children || ''
      }
    },
    look() {
      this.all()
      this.list = { ...this.data }
      this.list.status = Number(this.data.status)
      this.popupStatus = true
    },
    // 编辑弹框关闭
    closePupup() {
      this.popupStatus = false
    },
    // 编辑弹框确认
    handleOk() {
      if (this.list?.materialCategoryId === null) {
        this.$message.warning('请选择物料类目数据')
        return
      }
      this.addMateria()
    },
    async addMateria() {
      try {
        this.list.status = String(this.list.status)
        const { data } = await update(this.list)
        console.log(data)
        this.closePupup()
        this.$emit('changs')
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.mid {
  .margin {
    margin: 20px;
  }
}
</style>
