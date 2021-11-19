<template>
  <div>
    <a-card>
      <a-form-model ref="ruleForm" :model="queryParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item ref="name" label="规则编码" prop="code">
          <!-- <a-input v-model="queryParams.code" /> -->
          <span>
            {{ queryParams.code }}
          </span>
        </a-form-model-item>
        <a-form-model-item ref="name" label="规则名称" prop="name">
          <a-input v-model="queryParams.name" />
        </a-form-model-item>
        <a-form-model-item ref="name" label="优先级" prop="priority">
          <a-input-number
            style="width: 150px"
            :min="1"
            :max="999999999"
            v-model="queryParams.priority"
            @change="onChange"
          />
        </a-form-model-item>
        <a-form-model-item ref="name" label="规则适用商家" prop="merchantId">
          <a-select
            allowClear
            :getPopupContainer="(triggerNode) => triggerNode.parentNode"
            show-search
            placeholder="请输入规则适用商家"
            :default-active-first-option="false"
            :show-arrow="false"
            v-model="queryParams.merchantId"
            :default-value="queryParams.merchantId"
            :filter-option="false"
            :not-found-content="fetching ? undefined : null"
            @search="handleSearch"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="item in supList" :key="item.orgName" :value="item.id">
              {{ item.orgName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="规则状态" prop="isDisable">
          <a-radio-group v-model="queryParams.isDisable">
            <a-radio :value="0"> 可用 </a-radio>
            <a-radio :value="1"> 停用 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="匹配条件" prop="conList">
          <a-col>
            <div class="button">
              <a-button type="primary" @click="addConList">匹配条件</a-button>
            </div>
            <a-row>
              <s-table
                name="listEditTable"
                :list="queryParams.conList"
                :columns="columns"
                :customPage="true"
                :scroll="{ x: 300 }"
              >
                <template v-slot:active="action, item">
                  <a class="btn" @click="edit(item)">编辑</a>
                  <a @click="deteleFn(item)">删除</a>
                </template>
              </s-table>
            </a-row>
          </a-col>
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" :loading="loading" @click="onSubmit"> 保存 </a-button>
          <a-button style="margin-left: 20px" @click="$router.back()"> 返回 </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
    <addlistEdit
      v-if="visible"
      :visible.sync="visible"
      :isEdit.sync="isEdit"
      :params.sync="params"
      @ok="setConList"
    ></addlistEdit>
  </div>
</template>

<script>
import { searchCom } from '@/api/contract'
import { autoConfirmRuleCreateCode, autoConfirmRule, autoConfirmRuleAdd, autoConfirmRuleGet } from '@/api/orderCenter'
import addlistEdit from './components/listEditcomponents/addlistEdit'
let timeout
export default {
  components: {
    addlistEdit
  },
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      columns: [
        {
          title: '变量名',
          key: 'variableName',
          width: 200,
          dataIndex: 'variableName'
        },
        {
          title: '运算符',
          key: 'operator',
          width: 200,
          dataIndex: 'operator'
        },
        {
          title: '条件值',
          key: 'variableValueDesc',
          width: 200,
          dataIndex: 'variableValueDesc'
        },
        {
          title: '操作',
          key: 'active',
          fixed: 'right',
          width: 150,
          scopedSlots: { customRender: 'active' }
        }
      ],
      other: '',
      params: {},
      loading: false,
      isEdit: false,
      fetching: false,
      visible: false,
      supList: [],
      queryParams: {
        code: '',
        isDisable: 0,
        conList: [],
        deleteIds: []
      },
      rules: {
        name: [
          { required: true, message: '规则名称不能为空', trigger: 'change' },
          { min: 1, max: 20, message: '请输入输入1-20位名称', trigger: 'change' }
        ],
        priority: [{ required: true, message: '优先级不能为空', trigger: 'change' }],
        isDisable: [{ required: true, message: '请选择规则状态', trigger: 'change' }],
        merchantId: [{ required: true, message: '请选择规则适用商家', trigger: 'blur' }],
        conList: [
          {
            type: 'array',
            required: true,
            message: '匹配条件不能为空',
            trigger: 'change'
          }
        ]
      }
    }
  },
  mounted() {
    if (this.$route.query.isEdit === '0') {
      this.createdCode()
      this.handleSearch('')
    } else {
      this.getCode()
      this.handleSearch('')
      this.queryParams.code = this.$route.query.code
    }
  },
  methods: {
    async createdCode() {
      const result = await autoConfirmRuleCreateCode()
      if (result.code === '0') {
        this.queryParams.code = result.data
        console.log(this.queryParams)
      } else {
        this.$message.warning('创建接单配置失败')
        this.$router.back()
      }
    },
    async getCode() {
      const result = await autoConfirmRuleGet({
        id: this.$route.query.id
      })
      this.queryParams = { ...result?.data, deleteIds: [] }
      this.queryParams.conList = this.queryParams?.conList?.map((item) => {
        if (item.variableValue === item.variableValueDesc) {
          item.variableValue = JSON.parse(item.variableValue)[0]?.split('-')
          item.variableValueDesc = JSON.parse(item.variableValueDesc)[0]?.split('-')
        } else {
          item.variableValue = JSON.parse(item.variableValue)
          item.variableValueDesc = JSON.parse(item.variableValueDesc)
        }
        return item
      })
    },
    onChange() {
      this.queryParams.priority = Math.ceil(this.queryParams.priority)
    },
    onSubmit() {
      this.loading = true

      const { queryParams } = this
      const vm = this
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          queryParams.conList = queryParams.conList.map((item) => {
            if (typeof item.variableValue !== 'object') {
            }
            if (typeof item.variableValue !== 'string') {
              item.variableValue = JSON.stringify(item.variableValue)
            }
            if (typeof item.variableValueDesc !== 'string') {
              item.variableValueDesc = JSON.stringify(item.variableValueDesc)
            }
            return item
          })
          // alert('submit!')
          const result =
            vm.$route.query.isEdit === '1'
              ? await autoConfirmRule({ ...queryParams })
              : await autoConfirmRuleAdd({ ...queryParams })
          if (result.code === '0') {
            vm.$message.success(vm.$route.query.isEdit === '1' ? '更新成功' : '保存成功')
            vm.$router.back()
          }
        } else {
          this.loading = false
          // console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    deteleFn({ variableId, id }) {
      this.queryParams.deleteIds = [...this.queryParams.deleteIds, id]
      this.queryParams.conList = this.queryParams.conList.filter((item) => item.variableId !== variableId)
    },
    addConList() {
      this.visible = true
    },
    edit(item) {
      this.visible = true
      this.isEdit = true
      this.params = item
    },
    handleSearch(value) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      this.fetching = true
      this.supList = []
      const vm = this
      timeout = setTimeout(() => {
        searchCom(value).then((ret) => {
          vm.fetching = false
          vm.supList = ret.data.providerMerchantList
          if (vm.queryParams.merchantId) {
            vm.queryParams.merchantName = vm.supList.filter((item) => {
              return item.id === vm.queryParams.merchantId
            })[0]?.orgName
          } else {
            vm.queryParams.merchantName = vm.supList[0]?.orgName
            vm.queryParams.merchantId = vm.supList[0]?.id
          }
        })
      }, 300)
    },
    setConList(params, variableId) {
      if (variableId) {
        this.queryParams.conList = this.queryParams.conList.map((item) => {
          if (item.variableId === variableId) {
            item = params
          }
          return item
        })
        return
      }
      if (
        this.queryParams.conList.some((item) => {
          return item.variableName === params.variableName
        })
      ) {
        this.$message.warning('已存在该变量名的条件')
        return
      }
      this.queryParams.conList = [...(this.queryParams.conList || []), params]
    }
  }
}
</script>

<style scoped lang="less">
.gutter-box {
  /* background: #00a0e9; */
  padding: 3px 0;
  float: right;
}
.gutter-a {
  padding: 3px 0;
}
.gutterone {
  margin-bottom: 15px;
}
.gutter-boxone {
  padding-top: 15px;
}
.button {
  margin-bottom: 10px;
}
.btn {
  margin-right: 20px;
}
</style>
