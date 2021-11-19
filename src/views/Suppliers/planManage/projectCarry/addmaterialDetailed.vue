<template>
  <div class="mid">
    <div class="buttons">
      <a-button type="primary" @click="look">导入</a-button>
      <a-button type="primary" @click="Reset"> 新增 </a-button>
    </div>
    <!-- <a-button style="margin" type="primary">导出</a-button> -->
    <a-modal
      title="导入"
      :confirmLoading="confirmLoading"
      width="500px"
      :visible="popupyn"
      @cancel="closeojPupup"
      @ok="handleojk"
      okText="确定"
      cancelText="取消"
    >
      <a-form-model layout="inline" destroy-on-close>
        <a-row :gutter="48">
          <a-col :md="24">
            <a-form-model-item label="公司名称：">
              <span>{{ merchantName }}</span>
            </a-form-model-item>
          </a-col>
          <a-col :md="24">
            <a-form-model-item label="导入文件">
              <s-import
                action="/back-manage-web/material/asyncImportMaterial"
                ref="import"
                :file-data="{ merchantId: merchantId }"
                file-name="file"
                :key="numbe"
              >
                <a-button>选择文件</a-button>
              </s-import>
            </a-form-model-item>
          </a-col>

          <a-col :md="24">
            <a-form-model-item label="导入模板下载：">
              <a @click="download">下载</a>
            </a-form-model-item>
          </a-col>
          <a-col :md="24">
            <a-form-model-item>
              <h3>温馨提示：</h3>
              <p>1. 支持xlsx格式的excel文件，大小≤2M，建议物料明细≤5000条。</p>
              <p>2. 物料类目编码必须为末级物料类目，否则将导入失败。</p>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
    <a-modal
      destroy-on-close
      :visible="popupStatus"
      title="新增物料"
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
                :options="loadOptions"
                @select="handleSelect"
                :default-checked-keys="checkedKeys"
                search-nested
              ></tree-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="24" key="" style="margin-bottom: 10px">
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
import { addMateria, all, getPageInfoByKey } from '@/api/supplier'
export default {
  props: {
    merchantId: {
      type: [String, Number],
      default: () => {}
    },
    merchantName: {
      type: String,
      default: () => {}
    }
  },
  data() {
    return {
      confirmLoading: false,
      rules: {
        materialCategoryId: [{ required: true, message: '请选择物料类目', trigger: 'change' }],
        code: [{ required: true, message: '请输入物料编码', trigger: 'change' }],
        name: [{ required: true, message: '请输入物料名称', trigger: 'change' }],
        materialModel: [{ required: false, message: '请输入规格型号', trigger: 'change' }],
        mpMeasurementUnit: [{ required: true, message: '请输入单位', trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        enterpriseName: [{ required: true, message: '请选择物料类目', trigger: 'change' }]
      },
      checkedKeys: [],
      loadOptions: [],
      value: 0,
      url: '',
      numbe: 1,
      popupyn: false,
      popupStatus: false,
      list: {
        merchantId: '',
        materialCategoryId: null,
        code: '',
        name: '',
        materialModel: '',
        mpMeasurementUnit: '',
        status: 0
      }
    }
  },

  methods: {
    // 下载模板
    async download() {
      try {
        const { data } = await getPageInfoByKey({ key: 'material_import' })
        window.open(data.material_import)
      } catch (err) {
        console.log(err)
      }
    },
    normalizer(node) {
      return {
        id: node?.id,
        label: node?.name,
        children: node?.children || ''
      }
    },
    async all() {
      try {
        const { data } = await all({ merchantId: this.merchantId })
        this.loadOptions = data
        // this.$refs.table.refresh(true)
      } catch (err) {
        console.log(err)
      }
    },
    // 物类选择id
    handleSelect(e) {
      this.list.materialCategoryId = e.id
    },
    // 导入弹框
    look() {
      this.list.merchantId = this.merchantId
      this.popupyn = true
    },
    // 新增弹框
    Reset() {
      this.list.merchantId = this.merchantId
      this.all()
      this.popupStatus = true
    },
    // 导入弹框关闭
    closeojPupup() {
      this.numbe++
      this.popupyn = false
    },
    // 新增弹框关闭
    closePupup() {
      this.popupStatus = false
      this.deletedata()
    },
    // 导入弹框确定按钮
    async handleojk() {
      this.numbe++
      this.$message.success('导入中...')
      this.$emit('ok')
      await this.$refs?.import?.uploadFile()
      this.closeojPupup()
    },
    // 新增弹框确定按钮
    async handleOk() {
      await this.$refs.form.validate()
      this.addMateria()
    },
    async addMateria() {
      try {
        const { data } = await addMateria(this.list)
        console.log(data)
        this.popupStatus = false
        this.deletedata()
        this.$emit('changs')
      } catch (err) {
        console.log(err)
      }
    },
    deletedata() {
      this.$refs.form.resetFields()
    }
  }
}
</script>
<style lang="less" scoped>
.mid {
  margin-bottom: 20px;
  .buttons {
    .ant-btn + .ant-btn {
      margin-left: 16px;
    }
    .exportFile {
      margin-left: 16px;
    }
  }
}
.title {
  margin-left: 59px;
  font-size: 14px;
  color: #262626;
}

.m-check {
  display: inline-block;
}
.m-check input[type='radio'] {
  display: none;
}
.m-check input[type='radio']:checked + div {
  border: solid 2px #ff6b00;
  background: #ff6b00;
}
.m-check input[type='radio']:checked + div:after {
  background-color: #fff;
}
/deep/ .ant-upload-list {
  width: 200px;
}
p {
  line-height: 15px;
}
</style>
