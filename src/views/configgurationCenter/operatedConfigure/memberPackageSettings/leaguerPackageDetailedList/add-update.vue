<template>
  <a-card>
    <a-form-model layout="inline" :model="queryParam" ref="ruleForm" :rules="rules">
      <a-row :gutter="48">
        <a-col :md="12" :sm="24" style="height: 55px">
          <a-form-model-item label="套餐权益类型" prop="equityType">
            <a-select
              :disabled="$$($route.query, 'isUpdate') === true"
              v-if="queryParam.equityType"
              v-model="queryParam.equityType"
              style="width: 269px"
              placeholder="请选择"
            >
              <a-select-option v-for="item in projectType" :key="item.id" :value="item.name">
                {{ item.name }}
              </a-select-option>
            </a-select>
            <a-select
              :disabled="$$($route.query, 'isUpdate') === true"
              @change="changeEquityType"
              v-else
              style="width: 269px"
              placeholder="请选择"
            >
              <a-select-option v-for="item in projectType" :key="item.id" :value="item.name">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="48">
        <a-col :md="12" :sm="24" style="height: 55px">
          <a-form-model-item label="权益名称" prop="equityName" style="margin-left: 26px">
            <a-input style="width: 269px" :maxLength="20" v-model="queryParam.equityName" placeholder="请输入" />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="48">
        <a-col :md="8" :sm="24">
          <a-form-model-item label="权益状态" style="margin-left: 26px; height: 55px">
            <a-switch v-model="isAvailable" @change="changeSwitch" />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="48">
        <a-col :md="24" :sm="24">
          <a-form-model-item label="权益值" prop="time" style="margin-left: 40px">
            <a-table style="min-width: 700px" :pagination="false" :columns="columns" :data-source="data" bordered>
              <template slot="options" slot-scope="text, record, index">
                <a-popconfirm v-if="data.length" title="确认删除吗？" @confirm="() => onDelete(record, index)">
                  <a href="javascript:;">删除</a>
                </a-popconfirm>
              </template>
              <template slot="equityCode" slot-scope="text, record">
                <a-input :maxLength="20" v-model="record.equityCode" />
              </template>
              <template slot="equityValue" slot-scope="text, record">
                <a-input :maxLength="100" v-model="record.equityValue" />
              </template>
              <template slot="shift" slot-scope="text, record, index">
                <img
                  @click="Sort(record, index, (type = 'Start'), (typeNum = 0))"
                  class="jiantou"
                  :src="require('@/assets/icon/zhiding.png')"
                  alt=""
                />
                <img
                  @click="Sort(record, index, (type = 'Up'), (typeNum = 3))"
                  class="jiantou"
                  :src="require('@/assets/icon/shang.png')"
                  alt=""
                />
                <img
                  @click="Sort(record, index, (type = 'Down'), (typeNum = 2))"
                  class="jiantou"
                  :src="require('@/assets/icon/xia.png')"
                  alt=""
                />
                <img
                  @click="Sort(record, index, (type = 'End'), (typeNum = 1))"
                  class="jiantou"
                  :src="require('@/assets/icon/zhixia.png')"
                  alt=""
                />
              </template>
              <template slot="footer" slot-scope="">
                <a @click="addValue"><strong>+</strong> 添加权益值</a>
              </template>
            </a-table>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="48">
        <a-col :md="7" :sm="24" class="button">
          <a-button @click="save" type="primary">保存</a-button>
          <a-button @click="revert">返回</a-button>
        </a-col>
      </a-row>
    </a-form-model>
  </a-card>
</template>
<script>
// postupdateId,postAdjustSequence,
import { postListMulti, postEquityAdd } from '@/api/memberPackage'
const rules = {
  equityType: [{ required: true, message: '请选择权益类型', trigger: 'change' }],
  equityName: [{ required: true, message: '请选择权益名称', trigger: 'change' }],
  isAvailable: [{ required: true, message: '请选择模板类型', trigger: 'change' }]
}

