<!--
 * @Author: your name
 * @Date: 2021-07-06 14:15:42
 * @LastEditTime: 2021-08-08 19:11:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/systemManagement/logManagement/index.vue
-->
<template>
  <div>
    <a-card>
      <!-- 搜索form  start-->
      <a-form-model ref="operationLogFormModel" :model="queryParam" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="中心模块" prop="centerModule">
              <a-input v-model="queryParam.centerModule" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="子模块" prop="sonModule">
              <a-input v-model="queryParam.sonModule" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="功能" prop="basicFunction">
              <a-input v-model="queryParam.basicFunction" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="子功能" prop="sonFunction">
              <a-input v-model="queryParam.sonFunction" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="操作人" prop="createUsername">
              <a-input v-model="queryParam.createUsername" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="操作时间" prop="time">
              <a-range-picker v-model="queryParam.time" @change="onChange_time" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row class="text-a">
          <!-- <a-col :span="16" :offset="10"> -->
          <a-button type="primary" class="search-btn" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button @click="reset"> 重置 </a-button>
          <!-- </a-col> -->
        </a-row>
      </a-form-model>
      <!-- 搜索form end -->
    </a-card>
    <!-- list start -->
    <a-card>
      <a-row class="btn">
        <a-button type="primary" class="search-btn" @click="exportFile">导出</a-button>
        <a-button type="primary" @click="showExportTaskListModel">查看任务</a-button>
      </a-row>
      <!-- table  start -->
      <s-table
        name="operationLogTableList"
        ref="table"
        rowKey="id"
        :columns="columns"
        :data="getList"
        :scroll="{ x: 300 }"
        :isCanFilter="false"
      >
        <template v-slot:createTime="createTime">
          <div>{{ createTime | moment('YYYY-MM-DD HH:mm:ss') }}</div>
        </template>
      </s-table>
      <!-- table  end -->
    </a-card>
    <!-- list start -->
    <!-- 导出任务弹窗   start -->
    <ExportTaskListModel ref="exportTaskListModel" />
    <!-- 导出任务弹窗   end -->
  </div>
</template>
<script>
import ExportTaskListModel from './components/exportTaskListModel'
import { operateRecordQuery, operateRecordExport } from '@/api/logManagement'
const columns = [
  {
    title: '日志编号',
    dataIndex: 'id',
    key: 'id',
    width: 200
  },
  {
    title: '中心模块',
    dataIndex: 'centerModule',
    key: 'centerModule',
    width: 200
  },
  {
    title: '子模块',
    dataIndex: 'sonModule',
    key: 'sonModule',
    width: 200
  },
  {
    title: '功能',
    dataIndex: 'basicFunction',
    key: 'basicFunction',
    width: 200
  },
  {
    title: '子功能',
    dataIndex: 'sonFunction',
    key: 'sonFunction',
    width: 200
  },
  {
    title: '业务单据编号/名称',
    dataIndex: 'businessDocument',
    key: 'businessDocument',
    width: 200
  },
  {
    title: '行为描述',
    dataIndex: 'businessDesc',
    key: 'businessDesc',
    width: 200
  },
  {
    title: '操作人(账号)',
    dataIndex: 'createUsername',
    key: 'createUsername',
    width: 200
  },
  {
    title: '操作人IP地址',
    dataIndex: 'createUserIp',
    key: 'createUserIp',
    width: 200
  },
  {
    title: '操作时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 200,
    scopedSlots: { customRender: 'createTime' }
  }
]
export default {
  components: {
    ExportTaskListModel
  },
  data() {
    return {
      columns,
      labelCol: { span: 8 },
      wrapperCol: { span: 15 },
      queryParam: {
        centerModule: '',
        sonModule: '',
        basicFunction: '',
        sonFunction: '',
        createUsername: '',
        time: ''
      }
    }
  },
  methods: {
    onChange_time(val, [startTime, endTime]) {
      const vm = this
      vm.queryParam.beginTime = startTime + ' 00:00:01'
      vm.queryParam.endTime = endTime + ' 23:59:59'
    },
    async getList(params) {
      const { queryParam } = this
      const result = await operateRecordQuery({
        ...queryParam,
        ...params
      })
      return result
    },
    // 导出
    async exportFile() {
      const { queryParam } = this
      const result = await operateRecordExport({
        templateCode: 'operateRecordExport',
        jsonTxt: JSON.stringify(queryParam),
        fileName: '导出操作日志'
      })
      if (result.code === '0') {
        this.$message.success('任务导出成功,请在查看任务中查看导出结果')
      }
    },
    showExportTaskListModel() {
      this.$refs.exportTaskListModel.init('operateRecordExport')
    },
    reset() {
      this.$refs.operationLogFormModel.resetFields()
      this.queryParam.beginTime = ''
      this.queryParam.endTime = ''
      this.$refs.table.refresh(true)
    }
  }
}
</script>
<style scoped lang="less">
.search-btn {
  margin-right: 20px;
}
.text-a {
  text-align: center;
}
.btn {
  margin-bottom: 24px;
}
</style>
