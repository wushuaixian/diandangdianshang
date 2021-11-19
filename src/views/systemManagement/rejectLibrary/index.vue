<template>
  <div class="organizatin">
    <div class="left">
      <a-card class="left-card" title="驳回话术库">
        <a-button type="primary" @click="addRejectMethod">添加</a-button>
        <a-input-search
          style="margin-bottom: 8px; margin-top: 20px"
          placeholder="请输入话术分类"
          v-model="name"
          @search="init"
        />
        <a-spin :spinning="loading">
          <a-list item-layout="horizontal" :data-source="copyList">
            <a-list-item
              :class="isSelect == index ? 'ant-list-item-active' : ''"
              slot="renderItem"
              slot-scope="item, index"
              @click="onSelect(item, index)"
            >
              <span>{{ item.name }}</span>
              <a
                slot="actions"
                :class="isSelect == index ? 'ant-list-itembutton-active' : ''"
                @click.stop="editItem(item, index)"
              >
                <a-icon type="edit" />
              </a>
              <a
                slot="actions"
                :class="isSelect == index ? 'ant-list-itembutton-active' : ''"
                @click.stop="deleteItem(item, index)"
              >
                <a-icon type="delete" />
              </a>
            </a-list-item>
          </a-list>
        </a-spin>
      </a-card>
    </div>
    <div class="right">
      <a-card title="话术列表" class="ant-card-head-info"></a-card>
      <a-card class="add-user-card">
        <a-button type="primary" class="addbtn" @click="listAdd">添加</a-button>
        <a-table class="addbtn" :columns="columns" :data-source="list.listObj" row-key="id" :pagination="false">
          <!--          <template slot="isAvailable" slot-scope="text, record, index, data">-->
          <!--            <div class="enterpriseName">-->
          <!--              <a-switch v-model="record.isAvailables" @change="switchMailStatus(text, record, index, data)" />-->
          <!--            </div>-->
          <!--          </template>-->
          <div slot="tags" class="button" slot-scope="text, tags, i">
            <a-button type="link" @click="edit(text, tags, i)">编辑</a-button>
            <a-button type="link" @click="deleteInfo(text, tags, i)">删除</a-button>
          </div>
        </a-table>
        <div class="pagination">
          <a-pagination
            :show-total="(total) => `共 ${list.total ? list.total : 0} 条`"
            show-quick-jumper
            show-size-changer
            :default-current="1"
            :total="list.total"
            @change="onChange"
            @showSizeChange="showSizeChange"
          />
        </div>
      </a-card>
    </div>
    <a-modal title="新增话术" :visible="addList" @ok="handleOk" @cancel="addList = false">
      <a-form :form="addlistForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="内容">
          <a-textarea :autosize="true" placeholder="请输入话术内容" v-model="addlistForm.content" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal title="编辑话术" :visible="updateList" @ok="updateOk" @cancel="updateList = false">
      <a-form :form="updatelistForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="内容">
          <a-textarea :autosize="true" placeholder="请输入话术内容" v-model="updatelistForm.content" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal title="删除" :visible="deleteList" @ok="deleteOk" @cancel="deleteList = false">
      <p>确定要删除此话术吗？</p>
    </a-modal>
    <a-modal title="编辑话术分类" :visible="editReject" @ok="editRejectOk" @cancel="editReject = false">
      <a-form :form="updatelistForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="名称">
          <a-input placeholder="请输入分类名称" v-model="updatelistForm.name" />
        </a-form-item>
        <a-form-item label="备注">
          <a-input placeholder="请输入分类备注" v-model="updatelistForm.description" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal title="新增话术分类" :visible="addReject" @ok="addRejectOk" @cancel="addReject = false">
      <a-form :form="addRejectForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="名称">
          <a-input placeholder="请输入分类名称" v-model="addRejectForm.name" />
        </a-form-item>
        <a-form-item label="备注">
          <a-input placeholder="请输入分类备注" v-model="addRejectForm.description" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal title="删除" :visible="deleteReject" @ok="deleteRejectOk" @cancel="deleteReject = false">
      <p>确定要删除此话术分类吗？</p>
    </a-modal>
    <a-modal title="删除" :visible="deleteReject1" @ok="deleteReject1 = false" @cancel="deleteReject1 = false">
      <p>该分类下包含又话术列表，不允许删除。</p>
    </a-modal>
  </div>
