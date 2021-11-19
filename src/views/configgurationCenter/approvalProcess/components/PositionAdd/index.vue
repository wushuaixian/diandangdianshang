<template>
  <div class="cp-audit-add">
    <a-button :disabled="disabled" type="primary" @click="visible = true">{{ label }}</a-button>
    <template v-if="showCheckedCount">
      <span class="add-num">
        已添加<span class="selected">{{ innerSelected.length }} </span>
        个
      </span>
      <a class="clear" @click="handleClear">清空</a>
      <div class="add-item">
        <a-tag
          v-for="(item, selectedIndex) in innerSelected"
          :key="selectedIndex"
          closable
          @close="(e) => handleClose(item, e)"
        >
          {{ item.actorName }}
        </a-tag>
      </div>
    </template>
    <a-modal
      :visible.sync="visible"
      :getContainer="getContainer"
      title="指定部门"
      width="960px"
      @cancel="handleModalClose"
      @ok="handleOpen"
    >
      <a-spin :spinning="loading">
        <roles-choose
          v-if="visible"
          ref="chooseRoles"
          :props="props"
          v-model="innerSelected"
          :load="load"
          :list="list"
          :brand-index="brandIndex"
          style="margin-left: 60px"
          value-key="actorId"
          label-key="actorName"
          showCategoryVal="employee"
          showCheckboxVal="true"
          showCategoryKey="showCheckbox"
          source-label="选择："
          target-label="已选："
          class="tree-transfer"
          @categoryed="categoryed"
          @brandClick="brandClick"
          @loadSearch="loadSearch"
          @loadSearchCategoryed="loadSearchCategoryed"
        >
          <template slot="left-footer">
            <a-button v-if="showLoadMore" type="link" @click="handleLoadMore">加载更多</a-button>
          </template>
        </roles-choose>
      </a-spin>
      <span slot="footer">
        <a-button @click="handleModalClose">取消</a-button>
        <a-button type="primary" @click="handleSubmit">确定</a-button>
      </span>
    </a-modal>
  </div>
</template>

