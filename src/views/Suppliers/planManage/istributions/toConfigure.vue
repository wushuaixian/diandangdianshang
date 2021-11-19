<template>
  <div class="container">
    <a-card>
      <a-row :gutter="48">
        <a-col :md="12" :sm="24" class="merchantNames">
          <span>公司名称：</span>
          <d-select
            :allowClear="false"
            @change="handleChange"
            v-model="params.merchantId"
            :options="merchantList"
          ></d-select>
        </a-col>
        <a-col :md="24">
          <div class="button">
            <a-button type="primary" class="margin-right" @click="showModal">配置采购员 </a-button>
          </div>
        </a-col>
      </a-row>
    </a-card>
    <div class="wrap">
      <a-card type="inner" :bordered="false" class="lefts">
        <a-input-group compact class="lefts-aligns">
          <!-- 先不上这个功能 -->
          <!-- <a-select default-value="全部">
            <a-select-option value="0">未配置</a-select-option>
            <a-select-option value="1">已配置</a-select-option>
          </a-select> -->
          <a-input-search
            style="margin-bottom: 8px"
            class="inpsrh"
            placeholder="请输入类目编码、名称"
            @search="onChange"
          />
          <!-- @change="onChange" -->
        </a-input-group>
        <!-- 树形控件区域 -->
        <!-- <a-spin :spinning="loading"> -->
        <a-tree
          v-if="categoryList.length > 0"
          checkable
          :defaultExpandAll="true"
          v-model="checkedKeys"
          :tree-data="categoryList"
          :replace-fields="replaceFields"
          @expand="onExpand"
        >
          <template slot="custom" slot-scope="{ title }">
            <a-tooltip placement="topLeft" :title="title">
              <span v-if="title.indexOf(searchValue) > -1">
                {{ title.substr(0, title.indexOf(searchValue)) }}
                <span style="color: #f50">{{ searchValue }}</span>
                {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
              </span>
              <span v-else>{{ title }}</span>
            </a-tooltip>
          </template>
        </a-tree>
        <div class="center" v-else>未查询到数据~</div>
        <!-- </a-spin> -->
      </a-card>
      <div class="mid">
        <!-- 输入框区域 -->
        <a-card type="inner" :bordered="false">
          <div class="table-page-search-wrapper-custom">
            <a-form-model
              layout="inline"
              ref="form"
              :model="params"
              v-bind="{
                labelCol: { span: 8 },
                wrapperCol: { span: 16 }
              }"
            >
              <a-row :gutter="48">
                <a-col :md="8" :sm="24">
                  <a-form-model-item prop="materialCategoryIds" label="类目名称">
                    <tree-select
                      multiple="multiple"
                      :normalizer="normalizer"
                      v-model="params.materialCategoryIds"
                      :dropdownMatchSelectWidth="false"
                      :options="categoryList"
                      value-consists-of="LEAF_PRIORITY"
                    ></tree-select>
                  </a-form-model-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-model-item label="采购员" prop="buyerUserName">
                    <a-input v-model="params.buyerUserName" />
                  </a-form-model-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-model-item label="配置状态" prop="isAllocation">
                    <d-select v-model="params.isAllocation" :options="buyerPlanCodeList"></d-select>
                  </a-form-model-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-model-item label="物料编码" prop="code">
                    <a-input v-model="params.code" />
                  </a-form-model-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-model-item label="物料名称" prop="name">
                    <a-input v-model="params.name" />
                  </a-form-model-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-model-item label="规格型号" prop="materialModel">
                    <a-input v-model="params.materialModel" />
                  </a-form-model-item>
                </a-col>
              </a-row>
              <div class="button">
                <a-button class="middleBtn" @click="Reset">重置</a-button>
                <a-button type="primary" class="search" @click="search">查询</a-button>
              </div>
            </a-form-model>
          </div>
        </a-card>
        <a-card type="inner" :bordered="false">
          <div>
            <s-table
              name="toConfigureTables"
              v-if="params.merchantId"
              ref="table"
              rowKey="id"
              :columns="columns"
              :data="init"
              :row-selection="{
                selectedRowKeys: this.idList,
                onChange: (selectedRowKeys, selectedRows) => {
                  this.idList = selectedRowKeys
                }
              }"
            >
              <a slot="translate" slot-scope="">关闭</a>
            </s-table>
          </div>
        </a-card>
      </div>
      <BuyerTable @ok="handleBuyerChange" :visible.sync="showBuyer" :merchantId="params.merchantId" />
    </div>
  </div>
