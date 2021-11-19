<template>
  <div class="appeal-manage-list">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="ruleForm" :model="queryParam">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="企业名称" prop="businessName">
                <a-input v-model="queryParam.businessName" placeholder="请输入供应商名称" />
              </a-form-model-item>
            </a-col>
            <!-- <a-col
              :md="8"
              :sm="24"
            >
              <a-form-model-item
                label="审核状态"
                prop="complaintStatus"
              >
                <a-select
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  allowClear
                  v-model="queryParam.complaintStatus"
                  :options="options"
                  placeholder="请选择"
                >
                </a-select>
              </a-form-model-item>
            </a-col> -->
            <a-col :md="8" :sm="24">
              <a-form-model-item label="提交时间" prop="time">
                <a-range-picker v-model="queryParam.time" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="处理时间" prop="processingTime">
                <a-range-picker v-model="queryParam.processingTime" />
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :sm="24" class="button">
              <a-button @click="handleReset">重置</a-button>
              <a-button type="primary" @click="search">查询</a-button>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <a-card>
      <a-tabs v-model="queryParam.complaintStatus" @change="handleTabsChange">
        <a-tab-pane v-for="item in options" :key="item.value" :tab="item.label" />
      </a-tabs>
      <s-table rowKey="id" name="appealManageTable" ref="table" :columns="columns" :data="getList" :scroll="{ x: 300 }">
        <template slot="businessName" slot-scope="businessName, item">
          <a-tooltip>
            <template slot="title">{{ item.businessName }}</template>
            <router-link class="name-fixed" :to="{ name: 'AppealManageDetail', params: { id: item.id } }">{{
              item.businessName
            }}</router-link>
          </a-tooltip>
        </template>
        <template v-slot:createTime="props">
          <div v-if="props">
            {{ props | moment('YYYY-MM-DD HH:mm:ss') }}
          </div>
          <!-- <div v-else></div> -->
        </template>
        <template v-slot:updateTime="props">
          <div v-if="props">
            {{ props | moment('YYYY-MM-DD HH:mm:ss') }}
          </div>
          <!-- <div v-else></div> -->
        </template>
        <template slot="identitySource" slot-scope="a, text">
          <div v-show="text.isSupplier === 1 && text.isPurchasers === 1">两者都是</div>
          <div v-show="text.isSupplier === 0 && text.isPurchasers === 1">采购商</div>
          <div v-show="text.isSupplier === 1 && text.isPurchasers === 0">供应商</div>
        </template>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { getList, getAppealCount } from '@/api/appealManage'

export default {
  data() {
    return {
      colorList: ['orange', 'blue', 'red'],
      options: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '待处理',
          value: '0'
        },
        {
          label: '已处理',
          value: '1'
        },
        {
          label: '驳回',
          value: '2'
        }
      ],
      optionss: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '待处理',
          value: '0'
        },
        {
          label: '已处理',
          value: '1'
        },
        {
          label: '驳回',
          value: '2'
        }
      ],
      columns: [
        {
          title: '企业名称',
          key: 'businessName',
          dataIndex: 'businessName',
          width: 240,
          fixed: 'left',
          scopedSlots: { customRender: 'businessName' }
          // customRender: (record) => {
          //   const { id, businessName } = record
          //   return
          //   // <a-tooltip>
          //   //   <template slot="title">{businessName}</template>
          //   //   <router-link to={{ name: 'AppealManageDetail', params: { id } }}>{businessName}</router-link>
          //   // </a-tooltip>
          // }
        },
        {
          title: '身份来源',
          dataIndex: 'identitySource',
          key: 'identitySource',
          width: 200,
          scopedSlots: { customRender: 'identitySource' }
        },
        {
          title: '提交时间',
          dataIndex: 'createTime',
          key: 'createTime',
          width: 200,
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '状态',
          dataIndex: 'complaintStatus',
          width: 100,
          key: 'complaintStatus',
          customRender: (a, entity) => {
            const { optionss, colorList } = this
            const item = optionss.find((x) => x.value === entity?.complaintStatus)
            return (
              <span>
                {entity?.complaintStatus === '2' ? (
                  <a-tooltip placement="top">
                    <template slot="title">
                      <span>{this.$$(entity, 'rejectReason')}</span>
                    </template>
                    <a-badge color={colorList[item?.value]} text={item?.label} />
                    <a-icon style="margin-left:10px" type="question-circle" />
                  </a-tooltip>
                ) : (
                  <a-badge color={colorList[item?.value]} text={item?.label} />
                )}
              </span>
            )
          }
        },

        {
          title: '申诉内容',
          dataIndex: 'complaintContent',
          width: 200,
          key: 'complaintContent',
          customRender: (a, entity) => {
            return (
              <div>
                {entity?.complaintContent?.substring(0, 10)}
                {entity?.complaintContent?.length > 10 ? '...' : ''}
              </div>
            )
          }
        },
        {
          title: '处理时间',
          dataIndex: 'updateTime',
          key: 'updateTime',
          width: 200,
          scopedSlots: { customRender: 'updateTime' }
        },
        {
          title: '处理人',
          width: 150,
          dataIndex: 'username',
          key: 'username'
        }
      ],
      queryParam: {
        complaintStatus: '',
        businessName: '',
        time: null,
        processingTime: null,
        complainType: 1
      },
      advanced: false,
      list: []
    }
  },
  methods: {
    handleTabsChange() {
      this.$refs.table.refresh(true)
    },
    // 获取列表
    async getList(pagination) {
      const { queryParam } = this
      const data = {
        ...pagination,
        ...queryParam
      }
      if (data.time) {
        const [beginTime, endTime] = data.time
        data.beginTime = beginTime
        data.endTime = endTime
      }
      if (data.processingTime) {
        const [beginTime, endTime] = data.processingTime
        data.upBeginTime = beginTime
        data.upEndTime = endTime
      }
      this.getAppealCount({ ...data })
      return getList({ ...data })
      // eslint-disable-next-line no-unreachable
      // if (res.code === '0') {
      //   const { data, total } = res.data
      //   this.pagination.total = total
      //   this.list = data
      // }
    },
    async getAppealCount(data) {
      const box = await getAppealCount(data)
      const arrBox = this.options
      if (box.data) {
        for (const item of this.options) {
          if (item.value === '') {
            // 全部
            item.label = '全部(' + box.data[-1] + ')'
          } else if (item.value === '0') {
            // 待处理
            item.label = '待处理(' + box.data[0] + ')'
          } else if (item.value === '1') {
            // 已处理
            item.label = '已处理(' + box.data[1] + ')'
          } else if (item.value === '2') {
            // 驳回
            item.label = '驳回(' + box.data[2] + ')'
          }
        }
      }
      this.options = arrBox
    },
    handleReset() {
      this.$refs.ruleForm.resetFields()
    },
    // 查询
    search() {
      this.$refs.table.refresh(true)
    }
    //
  }
}
</script>

<style lang="less" scoped>
.appeal-manage-list {
  .ant-card + .ant-card {
    margin-top: 20px;
  }
  .button {
    text-align: center;
  }
  .name-fixed {
    display: inline-block;
    width: 223px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
