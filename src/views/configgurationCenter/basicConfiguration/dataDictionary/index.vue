<template>
  <div>
    <a-card :bordered="false">
      <div>
        <a-form-model layout="inline" ref="form" :model="queryParam">
          <a-row :gutter="48">
            <a-col :md="8">
              <a-form-model-item label="联营模块" style="margin-left: 14px" prop="pool">
                <a-select allowClear v-model="queryParam.pool" class="inp">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option v-for="item in categoryList" :key="item" :value="item">
                    {{ item }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="数据字典名称" prop="name">
                <a-input v-model="queryParam.name" placeholder="请输入字典名称" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="数据字典编码" prop="category">
                <a-input v-model="queryParam.category" placeholder="请输入字典名称" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="是否可编辑" prop="canEdit">
                <a-select allowClear v-model="queryParam.canEdit" class="inp">
                  <a-select-option value="">全部</a-select-option>
                  <a-select-option :value="true"> 可编辑 </a-select-option>
                  <a-select-option :value="false"> 不可编辑 </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="24">
              <div class="button">
                <a-button style="margin-left: 8px" @click="Reset">重置</a-button>
                <a-button type="primary" style="margin-left: 20px" @click="search">查询</a-button>
              </div>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <a-card>
      <s-table name="dataDictionary" ref="table" rowKey="index" :data="init" :columns="columns">
        <template v-slot:updateTime="updateTime">
          {{ updateTime | moment('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template slot="canEdit" slot-scope="item">
          {{ item.canEdit ? '可编辑' : '不可编辑' }}
        </template>
        <template slot="action" slot-scope="item">
          <a-button type="link" v-if="item.canEdit" @click="ShowDetail(item, true)">编辑</a-button>
          <a-button type="link" v-else @click="ShowDetail(item, false)">查看</a-button>
        </template>
      </s-table>
    </a-card>
    <a-modal
      :destroyOnClose="true"
      title="字典详情"
      width="820px"
      :visible="seePopupVisible"
      @cancel="() => (seePopupVisible = false)"
      :footer="null"
    >
      <SeePopup :edit="edit" />
    </a-modal>
  </div>
</template>
<script>
import SeePopup from './components/seePopup'
import * as api from '@/api/basicConfiguration'
export default {
  created() {
    this.BindCategory()
  },
  components: {
    SeePopup
  },
  data() {
    return {
      categoryList: [],
      seePopupVisible: false,
      queryParam: {
        category: '',
        name: '',
        pool: '',
        canEdit: ''
      },
      columns: [
        { title: '联营模块', key: 'pool', dataIndex: 'pool' },
        { title: '数据字典名称', key: 'name', dataIndex: 'name' },
        { title: '数据字典编码', key: 'category', dataIndex: 'category' },
        { title: '操作人', key: 'createUsername', dataIndex: 'createUsername' },
        { title: '最后更新时间', key: 'updateTime', scopedSlots: { customRender: 'updateTime' } },
        { title: '是否可编辑', key: 'canEdit', scopedSlots: { customRender: 'canEdit' } },
        { key: 'action', align: 'left', scopedSlots: { customRender: 'action' } }
      ],
      edit: {
        isEdit: false,
        pool: '',
        category: '',
        language: ''
      }
    }
  },
  methods: {
    Reset() {
      this.$refs.form.resetFields()
    },
    search() {
      this.$refs.table.refresh(true)
    },
    ShowDetail(item, isEdit) {
      this.edit.isEdit = isEdit
      this.edit.category = item.category
      this.edit.pool = item.pool
      this.edit.language = item.language
      this.seePopupVisible = true
    },
    async BindCategory() {
      const { code, data } = await api.getCategory()
      if (code === '0') {
        this.categoryList = data
      }
    },
    async init(params) {
      const { queryParam } = this
      const data = {
        ...params,
        ...queryParam
      }
      return api.getCodePage({ ...data })
    }
  }
}
</script>
<style lang="less" scoped>
.button {
  text-align: center;
}
.cursor {
  cursor: pointer;
}
.inp {
  width: 178px;
}
</style>
