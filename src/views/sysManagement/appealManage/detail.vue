<template>
  <div class="appeal-detail">
    <a-card>
      <header-title>
        <span>申诉信息</span>
      </header-title>
      <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="申诉类型">
          <a-checkbox-group disabled :value="$$(info, 'indComplainType').split(',')">
            <a-row>
              <a-col :span="8">
                <a-checkbox value="1"> 工商信息 </a-checkbox>
              </a-col>
              <a-col :span="8">
                <a-checkbox value="2"> 主营品类 </a-checkbox>
              </a-col>
              <a-col :span="8">
                <a-checkbox value="3"> 企业性质 </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item label="申诉内容">
          <a-textarea disabled :value="$$(info, 'complaintContent')" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-form-item>
        <a-form-item label="申诉附件" v-if="$$(info, 'complaintUrls')">
          <div class="previews-img">
            <ImagePreview v-for="(item, i) of info.complaintUrls" :key="i" :value="item" />
          </div>
        </a-form-item>
        <a-form-item label="主营品类">
          <tree-select
            disabled
            :collapseTags="false"
            :normalizer="normalizer"
            :options="categoryList"
            v-model="info.categoryIdRepeat"
          ></tree-select>
        </a-form-item>
        <a-form-item label="企业性质">
          {{
            $$(
              enterpriseNatureList.find((x) => Number(x.value) === Number(info.enterpriseNatureRepeat)),
              'label'
            )
          }}
        </a-form-item>
      </a-form>
    </a-card>
    <a-card>
      <header-title>
        <span>工商信息</span>
      </header-title>
      <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="营业执照" v-if="$$(info, 'indComplainType').includes('1') && !isDisabled">
          <s-upload v-model="info.businessLicenceUrl" list-type="picture-card" @change="getComDetailWithOCR">
            <div class="upload" v-if="!info.businessLicenceUrl">
              <div class="plus">
                <img :src="require('@/assets/images/enterprise/plus.png')" alt="" />
              </div>
              <div class="text">上传图片</div>
            </div>
          </s-upload>
          <div style="color: red" v-show="showOCRError">请上传正确清晰的营业执照</div>
          <div class="uploadTishi">文件格式支持：bmp，tiff，jpg，jpeg，png 文件大小不能超过1.5M</div>
          <span>请上传营业执照（副本）原件或盖公章复印件</span>
        </a-form-item>
        <a-form-item label="营业执照" v-else>
          <ImagePreview :value="info.businessLicenceUrl" />
        </a-form-item>
        <a-form-item label="授权委托书" v-if="$$(info, 'indComplainType').includes('1') && !isDisabled">
          <s-upload v-model="info.powerOfAttorneyUrl" list-type="picture-card">
            <div class="upload" v-if="!info.powerOfAttorneyUrl">
              <div class="plus">
                <img :src="require('@/assets/images/enterprise/plus.png')" alt="" />
              </div>
              <div class="text">上传图片</div>
            </div>
          </s-upload>
          <div class="uploadTishi">文件格式支持：bmp，tiff，jpg，jpeg，png 文件大小不能超过1.5M</div>
          <a class="colorF" href="/files/shouquan.doc" download="授权委托书.doc">《授权委托书模板下载》</a>
        </a-form-item>
        <a-form-item label="授权委托书" v-else>
          <ImagePreview :value="info.powerOfAttorneyUrl" />
        </a-form-item>
        <a-form-item label="企业名称">
          <a-input v-model="info.enterpriseName" disabled></a-input>
        </a-form-item>
        <a-form-item label="统一社会信用代码">
          <a-input v-model="info.businessLicenceNo" disabled></a-input>
        </a-form-item>
        <a-form-item label="法定代表人">
          <a-input v-model="info.legalPersonName" :disabled="isDisabled"></a-input>
        </a-form-item>
        <a-form-item label="公司类型">
          <a-input v-model="info.enterpriseType" :disabled="isDisabled"></a-input>
        </a-form-item>
        <a-form-item label="成立日期">
          <a-date-picker v-model="info.businessLicencePeriodBegin" :disabled="isDisabled" />
        </a-form-item>
        <a-form-item label="截止日期">
          <a-date-picker v-model="info.businessLicencePeriodEnd" :disabled="isDisabled" />
        </a-form-item>
        <a-form-item label="注册资金(万元)">
          <a-input v-model="info.registeredCapital" :disabled="isDisabled" />
          <!-- :formatter="(value) => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="(value) => value.replace(/\￥\s?|(,*)/g, '')" -->
        </a-form-item>
        <a-form-item label="经营范围">
          <a-textarea v-model="info.businessScope" :disabled="isDisabled" :auto-size="{ minRows: 3, maxRows: 5 }" />
        </a-form-item>
        <a-form-item label="注册地址">
          <AreaSelect v-model="register" :disabled="isDisabled" :selected.sync="selected" />
        </a-form-item>
        <a-form-item label="详细地址">
          <a-input v-model="info.registeredDetailAddress" :disabled="isDisabled"></a-input>
        </a-form-item>
        <a-form-item label="主营品类">
          <tree-select
            disabled
            :collapseTags="false"
            :normalizer="normalizer"
            :options="categoryList"
            v-model="info.categoryId"
          ></tree-select>
        </a-form-item>
      </a-form>
    </a-card>

    <fixed-box v-if="$$(info, 'complaintStatus') === '0'">
      <a-button
        type="primary"
        :disabled="isSubmit"
        @click="
          visible = true
          radioValue = 1
        "
      >
        处理
      </a-button>
      <a-button @click="handleCancel"> 返回 </a-button>
    </fixed-box>
    <ExaminePopup :default-value="radioValue" :popupStatus.sync="visible" @submitExamine="onSave" />
  </div>
