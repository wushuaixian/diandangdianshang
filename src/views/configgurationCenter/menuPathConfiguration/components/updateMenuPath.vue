<!--
 * @Author: your name
 * @Date: 2021-07-26 19:12:16
 * @LastEditTime: 2021-08-03 16:39:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/configgurationCenter/menuPathConfiguration/components/updateMenuPath.vue
-->
<!--
 * @Author: your name
 * @Date: 2021-07-26 18:47:04
 * @LastEditTime: 2021-07-26 19:11:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/configgurationCenter/menuPathConfiguration/components/addMenuPath.vue
-->
<template>
  <div>
    <header-title class="header-title"> <span>修改功能</span> </header-title>
    <a-form-model
      class="form"
      ref="ruleForm"
      :model="queryParams"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-row>
        <a-col :span="12">
          <a-form-model-item label="权限代码" prop="code">
            <a-input :disabled="!isEdit" v-model="queryParams.code" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="权限名称" prop="name">
            <a-input :disabled="!isEdit" v-model="queryParams.name" />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-model-item label="权限层级" prop="level">
            <!-- <a-input v-model="queryParams.level" /> -->
            <d-select :disabled="!isEdit" v-model="queryParams.level" :options="levelList"></d-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="权益类型" prop="type">
            <!-- <a-input v-model="queryParams.type" /> -->
            <d-select :disabled="!isEdit" v-model="queryParams.type" :options="typeList"></d-select>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-model-item label="上级代码" prop="parentCode">
            <a-input :disabled="!isEdit" v-model="queryParams.parentCode" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="上级名称" prop="parentName">
            <a-input :disabled="!isEdit" v-model="queryParams.parentName" />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-model-item label="作用域" prop="domain">
            <a-input :disabled="!isEdit" v-model="queryParams.domain" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="路径" prop="path">
            <a-input :disabled="!isEdit" v-model="queryParams.path" />
          </a-form-model-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="12">
          <a-form-model-item label="小图标" prop="icon">
            <a-input :disabled="!isEdit" v-model="queryParams.icon" />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col class="btn">
          <a-button type="primary" @click="updata">{{ isEdit ? '修改' : '编辑' }}</a-button>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>
<script>
import { getFunctionById, updateFunction } from '@/api/configgurationCenter/menuPathConfiguration'
export default {
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    async info(val) {
      const { functionId, parentName } = val
      const { data } = await getFunctionById({
        id: functionId + ''
      })
      this.queryParams = { ...data, id: functionId + '', parentName }
    }
  },
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
      rules: {},
      queryParams: {},
      isEdit: false,
      typeList: [
        {
          value: 1,
          label: '菜单'
        },
        {
          value: 2,
          label: '按钮'
        },
        {
          value: 3,
          label: '功能'
        }
      ],
      levelList: [
        {
          value: 1,
          label: '一级'
        },
        {
          value: 2,
          label: '二级'
        },
        {
          value: 3,
          label: '三级'
        },
        {
          value: 4,
          label: '四级'
        },
        {
          value: 5,
          label: '五级'
        },
        {
          value: 6,
          label: '六级'
        },
        {
          value: 7,
          label: '七级'
        },
        {
          value: 8,
          label: '八级'
        }
      ]
    }
  },
  methods: {
    async updata() {
      const { queryParams, isEdit } = this
      if (!isEdit) {
        this.isEdit = !this.isEdit
        return
      }
      const result = await updateFunction({
        ...queryParams,
        platformId: this.info.platformId
      })
      if (result.code === '0') {
        this.$message.success('修改成功')
        this.$emit('ok')
      }
    }
  }
}
</script>
<style scoped lang="less">
.form {
  margin-top: 20px;
}
.btn {
  text-align: center;
}
</style>
