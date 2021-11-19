<template>
  <div class="factoryInspectionInformation">
    <header-title class="header-title">
      <span>企业基本资质</span>
    </header-title>
    <a-form-model :model="form" ref="form" :label-col="labelCol" :rules="rules" :wrapper-col="wrapperCol">
      <a-form-model-item label="企业名称">
        <div class="disInput">{{ form.enterpriseName }}</div>
      </a-form-model-item>
      <a-form-model-item label="验厂机构">
        <div class="disInput">{{ form.factoryAuditOrg }}</div>
      </a-form-model-item>
      <a-form-model-item label="预计验厂时间" v-if="form.expectFactoryAuditTime">
        <div class="disInput">{{ form.expectFactoryAuditTime | moment }}</div>
      </a-form-model-item>
      <a-form-model-item label="验厂工单号">
        <div class="disInput">{{ form.factoryAuditNo }}</div>
      </a-form-model-item>
      <a-form-model-item label="实际验厂时间" prop="realFactoryAuditTime">
        <a-date-picker :disabled="!isSubmit" v-model="form.realFactoryAuditTime" class="inp" />
      </a-form-model-item>
      <a-form-model-item label="企业性质">
        <a-radio-group v-model="form.enterpriseNature" :disabled="!isSubmit" @change="handleNatureChange">
          <a-radio value="1"> 生产商 </a-radio>
          <a-radio value="2"> 贸易商 </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <!-- <a-form-model-item label="VR地址" prop="vrUrl">
        <a-input class="inp" :disabled="!isSubmit" v-model="form.vrUrl" />
        <div class="vr-btn">
          <a-button type="primary" @click="handlePreviewVr">预览</a-button>
          <span>(点击预览新链接打开输入的vr地址)</span>
        </div>
      </a-form-model-item> -->
      <!-- <a-form-model-item label="综合评分" prop="compositeScore">
        <a-input v-model="form.compositeScore" placeholder="请输入综合评分" />
      </a-form-model-item> -->
      <a-form-model-item label="综合评分" prop="compositeScore">
        <a-input-number
          :disabled="!isSubmit"
          class="inp"
          :precision="0"
          :min="1"
          :max="9999999999"
          v-model="form.compositeScore"
          placeholder="请输入综合评分"
        />
      </a-form-model-item>
      <a-form-model-item :label="form.enterpriseNature === '1' ? '设备评分' : '库存评分'" prop="deviceScore">
        <a-input-number
          :disabled="!isSubmit"
          class="inp"
          :precision="0"
          :min="1"
          :max="9999999999"
          v-model="form.deviceScore"
          :placeholder="`请输入${form.enterpriseNature === '1' ? '设备评分' : '库存评分'}`"
        />
        <!-- <a-input
          v-model="form.deviceScore"
          :placeholder="`请输入${form.enterpriseNature === '1' ? '设备评分' : '库存评分'}`"
        /> -->
      </a-form-model-item>
      <a-form-model-item label="主营品类">
        <!-- {{ categoryList }} -->
        <tree-select
          :disabled="!isSubmit"
          class="inp"
          :normalizer="normalizer"
          :options="categoryList"
          :collapseTags="false"
          v-model="form.categoryId"
        ></tree-select>
        <!-- <a-input disabled class="inp" v-model="form.categoryName"></a-input> -->
      </a-form-model-item>
      <a-form-model-item label="验厂报告" prop="factoryAuditReportUrl">
        <div class="content">
          <s-upload
            :disabled="!isSubmit"
            :key="form.factoryAuditReportUrl"
            v-model="form.factoryAuditReportUrl"
            list-type="picture-card"
          >
            <div class="upload" v-if="!form.factoryAuditReportUrl">
              <div class="plus">
                <a-icon class="icon" type="plus" />
              </div>
              <div class="text">上传文件</div>
            </div>
          </s-upload>
          <div class="message">
            <div class="other">支持格式：bmp、tiff、gif、jpg、png、jpeg、pdf，文件大小不能超过10M</div>
          </div>
        </div>
      </a-form-model-item>
      <a-form-model-item label="数据导入">
        <!-- <a class="file-text" @click="dowlod">模板下载</a> -->
        <a-button @click="showImport = true">导入</a-button>
      </a-form-model-item>
      <a-form-model-item label="VR制作">
        <div class="content">
          <div v-if="form.coverUrl" class="vrEchoContent">
            <img class="vrImg" :src="form.coverUrl" />
            <div v-if="isSubmit" class="btnDown">
              <a-icon class="btnIcon" type="edit" @click="vrEdit(form.vrId)" />
              <a-icon class="btnIcon" type="delete" @click="vrDelete(form.vrId)" />
            </div>
            <div v-else class="btnDown"><a-icon class="btnIcon" type="eye" @click="vrShow(form.vrUrl)" /></div>
          </div>
          <div v-else-if="isSubmit" class="vrContent" @click="addVR" style="cursor: pointer">
            <img class="vrAddImg" :src="require('@/assets/images/vr/vrtubiao.svg')" />
            <div>VR制作</div>
          </div>
          <div v-else class="vrContent" style="cursor: no-drop">
            <img class="vrAddImg" :src="require('@/assets/images/vr/vrblock.png')" />
            <div>暂无VR</div>
          </div>
        </div>
      </a-form-model-item>
      <a-form-model-item label="考察结果说明" prop="remark">
        <a-textarea
          :disabled="!isSubmit"
          v-model="form.remark"
          placeholder="请输入考察结果"
          :auto-size="{ minRows: 3, maxRows: 5 }"
        />
      </a-form-model-item>
      <!-- 选择素材modal -->
      <select-material
        ref="selectMaterial"
        :selectMaterialParam="selectMaterialParam"
        :merchantId="merchantId"
        @cancel="handleVRCancel"
        @create="handleVRCreate"
      />
    </a-form-model>

    <header-title class="header-title">
      <span>综合评审情况</span>
    </header-title>

    <s-table
      class="tab-list"
      name="zongheTable"
      :columns="columns.ComprehensiveReviewPO.columns"
      :list="form.comprehensiveReviewPOList"
      :customPage="true"
      rowKey="id"
    >
      <template v-for="(col, indexs) in columns.ComprehensiveReviewPO.col" :slot="col.key" slot-scope="text, record">
        <div :key="col.key">
          <a-input
            :disabled="!isSubmit"
            v-if="col.type === 'int'"
            style="margin: -5px 0"
            :value="text"
            :maxLength="9"
            :max="100"
            :placeholder="`请填写${columns.ComprehensiveReviewPO.columns[indexs + 2].title}`"
            @change="(e) => handleChange1(e, record, col)"
          />
          <a-input
            :disabled="!isSubmit"
            :placeholder="`请填写${columns.ComprehensiveReviewPO.columns[indexs + 2].title}`"
            v-if="col.type === 'float'"
            :maxLength="9"
            :value="text"
            @change="(e) => handleChange1(e, record, col)"
          />
        </div>
      </template>
    </s-table>

    <header-title class="header-title">
      <span>基本资质</span>
    </header-title>
    <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="所属集团">
        <a-input :disabled="!isSubmit" v-model="form.membershipGroup" placeholder="请输入所属集团" />
      </a-form-model-item>
      <!-- <a-form-model-item label="营业执照编号">
        <a-input v-model="form.businessLicenseNo" placeholder="请输入营业执照编号" />
      </a-form-model-item> -->
      <a-form-model-item label="认证注册地址">
        <a-textarea
          :disabled="!isSubmit"
          v-model="form.officeAdressDetail"
          placeholder="请输入认证注册地址"
          :auto-size="{ minRows: 3, maxRows: 5 }"
        />
      </a-form-model-item>
      <a-form-model-item label="认证经营范围">
        <a-textarea
          :disabled="!isSubmit"
          v-model="form.scope"
          placeholder="请输入认证经营范围"
          :auto-size="{ minRows: 3, maxRows: 5 }"
        />
      </a-form-model-item>
      <a-form-model-item label="总建筑面积(㎡)">
        <a-input-number
          class="inp"
          :precision="2"
          :min="1"
          v-model="form.plantArea"
          :disabled="!isSubmit"
          placeholder="请输入总建筑面积(㎡)"
        />
      </a-form-model-item>
      <a-form-model-item label="占地性质">
        <a-radio-group v-model="form.landUseStatus" :disabled="!isSubmit">
          <a-radio value="0"> 租赁 </a-radio>
          <a-radio value="1"> 自有 </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="是否有研发部门">
        <a-radio-group v-model="form.isDeveloper" :disabled="!isSubmit">
          <a-radio value="1"> 是 </a-radio>
          <a-radio value="0"> 否 </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="研发人数">
        <a-input-number
          :disabled="!isSubmit"
          class="inp"
          :precision="0"
          :min="0"
          :max="9999999999"
          v-model="form.staffAmount"
          placeholder="请输入研发人数"
        />
      </a-form-model-item>
      <a-form-model-item label="营业执照">
        <s-upload :disabled="!isSubmit" v-model="form.businessLicenseUrl" list-type="picture-card">
          <div class="upload" v-if="!form.businessLicenseUrl">
            <div class="plus">
              <a-icon class="icon" type="plus" />
            </div>
            <div class="text">上传图片</div>
          </div>
        </s-upload>
      </a-form-model-item>
    </a-form-model>

    <header-title class="header-title">
      <span>关联企业</span>
      <a-button type="primary" v-if="isSubmit" @click="handleAddTables(columns.AssociatedEnterprisePO)">添加</a-button>
    </header-title>
    <s-table
      rowKey="ids"
      class="img-table"
      name="associatedEnterprisePOList"
      :columns="columns.AssociatedEnterprisePO.columns"
      :list="form.associatedEnterprisePOList"
      :customPage="true"
    >
      <template v-for="(col, indexs) in columns.AssociatedEnterprisePO.col" :slot="col.key" slot-scope="text, record">
        <div :key="col.key">
          <a-input
            :disabled="!isSubmit"
            style="margin: -5px 0"
            :value="text"
            :maxLength="50"
            :placeholder="`请填写${columns.AssociatedEnterprisePO.columns[indexs + 1].title}`"
            @change="(e) => handleChange1(e, record, col)"
          />
        </div>
      </template>
      <template slot="enterpriseProveUrl" slot-scope="text, record">
        <div class="content1" :key="`${record.id}_box`">
          <s-upload
            :disabled="!isSubmit"
            :key="`${record.id}_upload_img`"
            style="width: 60px; height: 60px"
            list-type="picture-card"
            v-model="record.enterpriseProveUrl"
          >
            <div class="upload" v-if="!record.enterpriseProveUrl">
              <div class="plus">
                <a-icon class="icon" type="plus" />
              </div>
            </div>
          </s-upload>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record" v-if="isSubmit">
        <a @click="handleDelRow(columns.AssociatedEnterprisePO.data, record)">删除</a>
      </template>
    </s-table>
    <header-title class="header-title" v-if="form.enterpriseNature === '1'">
      <span>设备清单</span>
      <a-button type="primary" v-if="isSubmit" @click="handleAddTables(columns.EquipmentInventoryCheckInfoPO)">
        添加
      </a-button>
    </header-title>
    <s-table
      class="tab-list"
      name="equipmentInventoryCheckInfoPOList"
      v-if="form.enterpriseNature === '1'"
      :columns="columns.EquipmentInventoryCheckInfoPO.columns"
      :list="form.equipmentInventoryCheckInfoPOList"
      :customPage="true"
      rowKey="ids"
      bordered
    >
      <template
        v-for="(col, indexs) in columns.EquipmentInventoryCheckInfoPO.col"
        :slot="col.key"
        slot-scope="text, record"
      >
        <div :key="col.key">
          <a-input
            :key="record.id"
            v-if="col.type === 'input'"
            :disabled="!isSubmit"
            style="margin: -5px 0"
            :value="text"
            :maxLength="50"
            :placeholder="`请填写${columns.EquipmentInventoryCheckInfoPO.columns[indexs + 1].title}`"
            @change="(e) => handleChange1(e, record, col)"
          />
          <a-input
            :key="record.id"
            :disabled="!isSubmit"
            :placeholder="`请填写${columns.EquipmentInventoryCheckInfoPO.columns[indexs + 1].title}`"
            v-if="col.type === 'number' || col.type === 'int'"
            :maxLength="9"
            :min="1"
            :value="text"
            @change="(e) => handleChange1(e, record, col)"
          />
        </div>
      </template>
      <template slot="operation" slot-scope="text, record" v-if="isSubmit">
        <a @click="handleDelRow(columns.EquipmentInventoryCheckInfoPO.data, record)">删除</a>
      </template>
    </s-table>
    <header-title class="header-title" v-if="form.enterpriseNature === '2'">
      <span>库存金额</span>
      <a-button type="primary" v-if="isSubmit" @click="handleAddTables(columns.InventoryCapacityInfo)">添加</a-button>
    </header-title>
    <s-table
      v-if="form.enterpriseNature === '2'"
      class="tab-list"
      name="inventoryCapacityInfoList"
      :columns="columns.InventoryCapacityInfo.columns"
      :list="form.inventoryCapacityInfoList"
      rowKey="ids"
      :customPage="true"
    >
      <template v-for="(col, indexs) in columns.InventoryCapacityInfo.col" :slot="col.key" slot-scope="text, record">
        <div :key="col.key">
          <a-input
            :key="record.id"
            :disabled="!isSubmit"
            v-if="col.type === 'input'"
            style="margin: -5px 0"
            :value="text"
            :placeholder="`请填写${columns.InventoryCapacityInfo.columns[indexs + 1].title}`"
            @change="(e) => handleChange1(e, record, col)"
          />
          <a-input
            :key="record.id"
            :disabled="!isSubmit"
            :placeholder="`请填写${columns.InventoryCapacityInfo.columns[indexs + 1].title}`"
            v-if="col.type === 'number'"
            :min="1"
            :value="text"
            @change="(e) => handleChange1(e, record, col)"
          />
        </div>
      </template>

      <template slot="operation" slot-scope="text, record" v-if="isSubmit">
        <a @click="handleDelRow(columns.InventoryCapacityInfo.data, record)">删除</a>
      </template>
    </s-table>

    <header-title class="header-title" v-if="form.enterpriseNature === '1'">
      <span>生产产值</span>
      <a-button type="primary" v-if="isSubmit" @click="handleAddTables(columns.ProductCapacityCheckInfoPO)">
        添加
      </a-button>
    </header-title>
    <s-table
      rowKey="ids"
      v-if="form.enterpriseNature === '1'"
      name="productCapacityCheckInfoPOList"
      class="tab-list"
      :columns="columns.ProductCapacityCheckInfoPO.columns"
      :list="form.productCapacityCheckInfoPOList"
      :customPage="true"
    >
      <template
        v-for="(col, indexs) in columns.ProductCapacityCheckInfoPO.col"
        :slot="col.key"
        slot-scope="text, record"
      >
        <div :key="col.key">
          <a-input
            :key="record.id"
            :disabled="!isSubmit"
            v-if="col.type === 'input'"
            style="margin: -5px 0"
            :maxLength="100"
            :value="text"
            :placeholder="`请填写${columns.ProductCapacityCheckInfoPO.columns[indexs + 1].title}`"
            @change="(e) => handleChange1(e, record, col)"
          />
          <a-input
            :key="record.id"
            :disabled="!isSubmit"
            :placeholder="`请填写${columns.ProductCapacityCheckInfoPO.columns[indexs + 1].title}`"
            v-if="col.type === 'number' || col.type === 'float'"
            :maxLength="10"
            :value="text"
            @change="(e) => handleChange1(e, record, col)"
          />
        </div>
      </template>
      <template slot="index" slot-scope="text, record, index">
        <div>
          {{ index + 1 }}
        </div>
      </template>
      <template slot="operation" slot-scope="text, record" v-if="isSubmit">
        <a @click="handleDelRow(columns.ProductCapacityCheckInfoPO.data, record)">删除</a>
      </template>
    </s-table>
    <addcert
      v-if="isShowAddCert"
      :type="type"
      :info="info"
      :merchantId="$route.params.id"
      :certificationStatus="1"
      :visible="visible"
      @update="BindData"
      @close="closeAddCert"
    ></addcert>
    <header-title class="header-title">
      <span>销售业绩照片 支持格式：bmp、tiff、gif、jpg、png、jpeg，文件大小不能超过1.5M</span>
    </header-title>
    <swiper-upload v-model="companyPerformanceInfoPOList" v-if="isSubmit" />
    <swiper-list
      v-else-if="companyPerformanceInfoPOList.length > 0"
      :list="companyPerformanceInfoPOList"
      v-slot:default="{ item }"
      :width="152"
    >
      <img :src="item" @click="handlePreview(companyPerformanceInfoPOList, item)" height="152" width="152" />
    </swiper-list>
    <a-empty v-else></a-empty>
    <header-title class="header-title">
      <span>专利照片 支持格式：bmp、tiff、gif、jpg、png、jpeg，文件大小不能超过1.5M</span>
    </header-title>
    <swiper-upload v-model="patentPictureInfoPOList" v-if="isSubmit" />
    <swiper-list
      v-else-if="patentPictureInfoPOList.length > 0"
      :list="patentPictureInfoPOList"
      v-slot:default="{ item }"
      :width="152"
    >
      <img :src="item" @click="handlePreview(patentPictureInfoPOList, item)" height="152" width="152" />
    </swiper-list>
    <a-empty v-else></a-empty>
    <header-title class="header-title">
      <span>办公照片 支持格式：bmp、tiff、gif、jpg、png、jpeg，文件大小不能超过1.5M</span>
    </header-title>
    <swiper-upload v-model="companyPictureCheckInfoPOList" v-if="isSubmit" />
    <swiper-list
      v-else-if="companyPictureCheckInfoPOList.length > 0"
      :list="companyPictureCheckInfoPOList"
      v-slot:default="{ item }"
      :width="152"
    >
      <img :src="item" @click="handlePreview(companyPictureCheckInfoPOList, item)" height="152" width="152" />
    </swiper-list>
    <a-empty v-else></a-empty>
    <header-title class="header-title">
      <span>车间/厂房/库房照片 支持格式：bmp、tiff、gif、jpg、png、jpeg，文件大小不能超过1.5M</span>
    </header-title>
    <swiper-upload v-model="workshopPictureInfoPOList" v-if="isSubmit" />
    <swiper-list
      v-else-if="workshopPictureInfoPOList.length > 0"
      :list="workshopPictureInfoPOList"
      v-slot:default="{ item }"
      :width="152"
    >
      <img :src="item" @click="handlePreview(workshopPictureInfoPOList, item)" height="152" width="152" />
    </swiper-list>
    <a-empty v-else></a-empty>
    <!-- <div class="btns">
      <a-button style="width: 200px; height: 50px" type="primary" @click="Save" size="large"> 保存 </a-button>
    </div> -->
    <fixed-box>
      <a-button type="primary" @click="handleAudit" v-if="isSubmit"> 提交审核 </a-button>
      <a-button type="primary" @click="Save" v-if="isSubmit"> 保存 </a-button>
      <a-button @click="handleCancel"> 取消 </a-button>
    </fixed-box>
    <ImagePreview :isThumbnail="false" ref="preview" />
    <Import
      :visible.sync="showImport"
      :merchantId="merchantId"
      :enterpriseNature="form.enterpriseNature"
      :save="Save"
      @ok="handleOk"
    />
  </div>
