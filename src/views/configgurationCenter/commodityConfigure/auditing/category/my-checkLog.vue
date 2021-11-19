
<template>
  <div>
    <a style="float: right" @click="checkLog">查看操作日志</a>

    <a-modal
      title="查看操作日志"
      :width="1300"
      ok-text="确认"
      cancel-text="取消"
      :visible="visibleCheckLog"
      @ok="handleCheckLog"
      @cancel="cancel"
    >
      <a-card :bordered="false">
        <a-form-model layout="inline" ref="ruleForm" :model="queryParam">
          <a-row :gutter="48">
            <a-col :md="12" :sm="24">
              <a-form-model-item label="选择类型">
                <a-select
                  v-model="select"
                  @change="changeSelectType"
                  allowClear
                  style="width: 269px"
                  :options="selectType"
                  placeholder="请选择"
                >
                </a-select>
              </a-form-model-item>
            </a-col>

            <a-col :md="24" :sm="24" class="button">
              <a-button @click="handleReset">重置</a-button>
              <a-button type="primary" @click="search">查询</a-button>
            </a-col>
          </a-row>
        </a-form-model>
      </a-card>
      <a-card>
        <s-table :scroll="{ y: 270 }" rowKey="id" ref="table" name="my-checkLog" :columns="columns" :data="getList">
          <template slot="auditType" slot-scope="text, record">
            <span v-if="record.auditType === 1">自主创建商品审核设置</span>
            <span v-if="record.auditType === 2">物料创建商品审核设置</span>
          </template>
          <template slot="auditStatus" slot-scope="text, record">
            <span v-if="record.auditStatus === 1">审核</span>
            <span v-if="record.auditStatus === 2">不审核</span>
            <span v-if="record.auditStatus === 3">部分审核</span>
          </template>
          <template slot="priceDownward" slot-scope="text, record">
            <span v-if="record.priceDownward && record.priceDownward !== null && record.priceDownward !== ''">
              {{ record.priceDownward }}%</span
            >
          </template>
          <template slot="priceUpward" slot-scope="text, record">
            <span v-if="record.priceUpward && record.priceUpward !== null && record.priceUpward !== ''">
              {{ record.priceUpward }} %</span
            >
          </template>
          <template slot="createTime" slot-scope="text, record">
            {{ record.createTime | dayjs }}
          </template>
        </s-table>
      </a-card>
    </a-modal>
  </div>
</template>

<script>
import { postQueryLogList } from '@/api/goodsConfigure'

export default {
  data() {
    return {
      visibleCheckLog: false,
      select: [],
      selectType: [
        {
          label: '全部',
          value: null
        },
        {
          label: '自主创建商品审核设置',
          value: 1
        },
        {
          label: '物料创建商品审核设置',
          value: 2
        }
      ],
      columns: [
        {
          title: '类型',
          dataIndex: 'auditType',
          key: 'auditType',
          scopedSlots: { customRender: 'auditType' }
        },
        {
          title: '是否审核',
          dataIndex: 'auditStatus',
          key: 'auditStatus',
          scopedSlots: { customRender: 'auditStatus' }
        },
        {
          title: '浮动价格区间起%',
          dataIndex: 'priceDownward',
          key: 'priceDownward',
          scopedSlots: { customRender: 'priceDownward' }
        },
        {
          title: '浮动价格区间止%',
          dataIndex: 'priceUpward',
          key: 'priceUpward',
          scopedSlots: { customRender: 'priceUpward' }
        },
        {
          title: '操作人',
          dataIndex: 'createUsername',
          key: 'createUsername',
          scopedSlots: { customRender: 'createUsername' }
        },
        {
          title: '操作时间',
          dataIndex: 'createTime',
          key: 'createTime',
          scopedSlots: { customRender: 'createTime' }
        }
      ],
      queryParam: {
        auditType: null
      }
    }
  },
  methods: {
    // 监听选择类型
    changeSelectType(e) {
      this.queryParam.auditType = e
    },
    // 显示日志modal
    checkLog() {
      this.visibleCheckLog = true
    },
    // 关闭日志modal
    cancel() {
      this.visibleCheckLog = false
    },
    // 确认日志modal
    handleCheckLog() {
      this.visibleCheckLog = false
    },
    // 获取列表
    async getList(pagination) {
      const { queryParam } = this
      const data = {
        ...pagination,
        ...queryParam
      }
      return postQueryLogList({ ...data })
    },
    handleReset() {
      this.select = []
    },
    // 查询
    search() {
      this.$refs.table.refresh(true)
    }
    //
  }
}
</script>

<style lang="less" scoped>
.button {
  text-align: center;
}
</style>