<script>
import { searchChildrenCodeAndEmployee, listChildrenCodeAndEmployee } from '@/api/configgurationCenter/department'
import { queryPositionLists } from '@/api/position'
import _ from 'loadsh'
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    selected: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showCheckedCount: {
      type: Boolean,
      default: true
    },
    label: {
      type: String,
      default: '添加岗位'
    }
    // merchantId: {
    //   type: [String, Number],
    //   default: ''
    // }
  },
  inject: ['info'],
  data() {
    return {
      loading: true,
      visible: false,
      showLoadMore: false,
      innerSelected: [],
      sourceFilterText: '',
      sourceFilterTaskList: [],
      sourceFilterIsRunning: false,
      props: {
        label: 'actorName',
        children: 'children',
        isLeaf: 'leaf'
      },
      list: [],
      brandIndex: 0,
      initflag: true,
      currentPage: 1,
      itemsPerPage: 15
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.handleOpen()
      }
    }
  },
  computed: {},
  mounted() {
    this.list[this.brandIndex] = Object.assign(
      {},
      {
        req: {
          currentPage: this.currentPage,
          itemsPerPage: this.itemsPerPage
        },
        res: [],
        name: '',
        code: '',
        infiniteScrollDisabled: false
      }
    )
    this.innerSelected = this.value
  },
  methods: {
    getContainer() {
      return document.body
    },
    sleep(timer = 300) {
      return new Promise((resolve) => {
        setTimeout(resolve, timer)
      })
    },
    async load() {
      const { merchantId: entityId } = this.info
      this.list[this.brandIndex].infiniteScrollDisabled = true
      if (this.brandIndex === 0) {
        //  查询审批人列表
        const {
          data: { listObj }
        } = await queryPositionLists({
          entityId,
          currentPage: this.list[this.brandIndex].req.currentPage,
          itemsPerPage: this.list[this.brandIndex].req.itemsPerPage
        })
        const list = listObj.map((x) => {
          return {
            ...x,
            id: x.id,
            actorId: x.id,
            actorName: x.positionName,
            showCheckbox: 'true'
            // type: 'node'
          }
        })
        const res = {}
        res.name = list[0]?.enterPriseName
        res.id = list[0].id
        res.res = list
        res.req = this.list[this.brandIndex].req
        res.infiniteScrollDisabled = true
        this.$set(this.list, this.brandIndex, res)
      }
      // else {
      // const { data } = await listChildrenCodeAndEmployee({
      //   parentCode: this.list[this.brandIndex].id,
      //   currentPage: this.list[this.brandIndex].req.currentPage,
      //   itemsPerPage: this.list[this.brandIndex].req.itemsPerPage
      // })
      // const list = data.map((x) => {
      //   return {
      //     ...x,
      //     actorId: x.id,
      //     actorName: x.label
      //   }
      // })
      // this.list[this.brandIndex].res = [...this.list[this.brandIndex].res, ...list]
      // this.list[this.brandIndex].req.currentPage++
      // this.list[this.brandIndex].infiniteScrollDisabled = false
      // if (list.length < this.list[this.brandIndex].req.itemsPerPage) {
      //   this.list[this.brandIndex].infiniteScrollDisabled = true
      // }
      // this.$set(this.list, this.brandIndex, this.list[this.brandIndex])
      // }
    },
    categoryed(param) {
      this.brandIndex++
      this.list[this.brandIndex] = Object.assign(
        {},
        {
          req: {
            currentPage: this.currentPage,
            itemsPerPage: this.itemsPerPage
          },
          res: [],
          name: param.actorName,
          id: param.id,
          infiniteScrollDisabled: false
        }
      )
      this.load()
    },
    brandClick(param) {
      this.brandIndex = param
      this.list = this.list.splice(0, this.brandIndex + 1)
      const obj = this.list[this.brandIndex]
      obj.req = {
        currentPage: this.currentPage,
        itemsPerPage: this.itemsPerPage
      }
      obj.infiniteScrollDisabled = false
      obj.res = []
      this.$set(this.list, this.brandIndex, obj)
      this.load()
    },
    async loadSearch(sourceFilterText, resolve) {
      // 搜索审批人列表
      const { data } = await searchChildrenCodeAndEmployee({
        name: sourceFilterText.sourceFilterText
      })

      return resolve(
        data.map((x) => {
          return {
            ...x,
            actorId: x.id,
            actorName: x.label
          }
        })
      )
    },
    async loadSearchCategoryed(param, resolve) {
      const { data } = await listChildrenCodeAndEmployee({
        parentCode: param.code
      })
      return resolve(
        data.map((x) => {
          return {
            ...x,
            actorId: x.id,
            actorName: x.label
          }
        })
      )
    },
    async confrim() {
      this.$confirm({
        title: '提示',
        content: '确认删除吗',
        onOk: async () => {},
        onCancel() {}
      })
    },
    updateAndEmit() {
      this.$emit('input', this.innerSelected)
      this.$emit('ok', this.innerSelected)
    },
    async handleClear() {
      this.$confirm({
        title: '提示',
        content: '确认删除吗',
        onOk: async () => {
          this.innerSelected = []
          this.updateAndEmit()
        },
        onCancel() {}
      })
    },
    async handleClose(selected, e) {
      e.preventDefault()
      this.$confirm({
        title: '提示',
        content: '确认删除吗',
        onOk: async () => {
          const { id } = selected
          const innerSelectedIndex = this.innerSelected.findIndex((x) => x.id === id)
          this.innerSelected.splice(innerSelectedIndex, 1)
          this.updateAndEmit()
        },
        onCancel() {
          e.preventDefault()
        }
      })
    },
    async handleOpen() {
      this.loading = false
      this.handleChecked()
      this.$emit('open')
    },
    async sourceFilterRun() {
      if (this.sourceFilterTaskList.length > 0) {
        const sourceFilterText = this.sourceFilterTaskList[0]
        this.sourceFilterIsRunning = true
        this.sourceFilterText = sourceFilterText
        this.sourceFilterTaskList.shift()
        this.sourceFilterRun()
      } else {
        this.sourceFilterIsRunning = false
        this.sourceFilterTaskList = []
      }
    },
    handleChecked() {
      this.innerSelected = _.cloneDeep(this.value)
    },
    handleModalClose() {
      this.visible = false
      const oldValue = _.cloneDeep(this.value)
      this.$emit('input', oldValue)
      this.innerSelected = oldValue
      this.$emit('cancel')
    },
    handleSubmit() {
      this.visible = false
      this.updateAndEmit()
    }
  }
}
</script>

<style lang="less" scoped>
.cp-audit-add {
  display: inline-block;
  .ant-btn {
    margin-top: 16px;
    margin-bottom: 8px;
  }
  .clear {
    padding: 0 8px;
  }
  .add-num {
    font-size: 14px;
    color: #666666;
    .selected {
      color: #1890ff;
      margin: 0px 5px;
    }
  }
  /deep/ .el-tree-node__content label.el-checkbox {
    display: none;
  }
  .add-item {
    /deep/ .ant-tag {
      color: #1890ff;
      background: rgba(24, 144, 255, 0.1);
      margin-right: 8px;
      margin-top: 8px;
      /deep/ .anticon-close {
        color: #b8dafb;
      }
    }
  }
}
</style>