</template>
<script>
import {
  qualificationList,
  addMerchantOrgInfoExamine,
  getMerchantOrgInfoDetail,
  getPageComprehensiveReview,
  getPageAssociatedEnterprise,
  getPageEquipmentInventoryCheckInfo,
  getPageProductCapacityCheckInfo,
  getPageInventoryCapacityInfoList
} from '@/api/supplieAuthAdmin'
import { createProduction, deleteProduction, editProdction } from '@/api/vr'
import { queryTreeAllCategory } from '@/api/user.js'
import addcert from '@/views/enterprise/compontents/addcreat.vue'
import SwiperUpload from '@/components/SwiperUpload'
import swiperList from '@/components/SwiperList/swiperList.vue'
import ImagePreview from '@/components/ImagePreview'
import Import from './Import'
import moment from 'moment'
import selectMaterial from '@/views/sysManagement/vr/editVR/selectMaterial.vue' // 添加素材
import ppo from 'ppo'
const columns = {
  ComprehensiveReviewPO: {
    data: 'comprehensiveReviewPOList',
    default: {
      totalScore: '',
      realScore: '',
      number: '',
      weight: '',
      weightScore: ''
    },
    name: '综合评审情况',
    col: [
      { key: 'totalScore', type: 'float' },
      { key: 'realScore', type: 'float' },
      { key: 'weight', type: 'int', max: 100, min: 0 },
      { key: 'weightScore', type: 'float' }
    ],
    columns: [
      { title: '序号', width: '61px', dataIndex: 'index', scopedSlots: { customRender: 'index' } },
      { title: '项目', width: '150px', dataIndex: 'projectName' },
      { title: '总分值', dataIndex: 'totalScore', scopedSlots: { customRender: 'totalScore' } },
      { title: '实得分数', dataIndex: 'realScore', scopedSlots: { customRender: 'realScore' } },
      { title: '权重(%)', dataIndex: 'weight', scopedSlots: { customRender: 'weight' } },
      { title: '加权得分', dataIndex: 'weightScore', scopedSlots: { customRender: 'weightScore' } }
    ]
  },
  AssociatedEnterprisePO: {
    data: 'associatedEnterprisePOList',
    default: {
      enterpriseName: '',
      enterpriseProveUrl: ''
    },
    name: '关联企业',
    col: [
      { key: 'enterpriseName', type: 'input' },
      { key: 'relatedProof', type: '' }
    ],
    columns: [
      { title: '序号', width: '61px', dataIndex: 'index', scopedSlots: { customRender: 'index' } },
      { title: '企业名称', dataIndex: 'enterpriseName', scopedSlots: { customRender: 'enterpriseName' } },
      { title: '关联证明', dataIndex: 'enterpriseProveUrl', scopedSlots: { customRender: 'enterpriseProveUrl' } },
      {
        title: '操作',
        width: '61px',
        key: 'action',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' }
      }
    ]
  },
  EquipmentInventoryCheckInfoPO: {
    data: 'equipmentInventoryCheckInfoPOList',
    default: {
      equipmentName: '',
      brand: '',
      model: '',
      number: '',
      durableYears: ''
    },
    name: '设备清单',
    col: [
      { key: 'equipmentName', type: 'input' },
      { key: 'brand', type: 'input' },
      { key: 'model', type: 'input' },
      { key: 'number', type: 'int', max: 999999999, min: 1 },
      { key: 'durableYears', type: 'int', max: 9999, min: 0 }
    ],
    columns: [
      { title: '序号', width: '61px', dataIndex: 'index', scopedSlots: { customRender: 'index' } },
      { title: '设备名称', dataIndex: 'equipmentName', scopedSlots: { customRender: 'equipmentName' } },
      { title: '品牌', dataIndex: 'brand', scopedSlots: { customRender: 'brand' } },
      { title: '型号', dataIndex: 'model', scopedSlots: { customRender: 'model' } },
      { title: '数量', dataIndex: 'number', scopedSlots: { customRender: 'number' } },
      { title: '使用年限', dataIndex: 'durableYears', scopedSlots: { customRender: 'durableYears' } },
      {
        title: '操作',
        width: '61px',
        key: 'action',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' }
      }
    ]
  },
  ProductCapacityCheckInfoPO: {
    data: 'productCapacityCheckInfoPOList',
    default: {
      productName: '',
      monthlyCapacity: '',
      yearCapacity: ''
    },
    name: '生产产值',
    col: [
      { key: 'productName', type: 'input' },
      // { key: 'monthlyCapacity', type: 'float' },
      { key: 'yearCapacity', type: 'float' }
    ],
    columns: [
      { title: '序号', width: '61px', dataIndex: 'index', scopedSlots: { customRender: 'index' } },
      { title: '产品名称', dataIndex: 'productName', scopedSlots: { customRender: 'productName' } },
      // { title: '月产值(万元)', dataIndex: 'monthlyCapacity', scopedSlots: { customRender: 'monthlyCapacity' } },
      { title: '年产值(万元)', dataIndex: 'yearCapacity', scopedSlots: { customRender: 'yearCapacity' } },
      {
        title: '操作',
        key: 'action',
        width: '61px',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' }
      }
    ]
  },
  InventoryCapacityInfo: {
    data: 'inventoryCapacityInfoList',
    default: {
      productName: '',
      brand: ''
    },
    name: '库存金额',
    col: [
      { key: 'productName', type: 'input' },
      { key: 'brand', type: 'number' }
    ],
    columns: [
      { title: '序号', width: '61px', dataIndex: 'index', scopedSlots: { customRender: 'index' } },
      { title: '产品名称', dataIndex: 'productName', scopedSlots: { customRender: 'productName' } },
      { title: '库存金额(万元)', dataIndex: 'brand', scopedSlots: { customRender: 'brand' } },
      {
        title: '操作',
        key: 'action',
        width: '61px',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' }
      }
    ]
  }
}
export default {
  components: {
    SwiperUpload,
    swiperList,
    ImagePreview,
    addcert,
    selectMaterial, // 添加素材
    Import
  },
  created() {
    this.BindData()
    this.queryAllCategory()
    this.$store.commit('enterpriseNature', this.form.enterpriseNature)
  },
  computed: {
    isSubmit() {
      return !['2', '3'].includes(this.form?.authStatus)
    }
  },
  data() {
    return {
      normalizer(node) {
        return {
          id: node?.id,
          label: node?.name,
          children: node?.children || undefined,
          isDisabled: node.level !== 2
        }
      },
      categoryList: [],
      showImport: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      type: '',
      list: [],
      titleName: '资质证书',
      visible: false,
      isShowAddCert: false,
      info: null,
      merchantId: this.$route.params.id + '',
      vrStatus: true, // vr添加状态
      // 选择素材输入参数
      selectMaterialParam: {
        // 是否展示素材弹框
        showSelectMaterial: false,
        // 当前厂商id
        manufacturerId: this.$route.params.id,
        // 已选择的素材id
        selectedMaterialId: []
      },
      form: {
        /** 以下为【企业基本资质】 */
        vrUrl: '',
        factoryAuditOrg: '',
        expectFactoryAuditTime: '',
        factoryAuditNo: '',
        realFactoryAuditTime: null,
        enterpriseNature: 1,
        compositeScore: '',
        deviceScore: '',
        remark: '',
        factoryAuditReportUrl: '',
        /** 以下为【企业基本资格】 */
        membershipGroup: '',
        businessLicenseNo: '',
        officeAdressDetail: '',
        businessScope: '',
        plantArea: '',
        isDeveloper: 0,
        landUseStatus: 1,
        staffAmount: '',
        businessLicenseUrl: '',
        /** 以下为【综合评审情况】 */
        comprehensiveReviewPOList: [],
        /** 以下为【关联企业】 */
        associatedEnterprisePOList: [],
        /** 以下为【设备清单】 */
        equipmentInventoryCheckInfoPOList: [],
        /** 以下为【生产产能】 */
        productCapacityCheckInfoPOList: [],
        /** 以下为【库存量】 */
        inventoryCapacityInfoList: [],
        patentPictureInfoPOList: [],
        companyPictureCheckInfoPOList: [],
        companyPerformanceInfoPOList: [],
        workshopPictureInfoPOList: []
      },
      patentPictureInfoPOList: [],
      companyPictureCheckInfoPOList: [],
      companyPerformanceInfoPOList: [],
      workshopPictureInfoPOList: [],
      rules: {
        realFactoryAuditTime: [{ required: true, message: '请选择验厂时间', trigger: 'change' }],
        // compositeScore: [{ required: true, message: '请填写综合评分', trigger: 'change' }],
        deviceScore: [{ required: true, message: '请填写', trigger: 'change' }]
        // factoryAuditReportUrl: [{ required: true, message: '请上传验厂报告', trigger: 'change' }],
        // remark: [{ required: true, message: '请输入考察结果说明', trigger: 'change' }]
      },
      columns
    }
  },
  methods: {
    handleOk() {
      // 模板导入成功之后重新调取接口渲染页面
      this.BindData()
    },
    async queryAllCategory() {
      const res = await queryTreeAllCategory()
      if (res.code === '0') {
        this.categoryList = res.data
      }
    },
    handlePreviewVr() {
      if (!this.form.vrUrl) return
      window.open(this.form.vrUrl)
    },
    handleChangeProject() {
      let projectName = []
      if (this.form.enterpriseNature === '1') {
        projectName = ['基本资质', '质量管理', '研发能力', '生产交付能力', '售后能力', '合计分数']
      } else if (this.form.enterpriseNature === '2') {
        projectName = ['基本资质', '质量管理', '供应商管理', '交付履约能力', '售后能力', '合计分数']
      }
      this.form.comprehensiveReviewPOList = this.form.comprehensiveReviewPOList.map((x, i) => {
        return {
          ...x,
          projectName: projectName[i]
        }
      })
    },
    handleNatureChange(e) {
      this.$store.commit('enterpriseNature', this.form.enterpriseNature)
      this.form.comprehensiveReviewPOList = []
      let projectName = []
      if (this.form.enterpriseNature === '1') {
        projectName = ['基本资质', '质量管理', '研发能力', '生产交付能力', '售后能力', '合计分数']
      } else if (this.form.enterpriseNature === '2') {
        projectName = ['基本资质', '质量管理', '供应商管理', '交付履约能力', '售后能力', '合计分数']
      }
      this.form.comprehensiveReviewPOList = projectName.map((projectName) => {
        return {
          projectName,
          totalScore: '',
          realScore: '',
          weight: '',
          weightScore: ''
        }
      })
    },
    handlePreview(list, value) {
      const currentIndx = list.findIndex((x) => x === value)
      this.$refs.preview.customShow(list, currentIndx)
    },
    async BindData() {
      const { merchantId } = this
      const res = await Promise.all([
        qualificationList({ merchantId }),
        getMerchantOrgInfoDetail({ orgId: merchantId }),
        getPageComprehensiveReview({
          merchantId,
          currentPage: 1,
          itemsPerPage: 20
        }),
        getPageAssociatedEnterprise({
          merchantId,
          currentPage: 1,
          itemsPerPage: 10000000
        }),
        getPageEquipmentInventoryCheckInfo({
          merchantId,
          currentPage: 1,
          itemsPerPage: 10000000
        }),
        getPageProductCapacityCheckInfo({
          merchantId,
          currentPage: 1,
          itemsPerPage: 10000000
        }),
        getPageInventoryCapacityInfoList({
          merchantId,
          currentPage: 1,
          itemsPerPage: 20
        })
      ])
      if (res[0].code === '0') {
        this.list = res[0].data.listObj
      }
      if (res[1].code === '0') {
        this.form = res[1].data
        console.log(this.form)
        this.$store.commit('enterpriseNature', this.form.enterpriseNature)
        this.patentPictureInfoPOList = res[1].data.patentPictureInfoPOList?.map((x) => x.photoUrl) || []
        this.companyPictureCheckInfoPOList = res[1].data?.companyPictureCheckInfoPOList?.map((x) => x.photoUrl) || []
        this.companyPerformanceInfoPOList = res[1].data?.companyPerformanceInfoPOList?.map((x) => x.photoUrl) || []
        this.workshopPictureInfoPOList = res[1].data.workshopPictureInfoPOList?.map((x) => x.photoUrl)
        if (!this.form.comprehensiveReviewPOList) this.form.comprehensiveReviewPOList = []
        if (!this.form.associatedEnterprisePOList) this.form.associatedEnterprisePOList = []
        if (!this.form.equipmentInventoryCheckInfoPOList) this.form.equipmentInventoryCheckInfoPOList = []
        if (!this.form.productCapacityCheckInfoPOList) this.form.productCapacityCheckInfoPOList = []
        if (this.form.realFactoryAuditTime) {
          this.form.realFactoryAuditTime = moment(this.form.realFactoryAuditTime)
        }
        try {
          this.form.vrUrl = this.form?.vrUrl ? decodeURIComponent(this.form?.vrUrl) : ''
        } catch (error) {}
      }
      if (res[2].code === '0') {
        if (res[2].data.listObj?.length > 0) {
          this.form.comprehensiveReviewPOList = [...res[2].data.listObj]
        } else {
          this.handleNatureChange()
        }
      }
      if (res[3].code === '0') {
        if (res[3].data.listObj?.length > 0) {
          this.form.associatedEnterprisePOList = [...res[3].data.listObj]
        } else {
          this.form.associatedEnterprisePOList = []
        }
      }
      if (res[4].code === '0') {
        if (res[4].data.listObj?.length > 0) {
          this.form.equipmentInventoryCheckInfoPOList = [...res[4].data.listObj]
        } else {
          this.form.equipmentInventoryCheckInfoPOList = []
        }
      }
      if (res[5].code === '0') {
        if (res[5].data.listObj?.length > 0) {
          this.form.productCapacityCheckInfoPOList = [...res[5].data.listObj]
        } else {
          this.form.productCapacityCheckInfoPOList = []
        }
      }
      if (res[6].code === '0') {
        if (res[6].data?.length > 0) {
          this.form.inventoryCapacityInfoList = [...res[6].data]
        } else {
          this.form.inventoryCapacityInfoList = []
        }
      }
      this.$forceUpdate()
    },
    init() {
      const projectName = ['基本资质', '质量管理', '研发能力', '生产交付能力', '售后能力', '合计分数']
      this.form.comprehensiveReviewPOList = projectName.map((projectName) => {
        return {
          projectName,
          totalScore: '',
          realScore: '',
          weight: '',
          weightScore: ''
        }
      })
      this.$forceUpdate()
    },
    handleEdit(info) {
      this.info = {
        ...info,
        issueBeginTime: info.issueBeginTime ? moment(info.issueBeginTime) : null,
        issueEndTime: moment(info.issueEndTime)
      }
      this.type = 'edit'
      this.visible = true
      this.isShowAddCert = true
    },
    handleCheck(info) {
      this.info = {
        ...info,
        issueBeginTime: info.issueBeginTime ? moment(info.issueBeginTime) : null,
        issueEndTime: moment(info.issueEndTime)
      }
      this.type = 'check'
      this.visible = true
      this.isShowAddCert = true
    },
    handleChange1(e, record, val) {
      const { key, type, max, min } = val
      const value =
        type === 'input'
          ? e?.target?.value
          : type === 'float'
          ? e?.target?.value
              .replace(/[^\d.]/g, '')
              .replace(/\.{2,}/g, '.')
              .replace('.', '$#$')
              .replace(/\./g, '')
              .replace('$#$', '.')
              .replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
              .replace(/^\./g, '')
          : type === 'int'
          ? e?.target?.value === ''
            ? e?.target?.value
            : e?.target?.value === '-'
            ? '-'
            : isNaN(Number(e?.target?.value))
            ? ''
            : Math.floor(e?.target?.value) > max
            ? max
            : Math.floor(e?.target?.value) < min
            ? min
            : Math.floor(e?.target?.value)
          : e?.target?.value.replace(/[^\d]/g, '')
      record[key] = value
    },
    handleChange(e, table, index, val) {
      const { key, type, max, min } = val
      const value =
        type === 'input'
          ? e?.target?.value
          : type === 'float'
          ? e?.target?.value
              .replace(/[^\d.]/g, '')
              .replace(/\.{2,}/g, '.')
              .replace('.', '$#$')
              .replace(/\./g, '')
              .replace('$#$', '.')
              .replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
              .replace(/^\./g, '')
          : type === 'int'
          ? e?.target?.value === ''
            ? e?.target?.value
            : e?.target?.value === '-'
            ? '-'
            : isNaN(Number(e?.target?.value))
            ? ''
            : Math.floor(e?.target?.value) > max
            ? max
            : Math.floor(e?.target?.value) < min
            ? min
            : Math.floor(e?.target?.value)
          : e?.target?.value.replace(/[^\d]/g, '')

      this.form[table][index][key || val] = value
      this.$forceUpdate()
    },
    handleAddTables(item) {
      if (!(this.form[item.data].length > 0)) {
        this.form[item.data] = []
      }
      const obj = JSON.parse(JSON.stringify({ ...item.default, ids: ppo.uuid() }))
      this.form[item.data] = [...this.form[item.data], obj]
      this.$forceUpdate()
    },
    handleDelRow(table, { ids }) {
      this.form[table] = this.form[table].filter((x) => x.ids !== ids)
      this.$forceUpdate()
    },
    showAddCert() {
      this.type = 'edit'
      this.info = null
      this.isShowAddCert = true
      this.visible = true
    },
    closeAddCert() {
      this.isShowAddCert = false
      this.visible = false
      this.$forceUpdate()
    },
    async Save(type) {
      const { merchantId: orgId } = this
      const vm = this
      vm.form.patentPictureInfoPOList = vm.patentPictureInfoPOList?.map((x) => {
        return { photoUrl: x }
      })
      vm.form.companyPictureCheckInfoPOList = vm.companyPictureCheckInfoPOList?.map((x) => {
        return { photoUrl: x }
      })
      vm.form.companyPerformanceInfoPOList = vm.companyPerformanceInfoPOList?.map((x) => {
        return { photoUrl: x }
      })
      vm.form.workshopPictureInfoPOList = vm.workshopPictureInfoPOList?.map((x) => {
        return { photoUrl: x }
      })
      const ret = await addMerchantOrgInfoExamine({ ...vm.form, vrUrl: encodeURIComponent(vm?.form?.vrUrl), orgId })
      if (ret.code === '0') {
        this.$message.success(ret.message)
        return !type ? vm.$message.success('保存成功') : true
      }
    },
    handleCancel() {
      this.$router.go(-1)
    },
    handleAudit() {
      const vm = this
      this.$confirm({
        title: '提示',
        content: '确定提交审核吗?',
        onOk: async () => {
          vm.$refs.form.validate((vaild) => {
            if (vaild) {
              const { merchantId: orgId } = vm
              addMerchantOrgInfoExamine({
                ...vm.form,
                vrUrl: encodeURIComponent(vm?.form?.vrUrl),
                orgId,
                authStatus: '2'
              }).then((ret) => {
                if (ret.code === '0') {
                  vm.$message.success('提交成功')
                  vm.$router.push({
                    name: 'SuppliersCertificationList'
                  })
                }
              })
            }
          })
        },
        onCancel: () => {}
      })
    },
    async addVR() {
      await this.Save(true)
      this.selectMaterialParam.showSelectMaterial = true
      this.$refs.selectMaterial.fetch(this.merchantId)
      // this.selectMaterialParam.manufacturerId = this.data.manufacturerId
    },
    handleVRCancel() {
      this.selectMaterialParam.showSelectMaterial = false
    },
    async handleVRCreate(checkedMaterialList) {
      // 选择素材(素材选择完成后自动跳转到编辑界面)
      // 创建作品参数
      const params = {
        materialIds: checkedMaterialList,
        merchantId: this.selectMaterialParam.manufacturerId
      }
      const res = await createProduction(params)
      if (res.success === true) {
        // 作品id
        const {
          data: { id }
        } = res
        // 关闭弹窗
        this.selectMaterialParam.showSelectMaterial = false
        // 跳转到编辑页面
        this.$router.push({
          path: '/editVR/' + id
        })
      } else {
        this.$message.error(res.message)
      }
    },
    vrDelete(vrId) {
      const pramse = { productionId: vrId }
      this.$confirm({
        title: '提示',
        content: '确定删除VR信息吗?',
        onOk: async () => {
          const res = await deleteProduction(pramse)
          if (res.success === true) {
            this.form.coverUrl = ''
          }
        },
        onCancel: () => {}
      })
    },
    async vrEdit(vrId) {
      const prams = {
        productionId: vrId
      }
      const res = await editProdction(prams)
      if (res.success === true) {
        // 作品id
        this.$router.push({ path: '/editVR/' + res.data })
      }
    },
    vrShow(vrUrl) {
      window.open(vrUrl, '_blank')
    }
  }
}
</script>
<style lang="less" scoped>
.factoryInspectionInformation {
  width: 100%;
  background: #ffffff;
  .header-title {
    margin-top: 30px;
    margin-bottom: 10px;
  }
  .vr-btn {
    display: inline-block;
    .ant-btn {
      margin-left: 20px;
    }
    span {
      margin-left: 10px;
    }
  }
}
.disInput {
  width: 436px;
  height: 32px;
  padding-left: 20px;
  background: #f5f5f5;
  margin-top: 4px;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  line-height: 32px;
}
.inp {
  width: 435px;
}
.content {
  display: flex;
  flex-direction: row;

  .upload {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: #ffffff;
    border-radius: 2px;

    .plus {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: rgba(255, 107, 0, 0.1);
      border-radius: 16px;

      .icon {
        font-size: 16px;
        color: #ff6b00;
      }
    }

    .text {
      margin-top: 4px;
      font-size: 12px;
      color: #262626;
      line-height: 16px;
    }
  }

  .message {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    margin-top: 39px;

    .title {
      font-size: 12px;
      color: #262626;
      line-height: 16px;
    }

    .other {
      font-size: 12px;
      color: #999999;
      line-height: 16px;
      margin-top: 45px;
    }
  }
}

