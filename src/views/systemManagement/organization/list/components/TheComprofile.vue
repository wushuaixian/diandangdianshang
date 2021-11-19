<template>
  <div class="the-comprofile">
    <header-title>
      <span>企业基本资质</span>
    </header-title>
    <div class="form">
      <a-form-model :label-col="{ span: 4 }" :model="queryParams" :wrapper-col="{ span: 8 }">
        <a-form-model-item label="企业性质" v-if="queryParams.enterpriseProperty">
          {{ queryParams.enterpriseProperty === '1' ? '生产商' : '贸易商' }}
        </a-form-model-item>
        <a-form-model-item label="人员规模（人）" prop="staffAmount">
          <!-- {{ form.staffAmount }} -->
          <a-input :disabled="edit" v-model="queryParams.staffAmount" />
        </a-form-model-item>
        <a-form-model-item label="办公，厂房总面积（㎡）" prop="plantArea">
          <!-- {{ form.plantArea }} -->
          <a-input :disabled="edit" v-model="queryParams.plantArea" />
        </a-form-model-item>
        <a-form-model-item label="办公地址">
          <!-- {{ queryParams.officeAdressProvince }} {{ queryParams.officeAdressCity }} {{ queryParams.officeAdressArea }} -->
          <AreaSelect :disabled="edit" v-model="area" :selected.sync="areaCode"></AreaSelect>
        </a-form-model-item>
        <a-form-model-item label="详细地址">
          <!-- {{ form.officeAdressDetail }} -->
          <a-input :disabled="edit" v-model="queryParams.officeAdressDetail" />
        </a-form-model-item>
        <a-form-model-item label="所属集团">
          <!-- {{ form.membershipGroup }} -->
          <a-input :disabled="edit" v-model="queryParams.membershipGroup" />
        </a-form-model-item>
        <a-form-model-item label="公司官网">
          <!-- {{ form.companyWebsiteUrl }} -->
          <a-input :disabled="edit" v-model="queryParams.companyWebsiteUrl" />
        </a-form-model-item>
        <a-form-model-item label="土地性质">
          {{ queryParams.landUseStatus === '0' ? '租赁' : '自有' }}
        </a-form-model-item>
        <a-form-model-item label="土地证明">
          <ImagePreview :value="queryParams.landCertificateUrl" />
        </a-form-model-item>
        <a-form-model-item label="公司电话" prop="companyPhone">
          <!-- {{ form.companyPhone }} -->
          <a-input :disabled="edit" v-model="queryParams.companyPhone" />
        </a-form-model-item>
        <a-form-model-item label="公司传真" prop="companyFax">
          <!-- {{ form.companyFax }} -->
          <a-input :disabled="edit" v-model="queryParams.companyFax" />
        </a-form-model-item>
      </a-form-model>
      <div v-if="queryParams.enterpriseProperty === '1'">
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
          :showPagination="false"
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
      <swiper-list
        class="imgs-list"
        :list="queryParams.companyPictureInfoPOList"
        :width="200"
        v-slot:default="{ item }"
      >
        <img
          :src="$$(item, 'photoUrl')"
          :width="200"
          :height="152"
          @click="handlePreivew(queryParams.companyPictureInfoPOList, item.id)"
        />
      </swiper-list>

      <header-title>
        <span>历史业绩发票照片</span>
      </header-title>
      <swiper-list
        class="imgs-list"
        :list="queryParams.historyPerfBillPhotoInfoPOList"
        :width="200"
        v-slot:default="{ item }"
      >
        <img
          :src="$$(item, 'photoUrl')"
          :width="200"
          :height="152"
          @click="handlePreivew(queryParams.historyPerfBillPhotoInfoPOList, item.id)"
        />
      </swiper-list>
      <header-title>
        <span>历史业绩合同照片</span>
      </header-title>
      <swiper-list
        class="imgs-list"
        :list="queryParams.historyPerfContractPhotoInfoPOList"
        :width="200"
        v-slot:default="{ item }"
      >
        <img
          :src="$$(item, 'photoUrl')"
          :width="200"
          :height="152"
          @click="handlePreivew(queryParams.historyPerfContractPhotoInfoPOList, item.id)"
        />
      </swiper-list>
    </div>
    <ImagePreview :isThumbnail="false" ref="preview" />

    <div class="class-btn">
      <a-button class="save-btn" type="primary" v-if="!edit">保存</a-button>
      <a-button @click="$router.back()">返回</a-button>
    </div>
  </div>
</template>

<script>
import { AreaSelect, ImagePreview, SwiperList } from '@/components/'
import { equipmentInventoryPage, productCapacityPage, enterpriseBasicDetail } from '@/api/supplier'
export default {
  components: { AreaSelect, ImagePreview, SwiperList },
  props: {
    // form: {
    //   type: Object,
    //   default: () => {}
    // },
    edit: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      area: [],
      areaCode: [],
      id: this.$route.params?.id,
      queryParams: {}
    }
  },
  mounted() {
    this.getEnterpriseBasicDetail()
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
      const result = await enterpriseBasicDetail({ merchantId, ...params })
      this.queryParams = result.data
      // console.log(result)
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
