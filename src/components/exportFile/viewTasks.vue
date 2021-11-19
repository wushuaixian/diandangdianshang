<template>
  <div>
    <a-modal title="查看任务" width="800px" :visible="visible" :footer="null" @cancel="handleCancel">
      <s-table
        v-if="visible"
        rowKey="id"
        ref="table"
        name="homePageTables"
        :scroll="{ x: 1000 }"
        :columns="columns"
        :data="init"
      >
        <template slot="asyncStatue" slot-scope="text">
          <span v-show="text.asyncStatus === 0">执行中</span>
          <span v-show="text.asyncStatus === 1">执行完成</span>
          <span v-show="text.asyncStatus === 2">执行失败</span>
        </template>
        <template slot="createTime" slot-scope="text">
          {{ text.createTime | moment('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template slot="createFileTime" slot-scope="text">
          {{ text.createFileTime | moment('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template slot="action" slot-scope="text">
          <a :href="text.downPath" class="cursor" v-show="text.asyncStatus === 1">点击下载</a>
          <a class="cursor" v-show="text.asyncStatus !== 1">&nbsp;</a>
        </template>
        <template slot="createUsername" slot-scope="text">
          <span>{{ text.createUsername }}</span>
        </template>
      </s-table>
      <div class="footer">
        <a-button @click="$emit('close')">返回</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { queryExportList } from '@/api/fince'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    taskType: {
      type: String,
      default: ''
    },
    taskTypeList: {
      type: Array,
      default: () => []
    },
    faild: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      columns: [
        {
          title: '序号',
          key: 'index',
          width: 100,
          scopedSlots: { customRender: 'index' }
        },
        {
          title: '任务编码',
          key: 'id',
          dataIndex: 'id',
          width: 100
        },
        {
          title: '任务状态',
          key: 'asyncStatue',
          width: 200,
          scopedSlots: { customRender: 'asyncStatue' }
        },
        {
          title: '总记录数',
          key: 'records',
          width: 100,
          dataIndex: 'records'
        },
        {
          title: '任务类型',
          key: 'taskTypeStr',
          width: 200,
          dataIndex: 'taskTypeStr'
        },
        {
          title: '操作人',
          key: 'createUsername',
          width: 150,
          scopedSlots: { customRender: 'createUsername' }
        },
        {
          title: '开始日期',
          key: 'createTime',
          width: 200,
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '结束日期',
          key: 'createFileTime',
          width: 200,
          scopedSlots: { customRender: 'createFileTime' }
        },
        {
          key: 'action',
          fixed: 'right',
          width: 100,
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  mounted() {
    if (this.faild) {
      this.columns[3].title = '总失败数'
    }
  },
  methods: {
    async init(params) {
      const data = {
        ...params,
        taskTypeList: this.taskTypeList,
        taskType: this.taskType
      }
      return queryExportList({ ...data })
    },
    handleCancel() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="less" scoped>
.footer {
  width: 100%;
  text-align: right;
  margin-top: 10px;
}
.cursor {
  cursor: pointer;
  color: #ff6b00;
}
</style>
