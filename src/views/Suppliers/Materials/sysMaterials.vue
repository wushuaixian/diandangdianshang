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
          <export-file :params="exportParams" />
        </a-col>
        <a-row :gutter="24">
          <a-col :span="8" class="left">
            <a-input-search style="margin-bottom: 8px" placeholder="请输入" @search="onChange" />
            <a-tree v-if="treeData.length > 0" :tree-data="treeData" :defaultExpandAll="true" @expand="onExpand">
              <template slot="custom" slot-scope="item">
                <div class="tree-view-item" @click="itemData = item">
                  <div>
                    <span v-if="item.name.indexOf(searchValue) > -1">
                      {{ item.name.substr(0, item.name.indexOf(searchValue)) }}
                      <span style="color: #f50">{{ searchValue }}</span>
                      {{ item.name.substr(item.name.indexOf(searchValue) + searchValue.length) }}
                    </span>
                    <span v-else>{{ item.name }}</span>
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
  </div>
</template>

<script>
import { MaterialCateGory, Order } from '@/api/Material'
import { all } from '@/api/supplier'
import { getSearchList } from '@/views/systemManagement/organization/_utils/index'
import { getComList } from '@/api/contract'
import ExportFile from '@/components/exportFile/'
export default {
  components: { ExportFile },
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
        jsonTxt: { currentPage: 1, itemsPerPage: 1000, merchantId: '' },
        exportType: 'exportMaterialCategoryList',
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
              x.title = x.name
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
      const res = await getComList()
      if (res.code === '0') {
        const { buyerMerchantList } = res.data
        this.list.buyerMerchantId = buyerMerchantList[0]?.id
        this.merchantName = buyerMerchantList[0]?.orgName
        this.merchantList = buyerMerchantList?.map((x) => {
          return {
            value: x.id,
            label: x.orgName
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
}
/deep/ .ant-tree-node-content-wrapper {
  width: 100%;
}
/deep/ .ant-tree-node-content-wrapper {
  width: 90%;
}
</style>