</template>

<script>
import {
  getLibrayList,
  rejectLibrayList,
  addLibrayList,
  updateLibrayList,
  deleteLibrayList,
  addLibray,
  editLibray,
  deleteLibray
} from '@/api/rejectLibray'
const columns = [
  {
    title: '内容',
    dataIndex: 'content',
    key: 'content',
    // width: 200,
    ellipsis: true
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    scopedSlots: { customRender: 'tags' },
    align: 'center',
    width: 210
  }
]
export default {
  data() {
    return {
      typeId: '',
      loading: false,
      copyList: [],
      name: '',
      isSelect: 0,
      columns,
      addList: false,
      updateList: false,
      deleteList: false,
      editReject: false,
      deleteReject: false,
      deleteReject1: false,
      addlistForm: {
        content: ''
      },
      updatelistForm: {
        content: ''
      },
      editRejectForm: {
        name: '',
        description: ''
      },
      addRejectForm: {
        name: '',
        description: ''
      },
      list: [],
      addReject: false,
      deletelistForm: {},
      currentPage: 1,
      itemsPerPage: 10
    }
  },
  async mounted() {
    await this.init()
    await this.getLibrayList(this.typeId)
  },
  methods: {
    async init() {
      this.loading = true
      const res = await rejectLibrayList({
        name: this.name
      }).finally(() => (this.loading = false))
      if (res.code === '0') {
        // console.log(res)
        this.copyList = res.data
        this.typeId = res.data[0].id
      }
    },
    // 获取话术列表
    async getLibrayList(typeId) {
      const queryParam = {
        typeId: typeId,
        currentPage: this.currentPage,
        itemsPerPage: this.itemsPerPage
      }
      const { data } = await getLibrayList({ ...queryParam })
      this.list = data
    },
    // 页码改变
    async onChange(e, num) {
      this.currentPage = e
      this.itemsPerPage = num
      this.getLibrayList(this.typeId)
    },
    // 每页条数变化
    showSizeChange(e, num) {
      this.currentPage = e
      this.itemsPerPage = num
      this.getLibrayList(this.typeId)
    },
    // 新增话术列表
    listAdd() {
      this.addlistForm = {
        content: ''
      }
      this.addList = true
    },
    // 确定新增话术列表
    async handleOk() {
      const params = {
        typeId: this.typeId,
        content: this.addlistForm.content
      }
      const { data } = await addLibrayList(params)
      console.log(data)
      this.addList = false
      this.getLibrayList(this.typeId)
    },
    // 取消新增话术
    handleCancel() {
      this.addList = false
    },
    // 编辑话术
    edit(text, tags, i) {
      this.updateList = true
      this.updatelistForm = { ...text }
      this.text = { ...text }
    },
    // 删除话术
    deleteInfo(text, tags, i) {
      this.deleteList = true
      this.text = { ...text }
    },
    async updateOk() {
      const params = {
        typeId: this.typeId,
        content: this.updatelistForm.content,
        id: this.text.id,
        isDeleted: this.text.isDeleted,
        isAvailable: this.text.isAvailable
      }
      const { data } = await updateLibrayList(params)
      console.log(data)
      this.updateList = false
      this.getLibrayList(this.typeId)
    },
    async deleteOk() {
      const params = {
        id: this.text.id
      }
      const { data } = await deleteLibrayList(params)
      console.log(data)
      this.deleteList = false
      this.getLibrayList(this.typeId)
    },
    async switchMailStatus(text, record, index) {
      console.log(text)
      const params = {
        typeId: this.typeId,
        content: text.content,
        id: text.id,
        isDeleted: text.isDeleted,
        isAvailable: text.isAvailables ? '0' : '1'
      }
      const { data } = await updateLibrayList(params)
      console.log(data)
      this.$message.success('操作成功')
    },
    addRejectMethod() {
      this.addRejectForm = {
        name: '',
        description: ''
      }
      this.addReject = true
    },
    async addRejectOk() {
      const params = {
        name: this.addRejectForm.name,
        description: this.addRejectForm.description
      }
      const { data } = await addLibray(params)
      console.log(data)
      this.addReject = false
      this.init()
    },
    onSelect(item, index) {
      this.isSelect = index
      this.typeId = item.id
      this.getLibrayList(this.typeId)
    },
    editItem(item, index) {
      this.editReject = true
      this.updatelistForm = { ...item }
    },
    async editRejectOk() {
      const { name, description, id } = this.updatelistForm
      const params = {
        id: id,
        name: name,
        description: description
      }
      const { data } = await editLibray(params)
      console.log(data)
      this.editReject = false
      this.init()
    },
    async deleteItem(item, index) {
      this.deletelistForm = { ...item }
      const queryParam = {
        typeId: this.deletelistForm.id,
        currentPage: 1,
        itemsPerPage: 10
      }
      const list = await getLibrayList({ ...queryParam })
      if (list.data.listObj) {
        this.deleteReject1 = true
      } else {
        this.deleteReject = true
      }
    },
    async deleteRejectOk() {
      const { id } = this.deletelistForm
      const params = {
        id: id
      }
      const { data } = await deleteLibray(params)
      console.log(data)
      this.deleteReject = false
      this.init()
    }
  }
}
</script>

