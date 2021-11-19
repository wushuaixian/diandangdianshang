<!--
 * @Author: your name
 * @Date: 2021-07-24 17:29:59
 * @LastEditTime: 2021-07-26 23:43:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/orderCenter/orderManagement/supplierOrder/components/orderDetailComponents/afterSale.vue
-->
<template>
  <div>
    <header-title class="header-title"> <span>批量售后</span> <a>查看售后记录</a> </header-title>
    <a-form-model layout="inline" class="form-model" ref="form" :model="queryParams" v-bind="layout">
      <a-row :gutter="48">
        <a-col :md="8" :sm="24">
          <a-form-model-item label="物料编号：" prop="code">
            <a-input v-model="queryParams.code" placeholder="请输入物料编号"> </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item label="物料名称：" prop="name">
            <a-input v-model="queryParams.name" placeholder="请输入物料名称"> </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item label="规格型号：" prop="materialModel">
            <a-input v-model="queryParams.materialModel" placeholder="请输入规格型号"> </a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
      <br />
      <a-row :gutter="48">
        <a-col :md="8" :sm="24">
          <a-form-model-item label="平台商品编码：" prop="pingtaiProductCode">
            <a-input v-model="queryParams.pingtaiProductCode" placeholder="请输入平台商品编码"> </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item label="商品名称：" prop="productName">
            <a-input v-model="queryParams.productName" placeholder="请输入商品名称"> </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item label="商品型号：" prop="productNo">
            <a-input v-model="queryParams.productNo" placeholder="请输入商品型号"> </a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
      <br />
      <a-row :gutter="48" v-if="showMore">
        <a-col :md="8" :sm="24">
          <a-form-model-item label="申请组织：" prop="applyDepartment">
            <a-input v-model="queryParams.applyDepartment" placeholder="请输入申请组织"> </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item label="品牌/产地：" prop="address">
            <a-input v-model="queryParams.address" placeholder="请输入品牌/产地"> </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-model-item label="交货期：" prop="time">
            <a-range-picker v-model="queryParams.time" @change="onChangeEndAuditTime" />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :md="24" :sm="24">
          <div class="button">
            <a-button type="primary" @click="ok">查询</a-button>
            <a-button class="reset" @click="reset">重置</a-button>
            <span @click="showMore = !showMore" class="show-more">
              {{ showMore ? '收起' : '展开' }}
              <a-icon :style="{ color: '#ff6b00' }" :type="showMore ? 'up' : 'down'" />
            </span>
          </div>
        </a-col>
      </a-row>
    </a-form-model>
    <!-- 表格  start -->
    <s-table
      ref="afterSaleTable"
      name="afterSaleTable"
      rowKey="id"
      :scroll="{ x: 1000 }"
      :data="getList"
      :columns="columns"
      :row-selection="rowSelection"
    >
      <template v-slot:orderCreateTime="orderCreateTime">
        <span>{{ orderCreateTime | moment('YYYY-MM-DD HH:mm:ss') }}</span>
      </template>
      <template v-slot:active="active, item">
        <a v-if="item.orderStatus === 1030" @click="updateStatusFn(item)">确认</a>
        <a v-if="item.orderStatus === 1040" @click="getSave(item)">审核</a>
      </template>
    </s-table>
    <!-- 表格  end -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      showMore: false,
      queryParams: {},
      layout: {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
      },
      selectRowKeys: [],
      rowSelection: {
        onChange: (selectRowKeys, selectRows) => {
          this.selectRowKeys = selectRowKeys
        }
      },
      columns: [
        {
          title: '物料编码',
          dataIndex: 'code',
          key: 'code',
          width: 200
        },
        {
          title: '物料名称',
          dataIndex: 'name',
          key: 'name',
          width: 200
        },
        {
          title: '规格型号',
          dataIndex: 'materialModel',
          key: 'materialModel',
          width: 200
        },
        {
          title: '单位',
          dataIndex: 'mpMeasurementUnit',
          key: 'mpMeasurementUnit',
          width: 200
        },
        {
          title: '数量',
          dataIndex: 'number',
          key: 'number',
          width: 200
        },
        {
          title: '未税单价(元)',
          dataIndex: 'unitPiceWithout',
          key: 'unitPiceWithout',
          width: 200
        },
        {
          title: '含税单价(元)',
          dataIndex: 'salePriceWithTax',
          key: 'salePriceWithTax',
          width: 200
        },
        {
          title: '未税总价(元)',
          dataIndex: 'priceAmountWith',
          key: 'priceAmountWith',
          width: 200
        },
        {
          title: '含税总价(元)',
          dataIndex: 'orderAmount',
          key: 'orderAmount',
          width: 200
        },
        {
          title: '税率 (%)',
          dataIndex: 'taxRate',
          key: 'taxRate',
          width: 200
        },
        {
          title: '交货期',
          dataIndex: 'deliveryTime',
          key: 'deliveryTime',
          width: 200
        },
        {
          title: '质保期',
          dataIndex: 'orderSourceStr',
          key: 'orderSourceStr',
          width: 200
        },
        // {
        //   title: '品牌产地',
        //   dataIndex: 'orderSourceStr',
        //   key: 'orderSourceStr',
        //   width: 200
        // },
        // {
        //   title: '已发货数量',
        //   dataIndex: 'orderSourceStr',
        //   key: 'orderSourceStr',
        //   width: 200
        // },
        // {
        //   title: '已到货数量',
        //   dataIndex: 'orderSourceStr',
        //   key: 'orderSourceStr',
        //   width: 200
        // },
        // {
        //   title: '已入库数量',
        //   dataIndex: 'orderSourceStr',
        //   key: 'orderSourceStr',
        //   width: 200
        // },
        {
          title: '申请组织',
          dataIndex: 'applyDepartment',
          key: 'applyDepartment',
          width: 200
        },
        {
          title: '使用部门',
          dataIndex: 'useDepartment',
          key: 'useDepartment',
          width: 200
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          width: 200
        },
        {
          title: '合同编号',
          dataIndex: 'contractCode',
          key: 'contractCode',
          width: 200
        }
        // {
        //   title: '平台商品编码',
        //   dataIndex: 'orderSourceStr',
        //   key: 'orderSourceStr',
        //   width: 200
        // },
        // {
        //   title: '商品名称',
        //   dataIndex: 'orderSourceStr',
        //   key: 'orderSourceStr',
        //   width: 200
        // },
        // {
        //   title: '商品型号',
        //   dataIndex: 'orderSourceStr',
        //   key: 'orderSourceStr',
        //   width: 200
        // }
      ]
    }
  },
  methods: {
    resetForm() {
      this.queryParams.startOrderCreateTime = ''
      this.queryParams.endOrderCreateTime = ''
    },
    onChangeEndAuditTime(val, [startTime, endTime]) {
      this.queryParams.startOrderCreateTime = startTime + ' 00:00:00'
      this.queryParams.endOrderCreateTime = endTime + ' 23:59:59'
    },
    ok() {},
    reset() {
      this.$refs.form.resetFields()
      this.resetForm()
    },
    getList() {
      return new Promise((resolve, reject) => {
        resolve({
          data: {
            listObj: [],
            total: 0
          }
        })
      })
    }
  }
}
</script>
<style scoped lang="less">
.button {
  text-align: center;
  margin-top: 20px;
}
.header-title {
  // margin-top: 20px;
  margin-bottom: 20px;
  padding-bottom: 10px;
}
.show-more {
  margin-left: 16px;
  color: #ff6b00;
  font-size: 14px;
}
.form-model {
  margin-bottom: 20px;
}
</style>
