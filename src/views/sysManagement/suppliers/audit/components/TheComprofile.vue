<template>
  <div class="the-comprofile">
    <header-title>
      <span>企业基本资质</span>
    </header-title>
    <div class="form">
      <a-form-model :label-col="{ span: 4 }" :model="form" :wrapper-col="{ span: 8 }">
        <a-form-model-item label="企业性质">
          {{ form.enterpriseProperty === '1' ? '生产商' : '贸易商' }}
        </a-form-model-item>
        <a-form-model-item label="人员规模（人）" prop="staffAmount">
          {{ form.staffAmount }}
        </a-form-model-item>
        <a-form-model-item label="办公，厂房总面积（㎡）" prop="plantArea">
          {{ form.plantArea }}
        </a-form-model-item>
        <a-form-model-item label="办公地址">
          {{ form.officeAdressProvince }} {{ form.officeAdressCity }} {{ form.officeAdressArea }}
        </a-form-model-item>
        <a-form-model-item label="详细地址">
          {{ form.officeAdressDetail }}
        </a-form-model-item>
        <a-form-model-item label="所属集团">
          {{ form.membershipGroup }}
        </a-form-model-item>
        <a-form-model-item label="公司官网">
          {{ form.companyWebsiteUrl }}
        </a-form-model-item>
        <a-form-model-item label="土地性质">
          {{ form.landUseStatus === '0' ? '租赁' : '自有' }}
        </a-form-model-item>
        <a-form-model-item label="土地证明">
          <ImagePreview :value="form.landCertificateUrl" />
        </a-form-model-item>
        <a-form-model-item label="公司电话" prop="companyPhone">
          {{ form.companyPhone }}
        </a-form-model-item>
        <a-form-model-item label="公司传真" prop="companyFax">
          {{ form.companyFax }}
        </a-form-model-item>
        <a-form-model-item label="企业概况">
          {{ form.enterpriseOverview }}
        </a-form-model-item>
      </a-form-model>
      <div v-if="form.enterpriseProperty === '1'">
        <header-title>
          <span>设备清单</span>
        </header-title>
        <s-table
          name="TheComprofileTable"
          :data="getEquipmentInventoryPage"
          :columns="[
            { title: '设备名称', dataIndex: 'equipmentName', scopedSlots: { customRender: 'equipmentName' } },
            { title: '品牌', dataIndex: 'brand', scopedSlots: { customRender: 'brand' } },
            { title: '型号', dataIndex: 'model', scopedSlots: { customRender: 'model' } },
            { title: '数量', dataIndex: 'number', scopedSlots: { customRender: 'number' } },
            { title: '使用年限', dataIndex: 'durableYears', scopedSlots: { customRender: 'durableYears' } }
          ]"
        ></s-table>
        <header-title>
          <span>生产产值</span>
        </header-title>
        <s-table
          name="TheComprofileTable1"
          :data="getProductCapacityPage"
          :columns="[
            { title: '产品名称', dataIndex: 'productName', scopedSlots: { customRender: 'productName' } },
            // { title: '月产值(万元)', dataIndex: 'monthlyCapacity', scopedSlots: { customRender: 'monthlyCapacity' } },
            { title: '年产值(万元)', dataIndex: 'yearCapacity', scopedSlots: { customRender: 'yearCapacity' } }
          ]"
        ></s-table>
      </div>
      <div v-else>
        <header-title>
          <span>库存金额</span>
        </header-title>
        <s-table
          name="TheComprofileTable2"
          :data="getEnterpriseBasicDetail"
          :columns="[
            { title: '产品名称', dataIndex: 'productName', scopedSlots: { customRender: 'productName' } },
            { title: '库存金额(万元)', dataIndex: 'brand', scopedSlots: { customRender: 'brand' } }
          ]"
        ></s-table>
      </div>
      <header-title>
        <span>办公照片</span>
      </header-title>
      <swiper-list class="imgs-list" :list="form.companyPictureInfoPOList" :width="200" v-slot:default="{ item }">
        <img
          :src="$$(item, 'photoUrl')"
          :width="200"
          :height="152"
          @click="handlePreivew(form.companyPictureInfoPOList, item.id)"
        />
      </swiper-list>

      <header-title>
        <span>历史业绩发票照片</span>
      </header-title>
      <swiper-list class="imgs-list" :list="form.historyPerfBillPhotoInfoPOList" :width="200" v-slot:default="{ item }">
        <img
          :src="$$(item, 'photoUrl')"
          :width="200"
          :height="152"
          @click="handlePreivew(form.historyPerfBillPhotoInfoPOList, item.id)"
        />
      </swiper-list>
      <header-title>
        <span>历史业绩合同照片</span>
      </header-title>
      <swiper-list
        class="imgs-list"
        :list="form.historyPerfContractPhotoInfoPOList"
        :width="200"
        v-slot:default="{ item }"
      >
        <img
          :src="$$(item, 'photoUrl')"
          :width="200"
          :height="152"
          @click="handlePreivew(form.historyPerfContractPhotoInfoPOList, item.id)"
        />
      </swiper-list>
    </div>
    <ImagePreview :isThumbnail="false" ref="preview" />
  </div>
</template>

<script>
import { AreaSelect, ImagePreview, SwiperList } from '@/components/'
import { equipmentInventoryPage, productCapacityPage, inventoryCapacityInfoPage } from '@/api/supplier'
export default {
  components: { AreaSelect, ImagePreview, SwiperList },
  props: {
    form: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      area: [],
      areaCode: [],
      id: this.$route.params?.id
    }
  },
  methods: {
    async getEquipmentInventoryPage(params) {
      const { id: merchantId } = this
      return equipmentInventoryPage({ merchantId, ...params })
    },
    async getProductCapacityPage(params) {
      const { id: merchantId } = this
      return productCapacityPage({ merchantId, ...params })
    },
    async getEnterpriseBasicDetail(params) {
      const { id: merchantId } = this
      return inventoryCapacityInfoPage({ merchantId, ...params })
    },
    handlePreivew(list, value) {
      const index = list.findIndex((x) => x.id === value)
      this.$refs.preview.customShow(
        list.map((x) => x.photoUrl),
        index
      )
    }
  }
}
</script>

<style lang="less" scoped>
.the-comprofile {
  .form {
    margin-top: 20px;
  }
  .imgs-list {
    margin: 24px 0 40px 0;
  }
}
</style>
