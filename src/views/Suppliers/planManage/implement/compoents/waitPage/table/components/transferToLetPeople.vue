<!--
 * @Author: your name
 * @Date: 2021-06-30 02:12:15
 * @LastEditTime: 2021-07-12 10:18:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/Suppliers/implement/compoents/waitPage/table/components/transferToLetPeople.vue
-->
<template>
  <div>
    <!-- 选择采购员弹窗 -->
    <div>
      <a-modal
        destroyOnClose
        :visible="visible"
        title="选择采购员"
        width="800px"
        ok-text="确认"
        cancel-text="取消"
        @ok="hideModal"
        @cancel="handleCancel"
      >
        <div>
          <p class="SearchName">
            <span>姓名：</span>
            <a-input class="nameSearchIpt" v-model="likeName"></a-input>
            <a-button type="primary" style="margin-left: 10px" @click="searchs"> 查询 </a-button>
          </p>
          <div>
            <s-table
              ref="table"
              name="getBuyerInfoTables1"
              rowKey="id"
              :rowSelection="{ type: 'radio', onChange: this.onChange }"
              :data="buyerInfoList"
              :columns="column"
              class="table"
            >
              <!-- <template slot="inputSelect" slot-scope="scope, item">
                <a-radio-group :option="list" v-model="buyerUserId" @change="onChange(item)">
                  <a-radio :value="item.id" :checked="item.selected"> </a-radio> -->
              <!-- <a-radio :style="radioStyle" :value="2"> Option B </a-radio>
                  <a-radio :style="radioStyle" :value="3"> Option C </a-radio>
                  <a-radio :style="radioStyle" :value="4">
                    More...
                    <a-input v-if="value === 4" :style="{ width: 100, marginLeft: 10 }" />
                  </a-radio> -->
              <!-- </a-radio-group>
              </template> -->
            </s-table>
          </div>
        </div>
      </a-modal>
    </div>
  </div>
</template>
<script>
import { buyerInfo } from '@/api/buyerPlanItem'
import { transferToOthers } from '@/api/projectCarry'
// import cookie from '@/utils/cookie'
const column = [
  { title: '序号', dataIndex: 'index', key: 'index' },
  { title: '用户账号', dataIndex: 'username', key: 'username' },
  { title: '姓名', dataIndex: 'identityCardName', key: 'identityCardName' },
  { title: '手机号', dataIndex: 'mobile', key: 'mobile' }
]
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectedRowKeys: {
      type: Array,
      default: () => {
        return []
      }
    },
    selectedRows: {
      type: Array,
      default: () => []
    }
  },
  data() {
    this.column = column
    return {
      column,
      likeName: '',
      buyerPlanItemPOList: [],
      buyerUserId: '',
      selectedId: [],
      list: []
    }
  },
  computed: {},
  watch: {
    selectedRowKeys() {
      this.buyerPlanItemPOList = this.selectedRowKeys
    }
  },
  mounted() {},
  methods: {
    // 获取采购员列表
    async buyerInfoList() {
      const data = {
        currentPage: 1,
        itemsPerPage: 10,
        merchantId: this.selectedRows[0].buyerMerchantId,
        likeName: this.likeName
      }
      const result = await buyerInfo(data)
      result.data.listObj.forEach((item, index) => {
        this.$set(item, 'index', index + 1)
        this.$set(item, 'selected', false)
      })
      this.list = result?.data?.listObj?.map((item) => {
        return {
          value: item.buyerUserId,
          label: item.buyerMerchantName
        }
      })
      return result
    },
    // 采购商查询列表数据
    searchs() {
      this.$refs.table.refresh(true)
    },
    // 隐藏手动分配计划弹框
    async hideModal() {
      const { buyerUserId, buyerPlanItemPOList } = this
      const params = {
        buyerPlanItemPOList: [],
        buyerUserId
      }
      buyerPlanItemPOList.forEach((item) => {
        params.buyerPlanItemPOList.push({
          id: item
        })
      })
      const result = await transferToOthers(params)
      if (result.code === '0') {
        this.$message.success(result.message || '转给他人成功')
      }
      this.$emit('updateVisible')
    },
    handleCancel() {
      this.$emit('updateVisible')
    },
    onChange(value) {
      this.list.map((item) => {
        item.selected = false
      })
      value.selected = !value.selected
      this.buyerUserId = value[0]
    }
  }
}
</script>
<style lang="less" scoped>
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
