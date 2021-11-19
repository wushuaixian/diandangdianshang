<template>
  <div class="mid">
    <div class="header">
      <a-card :bordered="false">
        <header-title>
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
          <a-form-item label="验厂报告" :labelCol="apart" :wrapperCol="format">
            <!-- <img class="avatar" :src="datalist.factoryAuditReportUrl" /> -->
            <ImagePreview :value="datalist.factoryAuditReportUrl" />
          </a-form-item>
          <a-form-item label="考察结果说明" :labelCol="apart" :wrapperCol="format">
            <span>{{ datalist.remark }}</span>
          </a-form-item>
        </a-form>
      </a-card>
      <a-card type="inner" :bordered="false">
        <header-title>
          <span>综合评审情况</span>
        </header-title>
        <s-table ref="table" name="TheAuthInfoTable1" :data="init" :columns="goodsColumns"> </s-table>
      </a-card>
      <a-card type="inner" :bordered="false">
        <header-title>
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
            <span v-if="datalist.landUseStatus === '1'">租赁</span>
            <span v-if="datalist.landUseStatus === '2'">自有</span>
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
        <header-title>
          <span>关联企业</span>
        </header-title>
        <s-table :data="initEnterprises" name="TheAuthInfoTable2" :columns="columns">
          <template slot="enterpriseProveUrl" slot-scope="enterpriseProveUrl">
            <ImagePreview :width="50" :height="40" :value="enterpriseProveUrl" />
          </template>
        </s-table>
        <div v-if="datalist.enterpriseNature === '1'">
          <header-title>
            <span>设备清单</span>
          </header-title>
          <s-table :data="initEquipment" name="TheAuthInfoTable3" :columns="equipmentcolumns"> </s-table>
          <header-title>
            <span>生产产能</span>
          </header-title>
          <s-table :data="initpage" name="TheAuthInfoTable4" :columns="capacitycolumns"> </s-table>
        </div>
        <div v-else>
          <header-title>
            <span>库存金额</span>
          </header-title>
          <s-table :data="initList" name="TheAuthInfoTable5" :columns="columns2"> </s-table>
        </div>
      </a-card>
      <a-card type="inner" :bordered="false">
        <header-title>
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
        <header-title>
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
              <ImagePreview :value="item.img" :width="200" :height="152" />
            </div>
          </swiper-list>
          <a-empty v-else />
        </div>
        <header-title>
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
        <header-title>
          <span>车间/厂房/库房照片</span>
        </header-title>
        <div class="files-mains">
          <swiper-list
            v-if="$$(datalist, 'workshopPictureInfoPOList') && datalist.workshopPictureInfoPOList.length > 0"
            :list="datalist.workshopPictureInfoPOList"
            v-slot:default="{ item }"
          >
            <div class="img-box-box">
              <ImagePreview :value="item.img" :width="200" :height="152" />
            </div>
          </swiper-list>
          <a-empty v-else />
        </div>
      </a-card>

      <div class="class-btn">
        <a-button class="save-btn" type="primary">保存</a-button>
        <a-button @click="$router.back()">返回</a-button>
      </div>
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
  supplierbusiness,
  productCapacityPage
} from '@/api/supplier'
import { qualificationCertificate, businessCategory } from '@/api/supplieAuthAdmin'
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
  {
    title: '月产能',
    dataIndex: 'monthlyCapacity',
    scopedSlots: { customRender: 'monthlyCapacity' }
  },
  {
    title: '年产量',
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
  components: {
    Popup,
    swiperList,
    ImagePreview,
    submitExamine,
    supplieraudits
  },
  data() {
    return {
      popupStatus: false,
      apart,
      format,
      capacitycolumns,
      equipmentcolumns,
      columns,
      columns2,
      form: this.$form.createForm(this),
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
      datalistsupplierbusiness: []
    }
  },
  created() {
    this.get()
  },
  mounted() {
    this.detailed()
    this.supplierbusiness()
  },
  methods: {
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
      try {
        const { data } = await supplierDetailo({
          orgId: this.list.merchantId
        })
        this.datalist = data
        this.$forceUpdate()
      } catch (err) {
        console.log(err)
      }
    },
    // 工商信息展示数据
    async supplierbusiness() {
      try {
        const { data } = await supplierbusiness({
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
    }
  },
  computed: {}
}
</script>

<style lang="less" scoped>
.mid {
  margin: 0;
  padding: 0;
  width: 100%;
  .table-list {
    .table-wrapper {
      margin-bottom: 30px;
    }
  }
  .header {
    width: 100%;
    height: auto;
    .vrimgs {
      width: 600px;
      height: auto;
      margin-top: 20px;
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
