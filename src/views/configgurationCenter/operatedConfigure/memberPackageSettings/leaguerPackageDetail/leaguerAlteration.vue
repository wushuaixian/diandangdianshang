
<template>
  <div class="appeal-manage-list">
    <a-card :bordered="true">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="ruleForm" :model="queryParam">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="选择会员套餐" prop="businessName">
                <a-input style="width: 279px" v-model="queryParam.businessName" placeholder="请输入" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="套餐logo" prop="businessName"> </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="套餐原价" prop="businessName">
                <a-input style="width: 279px" v-model="queryParam.businessName" placeholder="请输入" /> 元/年
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :md="24" :sm="24">
              <a-form-model-item label="套餐有效期" prop="time">
                <a-date-picker show-time type="date" placeholder="开始" /> 至
                <a-date-picker show-time type="date" placeholder="结束" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="来源方式" prop="complaintStatus">
                <a-select
                  style="width: 279px"
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  allowClear
                  v-model="queryParam.complaintStatus"
                  :options="select"
                  placeholder="请选择"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
      <br />

      <s-table
        :bordered="true"
        :scroll="{ x: 'calc(300px + 50%)', y: 240 }"
        rowKey="id"
        ref="table"
        :columns="columns"
        :data="getList"
      >
        <template v-slot:createTime="props">
          <div v-if="props">
            {{ props | moment }}
          </div>
          <div v-else></div>
        </template>
      </s-table>

      <div class="button">
        <a-button type="primary" @click="search">保存</a-button>
        <a-button @click="handleReset">返回</a-button>
      </div>
    </a-card>
  </div>
</template>

<script>
import { getList } from '@/api/appealManage'

export default {
  data() {
    return {
      colorList: ['orange', 'blue', 'red'],
      select: [
        {
          label: '线下购买',
          value: '1'
        },
        {
          label: '平台赠送',
          value: '2'
        }
      ],
      columns: [
        {
          title: '供应商名称',
          key: '',
          dataIndex: ''
        },
        {
          title: '供应商编码',
          dataIndex: '',
          key: ''
        },
        {
          title: '供应商状态',
          dataIndex: '',
          key: '',
          scopedSlots: { customRender: '' }
        }
      ],
      queryParam: {
        complaintStatus: [],
        businessName: '',
        time: null
      },
      advanced: false,
      list: []
    }
  },
  methods: {
    // 获取列表
    async getList(pagination) {
      const { queryParam } = this
      const data = {
        ...pagination,
        ...queryParam
      }
      if (data.time) {
        const [beginTime, endTime] = data.time
        data.beginTime = beginTime
        data.endTime = endTime
      }
      return getList({ ...data })
      // eslint-disable-next-line no-unreachable
      // if (res.code === '0') {
      //   const { data, total } = res.data
      //   this.pagination.total = total
      //   this.list = data
      // }
    },
    handleReset() {
      this.$refs.ruleForm.resetFields()
    },
    // 查询
    search() {
      console.log(this.$refs.table.refresh)
      this.$refs.table.refresh(true)
    }
    //
  }
}
</script>

<style lang="less" scoped>
.appeal-manage-list {
  .ant-card + .ant-card {
    margin-top: 20px;
  }
  .button {
    margin-top: 15px;
    text-align: center;
  }
}
</style>
