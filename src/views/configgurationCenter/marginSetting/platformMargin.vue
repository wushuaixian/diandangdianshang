<!--
 * @Author: your name
 * @Date: 2021-06-19 13:07:53
 * @LastEditTime: 2021-07-27 01:06:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/configgurationCenter/marginSetting/platformMargin.vue
-->
<template>
  <div>
    平台保证金
    <a-card :bordered="false">
      <a-row :gutter="24">
        <a-col :span="8">
          <a-tree
            v-model="checkedKeys"
            checkable
            :expanded-keys="expandedKeys"
            :auto-expand-parent="autoExpandParent"
            :selected-keys="selectedKeys"
            :tree-data="treeData"
            :replaceFields="replaceFields"
            @expand="onExpand"
            @select="onSelect"
          >
            <template slot="title0010" slot-scope="scope">
              <div class="tree-item">
                <span>{{ scope.name }}</span>
                <span class="tree-item-price">{{ scope.dataRef.highPrice }}</span>
              </div>
            </template>
          </a-tree>
        </a-col>
        <a-col :span="15">
          <div>
            <div class="right-log">
              <span class="right" @click="visible = true">查看操作日志</span>
            </div>
            <a-form :form="platformMarginForm">
              <a-form-item :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }" label="平台保证金类目基准金额">
                <!-- pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, -->
                <a-input-number
                  v-decorator="[
                    'price',
                    {
                      rules: [
                        { required: true, message: '请输入平台保证金类目基准金额' },
                        {
                          pattern: /^(\d{1,8}(\.\d{1,2})?$)/,
                          message: '最多输入10位数字(支持两位小数)',
                          trigger: 'change'
                        }
                      ]
                    }
                  ]"
                  :step="0.01"
                  :formatter="(value) => (value.includes('.') ? value.slice(0, 11) : value.slice(0, 8))"
                  :parser="(value) => (value.includes('.') ? value.slice(0, 11) : value.slice(0, 8))"
                  placeholder="请输入平台保证金类目基准金额"
                  @change="handlePrice"
                />
                <span class="ant-form-item-children-span">元</span>
              </a-form-item>
              <a-form-item>
                <a-button type="primary" @click="submit">保存</a-button>
              </a-form-item>
            </a-form>
          </div>
        </a-col>
      </a-row>
    </a-card>
    <!-- 查看操作日志弹窗 -->
    <a-modal title="查看操作日志" width="800px" :visible.sync="visible" @ok="handleOk" @cancel="handleCancel">
      <a-form>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-form-item :label-col="{ span: 4 }" :wrapper-col="{ span: 8 }" label="选择类目">
              <a-select
                ref="selectValue"
                show-search
                placeholder="请选择"
                :value="selectCategoryId"
                style="width: 200px"
                @focus="handleFocus"
                @blur="handleBlur"
                @change="handleChange"
              >
                <a-select-option v-for="(item, index) in selectCategrayList" :key="index" :value="item.id">
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-form-item class="selectAllocaltionTable-btn">
            <a-button @click="handleChange('')">重置</a-button>
            <a-button type="primary" @click="searchCategoryList">查询</a-button>
          </a-form-item>
        </a-row>
      </a-form>
      <s-table
        name="selectAllocaltionTables"
        ref="selectAllocaltionTable"
        :columns="platFormMarginTableColumns"
        :data="platFormMarginTableColumnsGetList"
        rowKey="id"
        :scroll="{ x: 300, y: 300 }"
        :isCanFilter="false"
      >
        <template slot="createTime" slot-scope="scope">
          <div>{{ scope | moment('YYYY-MM-DD HH:mm:ss') }}</div>
        </template>
      </s-table>
      <template slot="footer">
        <a-button @click="handleCancel">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { selectCategoryPO, selectCategoryLogByQuery, updataCategoryPO } from '@/api/configgurationCenter'
