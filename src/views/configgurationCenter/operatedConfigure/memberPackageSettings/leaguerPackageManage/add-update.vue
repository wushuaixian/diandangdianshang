<template>
  <div>
    <a-card>
      <div class="table-page-search-wrapper">
        <header-title class="header-title">
          <span>套餐基本信息</span>
        </header-title>

        <a-form-model :rules="rules" :model="programmeQuery" layout="inline" ref="ruleForm">
          <a-row>
            <a-col :md="3" :sm="24"> </a-col>
            <a-col :md="7" :sm="24" style="height: 55px">
              <a-form-model-item label="套餐名称" prop="packageName">
                <a-input
                  :maxLength="20"
                  v-model="programmeQuery.packageName"
                  sgtyle="width:70%;"
                  placeholder="请输入套餐名称"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row style="height: 130px">
            <a-col :md="3" :sm="24"> </a-col>
            <a-col :md="12" :sm="24">
              <a-form-model-item ref="refPackageUrl" label="套餐logo" style="margin-left: 12px" prop="packageUrl">
                <div class="content">
                  <s-upload
                    :accept="['image/bmp', 'image/jpg', 'image/png', 'image/jpeg', 'image/tiff']"
                    list-type="picture-card"
                    v-model="programmeQuery.packageUrl"
                  >
                    <div class="upload" v-if="!programmeQuery.packageUrl">
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
            <a-col :md="3" :sm="24"> </a-col>
            <a-col :md="8" :sm="24" style="height: 55px">
              <a-form-model-item label="套餐原价" prop="packageOriginalPrice">
                <div style="display: flex">
                  <a-input-number
                    style="folat: left; width: 80%"
                    :maxLength="10"
                    :precision="2"
                    :min="1"
                    v-model="programmeQuery.packageOriginalPrice"
                    placeholder="请输入套餐原价"
                  />
                  &nbsp;
                  <span>元/年</span>
                </div>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :md="2" :sm="24"> </a-col>
            <a-col :md="9" :sm="24" style="height: 55px">
              <a-form-model-item label="套餐首年优惠价" prop="packageDiscountPrice" style="margin-left: 12px">
                <div style="display: flex">
                  <a-input-number
                    style="folat: left; width: 80%"
                    :precision="2"
                    :min="1"
                    :maxLength="10"
                    v-model="programmeQuery.packageDiscountPrice"
                    placeholder="请输入套餐首年优惠价"
                  />
                  &nbsp;
                  <span style="float: right">元/年</span>
                </div>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :md="3" :sm="24"> </a-col>
            <a-col :md="6" :sm="24">
              <a-form-model-item label="套餐状态" style="margin-left: 12px">
                <a-switch
                  :default-checked="programmeQuery.packageStatus === '1' ? false : true"
                  @change="changeSwich"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
      <header-title class="header-title">
        <span>设置会员套餐权益</span>
      </header-title>
      <MYselectModel
        :selectedRowKeys="selectedRowKeys"
        :selectedRow="selectedRow"
        :equityItemIds="equityItemIds"
        @getList="getList"
      ></MYselectModel>
      <s-table
        :bordered="true"
        name="leaguerPackageManage/add-update"
        :scroll="{ x: 900, y: 240 }"
        ref="table"
        :columns="columns"
        :customPage="true"
        :list="dataList"
        rowKey="id"
      >
        <template slot="equityValueMap" slot-scope="text, record">
          <a-select v-model="record.equityItemId" placeholder="请选择" style="width: 269px">
            <a-select-option v-for="(item, key, index) in record.equityValueMap" :key="index" :value="Number(key)">
              {{ item }}
            </a-select-option>
          </a-select>
        </template>
        <template slot="shift" slot-scope="text, record">
          <img
            @click="Sort(record, (type = 'Start'), (typeNum = 0))"
            class="jiantou"
            :src="require('@/assets/icon/zhiding.png')"
            alt=""
          />
          <img
            @click="Sort(record, (type = 'Up'), (typeNum = 3))"
            class="jiantou"
            :src="require('@/assets/icon/shang.png')"
            alt=""
          />
          <img
            @click="Sort(record, (type = 'Down'), (typeNum = 2))"
            class="jiantou"
            :src="require('@/assets/icon/xia.png')"
            alt=""
          />
          <img
            @click="Sort(record, (type = 'End'), (typeNum = 1))"
            class="jiantou"
            :src="require('@/assets/icon/zhixia.png')"
            alt=""
          />
        </template>
        <template slot="operation" slot-scope="text, record">
          <a @click="Delete(record.id)"> 删除 </a>
        </template>
      </s-table>
      <div class="button">
        <a-button type="primary" @click="save">保存</a-button>
        <a-button @click="revert">返回</a-button>
      </div>
    </a-card>
  </div>
