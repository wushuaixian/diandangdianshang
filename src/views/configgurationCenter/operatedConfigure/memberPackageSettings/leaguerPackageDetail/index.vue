
<template>
  <div class="appeal-manage-list">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="ruleForm" :model="queryParam">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="供应商名称" prop="enterpriseName">
                <a-input v-model="queryParam.enterpriseName" placeholder="请输入" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="供应商编码" prop="orgCode">
                <a-input v-model="queryParam.orgCode" placeholder="请输入" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="套餐名称" prop="packageName">
                <a-input v-model="queryParam.packageName" placeholder="请输入" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="状态" prop="status">
                <a-select v-model="select.status" @change="activeFlag" :options="selectStatus" placeholder="请选择">
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="来源类型" prop="sourceType">
                <a-select v-model="select.type" @change="sourceType" :options="originType" placeholder="请选择">
                </a-select>
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
      <a-button @click="gotoAdd" type="primary" style="margin-bottom: 15px">添加</a-button>
      <s-table
        :scroll="{ x: 1800 }"
        name="leaguerPackageDetail"
        rowKey="id"
        ref="table"
        :columns="columns"
        :data="getList"
      >
        <template slot="packageName" slot-scope="text, row">
          <a @click="gotoDetail(row)">{{ row.packageName }}</a>
        </template>
        <template slot="activeFlag" slot-scope="text, row">
          <span v-if="row.activeFlag === '1'">生效中</span>
          <span v-if="row.activeFlag === '2'">已过期</span>
        </template>
        <template slot="sourceType" slot-scope="text, row">
          <span v-if="row.sourceType === '1'">在线购买</span>
          <span v-if="row.sourceType === '2'">线下购买</span>
          <span v-if="row.sourceType === '3'">平台赠送</span>
        </template>
        <template slot="createTime" slot-scope="text, row">
          <span>{{ row.createTime | dayjs }}</span>
        </template>
        <template slot="options" slot-scope="text, row">
          <a v-if="row.activeFlag !== '2'" @click="gotoUpdate(row)" style="margin-right: 15px">套餐调级</a>
        </template>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { postQueryAll } from '@/api/memberPackage'

export default {
  data() {
    return {
      select: {
        status: '',
        type: ''
      },

      selectStatus: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '生效中',
          value: '1'
        },
        {
          label: '已过期',
          value: '2'
        }
      ],
      originType: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '在线购买',
          value: '1'
        },
        {
          label: '线下购买',
          value: '2'
        },
        {
          label: '平台赠送',
          value: '3'
        }
      ],
      columns: [
        {
          title: '供应商名称',
          key: 'enterpriseName',
          dataIndex: 'enterpriseName',
          width: 200
        },
        {
          title: '供应商编码',
          dataIndex: 'orgCode',
          key: 'orgCode'
        },
        {
          title: '套餐名称',
          dataIndex: 'packageName',
          key: 'packageName',
          scopedSlots: { customRender: 'packageName' }
        },
        {
          title: '套餐原价(元/年)',
          dataIndex: 'packageOriginalPrice',
          key: 'packageOriginalPrice'
        },
        {
          title: '有效期',
          dataIndex: 'activeTime',
          key: 'activeTime',
          align: 'center',
          width: 400
        },
        {
          title: '状态',
          key: 'activeFlag',
          scopedSlots: { customRender: 'activeFlag' }
        },
        {
          title: '来源类型',
          key: 'sourceType',
          scopedSlots: { customRender: 'sourceType' }
        },
        {
          title: '创建人',
          key: 'createUsername',
          dataIndex: 'createUsername'
        },
        {
          title: '创建时间',
          key: 'createTime',
          width: 200,
          scopedSlots: { customRender: 'createTime' }
        },

        {
          title: '操作',
          width: 120,
          fixed: 'right',
          scopedSlots: { customRender: 'options' }
        }
      ],
      queryParam: {
        activeFlag: null,
        sourceType: null,
        packageName: null,
        enterpriseName: null,
        orgCode: null
      },
      advanced: false,
      list: []
    }
  },
  methods: {
    // 跳转新增页
    gotoAdd() {
      this.$router.push({ name: 'LeaguerPackageDetailAddUpdate', query: { isAdd: true } })
    },
    // 跳转编辑页
    gotoUpdate(e) {
      sessionStorage.setItem('updateData', e)
      this.$router.push({ name: 'LeaguerPackageDetailAddUpdate', query: { updateData: e, isUpdate: true } })
    },

    // 跳转详情页
    gotoDetail(e) {
      sessionStorage.setItem('dateilsData', e)
      this.$router.push({ name: 'LeaguerPackageDetailAddUpdate', query: { dateilsData: e, isDetails: true } })
    },

    // 监听状态变化
    activeFlag(e) {
      this.queryParam.activeFlag = e + ''
    },
    sourceType(e) {
      this.queryParam.sourceType = e + ''
    },
    // 获取列表
    async getList(pagination) {
      const { queryParam } = this
      const data = {
        ...pagination,
        ...queryParam
      }

      return postQueryAll({ ...data })
    },
    handleReset() {
      this.select = {
        status: '',
        type: ''
      }
      this.$refs.ruleForm.resetFields()

      this.$refs.table.refresh(true)
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
