<template>
  <div class="template-list">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model
          layout="inline"
          ref="ruleForm"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :model="queryParam"
        >
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="公司名称" prop="merchantIds">
                <a-select
                  v-if="Number($store.state.permission.isPlatform) === 1"
                  allowClear
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  show-search
                  placeholder="请输入公司名称查询"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  :not-found-content="fetching ? undefined : null"
                  @search="handleSearch"
                  mode="multiple"
                  v-model="queryParam.merchantIds"
                >
                  <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                  <a-select-option v-for="item in comList" :key="item.orgName" :value="item.id">
                    {{ item.orgName }}
                  </a-select-option>
                </a-select>
                <d-select
                  v-else
                  v-model="queryParam.merchantIds"
                  mode="multiple"
                  :default-value="[]"
                  placeholder="请选择公司"
                  :options="
                    comList.map((item) => {
                      return {
                        value: item.id,
                        label: item.orgName
                      }
                    })
                  "
                ></d-select>
              </a-form-model-item>
            </a-col>
            <!-- <a-col v-else :md="8" :sm="24">
              <a-form-model-item label="公司名称" prop="merchantName">
                <a-input v-model="queryParam.merchantName" :disabled="true" placeholder="" />
              </a-form-model-item>
            </a-col> -->
            <a-col :md="8" :sm="24">
              <a-form-model-item label="模板编号" prop="code">
                <a-input v-model="queryParam.code" placeholder="请输入模板编号" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="模板名称" prop="name">
                <a-input v-model="queryParam.name" placeholder="请输入模板名称" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="模板类型" prop="templateType">
                <a-select
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  allowClear
                  v-model="queryParam.templateType"
                  :options="templateType"
                  placeholder="请选择"
                  default-value=""
                >
                </a-select>
              </a-form-model-item>
            </a-col>
            <!-- <a-col :md="8" :sm="24">
              <a-form-model-item label="状态" prop="status">
                <a-select
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  allowClear
                  v-model="queryParam.status"
                  :options="status"
                  placeholder="请选择"
                  default-value=""
                  style="width: 250px"
                >
                </a-select>
              </a-form-model-item>
            </a-col> -->
            <a-col :md="24" :sm="24" class="button">
              <a-button @click="handleReset">重置</a-button>
              <a-button type="primary" @click="search">查询</a-button>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>

    <a-card>
      <div>
        <a-tabs default-active-key="" v-model="queryParam.status" @change="selIndex">
          <a-tab-pane key="" :tab="`全部(${count.total})`"></a-tab-pane>
          <a-tab-pane key="1" :tab="`已启用(${count[1]})`" force-render></a-tab-pane>
          <a-tab-pane key="0" :tab="`已停用(${count[0]})`"></a-tab-pane>
          <a-tab-pane key="2" :tab="`草稿(${count[2]})`"></a-tab-pane>
        </a-tabs>
      </div>
      <a-button type="primary" @click="Add">新增合同模板</a-button>
      <s-table
        name="template"
        style="margin-top: 10px"
        rowKey="id"
        ref="table"
        :columns="columns"
        :data="init"
        :scroll="{ x: 2000 }"
      >
        <template slot="status" slot-scope="text, item">
          <span v-if="item.status === '0'"> 停用 </span>
          <span v-else-if="item.status === '1'"> 启用 </span>
          <span v-else-if="item.status === '2'"> 草稿 </span>
          <span v-else> 未知 </span>
        </template>
        <template slot="templateType" slot-scope="text, item">
          <span v-if="item.templateType === 1"> 购销合同 </span>
          <span v-else-if="item.templateType === 2"> 服务合同 </span>
          <span v-else-if="item.templateType === 3"> 工程合同 </span>
          <span v-else-if="item.templateType === 4"> 其他合同 </span>
          <span v-else> 未知 </span>
        </template>

        <template slot="updateTime" slot-scope="updateTime">
          {{ updateTime | moment('yyyy-MM-DD HH:mm:ss') }}
        </template>
        <template slot="name" slot-scope="text, item">
          <a-button type="link" style="min-width: 40px; padding: 0" @click="Detail(item)">{{ item.name }}</a-button>
        </template>
        <template slot="templateSource" slot-scope="text, item">
          <span v-if="item.templateSource === 1"> 平台 </span>
          <span v-else> 公司 </span>
        </template>
        <template
          slot="operation"
          slot-scope="text, item"
          v-if="$hasOpeerate() || (!$hasOpeerate() && item.templateSource !== 1)"
        >
          <a-button
            type="link"
            style="min-width: 40px; padding: 0"
            v-show="item.status !== '1'"
            @click="UpdateStatus(item, `1`)"
          >
            启用
          </a-button>
          <a-button
            type="link"
            style="min-width: 40px; padding: 0"
            v-show="item.status === '1'"
            @click="UpdateStatus(item, `0`)"
          >
            停用
          </a-button>
          <a-button type="link" style="min-width: 40px; padding: 0" v-if="item.status !== '1'" @click="Edit(item)">
            编辑
          </a-button>
          <a-button type="link" style="min-width: 40px; padding: 0" @click="Copy(item)">复制</a-button>
          <a-popconfirm
            v-if="item.status !== '1'"
            title="确定要删除吗？此操作不可逆"
            ok-text="删除"
            cancel-text="取消"
            @confirm="Del(item)"
          >
            <a-button type="link" style="min-width: 40px; padding: 0">删除</a-button>
          </a-popconfirm>
        </template>
      </s-table>
    </a-card>
    <a-modal v-model="visible" :width="794" title="模板预览">
      <div v-html="dom" class="contract-preview-dom"></div>
      <template slot="footer">
        <a-button type="primary" @click="cancel">取消</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import * as api from '@/api/contract'
