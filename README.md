## 环境和依赖

- node
- yarn
- webpack
- eslint
- @vue/cli
- [ant-design-vue@1.x](https://github.com/vueComponent/ant-design-vue) - Ant Design Of Vue 实现
- [vue-cropper](https://github.com/xyxiao001/vue-cropper) - 头像裁剪组件

> 请注意，我们强烈建议本项目使用 [Yarn](https://yarnpkg.com/) 包管理工具，这样可以与本项目演示站所加载完全相同的依赖版本 (yarn.lock) 。由于我们没有对依赖进行强制的版本控制，采用非 yarn 包管理进行引入时，可能由于 Pro 所依赖的库已经升级版本而引入了新版本所导致的问题。作者可能会由于时间问题无法及时排查而导致您采用本项目作为基项目而出现问题。

## 项目下载和运行

- 拉取项目代码

```

- 安装依赖
```

yarn install

```

- 开发模式运行
```

yarn run serve

```

- 编译项目
```

yarn run build

```

- Lints and fixes files
```

yarn run lint

```
、、、列表模板
<template>
  <div class="appeal-manage-list">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form-model
          layout="inline"
          ref="ruleForm"
          :model="queryParam"
        >
          <a-row :gutter="48">
            <a-col
              :md="8"
              :sm="24"
            >
              <a-form-model-item
                label="企业名称"
                prop="businessName"
              >
                <a-input
                  v-model="queryParam.businessName"
                  placeholder="请输入"
                />
              </a-form-model-item>
            </a-col>
            <a-col
              :md="8"
              :sm="24"
            >
              <a-form-model-item
                label="审核状态"
                prop="complaintStatus"
              >
                <a-select
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  allowClear
                  v-model="queryParam.complaintStatus"
                  :options="options"
                  placeholder="请选择"
                >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col
              :md="8"
              :sm="24"
            >
              <a-form-model-item
                label="提交时间"
                prop="time"
              >
                <a-range-picker v-model="queryParam.time" />
              </a-form-model-item>
            </a-col>
            <a-col
              :md="24"
              :sm="24"
              class="button"
            >
              <a-button @click="handleReset">重置</a-button>
              <a-button
                type="primary"
                @click="search"
              >查询</a-button>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </a-card>
    <a-card>
      <s-table
        rowKey="id"
        ref="table"
        :columns="columns"
        :data="getList"
      >
        <template v-slot:createTime="props">
          <div v-if="props">
            {{ props | moment }}
          </div>
          <div v-else></div>
        </template>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { getList } from '@/api/appealManage'

export default {
  data() {
    return {
      colorList: ['orange', 'blue', 'red'],
      options: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '待处理',
          value: '0'
        },
        {
          label: '已处理',
          value: '1'
        },
        {
          label: '驳回',
          value: '2'
        }
      ],
      columns: [
        {
          title: '企业名称',
          key: 'businessName',
          customRender: (record) => {
            const { id, businessName } = record
            return <router-link to={{ name: 'AppealManageDetail', params: { id } }}>{businessName}</router-link>
          }
        },
        {
          title: '身份来源',
          dataIndex: 'identitySource',
          key: 'identitySource'
        },
        {
          title: '提交时间',
          dataIndex: 'createTime',
          key: 'createTime',
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '状态',
          key: 'complaintStatus',
          customRender: (entity) => {
            const { options, colorList } = this
            const item = options.find((x) => x.value === entity?.complaintStatus)
            return (
              <span>
                {entity?.complaintStatus === '2' ? (
                  <a-tooltip placement="top">
                    <template slot="title">
                      <span>{this.$$(entity, 'rejectReason')}</span>
                    </template>
                    <a-badge color={colorList[item?.value]} text={item?.label} />
                    <a-icon style="margin-left:10px" type="question-circle" />
                  </a-tooltip>
                ) : (
                  <a-badge color={colorList[item?.value]} text={item?.label} />
                )}
              </span>
            )
          }
        },

        {
          title: '申诉内容',
          key: 'complaintContent',
          customRender: (entity) => {
            return (
              <div>
                {entity?.complaintContent.substring(0, 10)}
                {entity?.complaintContent.length > 10 ? '...' : ''}
              </div>
            )
          }
        }
      ],
      queryParam: {
        complaintStatus: '',
        businessName: '',
        time: null
      },
      advanced: false,
      list: []
    }
  },
  methods: {
    // 获取列表
    async getList(pagination) {
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
      return getList({ ...data })
      // eslint-disable-next-line no-unreachable
      // if (res.code === '0') {
      //   const { data, total } = res.data
      //   this.pagination.total = total
      //   this.list = data
      // }
    },
    handleReset() {
      this.$refs.ruleForm.resetFields()
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
</style>
、、、

、、、查询条件自定义 label 宽度

<div class="table-page-search-wrapper-custom">
        <a-form-model
          layout="inline"
          ref="form"
          :rules="rules"
          :model="params"
          v-bind="{
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
          }"
        >
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="公司名称">
                <d-select v-model="params.buyerMerchantId" :options="merchantList"></d-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="采购计划编号">
                <a-input v-model="params.buyerPlanCode" disabled />
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="计划类型">
                <d-select v-model="params.planType" :options="planTypeList"></d-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="申请组织" prop="applyDepartment">
                <a-input v-model="params.applyDepartment" placeholder="请输入申请组织" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="申请部门" prop="useDepartment">
                <a-input v-model="params.useDepartment" placeholder="请输入申请部门" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="申报人" prop="declarant">
                <a-input v-model="params.declarant" placeholder="请输入申报人" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="联系电话">
                <a-input v-model="params.contact" placeholder="请输入联系电话" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="计划项目编码" prop="planProjectCode">
                <a-input v-model="params.planProjectCode" placeholder="请输入计划项目编码" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="计划项目名称" prop="planProjectName">
                <a-input v-model="params.planProjectName" placeholder="请输入计划项目名称" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="备注">
                <a-input v-model="params.remark" placeholder="请输入备注" />
              </a-form-model-item>
            </a-col>
            <a-col :md="8">
              <a-form-model-item label="">
                <a-col :span="8" class="ant-form-item-label"></a-col>
                <a-checkbox v-model="params.defaultBuyerUser">默认创建人为采购员</a-checkbox>
              </a-form-model-item>
            </a-col>
          </a-row>
          <div class="table-page-search-submitButtons">
            <a-button v-if="showHide" type="primary" @click="nextStep">下一步</a-button>
            <a-button v-else type="primary" @click="Submit">提交</a-button>
            <a-button v-if="showHide">取消</a-button>
            <a-button v-else @click="cancel()">取消</a-button>
          </div>
        </a-form-model>
      </div>
```
