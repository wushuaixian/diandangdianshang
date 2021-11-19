
<template>
  <div class="appeal-manage-list">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="ruleForm" :model="queryParam">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="采购商名称" prop="enterpriseName">
                <a-input v-model="queryParam.enterpriseName" placeholder="请输入" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="采购商编码" prop="orgCode">
                <a-input v-model="queryParam.orgCode" placeholder="请输入" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="创建时间" prop="time">
                <a-range-picker v-model="queryParam.time" />
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :sm="24" class="button">
              <a-button @click="handleReset">重置</a-button>
              <a-button type="primary" @click="search">查询</a-button>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <a-card>
      <div class="add_button">
        <a-button type="primary" @click="gotoAdd">添加设置</a-button>
        <a @click="Check">查看操作日志</a>
      </div>
      <s-table
        :scroll="{ y: true }"
        rowKey="id"
        ref="table"
        :columns="columns"
        name="daysDepositRefund"
        :data="getList"
      >
        <template slot="isFree" slot-scope="text, record">
          <span v-if="record.isFree === 1">免保证金</span>
          <span v-if="record.isFree === 0">不免保证金</span>
        </template>
        <template slot="options" slot-scope="text, record">
          <a @click="Delete(record.id)">删除</a>
        </template>
        <template v-slot:createTime="props">
          <div v-if="props">
            {{ props | dayjs }}
          </div>
          <div v-else></div>
        </template>
      </s-table>
    </a-card>
    <!-- 查看日志 -->
    <a-modal :width="1000" title="查看操作日志" @cancel="visibleLog = false" :visible="visibleLog" :footer="null">
      <s-table
        :scroll="{ y: 400 }"
        rowKey="id"
        ref="table"
        :columns="columnsLog"
        :isCanFilter="false"
        name="daysDepositRefund"
        :data="getListLog"
      >
        <template slot="isFree" slot-scope="text, record">
          <span v-if="record.isFree === 1">免保证金</span>
          <span v-if="record.isFree === 2">不免保证金</span>
        </template>
        <template slot="options" slot-scope="text, record">
          <a @click="Delete(record.id)">删除</a>
        </template>
        <template v-slot:createTime="props">
          <div v-if="props">
            {{ props | dayjs }}
          </div>
          <div v-else></div>
        </template>
      </s-table>
      <div style="text-align: center; margin-top: 15px">
        <a-button @click="visibleLog = false">关闭</a-button>
      </div>
    </a-modal>
    <a-modal title="删除" :visible="visibleDelete" @cancel="visibleDelete = false" @ok="handleDelete">
      <div style="text-align: center">确认删除当前数据吗？</div>
    </a-modal>
  </div>
</template>

<script>
import {
  postDeletePurchaseFreeDeposit,
  postPagePurchaseFreeDeposit,
  postPagePurchaseFreeDepositLog
} from '@/api/cautionMoney'

export default {
  data() {
    return {
      id: '',
      visibleLog: false,
      visibleDelete: false,
      options: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '待处理',
          value: '0'
        },
        {
          label: '已处理',
          value: '1'
        },
        {
          label: '驳回',
          value: '2'
        }
      ],
      columns: [
        {
          title: '采购商名称',
          dataIndex: 'enterpriseName',
          key: 'enterpriseName'
        },
        {
          title: '采购商编码',
          dataIndex: 'orgCode',
          key: 'orgCode'
        },
        {
          title: '采购商免保证金状态',
          dataIndex: 'isFree',
          key: 'isFree',
          scopedSlots: { customRender: 'isFree' }
        },
        {
          title: '创建人',
          dataIndex: 'updateUsername',
          key: 'updateUsername'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime',
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '操作',
          dataIndex: 'options',
          key: 'options',
          scopedSlots: { customRender: 'options' }
        }
      ],
      columnsLog: [
        {
          title: '采购商名称',
          dataIndex: 'enterpriseName',
          key: 'enterpriseName'
        },
        {
          title: '采购商编码',
          dataIndex: 'orgCode',
          key: 'orgCode'
        },
        {
          title: '采购商免保证金状态',
          dataIndex: 'isFree',
          key: 'isFree',
          scopedSlots: { customRender: 'isFree' }
        },
        {
          title: '操作人',
          dataIndex: 'updateUsername',
          key: 'updateUsername'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime',
          scopedSlots: { customRender: 'createTime' }
        }
      ],
      queryParam: {
        orgCode: null,
        enterpriseName: null,
        time: null
      }
    }
  },
  methods: {
    Delete(id) {
      this.id = id
      this.visibleDelete = true
    },
    handleDelete() {
      postDeletePurchaseFreeDeposit({ id: this.id }).then((res) => {
        if (res.code === '0') {
          this.search()
        }
        this.visibleDelete = false
      })
    },
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
      return postPagePurchaseFreeDeposit({ ...data })
    },
    // 获取日志列表
    async getListLog(pagination) {
      const data = {
        ...pagination
      }

      return postPagePurchaseFreeDepositLog({ ...data })
    },
    handleReset() {
      this.$refs.ruleForm.resetFields()
    },
    // 查询
    search() {
      this.$refs.table.refresh(true)
    },
    // 查看日志
    Check() {
      this.visibleLog = true
    },

    // 添加设置
    gotoAdd() {
      this.$router.push({ name: 'BuyerSecurityDepositAdd' })
    }
  }
}
</script>

<style lang="less" scoped>
.button {
  text-align: center;
}
.add_button {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
</style>
