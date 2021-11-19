<template>
  <div>
    <a-card title="类目名称">
      <!-- <div slot="extra">
        <a-breadcrumb separator=">">
          <a-breadcrumb-item> 当前设置类目</a-breadcrumb-item>
          <a-breadcrumb-item href=""> 一级类目名称 </a-breadcrumb-item>
          <a-breadcrumb-item href=""> 二级类目名称 </a-breadcrumb-item>
        </a-breadcrumb>
      </div> -->

      <a-card-grid class="card" style="width: 50%; text-align: left">
        <a-tree
          v-model="checkedKeys"
          checkable
          key="key"
          :expanded-keys="expandedKeys"
          :auto-expand-parent="autoExpandParent"
          :checkedKeys="checkedKeys"
          :tree-data="treeData"
          @check="onCheck"
          @expand="onExpand"
          @select="onSelect"
        />
      </a-card-grid>
      <a-card-grid class="rightCard" style="width: 50%; text-align: left" :hoverable="false">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="静态分值" prop="staticId">
            <d-select :options="listA" v-model="form.staticId" placeholder="请选择" @change="getVendorIdquiet">
            </d-select>
          </a-form-model-item>
          <a-form-model-item label="动态分值" prop="moveId">
            <d-select :options="listB" v-model="form.moveId" placeholder="请选择" @change="getVendorIdmove"> </d-select>
          </a-form-model-item>
          <a-form-model-item label="店铺分值" prop="storeId">
            <d-select :options="listC" v-model="form.storeId" placeholder="请选择" @change="getVendorIdshop">
            </d-select>
          </a-form-model-item>
          <a-form-model-item label="等级占比设置" prop="proportionId">
            <d-select @change="getVendorIdProportion" :options="listD" v-model="form.proportionId" placeholder="请选择">
            </d-select>
          </a-form-model-item>
        </a-form-model>
      </a-card-grid>
    </a-card>
    <a-card>
      <div style="margin-bottom: 20px">备注:</div>
      <a-textarea
        style="margin-bottom: 20px"
        v-model="form.remark"
        placeholder="请输入备注"
        :auto-size="{ minRows: 5, maxRows: 10 }"
      />
      <a-button type="primary" @click="onSubmit"> 保存 </a-button>
      <a-button style="margin-left: 10px" @click="$router.back()">取消</a-button>
    </a-card>
  </div>
</template>

<script>
import {
  getCategory,
  addOrUpdateCategoryScoreProportion,
  getCategoryDetail,
  getScorePlan,
  getGradePlan
} from '@/api/SupplierSettings.js'

// import { message } from 'ant-design-vue'