export default {
  props: {
    isUpdate: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isAvailable: true,
      id: 2,

      rules,
      queryParam: {
        equityType: null,
        equityName: null,
        isAvailable: null,
        companyId: '2930033',
        isDeleted: 0
      },
      // 套餐权益类型列表
      projectType: [],
      columns: [
        { title: '属性值编码', scopedSlots: { customRender: 'equityCode' } },
        { title: '属性值', scopedSlots: { customRender: 'equityValue' } },
        { title: '移动', scopedSlots: { customRender: 'shift' }, align: 'center' },
        { title: '操作', scopedSlots: { customRender: 'options' } }
      ],
      data: [
        {
          equityCode: '',
          equityValue: '',
          companyId: '2930033'
        },
        {
          equityCode: '',
          equityValue: '',
          companyId: '2930033'
        }
      ],
      deleteIdList: [],
      ids: []
    }
  },
  watch: {
    isAvailable(n, o) {
      console.log(n)
      console.log(o)
    }
  },
  created() {
    this.postListMulti()
    if (this.$route.query.updataData) {
      this.queryParam = this.$route.query.updataData.queryParam
      this.data = this.$route.query.updataData.data
    }
    if (this.$route.query?.isAdd === true) {
      delete this.columns[2]
    }
  },
  mounted() {
    if (this.$route.query.updataData) {
      if (this.queryParam.isAvailable === Number(1)) {
        this.isAvailable = true
      } else {
        this.isAvailable = false
      }
    }
  },
  methods: {
    Sort(item, index, type, typeNum) {
      if (type === 'Up') {
        if (index === 0) {
          return
        }
        // 在上一项插入该项
        this.data.splice(index - 1, 0, this.data[index])
        // 删除后一项
        this.data.splice(index + 1, 1)
      } else if (type === 'Down') {
        if (index === this.data.length - 1) {
          return
        }
        // 在下一项插入该项
        this.data.splice(index + 2, 0, this.data[index])
        // 删除前一项
        this.data.splice(index, 1)
      } else if (type === 'Start') {
        console.log(type)
        if (index !== 0) {
          this.data.unshift(this.data.splice(index, 1)[0])
        }
      } else if (type === 'End') {
        console.log(index, this.data.length - 1)
        if (index === this.data.length - 1) return
        this.data.push(item)
        this.data.splice(index, 1)
      }
      // const params = {
      //   itemId: item.id,
      //   equityId: item.equityId,
      //   adjustFlag: typeNum
      // }
      // console.log(params)
      // if (this.$route.query.updataData) {
      //   postAdjustSequence(params).then((res) => {
      //     postupdateId({ id: this.queryParam.id }).then((res) => {
      //       this.data = res.data
      //     })
      //   })
      // }
    },

    // 删除
    onDelete(record, index) {
      this.deleteIdList.push(record.id)
      this.ids = this.deleteIdList.filter(function (value) {
        return value > 0
      })
      this.data.splice(index, 1)
    },

    // 添加权益

    addValue() {
      this.data.push({
        equityCode: '',
        equityValue: '',
        companyId: '2930033'
      })
    },
    // 保存
    save() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].equityCode === '' || this.data[i].equityCode === null) {
              this.$message.error(`请输入第${i + 1}行属性值编码`)
              return
            } else if (this.data[i].equityValue === '' || this.data[i].equityValue === null) {
              this.$message.error(`请输入第${i + 1}行属性值`)
              return
            }
          }
          this.saveApi()
        }
      })
    },
    // 保存接口请求
    saveApi() {
      const { data, queryParam, ids } = this
      console.log(data)
      data.forEach((e) => {
        delete e.index
        return { e }
      })
      const params = { itemInfoPOS: data, ...queryParam, deleteIdList: ids }

      postEquityAdd(params).then((res) => {
        if (res.code === '0') {
          // 跳转编辑页
          this.$message.success('保存成功')
          this.$router.push({ name: 'leaguerPackageDetailedListIndex' })
          this.data = []
          this.queryParam = {}
        }
      })
    },
    // 套餐权益类型
    postListMulti() {
      const params = {
        categories: ['PACKAGE_BENEFITS_TYPE']
      }
      postListMulti(params).then((res) => {
        if (res.code === '0') {
          this.projectType = res.data.PACKAGE_BENEFITS_TYPE
        }
      })
    },
    // 监听套餐权益类型选中的id
    changeEquityType(e) {
      console.log(e)
      this.queryParam.equityType = e
    },

    // 监听switch状态
    changeSwitch(e) {
      if (e === true) {
        this.queryParam.isAvailable = '1'
      } else {
        this.queryParam.isAvailable = '0'
      }
    },

    // 返回
    revert() {
      this.$router.go(-1)
      this.data = []
      this.queryParam = {}
    }
  }
}
</script>
<style lang="less" scoped>
.button {
  text-align: center;
  margin-top: 15px;
}
.jiantou {
  width: 25px;
}
</style>
