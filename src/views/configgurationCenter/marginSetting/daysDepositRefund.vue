<template>
  <div>
    <a-card class="card">
      <a-form-model layout="vertical" :model="queryParam" style="margin-left: 50px">
        <a-row :gutter="48">
          <a-col :md="20" :sm="24">
            <a-form-model-item label="" prop="businessName" style="margin-bottom: -20px">
              <div><a style="float: right; margin-top: 15px" @click="visible = true">查看操作日志</a></div>
            </a-form-model-item>
          </a-col>
          <a-col :md="20" :sm="24">
            <div style="margin-bottom: 10px">保证金退还天数设置：</div>
            <a-table :columns="columns" :pagination="false" name="daysDepositRefund" :data-source="data" bordered>
              <template slot="standardType" slot-scope="text, record">
                <span v-if="record.standardType === 1">法定/企业招标、询比价、单一来源 </span>
                <span v-if="record.standardType">正/反向竞价</span>
              </template>

              <template v-for="col in ['loseBidDay', 'sucessBidDay']" :slot="col" slot-scope="text, record">
                <div :key="col">
                  <a-input
                    oninput="value=value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.').replace(/\.{2,}/g,'.').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
                    :maxLength="10"
                    v-if="record.editable"
                    style="margin: -5px 0"
                    :value="text"
                    @change="(e) => handleChange(e.target.value, record.key, col)"
                  />
                  <template v-else>
                    {{ text }}
                  </template>
                </div>
              </template>
              <template slot="operation" slot-scope="text, record">
                <div class="editable-row-operations">
                  <span v-if="record.editable">
                    <a @click="save(record)">保存</a>
                    <a @click="cancel()">取消</a>
                  </span>
                  <span v-else>
                    <a :disabled="editingKey !== ''" @click="() => edit(record.key)">编辑</a>
                  </span>
                </div>
              </template>
            </a-table>
          </a-col>
        </a-row>
      </a-form-model>
    </a-card>
    <!-- 日志 table -->
    <a-modal :width="1200" v-model="visible" title="查看操作日志" :footer="null">
      <div style="height: 700px; position: relative">
        <a-card>
          <s-table
            :scroll="{ y: 600 }"
            rowKey="id"
            ref="table"
            :isCanFilter="false"
            :columns="columnsInit"
            :data="init"
          >
            <template slot="standardType" slot-scope="text, record">
              <span v-if="record.standardType === 1">法定/企业招标、询比价、单一来源 </span>
              <span v-if="record.standardType">正/反向竞价</span>
            </template>
            <template slot="createTime" slot-scope="text, record">
              <span>{{ record.createTime | dayjs }}</span>
            </template>
          </s-table>
        </a-card>
        <a-button style="position: absolute; left: 90%; bottom: -10px" @click="visible = false">关闭</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { postListDepositBackDay, postUpdateDepositBackDay, postpageDepositBackDayLog } from '@/api/cautionMoney'
const columns = [
  {
    title: '设置维度',
    dataIndex: 'standardType',
    scopedSlots: { customRender: 'standardType' },
    align: 'center'
  },
  {
    title: ' 未中标退还天数(N+X)',
    dataIndex: 'loseBidDay',
    scopedSlots: { customRender: 'loseBidDay' },
    align: 'center'
  },
  {
    title: '已中标退还天数(N+X)',
    dataIndex: 'sucessBidDay',

    scopedSlots: { customRender: 'sucessBidDay' },
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
    align: 'center'
  }
]
const columnsInit = [
  {
    title: '设置维度',
    dataIndex: 'standardType',
    scopedSlots: { customRender: 'standardType' },
    align: 'center'
  },
  {
    title: ' 未中标退还天数(N+X)',
    dataIndex: 'loseBidDay',
    scopedSlots: { customRender: 'loseBidDay' },
    align: 'center'
  },
  {
    title: '已中标退还天数(N+X)',
    dataIndex: 'sucessBidDay',

    scopedSlots: { customRender: 'sucessBidDay' },
    align: 'center'
  },
  {
    title: '操作人',
    dataIndex: 'createUsername',
    scopedSlots: { customRender: 'createUsername' },
    align: 'center'
  },
  {
    title: '操作时间',
    dataIndex: 'createTime',
    scopedSlots: { customRender: 'createTime' },
    align: 'center'
  }
]

export default {
  data() {
    return {
      visible: false,
      queryParam: {},
      data: [],
      columns,
      columnsInit,
      editingKey: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleOk() {
      this.visible = false
    },
    getList() {
      postListDepositBackDay().then((res) => {
        this.data = res.data.map((e) => ({ ...e, key: e.id }))
      })
    },
    // 获取列表
    async init(pagination) {
      const data = {
        ...pagination
      }

      return postpageDepositBackDayLog({ ...data })
    },
    handleChange(value, key, column) {
      const newData = [...this.data]
      const target = newData.filter((item) => key === item.key)[0]
      if (target) {
        target[column] = value
        this.data = newData
      }
    },
    edit(key) {
      const newData = [...this.data]
      const target = newData.filter((item) => key === item.key)[0]
      this.editingKey = key
      if (target) {
        target.editable = true
        this.data = newData
      }
    },
    save(row) {
      const params = {
        id: row.id,
        loseBidDay: Number(row.loseBidDay),
        sucessBidDay: Number(row.sucessBidDay),
        standardType: row.standardType
      }

      if (params.loseBidDay === 0 || params.sucessBidDay === 0) {
        this.$message.error('输入值不能为空')
        return
      }

      postUpdateDepositBackDay(params).then((res) => {
        if (res.code === '0') {
          this.$message.success(res.message)
        }
      })
      const newData = [...this.data]
      const newCacheData = [...this.data]
      const target = newData.filter((item) => row.id === item.id)[0]
      const targetCache = newCacheData.filter((item) => row.id === item.id)[0]
      if (target && targetCache) {
        delete target.editable
        this.data = newData
        Object.assign(targetCache, target)
        this.data = newCacheData
      }
      this.editingKey = ''
      this.init()
    },
    cancel() {
      this.editingKey = ''
      this.getList()
    }
  }
}
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
.card {
  height: 80vh;
}
</style>