<style lang="less" scoped>
.organizatin {
  display: flex;
  max-width: 100%;
  .base-info {
    flex: 1;
  }
  .left {
    // flex: 1;
    width: 25%;
  }
  .right {
    flex: 3.8;
    width: 75%;
    min-height: 900px;
    background: #fff;
    .ant-card {
      border-left: none;
    }
    .box {
      // border-bottom: 1px solid #e5e5e5;
      padding-bottom: 10px;
    }
    .title {
      display: flex;
      justify-content: space-between;
    }
  }
}
.left-card {
  min-height: 900px;
  max-width: 350px;
  // min-width: 350px;
  overflow-x: scroll;
}
/deep/ .ant-list-item {
  cursor: pointer;
  padding-left: 20px;
}
///deep/ .ant-list-item:hover {
//  background-color: rgba(255,107,0,0.1);
//  color: #ffffff;
//}
.ant-list-item-active {
  background-color: #ff6b00;
  color: #ffffff;
}
.ant-list-itembutton-active {
  color: #ffffff;
}
/deep/ .ant-card-body {
  padding-bottom: 0px !important;
  padding-top: 0px;
  /deep/ .box {
    border-bottom: 0px !important;
  }
}
/deep/ .ant-card-head {
  width: 94%;
  margin: 0 auto;
  position: relative;
  margin-bottom: 24px;
  padding-left: 8px;
}
/deep/ .ant-card-head::after {
  width: 4px;
  height: 16px;
  line-height: 16px;
  background: red;
  display: inline-block;
  position: absolute;
  left: 0px;
  top: 50%;
  transform: translate(0%, -35%);
  background-image: linear-gradient(-180deg, #ff8323 0%, #ff663e 100%);
  border-radius: 2px;
}
/deep/ .ant-card-head-title {
  padding-top: 16px;
  padding-bottom: 8px;
  font-size: 14px;
}
.ant-card-head-info {
  border: none !important;
  /deep/ .ant-card-head {
    border: none !important;
    margin-bottom: 0px !important;
    border-bottom: 1px solid #eee !important;
  }
  /deep/ .ant-card-body {
    padding-top: 0px !important;
    /deep/ .btn {
      margin-top: 0px !important;
    }
  }
}
.add-user-card {
  max-width: 100%;
  border-bottom: none !important;
  border-top: none !important;
  /deep/ .ant-card-body {
    padding-top: 0px !important;
    border-top: none !important;
  }
}
/deep/ .add-user {
  margin-bottom: 20px;
}
.name {
  font-family: PingFangSC-Medium;
  font-size: 20px;
  color: #262626;
  letter-spacing: 0;
}
.departmentType {
  font-size: 14px;
  color: #ff6b00;
  letter-spacing: 0;
  background: rgba(255, 107, 0, 0.1);
  border-radius: 4px;
  padding: 5px 5px;
  vertical-align: middle;
}
.ant-btn-departmentType {
  border: 1px solid #ff6b00;
  border-radius: 2px;
  font-size: 14px;
  color: #ff6b00;
}
/deep/ .ant-table-placeholder {
  min-height: 500px;
}
/deep/ .ant-empty-normal {
  margin: 200px auto;
}
/deep/ .ant-table-placeholder {
  border-bottom: none !important;
}
/deep/ .ant-modal-footer {
  padding: 12px 20px;
}
.cur {
  cursor: pointer;
}
.addbtn {
  margin-top: 20px;
}
.pagination {
  text-align: right;
  margin-top: 20px;
}
</style>
