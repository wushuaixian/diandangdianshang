<template>
  <div class="businessCategory">
    <div class="content">
      <div class="title">
        <div class="icon"></div>
        <div class="text">经营品类</div>
      </div>
    </div>
    <s-table ref="table" name="businessCategoryTable" rowKey="id" :columns="columns" :data="init">
      <template slot="auditStatus" slot-scope="text">
        <span v-show="text.auditStatus == 1">已审核</span>
        <span v-show="text.auditStatus == 0">未审核</span>
        <span v-show="text.auditStatus == 2">
          审核不通过
          <a-tooltip placement="top">
            <template slot="title">
              <p>{{ text.message }}</p>
            </template>
            <a-icon type="question-circle" placement="top" />
          </a-tooltip>
        </span>
      </template>
    </s-table>
  </div>
</template>
<script>
import { businessCategory } from '@/api/supplieAuthAdmin'
export default {
  data() {
    return {
      pageNumber: 10,
      columns: [
        {
          title: '序号',
          dataIndex: 'id',
          key: 'id'
        },
        {
          title: '经营品类',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '主营品类',
          dataIndex: 'isMaincategory',
          key: 'mainCategroy'
        },
        {
          title: '审核状态',
          key: 'auditStatus',
          scopedSlots: { customRender: 'auditStatus' }
        }
      ],
      data: [
        {
          key: 1,
          number: 1,
          category: 'alsfjksdlfj',
          mainCategroy: 'asldfkjasdf',
          auditStatus: 3,
          content: 'asdlfkjskdlfj'
        }
      ]
    }
  },
  methods: {
    async init(params) {
      const { query } = this
      var data = {
        ...params,
        ...query,
        merchantId: this.$route.query.id
      }
      return businessCategory({ ...data })
    },
    pageChange(value) {
      this.pageNumber = value
    },
    onchangePage() {}
  },
  components: {}
}
</script>
<style lang='less' scoped>
.businessCategory {
  width: 100%;
  .title {
    span:first-child {
      background-image: linear-gradient(-180deg, #ff8323 0%, #ff663e 100%);
      border-radius: 2px;
      width: 2px;
    }
  }
}
.content {
  background: #fff;
  border-radius: 8px;
  margin: 20px 0;
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: solid 1px #e5e5e5;
    padding-bottom: 8px;
    .icon {
      background-image: linear-gradient(-179deg, #ff8720 0%, #ff6241 100%);
      border-radius: 2px;
      height: 16px;
      width: 4px;
    }
    .text {
      margin-left: 8px;
      font-size: 16px;
      color: #262626;
      line-height: 20px;
      font-weight: bold;
    }
  }
}
.pageLeft {
  float: left;
}
.paginations {
  width: 100%;
  margin-top: 20px;
  height: 50px;
}
</style>