</template>
<script>
// postPackInfosAdjustSequence
import { postpackInfosAdd } from '@/api/memberPackage'
import MYselectModel from './my-selectModel.vue'
const rules = {
  packageName: [{ required: true, message: '请输入套餐名称', trigger: 'change' }],
  packageOriginalPrice: [{ required: true, message: '请输入套餐原价', trigger: 'change' }],
  packageDiscountPrice: [{ required: true, message: '请输入套餐首年优惠价', trigger: 'change' }],
  packageUrl: [{ required: true, message: '请上传套餐logo', trigger: 'blur', type: 'string' }]
}
export default {
  components: { MYselectModel },
  data() {
    return {
      // 编辑页进来已选项
      selectedRowKeys: [],
      selectedRow: [],
      equityItemIds: [],
      dataList: [],
      rules,
      visibleShowSelect: true,
      programmeQuery: {
        packageName: null,
        packageUrl: null,
        packageOriginalPrice: null,
        packageDiscountPrice: null,
        packageStatus: '1'
      },
      columns: [
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
          title: '设置权益值',
          key: 'equityValueMap',
          scopedSlots: { customRender: 'equityValueMap' }
        },
        {
          title: '移动',
          key: 'shift',
          scopedSlots: { customRender: 'shift' }
        },
        { title: '操作', fixed: 'right', scopedSlots: { customRender: 'operation' } }
      ]
    }
  },
  watch: {
    'programmeQuery.packageUrl': {
      handler(val) {
        console.log(val)
        if (val) {
          this.$refs.ruleForm.clearValidate('packageUrl')
        }
      },
      deep: true
    }
  },
  created() {
    // 判断如果是否编辑页
    if (this.$route.query.updateData) {
      const updateData = JSON.parse(this.$route.query.updateData)
      console.log(updateData)
      this.programmeQuery = {
        packageName: updateData.packageName,
        packageUrl: updateData.packageUrl,
        packageOriginalPrice: updateData.packageOriginalPrice,
        packageDiscountPrice: updateData.packageDiscountPrice,
        packageStatus: updateData.packageStatus,
        id: updateData.id,
        companyId: 2930033,
        createTime: updateData.createTime
      }
      this.dataList = updateData.vos
      this.selectedRow = this.dataList
      this.selectedRowKeys = this.dataList.map((x) => {
        return x.id
      })
      this.interestsIdList()
    }
  },
  mounted() {},
  methods: {
    // 编辑页已存在权益 在关联权益列表删除
    interestsIdList() {
      this.dataList.map((x) => {
        this.equityItemIds.push(x.id)
      })
    },
    Sort(item, type, typeNum) {
      const index = this.dataList.findIndex((x) => x.id === item.id)
      if (type === 'Up') {
        if (index === 0) {
          return
        }
        // 在上一项插入该项
        this.dataList.splice(index - 1, 0, this.dataList[index])
        // 删除后一项
        this.dataList.splice(index + 1, 1)
      } else if (type === 'Down') {
        if (index === this.dataList.length - 1) {
          return
        }
        // 在下一项插入该项
        this.dataList.splice(index + 2, 0, this.dataList[index])
        // 删除前一项
        this.dataList.splice(index, 1)
      } else if (type === 'Start') {
        console.log(type)
        if (index !== 0) {
          this.dataList.unshift(this.dataList.splice(index, 1)[0])
        }
      } else if (type === 'End') {
        console.log(index, this.dataList.length - 1)
        if (index === this.dataList.length - 1) return
        this.dataList.push(item)
        this.dataList.splice(index, 1)
      }
      // const params = {
      //   itemId: item.id,
      //   equityId: '2107220000001994',
      //   adjustFlag: typeNum
      // }
      // postPackInfosAdjustSequence(params).then((res) => {
      //   console.log(res)
      // })
    },
    // 监听switch变化
    changeSwich(e) {
      console.log(e)
      this.programmeQuery.packageStatus = e === true ? '0' : '1'
    },

    // 点击显示选择modal
    select() {
      this.visibleShow = true
    },
    // 监听子组件任何关闭操作
    cancelHandle() {
      this.visibleShow = false
    },

    // 获取列表
    getList(options) {
      this.dataList = options.map((x) => ({ ...x, equityItemid: null }))
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
          const { programmeQuery } = this

          let params
          const posList = []
          this.dataList.forEach((el) => {
            posList.push({
              id: el.id,
              equityId: el.equityId,
              equityItemId: el.equityItemId,
              isDeleted: 0,
              companyId: '2930033'
            })
          })

          if (this.$route.query.updateData) {
            const query = {
              ...programmeQuery,
              isDeleted: 0,
              companyId: 2930033
            }
            params = { ...query, vos: [...posList] }
          } else {
            params = { ...programmeQuery, isDeleted: 0, pos: [...posList] }
          }
          if (posList.length < 1 || posList === []) {
            this.$message.info('请选择相关权益值')
            return
          }
          console.log(posList)
          postpackInfosAdd(params).then((res) => {
            if (res.code === '0') {
              this.$message.success('添加成功')
              this.$router.push({ name: 'leaguerPackageManageIndexReview' })
            }
          })
        }
      })
    },
    // 删除
    Delete(id) {
      this.dataList = this.dataList.filter((item) => item.id !== id)
    }
  }
}
</script>
<style lang="less" scoped>
.header-title {
  margin-bottom: 16px;
}
.button {
  margin-top: 15px;
  text-align: center;
}
.avatar-uploader {
  width: 64px !important;
  height: 64px !important;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.jiantou {
  width: 30px;
  margin-right: 15px;
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
