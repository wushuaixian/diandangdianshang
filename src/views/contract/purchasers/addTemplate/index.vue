<template>
  <section class="contract">
    <Basic ref="templateForm" :templateSource="templateSource" :platformId="platformId" :form="form" />
    <Template :form="form" :templateSource="templateSource" :platformId="platformId" :funcList.sync="funcList" />
    <a-modal v-model="visible" title="模板预览" :width="794">
      <template slot="footer">
        <a-button key="back" @click="() => (visible = false)"> 关闭 </a-button>
      </template>
      <div class="content contract-preview-dom" v-html="form.contractContent"></div>
    </a-modal>

    <div class="btns">
      <a-button class="btn" size="large" @click="$router.back(-1)">取消</a-button>
      <a-button
        class="btn"
        size="large"
        v-if="$route.query.id && !$route.query.copy"
        v-show="status === '0'"
        @click="EditStatus('1')"
      >
        启用
      </a-button>
      <a-button
        class="btn"
        size="large"
        v-if="$route.query.id && !$route.query.copy"
        v-show="status === '1'"
        @click="EditStatus('0')"
      >
        停用
      </a-button>
      <a-button class="btn" size="large" @click="() => (visible = true)">预览</a-button>
      <a-button class="btn" type="primary" size="large" @click="Save">保存</a-button>
    </div>
  </section>
</template>

<script>
import { Basic, Template } from './components/index'
import * as api from '@/api/contract'
import { mapState } from 'vuex'
export default {
  components: { Basic, Template },
  created() {
    this.BindData()
  },
  props: {
    templateSource: {
      type: Number,
      default: 3
    },
    platformId: {
      type: Number,
      default: 7
    }
  },
  computed: {
    ...mapState({
      info: (state) => state.user.info,
      isPlatform: (state) => state.permission.isPlatform
    })
  },
  data() {
    return {
      funcList: [],
      selTableColum: [],
      table: '',
      visible: false,
      status: '0',
      form: {
        merchantId: undefined,
        merchantName: '',
        code: '',
        name: '',
        templateType: undefined,
        remark: '',
        contractContent: '',
        templateVariable: '',
        contractContentShow: ''
      },
      previewDom: ''
    }
  },
  methods: {
    async BindData() {
      const res = await api.getTemplateDetail(this.$route.query.id)
      if (res.code === '0') {
        this.form.contractContent = res.data.contractContent
        this.form.merchantId = res.data.merchantId
        this.form.merchantName = res.data.merchantName
        this.form.name = res.data.name
        if (!this.$route?.query?.copy) {
          this.form.code = res.data.code
        }
        this.form.templateType = res.data.templateType
        this.form.remark = res.data.remark
        this.status = res.data.status
        this.$forceUpdate()
      }
    },

    EditStatus(status) {
      api.setUpdateTemplateStatus(this.$route.query.id, status).then((ret) => {
        if (ret.code === '0') {
          this.$message.success(`${status === '1' ? '启用' : '停用'}成功`)
          this.status = status
        }
      })
    },
    Save() {
      this.$refs.templateForm.$refs.templateForm.validate((valid) => {
        if (valid) {
          this.form.templateVariable = this.funcList?.map((m) => ({ code: m.code, name: m.name, show: m.show })) || []
          this.form.contractContentShow = this.form.contractContent
          this.form.contractContent = this.form.contractContent.replace(/<p \/>/g, `<p/>`)
          if (this.$route.query.id) {
            if (this.$route?.query?.copy) {
              api
                .setCopyTemplate({ ...this.form, id: this.$route.query.id, platformId: this.isPlatform })
                .then((ret) => {
                  if (ret.code === '0') {
                    this.$router.push({
                      name: this.templateSource === 3 ? 'ContractPurchaseTemplateList' : 'ContractSuppliersTemplateList'
                    })
                    this.$message.success('复制保存成功')
                  }
                })
            } else {
              api.setEditTemplate({ ...this.form, id: this.$route.query.id }).then((ret) => {
                if (ret.code === '0') {
                  this.$router.push({
                    name: this.templateSource === 3 ? 'ContractPurchaseTemplateList' : 'ContractSuppliersTemplateList'
                  })
                  this.$message.success('保存成功')
                }
              })
            }
          } else {
            api
              .setAddTemplate({ ...this.form, templateSource: this.templateSource, platformId: this.isPlatform })
              .then((ret) => {
                if (ret.code === '0') {
                  this.$router.push({
                    name: this.templateSource === 3 ? 'ContractPurchaseTemplateList' : 'ContractSuppliersTemplateList'
                  })
                  this.$message.success('保存成功')
                }
              })
          }
        }
      })
    }
  }
  // watch: {
  //   'form.contractContent': {
  //     handler() {
  //       this.changeContractContent()
  //     },
  //     deep: true
  //   }
  // }
}
</script>

<style lang="less" scoped>
/deep/.tree-box {
  width: 260px;
  height: 516px;
}
.contract {
  display: flex;
  flex-direction: column;
  .header-title {
    margin-bottom: 16px;
  }
  .box {
    border-radius: 8px;
    background: #fff;
    padding: 24px;
    margin-bottom: 24px;
  }
  .content-box {
    display: flex;
    flex-direction: row;
    /deep/.content {
      flex: 1;
      border: solid 1px #eee;
      padding: 24px;
      p {
        word-wrap: break-all;
      }
    }
    .funcs {
      width: 400px;
    }
  }
  .table-footer {
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
  .btns {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: #fff;
    padding: 24px;
    margin-bottom: 24px;
    .btn {
      margin: 0 10px;
      width: 100px;
      height: 40px;
    }
  }
}
</style>
