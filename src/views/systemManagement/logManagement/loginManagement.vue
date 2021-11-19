<!--
 * @Author: your name
 * @Date: 2021-07-06 14:15:42
 * @LastEditTime: 2021-08-12 14:30:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/systemManagement/logManagement/index.vue
-->
<template>
  <div>
    <!-- 搜索form  start-->
    <a-card>
      <a-form-model ref="loginManagementFormModel" :model="queryParam" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="账号" prop="username">
              <a-input v-model="queryParam.username" placeholder="请输入账号" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="姓名" prop="identityCardName">
              <a-input v-model="queryParam.identityCardName" placeholder="请输入姓名" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="手机号" prop="mobileNo">
              <a-input v-model="queryParam.mobileNo" placeholder="请输入手机号" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="所属机构" prop="merchantId">
              <!-- <a-input v-model="queryParam.accountNumber" /> -->
              <a-select
                allowClear
                :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                size="large"
                show-search
                v-model="queryParam.merchantId"
                placeholder="请输入所属机构名称进行查询"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                @search="handleSearch"
              >
                <!-- <a-spin v-if="fetching" slot="notFoundContent" size="small" /> -->
                <a-select-option v-for="d in comList" :key="d.orgId">
                  {{ d.enterpriseName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="登录时间" prop="time">
              <a-range-picker v-model="queryParam.time" @change="onChange_time" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row class="text-a">
          <a-button type="primary" class="search-btn" @click="$refs.table.refresh(true)">查询</a-button>
          <a-button @click=";(queryParam = {}), $refs.table.refresh(true)">重置</a-button>
        </a-row>
      </a-form-model>
    </a-card>
    <!-- 搜索form end -->
    <!-- list start -->
    <a-card>
      <a-row class="btn">
        <a-button type="primary" class="search-btn" @click="exportFile">导出</a-button>
        <a-button type="primary" @click="showExportTaskListModel">查看任务</a-button>
      </a-row>
      <!-- table  start -->
      <s-table
        name="loginManagermentTableList"
        ref="table"
        rowKey="createTime"
        :columns="columns"
        :data="getList"
        :scroll="{ x: 500 }"
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
import { loginLogQuery, queryMerchantList, operateRecordExport } from '@/api/logManagement'

const columns = [
  {
    title: '账号',
    dataIndex: 'username',
    key: 'username',
    width: 200
  },
  {
    title: '姓名',
    dataIndex: 'identityCardName',
    key: 'identityCardName',
    width: 200
  },
  {
    title: '手机号',
    dataIndex: 'mobileNo',
    key: 'mobileNo',
    width: 200
  },
  {
    title: '所属机构',
    dataIndex: 'merchantName',
    key: 'merchantName',
    width: 200
  },
  {
    title: 'IP地址',
    dataIndex: 'createUserip',
    key: 'createUserip',
    width: 300
  },
  // {
  //   title: 'MAC地址',
  //   dataIndex: 'createUsermac',
  //   key: 'createUsermac',
  //   width: 300
  // },
  {
    title: '浏览器类型',
    dataIndex: 'browser',
    key: 'browser',
    width: 100
  },
  {
    title: '操作系统',
    dataIndex: 'os',
    key: 'os',
    width: 100
  },
  {
    title: '登录时间',
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
      queryParam: {},
      comList: []
      //    "currentPage":1,
      // "itemsPerPage":10,

      // "username":"",
      // "identityCardName":"",
      // "startTime":"",
      // "endTime":"",
      // "mobileNo":"",
      // "merchantId":1988
    }
  },
  methods: {
    async getList(params) {
      const { queryParam } = this
      const result = await loginLogQuery({ ...params, ...queryParam })
      return result
    },
    // 导出
    async exportFile() {
      const { queryParam } = this
      const result = await operateRecordExport({
        templateCode: 'loginLogExport',
        jsonTxt: JSON.stringify(queryParam),
        fileName: '登录日志导出'
      })
      if (result.code === '0') {
        this.$message.success('任务导出成功,请在查看任务中查看导出结果')
      }
    },
    showExportTaskListModel() {
      this.$refs.exportTaskListModel.init('loginLogExport')
    },
    onChange_time(val, [startTime, endTime]) {
      const vm = this
      vm.queryParam.startTime = startTime + ' 00:00:01'
      vm.queryParam.endTime = endTime + ' 23:59:59'
    },
    handleChange(value) {
      console.log('change', value)
    },
    async handleSearch(value) {
      const result = await queryMerchantList({
        merchantName: value
      })
      if (result.code === '0') {
        this.comList = result.data
      }
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