</template>

<script>
// import ImagePreview from '@/components/ImagePreview'
import { AreaSelect, ImagePreview, ExaminePopup } from '@/components/'
import { getDetail, updateAppealManage } from '@/api/appealManage'
import { queryTreeAllCategory, ocrBusinessLicense } from '@/api/user.js'
import moment from 'moment'
export default {
  components: { ImagePreview, AreaSelect, ExaminePopup },
  data() {
    return {
      actions: new Map([
        [
          '1',
          () => {
            // console.log(this)
          }
        ],
        [
          '2',
          () => {
            this.info.categoryId = this.info.categoryIdRepeat
          }
        ],
        [
          '3',
          () => {
            this.info.enterpriseNature = this.info.enterpriseNatureRepeat
          }
        ]
      ]),
      enterpriseNatureList: [
        { label: '生产商', value: '1' },
        { label: '贸易商', value: '2' }
      ],
      visible: false,
      info: {},
      selected: [],
      radioValue: 1,
      register: [],
      categoryList: [],
      normalizer(node) {
        return {
          id: node?.id,
          label: node?.name,
          children: node?.children || undefined,
          isDisabled: node.level !== 2
        }
      },
      showOCRError: false,
      ocrInfo: null
    }
  },
  computed: {
    isDisabled() {
      return this.info?.complaintStatus !== '0'
    },
    isSubmit() {
      return !this.info?.powerOfAttorneyUrl || !this.info?.businessLicenceUrl
    }
  },
  mounted() {
    this.getDetail()
    this.queryAllCategory()
  },
  methods: {
    async queryAllCategory() {
      const res = await queryTreeAllCategory()
      if (res.code === '0') {
        this.categoryList = res.data
      }
    },
    async getDetail() {
      const id = this.$route.params.id
      const res = await getDetail({ id })
      if (res.code === '0') {
        const {
          businessLicencePeriodBegin,
          businessLicencePeriodEnd,
          registeredProvinceCode,
          registeredCityCode,
          registeredRegionCode
        } = res.data
        this.info = {
          ...res.data,
          businessLicencePeriodBegin: businessLicencePeriodBegin ? moment(businessLicencePeriodBegin) : null,
          businessLicencePeriodEnd: businessLicencePeriodEnd ? moment(businessLicencePeriodEnd) : null
        }
        if (registeredProvinceCode && registeredCityCode && registeredRegionCode) {
          this.register = [Number(registeredProvinceCode), Number(registeredCityCode), Number(registeredRegionCode)]
        }
      }
    },
    handlePreview(url) {
      const {
        info: { complaintUrls }
      } = this
      const currentIndex = complaintUrls?.findIndex((x) => x === url)
      this.$refs.preview.customShow(complaintUrls, currentIndex)
    },
    handleCancel() {
      this.$router.go(-1)
    },
    handleConfirm() {
      this.visible = true
    },
    async getComDetailWithOCR() {
      if (this.info.businessLicenceUrl !== '') {
        this.showOCRError = false
        const ret = await ocrBusinessLicense(this.info.businessLicenceUrl)
        if (ret.code === '0') {
          if (ret.data.statusCode === 200) {
            this.ocrInfo = ret?.data
            this.info.enterpriseName = ret?.data?.name
            this.info.businessLicenceNo = ret?.data?.reg_num
            this.info.legalPersonName = ret?.data?.person
            this.info.enterpriseType = ret?.data?.type
            this.info.businessLicencePeriodBegin = this.moment(ret?.data?.establish_date)
            // new Date(Number(ret?.data?.establish_date))
            this.info.registeredCapital = ret?.data?.capital
            this.info.businessScope = ret?.data?.business
            this.info.registeredDetailAddress = ret?.data?.address
            this.register = []
            this.showOCRError = false
          } else {
            this.showOCRError = true
          }
        } else {
          this.showOCRError = true
        }
      }
    },
    async onSave(complaintStatus, rejectReason) {
      this.info.indComplainType.split(',').forEach((x) => {
        this.actions.get(x).call(this)
      })
      const { info, selected } = this
      const params = {
        ...info
      }
      if (selected.length === 3) {
        ;['registeredProvince', 'registeredCity', 'registeredRegion'].forEach((x, i) => {
          params[`${x}Code`] = selected[i]?.code
          params[`${x}Name`] = selected[i]?.name
        })
      }
      const res = await updateAppealManage({ ...params, complaintStatus, rejectReason })
      if (res.code === '0') {
        this.$message.success('操作成功')
        this.$router.push({ name: 'AppealManageList' })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.appeal-detail {
  .previews-img {
    display: flex;
    .image-preview {
      margin-left: 20px;
      &:first-child {
        margin-left: 0;
      }
    }
  }
  .ant-checkbox-group {
    width: 100%;
    line-height: inherit;
  }
  .ant-card + .ant-card {
    margin-top: 20px;
  }
  /deep/.atn-card {
    .ant-card-head {
      .ant-card-head-wrapper {
        .ant-card-head-title {
          &::before {
            content: 'a ';
          }
        }
      }
    }
  }
  .ant-form {
    margin-top: 20px;
    img {
      width: 80px;
      height: 80px;
    }
    .ant-calendar-picker,
    .ant-input-number {
      width: 100%;
    }
  }
}
</style>
