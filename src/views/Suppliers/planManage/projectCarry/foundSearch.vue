<template>
  <div class="authention-apply-main">
    <div class="pustor">
      <a-form-model layout="inline" ref="ruleForm" :model="queryParam" :rules="rules">
        <a-row :gutter="24">
          <a-col :md="12">
            <a-form-model-item label="主公司名称" :labelCol="{ lg: { span: 8 } }" prop="buyerMerchantId">
              <d-select :options="enterpriseNamesList" v-model="queryParam.buyerMerchantId"></d-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="12">
            <a-form-model-item label="项目名称" :labelCol="{ lg: { span: 8 } }" prop="projectName">
              <a-input v-model="queryParam.projectName" />
            </a-form-model-item>
          </a-col>
          <a-col :md="24">
            <a-form-model-item label="寻源方式" prop="searchManner">
              <a-radio-group :options="manageList" v-model="queryParam.searchManner" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <a-button type="primary" @click="showChooseAPlan"> 选择计划 </a-button>
    <!-- 测试table表格 -->
    <s-table
      name="foundSearchTables"
      style="margin-top: 20px"
      ref="table"
      :scroll="{ x: 1300, y: 500 }"
      :columns="columns"
      :list="foundSearchDataList"
      :customPage="true"
    >
      <template v-slot:auditTime="props">
        {{ props | moment('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <a slot="action" slot-scope="scope" href="javascript:;" class="delete-a" @click="sliceChange(scope)"> 删除 </a>
      <template slot="isInstancy" slot-scope="record">
        <span v-show="record.isInstancy === 0">否</span>
        <span v-show="record.isInstancy === 1">是</span>
        <span></span>
      </template>
    </s-table>
    <div class="bottom" style="margin-top: 30px; display: flex; flex-direction: row-reverse">
      <a-button type="primary" :disabled="!isLoading" @click="onSubmit"> 确认 </a-button>
      <a-button
        @click="
          $router.push({
            name: 'MerchantsPurchaseManagCarry'
          })
        "
      >
        取消
      </a-button>
    </div>
    <ChooseAPlan
      :visible="showChooseAPlanVisible"
      :foundSearchDataList="foundSearchDataList"
      :ids="ids"
      @updateVisible="updateVisible"
      @idsChange="idsChange"
    />
  </div>
</template>

<script>
import { getMultiList, puchaserEntityId, projectSave, getItemByIds } from '@/api/projectCarry'
import ChooseAPlan from './components/chooseAPlan.vue'

// const data = [
//   {
//     key: '1',
//     name: 'John Brown',
//     age: 32
//   },
//   {
//     key: '2',
//     name: 'Jim Green',
//     age: 40
//   }
// ]
export default {
  components: {
    ChooseAPlan
  },
  data() {
    return {
      // data: this.$store.state?.purchaseManage?.selectedRowKeys,
      columns: [
        { title: '序号', width: 100, dataIndex: 'index', key: 'index', align: 'center' },
        { title: '公司名称', width: 200, dataIndex: 'buyerMerchantName', key: 'buyerMerchantName', align: 'center' },
        {
          title: '是否紧急',
          width: 100,
          dataIndex: 'isInstancy',
          key: 'isInstancy',
          align: 'center',
          customRender: (text) => {
            return text === 0 ? '否' : '是'
          }
        },
        { title: '采购员', width: 200, dataIndex: 'buyerUserName', key: 'buyerUserName', align: 'center' },
        { title: '采购申请编号', width: 150, dataIndex: 'buyerPlanCode', key: 'buyerPlanCode', align: 'center' },
        {
          title: '计划编号',
          dataIndex: 'planItemCode',
          key: 'planItemCode',
          width: 200
          // scopedSlots: { customRender: 'planItemCode' }
        },
        { title: '物料编码', width: 100, dataIndex: 'materialCode', key: 'materialCode', align: 'center' },
        { title: '物料名称', width: 100, dataIndex: 'materialName', key: 'materialName', align: 'center' },
        { title: '规格型号', width: 100, dataIndex: 'materialModel', key: 'materialModel', align: 'center' },
        { title: '计划数量', width: 100, dataIndex: 'planNum', key: 'planNum', align: 'center' },
        { title: '待执行数量', width: 150, dataIndex: 'executoryNum', key: 'executoryNum', align: 'center' },
        { title: '单位', width: 100, dataIndex: 'mpMeasurementUnit', key: 'mpMeasurementUnit', align: 'center' },
        { title: '历史单价(元)', width: 100, dataIndex: 'formerlyPrice', key: 'formerlyPrice', align: 'center' },
        { title: '申请组织', width: 100, dataIndex: 'applyDepartment', key: 'applyDepartment', align: 'center' },
        { title: '备注', width: 100, dataIndex: 'remark', key: 'remark', align: 'center' },
        { title: '原使用品牌', width: 150, dataIndex: 'formerlyBrand', key: 'formerlyBrand', align: 'center' },
        {
          title: '审批时间',
          width: 300,
          dataIndex: 'auditTime',
          key: 'auditTime',
          align: 'center',
          scopedSlots: { customRender: 'auditTime' }
        },
        // { title: '附件', width: 100, dataIndex: 'accessoryUrl', key: 'accessoryUrl' },
        {
          title: '附件',
          width: 100,
          dataIndex: 'accessoryUrl',
          key: 'accessoryUrl',
          align: 'center',
          customRender: (text) => {
            return text ? (
              <a href={text} target="_blank">
                查看
              </a>
            ) : null
          }
        },

        {
          title: '操作',
          key: 'operation',
          width: 100,
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      selectedRowKeys: [],
      queryParam: {
        projectName: '',
        searchManner: ''
      },
      manageList: [], // 寻源方式 集合
      enterpriseNamesList: [], // 公司名称集合
      rules: {
        enterpriseNames: [{ required: true, message: '请选择主公司名称', trigger: 'change' }],
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'change' },
          { min: 0, max: 50, message: '只允许输入50个字符', trigger: 'blur' }
        ],
        searchManner: [{ required: true, message: '请选择寻源方式', trigger: 'change' }]
      },
      showChooseAPlanVisible: false,
      ids: this.$route?.query.ids,
      foundSearchDataList: [],
      isLoading: true
      // submitList: []
    }
  },
  async created() {
    await this.init()
    await this.dataList()
  },
  methods: {
    async dataList() {
      const { ids } = this
      const res = await getItemByIds({
        ids: ids.split(',')
      })
      if (res.code === '0') {
        // this.foundSearchDataList = res?.data
        this.foundSearchDataList = res?.data.map((item, index) => {
          this.$set(item, 'index', index + 1)
          return item
        })
        console.log(this.foundSearchDataList, '12312')
        const enterpriseNamesList = [
          ...this.enterpriseNamesList,
          ...res.data.map((x) => {
            return {
              label: x?.buyerMerchantName,
              value: x?.buyerMerchantId
            }
          })
        ]
        const newArr = []
        this.enterpriseNamesList = enterpriseNamesList.reduce((pro, cur) => {
          if (newArr && newArr.includes(cur.value)) return pro
          newArr.push(cur.value)
          pro.push(cur)
          return pro
        }, [])
      }

      // const result = {
      //   data: {
      //     listObj: res?.data,
      //     total: ids?.split(',').length
      //   }
      // }
      // return result
    },
    async init() {
      const disabledList = ['2', '6']
      const {
        data: { SEARCH_MANAGE }
      } = await getMultiList({ categories: ['SEARCH_MANAGE'] })
      this.manageList = SEARCH_MANAGE.filter((item) => {
        return item.code !== '3'
      }).map((x) => {
        return {
          label: x.name,
          value: x.code,
          // 易招标那比那先把这个隐藏后续会放开
          disabled: !disabledList.some((i) => {
            return i === x.code
          })
        }
      })
      const {
        data: { orgId: buyerMerchantId, enterpriseName: buyerMerchantName }
      } = await puchaserEntityId()
      this.queryParam.buyerMerchantId = buyerMerchantId
      this.queryParam.buyerMerchantName = buyerMerchantName
      // const list = [data, ...this.foundSearchDataList]
      // this.submitList = list
      // const newArr = []
      // const enterpriseNamesList = list.reduce((pro, cur) => {
      //   if (newArr && newArr.includes(cur.buyerMerchantId)) return pro
      //   newArr.push(cur.buyerMerchantId)
      //   pro.push(cur)
      //   return pro
      // }, [])
      this.enterpriseNamesList = [
        {
          value: buyerMerchantId,
          label: buyerMerchantName
        }
      ]
    },
    // 寻源方式选中值
    onChange(e) {},
    // onSelectChange(selectedRowKeys) {
    //   this.selectedRowKeys = selectedRowKeys
    // },
    onSubmit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (this.foundSearchDataList.length === 0) {
          this.$message.warning('请选择计划')
          return
        }
        if (valid) {
          const list = this.foundSearchDataList.map((item) => {
            item.buyerPlanItemId = item.id
            item.searchNum = item.executoryNum
            return item
          })
          this.isLoading = true
          const result = await projectSave({
            buyerMerchantId: this.queryParam.buyerMerchantId,
            buyerProjectName: this.queryParam.projectName,
            searchManner: this.queryParam.searchManner,
            buyerProjectItems: list
          })
          this.isLoading = false
          if (result.code === '0') {
            this.$message.success('操作成功')
            this.$router.push({
              name: 'MerchantsPurchaseManagCarry'
            })
          }
        } else {
          return false
        }
      })
    },
    showChooseAPlan() {
      this.showChooseAPlanVisible = true
    },
    updateVisible() {
      this.showChooseAPlanVisible = false
    },
    sliceChange(scope) {
      const { ids } = this
      const newIds = ids?.split(',').filter((item) => {
        return item !== scope?.id?.toString()
      })
      this.ids = newIds.join(',')
      window.history.replaceState(null, null, '?ids=' + newIds.join(','))
      // this.$refs.table.refresh(true)
      this.dataList()
      // this.$store.dispatch('ACTIONS_SLICE_SELECTED', item)
    },
    idsChange(ids) {
      this.ids = ids
      window.history.replaceState(null, null, '?ids=' + ids)
      // this.$refs.table.refresh(true)
      this.dataList()
    }
  }
}
</script>

<style lang="less" scoped>
.authention-apply-main {
  padding: 10px;
  box-sizing: border-box;
  width: 100%;
  background: #ffffff;
  border-radius: 8px;
}
.ant-form-item {
  display: flex;
  margin-right: 0;
}
/deep/.ant-form-item-label {
  float: left;
}
/deep/.ant-col-lg-8 {
  width: auto;
}
/deep/ .ant-select-enabled {
  width: 300px;
}
.delete-a {
  color: #1890ff;
}
</style>
