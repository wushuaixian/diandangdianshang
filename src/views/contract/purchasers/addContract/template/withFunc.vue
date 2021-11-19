<template>
  <div>
    <div class="box">
      <header-title class="header-title">
        <span>合同预览</span>
      </header-title>
      <div class="content-box">
        <div class="content" id="contract_template_func" v-html="preview.previewDom"></div>
        <div class="funcs" style="width: 370px">
          <a-form-model :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
            <template v-for="(item, index) in preview.funcList">
              <a-form-model-item v-if="item.name !== '' && item.show" :key="index" :label="item.name">
                <a-textarea
                  auto-size
                  v-model="item.value"
                  placeholder="请输入内容"
                  :disabled="$$($route.query, 'type') === 'read'"
                />
              </a-form-model-item>
            </template>
          </a-form-model>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  created() {},
  model: {
    prop: 'preview',
    event: 'change'
  },
  props: {
    defaultFunc: {
      type: Array,
      default: () => []
    },
    preview: {
      type: Object,
      default: () => ({
        funcList: [],
        previewDom: '',
        contractContent: ''
      })
    },
    materialList: {
      type: Object,
      default: () => ({
        list: [],
        lowerContractTotal: '',
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
  mounted() {
    this.initContent()
  },
  methods: {
    initContent() {
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
      this.preview.contractContent = tableclone.html()
      this.$forceUpdate()
      this.changeFuncList()
    },
    changeFuncList() {
      const funcObj = {}
      this.preview.funcList.map((m) => {
        const content = String(m.value).replace(/\n/g, '<br/>')
        funcObj[`${m.name}`] = m.value !== '' ? content : `<font color="#FF0000">{${m.name}}</font>`
      })
      const newValue = this.preview.contractContent
      this.preview.previewDom = newValue.replace(/{(.*?)}/g, (m, k) => {
        const trueList = this.preview.funcList.filter((x) => {
          if (x.name === k) return { name: x.name, code: x.code }
        })
        if (trueList.length > 0) return funcObj[k.trim()]
        else return `{${k}}`
      })
      this.$forceUpdate()
    }
  },
  watch: {
    'preview.funcList': {
      handler() {
        this.changeFuncList()
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(154, 170, 180, 0.2);
  height: calc(100vh - 176px);
  margin-bottom: 64px;
  overflow: hidden;
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
    height: 100%;
    overflow: hidden;
    /deep/.content {
      border: solid 1px #eee;
      padding: 24px;
      width: 794px;
      height: calc(100% - 40px);
      overflow: auto;
      p {
        word-wrap: break-all;
      }
    }
    .funcs {
      width: 400px;

      height: calc(100% - 40px);
      overflow: auto;
    }
  }
}
</style>
