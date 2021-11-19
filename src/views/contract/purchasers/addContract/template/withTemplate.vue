<template>
  <div class="contract-with-template">
    <div class="box">
      <header-title class="header-title">
        <span>合同内容</span>
      </header-title>
      <a-popover title="选择要插入表格的字段" v-model="visibleTableCheck" trigger="click" placement="bottomLeft">
        <template slot="content">
          <div style="width: 280px; max-height: 516px; overflow: auto">
            <a-checkbox-group @change="onChangeTableKey">
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
        <a-button type="primary" style="margin-top: 10px">插入表格</a-button>
      </a-popover>
      <tinymce-editor
        :disabled="$$($route.query, 'type') === 'read'"
        style="margin-top: 10px"
        ref="editor"
        v-model="preview.contractContent"
      />
    </div>
    <div class="box">
      <header-title class="header-title">
        <span>合同预览</span>
      </header-title>
      <div class="content-box">
        <div class="content" v-html="preview.previewDom"></div>
      </div>
    </div>
    <div style="height: 40px"></div>
  </div>
</template>

<script>
import $ from 'jquery'
import TinymceEditor from '@/components/Editor/TinymceEditor.vue'
export default {
  components: { TinymceEditor },
  model: {
    prop: 'preview',
    event: 'change'
  },
  props: {
    preview: {
      type: Object,
      default: () => ({
        columns: [],
        funcList: [],
        previewDom: '',
        table: '',
        contractContent: ''
      })
    },
    materialList: {
      type: Object,
      default: () => ({
        list: [],
        lowerContractTotal: 0,
        upperContractTotal: '',
        number: 0, // 导入类型 0.物料池导入，1.模板导入
        title: '物料池导入',
        importVisible: false,
        importLoading: false,
        fileList: []
      })
    },
    contractType: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.changeContent()
  },
  data() {
    return {
      isInsertFooter: false,
      visibleTableCheck: false,
      selTableColum: []
    }
  },
  methods: {
    insertTable() {
      if (this.selTableColum.length > 0) {
        if (this.preview.contractContent.indexOf(`data-name="table_header"`) > -1) {
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
      }
    },
    onChangeTableKey(v) {
      this.selTableColum = v
    },
    changeContent() {
      const tableclone = $(`<div>${this.preview.contractContent}</div>`).clone()
      const bodyclone = tableclone.find("[data-name='table_body']").find('tr').clone()
      const edit = tableclone.find("[data-name='table_body']").find('tr').clone()
      tableclone.find("[data-name='table_body']").html('')
      let num = 0
      this.materialList.list.map((x) => {
        if (!x?.status || (x?.status && x?.status === 1)) {
          num++
          bodyclone.find('td').map((index) => {
            const code = bodyclone.find('td').eq(index).attr('data-code')
            const content = code === 'index' ? num : x[code]
            const td = edit.find('td').eq(index)
            td.find('span').length > 0 ? td.find('span').html(content) : td.html(content)
          })
          tableclone.find("[data-name='table_body']").append(`<tr>${edit.html()}</tr>`)
        }
      })
      this.preview.previewDom = tableclone.html()
      this.$forceUpdate()
    }
  },
  watch: {
    'preview.contractContent': {
      handler() {
        this.changeContent()
      },
      deep: true
    }
  }
}
</script>
<style lang="less" scoped>
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
.box {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(154, 170, 180, 0.2);
  margin-bottom: 24px;
  .file {
    display: flex;
    flex-direction: row;
    margin-top: 16px;
    .file-name {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #262626;
      text-align: right;
      line-height: 34px;
    }
    .file-list {
      width: 400px;
    }
  }
  .content-box {
    display: flex;
    flex-direction: row;
    margin-top: 16px;
    justify-content: center;
    /deep/.content {
      border: solid 1px #eee;
      padding: 24px;
      width: 794px;
      p {
        word-wrap: break-all;
      }
    }
    .funcs {
      width: 400px;
    }
  }
  /deep/.table-footer {
    padding: 8px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .l {
      span {
        margin-right: 40px;
      }
    }
  }
}
</style>
