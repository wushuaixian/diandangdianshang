<template>
  <div>
    <a-card>
      <a-form-model layout="inline" ref="ruleForm" :rules="rules" :model="queryParam">
        <a-row>
          <a-col :md="16" :sm="24" style="height: 60px">
            <a-form-model-item label="选择会员套餐" style="margin-left: 28px; height: 45px" prop="packageId">
              <div>
                <a-select
                  v-if="queryParam.packageId"
                  :disabled="$$($route.query, 'isDetails') === true"
                  v-model="queryParam.packageId"
                  :default-value="queryParam.packageId"
                  style="width: 269px"
                  @change="changeSelectList"
                  placeholder="请选择会员套餐"
                >
                  <a-select-option v-for="item in selectList" :key="item.id" :name="item.packageName" :value="item.id">
                    {{ item.packageName }}
                  </a-select-option>
                </a-select>
                <a-select
                  v-if="!queryParam.packageId"
                  style="width: 269px"
                  :disabled="$$($route.query, 'isDetails') === true"
                  @change="changeSelectList"
                  placeholder="请选择会员套餐"
                >
                  <a-select-option v-for="item in selectList" :key="item.id" :name="item.packageName" :value="item.id">
                    {{ item.packageName }}
                    <span></span>
                  </a-select-option>
                </a-select>
              </div>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="24" :sm="24" style="height: 130px">
            <a-form-model-item label="套餐logo" style="margin-left: 65px" prop="packageUrl">
              <div class="content">
                <s-upload
                  :accept="['image/bmp', 'image/jpg', 'image/png', 'image/jpeg', 'image/tiff']"
                  list-type="picture-card"
                  v-model="queryParam.packageUrl"
                  :disabled="true"
                >
                  <div class="upload" v-if="!queryParam.packageUrl">
                    <div class="plus">
                      <a-icon class="icon" type="plus" />
                    </div>
                    <div class="text">上传图片</div>
                  </div>
                </s-upload>
                <div class="message">
                  <div class="other">支持格式：bmp、tiff、gif、jpg、png、jpeg，图片大小不能超过4M</div>
                </div>
              </div>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="24" :sm="24" style="height: 55px">
            <a-form-model-item label="套餐原价" style="margin-left: 55px" prop="packageOriginalPrice">
              <a-input
                :disabled="true"
                style="width: 279px"
                :maxLength="10"
                v-model="queryParam.packageOriginalPrice"
                placeholder="请输入套餐原价"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="24" :sm="24" style="height: 55px">
            <a-form-model-item label="套餐有效期" style="margin-left: 40px" prop="packageStartTime">
              <a-date-picker
                v-model="queryParam.packageStartTime"
                :disabled="$$($route.query, 'isDetails') === true"
                show-time
                type="date"
                placeholder="请选择"
              />
              至
              <a-date-picker
                v-model="queryParam.packageEndTime"
                :disabled="$$($route.query, 'isDetails') === true"
                show-time
                type="date"
                placeholder="请选择"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="24" :sm="24" style="height: 55px">
            <a-form-model-item label="来源方式" style="margin-left: 55px" prop="sourceType">
              <div v-if="queryParam.sourceType">
                <a-select
                  v-if="queryParam.sourceType && $$($route.query, 'isUpdate')"
                  v-model="queryParam.sourceType"
                  style="width: 279px"
                  :options="orginType"
                  placeholder="请选择"
                >
                </a-select>
                <a-select
                  v-if="queryParam.sourceType && $$($route.query, 'isDetails')"
                  v-model="queryParam.sourceType"
                  :disabled="true"
                  style="width: 279px"
                  :options="orginType"
                  placeholder="请选择"
                >
                </a-select>
                <a-select
                  v-if="queryParam.sourceType && $$($route.query, 'isAdd')"
                  v-model="queryParam.sourceType"
                  style="width: 279px"
                  :options="orginType"
                  placeholder="请选择"
                >
                </a-select>
              </div>
              <a-select
                v-if="!queryParam.sourceType"
                :disabled="$$($route.query, 'isDetails') === true"
                style="width: 279px"
                :options="orginType"
                placeholder="请选择"
                @change="selectLaiyuan"
              >
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>

      <br />
      <MYadd v-show="$$($route.query, 'isAdd') === true" @getList="getList"></MYadd>
      <header-title class="header-title" style="margin-top: 20px">
        <span v-if="$$($route.query, 'isDetails') === true">套餐权益清单</span>
        <span v-else>选择供应商</span>
      </header-title>
      <!-- 详情页的table  start -->
      <s-table
        v-if="$$($route.query, 'isDetails') === true"
        :destroyOnClose="true"
        :bordered="true"
        :scroll="{ x: 'calc(300px + 50%)', y: 230 }"
        rowKey="index"
        ref="table"
        :columns="columnsDetails"
        :data="init"
        name="leaguerPackageDetail"
      >
        <template slot="authStatus" slot-scope="text, record">
          <span v-if="record.authStatus === '-1'">未认证</span>
          <span v-if="record.authStatus === '0'">待认证</span>
          <span v-if="record.authStatus === '1'">验证中</span>
          <span v-if="record.authStatus === '2'">认证中</span>
          <span v-if="record.authStatus === '3'">认证通过/审核通过</span>
          <span v-if="record.authStatus === '4'">认证不通过/审核拒绝</span>
        </template>
      </s-table>
      <!-- 详情页的table  end -->
      <s-table
        v-if="!$$($route.query, 'isDetails') === true"
        :destroyOnClose="true"
        :bordered="true"
        :scroll="{ x: 'calc(300px + 50%)', y: 230 }"
        rowKey="id"
        ref="table"
        :columns="columns"
        :customPage="true"
        :list="dataList"
        name="leaguerPackageDetail"
      >
        <template slot="authStatus" slot-scope="text, recored">
          <span v-if="recored.authStatus === '-1'">未认证</span>
          <span v-if="recored.authStatus === '0'">待认证</span>
          <span v-if="recored.authStatus === '1'">验厂中</span>
          <span v-if="recored.authStatus === '2'">认证中</span>
          <span v-if="recored.authStatus === '3'">认证通过</span>
          <span v-if="recored.authStatus === '4'">认证不通过</span>
        </template>
        <template v-if="$$($route.query, 'isAdd') === true" slot="operation" slot-scope="text, record">
          <a @click="Delete(record.id)">删除</a>
        </template>
      </s-table>

      <div class="save">
        <a-button
          v-if="!$$($route.query, 'isDetails') === true"
          type="primary"
          @click="save"
          style="margin-right: 15px"
        >
          保存
        </a-button>
        <a-button @click="revert">返回</a-button>
      </div>
    </a-card>
    <a-modal v-model="visibleDelete" title="删除" @ok="handleDelete">
      <p style="text-align: center">确认删除吗？</p>
    </a-modal>
  </div>
