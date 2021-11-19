<template>
  <div class="comprofile">
    <header-title>
      <span>企业基本资质</span>
    </header-title>
    <div class="form">
      <a-form-model ref="ruleForm" :label-col="{ span: 4 }" :model="form" :rules="rules" :wrapper-col="{ span: 8 }">
        <a-form-model-item label="企业性质">
          {{ form.enterpriseProperty === '1' ? '生产商' : '贸易商' }}
          <!-- <a-radio-group v-model="form.enterpriseProperty" disabled>
            <a-radio value="1">生产商</a-radio>
            <a-radio value="2">贸易商</a-radio>
          </a-radio-group> -->
        </a-form-model-item>
        <a-form-model-item label="人员规模（人）" prop="staffAmount">
          <a-input-number v-model.number="form.staffAmount" :precision="0" :min="1" placeholder="请填写人员规模" />
        </a-form-model-item>
        <a-form-model-item label="办公，厂房总面积（㎡）" prop="plantArea">
          <a-input-number v-model="form.plantArea" :precision="2" :min="1" placeholder="请填写办公，厂房总面积" />
        </a-form-model-item>
        <a-form-model-item label="办公地址">
          <AreaSelect v-model="area" :selected.sync="areaCode" />
        </a-form-model-item>
        <a-form-model-item label="详细地址">
          <a-input v-model="form.officeAdressDetail" placeholder="请填写详细地址" />
        </a-form-model-item>
        <a-form-model-item label="所属集团">
          <a-input v-model="form.membershipGroup" placeholder="请填写所属集团" />
        </a-form-model-item>
        <a-form-model-item label="公司官网">
          <a-input v-model="form.companyWebsiteUrl" placeholder="请填写公司官网" />
        </a-form-model-item>
        <a-form-model-item label="土地性质">
          <a-radio-group v-model="form.landUseStatus">
            <a-radio value="0">租赁</a-radio>
            <a-radio value="1">自有</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="土地证明">
          <div class="content">
            <s-upload list-type="picture-card" v-model="form.landCertificateUrl">
              <div class="upload" v-if="!form.landCertificateUrl">
                <div class="plus">
                  <a-icon class="icon" type="plus" />
                </div>
                <div class="text">上传图片</div>
              </div>
            </s-upload>
            <div class="message">
              <div class="other">支持格式：bmp、tiff、gif、jpg、png、jpeg，文件大小不能超过1.5M</div>
            </div>
          </div>
        </a-form-model-item>
        <a-form-model-item label="公司电话" prop="companyPhone">
          <a-input v-model="form.companyPhone" placeholder="请填写公司电话，格式为0×××-×××××××" />
        </a-form-model-item>
        <a-form-model-item label="公司传真" prop="companyFax">
          <a-input v-model="form.companyFax" placeholder="请填写公司传真，格式为0×××-×××××××" />
        </a-form-model-item>
        <a-form-model-item class="shensu" label="企业概况" prop="enterpriseOverview">
          <a-textarea
            placeholder="请输入企业概况(该信息将在您的店铺中展示)"
            :rows="4"
            :max="30"
            :maxLength="500"
            v-model="form.enterpriseOverview"
            @change="appText"
          />
          <div style="position: absolute; right: 20px; top: -5px">{{ form.enterpriseOverview.length }}/500</div>
          <div v-show="caiActive" style="color: #f00; position: absolute; top: 18px">请输入企业概况</div>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div v-for="(item, tableIndex) in columns" :key="tableIndex" class="tab-list">
      <!-- <div class="tabTilte">{{ item.name }}</div> form.enterpriseProperty===1-->
      <header-title>
        <span>{{ item.name }}</span>
        <a-button type="primary" @click="handleAddTables(tableIndex)">添加</a-button>
      </header-title>
      <a-table :columns="item.columns" :data-source="data[tableIndex]" :pagination="false" rowKey="index" bordered>
        <template v-for="(col, indexs) in item.col" :slot="col.key" slot-scope="text, record, index">
          <div :key="col.key">
            <a-input
              v-if="col.type === 'input'"
              style="margin: -5px 0"
              :index="tableIndex"
              :value="text"
              :placeholder="`请填写${item.columns[indexs + 1].title}`"
              @change="(e) => handleChange(e, tableIndex, index, col)"
            />
            <a-input
              :placeholder="`请填写${item.columns[indexs + 1].title}`"
              v-if="col.type === 'number'"
              :maxLength="11"
              :value="text"
              @change="(e) => handleChange(e, tableIndex, index, col)"
            />

            <a-input
              :placeholder="`请填写${item.columns[indexs + 1].title}`"
              v-if="col.type === 'int'"
              :maxLength="11"
              :value="text"
              @change="(e) => handleChange(e, tableIndex, index, col)"
            />
            <a-input
              :placeholder="`请填写${item.columns[indexs + 1].title}`"
              v-if="col.type === 'float'"
              :maxLength="11"
              :value="text"
              @change="(e) => handleChange(e, tableIndex, index, col)"
            />
          </div>
        </template>
        <template slot="index" slot-scope="text, record, index">
          <div key="index">
            {{ index + 1 }}
          </div>
        </template>
        <template slot="operation" slot-scope="text, record, index">
          <a :index="tableIndex" @click="handleDelRow(tableIndex, index)">删除</a>
        </template>
      </a-table>
    </div>

    <div class="tabTilte">办公照片 支持格式：bmp、tiff、gif、jpg、png、jpeg，文件大小不能超过1.5M</div>
    <swiper-upload v-model="companyPictureInfoPOList" />
    <div class="tabTilte">历史业绩发票照片 支持格式：bmp、tiff、gif、jpg、png、jpeg，文件大小不能超过1.5M</div>
    <swiper-upload v-model="historyPerfBillPhotoInfoPOList" />
    <div class="tabTilte">历史业绩合同照片 支持格式：bmp、tiff、gif、jpg、png、jpeg，文件大小不能超过1.5M</div>
    <swiper-upload v-model="historyPerfContractPhotoInfoPOList" />
    <fixed-box>
      <a-button style="width: 200px; height: 50px" type="primary" @click="Save" size="large"> 保存 </a-button>
    </fixed-box>
  </div>
