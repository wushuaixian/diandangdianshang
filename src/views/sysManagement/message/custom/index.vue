<template>
  <div class="authInfo">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="ruleForm" :model="query">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="消息名称">
                <a-input placeholder="请输入消息名称" v-model="query.msgName" class="inp" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="推送方式">
                <a-select allowClear class="inp" v-model="query.msgMode" placeholder="请选择推送方式">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="0">手动推送</a-select-option>
                  <a-select-option value="1">自动推送</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="推送形式">
                <a-select allowClear class="inp" v-model="query.msgType" placeholder="请选择推送方式">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="1">站内信</a-select-option>
                  <a-select-option value="2">短信</a-select-option>
                  <a-select-option value="3">邮件</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="推送时间">
                <a-range-picker style="width: 280px" v-model="query.time" show-time/>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="推送条件">
                <a-select allowClear class="inp" v-model="query.sendCondition" placeholder="请选择推送方式">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="(item,index) in objectList" :key="index" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="状态">
                <a-select allowClear class="inp" v-model="query.status" placeholder="请选择推送方式">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="1">未推送</a-select-option>
                  <a-select-option value="2">已推送</a-select-option>
                </a-select>
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
      <div class="bottomButton">
        <a-button @click="showAddMessage">添加</a-button>
      </div>
      <a-table :columns="columns" :data-source="tabledata.data" ref="table" rowKey="id" :loading="loading" :scroll="{ x: 1500 }" :pagination="false">
        <a slot="msgName" slot-scope="msgName">{{ msgName }}</a>
        <template slot="msgText" slot-scope="msgText">
          <div v-html="msgText"></div>
        </template>
        <template slot="msgMode" slot-scope="msgMode">
          <span>{{ msgMode === '0'?'手动推送':'自动推送' }}</span>
        </template>
        <template slot="msgType" slot-scope="text, record">
          <div>
            <span v-if="record.msgTypeMail">站内信；</span>
            <span v-if="record.msgTypePhone">短信；</span>
            <span v-if="record.msgTypeEmail">邮件；</span>
            <span v-if="record.msgTypeTask">待办任务</span>
          </div>
        </template>
        <template slot="timer" slot-scope="timer">
          <span>{{ timer | dayjs }}</span>
        </template>
        <template slot="status" slot-scope="status">
          <a-tag :color="status === '0' ? 'red' : status === '1' ? 'orange' : 'red'">{{ status === '0' ? '未推送' : '已推送' }}</a-tag>
        </template>
        <template slot="isToDoTask" slot-scope="text, record">
          <div>
            <a-button type="link" size="small" v-if="record.status!=='1'" @click="edit(record)">编辑</a-button>
            <a-button type="link" size="small" v-if="record.status!=='1'" @click="showDeleteModal(record)">删除</a-button>
            <a-button type="link" size="small" v-if="record.status === '1'" @click="showMessageList(record)">推送记录</a-button>
            <a-button type="link" size="small" v-if="record.status!=='1'" @click="push(record)">立即推送</a-button>
          </div>
        </template>
      </a-table>
      <div class="pagination">
        <a-pagination :show-total="total => `共 ${tabledata.pageTotal} 条`" show-quick-jumper show-size-changer :default-current="1" :total="tabledata.pageTotal" @change="onChange" @showSizeChange="showSizeChange" />
      </div>
    </div>
    <a-modal v-model="visible" title="提示" ok-text="确认" cancel-text="取消" @ok="sureDelete" @Cancel="hideModal">
      <p>确定删除吗？</p>
    </a-modal>
    <a-modal v-model="isPush" title="提示" ok-text="确认" cancel-text="取消" @ok="surePush" @Cancel="hidePush">
      <p>确定立即推送该消息吗？</p>
    </a-modal>
  </div>
</template>