.cretiticate {
  padding-top: 20px;

  display: flex;
  flex-direction: row;
  box-sizing: content-box;
  flex-wrap: wrap;
  .cert,
  .addcert {
    display: block;
    width: 100%;
    border-radius: 10px;
    border: 2px solid #eeeeee;
    padding-top: 10px;
    overflow: hidden;

    margin-left: 20px;
    margin-bottom: 20px;
  }
  .addcert {
    width: 236px;
    height: 260px;
    border: 2px dashed #eeee;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .addtext {
      margin-top: 10px;
      text-align: center;
      font-size: 24px;
      color: #ff6b00;
    }
  }
  /deep/.contant {
    background-color: #fff9f5;
    width: 100%;
    height: 100px;
    padding: 15px 10px;
    .certname {
      font-weight: 700;
    }
    .certstate {
      margin-left: 20px;
      background-color: #ffd7ba;
      color: #ff6b00;
      padding: 2px 10px;
      border-radius: 5px;
    }
    .certtime {
      margin-top: 10px;
    }
  }
}

.cert-box {
  width: 236px;
  height: 260px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  &:hover {
    border: 1px solid rgba(255, 107, 0, 0.3);
    border-radius: 8px;
    .delete {
      display: block;
    }
  }
  .delete {
    display: none;
    width: 40px;
    height: 40px;
    background: rgba(0, 0, 0, 0.64);
    border-radius: 50%;
    position: absolute;
    line-height: 40px;
    text-align: center;
    right: 5px;
    top: 5px;
    i {
      color: #fff;
    }
  }
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
        width: 80px;
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
      .button {
        margin-left: 20px;
        a + a {
          margin-left: 5px;
        }
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
.img-box {
  width: 236px;
  height: 270px;
  display: flex;
  flex-direction: column;
  .img {
    width: 236px;
    height: 169px;
  }
  .content {
    background: rgba(109, 108, 107, 0.04);
    height: 101px;
    display: flex;
    flex-direction: column;
    .title {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-top: 11px;
      .endtime {
        font-size: 12px;
        color: #999999;
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

.btns {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 100px 0 10px 0;
}
</style>
<style lang="less">
.factoryInspectionInformation .content1 {
  .img-table {
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 0;
    }
  }
  .ant-upload {
    background: #fff;
  }
  .ant-upload-list-picture .ant-upload-list-item,
  .ant-upload-list-picture-card .ant-upload-list-item {
    padding: 0;
  }
  .ant-upload-picture-card-wrapper {
    width: 40px;
  }
  .ant-upload.ant-upload-select-picture-card {
    width: 60px;
    height: 60px;
  }
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding: 10px;
  }
  .ant-upload-list-picture-card .ant-upload-list-item {
    width: 60px;
    height: 60px;
  }
  .ant-upload-list-picture-card-container {
    width: 60px;
    height: 60px;
  }
}
.tab-list {
  .ant-table-wrapper {
    margin-top: 8px;
    margin-bottom: 20px;
  }
  .ant-input-number {
    width: 100%;
    min-width: 80px;
  }
}
.vrContent {
  width: 102px;
  height: 102px;
  border: 1px dashed #dcdbdb;
  border-radius: 2px;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  .vrAddImg {
    width: 40px;
    height: 40px;
  }
}
.vrEchoContent {
  width: 100px;
  height: 100px;
  border: 1px dashed #dcdbdb;
  border-radius: 4px;
  overflow: hidden;
  .vrImg {
    width: 100%;
    height: 100%;
    border-radius: 4px;
  }
  .btnDown {
    height: 30px;
    line-height: 30px;

    text-align: center;
    color: #fff;
    position: relative;
    top: -127px;
    background: rgba(179, 175, 175, 0.3);
    transition: all 0.5s;
    .btnIcon {
      padding: 0 8px;
      font-size: 16px;
      cursor: pointer;
    }
  }
}
.vrEchoContent:hover {
  .btnDown {
    top: -100px;
  }
}
.s-import {
  display: inline-block;
  margin-left: 10px;
}
</style>
