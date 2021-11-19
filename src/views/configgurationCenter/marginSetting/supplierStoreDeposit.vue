
<template>
  <div>
    <a-card class="card">
      <div class="right-log" v-if="tabsKey === '1'">
        <span class="right" @click="visible = true">查看操作日志</span>
      </div>

      <a-form :form="platform">
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="供应商店铺保证金金额"
        >
          <a-input-number
            v-decorator="[
              'amount',
              {
                rules: [
                  { required: true, message: '请输入供应商店铺保证金金额' },
                  {
                    pattern: /^(\d{1,8}(\.\d{1,2})?$)/,
                    message: '最多输入10位数字(支持两位小数)',
                    trigger: 'change'
                  }
                ]
              }
            ]"
            :step="0.01"
            :maxLength="10"
            :formatter="(value) => (value.includes('.') ? value.slice(0, 11) : value.slice(0, 8))"
            :parser="(value) => (value.includes('.') ? value.slice(0, 11) : value.slice(0, 8))"
            placeholder="请输入供应商店铺保证金金额"
            @change="handlePurchaserLowerAmount"
          />
          元
        </a-form-item>
        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="{ span: 8, offset: 4 }">
          <a-button class="submit-btn" type="primary" @click="submitBtn"> 保存 </a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <!-- 日志弹窗 -->
    <a-modal title="查看操作日志" :width="1000" :visible="visible" @ok="handleOk" @cancel="handleCancel">
      <s-table
        ref="table"
        name="marginForSourcing"
        :columns="columns"
        :data="getList"
        rowKey="id"
        :scroll="{ y: 400 }"
        :isCanFilter="false"
      >
        <template slot="updateTime" slot-scope="scope">
          <div>{{ scope | moment('YYYY-MM-DD HH:mm:ss') }}</div>
        </template>
      </s-table>
      <template slot="footer">
        <a-button @click="handleCancel">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import moment from 'moment'
import { findBuyerSourceDeposit } from '@/api/configgurationCenter'
// findPlatformSourceDeposit,
import {
  postaddPurchaseStoreDeposit,
  postpagePurchaseStoreDepositLog,
  getDetailPurchaseStoreDeposit
} from '@/api/cautionMoney'
const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 10 }
}

export default {
  name: 'MarginForSourcing',
  data() {
    return {
      visible: false,
      formItemLayout,
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          width: 100,
          align: 'center'
        },
        {
          title: '供应商店铺保证金金额(元)',
          dataIndex: 'amount',
          key: 'amount',
          width: 250,
          align: 'center'
        },
        {
          title: '操作人',
          dataIndex: 'createUsername',
          key: 'createUsername',
          width: 150,
          align: 'center'
        },
        {
          title: '操作时间',
          dataIndex: 'updateTime',
          key: 'updateTime',
          scopedSlots: { customRender: 'updateTime' },
          width: 200,
          align: 'center'
        }
      ],
      platform: this.$form.createForm(this, {
        ...{ name: 'updataAllocation' },
        amount: null
      }),
      purchasersForm: {
        purchaserName: '',
        purchaserCode: '',
        createTimeStart: undefined,
        createTimeEnd: undefined
      },
      check: null,
      tabsKey: this.$route?.query?.tabsKey || '1'
    }
  },
  computed: {
    ...mapState({
      info: (state) => state.user.info
    })
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const result = await getDetailPurchaseStoreDeposit()
      if (result.code === '0' && result.data) {
        this.check = result.data
        this.platform.setFieldsValue({
          amount: result.data.amount
        })
      }
    },
    async purchasersList(params) {
      if (params.isTrue) {
        this.$refs.purchasersTable.refresh(true)
        return
      }
      this.purchasersForm.createTimeStart = this.purchasersForm?.createTimeStart
        ? moment(this.purchasersForm?.createTimeStart).format('YYYY-MM-DD')
        : undefined
      this.purchasersForm.createTimeEnd = this.purchasersForm?.createTimeStart
        ? moment(this.purchasersForm?.createTimeEnd).format('YYYY-MM-DD')
        : undefined
      const result = await findBuyerSourceDeposit({
        ...{ depositConfigType: '2', dimensionType: '2' },
        ...this.purchasersForm,
        ...params
      })
      result.data.listObj = result.data.data
      result.data.listObj.forEach((item) => {
        // operation.forEach((v) => {
        //   // v = { ...v, ...item }
        //   v = Object.assign(v, item)
        // })
        // this.$set(item, 'operation', operation)
      })
      return result
    },
    async getList(params) {
      const result = await postpagePurchaseStoreDepositLog({
        currentPage: params.currentPage,
        itemsPerPage: params.itemsPerPage
      })
      return result
    },
    // 关闭弹窗
    handleCancel() {
      this.visible = false
    },
    handleOk() {
      this.visible = false
    },

    async submitBtn() {
      this.platform.validateFields(async (err, values) => {
        console.log(err)
        console.log(values)
        if (err) {
          return
        }
        const result = await postaddPurchaseStoreDeposit({
          id: this?.check?.id ?? null,
          ...values
        })
        if (result.code === '0') {
          this.$message.success(result.message)
        }
      })
    },

    handlePurchaserLowerAmount(value) {
      if (!value) return
      this.platform.setFieldsValue({
        amount: value
      })
    }
  }
}
</script>
<style lang="less" scoped>
.right-log:hover {
  color: #ff6b00;
}
.right-log {
  text-align: right;
  cursor: pointer;
}
/deep/ .ant-form-item-children {
  white-space: nowrap;
  .ant-form-item-children-span {
    margin-left: 5px;
  }
}
.picker-span {
  margin: 0px 20px;
}
.search-btn {
  display: block;
  text-align: center;
  margin-top: 30px;
  .ant-btn {
    margin: 0px 10px;
  }
}
.set-btn {
  margin: 20px 0px;
}
.btn-class {
  color: #888;
  cursor: pointer;
  margin-right: 10px;
  color: #ff6b00;
}
/deep/ .ant-input-number {
  display: inline-block;
  width: 200px;
}
/deep/ .ant-input-number-handler-wrap {
  display: none;
}
.card {
  height: 80vh;
}
</style>
