<template>
  <div class="the-certificate">
    <header-title>
      <span>资质证书</span>
    </header-title>
    <div class="table">
      <s-table ref="table" rowKey="id" name="ThecertficateTable" :columns="columns" :scroll="{ x: 1500 }" :data="init">
        <template slot="authStatus" slot-scope="a, text">
          <span v-show="text.certificationStatus == 0">未认证</span>
          <span v-show="text.certificationStatus == 1">已认证</span>
          <span v-show="text.certificationStatus == 2">
            认证不通过
            <a-tooltip placement="top">
              <template slot="title">
                <span>{{ text.authReason }}</span>
              </template>
              <a-icon type="question-circle" placement="top" />
            </a-tooltip>
          </span>
        </template>
        <template slot="certificate" slot-scope="a, text">
          <ImagePreview :width="40" :height="40" :value="$$(text, 'certificateUrl')" />
        </template>
        <template slot="issueBeginTime" slot-scope="a, text">
          <span>{{ text.issueBeginTime | moment }}</span>
        </template>
        <template slot="issueEndTime" slot-scope="a, text">
          <span>{{ text.issueEndTime | moment }}</span>
        </template>
      </s-table>
    </div>
  </div>
</template>

<script>
import { qualificationCertificate } from '@/api/supplieAuthAdmin'
import { ImagePreview } from '@/components/'
export default {
  components: { ImagePreview },
  data() {
    return {
      columns: [
        {
          title: '资质类型',
          dataIndex: 'certificateType',
          width: 150,
          key: 'qualificationsType'
        },
        // {
        //   title: '证书名称',
        //   dataIndex: 'certificateName',
        //   key: 'certificateName',
        //   width: 150
        // },
        {
          title: '证书编号',
          width: 120,
          dataIndex: 'certificateNumber',
          key: 'certificatNumber'
        },
        {
          title: '颁发机构',
          width: 120,
          dataIndex: 'issueAuthority',
          key: 'issuingAuthority'
        },
        {
          title: '颁发日期',
          dataIndex: 'issueBeginTime',
          key: 'issueBeginTime',
          scopedSlots: { customRender: 'issueBeginTime' },
          width: 120
        },
        {
          title: '有效期至',
          dataIndex: 'issueEndTime',
          key: 'issueEndTime',
          scopedSlots: { customRender: 'issueEndTime' },
          width: 120
        },
        {
          title: '证书附件',
          dataIndex: 'certificate',
          key: 'certificate',
          width: 100,
          scopedSlots: { customRender: 'certificate' }
        },
        {
          title: '认证状态',
          width: 100,
          dataIndex: 'authStatus',
          key: 'authStatus',
          scopedSlots: { customRender: 'authStatus' }
        }
      ]
    }
  },
  methods: {
    async init(params) {
      const { query } = this
      var data = {
        ...params,
        ...query,
        merchantId: this.$route.params.id
      }
      return qualificationCertificate({ ...data })
    }
  }
}
</script>

<style lang="less" scoped>
.the-certificate {
  .table {
    margin-top: 20px;
  }
}
</style>
