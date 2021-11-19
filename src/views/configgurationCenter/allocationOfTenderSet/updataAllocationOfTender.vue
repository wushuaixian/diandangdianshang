<template>
  <div>
    <a-card :bordered="false">
      <a-form :form="updataForm">
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="采购商标书费金额"
        >
          <a-input-number
            v-decorator="[
              'price',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入采购商标书费金额'
                  },
                  {
                    pattern: /^(\d{1,8}(\.\d{1,2})?$)/,
                    message: '最多输入10位数字(支持两位小数)',
                    trigger: 'change'
                  }
                ]
              }
            ]"
            :max="999999999"
            :step="0.01"
            :formatter="(value) => (value.includes('.') ? value.slice(0, 11) : value.slice(0, 8))"
            :parser="(value) => (value.includes('.') ? value.slice(0, 11) : value.slice(0, 8))"
            @change="changePrice($event)"
            placeholder="请输入采购商标书费金额"
          />
          <span class="ant-form-item-children-span">元</span>
        </a-form-item>
        <a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }" label="采购商信息">
          <s-table
            name="updataAllocaltionColumns"
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
import { selectOneTenderById, tenderUpdate } from '@/api/configgurationCenter'
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 }
}
export default {
  name: 'UpdataAllocationOfTender',
  data() {
    return {
      formItemLayout,
      updataForm: this.$form.createForm(this, { name: 'updataAllocation' }),
      id: this.$route?.params?.id,
      updataAllocaltionColumns: [
        {
          title: '采购商名称',
          dataIndex: 'enterpriseName',
          key: 'enterpriseName'
        },
        {
          title: '采购商编码',
          dataIndex: 'orgCode',
          key: 'orgCode'
        }
      ]
    }
  },
  mounted() {
    this.updataForm.setFieldsValue({ price: this.$route?.params?.price })
  },
  methods: {
    back() {
      this.$router.push({
        name: 'AllocationOfTenderSetIndex',
        query: {
          tabsKey: '2'
        }
      })
    },
    async updataAllocaltionList() {
      const result = await selectOneTenderById({
        id: this.id
      })
      result.data.listObj = [result.data]
      result.data.total = 1
      return result
    },
    changePrice(e) {
      if (!e) return
      this.updataForm.setFieldsValue({ price: e })
    },
    submit() {
      this.updataForm.validateFields(async (err, value) => {
        if (!err) {
          const result = await tenderUpdate({
            tenderAmount: value.price,
            id: this.id
          })
          if (result.code === '0') {
            this.$message.success(result.message || '修改成功')
            this.$router.push({
              name: 'AllocationOfTenderSetIndex',
              query: {
                tabsKey: '2'
              }
            })
          }
        }
      })
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
