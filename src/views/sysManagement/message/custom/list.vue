<template>
  <div class="authInfo">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="ruleForm" :model="query">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="账号">
                <a-input v-model="query.merchantId" placeholder="请输入账号" class="inp" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="姓名">
                <a-input v-model="query.userName" placeholder="请输入姓名" class="inp" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="手机号">
                <a-input v-model="query.userMobile" placeholder="请输入手机号" class="inp" />
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :sm="24" class="button">
              <a-button @click="resetQuery">重置</a-button>
              <a-button type="primary" @click="handleSearch">查询</a-button>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <div class="bottom">
      <a-tabs @change="handleTabsChange">
        <a-tab-pane v-for="item in statusList" :key="item.value" :tab="item.label" />
      </a-tabs>
      <div style="text-align: right;margin-bottom: 10px"><a-button type="primary" @click="allSend">批量推送</a-button></div>
      <a-table :row-selection="{ selectedRowKeys: selectedRowKeys, selectedRows: selectedRows, onChange: onSelectChange }" :columns="columns" :data-source="tabledata.msgSendLogs" ref="table" rowKey="id" :pagination="false" :loading="tableLoading">
        <template slot="msgSendType" slot-scope="msgSendType">
          <div>
            <span v-if="msgSendType === 0">站内信</span>
            <span v-if="msgSendType === 1">电子邮件</span>
            <span v-if="msgSendType === 2">短信</span>
            <span v-if="msgSendType === 3">待办消息</span>
          </div>
        </template>
        <template slot="sendStatus" slot-scope="sendStatus">
          <a-tag :color="sendStatus === '0' ? 'green' : sendStatus === '1' ? 'orange' : 'red'">{{ sendStatus === '0' ? '未推送' : sendStatus === '1' ? '推送成功' : '推送失败' }}</a-tag>
        </template>
        <template slot="isToDoTask" slot-scope="text, record">
          <a-button type="link" v-if="record.sendStatus !== '1'" @click="againSend(record)">重新推送</a-button>
        </template>
      </a-table>
      <div class="pagination">
        <a-pagination :show-total="total => `共 ${tabledata.allCount} 条`" show-quick-jumper show-size-changer :default-current="1" :total="tabledata.allCount" @change="onChange" @showSizeChange="showSizeChange" />
      </div>
    </div>
  </div>
</template>

