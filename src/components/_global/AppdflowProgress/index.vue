<template>
  <a-card v-show="visible" :shadow="shadow" :loading="loading" class="appdflow_progress">
    <div>
      <!-- <span class="span_title"><i></i>{{ $t('审批进度') }}</span> -->
      <header-title class="span_title">
        <span>{{ $t('审批进度') }}</span>
      </header-title>
      <!-- <span style="cursor: pointer; margin-left: 10px" title="flow" @click="openFlowChart">&nbsp;&nbsp;</span> -->
    </div>
    <a-row class="header-b">
      <a-col :span="4" class="flow_header">
        <span>&nbsp;</span>
      </a-col>
      <a-col :span="5" class="flow_header">
        <span class="span_weight">{{ $t('参与人') }}</span>
      </a-col>
      <a-col :span="5" class="flow_header">
        <span class="span_weight">{{ $t('状态') }}</span>
      </a-col>
      <a-col :span="5" class="flow_header">
        <span class="span_weight">{{ $t('审批时间') }}</span>
      </a-col>
      <a-col :span="5" class="flow_header">
        <span class="span_weight">{{ $t('审批备注') }}</span>
      </a-col>
    </a-row>
    <a-row style="margin-top: 30px">
      <!-- 进度条 -->
      <!-- <a-col :span="4">
          <div class="flow_progress">
            <span
              v-if="list != null && list.length > 0"
              class="progress_point active"
            />
            <div v-if="list != null && list.length > 1">
              <div v-for="idx of list.length - 1" :key="idx">
                <span
                  :class="
                    list[idx].executed
                      ? 'progress_line active'
                      : 'progress_line'
                  "
                />
                <span
                  :class="
                    list[idx].executed
                      ? 'progress_point active'
                      : 'progress_point'
                  "
                />
              </div>
            </div>
          </div>
        </a-col> -->
      <!-- 进度条ui调整 -->
      <a-col :span="4">
        <div class="flow_progress">
          <span v-if="list != null && list.length > 0" class="progress_new_point new_active">
            <!-- 发起申请 -->
            <img src="./images/or-sign@2x.png" width="48px" /><img src="./images/add.png" width="20px" />
          </span>
          <div v-if="list != null && list.length > 1">
            <div v-for="idx of list.length - 1" :key="idx">
              <span :class="list[idx].executed ? 'progress_line active' : 'progress_line'" />
              <span>
                <span
                  v-if="list[idx].subtaskList.length === 1 && list[idx].progressStatus === 2"
                  class="progress_new_point new_active"
                >
                  <!-- 或签通过 -->
                  <img src="./images/or-sign@2x.png" width="48px" /><img src="./images/add.png" width="20px" />
                </span>
                <span
                  v-if="list[idx].subtaskList.length === 2 && list[idx].progressStatus === 2"
                  class="progress_new_point new_active"
                >
                  <!-- 会签通过 -->
                  <img src="./images/join-sign@2x.png" width="48px" /><img src="./images/add.png" width="20px" />
                </span>
                <span
                  v-if="list[idx].subtaskList.length === 1 && list[idx].progressStatus === 3"
                  class="progress_new_point new_active"
                >
                  <!-- 或签不通过 -->
                  <img src="./images/or-sign1@2x.png" width="48px" /><img src="./images/delete.png" width="20px" />
                </span>
                <span
                  v-if="list[idx].subtaskList.length === 2 && list[idx].progressStatus === 3"
                  class="progress_new_point new_active"
                >
                  <!-- 会签不通过 -->
                  <img src="./images/join-sign1@2x.png" width="48px" /><img src="./images/delete.png" width="20px" />
                </span>
                <span
                  v-if="list[idx].subtaskList.length === 1 && list[idx].progressStatus === 1"
                  class="progress_new_point new_active"
                >
                  <!-- 单人审批中 -->
                  <img src="./images/or-sign1@2x.png" width="48px" />
                </span>
                <!-- 会签审批中 -->
                <img
                  v-if="list[idx].subtaskList.length === 2 && list[idx].progressStatus === 1"
                  src="./images/join-sign1@2x.png"
                  width="48px"
                />
              </span>
            </div>
          </div>
        </div>
      </a-col>
      <a-col :span="20">
        <a-row v-for="(item, index) in list" :key="index" class="flow_row">
          <!-- 参与人 -->
          <a-col :span="6" class="flow_col">
            <!-- 审批类型 -->
            <div class="flow_col_type">
              <span v-if="item.appdType === null" class="appd_type_sponsor">发起申请</span>
              <span
                v-else-if="item.appdType != null"
                :class="[item.appdType === 1 ? 'appd_type_icon_one' : 'appd_type_icon_more', 'appd_type_icon']"
              >
                {{ appdTypeMap[item.appdType] || '未知' }} </span
              ><span v-else>&nbsp;</span>
            </div>
            <!-- 审批人 -->
            <div class="flow_col_approver">
              <span v-for="(subtask, i) in item.subtaskList" :key="i">
                <!-- <span v-if="i > 0">、&nbsp;</span> -->
                <span v-if="subtask.auditStatus === 2" class="auditStatus_2">
                  <span v-if="i > 0">、 </span>
                  {{ subtask.auditUsername }}
                </span>
                <span v-else-if="subtask.auditStatus === 3" class="auditStatus_3">
                  <span v-if="i > 0">、</span>{{ subtask.auditUsername }}</span
                >
                <span v-else class="auditStatus_other"><span v-if="i > 0">、</span>{{ subtask.auditUsername }}</span>
              </span>
            </div>
          </a-col>
          <!-- 状态 -->
          <a-col :span="6" class="flow_col flow_col_status">
            <!-- 审批状态 -->
            <span>{{ progressStatusStr(item.progressStatus) }}</span>
            <!-- 审批人审核状态 -->
            <a-popover v-if="item.progressStatus != 0" placement="bottom" width="500" trigger="click">
              <div slot="content">
                <div v-if="filterSubList(item.subtaskList, true).length > 0">
                  <span class="span_weight">{{ $t('已审批') }}</span>
                </div>
                <a-row v-for="(subtask, idx) in filterSubList(item.subtaskList, true)" :key="idx" class="detail_row">
                  <a-col v-if="subtask.auditStatus === 2" :span="5" class="detail_col auditStatus_2">
                    {{ subtask.auditUsername }}&nbsp;
                  </a-col>
                  <a-col v-else :span="5" class="detail_col auditStatus_3">{{ subtask.auditUsername }}&nbsp;</a-col>
                  <a-col :span="5" class="detail_col">{{ progressStatusStr(subtask.auditStatus) }}&nbsp;</a-col>
                  <a-col :span="7" class="detail_col">{{ subtask.auditTimeStr }}&nbsp;</a-col>
                  <a-col :span="7" class="detail_col">{{ subtask.auditRemark }}&nbsp;</a-col>
                </a-row>
                <div v-if="filterSubList(item.subtaskList, false).length > 0" class="detail_row">
                  <span class="span_weight">{{ $t('待审批') }}</span>
                </div>
                <a-row v-for="(subtask, idx) in filterSubList(item.subtaskList, false)" :key="idx" class="detail_row">
                  <a-col :span="5" class="detail_col">{{ subtask.auditUsername }}&nbsp;</a-col>
                </a-row>
              </div>
              <!-- <i slot="reference" class="el-icon-info icon_but" /> -->
            </a-popover>
            <a-button v-if="item.progressStatus != 0" type="link" @click="item.dialogVisible = true">查看 </a-button>
            <a-modal :visible.sync="item.dialogVisible" title="审批进度" width="960px" @cancel="confirmDialog(item)">
              <div class="approval_progress_table">
                <a-table
                  :columns="columns"
                  :dataSource="handleApprovalStatus(item.subtaskList)"
                  style="width: 100%"
                  :pagination="false"
                >
                  <template v-slot:auditStatus="props">
                    <div>
                      <span v-if="props.auditStatus === 1" style="color: #666666; display: flex; align-items: center">
                        <div class="point point-flicker" />
                        <span style="margin-left: 5px">审批中</span>
                      </span>
                      <span v-else-if="props.auditStatus === 2" style="color: #666666">审批通过</span>
                      <span v-else-if="props.auditStatus === 3" style="color: red">审批不通过</span>
                    </div>
                  </template>
                </a-table>
              </div>
              <span slot="footer">
                <a-button @click="confirmDialog(item)">关 闭</a-button>
              </span>
            </a-modal>
          </a-col>
          <!-- 审批时间 -->
          <a-col :span="6" class="flow_col">
            <span>{{ item.approvalTime }}</span>
          </a-col>
          <!-- 审批备注 -->
          <a-col :span="6" class="flow_col">
            <span>{{ item.auditRemarks }}</span>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </a-card>
