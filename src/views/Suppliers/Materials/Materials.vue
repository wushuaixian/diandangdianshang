<template>
  <div class="warp">
    <a-card>
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="ruleForm">
          <a-row :gutter="24">
            <a-col :md="12" :sm="24">
              <a-form-model-item label="公司名称">
                <d-select
                  :allowClear="false"
                  show-search
                  :filterOption="handleFetch"
                  :label-in-value="false"
                  v-model="list.buyerMerchantId"
                  :options="merchantList"
                  @change="handleChange"
                ></d-select>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <a-card class="bottom">
      <a-row>
        <a-col class="middle" :md="80">
          <a-button style="margin-right: 8px" @click="daoru">导入</a-button>

          <export-file :params="exportParams" />
          <!-- <a-button style="margin-left: 8px" @click="exportFile">导出</a-button> -->
        </a-col>
        <a-row :gutter="24">
          <a-col :span="8" class="left">
            <a-input-search style="margin-bottom: 8px" placeholder="请输入" @search="onChange" />
            <a-tree v-if="treeData.length > 0" :tree-data="treeData" :defaultExpandAll="true" @expand="onExpand">
              <template slot="custom" slot-scope="item">
                <div class="tree-view-item" @click="itemData = item">
                  <div class="category-name">
                    <ellipsis :length="20">{{ item.title }}</ellipsis>
                  </div>
                  <div>
                    <img src="./icon/add.png" @click="add(item.id, item.name)" alt="新增" />
                    <img src="./icon/edit.png" @click="edit(item)" alt="编辑" />
                    <img src="./icon/ic-up.png" alt="上级" @click="setOrder(item, 'up')" />
                    <img src="./icon/ic-down.png" alt="下级" @click="setOrder(item, 'down')" />
                    <img src="./icon/up.png" alt="最上级" @click="setOrder(item, 'top')" />
                    <img src="./icon/down.png" alt="最下级" @click="setOrder(item, 'bottom')" />
                  </div>
                </div>
              </template>
            </a-tree>
          </a-col>
          <a-col :span="16">
            <div class="meste">类目详情</div>
            <div>
              <span class="stroe">类目编码：{{ itemData.categoryCode ? itemData.categoryCode : '' }}</span>
              <span class="stroe">类目名称：{{ itemData.name ? itemData.name : '' }}</span>
            </div>
            <div class="stite" v-if="!itemData.status">状态：</div>
            <div class="stite" v-else>状态：{{ itemData.status === '0' ? '启用' : '停用' }}</div>
          </a-col>
        </a-row>
      </a-row>
    </a-card>
    <!-- </div> -->
    <!-- 导入 -->
    <Statr
      ref="Statr"
      :merchantId="String(list.buyerMerchantId)"
      :merchantName="merchantName"
      :merchantList="merchantList"
      @refresh="refresh"
    />
    <!-- 新增 -->
    <AddEd
      ref="AddEd"
      :ids="String(ids)"
      :name="String(name)"
      :merchantName="merchantName"
      :buyerMerchantId="String(list.buyerMerchantId)"
      @upData="all"
    />
    <!-- 下拉 -->
    <Edit ref="Edit" @updataList="all" />
  </div>
</template>

