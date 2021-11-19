<template>
  <div class="authInfo">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="ruleForm" :model="query">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="消息名称">
                <a-input v-model="query.msgName" placeholder="请输入消息名称" class="inp" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="消息发送节点">
                <a-select allowClear class="inp" v-model="query.msgSendNode" placeholder="请选择推送方式">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="手动推送">手动推送</a-select-option>
                  <a-select-option value="自动推送">自动推送</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="推送方式">
                <a-select allowClear v-model="query.msgSendType" class="inp" placeholder="请选择推送方式">
                  <a-select-option v-for="(item,index) in msgSendStatusList" :key="index" :value="item.value">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="提交时间" prop="time">
                <a-range-picker v-model="query.time" show-time/>
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
      <a-table :columns="columns" :data-source="tabledata.data" ref="table" rowKey="id" :pagination="false" :loading="tableLoading">
        <a slot="msgName" slot-scope="msgName, record" @click="getMsgRecordsDetail(record)">{{ msgName }}</a>
        <template slot="msgSendStatus" slot-scope="msgSendStatus">
          <a-tag :color="msgSendStatus === 0 ? 'green' : msgSendStatus === 1 ? 'orange' : 'red'">{{ msgSendStatus === 0 ? '未推送' : msgSendStatus === 1 ? '推送成功' : '推送失败' }}</a-tag>
        </template>
        <template slot="msgSendTime" slot-scope="msgSendTime">
          <span>{{ msgSendTime |dayjs }}</span>
        </template>
        <template slot="isToDoTask" slot-scope="text, record">
          <a-button type="link" v-if="record.msgSendStatus !== 1" @click="againSend(record)">重新推送</a-button>
        </template>
      </a-table>
      <div class="pagination">
        <a-pagination :show-total="total => `共 ${tabledata.pageTotal} 条`" show-quick-jumper show-size-changer :default-current="1" :total="tabledata.pageTotal" @change="onChange" @showSizeChange="showSizeChange" />
      </div>
    </div>
    <a-modal v-model="isShow" width="1000px" title="查看" on-ok="handleOk">
      <template slot="footer">
        <a-button key="back" @click="handleCancel"> 关闭 </a-button>
      </template>
      <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="消息名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
          <a-input
            autocomplete="off"
            v-model="msgDetail.msgName"
            disabled
          />
        </a-form-item>
        <a-form-item class="shensu" label="消息内容" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
          <a-textarea v-model="msgDetail.msgText" disabled :rows="4"/>
        </a-form-item>
        <a-form-item label="所属机构" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
          <a-input
            autocomplete="off"
            v-model="msgDetail.userMechanism"
            disabled
          />
        </a-form-item>
        <a-form-item label="推送形式" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
          <a-input
            autocomplete="off"
            v-model="msgDetail.msgSendType"
            disabled
          />
        </a-form-item>
        <a-form-item label="消息发送节点" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
          <a-input
            autocomplete="off"
            v-model="msgDetail.msgSendNode"
            disabled
          />
        </a-form-item>
        <a-form-item label="接收账号" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
          <a-input
            autocomplete="off"
            v-model="msgDetail.msgReceiverCode"
            disabled
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
  import { msgCenterEvent, msgRecordsDetail, pushAgain, pushAll } from '@/api/message'
  export default {
    data() {
      return {
        columns: [
          {
            title: '消息名称',
            width: 150,
            dataIndex: 'msgName',
            scopedSlots: { customRender: 'msgName' }
          },
          { title: '消息内容', width: 150, dataIndex: 'msgText' },
          { title: '消息发送节点', dataIndex: 'msgSendNode', width: 150, scopedSlots: { customRender: 'msgSendNode' } },
          { title: '接收账号', dataIndex: 'msgReceiverCode', width: 150 },
          { title: '所属机构', dataIndex: 'userMechanism', width: 150 },
          { title: '推送形式', width: 150, dataIndex: 'msgSendType' },
          {
            title: '推送时间',
            width: 150,
            dataIndex: 'msgSendTime',
            scopedSlots: { customRender: 'msgSendTime' }
          },
          {
            title: '状态',
            width: 80,
            dataIndex: 'msgSendStatus',
            scopedSlots: { customRender: 'msgSendStatus' }
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
          msgName: '',
          msgSendNode: '',
          msgSendTimeEnd: '',
          msgSendTimeStart: '',
          msgSendType: '',
          msgEventCode: this.$route.query.code,
          time: []
        },
        msgSendStatusList: [
          { label: '全部', value: '' },
          { label: '站内信', value: 0 },
          { label: '手机短信', value: 2 },
          { label: '电子邮件', value: 1 }
        ],
        isShow: false, // 显示消息详情
        msgDetail: {},
        tableLoading: false,
        code: this.$route.query.code
      }
    },
    created() {
      this.getList()
    },
    methods: {
      async getList() {
        this.tableLoading = true
        this.query.msgSendTimeStart = this.query.time[0]
        this.query.msgSendTimeEnd = this.query.time[1]
        const data = await msgCenterEvent(this.query)
        if (data.code === 200) {
          this.tabledata = data
          this.tabledata.data.forEach(ele => {
            this.msgSendStatusList.forEach(item => {
              if (ele.msgSendType === item.value) {
                ele.msgSendType = item.label
              }
            })
          })
          this.statusList = [
            { label: '全部(' + data.allTotal + ')', value: '0' },
            { label: '推送成功(' + data.successTotal + ')', value: '1' },
            { label: '推送失败(' + data.failTotal + ')', value: '2' }
          ]
          this.tableLoading = false
        }
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
      // 消息记录详情
      async getMsgRecordsDetail(record) {
        console.log(record)
        this.isShow = true
        const params = {
          id: record.id
        }
        const { data } = await msgRecordsDetail(params)
        this.msgDetail = data
        this.msgSendStatusList.forEach(item => {
          if (this.msgDetail.msgSendType === item.value) {
            this.msgDetail.msgSendType = item.label
          }
        })
      },
      // 选择时间
      timeChange(value) {
        console.log(value)
      },
      // 关闭弹窗
      handleCancel() {
        this.isShow = false
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
          id: record.id
        }
        const data = await pushAgain(params)
        console.log(data)
        setTimeout(function() {
          that.getList()
          this.$message.success('推送成功')
        }, 1000)
      },
      // 批量推送
      async allSend() {
        this.tableLoading = true
        const that = this
        const params = {
          msgEventCode: this.code
        }
        const data = await pushAll(params)
        console.log(data)
        setTimeout(function() {
          that.getList()
          this.$message.success('推送成功')
        }, 1000)
      },
      // 重置
      resetQuery() {},
      // 切换tab
      handleTabsChange(e) {
        console.log(e)
        this.query.msgSendStatus = e
        this.getList()
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
