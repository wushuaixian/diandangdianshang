<template>
  <div class="authInfo">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="ruleForm">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="消息类型">
                <a-select allowClear class="inp" @change="selectChange" placeholder="请选择消息类型">
                  <a-select-option v-for="item in authStatusList" :key="item.key" :value="item.key">
                    {{ item.value }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="消息名称">
                <a-input placeholder="请输入消息名称" class="inp" v-model="msgName" />
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
      <a-table :columns="columns" :data-source="tabledata.data" ref="table" rowKey="id" :pagination="false" :scroll="{ x: 1500 }">
        <!-- :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" -->
        <template slot="mailStatus" slot-scope="text, record, index, data">
          <div class="enterpriseName"><a-switch v-model="record.mailStatus" :disabled="record.whetherEnable" @change="switchMailStatus(text, record, index, data)"/> <span class="ml-10" @click="editMessage(text, record, index, data)">{{ record.whetherEnable? '查看':'编辑' }}</span> </div>
        </template>
        <template slot="phoneStatus" slot-scope="text, record, index, data">
          <div class="enterpriseName"><a-switch v-model="record.phoneStatus" :disabled="record.whetherEnable" @change="switchPhoneStatus(text, record, index, data)"/> <span class="ml-10" @click="editMessage(text, record, index, data)">{{ record.whetherEnable? '查看':'编辑' }}</span> </div>
        </template>
        <template slot="eMailStatus" slot-scope="text, record, index, data">
          <div class="enterpriseName"><a-switch v-model="record.eMailStatus" :disabled="record.whetherEnable" @change="switchEmailStatus(text, record, index, data)"/> <span class="ml-10" @click="editMessage(text, record, index, data)">{{ record.whetherEnable? '查看':'编辑' }}</span> </div>
        </template>
        <template slot="action" slot-scope="text, record, index, data">
          <a-button type="link" size="small" @click="enable(text, record, index, data)">{{ record.whetherEnable? '停用':'启用' }}</a-button>
          <a-button type="link" size="small" @click="showMessageList(text, record, index, data)">推送记录</a-button>
        </template>
      </a-table>
      <div class="pagination">
        <a-pagination :show-total="total => `共 ${tabledata.pageTotal} 条`" show-quick-jumper show-size-changer :default-current="1" :total="tabledata.pageTotal" @change="onChange" @showSizeChange="showSizeChange" />
      </div>
    </div>
    <a-modal v-model="messageShow" width="1000px" :title="isPhone?'短信编辑':'修改消息模板'" on-ok="handleOk">
      <template slot="footer">
        <a-button key="back" @click="handleCancel"> 取消 </a-button>
        <a-button v-if="!messageEdit" key="submit" type="primary" @click="handleOk"> 保存 </a-button>
      </template>
      <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
        <a-form-item :label="isPhone?'模板CODE':'消息变量'" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
          <a-button v-if="!isPhone" type="primary" v-for="(item,index) in msgCenterEventTemplateVariableList" :key="index" @click="selectVariable(item.varName)">{{ item.varName }}</a-button>
          <a-select v-if="isPhone" :disabled="messageEdit" class="inp" @change="selectMessageCode" v-model="phoneMsgCode" placeholder="请选择消息类型">
            <a-select-option v-for="(item,index) in phoneMsgTemplateCodeList" :key="index" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="消息名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
          <a-input
            placeholder="请输入消息名称"
            autocomplete="off"
            :disabled="messageEdit"
            v-model="msgNameMail"
            v-if="!isPhone"
          />
          <a-input
            v-else
            placeholder="请输入消息名称"
            autocomplete="off"
            disabled
            v-model="phoneMsgName"
          />
        </a-form-item>
        <a-form-item class="shensu" label="内容" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
          <tinymce-editor v-if="!isPhone" style="margin-top: 10px" ref="editor" v-model="value" />
          <a-textarea disabled v-else v-model="phoneMsgContent" :rows="4" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { messageEventListGet, templateSwitch, selective, messageTemplatesGet, byCodeGetMsg, byCodeUpdateMsg } from '@/api/message'
import TinymceEditor from '@/components/Editor/TinymceEditor.vue'

export default {
  components: { TinymceEditor },
  data() {
    return {
      authStatusList: [
        { key: '', value: '全部' },
        { key: '0', value: '注册通知' },
        { key: '1', value: '寻源通知' },
        { key: '2', value: '金融支付' },
        { key: '3', value: '支付结算通知' },
        { key: '4', value: '平台预警' },
        { key: '7', value: '合同计划通知' }
      ],
      authStatusValue: '',
      columns: [
        {
          title: '消息名称',
          dataIndex: 'msgName',
          width: 200
        },
        { title: '消息类型', width: 150, dataIndex: 'msgType', scopedSlots: { customRender: 'msgType' } },
        { title: '消息发送节点', dataIndex: 'msgNode', width: 180 },
        { title: '消息编码', dataIndex: 'msgCode', width: 180 },
        { title: '站内信', width: 150, dataIndex: 'mailStatus', scopedSlots: { customRender: 'mailStatus' } },
        {
          title: '手机短信',
          dataIndex: 'phoneStatus',
          scopedSlots: { customRender: 'phoneStatus' },
          width: 150
        },
        {
          title: '电子邮箱',
          dataIndex: 'eMailStatus',
          width: 150,
          scopedSlots: { customRender: 'eMailStatus' }
        },
        { title: '操作', dataIndex: 'action', width: 210, scopedSlots: { customRender: 'action' }, align: 'center', fixed: 'right' }
      ],
      messageShow: false,
      messageEdit: false, // 消息模板是否可以编辑
      messageList: false,
      isPhone: false,
      type: [],
      visible1: false,
      tabledata: [],
      msgName: null,
      msgType: null,
      pageNum: '1',
      pageSize: '10',
      value: '',
      messageTemplates: '',
      phoneMsgTemplateCodeList: [], // 短信模板code List
      phoneContent: '', // 短信内容
      phoneMsgName: '', // 短信名称
      phoneMsgCode: '', // 短信code
      eventCode: '', // 事件code
      visibleTree: false,
      msgCenterEventTemplateVariableList: [],
      msgNameMail: '',
      phoneMsgContent: '',
      msgCode: ''
    }
  },
  created() {
    this.getMessageEventList()
  },
  methods: {
    // 获取消息事件列表
    async getMessageEventList() {
      const queryParam = {
        msgName: this.msgName,
        msgType: this.msgType,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      const data = await messageEventListGet(queryParam)
      if (data.code === 200) {
        this.tabledata = data
        this.tabledata.data.forEach(ele => {
          this.authStatusList.forEach(item => {
            if (ele.msgType === item.key) {
              ele.msgType = item.value
            }
          })
        })
      }
    },
    // 页码改变
    async onChange(e, num) {
      this.pageNum = e
      this.pageSize = num
      this.getMessageEventList()
    },
    // 每页条数变化
    showSizeChange(e, num) {
      this.pageNum = e
      this.pageSize = num
      this.getMessageEventList()
    },
    selectChange(value) {
      this.msgType = value
    },
    async switchMailStatus(text, record, index, data) {
      record[ data.key ] = !text
      const params = {
        id: record.id,
        mailStatus: record.mailStatus
      }
      const res = await templateSwitch(params)
      if (res.code === 200) {
        this.getMessageEventList()
        this.$message.success('操作成功')
      }
    },
    async switchPhoneStatus(text, record, index, data) {
      record[ data.key ] = !text
      const params = {
        id: record.id,
        phoneStatus: record.phoneStatus
      }
      const res = await templateSwitch(params)
      if (res.code === 200) {
        this.getMessageEventList()
        this.$message.success('操作成功')
      }
    },
    async switchEmailStatus(text, record, index, data) {
      record[ data.key ] = !text
      console.log(record)
      const params = {
        id: record.id,
        eMailStatus: record.eMailStatus
      }
      const res = await templateSwitch(params)
      if (res.code === 200) {
        this.getMessageEventList()
        this.$message.success('操作成功')
      }
    },
    // 启用禁用
    async enable(text, record, index, data) {
      record.whetherEnable = !record.whetherEnable
      const params = {
        id: record.id,
        whetherEnable: record.whetherEnable
      }
      const res = await selective(params)
      console.log(res)
      if (res.code === 200) {
        this.getMessageEventList()
        this.$message.success('操作成功')
      } else {
        this.$message.success('操作失败')
      }
    },
    // 编辑消息
    async editMessage(text, record, index, data) {
      console.log(record)
      console.log(data)
      this.messageShow = true
      this.messageEdit = record.whetherEnable
      this.isPhone = data.key === 'phoneStatus'
      const params = {
        eventCode: record.code,
        templateType: data.key === 'phoneStatus' ? '1' : '0'
      }
      this.eventCode = record.code
      const res = await messageTemplatesGet(params)
      console.log(res)
      if (res.code === 200) {
        this.messageTemplates = res
        if (data.key !== 'phoneStatus') {
          this.msgCenterEventTemplateVariableList = res.data.msgCenterEventTemplateVariableList
          this.value = res.data.msgText
          this.msgNameMail = res.data.msgName
          this.msgCode = res.data.code
        } else {
          this.phoneMsgContent = res.data.msgText
          this.phoneMsgName = res.data.msgName
          this.phoneMsgCode = res.data.code
          this.phoneMsgTemplateCodeList = res.data.phoneMsgTemplateCodeList
        }
      } else {
        this.phoneMsgContent = ''
        this.phoneMsgName = ''
        this.phoneMsgCode = ''
        this.phoneMsgTemplateCodeList = []
      }
    },
    // 选择短信编码
    async selectMessageCode(value) {
      this.phoneMsgCode = value
      const params = {
        code: value
      }
      const data = await byCodeGetMsg(params)
      console.log(data)
      if (data.code === 200) {
        this.phoneMsgContent = data.data.msgText
        this.phoneMsgName = data.data.msgName
        this.phoneMsgCode = data.data.code
      }
    },
    // 进入消息列表
    showMessageList(text, record, index, data) {
      this.$router.push({
        name: 'message-messageEventList',
        query: {
          code: record.code
        }
      })
    },
    // 搜索
    handleSearch() {
      this.getMessageEventList()
    },
    // 重置
    resetQuery() {
      this.msgName = ''
      this.msgType = ''
      this.getMessageEventList()
    },
    // 修改取消
    handleCancel() {
      this.messageShow = false
    },
    // 选择消息变量
    selectVariable(value) {
      this.$refs.editor.insertContent(`【${value}】`)
    },
    // 修改保存
    async handleOk() {
      const params = {
        code: this.isPhone ? this.phoneMsgCode : this.msgCode,
        eventCode: this.eventCode,
        templateType: this.isPhone ? '1' : '0',
        msgText: this.isPhone ? this.phoneMsgContent : this.value,
        msgName: this.isPhone ? this.phoneMsgName : this.msgNameMail
      }
      const data = await byCodeUpdateMsg(params)
      console.log(data)
      if (data.code) {
        this.$message.success('操作成功')
        this.messageShow = false
      }
    },
    orgInfoMerchant() {}
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
