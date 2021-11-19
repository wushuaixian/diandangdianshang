<template>
  <div class="category-audit-detail">
    <a-card>
      <header-title>
        <span>经营品类详情</span>
      </header-title>
      <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="企业名称">
          {{ $$(info, 'enterpriseName') }}
        </a-form-item>
        <a-form-item label="类目名称">
          <a>{{ $$(info, 'name') }}</a>
        </a-form-item>
        <a-form-item label="申请时间">
          {{ $$(info, 'updateTime') | moment }}
        </a-form-item>
        <a-form-item label="营业执照">
          <ImagePreview :value="$$(info, 'businessLicenceUrl')" />
        </a-form-item>
      </a-form>
    </a-card>
    <fixed-box>
      <a-button @click="handleCancel">取消</a-button>
      <a-button @click="handleAudit" type="primary" v-if="$$(info, 'auditStatus') === '1'">审核</a-button>
    </fixed-box>
    <ExaminePopup :popupStatus.sync="visible" @submitExamine="onSave" />
  </div>
</template>

<script>
import { getDetail, auditCategoryList } from '@/api/categoryaudit'
import { ExaminePopup, ImagePreview } from '@/components/'
import _ from 'loadsh'

export default {
  components: { ImagePreview, ExaminePopup },
  data() {
    return {
      visible: false,
      info: {}
    }
  },
  mounted() {
    this.getDetail()
    this.onSave = _.debounce(this.onSave, 500)
  },
  methods: {
    async getDetail() {
      const {
        $route: {
          params: { id }
        }
      } = this
      const res = await getDetail({ id })
      if (res.code === '0') {
        this.info = res.data
      }
    },
    handleCancel() {
      this.$router.go(-1)
    },
    handleAudit() {
      this.visible = true
    },
    async onSave(status, message) {
      const {
        $route: {
          params: { id, merchantId }
        }
      } = this
      const ids = [id]
      const res = await auditCategoryList({ merchantId, ids, status: status === 1 ? 2 : 3, message })
      if (res.code === '0') {
        this.$message.success('审核成功')
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.category-audit-detail {
  .ant-form {
    margin-top: 20px;
  }
}
</style>