</template>
<script>
import { listProgress } from '@/api/configgurationCenter/appflow'
export default {
  name: 'AppdflowProgress',
  props: {
    taskCode: {
      type: String,
      default: null
    },
    bizCode: {
      type: String,
      default: null
    },
    typeCode: {
      type: String,
      default: null
    },
    shadow: {
      type: String,
      default: 'never'
    }
  },
  data() {
    return {
      list: [],
      visible: false,
      loading: false,
      appdTypeMap: {
        1: this.$t('或签'),
        2: this.$t('会签')
      },
      progressStatusMap: {
        0: this.$t('发起申请'),
        1: this.$t('审批中'),
        2: this.$t('审批通过'),
        3: this.$t('审批不通过'),
        4: this.$t('审批异常')
      },
      dialogVisible2: false,
      columns: [
        {
          title: '参与人',
          dataIndex: 'auditUsername',
          key: 'auditUsername'
        },
        {
          title: '状态',
          key: 'auditStatus',
          scopedSlots: { customRender: 'auditStatus' }
        },
        {
          title: '审批时间',
          dataIndex: 'auditTimeStr',
          key: 'auditTimeStr'
        },
        {
          title: '审批备注',
          dataIndex: 'auditRemark',
          key: 'auditRemark',
          width: 200
        }
      ]
    }
  },
  watch: {
    taskCode: {
      handler() {
        this.init()
      },
      deep: true
    },
    bizCode: {
      handler() {
        this.init()
      },
      deep: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.loading = true
      try {
        if (this.taskCode || (this.bizCode && this.typeCode)) {
          const result = await listProgress({
            taskCode: this.taskCode,
            bizCode: this.bizCode,
            typeCode: this.typeCode
          })
          this.list = result.data || []

          this.list.map((item, index) => {
            this.$set(item, 'dialogVisible', false)
          })
          this.$emit('changeList', result.data || [])
        } else {
          this.list = []
          console.log('taskCode or (bizCode & typeCode) is not null')
        }
      } finally {
        this.loading = false
        this.visible = this.list && this.list.length > 0
      }
    },
    reload() {
      this.init()
    },
    filterSubList(list, isApproved) {
      if (isApproved) {
        return list.filter((s) => s.auditStatus === 2 || s.auditStatus === 3 || s.auditStatus === 4)
      } else {
        return list.filter((s) => !(s.auditStatus === 2 || s.auditStatus === 3 || s.auditStatus === 4))
      }
    },
    progressStatusStr(progressStatus) {
      return this.progressStatusMap[progressStatus] || this.$t('未知')
    },
    openFlowChart() {
      let url
      if (this.taskCode) {
        url = '/appdflow-web/flow/chart?taskCode=' + this.taskCode + '&showSubtask=true&showSnapshot=true'
      } else if (this.list && this.list.length > 0) {
        url = '/appdflow-web/flow/chart?taskCode=' + this.list[0].taskCode + '&showSubtask=true&showSnapshot=true'
      } else {
        // url = '/appdflow-web/flow/chart?showSubtask=true&showSnapshot=true&processCode='
      }
      if (url) {
        this.$portal.openWindow(location.origin + url)
      }
    },
    handleApprovalStatus(subtaskList) {
      const newSubtaskList = subtaskList.map((item) => {
        let auditStatusStr = ''
        if (item.auditStatus === 1) {
          auditStatusStr = '审批中'
        } else if (item.auditStatus === 2) {
          auditStatusStr = '审批通过'
        } else if (item.auditStatus === 3) {
          auditStatusStr = '审批不通过'
        }
        return {
          ...item,
          auditStatusStr: auditStatusStr
        }
      })
      return newSubtaskList
    },
    confirmDialog(item) {
      item.dialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.appdflow_progress {
  margin-top: 8px;
  margin-bottom: 8px;
  min-width: 800px;
}
.flow_row {
  margin-bottom: 45px;
}
.flow_col,
.detail_col,
.flow_header {
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.detail_row {
  margin-top: 10px;
}
.span_title {
  font-family: PingFangSC-Semibold;
  font-size: 16px;
  color: #262626;
  line-height: 20px;
  font-weight: bold;
  height: 32px;
  margin-bottom: 20px;
}
.span_weight,
.span_title {
  font-weight: bold;
}
.auditStatus_2 {
  color: #008000;
}
.auditStatus_3 {
  color: #ff0000;
}
.auditStatus_other {
  color: #666;
}
.icon_but {
  color: #faad14;
  cursor: pointer;
  margin-left: 5px;
}
.appd_type_icon {
  font-size: 12px;
  line-height: 20px;
  padding: 0px 8px;
  color: #f5222d;
  border-radius: 6px;
  display: inline-block;
  margin-right: 5px;
  vertical-align: middle;
  border: 1px solid rgba(255, 163, 158, 1);
  background-color: rgba(254, 240, 239, 1);
}
/* 进度 */
.flow_progress {
  width: 12px;
  text-align: center;
  margin: auto auto;
}
.flow_progress .progress_point {
  width: 10px;
  height: 10px;
  border-radius: 10px;
  display: block;
  background: #e9e9e9;
}
.flow_progress .progress_line {
  width: 3px;
  display: block;
  background: #e9e9e9;
  height: 58px;
  margin: 0 0 0 4px;
  /* height: 54px;margin: 2px 0 2px 4px; */
}
.flow_progress .active {
  background: #1890ff;
}
/* 进度 ui调整*/
.flow_col,
.detail_col,
.flow_header {
  text-align: left;
}
.header-b {
  padding: 8px;
  margin-top: 8px;
  background-color: #e9e9e9;
}
.appd_type_sponsor {
  font-weight: bold;
  font-size: 16px;
}
.appd_type_icon {
  width: 40px;
}
.appd_type_icon_one {
  color: #e7a23d;
}
.auditStatus_2,
.auditStatus_3,
.auditStatus_other {
  margin-top: 8px !important;
  display: block;
  color: #666666;
  font-size: 12px;
  line-height: 16px;
}
.flow_col_approver {
  display: flex;
}
.flow_col {
  font-size: 14px;
  color: #666666;
}
.flow_col_status {
  line-height: 18px;
}
.flow_progress .progress_new_point {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  display: block;
}
.new_active img:nth-child(2) {
  position: relative;
  bottom: 20px;
  right: -20px;
}
.flow_progress .progress_line {
  width: 4px;
  display: block;
  background: #e9e9e9;
  height: 20px;
  margin: 10px 0px 10px 23px;
}
.flow_row {
  margin-bottom: 0px;
  display: flex;
  align-items: center;
  height: 88px;
  border-bottom: 1px solid #e5e5e5;
}
.flow_row:nth-child(1) {
  height: 68px;
}
.flow_col__type {
  display: flex;
  flex-direction: column;
}
/*圆点ui*/
.point {
  width: 6px;
  height: 6px;
  background-color: #1890ff;
  position: relative;
  border-radius: 50%;
  display: inline-block;
}
/* 设置动画前颜色 */
.point-flicker:after {
  background-color: #1890ff;
}
/* 设置动画后颜色 */
.point-flicker:before {
  background-color: rgba(0, 168, 253, 0.2);
}
/* 设置动画 */
.point-flicker:before,
.point-flicker:after {
  content: '';
  width: 10px;
  height: 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -5px;
  margin-top: -5px;
  border-radius: 50%;
  animation: warn 1.5s ease-out 0s infinite;
}
/* @keyframes 规则用于创建动画。在 @keyframes 中规定某项 CSS 样式，就能创建由当前样式逐渐改为新样式的动画效果。 */
@keyframes warn {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  30% {
    opacity: 1;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}
</style>
