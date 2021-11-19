
<template>
  <div>
    <a-button type="primary" @click="showSelectModel" style="margin-bottom: 15px">选择关联权益</a-button>

    <a-modal
      v-model="visibleShowSelect"
      :width="1200"
      title="选择关联权益"
      ok-text="确定"
      cancel-text="取消"
      @ok="hideSelectModel"
    >
      <div class="appeal-manage-list">
        <a-card :bordered="false">
          <div class="table-page-search-wrapper">
            <a-form-model layout="inline" ref="ruleForm" :model="queryParam">
              <a-row :gutter="48">
                <a-col :md="8" :sm="24">
                  <a-form-model-item label="套餐权益类型" prop="equityType">
                    <!-- <a-select v-if="queryParam.equityType" placeholder="请选择" v-model="queryParam.equityType">
                      <a-select-option v-for="item in projectType" :key="item.id" :value="item.name">
                        {{ item.name }}
                      </a-select-option>
                    </a-select> -->
                    <a-select
                      v-model="reset"
                      placeholder="请选择"
                      @change="
                        (e) => {
                          queryParam.equityType = e
                        }
                      "
                    >
                      <a-select-option v-for="item in projectType" :key="item.id" :value="item.name">
                        {{ item.name }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :md="8" :sm="24">
                  <a-form-model-item label="权益名称" prop="equityName">
                    <a-input v-model="queryParam.equityName" placeholder="请输入" />
                  </a-form-model-item>
                </a-col>

                <a-col :md="24" :sm="24" class="button">
                  <a-button @click="handleReset">重置</a-button>
                  <a-button type="primary" @click="search">查询</a-button>
                </a-col>
              </a-row>
            </a-form-model>
          </div>
        </a-card>
        <a-card>
          <s-table
            :scroll="{ y: 400 }"
            ref="table"
            :columns="columns"
            name="my-selectModel"
            :data="dataList"
            rowKey="id"
            :isCanFilter="false"
            :row-selection="rowSelection"
          >
            <template slot="packageStatus" slot-scope="text, row">
              <a-switch v-model="row.packageStatus" default-checked @change="changeSwitch(row.id)" />
            </template>
            <template slot="createTime" slot-scope="text, row">
              {{ row.createTime | dayjs }}
            </template>

            <template slot="options" slot-scope="text, row">
              <a @click="gotoUpdate(row.id)" style="margin-right: 15px">编辑</a>
              <a @click="Delete(row.id)">删除</a>
            </template>
          </s-table>
        </a-card>
      </div>
    </a-modal>
  </div>
</template>

<script>
import {
  postListMulti,
  // postPackInfos,
  postPackInfosUpdateStatus,
  postselectRelatedInterests
} from '@/api/memberPackage'
import { formatDate } from '@/utils/util'

export default {
  props: {
    equityItemIds: {
      type: Array,
      default: () => []
    },
    // 编辑页进来的已选项id
    selectedRowKeys: {
      type: Array,
      default: () => []
    },
    // 编辑页进来的已选项数据
    selectedRow: {
      type: Array,
      default: () => []
    }
    // visibleShowSelect: {
    //   type: Boolean,
    //   default: true
    // }
  },

  computed: {
    // 表格多选选中状态获取选中id
    rowSelection() {
      const that = this
      return {
        selectedRowKeys: that.selectedListIds,
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(selectedRows)

          that.selectedListIds = [...selectedRowKeys]
          that.selectedListData = that.deWeight([...that.selectedListData, ...that.selectedRow, ...selectedRows])
          that.selectedListData.map((x) => ({ ...x, type: true }))
        },
        onSelect: (e) => {
          console.log(e.type)
          if (e.type) {
            for (let i = 0; i < that.selectedListData.length; i++) {
              if (that.selectedListData[i].id === e.id) {
                that.selectedListData.splice(i, 1)
                console.log(that.selectedListData)
              }
            }
            e.type = false
          } else {
            e.type = true
          }
        },
        onSelectAll: (status, selectedRows, changeRows) => {
          // console.log(that.selectedListData)

          if (!status) {
            const ids = []
            changeRows.forEach((x) => {
              return ids.push(x.id)
            })
            that.selectedListData.map((x) => ({ ...x, type: true }))
            const includesSelectedRowList = this.selectedListData.filter((item) => !ids.includes(item?.id))
            console.log(includesSelectedRowList)
            that.selectedListData = includesSelectedRowList
          }
        },
        getCheckboxProps: (record) => ({
          props: {
            disabled: this.selectedRowKeys.includes(record.id)
          }
        })
      }
    }
  },
  data() {
    return {
      // 当前页已选数据
      selectedListIds: this.selectedRowKeys,
      selectedListData: [],
      selectedRows: [],
      reset: [],
      visibleShowSelect: false,
      // 套餐权益类型列表
      projectType: [],
      list: [],
      columns: [
        {
          title: '套餐权益类型',
          key: 'equityType',
          dataIndex: 'equityType'
        },
        {
          title: '权益名称',
          dataIndex: 'equityName',
          key: 'equityName'
        },
        {
          title: '权益值',
          dataIndex: 'equityValue',
          key: 'equityValue'
        }
        // {
        //   title: '设置',
        //   dataIndex: 'option',
        //   key: 'option',
        //   width: 60
        // }
      ],
      queryParam: {
        equityName: null,
        equityType: null
      }
    }
  },
  created() {
    this.postListMulti()
  },
  updated() {},
  methods: {
    // 选择关联权益Model
    showSelectModel() {
      this.visibleShowSelect = true
    },
    // 确认model的关闭
    hideSelectModel() {
      // console.log(this.list)
      // console.log(this.selectedRow)
      this.$emit('getList', this.selectedListData.length > 0 ? this.selectedListData : this.selectedRow)
      this.visibleShowSelect = false
    },

    // 套餐权益类型
    postListMulti() {
      const params = {
        categories: ['PACKAGE_BENEFITS_TYPE']
      }
      postListMulti(params).then((res) => {
        if (res.code === '0') {
          this.projectType = res.data.PACKAGE_BENEFITS_TYPE
        }
      })
    },

    // 监听表单时间
    changeTime(e) {
      this.beginTime = formatDate(e[0]._d)
      this.endTime = formatDate(e[1]._d)
    },

    // 跳转编辑页
    gotoUpdate(e) {
      this.$router.push({ name: 'leaguerPackageManageAddUpdate', query: { id: '', isUpdate: 'true' } })
    },

    // 获取列表
    async dataList(pagination) {
      const { queryParam } = this
      const data = {
        ...pagination,
        ...queryParam,
        equityItemIds: this.equityItemIds
      }
      console.log(data)
      return postselectRelatedInterests({ ...data })
    },

    // 更改权益状态
    changeSwitch(e) {
      const params = {
        id: e + '',
        packageStatus: '1'
      }
      postPackInfosUpdateStatus(params)
    },

    // 重置
    handleReset() {
      // this.$refs.ruleForm.resetFields()
      this.queryParam.equityName = null
      this.queryParam.equityType = null
      this.reset = []
    },

    // 查询
    search() {
      this.$refs.table.refresh(true)
    },

    // 数组去重
    deWeight(arr, initArr = []) {
      arr.forEach((item) => {
        const isFind = initArr.find((cell) => cell.id === item.id)
        if (!isFind) {
          initArr.push(item)
        }
      })
      return initArr
    }
  }
}
</script>

<style lang="less" scoped>
.appeal-manage-list {
  .ant-card + .ant-card {
    margin-top: 20px;
  }
  .button {
    text-align: center;
  }
}

.ac {
  text-align: center;
}
</style>
