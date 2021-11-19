<template>
  <div class="order-detail-material">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper" :class="{ sel: isShowMore }">
        <a-form-model
          layout="inline"
          ref="searchform"
          :model="queryParam"
          :label-col="{ span: 20 }"
          :wrapper-col="{ span: 17 }"
        >
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="物料编号" prop="materialCode">
                <a-input placeholder="请输入物料编号" v-model="queryParam.materialCode" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="物料名称" prop="materialName">
                <a-input placeholder="请输入物料名称" v-model="queryParam.materialName" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="规格型号" prop="standard">
                <a-input placeholder="请输入规格型号" v-model="queryParam.standard" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="商品编码" prop="productCode">
                <a-input placeholder="请输入平台商品编码" v-model="queryParam.productCode" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="商品名称" prop="productCname">
                <a-input placeholder="请输入平台商品名称" v-model="queryParam.productCname" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="申请组织" prop="applyDepartment">
                <a-input placeholder="请输入申请组织" v-model="queryParam.applyDepartment" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="品牌/产地" prop="brandName">
                <a-input placeholder="请输入品牌/产地" v-model="queryParam.brandName" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="交货期" prop="time">
                <a-range-picker v-model="queryParam.time" style="width: 100%" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="采购员" prop="buyerUserName">
                <a-input placeholder="请输入采购员" v-model="queryParam.buyerUserName" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
      <div class="btns">
        <a-button class="btn" @click="clear">重置</a-button>
        <a-button class="btn" @click="search" type="primary">查询</a-button>
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
    <s-table ref="table" rowKey="id" :scroll="{ x: 2000 }" :data="init" name="material" :columns="columns">
      <template v-for="item in inputKeys" :slot="item.key" slot-scope="props">
        <d-slot-fileds
          @change="handelChange(props, item.key)"
          v-if="props.id === id"
          :type="item.type"
          :min="item.min"
          :max="item.max"
          :length="item.maxLength"
          :floatLength="item.floatLength"
          :key="item.key"
          v-model="props[item.key]"
        ></d-slot-fileds>
        <span v-else :key="item.key">{{ props[item.key] }}</span>
      </template>

      <template slot="options" slot-scope="item">
        <a-button
          class="options"
          type="link"
          v-show="item.id != id"
          :disabled="id != null && item.id != id"
          @click="editItem(item)"
          v-if="!disableds && ![1050, 1062, 9000].includes(Number(form.confirmStatus))"
        >
          <!-- [1011, 1030, 1031, 1040].includes(Number(form.confirmStatus)) -->
          编辑
        </a-button>
        <a-popconfirm
          title="确定删除该物料明细吗?"
          ok-text="删除"
          cancel-text="取消"
          @confirm="delItem(item)"
          v-if="!$hasOpeerate()"
        >
          <a-button
            class="options"
            type="link"
            v-show="item.id != id"
            :disabled="id != null && item.id != id"
            v-if="!disableds && ![1050, 1062, 9000].includes(Number(form.confirmStatus))"
          >
            删除
          </a-button>
        </a-popconfirm>
        <a-button class="options" type="link" v-show="item.id == id" :loading="editLoading" @click="saveItem(item)">
          保存
        </a-button>
        <a-button class="options" type="link" v-show="item.id == id && editLoading == false" @click="cancelItem(item)">
          取消
        </a-button>
      </template>
    </s-table>
  </div>
</template>

<script>
import * as api from '@/api/orderCenter'
import moment from 'moment'
import Enum from '@/components/_util/enum'