export default {
  name: 'FormCategoryValueProportionSetting',
  // components: {},
  data() {
    return {
      bool: false,
      value1: {
        scoreType: 1
      },
      value2: {
        scoreType: 2
      },
      value3: {
        scoreType: 3
      },
      listA: [],
      listB: [],
      listC: [],
      listD: [],
      selectedKeys: [],
      autoExpandParent: true,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      panentNode: {},
      form: {
        staticId: '',
        moveId: '',
        storeId: '',
        proportionId: '',
        categoryIds: [],
        remark: ''
      },
      expandedKeys: [],
      checkedKeys: [],
      treeData: [],
      rules: {
        staticId: [{ required: true, message: '不能为空值', trigger: 'change' }],
        moveId: [{ required: true, message: '不能为空值', trigger: 'change' }],
        storeId: [{ required: true, message: '不能为空值', trigger: 'change' }],
        proportionId: [{ required: true, message: '不能为空值', trigger: 'change' }]
      }
    }
  },
  mounted() {
    if (this.$route.params.add === '0') {
      // 获取 静态列表的值
      this.bool = true
      this.treeDataAJAX(this.bool)
    } else {
      this.EditData(parseInt(this.$route.params.id))
    }
  },
  watch: {
    checkedKeys(val) {
      // this.onCheck(val)
      // console.log(val)
    }
  },
  created() {
    this.inputAJAX()
  },
  methods: {
    getVendorIdquiet(val) {
      this.form.staticId = val
    },
    getVendorIdmove(val) {
      this.form.moveId = val
    },
    getVendorIdshop(val) {
      this.form.storeId = val
    },
    getVendorIdProportion(val) {
      this.form.proportionId = val
    },
    async inputAJAX() {
      const data1 = await getScorePlan(this.value1)
      const data2 = await getScorePlan(this.value2)
      const data3 = await getScorePlan(this.value3)
      const data4 = await getGradePlan()
      this.listA = data1.data.map((item) => {
        item.value = item.id
        item.label = item.scoreName
        return item
      })
      this.listB = data2.data.map((item) => {
        item.value = item.id
        item.label = item.scoreName
        return item
      })
      this.listC = data3.data.map((item) => {
        item.value = item.id
        item.label = item.scoreName
        return item
      })
      this.listD = data4.data.map((item) => {
        item.value = item.id
        item.label = item.name
        return item
      })
    },
    async EditData(id) {
      const params = {
        id: id
      }
      const { data } = await getCategoryDetail(params)
      const {
        itemVOList: [item],
        remark
      } = data

      // data.itemVOList.forEach((item) => {
      //   this.expandedKeys.push(item.categoryOne)
      //   this.expandedKeys.push(item.categoryTwo)
      // })
      // console.log(this.expandedKeys, 'expandedKeys')
      this.form = { remark, ...item }
      this.form.id = data.id
      this.bool = false
      this.form.categoryIds = data.categoryIds
      this.form.remark = data.remark
      this.treeDataAJAX(this.bool, data.categoryIds)
    },
    async treeDataAJAX(bool, arr) {
      let newString = {
        message: ''
      }
      if (bool === true) {
        newString = {
          message: 'true'
        }
      } else {
        newString = {
          message: 'false'
        }
      }

      const { data } = await getCategory(newString)

      ;(function getRoles(_tns) {
        return _tns
          ?.map((x, i) => {
            x.key = x.id
            if (x.children && x.children.length > 0) {
              const children = getRoles(x.children)
              return [...children, x.children]
            }
            return x
          })
          .flat()
      })(data)
      this.treeData = data
      console.log(arr)
      console.log(this.treeData.length)
      const arrs = []
      for (let i = 0; i < this.treeData.length; i++) {
        arrs.push(this.treeData[i].id)
      }
      const ids = arr.filter((item) => {
        console.log(arrs.includes(item))
        if (!arrs.includes(item)) {
          return item
        }
      })
      console.log(ids)
      this.checkedKeys = ids || []
      this.expandedKeys = arr || []
      // 编辑页面，若有已选，其他的一级禁用
      if (arr && arr.length > 0) {
        if (this.treeData.length > 0) {
          this.treeData = this.treeData.map((item) => {
            item = this.deepChange(item, true)
            arr.map((item1) => {
              if (JSON.stringify(item).indexOf(item1) > -1) {
                item = this.deepChange(item, false)
              }
            })
            return item
          })
        }
      }
    },
    onSubmit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          const params = {}
          if (this.$route.params.add === '0') {
            params.remark = this.form.remark
            params.staticId = this.form.staticId
            params.moveId = this.form.moveId
            params.storeId = this.form.storeId
            params.proportionId = this.form.proportionId
            params.categoryIds = this.form.categoryIds
          } else {
            params.id = this.form.id
            params.versionNo = this.form.versionNo
            params.remark = this.form.remark
            params.staticId = this.form.staticId
            params.moveId = this.form.moveId
            params.storeId = this.form.storeId
            params.proportionId = this.form.proportionId
            params.categoryIds = this.form.categoryIds
          }
          if (this.panentNode.id && !params.categoryIds.includes(this.panentNode)) {
            params.categoryIds.push(this.panentNode.id)
          }
          const data = await addOrUpdateCategoryScoreProportion(params)
          // if(data.code)
          if (data.code === '0') {
            this.$message.success('保存成功')
            this.$router.go(-1)
          } else {
            this.$message.error('保存错误稍后再试')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck(selectedKeys, info) {
      console.log(info)
      if (selectedKeys.length === 0) {
        // 一个都没选，所有一级类目都可选
        this.treeData = this.treeData.map((item) => {
          item = this.deepChange(item, false)
          return item
        })
      }
      // 选第一个后确定展开的一级类目，其他的不可选并折起来
      if (info.checked === true) {
        this.treeData = this.treeData.map((item) => {
          item = this.deepChange(item, true)
          selectedKeys.map((item1) => {
            if (JSON.stringify(item).indexOf(item1) > -1) {
              item = this.deepChange(item, false)
            }
          })
          return item
        })
      }
      // if()
      this.checkedKeys = selectedKeys
      this.form.categoryIds = selectedKeys
      console.log(this.form.categoryIds)
      this.panentNode = this.treeData.find((item) => {
        if (item.childrenList !== null) {
          for (let i = 0; i < item.childrenList.length; i++) {
            if (this.form.categoryIds.includes(item.childrenList[i].id)) {
              console.log(true)
              return true
            }
          }
        }
      })
    },
    deepChange(item, flag) {
      if (item) {
        if (item.flag === flag) {
          return item
        }
        item.disabled = flag
        if (item.children && item.children.length > 0) {
          item.children = item.children.map((i) => {
            return this.deepChange(i, flag)
          })
        }
      }
      return item
    },
    onSelect(selectedKeys, info) {
      // const aa = selectedKeys.concat(info.halfCheckedKeys)
      console.log(info)
      this.selectedKeys = selectedKeys
    }
  }
}
</script>

<style lang="less" scoped>
.rightCard {
  height: 350px;
}
.card {
  height: 350px;
  max-height: 350px;
  overflow: auto;
}
/deep/ .A {
  width: 60%;
}
</style>
