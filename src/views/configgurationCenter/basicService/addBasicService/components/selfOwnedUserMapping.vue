<!--
 * @Author: your name
 * @Date: 2021-07-21 21:06:21
 * @LastEditTime: 2021-08-07 16:50:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/configgurationCenter/basicService/addBasicService/components/selfOwnedUserMapping.vue
-->
<template>
  <div>
    <a-form-model ref="form" layout="inline" :model="queryParams" @submit="handleSubmit">
      <a-row>
        <a-col :span="8">
          <a-form-model-item label="手机号" prop="mobileNo">
            <a-input v-model="queryParams.mobileNo" placeholder="请输入手机号"> </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="姓名" prop="identityCardName">
            <a-input v-model="queryParams.identityCardName" placeholder="请输入姓名"> </a-input>
          </a-form-model-item>
        </a-col>
        <a-col :span="8">
          <a-form-model-item label="账号" prop="username">
            <a-input v-model="queryParams.username" placeholder="请输入账号"> </a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row class="btn">
        <a-button @click="reset">重置</a-button>
        <a-button class="search" type="primary" @click="$refs.table.refresh(true)">查询</a-button>
      </a-row>
    </a-form-model>
    <s-table
      ref="table"
      rowKey="id"
      :scroll="{ x: 500 }"
      name="selfOwnedUserMappingTable"
      :columns="columns"
      :data="getList"
    >
      <template v-slot:action="action, item">
        <div v-if="!item.disabled">
          <a class="save" @click="save(item)">保存</a>
          <a @click="refresh">取消</a>
        </div>
        <div v-else>
          <a @click="item.disabled = false">编辑</a>
        </div>
      </template>
      <template v-slot:oaUserCode="oaUserCode, item">
        <a-input
          v-model="item.oaUserCode"
          :disabled="item.disabled"
          placeholder="请输入OA用户编码"
          :maxLength="20"
        ></a-input>
      </template>
      <template v-slot:erpUserCode="erpUserCode, item">
        <a-input
          v-model="item.erpUserCode"
          :disabled="item.disabled"
          placeholder="请输入ERP用户编码"
          :maxLength="20"
        ></a-input>
      </template>
      <template v-slot:erpWorkCode="erpWorkCode, item">
        <a-input
          v-model="item.erpWorkCode"
          :disabled="item.disabled"
          placeholder="请输入ERP职员编码"
          :maxLength="20"
        ></a-input>
      </template>
      <template v-slot:idNo="idNo, item">
        <a-input v-model="item.idNo" :disabled="item.disabled" placeholder="请输入员工工号" :maxLength="20"></a-input>
      </template>
    </s-table>
  </div>
</template>
<script>
import { queryUserList, updateUser } from '@/api/basicService'
export default {
  props: {
    merchantId: {
      type: Number,
      default: () => null
    }
  },
  data() {
    return {
      queryParams: {
        mobileNo: '',
        identityCardName: '',
        username: ''
      },
      // merchantId: 2106160000000325,
      columns: [
        {
          title: '序号',
          key: 'index',
          customRender: (value, row, index) => {
            return index + 1
          }
        },
        {
          title: '账号',
          dataIndex: 'username',
          key: 'username',
          width: 200
        },
        {
          title: '姓名',
          dataIndex: 'identityCardName',
          key: 'identityCardName',
          width: 200
        },
        {
          title: '手机号',
          dataIndex: 'mobileNo',
          key: 'mobileNo',
          width: 200
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          key: 'email',
          width: 200
        },
        {
          title: '状态',
          dataIndex: 'isAvailable',
          key: 'isAvailable',
          width: 200,
          customRender: (value) => {
            if (value === 0) {
              return '停用'
            } else if (value === 1) {
              return '启用'
            }
          }
        },
        {
          title: 'OA用户编码',
          dataIndex: 'oaUserCode',
          key: 'oaUserCode',
          width: 200,
          scopedSlots: { customRender: 'oaUserCode' }
        },
        {
          title: 'ERP用户编码',
          dataIndex: 'erpUserCode',
          key: 'erpUserCode',
          width: 200,
          scopedSlots: { customRender: 'erpUserCode' }
        },
        {
          title: 'ERP职员编码',
          dataIndex: 'erpWorkCode',
          key: 'erpWorkCode',
          width: 200,
          scopedSlots: { customRender: 'erpWorkCode' }
        },
        {
          title: '员工工号',
          dataIndex: 'idNo',
          key: 'idNo',
          width: 200,
          scopedSlots: { customRender: 'idNo' }
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 100,
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  methods: {
    handleSubmit() {},
    async getList(params) {
      const { queryParams, merchantId } = this
      const result = await queryUserList({
        ...params,
        merchantId,
        ...queryParams
      })
      const {
        data: { listObj }
      } = result
      const list = listObj?.map((item) => {
        item.disabled = true
        return item
      })
      result.data.listObj = list || []
      return result
    },
    async save({ id, oaUserCode, erpUserCode, erpWorkCode, idNo }) {
      const result = await updateUser({
        id,
        oaUserCode,
        erpUserCode,
        erpWorkCode,
        idNo
      })
      if (result.code === '0') {
        this.$message.success('保存成功')
        this.$refs.table.refresh(true)
      }
    },
    reset() {
      this.$refs.form.resetFields()
    },
    refresh() {
      this.$refs.table.refresh(true)
    }
  }
}
</script>
<style scoped lang="less">
.btn {
  text-align: center;
  margin-top: 16px;
  margin-bottom: 24px;
  .search {
    margin-left: 16px;
  }
}
.save {
  margin-right: 10px;
}
</style>
