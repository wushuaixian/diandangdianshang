<template>
  <div class="mid">
    <a-card type="inner" :bordered="false">
      <div class="header">
        <a-form-model layout="inline">
          <a-row :gutter="48">
            <a-col :md="8">
              <a-from-model-item label="供应商" :labelCol="{ lg: { span: 8 } }">
                <a-input v-model="list.applyDepartment" />
              </a-from-model-item>
            </a-col>
            <a-col :md="8">
              <a-from-model-item label="合同编号" :labelCol="{ lg: { span: 8 } }">
                <a-input v-model="list.buyerPlanCode" />
              </a-from-model-item>
            </a-col>
            <a-col :md="8">
              <a-from-model-item label="合同类型" :labelCol="{ lg: { span: 8 } }">
                <a-select class="Longer" v-model="list.buyerMerchantIds" placeholder="请选择" default-value>
                  <a-select-option value="1">长协</a-select-option>
                  <a-select-option value="2">零采</a-select-option>
                </a-select>
              </a-from-model-item>
            </a-col>
            <a-col :md="8">
              <a-from-model-item label="合同生效日期" :labelCol="{ lg: { span: 8 } }">
                <a-date-picker @change="onChange" />
              </a-from-model-item>
            </a-col>
            <a-col :md="8">
              <a-from-model-item label="合同截止日期" :labelCol="{ lg: { span: 8 } }">
                <a-date-picker @change="onChange" />
              </a-from-model-item>
            </a-col>
            <a-col :md="8">
              <a-from-model-item label="履行状态" :labelCol="{ lg: { span: 8 } }">
                <a-select class="Longer" v-model="list.beginReviewTime" placeholder="请选择" default-value>
                  <a-select-option value="1">已生效</a-select-option>
                  <a-select-option value="2">已失效</a-select-option>
                </a-select>
              </a-from-model-item>
            </a-col>
            <a-col class="middle" :md="80">
              <span class="table-page-search-submitButtons">
                <a-button class="reset" @click="Reset">重置</a-button>
                <a-button type="primary" class="search" @click="search">查询</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
      <s-table
        ref="table"
        name="choiceTable"
        rowKey="id"
        :columns="columns"
        :data="init"
        :scroll="{ x: 1800, y: 300 }"
      ></s-table>
    </a-card>
    <Popup :popupStatus="popupStatus" @close="closeExaminPopup" />
    <MaterialCode></MaterialCode>
    <!-- @submitExamine="submitExamine" -->
  </div>
</template>

