
<template>
  <div class="appeal-manage-list">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="ruleForm" :model="queryParam">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="套餐权益类型">
                <a-select v-model="resetType" allowClear @change="changeEquityType" placeholder="请选择">
                  <a-select-option v-for="item in projectType" :key="item.id" :name="item.name" :value="item.name">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="权益名称">
                <a-input v-model="queryParam.equityName" placeholder="请输入" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="权益状态">
                <a-select
                  allowClear
                  defaultValue="全部"
                  v-model="queryParam.isAvailable"
                  :options="options"
                  placeholder="请选择"
                >
                </a-select>
              </a-form-model-item>
            </a-col>

            <a-col :md="12" :sm="24">
              <a-form-model-item label="创建时间" prop="time">
                <a-date-picker v-model="queryParam.beginTime" type="date" placeholder="请选择" />
                至
                <a-date-picker v-model="queryParam.endTime" type="date" placeholder="请选择" />
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
      <a-button @click="gotoAdd" type="primary" style="margin-bottom: 15px">添加权益</a-button>
      <s-table
        :scroll="{ x: 1000 }"
        rowKey="id"
        name="leaguerPackageDetailedList"
        ref="table"
        :columns="columns"
        :data="postQueryList"
      >
        <template slot="createTime" slot-scope="text, row">
          <span>{{ row.createTime | dayjs }}</span>
        </template>
        <template slot="isAvailable" slot-scope="text, row">
          <a-switch :checked="row.isAvailable === 0 ? false : true" @change="changeSwitch(row)" />
        </template>

        <template slot="options" slot-scope="text, row">
          <a @click="gotoUpdate(row)">编辑</a>
          <a v-if="row.isAvailable === 0" style="margin-left: 15px" @click="Delete(row)">删除</a>
          <span v-else></span>
        </template>
      </s-table>
    </a-card>
    <a-modal v-model="visibleShowDelete" title="删除" ok-text="确定" cancel-text="取消" @ok="hideDelete">
      <p style="text-align: center">确认将当前数据删除？</p>
    </a-modal>
  </div>
</template>

<script>
import { postupdateId, postListMulti, postQueryList, postUpdateStatus, postEquityDelete } from '@/api/memberPackage'
import { formatDate } from '@/utils/util'

export default {
  data() {
    return {
      id: '',
      itemId: '',
      // 套餐权益类型列表
      projectType: [],
      visibleShowDelete: false,
      options: [
        {
          label: '全部',
          value: null
        },
        {
          label: '启用',
          value: '1'
        },
        {
          label: '停用',
          value: '0'
        }
      ],
      columns: [
        {
          title: '权益名称',
          key: 'equityName',
          dataIndex: 'equityName'
        },
        {
          title: '权益值',
          dataIndex: 'equityValue',
          key: 'equityValue',
          width: 200
        },
        {
          title: '套餐权益类型',
          dataIndex: 'equityType',
          key: 'equityType',
          scopedSlots: { customRender: 'equityType' }
        },
        {
          title: '状态',
          dataIndex: 'isAvailable',
          key: 'isAvailable',
          scopedSlots: { customRender: 'isAvailable' }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime',
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '操作',
          dataIndex: 'options',
          key: 'options',
          flexd: 'right',
          width: 200,
          scopedSlots: { customRender: 'options' }
        }
      ],

      resetType: [],
      resetTime: [],
      queryParam: {
        equityType: null,
        equityName: null,
        isAvailable: null,
        beginTime: null,
        endTime: null
      }
    }
  },
  created() {
    this.postListMulti()
  },
  updated() {
    // console.log(this.queryParam.isAvailable)
  },
  mounted() {},

  methods: {
    // 套餐权益类型
    postListMulti() {
      const params = {
        categories: ['PACKAGE_BENEFITS_TYPE']
      }
      postListMulti(params).then((res) => {
        if (res.code === '0') {
          this.projectType = res.data.PACKAGE_BENEFITS_TYPE
        }
      })
    },
    // 监听表单时间
    changeTime(e) {
      this.queryParam.beginTime = formatDate(e[0]._d)
      this.queryParam.endTime = formatDate(e[1]._d)
    },
    // 监听套餐权益类型选中
    changeEquityType(e) {
      console.log(e)
      this.queryParam.equityType = e
    },
    // 跳转编辑页
    async gotoUpdate(queryParam) {
      const { data } = await postupdateId({ id: queryParam.id })
      const updataData = { data: [...data], queryParam }

      this.$router.push({
        name: 'leaguerPackageDetailedListAddUpdate',
        query: { updataData: updataData, isUpdate: true }
      })
    },
    // 跳转新增页
    gotoAdd() {
      this.$router.push({ name: 'leaguerPackageDetailedListAddUpdate', query: { isAdd: true } })
    },
    Delete(e) {
      this.id = e.id
      this.itemId = e.itemId
      this.visibleShowDelete = true
    },
    hideDelete() {
      postEquityDelete({ id: this.id }).then((res) => {
        if (res.code === '0') {
          this.search()
          this.visibleShowDelete = false
        }
      })
    },
    // 获取列表
    async postQueryList(pagination) {
      const { queryParam } = this
      const data = {
        ...pagination,
        ...queryParam
      }
      const res = await postQueryList({ ...data })
      return new Promise((resolve) => {
        return resolve({ code: '0', data: { ...res.data.equityInfoPOS } })
      })
    },
    // 更改权益状态
    changeSwitch(e) {
      e.isAvailable = e.isAvailable === 1 ? 0 : 1
      console.log(e.isAvailable)
      postUpdateStatus(e).then((res) => {
        if (res.code !== '0') {
          this.search()
        }
      })
    },
    // 重置
    handleReset() {
      this.$refs.ruleForm.resetFields()
      this.queryParam = {}
      this.resetType = []
      this.resetTime = []
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
