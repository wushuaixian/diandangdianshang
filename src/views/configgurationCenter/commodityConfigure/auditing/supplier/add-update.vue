
<template>
  <div>
    <a-card :bordered="false">
      <div>
        <a-form-model layout="inline" ref="ruleForm">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="商品审核范围">
                <a-radio-group v-model="auditStatus" @change="changeCustom">
                  <label> <a-radio :value="1"> 审核 </a-radio></label>
                  <label> <a-radio :value="2"> 部分类目审核 </a-radio></label>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="48">
            <a-col :md="24" :sm="24">
              <div class="select">
                <br />
                <a-form-model v-show="auditStatus === 2" style="height: 200px">
                  <a-form-model-item label="选择类目" style="margin-left: 26px">
                    <MYtransfer @getSeleceIds="getSeleceIds"></MYtransfer>
                  </a-form-model-item>
                </a-form-model>
              </div>
            </a-col>
          </a-row>
        </a-form-model>
      </div>

      <MY-add class="myadd" @getList="getList" @getTargetKeys="getTargetKeys"></MY-add>
      <s-table
        :scroll="{ x: 2000 }"
        ref="table"
        name="supplier"
        rowKey="id"
        :columns="columns"
        :customPage="true"
        :list="List"
      >
        <template slot="auditStatus" slot-scope="text, record">
          <span v-if="record.auditStatus === '-1'">待处理</span>
          <span v-if="record.auditStatus === '0'">待审核</span>
          <span v-if="record.auditStatus === '1'"> 通过</span>
          <span v-if="record.auditStatus === '2'">不通过</span>
        </template>
        <template slot="createTime" slot-scope="text, record">
          <span>{{ record.createTime | dayjs }}</span>
        </template>
      </s-table>
      <div style="text-align: center; margin-top: 15px">
        <a-button type="primary" @click="Save">保存</a-button>
        <a-button style="margin-left: 15px" @click="Revert">返回</a-button>
      </div>
    </a-card>
  </div>
</template>

<script>
// import { getList } from '@/api/appealManage'
import { postGoodsAuditSupplierAdd } from '@/api/goodsConfigure'

import MYAdd from './my-add.vue'
import MYtransfer from './my-transfer.vue'

export default {
  components: { MYAdd, MYtransfer },
  data() {
    return {
      List: [],
      columns: [
        {
          title: '供应商名称',
          dataIndex: 'enterpriseName',
          key: 'enterpriseName'
        },
        {
          title: '供应商编码',
          dataIndex: 'orgCode',
          key: 'orgCode'
        },
        {
          title: '供应商状态',
          dataIndex: 'auditStatus',
          key: 'auditStatus',
          scopedSlots: { customRender: 'auditStatus' }
        }
      ],
      auditStatus: 1,
      categoryIds: [],
      selectIds: []
    }
  },
  created() {
    if (this.$route.query.updateData) {
      this.getComeData()
    }
  },
  methods: {
    // 获取编辑页带过来的数据
    getComeData() {
      const comeData = JSON.parse(this.$route.query.updateData)
      console.log(comeData)
      const params = {
        enterpriseName: comeData.merchantName,
        orgCode: comeData.merchantCode,
        auditStatus: comeData.auditStatus
      }
      this.auditStatus = comeData.auditRange
      this.List.push(params)
    },
    // 获取选中类目的ids
    getSeleceIds(optionIds) {
      this.categoryIds = optionIds
    },
    // 监听商品审核选择
    changeCustom(e) {
      this.auditStatus = e.target.value
      console.log(this.auditStatus)
    },
    // 获取列表 新增
    getList(option) {
      this.List = option
    },
    getTargetKeys(ids) {
      console.log(ids)
    },
    Save() {
      const params = []
      const merchantIds = [...this.List.map((e) => ({ merchantId: e.id }))]
      merchantIds.forEach((e) => {
        console.log(e)
        e.categoryIds = [...this.categoryIds]
        params.push({ ...e, auditRange: this.auditStatus })
      })
      postGoodsAuditSupplierAdd(params).then((res) => {
        console.log(res)
        if (res.code === '0') {
          this.$message.success('保存成功')
          this.$router.push({ name: 'auditingIndex', params: { activated: '3' } })
        }
      })
    },
    Revert() {
      this.$router.push({ name: 'auditingIndex', params: { activated: '3' } })
    }
  }
}
</script>

<style lang="less" scoped>
.button {
  text-align: center;
}
.select {
  height: 370px;
}
.myadd {
  width: 100%;
}
</style>
