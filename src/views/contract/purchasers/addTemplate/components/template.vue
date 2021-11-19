<template>
  <div class="box" v-if="form !== null">
    <header-title class="header-title">
      <span>模板内容</span>
    </header-title>
    <a-popover
      v-model="visibleTree"
      trigger="click"
      placement="bottomLeft"
      :getPopupContainer="(triggerNode) => triggerNode.parentNode"
    >
      <template slot="content">
        <div style="width: 260px; max-height: 516px; overflow: auto">
          <a-tree v-model="checkedKeys" show-line :defaultExpandAll="true" @select="handleSelectTree">
            <a-tree-node v-for="(item, index) in funcListAjax.treeList" :key="`null_${index}`" :title="item.name">
              <a-tree-node
                v-for="(item_1, index_1) in item.childrens"
                :key="`null_${index}_${index_1}`"
                :title="item_1.name"
              >
                <a-tree-node v-for="item_2 in item_1.childrens" :key="item_2.name" :title="item_2.name"></a-tree-node>
              </a-tree-node>
            </a-tree-node>
          </a-tree>
        </div>
      </template>
      <a-button type="primary">插入变量</a-button>
    </a-popover>
    &nbsp;
    <a-popover
      v-model="visibleCustomerFunc"
      trigger="click"
      placement="bottomLeft"
      :getPopupContainer="(triggerNode) => triggerNode.parentNode"
    >
      <template slot="content">
        <div class="submit" style="width: 300px">
          <a-input v-model="customerFunc" placeholder="请输入自定义变量名称"></a-input>
          &nbsp;
          <a-button type="primary" style="margin-left: auto" @click="insertCustomerFunc">确定</a-button>
        </div>
      </template>
      <a-button type="primary">插入自定义变量</a-button>
    </a-popover>
    &nbsp;
    <a-popover
      title="选择要插入表格的字段"
      v-model="visibleTableCheck"
      trigger="click"
      placement="bottomLeft"
      :getPopupContainer="(triggerNode) => triggerNode.parentNode"
    >
      <template slot="content">
        <div style="width: 280px; max-height: 516px; overflow: auto">
          <a-checkbox-group v-model="selTableColum">
            <a-row>
              <a-col v-for="(item, index) in $store.state.contract.tableTemplate" :key="index" :span="item.span">
                <a-checkbox :value="`${item.name}@${item.key}`">{{ item.name }}</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </div>
        <div class="submit">
          <a-switch size="small" v-model="isInsertFooter" />
          <div class="title">是否插入表尾</div>
          <a-button type="primary" style="margin-left: auto" @click="insertTable">插入表格</a-button>
        </div>
      </template>
      <a-button>插入表格</a-button>
    </a-popover>
    &nbsp;
    <a-button @click="insertHiddenTable">插入合同表头</a-button>
    <tinymce-editor style="margin-top: 10px" ref="editor" v-model="form.contractContent" />
  </div>
</template>

<script>
import * as api from '@/api/contract'
import { GetFunc } from '@/utils/util'
import TinymceEditor from '@/components/Editor/TinymceEditor.vue'
export default {
  created() {
    this.BindFuncData()
  },
  components: { TinymceEditor },
  props: {
    form: { type: Object, default: null },
    funcList: { type: Array, default: () => [] },
    templateSource: { type: Number, default: 3 },
    platformId: { type: Number, default: 7 }
  },
  data() {
    return {
      customerFunc: '',
      visibleCustomerFunc: false,
      isInsertFooter: false,
      visibleTree: false,
      visibleTableCheck: false,
      selTableColum: [],
      checkedKeys: [],
      funcListAjax: { treeList: [], list: [] }
    }
  },
  methods: {
    async BindFuncData() {
      const res = await Promise.all([api.getPlatContractVariable(this.platformId)])
      if (res[0].code === '0') {
        this.funcListAjax.treeList = res[0].data.treeList
        this.funcListAjax.list = res[0].data.list
      }
      this.$forceUpdate()
    },
    handleSelectTree(key, e) {
      const sel = e.node.$vnode.data.key
      if (sel.indexOf('null_') <= -1) {
        this.$refs.editor.insertContent(`{${sel}}`)
        this.visibleTree = false
      }
    },
    insertCustomerFunc() {
      if (this.customerFunc.trim() === '') {
        this.$message.info('请填写变量名')
        return
      }
      this.$refs.editor.insertContent(`{${this.customerFunc.trim()}}`)
      this.customerFunc = ''
      this.visibleCustomerFunc = false
    },
    insertTable() {
      if (this.selTableColum.length > 0) {
        if (this.form.contractContent.indexOf(`data-name="table_header"`) > -1) {
          this.$message.info('当前编辑器中已有表格，不能重复插入')
          return
        }
        const tableList = this.selTableColum.map((x) => {
          return { name: x.split('@')[0], code: x.split('@')[1] }
        })
        let tablehead = '<th style="text-align: center; padding: 8px; font-size: 9pt" data-code="index">序号</th>'
        tableList.map((x) => {
          tablehead += `<th style="text-align: center; padding: 8px; font-size: 9pt" data-code="${x.code}">${x.name}</th>`
        })
        let tablebody = '<td style="text-align: center; padding: 8px; font-size: 9pt" data-code="index">1</td>'
        tableList.map((x) => {
          tablebody += `<td style="text-align: center; padding: 8px; font-size: 9pt" data-code="${x.code}">示例</td>`
        })
        const tablefooter = this.isInsertFooter
          ? `<tr><td colspan="${
              tableList.length + 1
            }"><div style="display:flex;flex-direction:row;font-size:9px;padding: 8px;"><div style="flex:1;"><div>左侧区域</div></div><div><div>右侧区域</div></div></div></td></tr>`
          : ``
        const tableDomStr = `
        <table border="1" style="width: 100%;word-break: break-all;word-wrap: break-word;">
          <thead style="display: table-header-group; text-align: center" data-name="table_header">
            <tr>${tablehead}</tr>
          </thead>
          <tbody style="text-align: center" data-name="table_body">
            <tr>${tablebody}</tr>
          </tbody>
          ${tablefooter}
        </table>
        `
        this.$refs.editor.insertContent(tableDomStr)
        this.visibleTableCheck = false
      } else {
        this.$message.info('选择要插入表格的字段')
      }
    },
    insertHiddenTable() {
      this.$refs.editor.insertHiddenTable()
    }
  },
  watch: {
    visibleTableCheck() {
      this.selTableColum = []
      this.isInsertFooter = false
    },
    visibleCustomerFunc() {
      this.customerFunc = ''
    },
    'form.contractContent': {
      handler() {
        const funcList = []
        GetFunc(this.form.contractContent).map((m) => {
          const trueList = this.funcListAjax.list.find((x) => x.name === m)
          let i = 0
          if (trueList) {
            funcList.push({ code: trueList.code, name: trueList.name, value: '', show: false })
          } else {
            i++
            funcList.push({ code: `ext_${i}`, name: m, value: '', show: true })
          }
        })
        this.$emit('update:funcList', funcList)
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.header-title {
  margin-bottom: 16px;
}
.submit {
  display: flex;
  flex-direction: row;
  align-items: center;
  .title {
    font-size: 10px;
    line-height: 10px;
    height: 10px;
    margin-left: 4px;
  }
}
</style>
