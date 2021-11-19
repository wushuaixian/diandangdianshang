<template>
  <section class="authention-index" ref="container">
    <a-affix :offset-top="5" :target="() => this.$refs.container">
      <header class="header">
        <ul>
          <li v-for="(item, index) in tabsList" :key="index">
            <a
              :href="`#${item.components}`"
              :class="{ sel: tabIndex === index }"
              @click="tabIndex = index"
              v-html="item.name"
            ></a>
          </li>
        </ul>
      </header>
    </a-affix>
    <div class="content" v-for="item in tabsList" :key="item.components" :id="item.components">
      <div v-if="item.show">
        <div class="title">
          <div class="icon"></div>
          <div class="text" v-text="item.name"></div>
        </div>
        <div class="com" :is="item.components" :form="info"></div>
      </div>
    </div>
  </section>
</template>

<script>
import {
  Qualification,
  Review,
  Relation,
  Stock,
  Files,
  PatentPic,
  WorkPic,
  WorkshopPic,
  SalesPic,
  QuipmentInventoryCheckInfo,
  ProductCapacityCheckInfo,
  AuditClause
} from './components/'
import { getMerchantOrgInfoDetail } from '@/api/supplieAuthAdmin'
export default {
  components: {
    Qualification,
    Review,
    Relation,
    Stock,
    Files,
    PatentPic,
    WorkPic,
    WorkshopPic,
    SalesPic,
    QuipmentInventoryCheckInfo,
    ProductCapacityCheckInfo,
    AuditClause
  },
  data() {
    return {
      info: {},
      tabIndex: 0,
      tabs: [
        {
          name: '企业基本资质',
          components: 'Qualification',
          show: true
        },
        {
          name: '综合评审情况',
          components: 'Review',
          show: true
        },
        {
          name: '审核条款',
          components: 'AuditClause',
          show: true
        },
        {
          name: '关联企业',
          components: 'Relation',
          show: true
        },
        {
          name: '设备清单',
          components: 'quipmentInventoryCheckInfo',
          show: false
        },
        {
          name: '生产产值',
          components: 'productCapacityCheckInfo',
          show: false
        },
        {
          name: '库存金额',
          components: 'Stock',
          show: false
        },
        {
          name: '资质附件',
          components: 'Files',
          show: true
        },
        {
          name: '销售业绩照片',
          components: 'SalesPic',
          show: true
        },
        {
          name: '专利照片',
          components: 'PatentPic',
          show: true
        },
        {
          name: '办公照片',
          components: 'WorkPic',
          show: true
        },
        {
          name: '车间/厂房/库房照片',
          components: 'WorkshopPic',
          show: true
        }
      ]
    }
  },
  computed: {
    tabsList() {
      return this.tabs.filter((x) => x.show)
    }
  },
  mounted() {
    this.getMerchantOrgInfoDetail()
  },
  methods: {
    async getMerchantOrgInfoDetail() {
      const res = await getMerchantOrgInfoDetail()
      if (res.code === '0') {
        this.info = res.data
        this.tabs = this.tabs.map((x) => {
          const isStatus = ['quipmentInventoryCheckInfo', 'productCapacityCheckInfo'].includes(x.components)
          const isStock = ['Stock']
          return {
            ...x,
            show: isStatus
              ? this.info?.enterpriseNature === '1' || x.show
              : isStock
              ? this.info?.enterpriseNature === '2' || x.show
              : x.show
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.authention-index {
  /deep/.ant-affix {
    top: 64px !important;
  }
  #Factory:target,
  #BusinessInfo:target,
  #Review:target,
  #AuditClause:target,
  #Qualification:target,
  #Relation:target,
  #Files:target,
  #PatentPic:target,
  #WorkshopPic:target,
  #quipmentInventoryCheckInfo:target,
  #productCapacityCheckInfo:target,
  #Stock:target,
  #WorkPic:target {
    padding-top: 50px;
  }
  .header {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    overflow: hidden;
    background: #ffffff;
    border-radius: 8px;
    height: 44px;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
    ul {
      height: 100%;
      padding: 0;
      margin: 0;
      list-style: none;
      display: flex;
      flex-direction: row;
      li {
        list-style: none;
        height: 100%;
        flex: 1;
        display: flex;
        align-content: center;
        justify-content: center;
        background-color: #ccc;
        a {
          height: 100%;
          width: 100%;
          border-top: solid 2px #fff;
          font-size: 14px;
          color: #262626;
          letter-spacing: 0;
          line-height: 40px;
          display: flex;
          align-content: center;
          justify-content: center;
          transition: all 0.3s;
          &:hover {
            color: #ff9e59;
          }
          &.sel {
            color: #ff6b00;
            background: rgba(255, 107, 0, 0.1);
            border-top: solid 2px #ff6b00;
          }
        }
      }
    }
  }
  .content {
    padding: 24px 20px;
    background: #fff;
    border-radius: 8px;
    margin: 20px 0;
    .title {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      overflow: hidden;
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
    .com {
      padding: 24px 0;
      overflow: hidden;
    }
  }
}
</style>