const inputKeys = [
  { key: 'productItemNum', title: '数量', type: Enum.NUMBER, min: 1, max: 99999999 },
  { key: 'productPriceSale', title: '含税单价(元)', type: Enum.NUMBER, folatLength: 2, min: 0, max: 9999999999 },
  { key: 'deliveryTime', title: '交货期', type: Enum.DATE },
  { key: 'qualityRetentionPeriod', title: '质保期', type: Enum.TEXT, maxLength: 200 },
  { key: 'brandName', title: '品牌/产地', type: Enum.TEXT, maxLength: 100 },
  { key: 'remark', title: '备注', type: Enum.TEXT, maxLength: 200 }
]
const columns = [
  { title: '物料编码', width: 180, key: 'materialCode', dataIndex: 'materialCode' },
  { title: '物料名称', width: 180, key: 'materialName', dataIndex: 'materialName' },
  { title: '型号规格', width: 180, key: 'standard', dataIndex: 'standard' },
  { title: '单位', width: 180, key: 'unit', dataIndex: 'unit' },
  { title: '数量', key: 'productItemNum', width: 140, scopedSlots: { customRender: 'productItemNum' } }, //
  { title: '未税单价(元)', width: 180, key: 'priceWith', dataIndex: 'priceWith' },
  {
    title: '含税单价(元)',
    key: 'productPriceSale',
    width: 140,
    scopedSlots: { customRender: 'productPriceSale' }
  }, //
  { title: '未税总价(元)', width: 180, key: 'withoutTaxTotalPrice', dataIndex: 'withoutTaxTotalPrice' },
  { title: '含税总价(元)', width: 180, key: 'productItemAmount', dataIndex: 'productItemAmount' },
  { title: '税率 (%)', width: 180, key: 'taxRate', dataIndex: 'taxRate' },
  { title: '交货期', key: 'deliveryTime', width: 180, scopedSlots: { customRender: 'deliveryTime' } }, //
  {
    title: '质保期',
    key: 'qualityRetentionPeriod',
    width: 180,
    scopedSlots: { customRender: 'qualityRetentionPeriod' }
  }, //
  { title: '品牌/产地', key: 'brandName', width: 170, scopedSlots: { customRender: 'brandName' } }, //
  // { title: '已发货数量', key: '', dataIndex: '' },
  // { title: '已到货数量', key: '', dataIndex: '' },
  // { title: '已入库数量', key: '', dataIndex: '' },
  { title: '申请组织', width: 180, key: 'applyDepartment', dataIndex: 'applyDepartment' },
  { title: '使用部门', width: 180, key: 'useDepartment', dataIndex: 'useDepartment' },
  { title: '备注', key: 'remark', width: 170, scopedSlots: { customRender: 'remark' } }, //
  { title: '计划编号', width: 180, key: 'planItemCode', dataIndex: 'planItemCode' },
  {
    title: '操作',
    key: 'options',
    width: 100,
    align: 'center',
    fixed: 'right',
    scopedSlots: { customRender: 'options' }
  }
  // { title: '平台商品编码', key: '', dataIndex: '' },
  // { title: '商品名称', key: '', dataIndex: '' },
  // { title: '商品型号', key: '', dataIndex: '' }
]
export default {
  model: {
    prop: 'form',
    event: 'change'
  },
  props: {
    form: {
      type: Object,
      default: null
    },
    disableds: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editLoading: false,
      catch: null,
      id: 0,
      columns,
      inputKeys,
      queryParam: {
        materialName: '', // 物料名称
        standard: '', // 规格型号
        orderCode: '', // 订单编号
        date: null,
        contractCode: '', // 合同编号
        contractName: '', // 合同名称
        buyerUserName: '', // 采购员姓名
        projectCode: '', // 项目编号
        projectName: '', // 项目名称
        brandName: '', // 品牌/产地
        productCname: '', // 商品名称
        productCode: '', // 商品编码
        materialCode: '', // 物料编码
        planItemCode: '' // 计划编号
      },
      isShowMore: false
    }
  },
  methods: {
    async init(params) {
      const formData = {
        ...params,
        ...this.queryParam,
        orderCode: this.$route.query.orderCode,
        startDate: this.queryParam.time ? moment(this.queryParam.time[0]).format('yyyy-MM-DD') : null,
        endDate: this.queryParam.time ? moment(this.queryParam.time[1]).format('yyyy-MM-DD') : null
      }
      this.cache = null
      this.id = null
      const {
        data: { listObj, total }
      } = await api.getOrderMaterialList(formData)
      return {
        data: {
          listObj: listObj?.map((item) => {
            item.productItemAmount = (Number(item.productPriceSale) * Number(item.productItemNum)).toFixed(4)
            item.productItemNum = item.productItemNum.toFixed(4)
            item.productPriceSale = item.productPriceSale.toFixed(4)
            item.priceWith = (Number(item.productPriceSale) / (1 + Number(item.taxRate) / 100)).toFixed(4)
            item.withoutTaxTotalPrice = (Number(item.priceWith) * Number(item.productItemNum)).toFixed(4)
            console.log(item.deliveryTime)
            return item
          }),
          total
        }
      }
    },
    handelChange(item, key) {
      if (['productPriceSale', 'productItemNum'].includes(key)) {
        item.productItemAmount = (Number(item.productPriceSale) * Number(item.productItemNum)).toFixed(4)
        item.productItemNum = item.productItemNum.toFixed(4)
        item.productPriceSale = item.productPriceSale.toFixed(4)
        item.priceWith = (Number(item.productPriceSale) / (1 + Number(item.taxRate) / 100)).toFixed(4)
        item.withoutTaxTotalPrice = (Number(item.priceWith) * Number(item.productItemNum)).toFixed(4)
      }
    },
    search() {
      this.$refs.table.refresh(true)
    },
    clear() {
      this.$refs.searchform.resetFields()
      delete this.queryParam.time
      this.search()
    },
    editItem(item) {
      this.cache = { ...item }
      this.id = item.id
    },
    cancelItem(item) {
      for (const key in item) {
        item[key] = this.cache[key]
      }
      this.cache = null
      this.id = null
    },
    saveItem(item) {
      this.editLoading = true
      api.setEditMaterial(item).then((ret) => {
        this.editLoading = false
        if (ret.code === '0') {
          this.$notification.success({
            message: '保存成功'
          })
          this.cache = null
          this.id = null
        } else {
          this.$notification.error({
            message: '保存失败',
            description: ret.message
          })
        }
      })
    },
    delItem(item) {
      api.setDelMaterial(item.id).then((res) => {
        if (res.code === '0') {
          this.$notification.success({
            message: '删除成功'
          })
          this.$refs.table.refresh(false)
        } else {
          this.$notification.error({
            message: '删除失败',
            description: res.message
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.options {
  min-width: 34px;
  padding: 0;
}
.table-page-search-wrapper {
  overflow: hidden;
  max-height: 96px;
  transition: all 0.4s;
  &.sel {
    max-height: 144px;
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
.order-detail-material {
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
