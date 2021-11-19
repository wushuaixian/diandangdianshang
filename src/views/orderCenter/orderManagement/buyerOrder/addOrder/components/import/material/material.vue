<template>
  <div class="material-table" ref="material">
    <a-modal
      destroyOnClose
      :getContainer="() => this.$refs.material"
      width="1000px"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      title="物料池导入"
    >
      <div class="table-page-search-wrapper-custom">
        <a-form-model
          layout="inline"
          ref="form"
          :model="queryParam"
          v-bind="{
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
          }"
        >
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="物料编码" prop="code">
                <a-input placeholder="请输入物料编码" v-model="queryParam.code"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="物料名称" prop="name">
                <a-input placeholder="请输入物料名称" v-model="queryParam.name" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="规格型号" prop="materialModel">
                <a-input placeholder="请输入规格型号" v-model="queryParam.materialModel" />
              </a-form-model-item>
            </a-col>
            <a-col :md="24" :sm="24">
              <div class="button">
                <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
                <a-button type="primary" @click="handleSearch">查询</a-button>
              </div>
            </a-col>
          </a-row>
        </a-form-model>
        <div class="table">
          <s-table
            name="materiaTables"
            ref="table"
            :rowSelection="rowSelection"
            :rowKey="(record) => record.id"
            :data="init"
            :scroll="{ x: 1000 }"
            :columns="columns"
          >
            <template v-slot:id="id">
              <span :other="id">{{ contractName }}</span>
            </template>
          </s-table>
          <div class="count" v-show="selectRows.length > 0">
            已选
            <font class="num">{{ selectRows.length }}</font>
            条
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { getMaterialList } from '@/api/plan'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectParams: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      confirmLoading: false,
      queryParam: {
        code: '',
        name: '',
        materialModel: ''
      },
      columns: [
        { title: '物料编码', dataIndex: 'code', key: 'code' },
        { title: '物料名称', dataIndex: 'name', key: 'name' },
        { title: '规格型号', dataIndex: 'materialModel', key: 'materialModel' },
        { title: '单位', dataIndex: 'mpMeasurementUnit', key: 'mpMeasurementUnit' }
      ],
      selectRows: [],
      rowSelection: {
        onSelect: (record, selected) => {
          if (selected) this.selectRows.push(record)
          else this.selectRows.splice(this.selectRows.map((x) => x.id).indexOf(record.id), 1)
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          if (selected) this.selectRows.push(...changeRows)
          else {
            changeRows.map((x) => {
              this.selectRows.splice(this.selectRows.map((m) => m.id).indexOf(x.id), 1)
            })
          }
        },
        getCheckboxProps: (record) => ({
          props: {
            disabled: this.selectParams.includes(record.id), // Column configuration not to be checked
            name: record.name
          }
        })
      }
    }
  },
  methods: {
    async init(page) {
      const { queryParam } = this
      const data = {
        ...page,
        ...queryParam,
        flag: true
      }
      return getMaterialList(data)
    },
    handleReset() {
      this.$refs.form.resetFields()
    },
    handleSearch() {
      this.$refs.table.refresh(true)
    },
    handleOk() {
      this.$emit('ok', [...this.selectRows])
      this.$emit('update:visible', false)
    },
    handleCancel() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="less" scoped>
.material-table {
  .s-table {
    margin-top: 20px;
  }
  .table {
    position: relative;
    .count {
      position: absolute;
      bottom: 23px;
      left: 12px;
      .num {
        color: #ff6b00;
        font-weight: bold;
      }
    }
  }
}
</style>