</template>
<script>
import {
  postPackageOrdersList,
  postPackageOrdersAdd,
  postPackageOrdersUpdate,
  postQueryAllPackages
} from '@/api/memberPackage'
import moment from 'moment'
import MYadd from './my-add.vue'
const rules = {
  packageId: [{ required: true, message: '请选择会员套餐', trigger: 'change' }],
  packageOriginalPrice: [{ required: true, message: '请选择套餐原价', trigger: 'change' }],
  packageStartTime: [{ required: true, message: '请选择套餐有效期', trigger: 'change' }],
  packageEndTime: [{ required: true, message: '请选择套餐有效期', trigger: 'change' }],
  sourceType: [{ required: true, message: '请选择来源方式', trigger: 'change' }],
  queryParam: [{ required: true, message: '请上传套餐logo', trigger: 'change' }]
}
export default {
  components: {
    // Tables,
    MYadd
  },
  data() {
    return {
      id: null,
      visibleDelete: false,
      dataList: [],
      selectList: [],
      queryParam: {
        packageId: null,
        packageUrl: null,
        packageOriginalPrice: '',
        packageStartTime: null,
        packageEndTime: null,
        sourceType: null
      },
      orginType: [
        {
          label: '线下购买',
          value: `2`
        },
        {
          label: '平台赠送',
          value: `3`
        }
      ],
      columns: [
        {
          title: '供应商名称',
          key: 'enterpriseName',
          dataIndex: 'enterpriseName'
        },
        {
          title: '供应商编码',
          dataIndex: 'orgCode',
          key: 'orgCode'
        },
        {
          title: '供应商状态',
          dataIndex: 'authStatus',
          key: 'authStatus',
          scopedSlots: { customRender: 'authStatus' }
        },
        { title: '操作', fixed: 'right', scopedSlots: { customRender: 'operation' } }
      ],
      columnsDetails: [
        {
          title: '套餐权益类型',
          key: 'equityType',
          dataIndex: 'equityType'
        },
        {
          title: '权益名称',
          dataIndex: 'equityName',
          key: 'equityName'
        },

        {
          title: '权益内容',
          dataIndex: 'equityValue',
          key: 'equityValue',
          scopedSlots: { customRender: 'equityValue' }
        }
      ],
      rules
    }
  },

  created() {
    // 查询会员套餐下拉框数据
    postQueryAllPackages({}).then((res) => {
      if (res.code === '0') {
        this.selectList = res.data

        // 判断是否编辑页跳转 详情页跳转
        if (this.$route.query.updateData || this.$route.query.dateilsData) {
          const queryData = this.$route.query?.updateData || this.$route.query?.dateilsData
          console.log(queryData)
          // 根据会员套餐名称获取会员套餐id
          let packageId
          let packageUrl
          this.selectList.forEach((e) => {
            if (e.packageName === queryData?.packageName) {
              packageId = e.id
              packageUrl = e.packageUrl
            }
          })
          // 时间分割处理
          const [startTime, endTime] = queryData.activeTime.split('~')
          const packageStartTime = startTime
          const packageEndTime = endTime
          this.queryParam = {
            packageId: packageId,
            packageUrl: packageUrl,
            packageOriginalPrice: queryData.packageOriginalPrice,
            packageStartTime: packageStartTime,
            packageEndTime: packageEndTime,
            sourceType: queryData.sourceType,
            merchantId: queryData.merchantId,
            isDeleted: 0,
            id: queryData.id
          }
          const data = {
            enterpriseName: queryData.enterpriseName,
            orgCode: queryData.orgCode,
            authStatus: queryData.authStatus
          }
          this.dataList.push(data)
        }
      }
    })
  },
  mounted() {},

  methods: {
    // 监听会员套餐下拉选择
    changeSelectList(id) {
      this.selectList.forEach((e) => {
        if (e.id === id) {
          this.queryParam.packageUrl = e.packageUrl
          this.queryParam.packageOriginalPrice = e.packageOriginalPrice
        }
      })
      this.queryParam.packageId = id
    },
    // 监听选择器变化
    chengeOrgintype(e) {
      this.queryParam.sourceType = e
    },
    // 获取列表详情页
    async init(options) {
      const dateilsData = this.$route.query.dateilsData
      const res = await postPackageOrdersList({
        ...options,
        orderNo: dateilsData.orderNo
      })
      console.log(res.data.poList)

      // const packageStartTime = dateilsData.activeTime.slice(0, 19)
      // const packageEndTime = dateilsData.activeTime.slice(0, 19)
      // let packageId
      // this.selectList.forEach((e) => {
      //   if (e.packageName === dateilsData.packageName) {
      //     packageId = e.id
      //   }
      // })
      // this.queryParam = {
      //   packageId: packageId,
      //   packageUrl: dateilsData.packageUrl,
      //   packageOriginalPrice: dateilsData.packageOriginalPrice,
      //   packageStartTime: packageStartTime,
      //   packageEndTime: packageEndTime,
      //   sourceType: dateilsData.sourceType
      // }
      // console.log(this.queryParam)
      return new Promise((resolve) => {
        return resolve({ code: '0', data: { ...res.data.poList } })
      })
    },
    // 添加-编辑页表格数据
    async getList(options) {
      this.dataList = [...options]
      console.log(this.dataList)
    },
    // 返回
    revert() {
      this.$router.go(-1)
    },
    // 保存
    save() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params
          const { queryParam } = this
          // 判断更新页保存
          if (this.$route.query.updateData) {
            const merchantIds = [queryParam.merchantId] || []
            params = {
              ...queryParam,
              merchantIds
            }
            const oDate1 = new Date(params.packageStartTime)
            const oDate2 = new Date(params.packageEndTime)
            if (oDate1.getTime() > oDate2.getTime()) {
              this.$message.info('结束时间必须大于开始时间')
              return
            }
            params.packageEndTime = moment(params.packageEndTime).format('yyyy-MM-DDTHH:mm:ss.SSS') + 'Z'
            params.packageStartTime = moment(params.packageStartTime).format('yyyy-MM-DDTHH:mm:ss.SSS') + 'Z'
            postPackageOrdersUpdate(params).then((res) => {
              if (res.code === '0') {
                this.$message.success('套餐调级成功')
                this.$router.push({ name: 'leaguerPackageDetailIndexReview' })
              }
            })
          } else {
            // 添加保存
            const { dataList } = this
            const ids = []
            dataList.map((e) => {
              ids.push(e.id)
            })
            params = {
              ...queryParam,
              merchantIds: ids
            }
            if (this.dataList.length < 1 || this.dataList === []) {
              this.$message.info('请选择供应商')
              return
            }
            const oDate1 = new Date(params.packageStartTime)
            const oDate2 = new Date(params.packageEndTime)
            if (oDate1.getTime() > oDate2.getTime()) {
              this.$message.info('结束时间必须大于开始时间')
              return
            }
            postPackageOrdersAdd(params).then((res) => {
              if (res.code === '0') {
                this.$message.success('保存成功')
                this.$router.push({ name: 'leaguerPackageDetailIndexReview' })
              }
            })
          }
        }
      })
    },
    // 删除
    Delete(id) {
      this.id = id
      this.visibleDelete = true
    },
    // 删除确认
    handleDelete() {
      this.dataList = this.dataList.filter((item) => item.id !== this.id)
      this.visibleDelete = false
    },

    // 监听来源方式
    selectLaiyuan(e) {
      this.queryParam.sourceType = e
    }
  }
}
</script>
<style lang="less" scoped>
.save {
  margin-top: 15px;
  text-align: center;
}
.header-title {
  margin-bottom: 16px;
}
.appeal-manage-list {
  .ant-card + .ant-card {
    margin-top: 20px;
  }
  .button {
    text-align: center;
  }
}
.content {
  height: 105px;
  display: flex;

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
</style>
