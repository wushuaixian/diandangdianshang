
<template>
  <div class="appeal-manage-list">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model layout="inline" ref="ruleForm" :model="queryParam">
          <a-row :gutter="48">
            <a-col :md="7" :sm="24">
              <a-form-model-item label="套餐名称" prop="packageName">
                <a-input v-model="queryParam.packageName" placeholder="请输入套餐名称" />
              </a-form-model-item>
            </a-col>
            <a-col :md="7" :sm="24">
              <a-form-model-item label="套餐状态" prop="isAvailable">
                <a-select
                  v-model="queryParam.packageStatus"
                  defaultValue="全部"
                  @change="changeAvailable"
                  :options="selectStatus"
                  placeholder="请选择套餐状态"
                >
                </a-select>
              </a-form-model-item>
            </a-col>

            <a-col :md="10" :sm="24">
              <a-form-model-item label="创建时间" prop="time">
                <a-date-picker v-model="queryParam.beginTime" show-time type="date" placeholder="请选择" />
                至
                <a-date-picker v-model="queryParam.endTime" show-time type="date" placeholder="请选择" />
                <!-- <a-range-picker v-model="reset" @change="changeTime" /> -->
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
      <a-button @click="gotoAdd" type="primary" style="margin-bottom: 15px">添加套餐</a-button>
      <s-table
        :scroll="{ x: 2000 }"
        rowKey="id"
        name="leaguerPackageManage"
        ref="table"
        :columns="columns"
        :data="postPackInfos"
      >
        <template slot="packageStatus" slot-scope="text, row">
          <a-switch :defaultChecked="row.packageStatus === '0' ? true : false" @change="changeSwitch(row)" />
        </template>
        <template slot="createTime" slot-scope="text, row">
          {{ row.createTime | dayjs }}
        </template>
        <template slot="packageUrl" slot-scope="text, row">
          <div>
            <ImagePreview :width="40" :height="40" :value="[row.packageUrl]" />
          </div>
        </template>

        <template slot="options" slot-scope="text, row">
          <a @click="gotoUpdate(row)">编辑</a>
          <a v-if="row.packageStatus !== '0'" style="margin-left: 15px" @click="Delete(row.id)">删除</a>
        </template>
      </s-table>
    </a-card>
    <a-modal v-model="visibleShowDelete" title="删除" ok-text="确定" cancel-text="取消" @ok="hideDelete">
      <p class="ac">确认将当前数据删除？</p>
    </a-modal>
  </div>
</template>

<script>
import {
  postPackInfosQueryAll,
  postListMulti,
  postPackInfos,
  postPackInfosUpdateStatus,
  postPackInfosDelete
} from '@/api/memberPackage'

import { formatDate } from '@/utils/util'
import ImagePreview from '@/components/ImagePreview/'

export default {
  components: { ImagePreview },
  data() {
    return {
      reset: null,
      // 套餐权益类型列表
      projectType: [],
      visibleShowDelete: false,
      selectStatus: [
        {
          label: '全部',
          value: null
        },
        {
          label: '启用',
          value: '0'
        },
        {
          label: '停用',
          value: '1'
        }
      ],
      columns: [
        {
          title: '套餐名称',
          key: 'packageName',
          dataIndex: 'packageName'
        },
        {
          title: '套餐logo',
          dataIndex: 'packageUrl',
          key: 'packageUrl',
          scopedSlots: { customRender: 'packageUrl' }
        },
        {
          title: '套餐原价(元/年)',
          dataIndex: 'packageOriginalPrice',
          key: 'packageOriginalPrice',
          scopedSlots: { customRender: 'packageOriginalPrice' }
        },
        {
          title: '套餐首年特惠价',
          dataIndex: 'packageDiscountPrice',
          key: 'packageDiscountPrice',
          scopedSlots: { customRender: 'packageDiscountPrice' }
        },
        {
          title: '状态',
          dataIndex: 'packageStatus',
          key: 'packageStatus',
          scopedSlots: { customRender: 'packageStatus' }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime',
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '操作',
          dataIndex: 'options',
          key: 'options',
          fixed: 'right',
          width: 120,
          align: 'center',
          scopedSlots: { customRender: 'options' }
        }
      ],
      queryParam: {
        packageName: null,
        packageStatus: null,
        beginTime: null,
        endTime: null
      },
      advanced: false
    }
  },
  created() {
    this.postListMulti()
  },

  methods: {
    // 套餐权益类型列表
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
      this.queryParam.beginTime = formatDate(e[0]._d)
      this.queryParam.endTime = formatDate(e[1]._d)
    },
    // 监听套餐状态值
    changeAvailable(e) {
      this.queryParam.packageStatus = e
      console.log(e)
    },
    // 跳转编辑页
    gotoUpdate(e) {
      const { createTime } = e
      postPackInfosQueryAll({ id: e.id }).then((res) => {
        const data = {
          ...res.data,
          createTime
        }
        console.log(data)
        // sessionStorage.setItem('leaguerPackageManageUpdateData', JSON.stringify(data))
        this.$router.push({ name: 'leaguerPackageManageAddUpdate', query: { updateData: JSON.stringify(data) } })
      })
    },
    // 跳转新增页
    gotoAdd() {
      this.$router.push({ name: 'leaguerPackageManageAddUpdate', query: { isAdd: true } })
    },
    // 删除modal
    Delete(e) {
      this.id = e
      console.log(e)
      this.visibleShowDelete = true
    },
    // 删除
    hideDelete() {
      const params = {
        id: this.id + ''
      }
      postPackInfosDelete(params).then((res) => {
        if (res.code === '0') {
          this.search()
        }
      })
      this.visibleShowDelete = false
    },
    // 获取列表
    async postPackInfos(pagination) {
      const { queryParam } = this
      const data = {
        ...pagination,
        ...queryParam
      }
      return postPackInfos({ ...data })
    },
    // 更改权益状态
    changeSwitch(e) {
      e.packageStatus = e.packageStatus === '1' ? '0' : '1'
      postPackInfosUpdateStatus(e)
    },
    // 重置
    handleReset() {
      this.$refs.ruleForm.resetFields()
      this.queryParam = {
        packageName: null,
        packageStatus: null,
        beginTime: null,
        endTime: null
      }
      this.reset = null
    },
    // 查询
    search() {
      this.$refs.table.refresh(true)
    }
    //
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
/deep/ .ant-form-item-control {
  width: 100%;
}
/deep/ .ant-form-item-children {
  display: flex;
}
/deep/ .ant-calendar-picker {
  width: 100%;
  min-width: 0px !important;
}
/deep/ .ant-form-item-control-wrapper {
  width: 100%;
}

.ac {
  text-align: center;
}
.button {
  text-align: center;
}
</style>
