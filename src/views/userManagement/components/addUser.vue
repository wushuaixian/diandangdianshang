<template>
  <a-modal :title="title" wrapClassName="add-user" :visible="visible" @ok="onSubmit" @cancel="handleCancel">
    <a-form-model
      ref="addRefForm"
      :model="addForm"
      :rules="addRules"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-form-model-item label="登录用户名" :prop="title === '编辑用户' ? '' : 'userName'">
        <a-input
          :disabled="isSuperAdmin === '管理员' || title === '编辑用户'"
          :maxLength="20"
          v-model="addForm.userName"
          placeholder="请输入用户名"
        />
      </a-form-model-item>
      <a-form-model-item label="姓名" prop="identityCardName">
        <a-input :maxLength="20" v-model="addForm.identityCardName" placeholder="请输入姓名" />
      </a-form-model-item>
      <!-- <a-form-model-item label="手机号" prop="mobile">
        <a-input :maxLength="11" v-model="addForm.mobile" placeholder="请输入手机号" />
      </a-form-model-item> -->
      <a-form-model-item label="登录密码" prop="password">
        <a-input
          :disabled="title === '编辑用户'"
          v-model="addForm.password"
          placeholder="密码为8-20位需同时包含字母、数字"
          type="password"
        />
      </a-form-model-item>
      <a-form-model-item label="确认密码" prop="password1">
        <a-input
          :disabled="title === '编辑用户'"
          v-model="addForm.password1"
          placeholder="密码为8-20位需同时包含字母、数字"
          type="password"
        />
      </a-form-model-item>
      <!-- <a-form-model-item label="所属部门" prop="departmentId">
        <a-select
          allowClear
          :getPopupContainer="(triggerNode) => triggerNode.parentNode"
          mode="multiple"
          v-model="addForm.departmentId"
          placeholder="请选择"
        >
          <a-select-option v-for="item in departmentList" :key="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
        <a style="color: #81d3f8; position: absolute; right: -80px">添加部门</a>
      </a-form-model-item> -->
      <a-form-model-item class="item" label="所属岗位" prop="positionIds">
        <a-select mode="multiple" v-model="addForm.positionIds" @focus="queryPosition" placeholder="请选择">
          <a-select-option v-for="item in postList" :key="item.id">
            {{ item.positionName }}
          </a-select-option>
        </a-select>
        <!-- <router-link class="link top30px" :to="{ name: 'PostManagement' }">添加岗位</router-link> -->
        <a class="link top30px" @click="goPostManagement('PostManagement')">添加岗位</a>
        <!-- <a style="color: #81d3f8; position: absolute; right: -80px">添加岗位</a> -->
      </a-form-model-item>
      <a-form-model-item class="item" label="角色" prop="roleList">
        <a-select
          v-if="isSuperAdmin !== '管理员'"
          @focus="getRoleList"
          mode="multiple"
          placeholder="请选择"
          v-model="addForm.roleList"
        >
          <a-select-option v-for="item in roleList" :key="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
        <a-input v-else :disabled="isSuperAdmin === '管理员'" placeholder="管理员" />
        <a class="link top20px" @click="goPostManagement('RoleManagementList')">添加角色</a>
        <!-- <router-link class="link top20px" :to="{ name: 'RoleManagementList' }">添加角色</router-link> -->
        <!-- <a style="color: #81d3f8; position: absolute; right: -80px">添加角色</a> -->
      </a-form-model-item>
      <a-form-model-item label="OA用户编码">
        <a-input v-model="addForm.oaUserCode" placeholder="请输入OA用户编码" />
      </a-form-model-item>
      <a-form-model-item label="ERP用户编码">
        <a-input v-model="addForm.erpUserCode" placeholder="请输入ERP用户编码" />
      </a-form-model-item>
      <a-form-model-item label="ERP职员编码">
        <a-input v-model="addForm.erpWorkCode" placeholder="请输入ERP职员编码" />
      </a-form-model-item>
      <!-- <a-form-model-item label="数据权限">
        <a-button type="primary" class="jump-href" @click="location.href = '/user/login'"> 编辑 </a-button>
      </a-form-model-item> -->
      <!-- <a-form-model-item :wrapper-col="{ span: 12, offset: 5 }">
        <a-button html-type="submit" style="margin-left: 30px" @click="onSubmit"> 确认 </a-button>
        <a-button style="margin-left: 30px" @click="handleCancel"> 取消 </a-button>
      </a-form-model-item> -->
    </a-form-model>
  </a-modal>
</template>

