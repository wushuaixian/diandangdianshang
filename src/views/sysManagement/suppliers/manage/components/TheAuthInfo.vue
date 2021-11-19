<template>
  <div class="mid" ref="container">
    <a-affix :offset-top="80" :target="() => this.$refs.container" :class="{ affix: scrollTop > 100 }">
      <header>
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
    <div class="header">
      <a-card :bordered="false">
        <header-title id="Factory">
          <span>验厂信息</span>
        </header-title>
        <a-form :form="form">
          <a-form-item label="验厂机构" :labelCol="apart" :wrapperCol="format">
            <span>{{ datalist.factoryAuditOrg }}</span>
          </a-form-item>
          <a-form-item label="预计验厂时间" :labelCol="apart" :wrapperCol="format">
            <span>{{ datalist.expectFactoryAuditTime | moment }}</span>
          </a-form-item>
          <a-form-item label="验厂工单号" :labelCol="apart" :wrapperCol="format">
            <span>{{ datalist.factoryAuditNo }}</span>
          </a-form-item>
          <a-form-item label="实际验厂时间" :labelCol="apart" :wrapperCol="format">
            <span>{{ datalist.realFactoryAuditTime | moment }}</span>
          </a-form-item>
          <a-form-item label="企业性质" :labelCol="apart" :wrapperCol="format" :required="false">
            <span v-if="datalist.enterpriseNature === '1'">生产商</span>
            <span v-if="datalist.enterpriseNature === '2'">贸易商</span>
          </a-form-item>
          <a-form-item label="综合评分" :labelCol="apart" :wrapperCol="format">
            <span>{{ datalist.compositeScore }}</span>
          </a-form-item>
          <a-form-item
            :label="datalist.enterpriseNature === '1' ? '设备评分' : '库存评分'"
            :labelCol="apart"
            :wrapperCol="format"
          >
            <span>{{ datalist.deviceScore }}</span>
          </a-form-item>
          <!-- <a-form-item label="主营品类" :labelCol="apart" :wrapperCol="format">
            <tree-select disabled :collapseTags="false" v-model="datalist.enterpriseNature"></tree-select>
          </a-form-item> -->
          <a-form-item label="主营品类" :labelCol="apart" :wrapperCol="format">
            <tree-select
              disabled
              :collapseTags="false"
              :normalizer="normalizer"
              :options="categoryList"
              v-model="datalistsupplierbusiness.categoryId"
            ></tree-select>
          </a-form-item>
          <a-form-item label="验厂报告" :labelCol="apart" :wrapperCol="format">
            <!-- <img class="avatar" :src="datalist.factoryAuditReportUrl" /> -->
            <ImagePreview :value="datalist.factoryAuditReportUrl" />
            <a-button
              v-if="datalist.factoryAuditReportUrl"
              class="btn"
              type="primary"
              size="large"
              @click="handlePreviewVr"
            >
              查看VR
            </a-button>
          </a-form-item>
          <a-form-item label="vr地址" :labelCol="apart" :wrapperCol="{ lg: { span: 13 }, sm: { span: 20 } }">
            <div class="vr" v-if="datalist.coverUrl">
              <img class="vrImg" @click="handlePreviewVr" :src="datalist.coverUrl" />
            </div>
          </a-form-item>
          <a-form-item label="考察结果说明" :labelCol="apart" :wrapperCol="format">
            <span>{{ datalist.remark }}</span>
          </a-form-item>
        </a-form>
      </a-card>
      <a-card type="inner" :bordered="false">
        <header-title id="BusinessInfo">
          <span>工商信息</span>
        </header-title>
        <a-form :form="form" style="margin-top: 20px">
          <a-form-item label="营业执照" :labelCol="apart" :wrapperCol="format">
            <!-- <img class="avatar" :src="datalistsupplierbusiness.businessLicenceUrl" /> -->
            <ImagePreview :value="datalistsupplierbusiness.businessLicenceUrl" />
          </a-form-item>
          <a-form-item label="授权委托书" :labelCol="apart" :wrapperCol="format" style="margin-top: 10px">
            <!-- <img class="avatar" :src="datalistsupplierbusiness.powerOfAttorneyUrl" /> -->
            <ImagePreview :value="datalistsupplierbusiness.powerOfAttorneyUrl" />
          </a-form-item>
          <a-form-item label="企业名称" :labelCol="apart" :wrapperCol="format">
            <span>{{ datalistsupplierbusiness.enterpriseName }}</span>
          </a-form-item>
          <a-form-item label="统一社会信用代码" :labelCol="apart" :wrapperCol="format">
            <span>{{ datalistsupplierbusiness.businessLicenceNo }}</span>
          </a-form-item>
          <a-form-item label="公司类型" :labelCol="apart" :wrapperCol="format">
            <span>{{ datalistsupplierbusiness.enterpriseType }}</span>
          </a-form-item>
          <a-form-item label="成立日期" :labelCol="apart" :wrapperCol="format">
            <span>{{ datalistsupplierbusiness.businessLicencePeriodBegin | moment }}</span>
          </a-form-item>
          <a-form-item label="截止日期" :labelCol="apart" :wrapperCol="format">
            <span>{{ datalistsupplierbusiness.businessLicencePeriodEnd | moment }}</span>
          </a-form-item>
          <a-form-item label="注册资金" :labelCol="apart" :wrapperCol="format">
            <span>{{ datalistsupplierbusiness.registeredCapital }}</span>
          </a-form-item>
          <!-- <a-form-item label="注册币种" :labelCol="apart" :wrapperCol="format">
            <span>{{ datalistsupplierbusiness.currency }}</span>
          </a-form-item> -->
          <a-form-item label="经营范围" :labelCol="apart" :wrapperCol="format">
            <span>{{ datalistsupplierbusiness.businessScope }}</span>
          </a-form-item>
          <a-form-item label="注册地" :labelCol="apart" :wrapperCol="format">
            <!-- {{ datalistsupplierbusiness.registrationSplicing }} -->
            {{ datalistsupplierbusiness.registeredProvinceName }}

            {{ datalistsupplierbusiness.registeredCityName }}

            {{ datalistsupplierbusiness.registeredRegionName }}
          </a-form-item>
          <a-form-item label="详细地址" :labelCol="apart" :wrapperCol="format">
            <span>{{ datalistsupplierbusiness.registeredDetailAddress }}</span>
          </a-form-item>
        </a-form>
      </a-card>
      <a-card type="inner" :bordered="false">
        <header-title id="Review">
          <span>综合评审情况</span>
        </header-title>
        <s-table ref="table" name="TheAuthInfoTable1" :data="init" :columns="goodsColumns"> </s-table>
      </a-card>
      <a-card type="inner" :bordered="false">
        <header-title id="AuditClause">
          <span>审核条款</span>
        </header-title>
        <div class="p-l20">
          <header-title class="header-title mt-10">
            <span>{{ baseList.headName }}</span>
          </header-title>
          <a-table :columns="base" :data-source="baseList.items" :pagination="false" rowKey="id"> </a-table>
          <header-title class="header-title mt-10">
            <span>{{ qualityList.headName }}</span>
          </header-title>
          <a-table :columns="quality" :data-source="qualityList.items" :pagination="false" rowKey="id"> </a-table>
          <header-title class="header-title mt-10">
            <span>{{ researchList.headName }}</span>
          </header-title>
          <a-table :columns="research" :data-source="researchList.items" :pagination="false" rowKey="id"> </a-table>
          <header-title class="header-title mt-10">
            <span>{{ productList.headName }}</span>
          </header-title>
          <a-table :columns="product" :data-source="productList.items" :pagination="false" rowKey="id"> </a-table>
          <header-title class="header-title mt-10">
            <span>{{ saleList.headName }}</span>
          </header-title>
          <a-table :columns="sale" :data-source="saleList.items" :pagination="false" rowKey="id"> </a-table>
        </div>
      </a-card>
      <a-card type="inner" :bordered="false">
        <header-title id="Qualification">
          <span>企业基本资质</span>
        </header-title>
        <a-form :form="form">
          <a-form-item label="所属集团" :labelCol="apart" :wrapperCol="format">
            <span>{{ datalist.membershipGroup }}</span>
          </a-form-item>
          <!-- <a-form-item label="营业执照编号" :labelCol="apart" :wrapperCol="format">
            <span>{{ datalist.businessLicenseNo }}</span>
          </a-form-item> -->
          <a-form-item label="认证注册地址" :labelCol="apart" :wrapperCol="format">
            <span>{{ datalist.officeAdressDetail }}</span>
          </a-form-item>
          <a-form-item label="认证经营范围" :labelCol="apart" :wrapperCol="format">
            <span>{{ datalist.scope }}</span>
          </a-form-item>
          <a-form-item label="总建筑面积" :labelCol="apart" :wrapperCol="format">
            <span>{{ datalist.plantArea }}</span>
          </a-form-item>
          <a-form-item label="占地性质" :labelCol="apart" :wrapperCol="format" :required="false">
            <span v-if="datalist.landUseStatus === '0'">租赁</span>
            <span v-if="datalist.landUseStatus === '1'">自有</span>
          </a-form-item>
          <a-form-item label="是否有研发部门" :labelCol="apart" :wrapperCol="format" :required="false">
            <span v-if="datalist.isDeveloper === '1'">是</span>
            <span v-if="datalist.isDeveloper === '2'">否</span>
          </a-form-item>
          <a-form-item label="研发人数" :labelCol="apart" :wrapperCol="format">
            <span>{{ datalist.staffAmount }}</span>
          </a-form-item>
          <a-form-item label="营业执照" :labelCol="apart" :wrapperCol="format">
            <!-- <img class="avatar" :src="datalist.businessLicenseUrl" /> -->
            <ImagePreview :value="datalist.businessLicenseUrl" />
          </a-form-item>
        </a-form>
      </a-card>
      <a-card type="inner" :bordered="false" class="table-list">
        <header-title id="Relation">
          <span>关联企业</span>
        </header-title>
        <s-table ref="TheAuthInfoTable2" :data="initEnterprises" name="TheAuthInfoTable2" :columns="columns">
          <template slot="enterpriseProveUrl" slot-scope="enterpriseProveUrl">
            <ImagePreview :width="50" :height="40" :value="enterpriseProveUrl" />
          </template>
        </s-table>
        <div v-if="datalist.enterpriseNature === '1'">
          <div></div>
          <header-title id="quipmentInventoryCheckInfo">
            <span>设备清单</span>
          </header-title>
          <s-table :data="initEquipment" name="TheAuthInfoTable3" :columns="equipmentcolumns"> </s-table>
          <header-title id="productCapacityCheckInfo">
            <span>生产产能</span>
          </header-title>
          <s-table :data="initpage" ref="TheAuthInfoTable4" name="TheAuthInfoTable4" :columns="capacitycolumns">
          </s-table>
        </div>
        <div v-else>
          <header-title id="Stock">
            <span>库存金额</span>
          </header-title>
          <s-table :data="initList" name="TheAuthInfoTable5" :columns="columns2"> </s-table>
        </div>
      </a-card>
      <a-card type="inner" :bordered="false">
        <header-title id="Files">
          <span>资质附件</span>
        </header-title>
        <div class="files-main">
          <swiper-list
            v-if="$$(datalist, 'businessProductInfoPOList') && datalist.businessProductInfoPOList.length > 0"
            :list="datalist.businessProductInfoPOList"
            :width="236"
            v-slot:default="{ item }"
          >
            <div class="img-box">
              <ImagePreview :value="item.certificateUrl" :width="236" :height="169" />
              <div class="content">
                <div class="title">
                  <div class="name">{{ item.certificateType }}</div>
                  <div class="state" v-if="item.certificationStatus === '0'">未认证</div>
                  <div class="state" v-else>已认证</div>
                </div>
                <div class="endtime">有效期至：{{ item.issueEndTime | moment }}</div>
              </div>
            </div>
          </swiper-list>
          <a-empty v-else />
        </div>
        <header-title id="PatentPic">
          <span>销售业绩照片 </span>
        </header-title>
        <div class="files-mains">
          <swiper-list
            v-if="$$(datalist, 'companyPerformanceInfoPOList') && datalist.companyPerformanceInfoPOList.length > 0"
            :list="datalist.companyPerformanceInfoPOList"
            :width="236"
            v-slot:default="{ item }"
          >
            <div class="img-box-box">
              <ImagePreview :value="item.photoUrl" :width="200" :height="152" />
            </div>
          </swiper-list>
          <a-empty v-else />
        </div>
        <header-title id="PatentPic">
          <span>专利照片</span>
        </header-title>
        <div class="files-mains">
          <swiper-list
            v-if="$$(datalist, 'patentPictureInfoPOList') && datalist.patentPictureInfoPOList.length > 0"
            :list="datalist.patentPictureInfoPOList"
            :width="236"
            v-slot:default="{ item }"
          >
            <div class="img-box-box">
              <ImagePreview :value="item.photoUrl" :width="200" :height="152" />
            </div>
          </swiper-list>
          <a-empty v-else />
        </div>
        <header-title id="WorkPic">
          <span>办公照片</span>
        </header-title>
        <div class="files-mains">
          <swiper-list
            v-if="$$(datalist, 'companyPictureCheckInfoPOList') && datalist.companyPictureCheckInfoPOList.length > 0"
            :list="datalist.companyPictureCheckInfoPOList"
            v-slot:default="{ item }"
          >
            <div class="img-box-box">
              <ImagePreview :value="item.photoUrl" :width="200" :height="152" />
            </div>
          </swiper-list>
          <a-empty v-else />
        </div>
        <header-title id="WorkshopPic">
          <span>车间/厂房/库房照片</span>
        </header-title>
        <div class="files-mains">
          <swiper-list
            v-if="$$(datalist, 'workshopPictureInfoPOList') && datalist.workshopPictureInfoPOList.length > 0"
            :list="datalist.workshopPictureInfoPOList"
            v-slot:default="{ item }"
          >
            <div class="img-box-box">
              <ImagePreview :value="item.photoUrl" :width="200" :height="152" />
            </div>
          </swiper-list>
          <a-empty v-else />
        </div>
      </a-card>
      <!-- <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
        <header-title>
          <span>企业VR</span>
        </header-title>
        <img class="vrimgs" :src="datalist.vrUrl" />
        <s-table ref="table" :data="nesscate" :columns="management">
          <template slot="isMaincategory" slot-scope="isMaincategory">
            <span v-show="isMaincategory == 1">是</span>
            <span v-show="isMaincategory == 0">否</span>
          </template>
          <template slot="authStatus" slot-scope="authStatus, text">
            <span v-show="authStatus === '1'">待审核</span>
            <span v-show="authStatus === '2'"> 审核通过 </span>
            <span v-show="authStatus == 3">
              审核不通过
              <a-tooltip placement="top">
                <template slot="title">
                  <span>拒绝原因:{{ text.message }} <br /></span>
                </template>
                <a-icon type="question-circle" placement="top" />
              </a-tooltip>
            </span>
          </template>
        </s-table>
        <s-table ref="table" :data="category" :columns="qualification">
          <template slot="issueBeginTime" slot-scope="issueBeginTime">
            <span>{{ issueBeginTime | moment }}</span>
          </template>
          <template slot="issueEndTime" slot-scope="issueEndTime">
            <span>{{ issueEndTime | moment }}</span>
          </template>
        </s-table>
      </a-card> -->
    </div>
  </div>
