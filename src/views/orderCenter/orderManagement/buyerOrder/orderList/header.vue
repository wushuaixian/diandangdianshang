<template>
  <div class="order-list-header">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper" :class="{ sel: isShowMore }">
        <a-form-model
          layout="inline"
          ref="basicforms"
          :model="form"
          :label-col="{ span: 20 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="订单编号" prop="orderCode">
                <a-input v-model="form.orderCode" placeholder="请输入订单编号"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="供应商" prop="merchantId">
                <a-select
                  allowClear
                  :getPopupContainer="
                    (triggerNode) =>
                      triggerNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                        .parentNode.parentNode.parentNode.parentNode
                  "
                  show-search
                  placeholder="请输入供应商名称查询"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  :not-found-content="fetching ? undefined : null"
                  v-model="form.merchantId"
                  @search="handleSearch"
                >
                  <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                  <a-select-option v-for="item in comList" :key="item.merchantId" :value="item.merchantId">
                    {{ item.merchantName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="订单来源" prop="purchaseOrderSource">
                <a-select v-model="form.purchaseOrderSource">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option value="1">计划</a-select-option>
                  <a-select-option value="3">项目</a-select-option>
                  <a-select-option value="4">合同</a-select-option>
                  <a-select-option value="5">新增</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="物料名称" prop="materialName">
                <a-input v-model="form.materialName" placeholder="请输入物料名称"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="规格型号" prop="standard">
                <a-input v-model="form.standard" placeholder="请输入规格型号"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="订单时间" prop="orderCreateTime">
                <a-range-picker style="width: 100%" v-model="form.orderCreateTime" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="合同编号" prop="contractCode">
                <a-input v-model="form.contractCode" placeholder="请输入合同编号"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="合同名称" prop="contractName">
                <a-input v-model="form.contractName" placeholder="请输入合同名称"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="采购员" prop="buyerUserName">
                <a-input v-model="form.buyerUserName" placeholder="请输入采购员"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="项目编码" prop="projectCode">
                <a-input v-model="form.projectCode" placeholder="请输入项目编码"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="项目名称" prop="projectName">
                <a-input v-model="form.projectName" placeholder="请输入项目名称"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
      <div class="btns">
        <a-button class="btn" @click="$parent.clear()">重置</a-button>
        <a-button class="btn" @click="$parent.search()" type="primary">查询</a-button>
        <div class="more-box">
          <div @click="isShowMore = !isShowMore">
            <a-button class="more" type="link">
              <div>{{ isShowMore ? '收起' : '展开' }}</div>
              <a-icon class="icon" :class="{ sel: isShowMore }" type="down" />
            </a-button>
          </div>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import * as api from '@/api/orderCenter'
export default {
  model: {
    prop: 'form',
    event: 'change'
  },
  props: {
    form: {
      type: Object,
      default: () => ({
        orderStatus: '',
        orderCode: '',
        merchantId: undefined,
        purchaseOrderSource: '',
        materialName: '',
        standard: '',
        orderCreateTime: null,
        contractCode: '',
        contractName: '',
        buyerUserName: '',
        projectCode: '',
        projectName: ''
      })
    }
  },
  data() {
    return {
      isShowMore: false,
      fetching: false,
      comList: []
    }
  },
  methods: {
    handleSearch(val) {
      this.fetching = true
      api.getComList(val).then((res) => {
        this.fetching = false
        if (res.code === '0') {
          this.comList = res.data
        } else {
          this.comList = []
        }
      })
    },
    handleChangeCom(value, option) {
      this.form.merchantId = option?.data?.attrs?.merchantId
    }
  }
}
</script>

<style lang="less" scoped>
.table-page-search-wrapper {
  overflow: hidden;
  margin: 12px 24px 0 24px;
  height: 96px;
  transition: all 0.3s;
  &.sel {
    height: 192px;
  }
}
.btns {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  .btn {
    margin: 0 8px;
  }
  .more-box {
    position: relative;
    height: 32px;
    .more {
      position: absolute;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #ff6b00;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      height: 32px;
      min-width: 0;
      margin-left: 8px;
      padding: 0;
      .icon {
        font-size: 10px;
        width: 10px;
        height: 10px;
        transition: all 0.4s;
        margin-left: 4px;
        &.sel {
          transform: rotate(180deg);
        }
      }
    }
  }
}
</style>
<style lang="less" >
.order-list-header {
  border-radius: 8px;
  overflow: hidden;
  .table-page-search-wrapper {
    .ant-form-inline {
      .ant-form-item {
        .ant-form-item-label {
          width: 80px;
        }
      }
    }
  }
  .ant-card-body {
    padding-bottom: 0;
  }
}
</style>
