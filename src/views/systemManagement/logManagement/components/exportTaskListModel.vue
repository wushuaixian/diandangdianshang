<!--
 * @Author: your name
 * @Date: 2021-07-06 15:09:37
 * @LastEditTime: 2021-08-08 19:16:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/systemManagement/logManagement/components/exportTaskListModel.vue
-->
<template>
  <div>
    <a-modal title="导出任务列表" :width="800" v-model="visible" @ok="handleOk" @cancel="handleCancel">
      <!-- 搜索form  start-->
      <a-form-model ref="exportTaskListFormModel" :model="queryParam" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="操作时间" prop="time">
              <a-range-picker v-model="queryParam.time" @change="onChange_time" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="任务编码" prop="id">
              <a-input v-model="queryParam.id" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="操作人" prop="createUsername">
              <a-input v-model="queryParam.createUsername" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row class="btn">
          <a-button
            type="primary"
            class="search-btn"
            @click="$refs.table.refresh(true), (queryParam.fromCreateTime = ''), (queryParam.toCreateTime = '')"
          >
            查询
          </a-button>
          <a-button @click="$refs.exportTaskListFormModel.resetFields(), $refs.table.refresh(true)"> 重置 </a-button>
        </a-row>
      </a-form-model>
      <!-- table  start -->
      <s-table
        name="exportTaskTableList"
        ref="table"
        rowKey="id"
        :columns="columns"
        :data="getList"
        :scroll="{ x: 300, y: 400 }"
      >
        <template v-slot:createTime="createTime">
          <div>{{ createTime | moment('YYYY-MM-DD HH:mm:ss') }}</div>
        </template>
        <template v-slot:createFileTime="createFileTime">
          <div>{{ createFileTime | moment('YYYY-MM-DD HH:mm:ss') }}</div>
        </template>
        <template slot="action" slot-scope="action, item" v-if="item.downPath">
          <a :href="item.downPath">下载</a>
        </template>
      </s-table>
      <!-- table  end -->

      <!-- 搜索form end -->
    </a-modal>
  </div>
</template>
<script>
import moment from 'moment'
import { getAsyncEventInfoList } from '@/api/logManagement'
const asyncStatusList = ['执行中', '执行成功', '执行失败']
const columns = [
  {
    title: '任务编号',
    dataIndex: 'asyncId',
    width: 200,
    key: 'asyncId'
  },
  {
    title: '任务类型',
    width: 200,
    customRender: (item) => {
      const text = item.taskType === 'loginLogExport' ? '导出登录日志' : '导出操作日志'
      return text
    }
  },
  {
    title: '操作人',
    dataIndex: 'createUsername',
    width: 200,
    key: 'createUsername'
  },
  {
    title: '操作类型',
    width: 200,
    customRender: () => {
      return '导出'
    }
  },
  {
    title: '任务状态',
    dataIndex: 'asyncStatus',
    key: 'asyncStatus',
    width: 200,
    customRender: (item) => {
      return asyncStatusList[item]
    }
  },
  {
    title: '任务开始时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 200,
    scopedSlots: { customRender: 'createTime' }
  },
  {
    title: '任务结束时间',
    dataIndex: 'createFileTime',
    key: 'createFileTime',
    width: 200,
    scopedSlots: { customRender: 'createFileTime' }
  },
  {
    title: '总记录数',
    dataIndex: 'records',
    width: 200,
    key: 'records'
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  data() {
    return {
      columns,
      visible: false,
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
      queryParam: {},
      taskType: 'operateRecordExport'
    }
  },
  methods: {
    disabledBeginDate(current) {
      return current >= moment().startOf('day')
    },
    disabledDate(current) {
      return current <= moment().startOf('day')
    },
    init(taskType) {
      this.visible = true
      this.taskType = taskType
      this.$refs.table.refresh(true)
    },
    // 取消
    handleCancel() {
      this.visible = false
    },
    // 确认
    handleOk() {
      this.visible = false
    },
    onChange_time(val, [startTime, endTime]) {
      const vm = this
      vm.queryParam.fromCreateTime = startTime + ' 00:00:01'
      vm.queryParam.toCreateTime = endTime + ' 23:59:59'
    },
    async getList(params) {
      const { queryParam, taskType } = this
      const { currentPage, itemsPerPage } = params
      const { result } = await getAsyncEventInfoList({
        taskTypeListStr: taskType,
        limitStart: currentPage,
        limitCount: itemsPerPage,
        ...queryParam
      })
      const res = {
        data: {
          listObj: result.list,
          total: result.pages
        }
      }
      return res
    }
  }
}
</script>
<style scoped lang="less">
.search-btn {
  margin-right: 20px;
}
.btn {
  margin-bottom: 24px;
  text-align: center;
}
</style>