</template>
<script>
import AreaSelect from '@/components/AreaSelect'
import SwiperUpload from '@/components/SwiperUpload'
import {
  setAddenterpriseBasic,
  enterpriseBasicDetail,
  equipmentInventoryPage,
  productCapacityPage,
  inventoryCapacityInfoPage
} from '@/api/supplier'
const valiTel = (rule, value, callback) => {
  if (value.length > 0) {
    if (/^((0\d{2,3}-\d{7,8})|(1[0-9]\d{9}))$/.test(value)) {
      callback()
    } else {
      callback(new Error('请填写正确的电话号'))
    }
  } else {
    callback()
  }
}
const valiInt = (rule, value, callback) => {
  if (value.length > 0) {
    if (/^[+]{0,1}(\d+)$/.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正整数'))
    }
  } else {
    callback()
  }
}
const valiNumber = (rule, value, callback) => {
  if (value.length > 0) {
    if (Number(value) % 1 !== 0) {
      callback(new Error('请输入整数'))
    }
    if (Number(value) >= 0) {
      callback()
    } else {
      callback(new Error('请输入数字'))
    }
  } else {
    callback()
  }
}
const rules = {
  companyPhone: [
    {
      validator: valiTel,
      trigger: 'change'
    }
  ],
  companyFax: [
    {
      validator: valiTel,
      trigger: 'change'
    }
  ],
  staffAmount: [
    {
      validator: valiInt,
      trigger: 'change'
    }
  ],
  plantArea: [
    {
      validator: valiNumber,
      trigger: 'change'
    }
  ],
  enterpriseOverview: [
    {
      required: true, message: '请输入企业概况', trigger: 'blur'
    }
  ]
}
const columns1 = [
  {
    name: '设备清单',
    col: [
      { key: 'equipmentName', type: 'input' },
      { key: 'brand', type: 'input' },
      { key: 'model', type: 'input' },
      { key: 'number', type: 'int', max: 999999999, min: 1 },
      { key: 'durableYears', type: 'int', max: 9999, min: 1 }
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
  {
    name: '生产产值',
    col: [
      { key: 'productName', type: 'input' },
      // { key: 'monthlyCapacity', type: 'float' },
      { key: 'yearCapacity', type: 'float' }
    ],
    columns: [
      { title: '序号', width: '61px', dataIndex: 'index', scopedSlots: { customRender: 'index' } },
      { title: '产品名称', dataIndex: 'productName', scopedSlots: { customRender: 'productName' } },
      // {
      //   title: '月产值(万元)',
      //   dataIndex: 'monthlyCapacity',
      //   scopedSlots: { customRender: 'monthlyCapacity' }
      // },
      {
        title: '年产值(万元)',
        dataIndex: 'yearCapacity',
        scopedSlots: { customRender: 'yearCapacity' }
      },
      {
        title: '操作',
        key: 'action',
        width: '61px',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' }
      }
    ]
  }
]
const columns2 = [
  {
    name: '库存金额',
    col: [
      { key: 'productName', type: 'input' },
      { key: 'brand', type: 'float' }
    ],
    columns: [
      { title: '序号', width: '61px', dataIndex: 'index', scopedSlots: { customRender: 'index' } },
      { title: '产品名称', dataIndex: 'productName', scopedSlots: { customRender: 'productName' } },
      { title: '库存金额(万元)', dataIndex: 'brand', scopedSlots: { customRender: 'brand' } },
      { title: '操作', width: '61px', dataIndex: 'operation', scopedSlots: { customRender: 'operation' } }
    ]
  }
]
const columns = []
const info = [
  {
    equipmentName: '',
    brand: '',
    model: '',
    number: '',
    durableYears: ''
  },
  {
    productName: '',
    monthlyCapacity: '',
    yearCapacity: ''
  },
  {
    productName: '',
    brand: ''
  }
]
export default {
  components: { AreaSelect, SwiperUpload },
  created() {
    this.BindData()
  },

  data() {
    return {
      list: [],
      area: null,
      areaCode: null,
      form: {
        enterpriseProperty: '1',
        staffAmount: '',
        plantArea: '',
        officeAdressDetail: '',
        membershipGroup: '',
        companyWebsiteUrl: '',
        landUseStatus: '0',
        companyPhone: '',
        companyFax: '',
        landCertificateUrl: '',
        officeAdressProvince: '',
        officeAdressProvinceCode: '',
        officeAdressCity: '',
        officeAdressCityCode: '',
        officeAdressArea: '',
        officeAdressAreaCode: '',
        equipmentInventoryInfoPOList: [],
        productCapacityInfoPOList: [],
        inventoryCapacityInfoPOList: [],
        companyPictureInfoPOList: [],
        historyPerfBillPhotoInfoPOList: [],
        historyPerfContractPhotoInfoPOList: [],
        enterpriseOverview: ''
      },
      companyPictureInfoPOList: [],
      historyPerfBillPhotoInfoPOList: [],
      historyPerfContractPhotoInfoPOList: [],
      data: [[], [], []],
      columns,
      columns1,
      columns2,
      rules,
      editingKey: '',
      fileList: [],
      previewVisible: false,
      previewImage: '',
      caiActive: false
    }
  },
  methods: {
    handleAddTables(i) {
      const length = this.data[i]?.length
      this.data[i].push({ ...info[i], index: length + 1 })
      this.$forceUpdate()
    },
    async BindData() {
      const res = await enterpriseBasicDetail()
      if (res.data?.enterpriseProperty === '1') {
        this.columns = this.columns1
      } else {
        this.columns = this.columns2
      }
      if (res.code === '0') {
        const { officeAdressProvinceCode = 0, officeAdressCityCode = 0, officeAdressAreaCode = 0 } = res.data
        this.form = { ...res.data }
        if (officeAdressProvinceCode && officeAdressCityCode && officeAdressAreaCode) {
          this.area = [Number(officeAdressProvinceCode), Number(officeAdressCityCode), Number(officeAdressAreaCode)]
        }
        this.companyPictureInfoPOList = res.data.companyPictureInfoPOList.map((x) => x.photoUrl)
        this.historyPerfBillPhotoInfoPOList = res.data.historyPerfBillPhotoInfoPOList.map((x) => x.photoUrl)
        this.historyPerfContractPhotoInfoPOList = res.data.historyPerfContractPhotoInfoPOList.map((x) => x.photoUrl)
      }
      if (res.data?.enterpriseProperty === '1') {
        const res1 = await equipmentInventoryPage({ currentPage: 1, itemsPerPage: 10 })
        if (res1.code === '0') {
          if (res1.data.total > 0) {
            this.data[0] = res1.data.listObj
          }
        }
        const res2 = await productCapacityPage({ currentPage: 1, itemsPerPage: 10 })
        if (res2.code === '0') {
          if (res2.data.total > 0) {
            this.data[1] = res2.data.listObj
          }
        }
      } else if (res.data?.enterpriseProperty === '2') {
        const res3 = await inventoryCapacityInfoPage({ currentPage: 1, itemsPerPage: 10 })
        if (res3.code === '0') {
          if (res3.data.total > 0) {
            this.data[0] = res3.data.listObj.map((x) => {
              return {
                ...x,
                brand: Number(x.brand)
              }
            })
          }
        }
      }
      this.$forceUpdate()
    },
    Save() {
      console.log(11111)
      this.form.equipmentInventoryInfoPOList = []
      this.form.productCapacityInfoPOList = []
      this.form.inventoryCapacityInfoPOList = []
      this.form.companyPictureInfoPOList = []
      this.form.historyPerfBillPhotoInfoPOList = []
      this.form.historyPerfContractPhotoInfoPOList = []
      const {
        form: { enterpriseProperty }
      } = this
      if (enterpriseProperty === '1') {
        this.form.equipmentInventoryInfoPOList = this.data[0].filter(
          (x) => x.equipmentName || x.brand || x.model || x.number || x.durableYears
        )
        for (let i = 0; i < this.data[1].length; i++) {
          if (
            !(
              this.data[1][i].productName === '' &&
              this.data[1][i].monthlyCapacity === '' &&
              this.data[1][i].yearCapacity === ''
            )
          ) {
            this.form.productCapacityInfoPOList.push(this.data[1][i])
          }
        }
      } else if (enterpriseProperty === '2') {
        this.form.inventoryCapacityInfoPOList = this.data[0].filter((x) => x.productName || x.brand)
      }

      this.form.companyPictureInfoPOList = this.companyPictureInfoPOList.map((x) => {
        return { photoUrl: x }
      })
      this.form.historyPerfBillPhotoInfoPOList = this.historyPerfBillPhotoInfoPOList.map((x) => {
        return { photoUrl: x }
      })
      this.form.historyPerfContractPhotoInfoPOList = this.historyPerfContractPhotoInfoPOList.map((x) => {
        return { photoUrl: x }
      })
      console.log(22222222)
      setAddenterpriseBasic(this.form).then((ret) => {
        if (ret.code === '0') {
          this.$message.success('保存成功')
        }
      })
    },
    handleChange(e, tableIndex, index, { key, type, min, max }) {
      console.log(type)
      this.data[tableIndex][index][key] =
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
      // .replace(/[^\d]/g, '')
      //      this.data[Number(e.target.attributes['index'].value)][index][key] = e?.target?.value || e
      this.$forceUpdate()
    },
    handleDelRow(tableIndex, index) {
      this.data[tableIndex].splice(index, 1)
      this.$forceUpdate()
    },
    appText() {
      if (this.form.enterpriseOverview.length > 0) {
        this.caiActive = false
      }
    }
  },
  watch: {
    'form.historyPerfContractPhotoInfoPOList': {
      handler(val) {
        console.log(val)
      },
      deep: true
    },
    areaCode: {
      handler(val, oldVal) {
        if (val) {
          if (val.length === 3) {
            this.form.officeAdressProvince = val[0].name
            this.form.officeAdressProvinceCode = val[0].code
            this.form.officeAdressCity = val[1].name
            this.form.officeAdressCityCode = val[1].code
            this.form.officeAdressArea = val[2].name
            this.form.officeAdressAreaCode = val[2].code
            console.log(this.form)
          }
        }
      },
      deep: true
    }
  }
}
</script>
<style lang="less" scoped>
.comprofile {
  .content {
    display: flex;
    flex-direction: row;

    .message {
      display: flex;
      flex-direction: column;
      margin-left: 10px;
      margin-top: 80px;

      .title {
        font-size: 12px;
        color: #262626;
        line-height: 16px;
      }

      .other {
        font-size: 12px;
        color: #999999;
        line-height: 16px;
        margin-top: 4px;
      }
    }
  }
  .tabTilte {
    padding: 40px 0 10px 0;
    margin-bottom: 10px;
    border-bottom: 1px solid #e5e5e5;
    font-weight: 600;
    color: #262626;
    &::before {
      content: '';
      width: 4px;
      height: 16px;
      display: inline-block;
      background: #ff6b00;
      border-radius: 2px;
      margin-right: 10px;
      position: relative;
      top: 2px;
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
  .ant-input-number {
    width: 100%;
  }
  .tab-list {
    .ant-table-wrapper {
      margin-top: 8px;
      margin-bottom: 20px;
    }
    .ant-input-number {
      width: 100%;
      min-width: 120px;
    }
  }
}
</style>