<script>
import { myContract } from '@/api/projectCarry'
import Popup from '@/components/Popup/ExaminePopup.vue'
import { submitExamine } from '@/api/accessAudit'
import MaterialCode from '@/views/Suppliers/MaterialCode/MaterialCode'
// import { submitExamine } from '@/api/accessAudit'
const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    scopedSlots: { customRender: 'index' }
  },
  {
    title: '合同编号',
    key: 'corporateName',
    dataIndex: 'corporateName',
    scopedSlots: { customRender: 'corporateName' }
  },
  {
    title: '合同类型',
    key: 'authStatus',
    dataIndex: 'authStatus',
    scopedSlots: { customRender: 'authStatus' }
  },
  {
    title: '是否框架合同',
    key: 'declarant',
    dataIndex: 'declarant',
    scopedSlots: { customRender: 'declarant' }
  },
  {
    title: '供应商',
    key: 'purchasePlanCode',
    dataIndex: 'purchasePlanCode',
    scopedSlots: { customRender: 'purchasePlanCode' }
  },
  {
    title: '合同生效日期',
    key: 'materialCode',
    dataIndex: 'materialCode',
    scopedSlots: { customRender: 'materialCode' }
  },
  {
    title: '合同截止日期',
    key: 'legalPersonName',
    dataIndex: 'legalPersonName',
    scopedSlots: { customRender: 'legalPersonName' }
  },
  {
    title: '合同有效时间（天）',
    key: 'specification',
    dataIndex: 'specification',
    scopedSlots: { customRender: 'specification' }
  },
  {
    title: '履行状态',
    dataIndex: 'nums',
    key: 'nums',
    scopedSlots: { customRender: 'nums' }
  },
  {
    title: '签订人',
    key: 'executed',
    dataIndex: 'executed',
    scopedSlots: { customRender: 'executed' }
  },
  {
    title: '选择',
    key: 'company1',
    dataIndex: 'company1',
    scopedSlots: { customRender: 'company1' }
  }
]
export default {
  components: {
    Popup,
    submitExamine,
    MaterialCode
  },
  // props: ['inputChanges'],
  data() {
    this.columns = columns
    return {
      timedata: [],
      idList: [],
      popupStatus: false,
      visible: false,
      visibles: false,
      keys: '',
      columns,
      list: {
        buyerMerchantIds: '全部',
        applyDepartment: '',
        buyerPlanCode: '',
        materialCode: '',
        materialName: '',
        materialModel: '',
        declarant: '',
        isInstancy: '',
        beginReviewTime: '1',
        endReviewTime: '',
        status: 1,
        closeStatus: 0
      },
      state: {
        selectedRowKeys: []
      }
    }
  },
  mounted() {
    console.log(this.inputChanges)
  },
  methods: {
    // 跳转详情附带id
    viewEnterprise(record) {
      this.$router.push({
        name: 'SuppliersCertificationAuditDetail',
        query: {
          id: record.id
        }
      })
    },
    // 列表请求
    async init() {
      const data = {
        providerMerchantName: '辉瑞',
        code: '456',
        contractType: 1,
        status: '6',
        effectiveTime_begin: '2021-06-05 21:28:02',
        effectiveTime_end: '2021-06-09 21:28:02',
        expireTime_begin: '2021-06-05 21:28:02',
        expireTime_end: '2021-06-09 21:28:02'
      }
      return myContract({ ...data })
    },
    closeExaminPopup() {
      this.popupStatus = false
    },
    callback(v) {
      console.log(v)
      this.keys = v
    },
    // 查询列表数据
    search() {
      this.$refs.table.refresh(true)
    },
    // 获取查询时间
    onChange(date, dateString) {
      this.list.beginTime = dateString[0]
      this.list.endTime = dateString[1]
    },
    // 重置查询数据
    Reset() {
      this.timedata = []
      this.list = {}
    }
  },
  computed: {
    // 表格多选选中状态获取选中id
    // rowSelection() {
    //   const that = this
    //   const { selectedRowKeys } = that.state
    //   return {
    //     selectedRowKeys,
    //     onChange: (selectedRowKeys, selectedRows) => {
    //       that.state.selectedRowKeys = selectedRowKeys
    //       that.idList = selectedRowKeys
    //     }
    //   }
    // }
  }
}
</script>
<style lang="less" scoped>
.mid {
  margin: 0;
  padding: 0;
  width: 100%;
  height: auto;
  .header {
    padding-top: 20px;
    width: 100%;
    height: auto;
    .distance {
      width: auto;
      float: left;
      .input {
        width: 200px;
      }
    }
    .middle {
      display: flex;
      justify-content: center;
      align-content: center;
      .reset {
        margin-left: 8px;
      }
      .search {
        margin-left: 20px;
      }
    }
    .separate {
      margin-left: 10px;
    }
    .Longer {
      width: 174px;
    }
    .ipt {
      width: 84px;
    }
  }
  .cart-top {
    margin-top: 20px;
  }
  .contest {
    width: 100%;
    height: auto;
    .margin {
      width: auto;
      margin-right: 15px;
    }
    .m-bottom {
      margin-bottom: 15px;
    }
    .mar-left {
      margin-left: 5px;
    }
    .margin-right {
      margin-right: 15px;
    }
    .green {
      width: 6px;
      height: 6px;
      background: #52c41a;
      display: inline-block;
      position: relative;
      top: -2px;
      border-radius: 50%;
      margin-right: 6px;
    }
    .orange {
      background: #ff8720;
    }
    .red {
      background: red;
    }
  }
}
.ant-form-item {
  display: flex;
  margin-right: 0;
}
.SearchName {
  text-align: center;
  display: flex;
  align-items: center;
  span {
    margin-left: 60px;
  }
  .nameSearchIpt {
    width: 300px;
  }
}
</style>
