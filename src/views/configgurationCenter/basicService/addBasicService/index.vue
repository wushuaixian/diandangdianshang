<!--
 * @Author: your name
 * @Date: 2021-07-21 11:30:26
 * @LastEditTime: 2021-07-27 15:09:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/configgurationCenter/basicService/addBasicService/index.vue
-->
<template>
  <div>
    <a-card>
      <a-form-model ref="form" :model="queryParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="采购商" prop="merchantId">
          <!-- <a-input v-model="form.name" /> -->
          <a-select
            class="selsct-font"
            allowClear
            size="large"
            :disabled="type === 'edit'"
            show-search
            v-model="queryParams.merchantId"
            placeholder="请输入采购商名称进行查询"
            :filter-option="filterOption"
            @change="handleChange"
          >
            <a-select-option v-for="d in comList" :key="d.id" :label="d.enterpriseName" :value="d.orgId">
              {{ d.enterpriseName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
      <a-tabs type="card" :value="tabPosition" @change="callback">
        <a-tab-pane key="1" tab="服务器地址">
          <addServeAddress ref="addServeAddress" @submit="submitServe" @getOrgId="getOrgId"></addServeAddress>
        </a-tab-pane>
        <a-tab-pane key="2" tab="自有系统用户映射" :disabled="!queryParams.merchantId">
          <selfOwnedUserMapping :merchantId="queryParams.merchantId"></selfOwnedUserMapping>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>
<script>
import { purchaseDeploySave, purchaseDeployUpdate, merchantOrgInfoOrgPage } from '@/api/basicService'
import addServeAddress from './components/addServeAddress'
import selfOwnedUserMapping from './components/selfOwnedUserMapping'

export default {
  components: {
    addServeAddress,
    selfOwnedUserMapping
  },
  data() {
    return {
      labelCol: { span: 2 },
      wrapperCol: { span: 14 },
      merchantList: [],
      queryParams: {},
      comList: [],
      fetching: false,
      rules: {
        merchantId: [{ required: true, message: '请选择采购商', trigger: 'blur' }]
      },
      tabPosition: '1',
      type: ''
    }
  },
  mounted() {
    const {
      $route: {
        params: { id, type }
      }
    } = this
    this.type = type
    if (id && type === 'edit') {
      this.$set(this.queryParams, 'merchantId', id)
      const vm = this
      this.$nextTick(() => {
        vm.$refs.addServeAddress.init({ id })
      })
    }
    this.merchantOrgInfoOrgPageFn()
  },
  methods: {
    async merchantOrgInfoOrgPageFn() {
      const result = await merchantOrgInfoOrgPage({
        currentPage: 1,
        itemsPerPage: 1000000,
        isPurchasers: '1'
      })
      this.comList = result?.data.listObj
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    handleChange(value) {
      this.queryParams.merchantId = value
    },
    callback(e) {
      console.log(e)
    },
    getOrgId(merchantId) {
      this.queryParams.merchantId = merchantId
    },
    async submitServe(params) {
      const {
        queryParams: { merchantId },
        $route: {
          params: { type }
        }
      } = this
      const vm = this
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const result =
            type === 'add'
              ? await purchaseDeploySave([
                  {
                    merchantId,
                    ...params
                  }
                ])
              : await purchaseDeployUpdate({
                  merchantId,
                  ...params
                })
          if (result.code === '0') {
            vm.$message.success('保存成功')
            vm.$router.back()
          }
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
</style>
