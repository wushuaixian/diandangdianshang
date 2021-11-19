<template>
  <div v-if="form !== null">
    <div class="btns">
      <a-button class="btn" type="primary" v-if="purchaseOrderSource == 1" @click="plan_visible = true">
        计划导入
      </a-button>
      <a-button class="btn" type="primary" v-if="purchaseOrderSource == 3" @click="handleProjectImport">
        项目导入
      </a-button>
      <a-button class="btn" type="primary" v-if="purchaseOrderSource == 4" @click="handleContractImport">
        合同导入
      </a-button>
      <a-button class="btn" type="primary" v-if="purchaseOrderSource == 5" @click="material_visible = true">
        物料池导入
      </a-button>
      <a-button class="btn" type="primary" v-if="purchaseOrderSource == 5" @click="material_file_visible = true">
        物料导入
      </a-button>
    </div>
    <s-table
      :name="`purchasersTables_${purchaseOrderSource}`"
      ref="purchasersTable"
      :list="form.manualOrderItemVOList"
      :customPage="true"
      :scroll="{ x: 2000, y: 460 }"
      :columns="columns"
      @change="hanelChangePage"
    >
      <template v-for="item in inputKeys" :slot="item.key" slot-scope="props">
        <d-slot-fileds
          :type="item.type"
          :min="item.min"
          :max="item.max"
          :length="item.maxLength"
          :floatLength="item.floatLength"
          :disabledDate="item.disabledDate"
          :key="item.key"
          @change="handelChange(props, item.key)"
          v-model="props[item.key]"
        ></d-slot-fileds>
      </template>
      <template v-for="item in inputKeys" :slot="`${item.key}_head`">
        <span class="xing" :key="item.key">{{ item.title }}</span>
      </template>
      <template slot="opera" slot-scope="props, i, index">
        <a-popconfirm
          :getPopupContainer="
            (triggerNode) =>
              triggerNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                .parentNode.parentNode
          "
          ok-text="删除"
          cancel-text="取消"
          @confirm="handleDelLine(index)"
        >
          <template slot="title">
            <div style="width: 160px">确定要删除吗？</div>
          </template>
          <a-button type="link" style="min-width: 0; padding: 0 4px">删除</a-button>
        </a-popconfirm>
      </template>
    </s-table>
    <div class="btns">
      <a-button class="btn" type="primary" v-if="purchaseOrderSource == 5" @click="addLine">
        <a-icon type="plus" />增加一行
      </a-button>
    </div>
    <Plan
      :visible.sync="plan_visible"
      @ok="(list) => ok('PLAN', list)"
      :selectParams="form.manualOrderItemVOList.map((x) => x.purchaseOrderSourceId)"
    />
    <MaterialFile
      v-if="material_file_visible"
      :visible.sync="material_file_visible"
      @ok="(list) => ok('MFILE', list)"
    />
    <Material
      v-if="material_visible"
      :selectParams="form.manualOrderItemVOList.map((x) => x.materialId)"
      :visible.sync="material_visible"
      @ok="(list) => ok('MATERIAL', list)"
    />
    <a-modal :visible="project_visible" :width="1000" @cancel="project_visible = false" title="选择项目" destroyOnClose>
      <template slot="footer">
        <a-button key="back" @click="project_visible = false"> 关闭 </a-button>
      </template>
      <Project
        :form="form"
        @ok="(list) => ok('PROJECT', list)"
        :selectParams="form.manualOrderItemVOList.map((x) => x.purchaseOrderSourceId)"
      />
      <!-- <add-address /> -->
    </a-modal>
    <a-modal
      :visible="contract_visible"
      :width="1000"
      @cancel="contract_visible = false"
      title="选择合同"
      destroyOnClose
    >
      <template slot="footer">
        <a-button key="back" @click="contract_visible = false"> 关闭 </a-button>
      </template>
      <Contract
        :form="form"
        @ok="(list) => ok('CONTRACT', list)"
        :selectParams="form.manualOrderItemVOList.map((x) => x.purchaseOrderSourceId)"
      />
      <!-- <add-address /> -->
    </a-modal>
  </div>
</template>

