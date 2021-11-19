<template>
  <div>
    <a-card>
      <a-form-model layout="inline" ref="ruleForm" :rules="rules" :model="queryParam">
        <a-row>
          <a-col :md="8" :sm="24" style="height: 60px">
            <a-form-model-item label="选择会员套餐" style="margin-left: 28px; height: 45px" prop="packageId">
              <a-select
                :disabled="true"
                v-model="queryParam.packageId"
                v-if="queryParam.packageId"
                style="width: 269px"
                allowClear
                placeholder="请选择会员套餐"
              >
                <a-select-option v-for="item in selectList" :key="item.id" :name="item.packageName" :value="item.id">
                  {{ item.packageName }}
                </a-select-option>
              </a-select>
              <a-select
                :disabled="true"
                v-else
                style="width: 269px"
                allowClear
                @change="changeSelectList"
                placeholder="请选择会员套餐"
              >
                <a-select-option v-for="item in selectList" :key="item.id" :name="item.packageName" :value="item.id">
                  {{ item.packageName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="24" :sm="24" style="height: 130px">
            <a-form-model-item label="企业logo" style="margin-left: 65px" prop="packageUrl">
              <div class="content">
                <div style="width: 102px; height: 102px; border: 1px solid gray">
                  <img :src="queryParam.packageUrl" />
                </div>
                <div class="message">
                  <div class="other">支持格式：bmp、tiff、gif、jpg、png、jpeg，图片大小不能超过4M</div>
                </div>
              </div>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="12" :sm="24" style="height: 55px">
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
          <a-col :md="12" :sm="24" style="height: 55px">
            <a-form-model-item label="套餐有效期" style="margin-left: 40px" prop="packageEndTime">
              <a-date-picker :disabled="true" show-time type="date" placeholder="开始" @change="startTime" /> 至
              <a-date-picker :disabled="true" show-time type="date" placeholder="结束" @change="endTime" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :md="12" :sm="24" style="height: 55px">
            <a-form-model-item label="来源方式" style="margin-left: 55px" prop="sourceType">
              <a-select
                v-if="queryParam.sourceType"
                v-model="queryParam.sourceType"
                :disabled="true"
                style="width: 279px"
                :options="orginType"
                placeholder="请选择"
              >
              </a-select>
              <a-select
                v-else
                :disabled="true"
                style="width: 279px"
                :options="orginType"
                placeholder="请选择"
                @change="chengeOrgintype"
              >
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>

      <br />
      <header-title class="header-title" style="margin-top: 20px">
        <span>套餐权益清单</span>
      </header-title>
      <s-table
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
        <template slot="authStatus" slot-scope="text, record">
          <span v-if="record.authStatus === '-1'">未认证</span>
          <span v-if="record.authStatus === '0'">待认证</span>
          <span v-if="record.authStatus === '1'">验证中</span>
          <span v-if="record.authStatus === '2'">认证中/待审核</span>
          <span v-if="record.authStatus === '3'">认证通过/审核通过</span>
          <span v-if="record.authStatus === '4'">认证不通过/审核拒绝</span>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a @click="Delete(record.id)">删除</a>
        </template>
      </s-table>
      <div class="save">
        <a-button @click="revert">返回</a-button>
      </div>
    </a-card>
    <a-modal v-model="visibleDelete" title="删除" @ok="handleDelete">
      <p style="text-align: center">确认删除吗？</p>
    </a-modal>
  </div>
</template>
<script>
// import Tables from '../../components/Tables.vue'

import { postPackageOrdersList, postPackageOrdersAdd, postQueryAllPackages } from '@/api/memberPackage'
import { formatDate } from '@/utils/util'
// import MYadd from './my-add.vue'
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
    // MYadd
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
        sourceType: ''
      },
      orginType: [
        {
          label: '线下购买',
          value: '1'
        },
        {
          label: '平台赠送',
          value: '2'
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
      rules
    }
  },
  created() {
    if (this.$route.query.isUpdate) {
      this.queryParam = this.$route.query.itemData
      this.dataList = [this.$route.query.itemData]
      console.log(this.dataList)
    }
    // 查询会员套餐下拉框数据
    postQueryAllPackages({}).then((res) => {
      console.log(res.data)

      if (res.code === '0') {
        this.selectList = res.data
      }
    })
  },
  mounted() {},
  methods: {
    // 监听switch变化
    changeSwich() {},
    // 监听会员套餐下拉选择
    changeSelectList(e) {
      this.queryParam.packageId = e
      console.log(e)
    },
    // 监听选择器变化
    chengeOrgintype(e) {
      this.queryParam.sourceType = e
    },
    // 获取列表
    getList(options) {
      postPackageOrdersList({}).then((res) => {
        console.log()
      })
    },
    // 返回
    revert() {
      this.$router.go(-1)
    },
    // 保存
    save() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const { dataList } = this
          const ids = []
          dataList.map((e) => {
            console.log(e.id)
            ids.push(e.id)
          })
          const params = {
            ...this.queryParam,
            merchantIds: ids
          }

          postPackageOrdersAdd(params).then((res) => {
            console.log(res)
            if (res.code === '0') {
              this.$message.success('保存成功')
              this.$router.push({ name: 'leaguerPackageDetailIndex' })
            }
          })
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
    // 监听开始时间
    startTime(val) {
      console.log(val)
      this.queryParam.packageStartTime = formatDate(val._d)
    },
    // 监听结束时间
    endTime(val) {
      this.queryParam.packageEndTime = formatDate(val._d)
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