import { queryMerAllCategory } from '@/api/user'
const treeData = []
export default {
  name: 'PlatformMargin',
  data() {
    return {
      treeData,
      expandedKeys: [], // 展开指定的树节点
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      platformMarginForm: this.$form.createForm(this, { name: 'platformMarginFormName', price: '' }),
      replaceFields: {},
      visible: false,
      selectCategoryId: null,
      selectCategrayList: [],
      platFormMarginTableColumns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          align: 'center'
        },
        {
          title: '类目名称',
          dataIndex: 'name',
          key: 'name',
          align: 'center',
          width: 150
        },
        {
          title: '平台保证金类目基准金额(元)',
          dataIndex: 'depositUperAmount',
          key: 'depositUperAmount',
          align: 'center',
          width: 250
        },
        {
          title: '操作人',
          dataIndex: 'createUsername',
          key: 'createUsername',
          align: 'center',
          width: 150
        },
        {
          title: '操作时间',
          dataIndex: 'createTime',
          key: 'createTime',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'createTime' }
        }
      ]
      // platFormMarginTableColumnsGetList: []
    }
  },
  mounted() {
    this.init()
    this.getCategory()
  },
  methods: {
    searchCategoryList() {
      this.$refs.selectAllocaltionTable.refresh(true)
    },
    async platFormMarginTableColumnsGetList(params) {
      const { data } = await selectCategoryLogByQuery({
        categoryId: this.selectCategoryId,
        depositType: '1',
        ...params
      })
      if (data.data && data.data.length > 0) {
        data.data.map((item, index) => {
          this.$set(item, 'index', index + 1)
        })
      }
      const res = {
        data: {
          listObj: data.data || [],
          total: data?.total
        }
      }
      return res
    },
    onExpand(expandedKeys) {
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck(checkedKeys) {
      this.checkedKeys = checkedKeys
    },
    onSelect(selectedKeys, info) {
      this.selectedKeys = selectedKeys
    },
    async submit() {
      const that = this
      this.platformMarginForm.validateFields(async (err, value) => {
        console.log(err)
        if (!err) {
          const result = await updataCategoryPO({
            ids: that.checkedKeys,
            highPrice: value.price
          })
          if (result.code === '0') {
            this.init()
            this.$message.success('保存成功')
          }
        }
      })
    },
    handleOk() {
      this.visible = false
    },
    handleCancel() {
      this.visible = false
    },
    handleChange(value) {
      this.selectCategoryId = value
    },
    handleBlur() {},
    handleFocus() {},
    filterOption(input, option) {
      // return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    async init() {
      const result = await selectCategoryPO({
        level: 2,
        type: 1,
        isdeleted: '0'
      })
      this.treeData = result.data
      this.treeData.map((item) => {
        item.scopedSlots = { title: 'title0010' }
      })
      this.replaceFields = { title: 'name', key: 'id' }
    },
    async getCategory() {
      const { data } = await queryMerAllCategory()
      this.selectCategrayList = data
    },
    handlePrice(value) {
      if (!value) return
      this.platformMarginForm.setFieldsValue({ price: value })
    }
  }
}
</script>
<style lang="less" scoped>
.tree-item {
  display: flex;
  justify-content: space-between;
  position: relative;
  .tree-item-price {
    color: #ff6b00;
    margin-right: 20px;
    // position: absolute;
    // right: 0px;
    // top: 50%;
    // min-width: 50px;
    // transform: translate(-50%, -50%);
  }
}
/deep/ .ant-tree-treenode-switcher-close {
  display: flex;
  .ant-tree-node-content-wrapper {
    flex: 1;
  }
}
/deep/ .ant-tree {
  border: 1px solid #eee;
  min-height: 600px;
}
.right-log:hover {
  color: #ff6b00;
}
.right-log {
  text-align: right;
  cursor: pointer;
  margin-bottom: 20px;
}
/deep/ .ant-form-item-children {
  white-space: nowrap;
  .ant-form-item-children-span {
    margin-left: 5px;
  }
}
/deep/ .ant-form-item-control {
  text-align: center;
}
.selectAllocaltionTable-btn {
  display: block;
  text-align: center;
  margin: 20px 0px;
  /deep/ .ant-btn-primary {
    margin: 0px 10px;
  }
}
/deep/ .ant-input-number {
  display: inline-block;
  width: 200px;
}
/deep/ .ant-input-number-handler-wrap {
  display: none;
}
// /deep/ .ant-modal-body {
//   max-height: 600px;
//   overflow: scroll;
// }
</style>