</template>
<script>
import {
  supplierAuditListterprises,
  supplieraffiliatedenterprise,
  supplierEquipment,
  supplierpage,
  supplierDetailo,
  supplieraudits,
  supplierbusinessNew,
  productCapacityPage
} from '@/api/supplier'
import { qualificationCertificate, businessCategory, reviewListAll } from '@/api/supplieAuthAdmin'
import * as userAPI from '@/api/user.js'
import Popup from '@/components/Popup/ExaminePopup.vue'
import { submitExamine } from '@/api/accessAudit'
import swiperList from '@/components/SwiperList/swiperList.vue'
import ImagePreview from '@/components/ImagePreview'
var apart = { lg: { span: 5 }, sm: { span: 7 } }
var format = { lg: { span: 10 }, sm: { span: 17 } }
const columns = [
  {
    title: '序号',
    dataIndex: 'index'
  },
  {
    title: '企业名称',
    dataIndex: 'enterpriseName',
    scopedSlots: { customRender: 'enterpriseName' }
  },
  {
    title: '关联证明',
    dataIndex: 'enterpriseProveUrl',
    scopedSlots: { customRender: 'enterpriseProveUrl' }
  }
]
const equipmentcolumns = [
  {
    title: '序号',
    dataIndex: 'index'
  },
  {
    title: '设备名称',
    dataIndex: 'equipmentName',
    scopedSlots: { customRender: 'equipmentName' }
  },
  {
    title: '品牌',
    dataIndex: 'brand',
    scopedSlots: { customRender: 'brand' }
  },
  {
    title: '型号',
    dataIndex: 'model',
    scopedSlots: { customRender: 'model' }
  },
  {
    title: '数量',
    dataIndex: 'number',
    scopedSlots: { customRender: 'number' }
  },
  {
    title: '使用年限',
    dataIndex: 'durableYears',
    scopedSlots: { customRender: 'durableYears' }
  }
]
const capacitycolumns = [
  {
    title: '序号',
    dataIndex: 'index'
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
    scopedSlots: { customRender: 'productName' }
  },
  // {
  //   title: '月产能',
  //   dataIndex: 'monthlyCapacity',
  //   scopedSlots: { customRender: 'monthlyCapacity' }
  // },
  {
    title: '年产值',
    dataIndex: 'yearCapacity',
    scopedSlots: { customRender: 'yearCapacity' }
  }
]
const columns2 = [
  { title: '序号', width: '61px', dataIndex: 'index', scopedSlots: { customRender: 'index' } },
  { title: '产品名称', dataIndex: 'productName', scopedSlots: { customRender: 'productName' } },
  { title: '库存金额(万元)', dataIndex: 'brand', scopedSlots: { customRender: 'brand' } }
]
export default {
  props: {
    scrollTop: {
      type: Number,
      default: 0
    }
  },
  components: {
    Popup,
    swiperList,
    ImagePreview,
    submitExamine,
    supplieraudits
  },
  // watch: {
  //   scrollTop(val) {
  //     if (val > 50) {
  //     }
  //   }
  // },
  data() {
    return {
      categoryList: [],
      normalizer(node) {
        return {
          id: node?.id,
          label: node?.name,
          children: node?.children || undefined,
          isDisabled: node.level !== 2
        }
      },
      tabIndex: 0,
      popupStatus: false,
      apart,
      format,
      capacitycolumns,
      equipmentcolumns,
      columns,
      columns2,
      form: this.$form.createForm(this),
      tabs: [
        {
          name: '验厂信息',
          components: 'Factory',
          show: true
        },
        {
          name: '工商信息',
          components: 'BusinessInfo',
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
          name: '企业基本资质',
          components: 'Qualification',
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
          components: 'PatentPic',
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
      ],
      goodsColumns: [
        {
          title: '序号',
          dataIndex: 'index'
        },
        {
          title: '项目',
          dataIndex: 'projectName'
        },
        {
          title: '总分值',
          dataIndex: 'totalScore'
        },
        {
          title: '实得分数',
          dataIndex: 'realScore'
        },
        {
          title: '权重(%)',
          dataIndex: 'weight'
        },
        {
          title: '加权得分',
          dataIndex: 'weightScore'
        }
      ],
      management: [
        {
          title: '类目编号',
          dataIndex: 'index'
        },
        {
          title: '经营品类',
          dataIndex: 'name'
        },
        {
          title: '主营品类',
          dataIndex: 'isMaincategory',
          scopedSlots: { customRender: 'isMaincategory' }
        },
        {
          title: '审核状态',
          dataIndex: 'authStatus',
          scopedSlots: { customRender: 'authStatus' }
        }
      ],
      qualification: [
        {
          title: '资格类型',
          dataIndex: 'certificateType'
        },
        {
          title: '证书名称',
          dataIndex: 'certificateName'
        },
        {
          title: '证书编号',
          dataIndex: 'certificateNumber'
        },
        {
          title: '颁发机构',
          dataIndex: 'issueAuthority'
        },
        {
          title: '颁发日期',
          dataIndex: 'issueBeginTime',
          scopedSlots: { customRender: 'issueBeginTime' }
        },
        {
          title: '有效期至',
          dataIndex: 'issueEndTime',
          scopedSlots: { customRender: 'issueEndTime' }
        }
      ],
      list: { merchantId: '' },
      datalist: [],
      idList: [],
      // merchantId: '',
      datalistsupplierbusiness: [],
      merchantId: this.$route.params.id,
      base: [
        {
          title: '考核项目',
          dataIndex: 'itemName',
          width: 150,
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {}
            }
            obj.attrs.rowSpan = this.getRowSpanCount(this.tableData[0].items || [], 'itemName', index)
            return obj
          }
        },
        { title: '考核规则', dataIndex: 'itemRule', width: 150 },
        {
          title: '考核分数(0分-不合格；3分-达标；4分-优秀；5分-非常棒)',
          dataIndex: 'score',
          width: 30,
          scopedSlots: { customRender: 'score' }
        },
        { title: '实际情况', dataIndex: 'truth', width: 270, scopedSlots: { customRender: 'truth' } }
      ],
      baseList: [],
      quality: [
        {
          title: '考核项目',
          dataIndex: 'itemName',
          width: 150,
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {}
            }
            obj.attrs.rowSpan = this.getRowSpanCount(this.tableData[1].items || [], 'itemName', index)
            return obj
          }
        },
        { title: '考核规则', dataIndex: 'itemRule', width: 150 },
        {
          title: '考核分数(0分-不合格；3分-达标；4分-优秀；5分-非常棒)',
          dataIndex: 'score',
          width: 30,
          scopedSlots: { customRender: 'score' }
        },
        { title: '实际情况', dataIndex: 'truth', width: 270, scopedSlots: { customRender: 'truth' } }
      ],
      qualityList: [],
      research: [
        {
          title: '考核项目',
          dataIndex: 'itemName',
          width: 150,
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {}
            }
            obj.attrs.rowSpan = this.getRowSpanCount(this.tableData[2].items || [], 'itemName', index)
            return obj
          }
        },
        { title: '考核规则', dataIndex: 'itemRule', width: 150 },
        {
          title: '考核分数(0分-不合格；3分-达标；4分-优秀；5分-非常棒)',
          dataIndex: 'score',
          width: 30,
          scopedSlots: { customRender: 'score' }
        },
        { title: '实际情况', dataIndex: 'truth', width: 270, scopedSlots: { customRender: 'truth' } }
      ],
      researchList: [],
      product: [
        {
          title: '考核项目',
          dataIndex: 'itemName',
          width: 150,
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {}
            }
            obj.attrs.rowSpan = this.getRowSpanCount(this.tableData[3].items || [], 'itemName', index)
            return obj
          }
        },
        { title: '考核规则', dataIndex: 'itemRule', width: 150 },
        {
          title: '考核分数(0分-不合格；3分-达标；4分-优秀；5分-非常棒)',
          dataIndex: 'score',
          width: 30,
          scopedSlots: { customRender: 'score' }
        },
        { title: '实际情况', dataIndex: 'truth', width: 270, scopedSlots: { customRender: 'truth' } }
      ],
      productList: [],
      sale: [
        {
          title: '考核项目',
          dataIndex: 'itemName',
          width: 150,
          customRender: (value, row, index) => {
            const obj = {
              children: value,
              attrs: {}
            }
            obj.attrs.rowSpan = this.getRowSpanCount(this.tableData[4].items || [], 'itemName', index)
            return obj
          }
        },
        { title: '考核规则', dataIndex: 'itemRule', width: 150 },
        {
          title: '考核分数(0分-不合格；3分-达标；4分-优秀；5分-非常棒)',
          dataIndex: 'score',
          width: 30,
          scopedSlots: { customRender: 'score' }
        },
        { title: '实际情况', dataIndex: 'truth', width: 270, scopedSlots: { customRender: 'truth' } }
      ],
      saleList: []
    }
  },
  created() {
    this.getReviewList()
    this.get()
    this.BindCategory()
  },

  mounted() {
    this.detailed()
    this.supplierbusiness()
  },
  methods: {
    async BindCategory() {
      const res = await userAPI.queryTreeAllCategory()
      if (res.code === '0') {
        this.categoryList = res.data
      }
    },
    handlePreviewVr() {
      if (!this.datalist.vrUrl) return
      window.open(this.datalist.vrUrl)
    },
    handlePreviewVrs() {
      if (!this.datalist.factoryAuditReportUrl) return
      window.open(this.datalist.factoryAuditReportUrl)
    },
    cancel() {
      this.$router.go(-1)
    },
    // 审核确认接口
    submitExamine(authStatus, auditReason) {
      if (authStatus === 1) {
        authStatus = '3'
      } else if (authStatus === 2) {
        authStatus = '4'
      }
      supplieraudits({ ids: this.idList, authStatus, auditReason }).then((res) => {
        this.popupStatus = false
        this.idList = []
        this.$router.go(-1)
      })
    },
    // 关闭审核弹框
    closeExaminPopup() {
      this.popupStatus = false
    },
    // 获取地址栏id
    get() {
      // const parameter = location.href.split('?')[1]
      this.list.merchantId = this.$route.params.id
      // this.merchantId = parameter.split('&')[1].split('=')[1]
    },
    // 经营品类
    async nesscate(params) {
      const { list } = this
      const data = {
        ...params,
        ...list
      }
      const ret = await businessCategory(data)
      if (ret.code === '0') {
        for (let i = 0; i < ret.data.listObj?.length; i++) {
          ret.data.listObj[i].index = i + 1
        }
      }
      return ret
    },
    // 资格证书
    async category(params) {
      const { list } = this
      const data = {
        ...params,
        ...list
      }
      // return qualificationCertificate(data)
      const ret = await qualificationCertificate(data)
      if (ret.code === '0') {
        for (let i = 0; i < ret.data.listObj?.length; i++) {
          ret.data.listObj[i].index = i + 1
        }
      }
      return ret
    },
    // 综合评审情况
    async init(params) {
      const { list } = this
      const data = {
        ...params,
        ...list
      }
      // return supplierAuditListterprises(data)
      const ret = await supplierAuditListterprises(data)
      if (ret.code === '0') {
        for (let i = 0; i < ret.data.listObj?.length; i++) {
          ret.data.listObj[i].index = i + 1
        }
      }
      return ret
    },
    // 关联企业列表数据
    async initEnterprises(params) {
      const { list } = this
      const data = {
        ...params,
        ...list
      }
      // return supplieraffiliatedenterprise(data)
      const ret = await supplieraffiliatedenterprise(data)
      if (ret.code === '0') {
        for (let i = 0; i < ret.data.listObj?.length; i++) {
          ret.data.listObj[i].index = i + 1
        }
      }
      return ret
    },
    // 设备清单列表数据
    async initEquipment(params) {
      const { list } = this
      const data = {
        ...params,
        ...list
      }
      // return supplierEquipment(data)
      const ret = await supplierEquipment(data)
      if (ret.code === '0') {
        for (let i = 0; i < ret.data.listObj?.length; i++) {
          ret.data.listObj[i].index = i + 1
        }
      }
      this.$refs.TheAuthInfoTable4.refresh(true)
      return ret
    },
    // 生产产能列表数据
    async initpage(params) {
      const { list } = this
      const data = {
        ...params,
        ...list
      }
      // return supplierpage(data)
      const ret = await supplierpage(data)
      if (ret.code === '0') {
        for (let i = 0; i < ret.data.listObj?.length; i++) {
          ret.data.listObj[i].index = i + 1
        }
      }
      return ret
    },
    async initList(params) {
      const { list } = this
      const data = {
        ...params,
        ...list
      }
      return productCapacityPage(data)
    },
    // 请求详情展示数据
    async detailed() {
      const { data } = await supplierDetailo({
        orgId: this.list.merchantId
      })
      this.datalist = data
      this.tabs = this.tabs.map((x) => {
        const isStatus = ['quipmentInventoryCheckInfo', 'productCapacityCheckInfo'].includes(x.components)
        const isStock = ['Stock']
        return {
          ...x,
          show: isStatus
            ? this.datalist?.enterpriseNature === '1' || x.show
            : isStock
            ? this.datalist?.enterpriseNature === '2' || x.show
            : x.show
        }
      })
      this.datalist.vrUrl = this.datalist?.vrUrl ? decodeURIComponent(this.datalist?.vrUrl) : ''
      this.$forceUpdate()
      // try {
      //   const { data } = await supplierDetailo({
      //     orgId: this.list.merchantId
      //   })
      //   this.datalist = data
      //   this.datalist.vrUrl = this.datalist?.vrUrl ? decodeURIComponent(this.datalist?.vrUrl) : ''
      //   this.$forceUpdate()
      // } catch (err) {
      //   console.log(err)
      // }
    },
    // 工商信息展示数据
    async supplierbusiness() {
      try {
        const { data } = await supplierbusinessNew({
          orgId: this.list.merchantId
        })
        this.datalistsupplierbusiness = data
      } catch (err) {
        console.log(err)
      }
    },
    // 提交
    submit() {
      this.popupStatus = true
      this.idList.push(this.list.merchantId)
    },
    // 认证审核列表
    async getReviewList() {
      const params = {
        merchantId: this.merchantId
      }
      const { data } = await reviewListAll(params)
      this.tableData = data
      this.baseList = this.tableData[0]
      this.qualityList = this.tableData[1]
      this.researchList = this.tableData[2]
      this.productList = this.tableData[3]
      this.saleList = this.tableData[4]
    },
    // 表格合并
    getRowSpanCount(data, key, target) {
      if (!Array.isArray(data)) return 1
      data = data.map((_) => _[key])
      let preValue = data[0]
      const res = [[preValue]]
      let index = 0
      for (let i = 1; i < data.length; i++) {
        if (data[i] === preValue) {
          res[index].push(data[i])
        } else {
          index += 1
          res[index] = []
          res[index].push(data[i])
          preValue = data[i]
        }
      }
      const arr = []
      res.forEach((_) => {
        const len = _.length
        for (let i = 0; i < len; i++) {
          arr.push(i === 0 ? len : 0)
        }
      })
      return arr[target]
    }
  },
  computed: {
    tabsList() {
      return this.tabs.filter((x) => x.show)
    }
  }
}
</script>