<script>
import { MaterialCateGory, Order } from '@/api/Material'
import { Statr, AddEd, Edit } from './components'
import { getSupplierMerchant, all } from '@/api/supplier'
import { getSearchList } from '@/views/systemManagement/organization/_utils/index'
import ExportFile from '@/components/exportFile/'
export default {
  components: {
    Statr,
    AddEd,
    Edit,
    ExportFile
  },
  data() {
    return {
      merchantList: [],
      merchantName: '',
      expandedKeys: [],
      itemData: {},
      searchValue: '',
      defaultExpandAll: false,
      autoExpandParent: false,
      list: {
        buyerMerchantId: '',
        code: '',
        name: ''
      },
      layout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 17 }
      },
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      treeData: [],
      copyList: [],
      ids: '',
      name: '',
      exportParams: {
        templateCode: 'materialCategoryExport',
        jsonTxt: { currentPage: 1, itemsPerPage: 10, merchantId: '' },
        exportTypeList: ['materialCategoryImport', 'exportMaterialCategoryList'],
        fileName: '物料类目列表'
      }
    }
  },
  watch: {
    checkedKeys(val) {},
    'list.buyerMerchantId'(val) {
      this.exportParams.jsonTxt.merchantId = val
      this.all()
    }
  },
  mounted() {
    this.getList()
    this.exportParams.jsonTxt.merchantId = this.list?.buyerMerchantId
  },
  methods: {
    handleFetch(inputValue, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
    },
    handleChange() {
      this.itemData = {}
      this.merchantName = this.merchantList.find((x) => x.value === this.list.buyerMerchantId)?.label
    },
    refresh() {
      console.log(11)
      this.all()
    },
    // ⚠️重点这这里⚠️每一条数据上都添加scopedSlots属性
    async all() {
      try {
        const { data } = await all({ merchantId: String(this.list.buyerMerchantId) })
        ;(function getRoles(_preKey, _tns) {
          return _tns
            ?.map((x, i) => {
              x.scopedSlots = {
                title: 'custom'
              }
              x.key = `${_preKey}-${i}`
              x.title = `${x.name}(${x.categoryCode})`
              if (x.children && x.children.length > 0) {
                const children = getRoles(x.key, x.children)
                return [...children, x.children]
              }
              return x
            })
            .flat()
        })('0', data)
        this.copyList = data
        this.treeData = data
      } catch (err) {}
    },
    async getList() {
      const res = await getSupplierMerchant()
      if (res.code === '0') {
        const [item] = res?.data
        this.list.buyerMerchantId = item?.merchantId
        this.merchantName = item?.merchantName
        this.merchantList = res?.data.map((x) => {
          return {
            value: x.merchantId,
            label: x.merchantName
          }
        })
        // this.all()
      }
    },
    daoru() {
      this.$refs['Statr'].init()
    },
    // 查询
    async search() {
      MaterialCateGory(this.list).then((res) => {})
    },
    async ites() {
      const data = {}
      Order(data).then((res) => {})
    },
    // 新增
    add(id, name) {
      this.ids = id
      this.name = name
      this.$refs['AddEd'].init()
    },
    // 编辑
    edit(item) {
      const buyerMerchantName = this.merchantList?.filter((i) => {
        return i?.value === this.list.buyerMerchantId
      })[0]?.label
      const parentName = item?.fullNamePath?.split('-')[item.level - 2]
      const { categoryCode, name, status, id } = item
      this.$refs['Edit'].init({ categoryCode, name, status, buyerMerchantName, parentName, id })
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      // this.autoExpandParent = false
    },
    onChange(value) {
      this.searchValue = value
      if (!value) {
        this.treeData = [...this.copyList]
        return
      }
      const list = JSON.parse(JSON.stringify(this.copyList))
      this.treeData = getSearchList(list, value.toLocaleLowerCase())
    },
    async setOrder(item, direct) {
      const { merchantId, id } = item
      const result = await Order({
        merchantId,
        id,
        direct
      })
      if (result.code === '0') {
        this.$message.success('更改成功')
        this.getList()
        this.all()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  text-align: center;
  background: white;
  height: 200px;
  .ant-col {
    position: relative;
    min-height: 1px;
    margin-top: 60px;
  }
}
.centen {
  background: white;
  margin-top: 30px;
  .ant-col {
    position: relative;
    min-height: 1px;
    margin-top: 20px;
  }
}
.ant-tree li span.ant-tree-switcher {
  width: 16px;
  height: 16px;
  margin: 4px;
  // 修改树结构合起的icon
  &.ant-tree-switcher_close {
    background: url('//assets.2dfire.com/frontend/b415e20fc703838e5a028437366ff22a.png') no-repeat;
    background-size: contain;
    i {
      display: none;
    }
  }
  // 修改树结构展开的icon
  &.ant-tree-switcher_open {
    background: url('//assets.2dfire.com/frontend/568ca02f82eee05829d276881363c22a.png') no-repeat;
    background-size: contain;
    i {
      display: none;
    }
  }
}
.meste {
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 20px;
}
.stroe {
  margin-right: 200px;
}
.stite {
  margin-top: 20px;
}
.search-btn {
  text-align: center;
  display: flex;
  justify-content: center;
  margin-top: 16px;
  .ant-btn {
    margin: 0px 10px;
  }
}
.bottom {
  margin-top: 20px;
}
.middle {
  margin-bottom: 16px;
}
.left {
  border-right: 1px solid #eee;
  min-height: 500px;
}
.tree-view-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  // .category-name {
  //   overflow: hidden;
  //   width: 150px;
  // }
}
/deep/ .ant-tree-node-content-wrapper {
  width: 100%;
}
/deep/ .ant-tree-node-content-wrapper {
  width: 90%;
}
</style>
