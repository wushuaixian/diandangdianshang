<!--
 * @Author: your name
 * @Date: 2021-07-12 13:49:15
 * @LastEditTime: 2021-07-25 02:31:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/components/addNewAddress/index.vue
-->
<template>
  <a-modal
    :title="isEdit === 1 ? '新增收货人信息' : '编辑收货人信息'"
    :visible.sync="visible"
    :footer="null"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form-model ref="ruleForm" :model="queryParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="所在地区" prop="area">
        <AreaSelect v-model="queryParams.area" :selected.sync="areaCode" />
      </a-form-model-item>
      <a-form-model-item label="收货人" prop="userName">
        <a-input v-model="queryParams.userName"></a-input>
      </a-form-model-item>
      <a-form-model-item label="详细地址" prop="detailAddress">
        <a-input v-model="queryParams.detailAddress"></a-input>
      </a-form-model-item>
      <a-form-model-item label="手机号码" prop="mobile">
        <a-input v-model="queryParams.mobile"></a-input>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 8 }">
        <a-button type="primary" @click="handleOk">保存收货人信息</a-button>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>
<script>
import AreaSelect from '@/components/AreaSelect'
import { addAddressForm, updateAddressForm } from '@/api/recevingAddress'
export default {
  components: {
    AreaSelect
  },
  props: {
    isEdit: {
      type: Number,
      default: 1
    },
    visible: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      queryParams: {
        area: []
      },
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      areaCode: [],
      rules: {
        area: [{ required: true, message: '请选择地址', trigger: 'blur' }],
        userName: [{ required: true, message: '请填写收货人', trigger: 'blur' }],
        detailAddress: [{ required: true, message: '请填写详细地址', trigger: 'blur' }],
        mobile: [{ required: true, trigger: 'blur', validator: this.validatorPhone }]
      }
    }
  },
  watch: {
    params(val) {
      this.init()
    }
  },
  methods: {
    init() {
      const { params } = this
      if (params) {
        const { provinceCode, cityCode, regionCode } = params
        this.queryParams = { ...params }
        this.queryParams.area = [Number(provinceCode), Number(cityCode), Number(regionCode)]
      }
    },
    handleCancel() {
      this.$emit('update:visible', false)
    },
    validatorPhone(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入联系人手机号!'))
      } else {
        if (!/^1[3456789]\d{9}$/.test(value)) {
          callback(new Error('手机号格式不正确!'))
        } else {
          callback()
        }
      }
    },
    async handleOk() {
      const vm = this
      this.$refs.ruleForm.validate(async (vaild) => {
        if (vaild) {
          const {
            queryParams: { userName, detailAddress, mobile, area, id }
          } = vm
          const params = {
            userName,
            detailAddress,
            mobile,
            provinceCode: area[0] || null,
            cityCode: area[1] || null,
            regionCode: area[2] || null
          }
          const result =
            vm.isEdit === 1
              ? await addAddressForm(params)
              : await updateAddressForm({
                  id,
                  ...params
                })
          if (result.code === '0') {
            vm.isEdit === 1 ? vm.$message.success('新建地址成功') : vm.$message.success('更新地址成功')
            vm.$emit('updateList')
            vm.handleCancel()
            vm.$refs.ruleForm.resetFields()
          } else {
            this.$message.warning(result.message)
          }
        }
      })
    }
  }
}
</script>
<style scoped>
</style>
