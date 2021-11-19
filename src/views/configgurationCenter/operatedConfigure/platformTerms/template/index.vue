<template>
  <div class="template-list">
    <a-card :bordered="false">
      <a-form-model layout="inline" ref="agreementFrom" :model="queryParam">
        <a-form-model-item label="模板类型" prop="type">
          <a-select
            :getPopupContainer="(triggerNode) => triggerNode.parentNode"
            allowClear
            v-model="queryParam.type"
            :options="type"
            placeholder="请选择模板类型"
            default-value=""
            style="width: 250px"
          >
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="状态" prop="isAvailable">
          <a-select
            :getPopupContainer="(triggerNode) => triggerNode.parentNode"
            allowClear
            v-model="queryParam.isAvailable"
            :options="status"
            placeholder="请选择状态"
            default-value=""
            style="width: 250px"
          >
          </a-select>
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" @click="search">查询</a-button>
        </a-form-model-item>
        <a-form-model-item>
          <a-button @click="handleReset">重置</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>

    <a-card>
      <a-button type="primary" @click="Add">新增模板</a-button>
      <s-table
        name="template"
        style="margin-top: 10px"
        rowKey="id"
        ref="table"
        :columns="columns"
        :data="init"
        :scroll="{ x: 2000 }"
      >
        <template slot="createTime" slot-scope="text, item">
          {{ item.createTime | moment('yyyy-MM-DD HH:mm:ss') }}
        </template>
        <template slot="updateTime" slot-scope="text, item">
          {{ item.updateTime | moment('yyyy-MM-DD HH:mm:ss') }}
        </template>
        <template slot="type" slot-scope="text, item">
          <span>{{ dictionary.TEMPLATE_OF_TYPE[item.type] }}</span>
        </template>
        <template slot="isAvailable" slot-scope="text, item">
          <a-popconfirm
            :getPopupContainer="(triggerNode) => triggerNode.parentNode"
            :ok-text="item.isAvailable === 1 ? '停用' : '启用'"
            cancel-text="取消"
            @confirm="UpdateStatus(item)"
          >
            <template slot="title">
              <div style="max-width: 200px">
                {{
                  item.isAvailable === 1
                    ? '确定停用该模板吗？'
                    : '若启用本模板，原已启用状态的相同模板类型则停用，确定启用该模板吗？'
                }}
              </div>
            </template>
            <a-switch :checked="item.isAvailable === 1" :loading="item.isStateLoading" />
          </a-popconfirm>
        </template>

        <template slot="operation" slot-scope="text, item">
          <a-button type="link" style="min-width: 40px; padding: 0" @click="Edit(item)">编辑</a-button>
          <a-button type="link" style="min-width: 40px; padding: 0" @click="download(item)">下载</a-button>
          <a-popconfirm
            v-if="item.isAvailable !== 1"
            :getPopupContainer="
              (triggerNode) =>
                triggerNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                  .parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                  .parentNode
            "
            ok-text="删除"
            cancel-text="取消"
            @confirm="Del(item)"
          >
            <template slot="title">
              <div style="max-width: 180px">确定要删除吗？</div>
            </template>
            <a-button type="link" style="min-width: 40px; padding: 0">删除</a-button>
          </a-popconfirm>
        </template>
      </s-table>
    </a-card>
    <a-modal
      :destroyOnClose="true"
      title="模板信息"
      width="600px"
      :visible="addVisible"
      @cancel="() => (addVisible = false)"
      :footer="null"
    >
      <add-template :id="id" @ok="saveOK" @close="() => (addVisible = false)" />
    </a-modal>
  </div>
</template>

<script>
import addTemplate from './add.vue'
import * as api from '@/api/configgurationCenter/operatedConfigure/platformTerms/template.js'
import { getDictionary } from '@/api/utils.js'
export default {
  components: { addTemplate },
  created() {
    this.bindDictionary()
  },
  data() {
    return {
      sw: false,
      id: null,
      addVisible: false,
      dictionary: {
        TEMPLATE_OF_TYPE: {}
      },
      status: [
        { label: '全部', value: '' },
        { label: '启用', value: '1' },
        { label: '停用', value: '0' }
      ],
      type: [],
      columns: [
        { title: '模板编码', dataIndex: 'code', key: 'code' },
        { title: '模板标题', dataIndex: 'title', key: 'title' },
        { title: '模板类型', dataIndex: 'type', key: 'type', scopedSlots: { customRender: 'type' } },
        { title: '创建时间', dataIndex: 'createTime', key: 'createTime', scopedSlots: { customRender: 'createTime' } },
        { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', scopedSlots: { customRender: 'updateTime' } },
        {
          title: '启用状态',
          dataIndex: 'isAvailable',
          key: 'isAvailable',
          scopedSlots: { customRender: 'isAvailable' }
        },
        { title: '操作', fixed: 'right', width: 200, scopedSlots: { customRender: 'operation' } }
      ],
      queryParam: {
        isAvailable: '',
        type: ''
      }
    }
  },
  methods: {
    // 获取列表
    async init(pagination) {
      const { queryParam } = this
      const data = {
        ...pagination,
        ...queryParam
      }
      const res = await api.getTemplatePage({ ...data })
      const promise = new Promise((resolve) => {
        resolve({
          code: res.code,
          message: res.message,
          data: {
            listObj: res.data.listObj?.length > 0 ? res.data.listObj.map((x) => ({ ...x, isStateLoading: false })) : [],
            total: res.data.total
          }
        })
      })
      return promise
    },
    async bindDictionary() {
      const res = await getDictionary(['TEMPLATE_OF_TYPE'])
      if (res.code === '0') {
        this.type = [
          { label: '全部', value: '' },
          ...res.data.TEMPLATE_OF_TYPE.map((x) => ({ label: x.name, value: x.code }))
        ]
        res.data.TEMPLATE_OF_TYPE.map((x) => {
          this.dictionary.TEMPLATE_OF_TYPE[x.code] = x.name
        })
      }
    },
    saveOK() {
      this.addVisible = false
      this.$refs.table.refresh(false)
    },
    Add() {
      this.id = null
      this.addVisible = true
    },
    Edit(item) {
      this.id = item.id
      this.addVisible = true
    },
    Del(item) {
      api.delTemplate(item.id).then((ret) => {
        if (ret.code === '0') {
          this.$message.success('删除成功')
          this.$refs.table.refresh(false)
        }
      })
    },
    UpdateStatus(item) {
      item.isStateLoading = true
      api.setTemplateState(item.isAvailable === 1 ? 0 : 1, item.id, item.type).then((ret) => {
        item.isStateLoading = false
        if (ret.code === '0') {
          this.$message.success(`${item.isAvailable !== 1 ? '启用' : '停用'}成功`)
          this.$refs.table.refresh(false)
        }
      })
    },
    handleReset() {
      this.$refs.agreementFrom.resetFields()
      this.$refs.table.refresh(true)
    },
    // 查询
    search() {
      this.$refs.table.refresh(true)
    },
    async download(e) {
      const response = await fetch(e.url)
      const blob = await response.blob()
      const objectUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      const ext = e.url.substr(e.url.lastIndexOf('.') + 1)
      a.download = `${this.dictionary.TEMPLATE_OF_TYPE[e.type]}.${ext}`
      a.click()
      a.remove()
    }
  }
}
</script>
