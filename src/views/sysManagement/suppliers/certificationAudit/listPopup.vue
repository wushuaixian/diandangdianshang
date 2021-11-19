<template>
  <a-modal title="审核意见" :visible="visible" width="1000px" :footer="null" @cancel="handleCancel">
    <s-table name="viewComments" ref="table" rowKey="id" :data="init" :columns="columns">
      <template slot="auditStatus" slot-scope="auditStatus">
        <div v-show="auditStatus === '1'">
          <div class="green orange"></div>
          待审核
        </div>
        <div v-show="auditStatus === '2'">
          <div class="green"></div>
          审核通过
        </div>
        <div v-show="auditStatus === '3'">
          <div class="green red"></div>
          审核不通过
          <!-- <a-tooltip placement="top">
            <template slot="title">
              <span>审核账号:{{ text.auditUserName }} <br /></span>
              <span>审核时间:{{ text.factoryAuditCreateTime | moment }}<br /></span>
              <span>拒绝原因:{{ text.auditReason }}</span>
            </template>
            <a-icon type="question-circle" placement="top" />
          </a-tooltip> -->
        </div>
      </template>
      <template v-slot:createTime="props">
        {{ props | moment('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </s-table>
    <div class="return">
      <a-button class="return_botton" @click="handleCancel">返回</a-button>
    </div>
  </a-modal>
</template>
<script>
import { ViewAuditOpinion } from '@/api/supplier'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: ''
    },
    newId: {
      type: Number,
      default: 0
    }
  },
  watch: {},
  data() {
    return {
      columns: [
        {
          title: '审核人',
          dataIndex: 'createUsername',
          key: 'createUsername',
          fixed: 'left'
        },
        {
          title: '审核时间',
          dataIndex: 'createTime',
          key: 'createTime',
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '审核状态',
          dataIndex: 'auditStatus',
          key: 'auditStatus'
        },
        {
          title: '原因',
          dataIndex: 'businessDesc',
          key: 'businessDesc'
        }
      ]
    }
  },
  methods: {
    async init(params) {
      const data = {
        ...params,
        merchantId: this.newId,
        id: this.newId + '',
        centerModule: '供应商管理',
        sonModule: this.type
      }
      return ViewAuditOpinion({ ...data })
    },
    handleOk() {},
    handleCancel() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="less" scoped>
.return {
  height: 30px;
  .return_botton {
    margin-top: 10px;
    float: right;
  }
}
</style>
