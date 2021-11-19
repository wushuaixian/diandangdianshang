<template>
  <a-modal
    @cancel="cancelHandle"
    :destroyOnClose="true"
    :width="1200"
    v-model="visibleShow"
    okText="保存"
    title="选择相关权益"
    @ok="handle"
  >
    <div class="appeal-manage-list">
      <a-card :bordered="false">
        <div class="table-page-search-wrapper">
          <a-form-model layout="inline" ref="ruleForm" :model="queryParam">
            <a-row :gutter="48">
              <a-col :md="8" :sm="24">
                <a-form-model-item label="套餐权益类型" prop="businessName">
                  <a-select
                    :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                    allowClear
                    :options="type"
                    placeholder="请选择"
                    @change="chengeOrgintype"
                  >
                  </a-select>
                </a-form-model-item>
              </a-col>

              <a-col :md="8" :sm="24">
                <a-form-model-item label="权益名称" prop="time">
                  <a-input v-model="queryParam.businessName" placeholder="请输入" />
                </a-form-model-item>
              </a-col>
              <a-col :md="8" :sm="24" class="button">
                <a-button @click="handleReset">重置</a-button>
                <a-button type="primary" @click="search">查询</a-button>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
      </a-card>
      <a-card>
        <s-table
          :scroll="{ x: 'calc(700px + 50%)', y: 240 }"
          rowKey="id"
          ref="table"
          :columns="columns"
          :data="getList"
        >
          <template v-slot:createTime="props">
            <div v-if="props">
              {{ props | moment }}
            </div>
            <div v-else></div>
          </template>
        </s-table>
      </a-card>
    </div>
  </a-modal>
</template>

<script>
import { getList } from '@/api/appealManage'

export default {
  props: {
    visibleShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      colorList: ['orange', 'blue', 'red'],
      type: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '叮当认证',
          value: '0'
        },
        {
          label: '专享服务',
          value: '1'
        },
        {
          label: '金融服务',
          value: '2'
        },
        {
          label: '现场服务',
          value: '3'
        },
        {
          label: '现场服务',
          value: '4'
        },
        {
          label: '现场服务',
          value: '5'
        }
      ],
      columns: [
        {
          title: '权益套餐类型',
          key: '',
          dataIndex: ''
        },
        {
          title: '权益名称',
          dataIndex: '',
          key: ''
        },
        {
          title: '权益值',
          dataIndex: '',
          key: '',
          scopedSlots: { customRender: '' }
        }
      ],
      queryParam: {
        complaintStatus: '',
        businessName: '',
        time: null
      }
    }
  },
  methods: {
    // 监听任何关闭操作
    cancelHandle() {
      this.$emit('cancelHandle')
    },
    // 点击确认关闭
    handle() {
      this.$emit('cancelHandle')
      this.visibleShow = false
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
      return getList({ ...data })
    },
    // 重置
    handleReset() {
      this.$refs.ruleForm.resetFields()
    },
    // 查询
    search() {
      this.$refs.table.refresh(true)
    }
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
}
</style>
