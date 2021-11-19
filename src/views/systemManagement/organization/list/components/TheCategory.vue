<template>
  <div class="the-category">
    <header-title>
      <span>经营品类</span>
    </header-title>
    <div class="table">
      <s-table ref="table" name="TheCategoryTables" :columns="columns" :data="getList" rowKey="id">
        <template v-slot:stataus="record">
          <a-tooltip placement="top" v-if="record.auditStatus === '3'">
            <template slot="title">
              <span>{{ record.message }}</span>
            </template>
            {{ statausText[record.auditStatus] }}
            <a-icon type="question-circle" />
          </a-tooltip>
          <span v-else>{{ statausText[record.auditStatus] }}</span>
        </template>
      </s-table>
    </div>

    <div class="class-btn">
      <a-button class="save-btn" v-if="!edit" type="primary">保存</a-button>
      <a-button @click="$router.back()">返回</a-button>
    </div>
  </div>
</template>

<script>
import { queryMerchantCategory } from '@/api/enterprise'

export default {
  props: {
    edit: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      id: this.$route.params?.id,
      statausText: ['', '待审核', '审核通过', '审核不通过'],
      columns: [
        {
          title: '类目编码',
          dataIndex: 'categoryCode',
          key: 'categoryCode'
        },
        {
          title: '经营品类名称',
          key: 'name',
          customRender: (record) => {
            return Number(record?.mainCategoryId) === 1 ? (
              <span style="color:red;">{record.name}(主营品类)</span>
            ) : (
              <span>{record.name}</span>
            )
          }
        },
        {
          title: '审核状态',
          key: 'auditStatus',
          scopedSlots: {
            customRender: 'stataus'
          }
        }
      ]
    }
  },

  methods: {
    async getList(params) {
      const { id: merchantId } = this
      return queryMerchantCategory({ ...params, merchantId })
    }
  }
}
</script>

<style lang="less" scoped>
.the-category {
  .table {
    margin-top: 20px;
  }
}
.class-btn {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10px;
  .save-btn {
    margin-right: 20px;
  }
}
</style>
