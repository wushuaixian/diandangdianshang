<template>
  <div>
    <a-card>
      <div class="table-page-search-wrapper">
        <!-- 对应参数值值 -->
        <a-form-model layout="inline" ref="ruleForm" :model="queryParams">
          <!-- <a-row :gutter="48"> -->
          <a-row :gutter="24">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="规则编码" prop="code">
                <a-input placeholder="精确搜索" v-model="queryParams.code" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="规则名称" prop="name">
                <a-input placeholder="模糊搜索" v-model="queryParams.name" />
              </a-form-model-item>
            </a-col>
            <!-- v-model=必须等于queryParams -->
            <a-col :md="8" :sm="24">
              <a-form-model-item label="状态" prop="isDisable">
                <a-select
                  class="input"
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  allowClear
                  v-model="queryParams.isDisable"
                  :options="paymentMethod"
                  default-value="0"
                ></a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <!-- 查询 -->
          <a-col :md="24" :sm="24" class="btn">
            <div class="button">
              <a-button class="reset" @click="reset">重置</a-button>
              <!-- $refs.form.resetFields() -->
              <a-button type="primary" @click="ok">查询</a-button>
            </div>
          </a-col>
          <!-- </a-row> -->
        </a-form-model>
      </div>
    </a-card>
    <a-card class="card">
      <a-button type="primary" @click="add">新增</a-button>
      <a-button class="more" @click="moreIs">批量停用</a-button>
      <!-- S-Table组件的的数据加载和数据渲染  // 对应下面的数据：:columns="columns" =没数据报的columns错  //'map' of undefined= 没数据而报的错 -->
      <s-table
        ref="listAutomaticTable"
        name="listAutomaticTable"
        style="margin-top: 10px"
        rowKey="id"
        :columns="columns"
        :data="getReceipt"
        :scroll="{ x: 2000 }"
        :row-selection="rowSelection"
      >
        <!-- 插槽 -->
        <template v-slot:action="text, item">
          <a class="edit" @click="edit(item)">编辑</a>
          <a @click="deleteFn(item)">删除</a>
        </template>
      </s-table>
    </a-card>
  </div>
</template>
<script>
import { rulecoding, autoConfirmRuleDelete, batchDisable } from '@/api/orderCenter.js'

export default {
  data() {
    return {
      showMore: false,
      opten: [],
      columns: [
        {
          title: '规则编码',
          dataIndex: 'code',
          key: 'code'
        },
        {
          title: '优先级',
          dataIndex: 'priority',
          key: 'priority'
        },
        {
          title: '规则名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '状态',
          dataIndex: 'isDisable',
          key: 'isDisable',
          customRender: (value) => {
            if (value === 1) {
              return '停用'
            } else {
              return '可用'
            }
          }
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 100,
          scopedSlots: { customRender: 'action' }
        }
      ],
      rules: {},
      selectRowKeys: [],
      selectRows: [],
      rowSelection: {
        onChange: (selectRowKeys, selectRows) => {
          this.selectRowKeys = selectRowKeys
          this.selectRows = selectRows
        }
      },
      // input下拉
      dataSource: [],
      paymentMethod: [
        {
          label: '可用',
          value: '0'
        },
        {
          label: '停用',
          value: '1'
        }
      ],
      queryParams: {}
    }
  },
  methods: {
    // 对应父组件搜索的params
    async getReceipt(params) {
      const { queryParams } = this
      const { data, total } = await rulecoding({
        filters: {
          ...queryParams
        },
        limit: params.itemsPerPage,
        page: params.currentPage
      })
      const res = {
        data: {
          listObj: data,
          total
        }
      }
      return new Promise((resolve, reject) => {
        resolve(res)
      })
    },
    // 子向父-传search -> automatic.vue
    ok() {
      this.$refs.listAutomaticTable.refresh(true)
    },
    reset() {
      this.$refs.ruleForm.resetFields()
    },
    // 跳转name
    edit(item) {
      console.log(item)
      this.$router.push({
        name: 'ListEdit',
        query: {
          isEdit: '1',
          code: item.code,
          id: item.id
        }
      })
    },
    deleteFn({ id }) {
      const vm = this
      this.$confirm({
        title: '提示',
        content: '确定要删除吗?',
        async onOk() {
          const result = await autoConfirmRuleDelete({
            id
          })
          if (result.code === '0') {
            vm.$message.success('删除成功')
            vm.$refs.listAutomaticTable.refresh(true)
          }
        },
        async onCancel() {}
      })
    },
    add() {
      this.$router.push({
        name: 'ListEdit',
        query: {
          isEdit: '0'
        }
      })
    },
    async moreIs() {
      const { selectRows, selectRowKeys } = this
      const vm = this
      if (selectRowKeys.length === 0) {
        this.$message.warning('请选择配置')
        return false
      }
      if (
        selectRows.some((item) => {
          return item.isDisable === 1
        })
      ) {
        this.$message.warning('无法停用已被停用数据')
        return false
      }
      this.$confirm({
        title: '提示',
        content: '确定要停用吗?',
        async onOk() {
          const result = await batchDisable(selectRowKeys)
          if (result.code === '0') {
            vm.$message.success('停用成功')
            vm.$refs.listAutomaticTable.refresh(true)
          }
        },
        async onCancel() {}
      })
    }
  }
}
</script>
<style scoped lang="less">
.show-more {
  color: #ff6b00;
  font-size: 14px;
}
.btn {
  text-align: center;
}
.card {
  margin-top: 20px;
  .more {
    margin-left: 20px;
  }
}
.edit {
  margin-right: 10px;
}
</style>