<style lang="less" scoped>
.mid {
  margin: 0;
  padding: 0;
  width: 100%;
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
  /deep/.ant-affix {
    position: initial !important;
  }
  .affix {
    /deep/.ant-affix {
      top: 65px !important;
      position: fixed !important;
    }
  }
  header {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    overflow: hidden;
    background: rgb(250, 250, 250);
    z-index: 3;
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
      background-color: #ccc;
      li {
        list-style: none;
        height: 100%;
        flex: 1;
        display: flex;
        align-content: center;
        justify-content: center;

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
            z-index: 4;
            background: rgba(255, 240, 229);
            border-top: solid 2px #ff6b00;
          }
        }
      }
    }
  }

  .table-list {
    .table-wrapper {
      margin-bottom: 30px;
    }
  }
  .header {
    width: 100%;
    height: auto;
    .vrImg {
      width: 80px;
      height: 80px;
      border: 1px dashed #dcdbdb;
      border-radius: 4px;
      overflow: hidden;
      border-radius: 4px;
      margin-top: 10px;
    }
    .images {
      width: 50px;
      height: auto;
    }
    .avatar {
      width: 100px;
      height: 100px;
      margin-bottom: 20px;
      border-radius: 5px;
    }
    .title {
      color: rgba(0, 0, 0, 0.85);
      font-size: 25px;
      font-weight: 500;
    }
    .files-mains {
      padding: 20px 0;
      width: 100%;
      margin-bottom: 30px;
      .img-box-box {
        width: 200px;
        height: 152px;
      }
      .img-box {
        width: 236px;
        height: 260px;
        display: flex;
        flex-direction: column;
        .img {
          width: 236px;
          height: 169px;
        }
        .content {
          background: rgba(255, 107, 0, 0.04);
          height: 91px;
          display: flex;
          flex-direction: column;
          .title {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-top: 11px;
            margin-left: 8px;
            .name {
              font-size: 18px;
              color: #262626;
              width: 150px;

              overflow: hidden;
              height: 30px;
              text-overflow: ellipsis;
            }
            .state {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 48px;
              height: 17px;
              margin-left: 8px;
              background: rgba(187, 187, 187, 0.24);
              border-radius: 2px;
              font-size: 12px;
              color: #999999;
            }
          }
          .endtime {
            font-size: 12px;
            color: #999999;
            margin-top: 8px;
            margin-left: 8px;
          }
        }
      }
    }
    .files-main {
      padding: 20px 0;
      width: 100%;
      .img-box-box {
        width: 200px;
        height: 152px;
      }
      .img-box {
        width: 236px;
        height: 260px;
        display: flex;
        flex-direction: column;
        .img {
          width: 236px;
          height: 169px;
        }
        .content {
          background: rgba(255, 107, 0, 0.04);
          height: 91px;
          display: flex;
          flex-direction: column;
          .title {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-top: 11px;
            margin-left: 8px;
            .name {
              font-size: 18px;
              color: #262626;
              width: 150px;

              overflow: hidden;
              height: 30px;
              text-overflow: ellipsis;
            }
            .state {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 48px;
              height: 17px;
              margin-left: 8px;
              background: rgba(187, 187, 187, 0.24);
              border-radius: 2px;
              font-size: 12px;
              color: #999999;
            }
          }
          .endtime {
            font-size: 12px;
            color: #999999;
            margin-top: 8px;
            margin-left: 8px;
          }
        }
      }
    }
  }
}
.editable-cell {
  position: relative;
}
.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}
.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}
.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}
.editable-cell-icon {
  line-height: 18px;
  display: none;
}
.editable-cell-icon-check {
  line-height: 28px;
}
.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}
.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}
.editable-add-btn {
  margin-bottom: 8px;
}
.avatar-uploader > .ant-upload {
  width: 200px;
  height: 200px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}
.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}
.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.ant-form-item {
  margin: 0;
}
.mt-10 {
  margin-top: 10px;
}
.p-l20 {
  padding-left: 20px;
}
.headerItem {
  width: 100%;
}
.headerItem > a {
  white-space: nowrap;
}
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
.tabs {
  margin-top: 50px;
}
</style>
