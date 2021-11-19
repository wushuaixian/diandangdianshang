<!--
 * @Author: your name
 * @Date: 2021-06-19 15:31:23
 * @LastEditTime: 2021-07-05 17:42:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/configgurationCenter/marginSetting/updataPlatformMargin.vue
-->
<template>
  <div>
    <a-card :bordered="false">
      <a-form :form="updataForm">
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="采购商寻源保证金下限金额"
        >
          <a-input-number
            :maxLength="10"
            v-decorator="[
              'price',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入采购商寻源保证金下限金额'
                  },
                  {
                    pattern: /^(\d{1,8}(\.\d{1,2})?$)/,
                    message: '最多输入10位数字(支持两位小数)',
                    trigger: 'change'
                  }
                ]
              }
            ]"
            :step="0.01"
            :formatter="(value) => (value.includes('.') ? value.slice(0, 11) : value.slice(0, 8))"
            :parser="(value) => (value.includes('.') ? value.slice(0, 11) : value.slice(0, 8))"
            placeholder="请输入采购商寻源保证金下限金额"
            @change="handelPrice"
          />
          <span class="ant-form-item-children-span">元</span>
        </a-form-item>
        <a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }" label="采购商信息">
          <s-table
            name="updataPlatformMargin"
            ref="table"
            :columns="updataAllocaltionColumns"
            :data="updataAllocaltionList"
            rowKey="id"
            :isCanFilter="false"
          />
        </a-form-item>
        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="{ span: 8, offset: 4 }" class="search-btn">
          <a-button class="submit-btn" type="primary" @click="submit"> 保存 </a-button>
          <a-button class="submit-btn" @click="back"> 返回 </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>
<script>
import { findBuyerSourceDepositById, updateBuyerSourceDeposit } from '@/api/configgurationCenter'
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 }
}
export default {
  name: 'UpdataPlatformMargin',
  data() {
    return {
      formItemLayout,
      id: this.$route?.params?.id,
      updataForm: this.$form.createForm(this, { name: 'updataAllocation' }),
      updataAllocaltionColumns: [
        {
          title: '采购商名称',
          dataIndex: 'purchaserName',
          key: 'purchaserName'
        },
        {
          title: '采购商编码',
          dataIndex: 'purchaserCode',
          key: 'purchaserCode'
        }
      ]
    }
  },
  mounted() {
    this.updataForm.setFieldsValue({ price: this.$route.params?.price })
  },
  methods: {
    back() {
      this.$router.push({
        name: 'MarginForSourcing',
        query: {
          tabsKey: '2'
        }
      })
    },
    async updataAllocaltionList() {
      const result = await findBuyerSourceDepositById({ id: this.id })
      const res = {
        data: {
          listObj: [result.data],
          total: 1
        }
      }
      return res
    },
    async submit() {
      this.updataForm.validateFields(async (err, value) => {
        if (!err) {
          const { data } = await this.$refs.table.data()
          const { purchaserId, purchaserCode, purchaserName } = data.listObj[0]

          const result = await updateBuyerSourceDeposit({
            id: this.id,
            purchaserId,
            purchaserName,
            purchaserCode,
            purchaserLowerAmount: value.price
          })
          if (result.code === '0') {
            this.$message.success(result.message)
            this.$router.push({
              name: 'MarginForSourcing',
              query: {
                tabsKey: '2'
              }
            })
          }
        }
      })
    },
    handelPrice(value) {
      if (!value) return
      // const v = Math.abs(value.target.value).toFixed(2)
      this.updataForm.setFieldsValue({ price: value })
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .ant-form-item-children {
  white-space: nowrap;
  .ant-form-item-children-span {
    margin-left: 5px;
  }
}
/deep/ .ant-input-number {
  display: inline-block;
  width: 200px;
}
/deep/ .ant-input-number-handler-wrap {
  display: none;
}
.search-btn {
  text-align: center;
  display: flex;
  justify-content: center;
  margin-top: 30px;
  .ant-btn {
    margin: 0px 10px;
  }
}
</style>