<script>
import { getRoleList, queryPosition, addEmployee, detailOne } from '@/api/userManagement'
import { checkUserName } from '@/api/user'
import md5 from 'md5'
import { mapState } from 'vuex'
export default {
  name: 'AddUser',
  props: {
    title: {
      type: String,
      default: () => ''
    },
    visible: {
      type: Boolean,
      required: true
    },
    info: {
      type: Object,
      default: () => {}
    },
    isSuperAdmin: {
      type: String,
      default: () => ''
    },
    roleid: {
      type: Number,
      default: () => 0
    }
  },
  computed: {
    ...mapState({
      isPlatform: (state) => state.permission.isPlatform
    })
  },
  data() {
    return {
      // 添加验证规则
      addRules: {
        userName: [
          { required: true, validator: this.validate_name, trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z_]*$/, message: '仅支持字母数字下划线', trigger: 'change' },
          {
            min: 6,
            max: 20,
            message: '长度在6到20个字符',
            trigger: 'change'
          }
        ],
        identityCardName: [
          { required: true, message: this.$t('请输入真实姓名'), trigger: 'change' },
          {
            min: 1,
            max: 20,
            message: '长度在1到2个字符',
            trigger: 'change'
          }
        ],
        // mobile: [
        //   { required: true, validator: this.validate_mobile, trigger: 'change' },
        //   { pattern: /^1[0-9]{10}$/, message: '请输入正确的手机号', trigger: 'change' }
        // ],
        // departmentId: [{ required: true, message: '请选择部门', trigger: 'change' }],
        positionIds: [{ required: true, message: '请选择岗位', trigger: 'change' }],
        roleList: [{ required: true, message: '请选择角色', trigger: 'change' }],
        password: [
          { required: true, validator: this.checkPassword, trigger: 'change' },
          {
            min: 8,
            max: 20,
            message: '请输入最小8位到20位密码',
            trigger: 'change'
          },
          {
            required: true,
            pattern: /^(?![a-zA-z]+$)(?!\d+$)(?![_]+$)[a-zA-Z\d_]+$/,
            message: '密码需要同时包含字母和数字',
            trigger: 'change'
          }
        ],
        password1: [
          { required: true, validator: this.checkPassword1, trigger: 'change' },
          {
            min: 6,
            max: 20,
            message: '长度在6到20个字符',
            trigger: 'change'
          }
        ]
      },
      // 添加表单数据
      addForm: this?.title === '编辑用户' ? this.info || {} : {},
      roleList: [],
      postList: [],
      departmentList: [],
      enterpriseInfo: {}
    }
  },
  watch: {
    async visible(val) {
      if (val) {
        await this.detailOne()
        await this.getRoleList()
        await this.queryPosition()
        if (this?.title === '编辑用户') {
          this.addForm = this.info
        } else if (this?.roleid) {
          this.$set(this.addForm, 'roleList', [this.roleid])
        }
      }
    }
  },
  methods: {
    goPostManagement(name) {
      const { href } = this.$router.resolve({
        name
      })
      window.open(href, '_blank')
    },
    checkPassword(rule, value, callback) {
      if (!this.addForm.userId) {
        if (value == null) {
          return callback(new Error(this.$t('请输入密码')))
        } else if (value === this.addForm.userName) {
          return callback(new Error(this.$t('密码不能和用户名相同')))
        } else {
          return callback()
        }
      } else {
        return callback()
      }
    },
    checkPassword1(rule, value, callback) {
      if (!this.addForm.userId) {
        if (value == null) {
          return callback(new Error(this.$t('请确认密码')))
        } else if (value === this.addForm.userName) {
          return callback(new Error(this.$t('密码不能和用户名相同')))
        } else {
          if (value !== this.addForm.password) {
            return callback(new Error(this.$t('两次密码输入必须相同')))
          } else {
            return callback()
          }
        }
      } else {
        return callback()
      }
    },
    async detailOne() {
      const res = await detailOne()
      if (res.code === '0') {
        const [info] = res.data
        this.enterpriseInfo = info
      }
    },
    // 添加表单预验证
    async onSubmit() {
      await this.$refs.addRefForm.validate()
      const {
        addForm,
        addForm: { password, password1, userId }
      } = this
      const params = {
        ...addForm,
        password: md5(password),
        password1: md5(password1)
      }
      if (!params.isAvailable) params.isAvailable = 0
      if (params.departments) delete params.departments
      const res = !userId ? await addEmployee({ ...params }) : await addEmployee({ ...params })
      if (res.code === '0') {
        this.$message.success(!userId ? '用户添加成功' : '信息更新成功')
        this.handleCancel()
      }
    },
    // 关闭添加框
    handleCancel() {
      this.$refs.addRefForm.resetFields()
      this.addForm = {}
      this.$emit('close', false)
    },
    async getRoleList() {
      const {
        // isPlatform: platformId,
        enterpriseInfo: { orgId: entityId }
      } = this

      const { data } = await getRoleList({
        // platformId,
        entityId,
        // defaultType: platformId,
        createTimeBegin: null,
        createTimeEnd: null,
        currentPage: 1,
        itemsPerPage: 10
      })
      // this.roleList = data.listObj
      this.$set(this, 'roleList', data.listObj)
    },
    async queryPosition() {
      const {
        isPlatform: platformId,
        enterpriseInfo: { orgId: entityId }
      } = this
      const { data } = await queryPosition({ entityId, platformId, currentPage: 1, itemsPerPage: 100 })
      this.postList = data
    },
    async validate_mobile(rule, value, callback) {
      if (!value) callback(new Error('请输入手机号'))
      const result = await checkUserName({
        mobile: this.addForm.mobile
      })
      if (result.code === '0') {
        callback()
      } else {
        callback(new Error(result.message))
      }
    },
    async validate_name(rule, value, callback) {
      // if (this.title === '编辑用户') callback()
      if (!value) callback(new Error('登录用户名不能为空'))
      const result = await checkUserName({
        username: this.addForm.userName
      })
      if (result.code === '0') {
        callback()
      } else {
        callback(new Error(result.message))
      }
    }
    // async getDepartmentList() {
    //   const { data } = await getDepartmentList({})
    //   this.departmentList = data
    // }
  }
}
</script>

<style scoped lang="less">
.add-user {
  .ant-form {
    .ant-select {
      width: 100%;
    }
    // .jump-href {
    //   background-color: #1890ff !important;
    //   border-color: #1890ff !important;
    // }
  }
}
.item {
  position: relative;
  .link {
    position: absolute;
    width: 100px;
    left: -64px;
  }
  .top30px {
    top: 30px;
  }
  .top20px {
    top: 20px;
  }
}
</style>
