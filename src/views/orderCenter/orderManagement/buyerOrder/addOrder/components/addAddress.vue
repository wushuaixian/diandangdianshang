<template>
  <div class="add-order-add-address">
    <a-form-model
      :ref="`addFormModel_${type}`"
      :model="form"
      :rules="rules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 17 }"
    >
      <a-form-model-item label="所在地区" prop="areas">
        <AreaSelect v-model="form.areas" :selected.sync="areaCode" />
      </a-form-model-item>
      <a-form-model-item label="收货人" prop="personName">
        <a-input v-model="form.personName" :maxLength="10" placeholder="请填写收货人" />
      </a-form-model-item>
      <a-form-model-item label="详细地址" prop="adrress">
        <a-input v-model="form.adrress" :maxLength="50" type="textarea" placeholder="请填写详细地址" />
      </a-form-model-item>
      <a-form-model-item label="手机电话" prop="presonTelephone">
        <a-input v-model="form.presonTelephone" placeholder="请填写手机电话" />
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import AreaSelect from '@/components/AreaSelect'
import * as api from '@/api/orderCenter'
import { addAddressForm, updateAddressForm } from '@/api/recevingAddress'
const rules = {
  personName: [{ required: true, message: '请填写收货人', trigger: 'change' }],
  adrress: [{ required: true, message: '请填写详细地址', trigger: 'change' }],
  presonTelephone: [
    {
      required: true,
      validator: (rule, value, callback) => {
        const reg1 = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
        if (value === '') {
          callback(new Error('请填写手机号'))
        } else if (!reg1.test(value)) {
          callback(new Error('请填写正确的手机号'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  areas: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (value !== undefined && value.length === 3) {
          callback()
        } else {
          callback(new Error('请选择所在地区'))
        }
      },
      trigger: 'change'
    }
  ]
}
export default {
  props: {
    form: {
      type: Object,
      default: () => ({
        id: null,
        personName: '',
        adrress: '',
        presonTelephone: '',
        provinceCode: null,
        cityCode: null,
        areaCode: null,
        province: '',
        city: '',
        area: ''
      })
    },
    type: {
      type: String,
      default: 'DEFAULT'
    },
    saveLoading: {
      type: Boolean,
      default: false
    }
  },
  components: { AreaSelect },
  mounted() {
    if (this.form.id > 0) {
      this.form.areas = [Number(this.form.provinceCode), Number(this.form.cityCode), Number(this.form.areaCode)]
    }
  },
  data() {
    return { rules, area: null, areaCode: [] }
  },
  watch: {
    areaCode(val) {
      if (val.length === 3) {
        this.form.provinceCode = this.areaCode[0]?.code
        this.form.province = this.areaCode[0]?.name
        this.form.cityCode = this.areaCode[1]?.code
        this.form.city = this.areaCode[1]?.name
        this.form.areaCode = this.areaCode[2]?.code
        this.form.area = this.areaCode[2]?.name
      } else {
        this.form.provinceCode = null
        this.form.province = ''
        this.form.cityCode = null
        this.form.city = ''
        this.form.areaCode = null
        this.form.area = ''
      }
    }
  },
  methods: {
    Save() {
      this.$refs[`addFormModel_${this.type}`].validate((valid) => {
        if (valid) {
          if (this.type === 'DEFAULT') {
            const data = {
              id: null,
              userName: this.form.personName,
              detailAddress: this.form.adrress,
              mobile: this.form.presonTelephone,
              provinceCode: this.form.provinceCode,
              cityCode: this.form.cityCode,
              regionCode: this.form.areaCode,
              province: this.form.province,
              city: this.form.city,
              region: this.form.area
            }
            if (this.form.id > 0) {
              data.id = this.form.id
              this.$emit('update:saveLoading', true)
              updateAddressForm(data).then((res) => {
                this.$emit('update:saveLoading', false)
                if (res.code === '0') {
                  this.$message.success(`${this.form.id > 0 ? '保存' : '添加'}地址成功`)
                  this.$emit('update')
                }
              })
            } else {
              this.$emit('update:saveLoading', true)
              addAddressForm(data).then((res) => {
                this.$emit('update:saveLoading', false)
                if (res.code === '0') {
                  this.$message.success(`${this.form.id > 0 ? '保存' : '添加'}地址成功`)
                  this.$emit('update')
                }
              })
            }
          } else {
            if (this.form.id > 0) {
              this.$emit('update:saveLoading', true)
              api.setEditAddress(this.form).then((res) => {
                this.$emit('update:saveLoading', false)
                if (res.code === '0') {
                  this.$message.success(`${this.form.id > 0 ? '保存' : '添加'}地址成功`)
                  this.$emit('update')
                }
              })
            } else {
              this.$emit('update:saveLoading', true)
              api.setAddAddress(this.form).then((res) => {
                this.$emit('update:saveLoading', false)
                if (res.code === '0') {
                  this.$message.success(`${this.form.id > 0 ? '保存' : '添加'}地址成功`)
                  this.$emit('update')
                }
              })
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
.add-order-add-address {
  .ant-form {
    .ant-form-item {
      margin-bottom: 8px;
    }
  }
}
</style>