</template>

<script>
import { getSupplierMerchant, materialcategoryAll, materialPage, buyerAllot } from '@/api/toConfigure'
import { buyerPlanCodeList } from '@/config/constant'
import { getSearchList } from '@/views/systemManagement/organization/_utils/index'
import { BuyerTable } from './components/'
// 弹框表格数据
const column = [
  { title: '选择', dataIndex: 'selected', key: 'selected', scopedSlots: { customRender: 'inputSelect' } },
  {
    title: '序号',
    key: 'index',
    customRender: (text, record, i) => {
      return i + 1
    }
  },
  { title: '姓名', dataIndex: 'username', key: 'username' },
  { title: '手机号', dataIndex: 'mobile', key: 'mobile' },
  { title: '组织', dataIndex: 'tel', key: 'tel' },
  { title: '已分配物料类目', dataIndex: 'role', key: 'tel' }
]
// 表格数据
const columns = [
  {
    title: '序号',
    key: 'index',
    customRender: (text, record, i) => {
      return i + 1
    }
  },
  {
    title: '采购员',
    dataIndex: 'buyerUserName',
    key: 'buyerUserName',
    scopedSlots: { customRender: 'buyerUserName' }
  },
  {
    title: '配置状态',
    key: 'isAllocation',
    dataIndex: 'isAllocation',
    customRender: (text) => {
      return text === 1 ? '已配置' : '未配置'
    }
  },
  {
    title: '物料编码',
    dataIndex: 'code',
    key: 'code',
    scopedSlots: { customRender: 'code' }
  },
  {
    title: '物料名称',
    dataIndex: 'name',
    key: 'name',
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '规格型号',
    dataIndex: 'materialModel',
    key: 'materialModel',
    scopedSlots: { customRender: 'materialModel' }
  }
]
const dataList = []
// const getParentKey = (id, tree) => {
//   let parentKey
//   for (let i = 0; i < tree.length; i++) {
//     const node = tree[i]
//     if (node.children) {
//       if (node.children.some((item) => item.id === id)) {
//         node.children.some((item) => (parentKey = item.key))
//       } else if (getParentKey(id, node.children)) {
//         parentKey = getParentKey(id, node.children)
//       }
//     }
//   }
//   return parentKey
// }
export default {
  components: {
    BuyerTable
  },
  data() {
    this.columns = columns
    this.column = column
    return {
      showBuyer: false,
      buyerPlanCodeList,
      // 树形控件区域
      checkedKeys: [],
      searchValue: '',
      buyerUserId: '',
      idList: [],
      visible: false,
      columns,
      params: {
        merchantId: '',
        isAllocation: '',
        buyerUserName: '',
        materialCode: '',
        name: '',
        materialModel: '',
        materialCategoryIds: []
      },
      autoExpandParent: true,
      replaceFields: {
        children: 'children',
        title: 'name',
        key: 'id'
      },
      merchantList: [],
      list: [],
      categoryList: [],
      normalizer(node) {
        return {
          id: node?.id,
          label: node?.name,
          children: node?.children || undefined
        }
      }
    }
  },
  async mounted() {
    await this.SupplierMerchant()
    await this.materialcategory()
    const dom = document.getElementsByClassName('vue-treeselect__menu-container')[0]
    if (dom) {
      dom.style.minWidth = '300px'
    }
  },

  methods: {
    handleChange(val) {
      this.params.merchantId = val
      this.categoryList = []
      this.materialcategory(val)
      this.search()
    },
    // 获取采购商id
    async SupplierMerchant() {
      const res = await getSupplierMerchant()
      if (res.code === '0') {
        const [item] = res?.data
        this.merchantList = res?.data.map((x) => {
          return {
            value: x.merchantId,
            label: x.merchantName
          }
        })
        this.params.merchantId = item?.merchantId
      }
    },
    // 请求列表数据
    async init(e) {
      const { params } = this
      params.merchantId = Number(params.merchantId)
      const data = {
        ...e,
        ...params
      }
      return materialPage({ ...data })
    },
    // 物料类目接口
    async materialcategory(val) {
      const { params } = this
      const data = {
        merchantId: val || params?.merchantId
      }
      const res = await materialcategoryAll(data)
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
      })('0', res?.data)
      this.list = JSON.parse(JSON.stringify(res?.data))
      this.categoryList = res?.data
      this.generateList(this.categoryList)
    },
    // 显示配置采购员弹框
    showModal() {
      const { checkedKeys, idList } = this
      if (checkedKeys.length <= 0 && idList.length <= 0) {
        this.$message.warning('类目或者物料至少选择一项')
        return
      }
      this.showBuyer = true
    },
    // 查询列表数据
    search() {
      this.$refs.table.refresh(true)
      this.checkedKeys = []
    },
    Reset() {
      this.$refs.form.resetFields()
    },
    async handleBuyerChange({ selectRows: [buyer] }) {
      const identityCardName = buyer?.identityCardName !== null ? buyer?.identityCardName : ''
      const { idList: materialIdList, checkedKeys: materialCategoryIds } = this
      const data = {
        materialIdList,
        materialCategoryIds,
        buyerUserId: buyer?.id,
        buyerUserName: identityCardName
      }
      const res = await buyerAllot(data)
      if (res.code === '0') {
        this.$message.success('分配成功')
        console.log(this.idList)
        this.idList = []
        this.search()
      }
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onChange(value) {
      if (!value) {
        this.categoryList = [...this.list]
        this.searchValue = ''
        return
      }
      this.searchValue = value
      const list = JSON.parse(JSON.stringify(this.list))
      this.categoryList = getSearchList(list, value.toLocaleLowerCase())
    },
    generateList(data) {
      for (let i = 0; i < data.length; i++) {
        const node = data[i]
        const id = node.id
        const name = node.name
        dataList.push({ id, name })
        if (node.children) {
          this.generateList(node.children)
        }
      }
    }
  },
  computed: {
    rowSelection() {
      const that = this
      return {
        onChange: (selectedRowKeys, selectedKeys) => {
          that.idList = selectedRowKeys
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.center {
  text-align: center;
  margin-top: 20px;
}
.container {
  display: flex;
  flex-flow: column;
  .merchantNames {
    display: flex;
    align-items: center;
    .d-select {
      margin-left: 10px;
    }
  }
  .button {
    margin-top: 20px;
  }
  .tree-select {
    height: 32px;
  }
}
.wrap {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.bottoms {
  margin-bottom: 20px;
}
.lefts {
  width: 300px;
  background-color: #fff;
  margin-right: 20px;
  .lefts-aligns {
    display: flex;
  }
  // .inpsrh {
  //   width: 150px;
  // }
}
.m-bottom {
  margin-top: 5px;
  margin-bottom: 15px;
}
.mid {
  margin: 0;
  padding: 0;
  width: 100%;
  height: auto;
  .header {
    padding-top: 20px;
    width: 100%;
    height: auto;
    .distance {
      width: auto;
      float: left;
      .input {
        width: 200px;
      }
    }
    .autos {
      text-align: center;
      margin-top: 15px;
      .search {
        margin-left: 20px;
      }
    }
    .middle {
      display: flex;
      justify-content: center;
      align-content: center;
      .reset {
        margin-left: 8px;
        margin-top: 15px;
      }
      .search {
        margin-left: 20px;
        margin-top: 15px;
      }
    }
    .separate {
      margin-left: 10px;
    }
    .Longer {
      width: 174px;
    }
    .ipt {
      width: 84px;
    }
  }
  .cart-top {
    margin-top: 20px;
  }
  .contest {
    width: 100%;
    height: auto;
    .margin {
      width: auto;
      margin-right: 15px;
    }
    .mar-left {
      margin-left: 5px;
    }
    .margin-right {
      margin-right: 15px;
    }
    .green {
      width: 6px;
      height: 6px;
      background: #52c41a;
      display: inline-block;
      position: relative;
      top: -2px;
      border-radius: 50%;
      margin-right: 6px;
    }
    .orange {
      background: #ff8720;
    }
    .red {
      background: red;
    }
  }
}
.SearchName {
  text-align: center;
  display: flex;
  align-items: center;
  span {
    margin-left: 60px;
  }
  .searchLeft {
    margin-left: 10px;
  }
  .nameSearchIpt {
    width: 300px;
  }
}
/deep/ .vue-treeselect__menu-container {
  min-width: 300px;
}
</style>
