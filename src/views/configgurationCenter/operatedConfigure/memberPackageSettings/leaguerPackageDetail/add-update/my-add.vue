<template>
  <div>
    <a-button @click="Add" type="primary" style="float: right; margin-bottom: 15px">新增</a-button>

    <a-modal @cancel="cancelHandle" :width="1300" v-model="visibleShow" okText="保存" title="供应商列表" @ok="handle">
      <div class="appeal-manage-list">
        <a-card :bordered="false">
          <div class="table-page-search-wrapper">
            <a-form-model layout="inline" ref="ruleForm" :model="queryParam">
              <a-row :gutter="48">
                <a-col :md="8" :sm="24">
                  <a-form-model-item label="供应商名称" prop="businessName">
                    <a-input v-model="queryParam.enterpriseName" placeholder="请输入" />
                  </a-form-model-item>
                </a-col>

                <a-col :md="8" :sm="24">
                  <a-form-model-item label="供应商编码" prop="time">
                    <a-input v-model="queryParam.orgCode" placeholder="请输入" />
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
            :scroll="{ x: 'calc(700px + 50%)', y: true }"
            rowKey="id"
            ref="table"
            :columns="columns"
            :isCanFilter="false"
            :data="getList"
            name="leaguerPackageDetail"
            :row-selection="rowSelection"
          >
            <template #authStatus="text">
              <span v-if="text === '-1'">未认证</span>
              <span v-if="text === '0'">待认证</span>
              <span v-if="text === '1'">验厂中</span>
              <span v-if="text === '2'">认证中</span>
              <span v-if="text === '3'">认证通过</span>
              <span v-if="text === '4'">认证不通过</span>
            </template>
          </s-table>
        </a-card>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { postQuerySupplier } from '@/api/memberPackage'
export default {
  data() {
    return {
      visibleShow: false,
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
      columns: [
        {
          title: '供应商名称',
          key: 'enterpriseName',
          dataIndex: 'enterpriseName'
        },
        {
          title: '供应商编码',
          dataIndex: 'orgCode',
          key: 'orgCode'
        },
        {
          title: '供应商状态',
          key: 'authStatus',
          dataIndex: 'authStatus',
          scopedSlots: { customRender: 'authStatus' }
        }
      ],
      queryParam: {
        enterpriseName: null,
        orgCode: null
      },
      advanced: false,
      selectedListData: [],
      selectedListIds: []
    }
  },
  computed: {
    rowSelection() {
      const that = this
      return {
        selectedRowKeys: that.selectedListIds,
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(selectedRows)
          that.selectedListIds = selectedRowKeys
          that.selectedListData = that.deWeight([...that.selectedListData, ...selectedRows])
          that.selectedListData.map((x) => ({ ...x, type: true }))
        },
        onSelect: (e) => {
          console.log(e.type)
          if (e.type) {
            for (let i = 0; i < that.selectedListData.length; i++) {
              if (that.selectedListData[i].id === e.id) {
                that.selectedListData.splice(i, 1)
                console.log(that.selectedListData)
              }
              e.type = false
            }
          } else {
            e.type = true
          }
        },
        onSelectAll: (status, selectedRows, changeRows) => {
          if (!status) {
            const ids = []
            changeRows.forEach((x) => {
              return ids.push(x.id)
            })
            const includesSelectedRowList = this.selectedListData.filter((item) => !ids.includes(item?.id))
            that.selectedListData = includesSelectedRowList
          } else {
            that.selectedListData.map((x) => ({ ...x, type: true }))
          }
        }
      }
    }
  },
  methods: {
    // 监听任何关闭操作
    cancelHandle() {
      this.visibleShow = false
    },
    // 新增权益清单
    Add() {
      this.visibleShow = true
    },
    // 点击确认关闭
    handle() {
      console.log(this.selectedListData)
      this.$emit('getList', this.selectedListData)
      this.visibleShow = false
    },

    // 获取列表
    async getList(pagination) {
      const { queryParam } = this
      const data = {
        ...pagination,
        ...queryParam
      }

      return postQuerySupplier({ ...data })
    },
    handleReset() {
      this.queryParam = {}
      this.$refs.ruleForm.resetFields()
    },
    // 查询
    search() {
      this.$refs.table.refresh(true)
    },
    // 数组去重
    deWeight(arr, initArr = []) {
      arr.forEach((item) => {
        const isFind = initArr.find((cell) => cell.id === item.id)
        if (!isFind) {
          initArr.push(item)
        }
      })
      return initArr
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