<script>
  import { msgCustomRecordsList, pushCustom } from '@/api/message'
  export default {
    computed: {
      hasSelected() {
        return this.selectedRowKeys.length > 0
      }
    },
    data() {
      return {
        columns: [
          {
            title: '账号',
            width: 150,
            dataIndex: 'merchantId'
          },
          { title: '姓名', width: 150, dataIndex: 'userName' },
          { title: '手机号码', dataIndex: 'userMobile', width: 150 },
          { title: '推送形式', width: 150, dataIndex: 'msgSendType', scopedSlots: { customRender: 'msgSendType' } },
          { title: '所属机构', dataIndex: 'userMechanism', width: 150 },
          {
            title: '状态',
            width: 80,
            dataIndex: 'sendStatus',
            scopedSlots: { customRender: 'sendStatus' }
          },
          { title: '操作', dataIndex: 'isToDoTask', width: 80, scopedSlots: { customRender: 'isToDoTask' } }
        ],
        statusList: [
          { label: '全部', value: '0' },
          { label: '推送成功', value: '1' },
          { label: '推送失败', value: '2' }
        ],
        tabledata: [],
        query: {
          pageNum: '1',
          pageSize: '10',
          msgCode: this.$route.query.code,
          merchantId: '',
          userName: '',
          userMobile: '',
          sendStatus: ''
        },
        msgSendStatusList: [
          { label: '全部', value: '' },
          { label: '站内信', value: 0 },
          { label: '手机短信', value: 2 },
          { label: '电子邮件', value: 1 }
        ],
        tableLoading: false,
        selectedRowKeys: [],
        selectedRows: [],
        ids: []
      }
    },
    created() {
      this.getList()
    },
    methods: {
      async getList() {
        this.tableLoading = true
        const { data } = await msgCustomRecordsList(this.query)
        this.tabledata = data
        this.statusList = [
          { label: '全部(' + data.allCount + ')', value: '-1' },
          { label: '推送成功(' + data.successCount + ')', value: '1' },
          { label: '推送失败(' + data.errorCount + ')', value: '2' }
        ]
        this.tableLoading = false
      },
      // 页码改变
      async onChange(e, num) {
        this.query.pageNum = e
        this.query.pageSize = num
        this.getList()
      },
      // 每页条数变化
      showSizeChange(e, num) {
        this.query.pageNum = e
        this.query.pageSize = num
        this.getList()
      },
      // 查询
      handleSearch() {
        this.getList()
      },
      // 重新推送
      async againSend(record) {
        this.tableLoading = true
        const that = this
        const params = {
          ids: [ record.id ]
        }
        const data = await pushCustom(params)
        console.log(data)
        setTimeout(function() {
          that.getList()
          that.$message.success('推送成功')
        }, 1000)
      },
      // 批量推送
      async allSend() {
        this.tableLoading = true
        const that = this
        const params = {
          ids: this.ids
        }
        const data = await pushCustom(params)
        console.log(data)
        setTimeout(function() {
          that.getList()
          that.$message.success('推送成功')
        }, 1000)
      },
      // 重置
      resetQuery() {
        this.query = {
            pageNum: '1',
            pageSize: '10',
            msgCode: this.$route.query.code,
            merchantId: '',
            userName: '',
            userMobile: '',
            sendStatus: ''
        }
        this.getList()
      },
      // 切换tab
      handleTabsChange(e) {
        console.log(e)
        this.query.sendStatus = e
        this.getList()
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        console.log('selectedRowKeys changed: ', selectedRowKeys)
        console.log('selectedRows changed: ', selectedRows)
        this.selectedRowKeys = selectedRowKeys
        const selectedRow = []
        selectedRows.forEach(ele => {
          this.tabledata.msgSendLogs.forEach(item => {
            if (ele.id === item.id) {
              selectedRow.push(ele.id)
            }
          })
        })
        this.ids = selectedRow
      }
    }
  }
</script>

<style lang="less" scoped>
  .authInfo {
    width: 100%;
    .button {
      text-align: center;
    }
    .top {
      width: 100%;
      height: 130px;
      background: #ffffff;
      border-radius: 8px;
      padding-top: 24px;
      margin-bottom: 20px;
      .top_inpui {
        display: flex;
        height: 32px;
        div {
          flex: 1;
          text-align: center;
          .inp {
            width: 210px;
            margin-left: 8px;
          }
          span {
            width: 102px;
            overflow: hidden;
            display: inline-block;
            text-overflow: ellipsis;
            white-space: nowrap;
            line-height: 15px;
          }
        }
      }
      .top_input_bottom {
        margin-top: 24px;
      }
      .top_button {
        width: 100%;
        height: 32px;
        margin-top: 18px;
        text-align: center;
        .ant-btn + .ant-btn {
          margin-left: 10px;
        }
      }
    }
    .bottom {
      width: 100%;
      background: #ffffff;
      border-radius: 8px;
      padding: 24px;
      margin-top: 20px;
      .bottomButton {
        margin-bottom: 24px;
      }
    }
  }
  .btnBottom {
    box-shadow: 0px 0px 5px #ccc;
    border-radius: 6px;
  }
  .btnLeft {
    width: 120px;
  }
  .btnRight {
    width: 120px;
  }
  .ml-10{
    margin-left: 10px;
    color: #ff6b00;
    cursor: pointer;
  }
  .pagination{
    margin-top: 20px;
    text-align: right;
  }
</style>
