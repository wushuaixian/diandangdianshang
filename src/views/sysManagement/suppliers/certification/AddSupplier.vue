<template>
  <a-modal
    :visible="popupStatus"
    :confirmLoading="confirmLoading"
    title="认证"
    @ok="handleOk"
    @cancel="closePupup"
    width="600px"
    okText="确定"
    cancelText="取消"
  >
    <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="企业名称" prop="merchantId">
        <d-select
          show-search
          :filterOption="handleFetch"
          v-model="form.merchantId"
          placeholder="请选择"
          @change="handleChange"
        >
          <a-select-option v-for="(item, index) in array" :key="index" :value="item.orgId">
            {{ item.enterpriseName }}
          </a-select-option>
          <!-- <a-select-option value="beijing"> Zone two </a-select-option> -->
        </d-select>
      </a-form-model-item>
      <a-form-model-item label="套餐名称" prop="packageId">
        <!-- <a-select v-model="form.packageId" placeholder="请选择" @change="handleChangePackage">
          <a-select-option value="1">中小型企业套餐 - 6800元/年</a-select-option>
          <a-select-option value="2">大型企业套餐 - 19800元/年</a-select-option>
          <a-select-option value="3">行业头部企业战略合作套餐 - 59800元/年</a-select-option>
        </a-select> -->
        <d-select
          v-model="form.packageId"
          @change="handleChangePackage"
          :options="
            packagelistArray.map((i) => {
              return { value: i.id, label: i.packageName + ' - ' + i.packageDiscountPrice + '元/年' }
            })
          "
        >
        </d-select>
      </a-form-model-item>
      <a-form-model-item label="统一社会信用代码">
        <a-input v-model="businessLicenceNo" placeholder="未选择企业" disabled="disabled" />
      </a-form-model-item>
      <a-form-model-item label="法定代表人">
        <a-input v-model="legalPersonName" placeholder="未选择企业" disabled="disabled" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>
<script>
import { getphserList, setAddPackageInfo } from '@/api/purchaser'
import { queryPackageList } from '@/api/supplier'
export default {
  props: {
    popupStatus: Boolean,
    examineMode: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      packagelist: {
        // 1: {
        //   name: '中小型企业套餐',
        //   price: '6800'
        // },
        // 2: {
        //   name: '大企业套餐',
        //   price: '19800'
        // },
        // 3: {
        //   name: '行业头部企业战略合作套餐',
        //   price: '59800'
        // }
      },
      packagelistArray: [],
      right: false,
      rules: {
        merchantId: [{ required: true, message: '请选择企业', trigger: 'change' }],
        packageId: [{ required: true, message: '请选择套餐', trigger: 'change' }]
      },
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      failReason: '',
      radioStatus: 'success',
      confirmLoading: false,
      form: {
        merchantId: '',
        packageId: '',
        messageAmount: '0',
        serviceFeeAmount: '0',
        serviceFeeType: '1',
        sumAmount: '0'
      },
      queryParams: {
        auditStatus: '1',
        enterpriseName: '',
        currentPage: 1,
        itemsPerPage: 10000
      },
      array: [],
      businessLicenceNo: '',
      legalPersonName: '',
      isloading: false
    }
  },
  async created() {
    this.initTable()
    const { data, code } = await queryPackageList()
    if (code === '0') {
      this.packagelistArray = data.filter((item) => {
        return item.id !== 1
      })
      data.map((item) => {
        this.packagelist[item.id] = item
      })
    }
  },
  methods: {
    handleChange(orgId) {
      const item = this.array.find((x) => x.orgId === orgId)
      this.businessLicenceNo = item?.businessLicenceNo
      this.legalPersonName = item?.legalPersonName
      // }
    },
    handleChangePackage() {
      this.form.sumAmount = this.packagelist[this.form.packageId].packageDiscountPrice
    },
    async initTable() {
      try {
        const { data } = await getphserList(this.queryParams)
        this.array = data.listObj
      } catch (err) {
        console.log(err)
      }
    },
    closePupup() {
      this.$emit('close')
    },
    handleFetch(inputValue, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
      // if (!enterpriseName) return
    },
    handleOk() {
      // this.confirmLoading = true
      // this.$refs.ruleForm.resetFields()
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.confirmLoading = true
          setAddPackageInfo({ ...this.form }).then((ret) => {
            this.confirmLoading = false
            if (ret.code === '0') {
              this.$message.success('添加成功')
              this.$emit('update')
              this.closePupup()
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