<script>
  import { msgCustomList, msgCustomObject, msgCenterCustomDelete, pushCustomAgain } from '@/api/message'
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
          { title: '消息内容', width: 200, dataIndex: 'msgText', scopedSlots: { customRender: 'msgText' } },
          { title: '推送方式', dataIndex: 'msgMode', width: 150, scopedSlots: { customRender: 'msgMode' } },
          { title: '推送形式', width: 150, dataIndex: 'msgType', scopedSlots: { customRender: 'msgType' } },
          { title: '推送条件', dataIndex: 'sendConditionName', width: 150, scopedSlots: { customRender: 'sendConditionName' } },
          {
            title: '定时推送时间',
            width: 150,
            dataIndex: 'timer',
            scopedSlots: { customRender: 'timer' }
          },
          {
            title: '状态',
            width: 80,
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' }
          },
          { title: '操作', dataIndex: 'isToDoTask', width: 280, scopedSlots: { customRender: 'isToDoTask' }, fixed: 'right' }
        ],
        isShowEdit: false,
        query: {
          pageNum: 1,
          pageSize: 10,
          msgName: '',
          msgMode: '',
          msgType: '',
          startTimer: '',
          endTimer: '',
          sendCondition: '',
          status: '',
          time: [],
          objectList: []
        },
        tabledata: [],
        objectList: [],
        visible: false,
        paramsDelete: {},
        isPush: false,
        pushParams: {},
        loading: false
      }
    },
    created() {
      this.getMsgCustomList()
      this.getMsgCustomObject()
    },
    methods: {
      async getMsgCustomList() {
        this.loading = true
        this.query.startTimer = this.query.time[0]
        this.query.endTimer = this.query.time[1]
        const data = await msgCustomList(this.query)
        console.log(data)
        this.tabledata = data
        this.loading = false
      },
      // 获取自定义条件列表
      async getMsgCustomObject() {
        const params = {
          pageNum: '1',
          pageSize: '99999999'
        }
        const { data } = await msgCustomObject(params)
        console.log(data)
        this.objectList = data
      },
      // 页码改变
      async onChange(e, num) {
        this.query.pageNum = e
        this.query.pageSize = num
        this.getMsgCustomList()
      },
      // 每页条数变化
      showSizeChange(e, num) {
        this.query.pageNum = e
        this.query.pageSize = num
        this.getMsgCustomList()
      },
      // 查询
      handleSearch() {
        this.getMsgCustomList()
      },
      // 删除自定义消息
      async deleteMsgCenterCustom(record) {
        const params = {
          id: record.id,
          code: record.code
        }
        const data = await msgCenterCustomDelete(params)
        console.log(data)
        if (data.code === 200) {
          this.visible = false
          this.getMsgCustomList()
          this.$message.success('删除成功')
        }
      },
      showDeleteModal(record) {
        this.visible = true
        this.paramsDelete = {
          id: record.id,
          code: record.code
        }
      },
      hideModal() {
        this.visible = false
      },
      sureDelete() {
        this.deleteMsgCenterCustom(this.paramsDelete)
      },
      push(record) {
        this.isPush = true
        this.pushParams = {
          code: record.code
        }
      },
      hidePush() {
        this.isPush = false
      },
      async surePush() {
        this.loading = true
        const data = await pushCustomAgain(this.pushParams)
        console.log(data)
        this.isPush = false
        this.getMsgCustomList()
      },
      // 重置
      resetQuery() {
        this.query = {
          pageNum: 1,
          pageSize: 10,
          msgName: '',
          msgMode: '',
          msgType: '',
          startTimer: '',
          endTimer: '',
          sendCondition: '',
          status: '',
          time: [],
          objectList: []
        }
        this.getMsgCustomList()
      },
      // 编辑
      edit(record) {
        console.log(record)
        this.$router.push({
          name: 'message-messageCustomEdit',
          query: {
            id: record.id
          }
        })
      },
      showAddMessage() {
        this.$router.push({
          name: 'message-messageCustomEdit'
          // query: {
          //   id: ''
          // }
        })
      },
      showMessageList(record) {
        this.$router.push({
          name: 'message-messageCustomList',
          query: {
            code: record.code
          }
        })
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