import { mapState } from 'vuex'
let timeout
export default {
  created() {
    // this.BindCom()
    // this.search()
  },
  computed: {
    ...mapState({
      info: (state) => state.user.info,
      platformId: (state) => state.permission.isPlatform
    })
  },
  props: {
    templateSource: {
      type: Number,
      default: 3
    }
    // platformId: {
    //   type: Number,
    //   default: 7
    // }
  },
  data() {
    return {
      labelCol: { span: 20 },
      wrapperCol: { span: 17 },
      visible: false,
      dom: '',
      status: [
        { label: '全部', value: '' },
        { label: '启用', value: '1' },
        { label: '禁用', value: '0' },
        { label: '草稿', value: '2' }
      ],
      templateType: [
        { label: '全部', value: '' },
        { label: '购销合同', value: '1' },
        { label: '服务合同', value: '2' },
        { label: '工程合同', value: '3' },
        { label: '其他合同', value: '4' }
      ],
      columns: [
        { title: '公司名称', width: 200, dataIndex: 'merchantName', key: 'merchantName' },
        { title: '模板类型', width: 80, key: 'templateType', scopedSlots: { customRender: 'templateType' } },
        { title: '模板名称', width: 200, key: 'name', scopedSlots: { customRender: 'name' } },
        { title: '模板编号', width: 200, dataIndex: 'code', key: 'code' },
        { title: '状态', key: 'status', scopedSlots: { customRender: 'status' } },
        {
          title: '最新维护',
          dataIndex: 'updateTime',
          width: 180,
          key: 'updateTime',
          scopedSlots: { customRender: 'updateTime' }
        },
        { title: '创建人', dataIndex: 'createUsername', key: 'createUsername' },
        { title: '模板来源', key: 'templateSource', scopedSlots: { customRender: 'templateSource' } },
        { title: '备注', dataIndex: 'remark', key: 'remark' },
        { title: '操作', fixed: 'right', width: 200, key: 'operation', scopedSlots: { customRender: 'operation' } }
      ],
      fetching: false,
      comList: [],
      queryParam: {
        status: '',
        merchantIds: [],
        merchantName: '',
        templateType: '',
        code: '',
        name: ''
      },
      count: {
        total: 0,
        0: 0,
        1: 0,
        2: 0
      },
      advanced: false,
      total: ''
    }
  },
  methods: {
    async BindCom() {
      if (this.$store.state.permission.isPlatform !== 1) {
        const res = await api.getComList(this.platformId)
        if (res.code === '0') {
          this.comList = this.platformId === 6 ? res.data.providerMerchantList : res.data.buyerMerchantList
          this.queryParam.merchantIds = this.comList.length > 0 ? [this.comList[0]?.id] : []
        }
      }
    },
    async BindStateCount() {
      const res = await api.getStatusCount({
        ...this.queryParam,
        status: '',
        templateSource: this.templateSource,
        platformId: this.platformId
      })
      if (res.code === '0') {
        this.count = res.data
      }
    },
    handleSearch(value) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      this.fetching = true
      this.comList = []
      timeout = setTimeout(() => {
        api.getPlatComList(this.platformId, this.templateSource, value).then((res) => {
          this.fetching = false
          if (res.code === '0') {
            this.comList = this.templateSource === 2 ? res.data.providerMerchantList : res.data.buyerMerchantList
          }
          console.log(this.comList)
        })
      }, 300)
    },
    Add() {
      const SourceType = this.templateSource === 2 ? `Suppliers` : `Purchase`
      this.$router.push({ name: `CreatContract${SourceType}Addtemplate` })
    },
    Edit(item) {
      const SourceType = this.templateSource === 2 ? `Suppliers` : `Purchase`
      this.$router.push({ name: `Contract${SourceType}Addtemplate`, query: { id: item.id } })
    },
    Copy(item) {
      const SourceType = this.templateSource === 2 ? `Suppliers` : `Purchase`
      this.$router.push({ name: `Contract${SourceType}Addtemplate`, query: { id: item.id, copy: true } })
    },
    Del(item) {
      api.setDeleteTemplate(item.id).then((ret) => {
        if (ret.code === '0') {
          this.$message.success('删除成功')
          this.$refs.table.refresh(false)
        }
      })
    },
    Detail(item) {
      api.getTemplateDetail(item.id).then((ret) => {
        if (ret.code === '0') {
          this.dom = ret.data.contractContentShow
          this.visible = true
        }
      })
    },
    UpdateStatus(item, status) {
      api.setUpdateTemplateStatus(item.id, status).then((ret) => {
        if (ret.code === '0') {
          this.$message.success(`${status === '1' ? '启用' : '停用'}成功`)
          this.$refs.table.refresh(false)
        }
      })
    },
    // 时间
    onchange(time, a) {
      this.queryParam.time = time
    },
    // 点击单号
    oddnumber(text) {
      this.$router.push({
        name: 'supplieRcontrolOverInvoices',
        query: {
          id: text.id
        }
      })
    },
    selIndex(key) {
      console.log(key)
      this.queryParam.status = key
      // this.$refs.table.refresh(true)
      this.search()
    },
    // 获取列表
    async init(pagination) {
      if (this.comList.length === 0) {
        await this.BindCom()
      }
      const { queryParam } = this
      const data = {
        ...pagination,
        ...queryParam
      }
      if (data.time) {
        const [beginTime, endTime] = data.time
        data.beginTime = beginTime
        data.endTime = endTime
      }
      this.BindStateCount()
      return api.getTemplateList({ ...data, templateSource: this.templateSource, platformId: this.platformId })
    },
    handleReset() {
      this.$refs.ruleForm.resetFields()
      this.$refs.table.refresh(true)
    },
    // 查询
    search() {
      this.$refs.table.refresh(true)
    },
    cancel() {
      this.visible = false
    }
  }
}
</script>

<style lang="less" scopeds>
.template-list {
  .ant-card + .ant-card {
    margin-top: 20px;
  }
  .button {
    text-align: center;
  }
  // 数据列表 搜索条件
  .table-page-search-wrapper {
    .ant-form-inline {
      .ant-form-item {
        .ant-form-item-control {
          // height: 100%;
          // line-height: 32px;
        }
      }
    }
  }
}
</style>
