<template>
  <a-space direction="vertical">
    <a-card>
      <s-table
        ref="table"
        name="staffManagementTable"
        rowKey="asyncId"
        :scroll="{ x: 900 }"
        :columns="columns"
        :data="init"
      >
        <template slot="asyncStatus" slot-scope="record">
          {{ record.asyncStatus === '1' ? '成功' : '失败' }}
        </template>
        <template slot="operation" slot-scope="record">
          <a-space>
            <a @click="() => handleDownload(record.downPath)">点击下载</a>
          </a-space>
        </template>
      </s-table>
    </a-card>
  </a-space>
</template>

<script>
import { getAsyncEventList } from '@/api/asyncexport.js'
export default {
  name: 'Task',
  data() {
    return {
      form: {},
      time: [],
      queryParam: {
        taskType: 'employeeImport'
      },
      columns: [
        { title: '事件ID', dataIndex: 'asyncId' },
        { title: '任务编码', dataIndex: 'taskType' },
        { title: '任务状态', key: 'asyncStatus', scopedSlots: { customRender: 'asyncStatus' } },
        { title: '失败条目', dataIndex: 'records' },
        { title: '导入创建时间', dataIndex: 'createTime' },
        { title: '导入完成时间', dataIndex: 'createFileTime' },
        { title: '操作', key: 'operation', scopedSlots: { customRender: 'operation' } }
      ]
    }
  },
  methods: {
    async init(pagination) {
      const { queryParam } = this
      const { currentPage, itemsPerPage } = pagination
      const params = {
        ...queryParam,
        limitStart: currentPage - 1,
        limitCount: itemsPerPage
      }

      const res = await getAsyncEventList({ ...params })
      const { code, result, message } = res || {}
      return {
        code: code,
        data: {
          listObj: result.list,
          total: result.pages
        },
        message: message
      }
    },
    handleDownload(url) {
      window.open(url)
    }
  }
}
</script>

<style scoped>
</style>
