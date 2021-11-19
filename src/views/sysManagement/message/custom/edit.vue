<template>
  <div class="customEdit">
    <a-form-model :model="query" :label-col="labelCol" :rules="rules" :wrapper-col="wrapperCol">
      <a-form-model-item label="消息名称" prop="msgName">
        <a-input placeholder="请输入消息名称" v-model="query.msgName" />
      </a-form-model-item>
      <a-form-model-item label="消息内容" prop="msgText">
        <tinymce-editor style="margin-top: 10px" ref="editor" v-model="query.msgText" />
      </a-form-model-item>
      <a-form-model-item label="推送形式" prop="msgTypeMail">
        <a-checkbox v-model="query.msgTypeMail">
          站内信
        </a-checkbox>
        <a-checkbox v-model="query.msgTypeEmail">
          电子邮件
        </a-checkbox>
        <a-checkbox v-model="query.msgTypePhone">
          手机短信
        </a-checkbox>
        <a-button v-if="query.msgTypePhone" @click="phoneCodeShow" type="link">选择短信模板</a-button>
      </a-form-model-item>
      <a-form-model-item label="推送方式" :label-col="{ span: 4 }" :wrapper-col="{ span: 6 }" prop="msgMode">
        <a-select v-model="query.msgMode" placeholder="请选择推送方式">
          <a-select-option value="1">
            定时推送
          </a-select-option>
          <a-select-option value="0">
            手动推送
          </a-select-option>
        </a-select>
        <a-date-picker
          v-if="query.msgMode === '1'"
          v-model="query.timer"
          show-time
          type="date"
          placeholder="请选择推送时间"
          style="width: 100%;"
        />
      </a-form-model-item>
      <a-form-model-item label="推送范围" prop="msgRange">
        <a-select v-model="query.msgRange" placeholder="请选择推送方式">
          <a-select-option value="1">
            按条件推送
          </a-select-option>
          <a-select-option value="0">
            精准推送
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="推送对象" v-if="query.msgRange === '1'" prop="resObject">
        <a-radio-group v-model="query.resObject">
          <a-radio value="0">
            供应商
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="推送条件" v-if="query.msgRange === '1'" prop="sendCondition">
        <a-select allowClear class="inp" v-model="query.sendCondition" placeholder="请选择推送方式">
          <a-select-option v-for="(item,index) in objectList" :key="index" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="推送对象" v-if="query.msgRange === '0'" prop="msgSendLogs">
        <a-button type="primary" @click="msgShow()">
          添加对象
        </a-button>
        <a-table style="margin-top: 10px" :columns="columns" :data-source="query.msgSendLogs" ref="table" rowKey="id" :pagination="false">
          <a slot="merchantId" slot-scope="merchantId, record" @click="getMsgRecordsDetail(record)">{{ merchantId }}</a>
          <template slot="mechanismStatus" slot-scope="mechanismStatus">
            <div>
              <span v-if="mechanismStatus === '-1'">未认证</span>
              <span v-if="mechanismStatus === '0'">待认证</span>
              <span v-if="mechanismStatus === '1'">验厂中</span>
              <span v-if="mechanismStatus === '2'">认证中</span>
              <span v-if="mechanismStatus === '3'">认证通过</span>
              <span v-if="mechanismStatus === '4'">认证不通过</span>
            </div>
          </template>
          <template slot="isToDoTask" slot-scope="text, record">
            <a-button type="link" @click="deleteMsgSendLogs(record)">删除</a-button>
          </template>
        </a-table>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="onSubmit">
          保存
        </a-button>
        <a-button style="margin-left: 10px;" @click="preStep">
          返回
        </a-button>
      </a-form-model-item>
    </a-form-model>
    <a-modal v-model="msgSendLogsShow" width="1000px" title="添加对象" on-ok="handleOk">
      <template slot="footer">
        <a-button key="submit" type="primary" @click="handleOk"> 确定 </a-button>
      </template>
      <a-card :bordered="false">
        <div class="table-page-search-wrapper">
          <a-form-model layout="inline" ref="ruleForm" :model="form">
            <a-row :gutter="48">
              <a-col :md="8" :sm="24">
                <a-form-model-item label="姓名">
                  <a-input placeholder="请输入姓名" v-model="form.userName" class="inp" />
                </a-form-model-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-model-item label="手机号">
                  <a-input placeholder="请输入手机号" v-model="form.userMobile" class="inp" />
                </a-form-model-item>
              </a-col>
              <a-col :md="24" :sm="24" class="button">
                <a-button type="primary" @click="handleSearch">查询</a-button>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
      </a-card>
      <a-table :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :columns="columnsMerchantOrg" :data-source="merchantOrgList.data" ref="table" rowKey="id" :pagination="false">
        <template slot="mechanismStatus" slot-scope="mechanismStatus">
          <div>
            <span v-if="mechanismStatus === '-1'">未认证</span>
            <span v-if="mechanismStatus === '0'">待认证</span>
            <span v-if="mechanismStatus === '1'">验厂中</span>
            <span v-if="mechanismStatus === '2'">认证中</span>
            <span v-if="mechanismStatus === '3'">认证通过</span>
            <span v-if="mechanismStatus === '4'">认证不通过</span>
          </div>
        </template>
      </a-table>
      <div class="pagination">
        <a-pagination :show-total="total => `共 ${merchantOrgList.pageTotal?merchantOrgList.pageTotal:0} 条`" show-quick-jumper show-size-changer :default-current="1" :total="merchantOrgList.pageTotal" @change="onChange" @showSizeChange="showSizeChange" />
      </div>
    </a-modal>
    <a-modal v-model="messageShow" width="1000px" title="短信编辑" on-ok="phoneOk">
      <template slot="footer">
        <a-button key="submit" type="primary" @click="phoneOk"> 保存 </a-button>
      </template>
      <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="模板CODE'" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
          <a-select class="inp" @change="selectMessageCode" v-model="query.msgPhoneCode" placeholder="请选择短信模板">
            <a-select-option v-for="(item,index) in phoneCodeList" :key="index" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="消息名称" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
          <a-input
            placeholder="请输入消息名称"
            autocomplete="off"
            disabled
            v-model="phoneMsgName"
          />
        </a-form-item>
        <a-form-item class="shensu" label="消息内容" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
          <a-textarea disabled v-model="phoneMsgContent" :rows="4" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
  import {
    msgCustomAdd,
    msgCustomObject,
    msgCustomById,
    msgCustomEdit,
    merchantOrgInfo,
    querySMSTemplatesCode,
    byCodeGetMsg
  } from '@/api/message'
  import TinymceEditor from '@/components/Editor/TinymceEditor.vue'
  import moment from 'moment'
  import notification from 'ant-design-vue/es/notification'
  export default {
    components: { TinymceEditor },
    computed: {
      hasSelected() {
        return this.selectedRowKeys.length > 0
      }
    },
    data() {
      return {
        labelCol: { span: 4 },
        wrapperCol: { span: 10 },
        query: {
          msgName: '',
          msgText: '',
          msgMode: '0',
          msgTypeMail: false,
          msgTypePhone: false,
          msgTypeEmail: false,
          msgTypeTask: false,
          msgPhoneCode: '',
          timer: '',
          msgRange: '1',
          sendCondition: '1',
          msgSendLogs: [],
          resObject: '0',
          type: []
        },
        rules: {
          msgName: [
            { required: true, message: '请输入消息名称', trigger: 'blur' }
          ],
          msgText: [{ required: true, message: '请输入消息内容', trigger: 'blur' }],
          msgMode: [{ required: true, message: '请选择推送方式', trigger: 'change' }],
          msgTypeMail: [
            {
              required: true,
              message: 'Please select at least one activity type'
            }
          ],
          msgRange: [{ required: true, message: '请选择推送方式', trigger: 'change' }],
          resObject: [{ required: true, message: '请选择推送对象', trigger: 'change' }],
          sendCondition: [{ required: true, message: '请选择推送条件', trigger: 'change' }],
          msgSendLogs: [{ required: true, message: '请选择推送条件', trigger: 'change' }]
        },
        objectList: [],
        showPhoneMsg: false,
        id: this.$route.query.id,
        columns: [
          {
            title: '账号',
            width: 150,
            dataIndex: 'merchantId',
            scopedSlots: { customRender: 'merchantId' }
          },
          {
            title: '姓名',
            width: 150,
            dataIndex: 'userName',
            scopedSlots: { customRender: 'userName' }
          },
          {
            title: '手机号',
            width: 150,
            dataIndex: 'userMobile',
            scopedSlots: { customRender: 'userMobile' }
          },
          {
            title: '邮箱',
            width: 150,
            dataIndex: 'userEmail',
            scopedSlots: { customRender: 'userEmail' }
          },
          {
            title: '所属机构',
            width: 150,
            dataIndex: 'userMechanism',
            scopedSlots: { customRender: 'userMechanism' }
          },
          {
            title: '机构状态',
            width: 150,
            dataIndex: 'mechanismStatus',
            scopedSlots: { customRender: 'mechanismStatus' }
          },
          {
            title: '操作',
            dataIndex: 'isToDoTask',
            scopedSlots: { customRender: 'isToDoTask' }
          }
        ],
        msgSendLogsShow: false,
        form: {
          userName: '',
          userMobile: '',
          pageNum: 1,
          pageSize: 10
        },
        merchantOrgList: {},
        columnsMerchantOrg: [
          {
            title: '账号',
            dataIndex: 'merchantId'
          },
          {
            title: '姓名',
            dataIndex: 'userName'
          },
          {
            title: '手机号',
            dataIndex: 'userMobile'
          },
          {
            title: '邮箱',
            dataIndex: 'userEmail'
          },
          {
            title: '所属机构',
            dataIndex: 'userMechanism'
          },
          {
            title: '机构状态',
            dataIndex: 'mechanismStatus',
            scopedSlots: { customRender: 'mechanismStatus' }
          }
        ],
        selectedRowKeys: [],
        selectedRow: [],
        options: [
          { name: '站内信', value: '1' },
          { name: '电子邮件', value: '2' },
          { name: '手机短信', value: '3' }
        ],
        phoneCodeList: [],
        messageShow: false,
        phoneMsgName: '',
        phoneMsgContent: ''
      }
    },
    created() {
      this.querySMSTemplatesCode()
      this.getMsgCustomObject()
      if (this.id) {
        this.byIdMsgCustom()
      }
    },
    methods: {
      async addMsgCustom() {
        const data = await msgCustomAdd(this.query)
        console.log(data)
        if (data.code === 200) {
          this.$router.push({
            name: 'message-messageCustom'
          })
        }
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
        this.objectList.forEach(ele => {
          ele.id = ele.id.toString()
        })
      },
      async byIdMsgCustom() {
        const params = {
          id: this.id
        }
        const { data } = await msgCustomById(params)
        this.query = { ...data }
        this.query.resObject = '0'
        if (this.query.timer) {
          this.query.timer = moment(data.timer)
        }
        console.log(data)
      },
      // 获取所有短信模板
      async querySMSTemplatesCode() {
        const { data } = await querySMSTemplatesCode()
        console.log(data)
        this.phoneCodeList = data
      },
      async phoneCodeShow() {
        this.messageShow = true
        if (this.query.msgPhoneCode) {
          const params = {
            code: this.query.msgPhoneCode
          }
          const { data } = await byCodeGetMsg(params)
          this.phoneMsgContent = data.msgText
          this.phoneMsgName = data.msgName
        }
      },
      phoneOk() {
        this.messageShow = false
      },
      // 选择短信编码
      async selectMessageCode(value) {
        const params = {
          code: value
        }
        const { data } = await byCodeGetMsg(params)
        console.log(data)
        this.phoneMsgContent = data.msgText
        this.phoneMsgName = data.msgName
      },
      async editMsgCustom() {
        if (this.query.msgName === '' || this.query.msgText === '' || !(this.query.msgTypeEmail || this.query.msgTypeMail || this.query.msgTypePhone || this.query.msgTypeTask)) {
          // return false
          notification.error({
            message: '提示',
            description: '信息填写不完整'
          })
        } else {
          const data = await msgCustomEdit(this.query)
          console.log(data)
          if (data.code === 200) {
            // this.$router.go(-1)
            this.$router.push({
              name: 'message-messageCustom'
            })
          }
        }
      },
      msgShow() {
        this.msgSendLogsShow = true
        // this.getMerchantOrgInfo()
      },
      handleOk() {
        this.msgSendLogsShow = false
        this.query.msgSendLogs = this.query.msgSendLogs.concat(this.selectedRow)
        this.merchantOrgList = []
        this.selectedRowKeys = []
      },
      // 删除推送对象
      deleteMsgSendLogs(record) {
        console.log(record)
        this.query.msgSendLogs.forEach((ele, index) => {
          if (ele.id === record.id) {
            this.query.msgSendLogs.splice(index, 1)
          }
        })
      },
      async getMerchantOrgInfo() {
        const params = {
          pageNum: this.form.pageNum,
          pageSize: this.form.pageSize,
          userName: this.form.userName,
          userMobile: this.form.userMobile
        }
        if (!params.userName && !params.userMobile) {
        } else {
          const data = await merchantOrgInfo(params)
          console.log(data)
          this.merchantOrgList = data
        }
      },
      onSelectChange(selectedRowKeys) {
        console.log('selectedRowKeys changed: ', selectedRowKeys)
        this.selectedRowKeys = selectedRowKeys
        const selectRow = []
        selectedRowKeys.forEach(ele => {
          this.merchantOrgList.data.forEach((item, index) => {
            if (ele === index) {
              selectRow.push(item)
            }
          })
        })
        this.selectedRow = selectRow
      },
      onSubmit() {
        if (this.id) {
          this.editMsgCustom()
        } else {
          this.addMsgCustom()
        }
      },
      preStep() {
        this.$router.push({
          name: 'message-messageCustom'
        })
      },
      // 页码改变
      async onChange(e, num) {
        this.form.pageNum = e
        this.form.pageSize = num
        this.getMerchantOrgInfo()
      },
      // 每页条数变化
      showSizeChange(e, num) {
        this.form.pageNum = e
        this.form.pageSize = num
        this.getMerchantOrgInfo()
      },
      handleSearch() {
        this.getMerchantOrgInfo()
      }
    }
  }
</script>

<style lang="less" scoped>
.customEdit{
  width: 100%;
  padding: 30px 0 50px 0;
  background: #ffffff;
}
.button {
  text-align: center;
}
.pagination{
  margin-top: 20px;
  text-align: right;
}
</style>
