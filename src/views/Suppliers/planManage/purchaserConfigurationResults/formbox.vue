<template>
  <p>
    <span class="title">移转给采购员:</span>
    <a-button type="primary" @click="choice"> 请选择采购员 </a-button><span style="margin-left: 20px">{{ name }}</span>
    <a-modal v-model="visible" title="选择采购员" width="800px" ok-text="确认" cancel-text="取消" @ok="hideModal">
      <div class="table-page-search-wrapper-custom">
        <a-form-model
          layout="inline"
          v-bind="{
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
          }"
        >
          <a-row :gutter="48">
            <a-col :md="14" :sm="24">
              <a-form-model-item label="姓名">
                <a-input v-model="nameuser"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="4" :sm="8">
              <a-button type="primary" @click="sumber">查询</a-button>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
      <s-table
        ref="table"
        rowKey="id"
        :rowSelection="{ type: 'radio', onChange: this.handleChange }"
        :data="choiceList"
        :columns="column"
      ></s-table>
    </a-modal>
  </p>
</template>

<script>
import { info } from '@/api/supplier'
export default {
  props: {
    ids: {
      type: String,
      default: () => {}
    }
  },
  data() {
    return {
      nameuser: '',
      visible: false,
      column: [
        {
          title: '选择',
          dataIndex: 'fullNamePath1',
          key: 'fullNamePath1'
        },
        {
          title: '序号',
          dataIndex: 'fullNamePath',
          key: 'fullNamePath'
        },
        {
          title: '姓名',
          dataIndex: 'identityCardName',
          key: 'identityCardName'
        },
        {
          title: '手机号',
          dataIndex: 'mobile',
          key: 'mobile'
        },
        {
          title: '组织',
          dataIndex: 'departmentName',
          key: 'departmentName'
        },
        {
          title: '已分配物料类目',
          dataIndex: 'dispatchedMaterialCategory',
          key: 'dispatchedMaterialCategory'
        }
      ],
      selectedRowKeys: [],
      name: ''
    }
  },
  methods: {
    sumber() {
      this.$refs.table.refresh(true)
    },
    hideModal() {
      this.visible = false
    },
    async choiceList(pagination) {
      const merchantId = this.ids
      const { itemsPerPage } = pagination
      const { currentPage } = pagination
      const data = {
        likeName: this.nameuser,
        merchantId,
        currentPage,
        itemsPerPage
      }
      return info(data)
    },
    choice() {
      this.visible = true
    },
    handleChange(selectRowKeys, selectRows) {
      this.$emit('sonfather', selectRows[0])
      this.name = selectRows[0].identityCardName
      this.selectedRowKeys = selectRowKeys
    }
  }
}
</script>
<style lang="less" scoped>
.mid {
  .margin {
    margin: 20px;
  }
  .SearchName {
    text-align: center;
    display: flex;
    align-items: center;
    span {
      margin-left: 60px;
    }
  }
}
</style>
