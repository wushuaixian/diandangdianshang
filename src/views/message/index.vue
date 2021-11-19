<template>
  <div class="message-bord">
    <Tabtitle titleName="消息通知"></Tabtitle>
    <a-tabs @change="handleTabsChange">
      <a-tab-pane v-for="item in statusList" :key="item.value" :tab="item.label" />
    </a-tabs>
    <div style="text-align: right">
      <a-input-search placeholder="请输入消息标题" v-model="query.msgName" style="width: 300px" @search="onSearch" />
    </div>
    <a-table style="margin-top: 20px" :data-source="tabledata.data" :columns="columns" ref="table" rowKey="id" :pagination="false">
      <template slot="msgSendTime" slot-scope="text">
        <span>{{ text | dayjs }}</span>
      </template>
      <template slot="isToDoTask" slot-scope="text, record">
        <a-button type="link" @click="getDetail(record)">查看通知</a-button>
      </template>
    </a-table>
    <div class="pagination">
      <a-pagination :show-total="total => `共 ${tabledata.pageTotal} 条`" show-quick-jumper show-size-changer :default-current="1" :total="tabledata.pageTotal" @change="onChange" @showSizeChange="showSizeChange" />
    </div>
    <a-modal v-model="messageShow" width="1000px" title="通知详情" on-ok="phoneOk" @cancel="() => messageOk()">
      <template slot="footer">
        <a-button key="submit" type="primary" @click="messageOk"> 关闭 </a-button>
      </template>
      <Tabtitle titleName="通知详情"></Tabtitle>
      <div class="flex">
        <div class="font">消息标题：{{ messageDetail.magName }}</div>
        <div style="display: flex">
          <p class="font mr-30">发送时间：{{ messageDetail.msgSendTime | dayjs }}</p>
        </div>
      </div>
      <a-divider/>
      <div class="content">
        <div v-html="messageDetail.msgText"></div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import Tabtitle from '../enterprise/tabtitle.vue'
import { msgCenterEventLog, updateMsgReadStatus } from '@/api/message'
import cookie from '@/utils/cookie'
export default {
  components: {
    Tabtitle // 导航标题
  },
  data () {
    return {
      statusList: [
        { label: '全部', value: '5' },
        { label: '未读', value: false },
        { label: '已读', value: true }
      ],
      columns: [
        { title: '序号',
          dataIndex: 'index',
          key: 'index',
          align: 'center',
          width: 80,
          customRender: (text, record, index) => `${index + 1}` },
        { title: '消息标题', dataIndex: 'msgName' },
        { title: '消息内容', dataIndex: 'msgText' },
        { title: '发送时间', dataIndex: 'msgSendTime', scopedSlots: { customRender: 'msgSendTime' } },
        { title: '操作', dataIndex: 'isToDoTask', width: 130, scopedSlots: { customRender: 'isToDoTask' } }
      ],
      query: {
        msgName: '',
        msgIsRead: '',
        pageNum: '1',
        pageSize: '10',
        msgReceiverCode: this.getQueryString('msgReceiverCode')
      },
      ut: cookie.get('ut'),
      tabledata: [],
      messageShow: false,
      messageDetail: {}
    }
  },
  created() {
    this.getMsgCenterEventLog()
  },
  methods: {
    async getMsgCenterEventLog() {
      const data = await msgCenterEventLog(this.query, this.ut)
      this.tabledata = data
      this.statusList = [
        { label: '全部(' + data.allTotal + ')', value: '5' },
        { label: '未读(' + data.unReadTotal + ')', value: false },
        { label: '已读(' + data.readTotal + ')', value: true }
      ]
    },
    // 页码改变
    async onChange(e, num) {
      this.query.pageNum = e
      this.query.pageSize = num
      this.getMsgCenterEventLog()
    },
    // 每页条数变化
    showSizeChange(e, num) {
      this.query.pageNum = e
      this.query.pageSize = num
      this.getMsgCenterEventLog()
    },
    // 搜索
    onSearch() {
      this.getMsgCenterEventLog()
    },
    // 切换tab
    handleTabsChange(e) {
      if (e === '5') {
        this.query.msgIsRead = ''
      } else {
        this.query.msgIsRead = e
      }
      this.getMsgCenterEventLog()
    },
    // 查看详情
    async getDetail(record) {
      this.messageShow = true
      this.messageDetail = record
      const params = {
        id: record.id
      }
      const data = await updateMsgReadStatus(params)
      console.log(data)
    },
    messageOk() {
      this.messageShow = false
      this.getMsgCenterEventLog()
    },
    getQueryString(name) {
      const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      const r = window.location.search.substr(1).match(reg)
      if (r != null) return unescape(r[2])
      return null
    }
  }
}
</script>

<style scoped lang="less">
.message-bord{
  height: 100%;
  min-height: 700px;
  background-color: #ffffff;
  padding: 10px 30px 30px;
}
.pagination{
  text-align: right;
  margin-top: 20px;
}
.font{
  font-size: 16px;
  font-weight: bold;
}
.mr-30{
  margin-right: 30px;
}
.flex{
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
