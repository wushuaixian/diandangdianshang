<template>
  <div class="purlist">
    <div class="header">
      <div class="input">
        <a-form-model layout="inline" ref="ruleForm" :model="queryParams">
          <a-row>
            <a-col :span="8">
              <a-form-model-item label="企业名称" prop="enterpriseName">
                <a-input v-model="queryParams.enterpriseName" placeholder="请输入企业名称"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="审核时间" prop="time">
                <a-range-picker @change="onChange" v-model="queryParams.time" />
              </a-form-model-item>
            </a-col>
            <!-- <a-col :span="8">
              <a-form-item label="身份来源" prop="enterpriseName">
                <a-select class="Longer" v-model="queryParams.sign" placeholder="请选择" default-value="">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="2">采购商</a-select-option>
                  <a-select-option value="0">两者都是</a-select-option>
                </a-select>
              </a-form-item>
            </a-col> enterpriseName-->
            <a-col :span="24" class="button">
              <a-button @click="handleReset">重置</a-button>
              <a-button type="primary" @click="handleSearch">查询</a-button>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </div>
    <div class="main mt-20">
      <div class="content">
        <s-table ref="table" name="manageTabless" rowKey="id" :columns="columns" :data="initTable">
          <template v-slot:updateTime="props">
            <span v-if="props">
              {{ props | moment }}
            </span>
          </template>
          <template v-slot:enterpriseName="props">
            <router-link :to="{ name: 'PurchaserManageDetail', params: { id: props.id } }">{{
              props.enterpriseName
            }}</router-link>
          </template>
        </s-table>
      </div>
    </div>
  </div>
</template>
<script>
import { getphserList } from '@/api/purchaser'
export default {
  name: 'PuchaserList',
  data() {
    return {
      data: [],
      columns,
      pageNum: 1,
      queryParam: {},
      selectedRowKeys: [],
      queryParams: {
        auditStatus: '1',
        enterpriseName: '',
        time: null,
        sign: '2'
      }
    }
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    }
  },
  methods: {
    async initTable(params) {
      const { queryParams } = this
      const data = {
        ...params,
        ...queryParams
      }
      if (data.time) {
        const [startTime, endTime] = data.time
        data.auditStartTime = startTime
        data.auditEndTime = endTime
      }
      return getphserList({ ...data })
    },
    handleSearch() {
      this.$refs.table.refresh(true)
    },
    handleReset() {
      this.$refs.ruleForm.resetFields()
    }
  }
}

const columns = [
  {
    title: '企业名称',
    key: 'enterpriseName',
    scopedSlots: { customRender: 'enterpriseName' }
  },
  {
    title: '管理员手机号',
    dataIndex: 'registerMobile'
  },
  {
    title: '统一社会信用代码',
    dataIndex: 'businessLicenceNo'
  },
  {
    title: '法定代表人',
    dataIndex: 'legalPersonName'
  },
  {
    title: '身份来源',
    dataIndex: 'supplierOrPurchaser'
  },
  {
    title: '审核时间',
    key: 'updateTime',
    dataIndex: 'updateTime',
    scopedSlots: { customRender: 'updateTime' }
  }
]
</script>
<style lang="less" scoped>
.purlist {
  & .header {
    width: 100%;
    border-radius: 8px;
    background-color: #fff;
    padding: 24px;
    & .button {
      margin-top: 16px;
      text-align: center;
    }
    .Longer {
      width: 174px;
    }
  }

  & .main {
    width: 100%;
    border-radius: 8px;
    background-color: #fff;
    & .content {
      padding: 24px;
      & .pagin {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}

.mt-20 {
  margin-top: 20px;
}
.mt-24 {
  margin-top: 24px;
}
.mr-16 {
  margin-right: 16px;
}
</style>