<script>
import { MaterialModal } from '@/components'
import Enum from '@/components/_util/enum'
import Plan from './import/plan/plan.vue'
import Contract from './import/contract/contract.vue'
import MaterialFile from './import/material/file.vue'
import Material from './import/material/material.vue'
import Project from './import/project/project.vue'
import moment from 'moment'

const list = {
  contractCode: '', // 合同编号
  id: null, // 店铺商品ID
  mpId: null, // 商品ID
  buyerUserId: '', // 采购员ID
  buyerUserName: '', // 采购员
  qualityRetentionPeriod: '', // 质保期
  organization: '', // 申请组织
  department: '', // 使用部门
  planItemCode: '', // 采购计划编码
  planItemId: null, // 采购计划ID
  materialCode: '', // 物料编码
  materialName: '', // 物料名称
  saleAttribute: '', // 型号规格
  brandId: null, // 品牌id
  brandName: '', // 品牌名称
  mainUnitName: '', // 主计量单位名称
  productItemNum: null, // 购买数量
  salePriceWithTax: null, // 商品原始价
  taxRate: null, // 税率
  productTotalAmount: '', // 商品金额
  deliveryTime: null, // 要求到货日期(yyyy-MM-dd HH:mm:ss)
  purchaseOrderSourceId: null, // 采购单来源id 校验扣减数量使用
  purchaseOrderSourceType: null // 采购单来源明细类型  校验扣减数量使用 1 计划待执行 2待下单 3项目(采购待签合同) 4(合同)
}
function SetDateTime(day) {
  let dateTime = new Date()
  dateTime = dateTime.setDate(dateTime.getDate() + day)
  return new Date(dateTime)
}
export default {
  components: { MaterialModal, Contract, MaterialFile, Material, Project, Plan },
  model: {
    prop: 'form',
    event: 'change'
  },
  props: {
    form: {
      type: Object,
      default: null
    }
  },
  created() {
    this.columns = this.customerColumns[this.purchaseOrderSource]
  },
  data() {
    return {
      plan_visible: false,
      contract_visible: false,
      material_visible: false,
      material_file_visible: false,
      project_visible: false,
      current: 0,
      pageSize: 10,
      purchaseOrderSource: Number(this.$route.query.purchaseOrderSource),
      inputKeys: [
        { key: 'materialCode', title: '物料编码', type: Enum.TEXT, maxLength: 100 },
        { key: 'materialName', title: '物料名称', type: Enum.TEXT, maxLength: 100 },
        { key: 'saleAttribute', title: '型号规格', type: Enum.TEXT, maxLength: 500 },
        { key: 'brandName', title: '品牌/产地', type: Enum.TEXT, maxLength: 100 },
        { key: 'mainUnitName', title: '单位', type: Enum.TEXT, maxLength: 100 },
        { key: 'productItemNum', title: '数量', type: Enum.NUMBER, min: 0, max: 99999999, floatLength: 4 },
        { key: 'salePriceWithTax', title: '含税单价 (元)', type: Enum.NUMBER, min: 0, max: 999999999, floatLength: 4 },
        { key: 'taxRate', title: '税率  (%)', type: Enum.NUMBER, min: 0, max: 100, floatLength: 0 },
        { key: 'productTotalAmount', title: '小计 (元)', type: Enum.NUMBER, min: 0, max: 999999999, floatLength: 4 },
        {
          key: 'deliveryTime',
          title: '要求到货日期',
          type: Enum.DATE,
          disabledDate: (current) => {
            return current <= moment().startOf('day')
          }
        },
        { key: 'qualityRetentionPeriod', title: '质保期', type: Enum.NUMBER }
      ],
      customerColumns: {
        1: [
          { title: '采购计划编码', key: 'planItemCode', dataIndex: 'planItemCode' },
          { title: '物料编码', key: 'materialCode', dataIndex: 'materialCode' },
          { title: '物料名称', key: 'materialName', dataIndex: 'materialName' },
          { title: '型号规格', key: 'saleAttribute', dataIndex: 'saleAttribute' },
          { title: '品牌/产地', key: 'brandName', scopedSlots: { customRender: 'brandName' } },
          { title: '单位', key: 'mainUnitName', dataIndex: 'mainUnitName' },
          {
            headerTitle: '数量',
            slots: { title: 'productItemNum_head' },
            key: 'productItemNum',
            scopedSlots: { customRender: 'productItemNum' }
          },
          {
            headerTitle: '含税单价 (元)',
            slots: { title: 'salePriceWithTax_head' },
            key: 'salePriceWithTax',
            scopedSlots: { customRender: 'salePriceWithTax' }
          },
          {
            headerTitle: '税率 (%)',
            slots: { title: 'taxRate_head' },
            key: 'taxRate',
            scopedSlots: { customRender: 'taxRate' }
          },
          { title: '小计 (元)', key: 'productTotalAmount', dataIndex: 'productTotalAmount' },
          { title: '要求到货日期', key: 'deliveryTime', scopedSlots: { customRender: 'deliveryTime' }, width: 160 },
          {
            title: '质保期(月)',
            key: 'qualityRetentionPeriod',
            scopedSlots: { customRender: 'qualityRetentionPeriod' }
          },
          { title: '操作', fixed: 'right', key: 'opera', scopedSlots: { customRender: 'opera' } }
        ],
        3: [
          { title: '采购项目编号', key: 'buyerProjectCode', dataIndex: 'buyerProjectCode' },
          { title: '项目名称', key: 'buyerProjectName', dataIndex: 'buyerProjectName' },
          { title: '物料编码', key: 'materialCode', dataIndex: 'materialCode' },
          { title: '物料名称', key: 'materialName', dataIndex: 'materialName' },
          { title: '型号规格', key: 'saleAttribute', dataIndex: 'saleAttribute' },
          { title: '品牌/产地', key: 'brandName', scopedSlots: { customRender: 'brandName' } },
          { title: '单位', key: 'mainUnitName', dataIndex: 'mainUnitName' },
          {
            title: '质保期(月)',
            key: 'qualityRetentionPeriod',
            scopedSlots: { customRender: 'qualityRetentionPeriod' }
          },
          {
            headerTitle: '数量',
            slots: { title: 'productItemNum_head' },
            key: 'productItemNum',
            scopedSlots: { customRender: 'productItemNum' }
          },
          { title: '含税单价 (元)', key: 'salePriceWithTax', dataIndex: 'salePriceWithTax' },
          { title: '税率 (%)', key: 'taxRate', dataIndex: 'taxRate' },
          { title: '小计 (元)', key: 'productTotalAmount', dataIndex: 'productTotalAmount' },
          { title: '要求到货日期', key: 'deliveryTime', scopedSlots: { customRender: 'deliveryTime' }, width: 160 },
          { title: '操作', fixed: 'right', key: 'opera', scopedSlots: { customRender: 'opera' } }
        ],
        4: [
          { title: '合同编号', key: 'contractCode', dataIndex: 'contractCode' },
          { title: '合同名称', key: 'contractName', dataIndex: 'contractName' },
          { title: '合同类型', key: 'contractTypeName', dataIndex: 'contractTypeName' },
          { title: '物料编码', key: 'materialCode', dataIndex: 'materialCode' },
          { title: '物料名称', key: 'materialName', dataIndex: 'materialName' },
          { title: '型号规格', key: 'saleAttribute', dataIndex: 'saleAttribute' },
          { title: '品牌/产地', key: 'brandName', scopedSlots: { customRender: 'brandName' } },
          { title: '单位', key: 'mainUnitName', dataIndex: 'mainUnitName' },
          {
            headerTitle: '数量',
            slots: { title: 'productItemNum_head' },
            key: 'productItemNum',
            scopedSlots: { customRender: 'productItemNum' }
          },
          { title: '含税单价 (元)', key: 'salePriceWithTax', dataIndex: 'salePriceWithTax' },
          { title: '税率 (%)', key: 'taxRate', dataIndex: 'taxRate' },
          { title: '小计 (元)', key: 'productTotalAmount', dataIndex: 'productTotalAmount' },
          { title: '要求到货日期', key: 'deliveryTime', scopedSlots: { customRender: 'deliveryTime' }, width: 160 },
          {
            title: '质保期(月)',
            key: 'qualityRetentionPeriod',
            width: 170,
            scopedSlots: { customRender: 'qualityRetentionPeriod' }
          },
          { title: '操作', fixed: 'right', key: 'opera', scopedSlots: { customRender: 'opera' } }
        ],
        5: [
          {
            title: '物料编码',
            slots: { title: 'materialCode' },
            key: 'materialCode',
            scopedSlots: { customRender: 'materialCode' }
          },
          {
            headerTitle: '物料名称',
            slots: { title: 'materialName_head' },
            key: 'materialName',
            scopedSlots: { customRender: 'materialName' }
          },
          {
            title: '型号规格',
            slots: { title: 'saleAttribute' },
            key: 'saleAttribute',
            scopedSlots: { customRender: 'saleAttribute' }
          },
          { title: '品牌/产地', key: 'brandName', scopedSlots: { customRender: 'brandName' } },
          {
            headerTitle: '单位',
            slots: { title: 'mainUnitName_head' },
            key: 'mainUnitName',
            scopedSlots: { customRender: 'mainUnitName' }
          },
          {
            headerTitle: '数量',
            slots: { title: 'productItemNum_head' },
            key: 'productItemNum',
            scopedSlots: { customRender: 'productItemNum' }
          },
          {
            headerTitle: '含税单价 (元)',
            slots: { title: 'salePriceWithTax_head' },
            key: 'salePriceWithTax',
            scopedSlots: { customRender: 'salePriceWithTax' }
          },
          {
            headerTitle: '税率 (%)',
            slots: { title: 'taxRate_head' },
            key: 'taxRate',
            scopedSlots: { customRender: 'taxRate' }
          },
          { title: '小计 (元)', key: 'productTotalAmount', dataIndex: 'productTotalAmount' },
          { title: '要求到货日期', key: 'deliveryTime', scopedSlots: { customRender: 'deliveryTime' }, width: 160 },
          {
            title: '质保期(月)',
            key: 'qualityRetentionPeriod',
            scopedSlots: { customRender: 'qualityRetentionPeriod' }
          },
          { title: '操作', fixed: 'right', key: 'opera', scopedSlots: { customRender: 'opera' } }
        ]
      },
      columns: []
    }
  },
  methods: {
    handelChange(item, key) {
      if (['salePriceWithTax', 'productItemNum'].includes(key)) {
        item.productTotalAmount = (Number(item.salePriceWithTax) * Number(item.productItemNum)).toFixed(4)
      }
    },
    ok(type, newList) {
      console.log(newList)
      if (type === 'PLAN') {
        this.form.manualOrderItemVOList.push(
          ...newList.map((x) => ({
            ...list,
            planItemId: x.purchaseOrderSourceType === 1 ? x?.id : x?.buyerPlanItemId,
            buyerUserId: x?.buyerUserId, // 采购员ID
            buyerUserName: x?.buyerUserName, // 采购员
            planItemCode: x?.planItemCode, // 采购计划编码
            materialCode: x?.materialCode, // 物料编码
            materialId: x?.materialId, // 物料ID
            materialName: x?.materialName, // 物料名称
            saleAttribute: x?.materialModel, // 型号规格
            mainUnitName: x?.mpMeasurementUnit, // 主计量单位名称
            productItemNum: x?.executoryNum, // 购买数量
            purchaseOrderSourceId: x?.id,
            purchaseOrderSourceType: x?.purchaseOrderSourceType, // 采购单来源明细类型  校验扣减数量使用 1 计划待执行 2待下单 3项目(采购待签合同) 4(合同)
            qualityRetentionPeriod: x?.qualityRetentionPeriod // 质保期
          }))
        )
      } else if (type === 'PROJECT') {
        this.project_visible = false
        if (
          this.form.manualOrderItemVOList.length > 0 &&
          this.form.manualOrderItemVOList[0].buyerProjectCode === newList[0].buyerProjectCode
        ) {
          this.form.manualOrderItemVOList.push(
            ...newList.map((x) => ({
              ...list,
              planItemId: x?.buyerPlanItemId,
              buyerProjectCode: x?.buyerProjectCode,
              buyerProjectName: x?.buyerProjectName,
              materialCode: x?.materialCode, // 物料编码
              materialId: x?.materialId, // 物料ID
              materialName: x?.materialName, // 物料名称
              saleAttribute: x?.materialModel, // 型号规格
              mainUnitName: x?.mpMeasurementUnit, // 主计量单位名称
              productItemNum: x?.executoryNum, // 购买数量
              purchaseOrderSourceId: x?.id,
              purchaseOrderSourceType: 3,
              taxRate: x?.taxRate || 0, // 税率
              salePriceWithTax: x?.priceWithTax || 0, // 含税单价
              productTotalAmount: (x?.priceWithTax || 0) * (x?.executoryNum || 0), // 小计
              flag: true, // 合同、项目下单需要传入
              providerMerchantId: this.form.merchantId, // 合同、项目下单需要传入
              qualityRetentionPeriod: x?.guaranteePeriod, // 质保期
              deliveryTime: x?.contractType === 1 ? moment(SetDateTime(x?.deliveryDays || 0)) : undefined
            }))
          )
        } else {
          this.form.manualOrderItemVOList = newList.map((x) => ({
            ...list,
            planItemId: x?.buyerPlanItemId,
            buyerProjectCode: x?.buyerProjectCode,
            buyerProjectName: x?.buyerProjectName,
            materialCode: x?.materialCode, // 物料编码
            materialId: x?.materialId, // 物料ID
            materialName: x?.materialName, // 物料名称
            saleAttribute: x?.materialModel, // 型号规格
            mainUnitName: x?.mpMeasurementUnit, // 主计量单位名称
            productItemNum: x?.executoryNum, // 购买数量
            purchaseOrderSourceId: x?.id,
            purchaseOrderSourceType: 3,
            taxRate: x?.taxRate || 0, // 税率
            salePriceWithTax: x?.priceWithTax || 0, // 含税单价
            productTotalAmount: (x?.priceWithTax || 0) * (x?.executoryNum || 0), // 小计
            flag: true, // 合同、项目下单需要传入
            providerMerchantId: this.form.merchantId, // 合同、项目下单需要传入
            qualityRetentionPeriod: x?.guaranteePeriod, // 质保期
            deliveryTime: x?.contractType === 1 ? moment(SetDateTime(x?.deliveryDays || 0)) : undefined
          }))
        }
      } else if (type === 'CONTRACT') {
        this.contract_visible = false
        if (
          this.form.manualOrderItemVOList.length > 0 &&
          this.form.manualOrderItemVOList[0].contractCode === newList[0].contractCode
        ) {
          this.form.manualOrderItemVOList.push(
            ...newList.map((x) => ({
              ...list,
              contractCode: x?.contractCode,
              contractName: x?.contractName,
              contractType: x?.contractType,
              contractTypeName: x?.contractTypeName,
              planItemId: x?.buyerPlanItemId,
              materialCode: x?.materialCode, // 物料编码
              materialId: x?.materialId, // 物料ID
              materialName: x?.materialName, // 物料名称
              saleAttribute: x?.materialModel, // 型号规格
              mainUnitName: x?.mpMeasurementUnit, // 主计量单位名称
              productItemNum: x?.executoryNum, // 购买数量
              taxRate: x?.taxRate, // 税率
              salePriceWithTax: x?.priceWithTax, // 含税单价
              productTotalAmount: x?.taxAmount, // 小计
              brandName: x?.manufacturer, // 品牌名称
              purchaseOrderSourceId: x?.id,
              deliveryTime: x?.deliveryTime,
              purchaseOrderSourceType: 4,
              remark: x?.remark, // 备注
              planItemCode: x?.planItemCode, // 计划编码
              organization: x?.applyDepartment, // 申请组织
              department: x?.useDepartment, // 使用部门
              flag: true, // 合同、项目下单需要传入
              providerMerchantId: this.form.merchantId, // 合同、项目下单需要传入
              qualityRetentionPeriod: x?.ext1Info // 质保期
            }))
          )
        } else {
          this.form.manualOrderItemVOList = newList.map((x) => ({
            ...list,
            contractCode: x?.contractCode,
            contractName: x?.contractName,
            contractType: x?.contractType,
            contractTypeName: x?.contractTypeName,
            planItemId: x?.buyerPlanItemId,
            materialCode: x?.materialCode, // 物料编码
            materialId: x?.materialId, // 物料ID
            materialName: x?.materialName, // 物料名称
            saleAttribute: x?.materialModel, // 型号规格
            mainUnitName: x?.mpMeasurementUnit, // 主计量单位名称
            productItemNum: x?.executoryNum, // 购买数量
            taxRate: x?.taxRate, // 税率
            salePriceWithTax: x?.priceWithTax, // 含税单价
            productTotalAmount: x?.taxAmount, // 小计
            brandName: x?.manufacturer, // 品牌名称
            purchaseOrderSourceId: x?.id,
            deliveryTime: x?.deliveryTime,
            purchaseOrderSourceType: 4,
            remark: x?.remark, // 备注
            planItemCode: x?.planItemCode, // 计划编码
            organization: x?.applyDepartment, // 申请组织
            department: x?.useDepartment, // 使用部门
            flag: true, // 合同、项目下单需要传入
            providerMerchantId: this.form.merchantId, // 合同、项目下单需要传入
            qualityRetentionPeriod: x?.ext1Info // 质保期
          }))
        }
      } else if (type === 'MFILE') {
        // 物料导入
        this.material_file_visible = false
        this.form.manualOrderItemVOList = newList.map((x) => ({
          ...list,
          materialCode: x?.materialCode, // 物料编码
          materialName: x?.materialName, // 物料名称
          saleAttribute: x?.saleAttribute, // 型号规格
          brandName: x?.brandName, // 品牌
          mainUnitName: x?.mainUnitName, // 单位
          productItemNum: x?.productItemNum, // 数量
          salePriceWithTax: x?.salePriceWithTax, // 含税单价
          productTotalAmount: x?.salePriceWithTax * x?.productItemNum, // 含税单价
          taxRate: x?.taxRate, // 税率
          deliveryTime: x?.materialTime ? moment(x.materialTime) : null,
          purchaseOrderSourceType: 5,
          qualityRetentionPeriod: x?.qualityRetentionPeriod // 质保期
        }))
      } else if (type === 'MATERIAL') {
        // 物料池导入
        this.material_visible = false
        this.form.manualOrderItemVOList.push(
          ...newList.map((x) => ({
            ...list,
            buyerUserId: x?.buyerUserId,
            materialCode: x?.code, // 物料编码
            materialId: x?.id, // 物料ID
            materialName: x?.name, // 物料名称
            saleAttribute: x?.materialModel, // 型号规格
            mainUnitName: x?.mpMeasurementUnit, // 主计量单位名称
            purchaseOrderSourceId: x?.id,
            purchaseOrderSourceType: 5,
            qualityRetentionPeriod: x?.qualityRetentionPeriod // 质保期
          }))
        )
      }
    },
    addLine() {
      this.form.manualOrderItemVOList.push({ ...list, purchaseOrderSourceType: 5 })
    },
    hanelChangePage(pagination) {
      console.log(pagination.pagination)
      this.current = Number(pagination.pagination.current) - 1
      this.pageSize = Number(pagination.pagination.pageSize)
    },
    handleDelLine(index) {
      index = index + this.pageSize * this.current
      this.form.manualOrderItemVOList.splice(index, 1)
    },
    handleProjectImport() {
      const { merchantId } = this.form
      if (!merchantId) {
        this.$message.warning('请选择供应商!')
        return
      }
      this.project_visible = true
    },
    handleContractImport() {
      const { merchantId } = this.form
      if (!merchantId) {
        this.$message.warning('请选择供应商!')
        return
      }
      this.contract_visible = true
    }
  }
}
</script>

<style lang="less" scoped>
.btns {
  margin: 16px 0;
  .btn {
    margin-right: 8px;
  }
}
.s-table {
  .xing {
    display: flex;
    align-items: center;
    &::before {
      content: '*';
      color: red;
      margin-right: 5px;
    }
  }
}
</style>
