<template>
  <a-card :bordered="false">
    <header-title class="header-title">
      <span>员工信息</span>
    </header-title>
    <div class="margin-div"></div>
    <a-form-model :model="form" ref="form" :label-col="labelCol" :rules="rules" :wrapper-col="wrapperCol">
      <a-form-model-item has-feedback label="用户账号" prop="userName">
        <a-input v-model="form.userName" :maxLength="20" placeholder="请输入账号"></a-input>
      </a-form-model-item>
      <a-form-model-item label="姓名" prop="identityCardName">
        <a-input v-model="form.identityCardName" :maxLength="20" placeholder="请输入姓名"></a-input>
      </a-form-model-item>
      <a-form-model-item has-feedback label="手机号" prop="mobile">
        <a-input v-model="form.mobile" :maxLength="11" placeholder="请输入手机号"></a-input>
      </a-form-model-item>
      <a-form-model-item required label="所属平台">
        <a-select
          allowClear
          :getPopupContainer="(triggerNode) => triggerNode.parentNode"
          @change="handleChange_platform"
          placeholder="请选择"
        >
          <a-select-option :key="item.value" v-for="item in platformType" :value="item.value">
            {{ item.label }}</a-select-option
          >
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="所属机构" prop="departmentId">
        <a-select
          show-search
          allowClear
          :filter-option="filterOption"
          :getPopupContainer="(triggerNode) => triggerNode.parentNode"
          v-model="form.departmentId"
          @change="handleChange_organ"
          placeholder="请选择"
        >
          <a-select-option :key="item.orgId" v-for="item in organList" :value="item.orgId">
            {{ item.enterpriseName }}</a-select-option
          >
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="OA用户编码" prop="oaUserCode">
        <a-input :maxLength="30" v-model="form.oaUserCode" placeholder="请输入OA用户编码"></a-input>
      </a-form-model-item>
      <a-form-model-item label="ERP用户编码" prop="erpUserCode">
        <a-input :maxLength="30" v-model="form.erpUserCode" placeholder="请输入ERP用户编码"></a-input>
      </a-form-model-item>
      <a-form-model-item label="ERP职员编码" prop="erpWorkCode">
        <a-input :maxLength="30" v-model="form.erpWorkCode" placeholder="请输入ERP职员编码"></a-input>
      </a-form-model-item>

      <a-form-model-item label="登录密码" prop="password">
        <a-input type="password" :maxLength="20" v-model="form.password" placeholder="请输入登录密码"></a-input>
      </a-form-model-item>
      <a-form-model-item label="确认密码" prop="password1">
        <a-input type="password" :maxLength="20" v-model="form.password1" placeholder="请输入确认密码"></a-input>
      </a-form-model-item>
      <a-form-model-item label="邮箱" prop="email">
        <a-input v-model="form.email" placeholder="请输入邮箱"></a-input>
      </a-form-model-item>
      <a-form-model-item label="工号" prop="idNo">
        <a-input v-model="form.idNo" placeholder="请输入工号"></a-input>
      </a-form-model-item>
      <a-form-model-item label="岗位" prop="positionId">
        <a-select
          allowClear
          :getPopupContainer="(triggerNode) => triggerNode.parentNode"
          v-model="form.positionId"
          placeholder="请选择"
        >
          <a-select-option :key="item.id" v-for="item in positionList" :value="item.id">
            {{ item.positionName }}</a-select-option
          >
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="状态" prop="isAvailable">
        <a-switch default-checked></a-switch>
      </a-form-model-item>

      <header-title class="header-title">
        <span>其他信息</span>
      </header-title>
      <div class="margin-div"></div>
      <a-form-model-item label="头像">
        <div class="content">
          <s-upload :key="form.headPicUrl" v-model="form.headPicUrl" list-type="picture-card">
            <div class="upload" v-if="!form.headPicUrl">
              <div class="plus">
                <a-icon class="icon" type="plus" />
              </div>
              <div class="text">添加上传图片</div>
            </div>
          </s-upload>
          <div class="message">
            <div class="other">提示:支持上传一张，建议尺寸800*800PX，单张大小不超过4M，支持JPG、JPEG、PNG格式</div>
          </div>
        </div>
      </a-form-model-item>
      <a-form-model-item label="性别" prop="sex">
        <a-select
          allowClear
          :getPopupContainer="(triggerNode) => triggerNode.parentNode"
          v-model="form.sex"
          placeholder="请选择"
        >
          <a-select-option :key="item.value" v-for="item in sexList" :value="item.value">
            {{ item.label }}</a-select-option
          >
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="生日" prop="birthday">
        <a-date-picker v-model="form.birthday" />
      </a-form-model-item>
      <!--      <a-form-model-item label="有效期" prop="validTime">
        <a-date-picker v-model="form.validTime" />
      </a-form-model-item>-->
      <a-form-model-item label="备注" prop="remarks">
        <a-input v-model="form.remarks" type="textarea" placeholder="请输入备注" />
      </a-form-model-item>
    </a-form-model>
    <a-row>
      <a-col :span="24" align="center">
        <a-space align="center">
          <a-button type="primary" @click="handleSave">保存</a-button>
          <a-button
            @click="
              () => {
                this.$router.push({ name: 'StaffManagement' })
              }
            "
          >
            返回
          </a-button>
        </a-space>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import md5 from 'md5'
import { addUserOperate } from '@/api/employee.js'
import { queryRoleManagementInfo } from '@/api/roleManagement.js'
import { checkUserName } from '@/api/user.js'
import { queryPositionLists } from '@/api/position.js'
import constants from '@/config/constants.js'
export default {
  name: 'EditStaff',
  data() {
    return {
      form: {},
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      rules: {
        userName: [
          { required: true, message: '用户账号不能为空', trigger: 'blur' },
          { validator: this.validate_username, trigger: 'change' }
        ],
        identityCardName: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: this.validate_mobile, trigger: 'change' }
        ],
        departmentId: [{ required: true, message: '请选择所属机构', trigger: 'change' }],
        password: [
          {
            pattern: /^[0-9a-zA-Z_]{6,20}$/,
            message: '密码格式不正确',
            trigger: 'change'
          },
          // (?=^[\d_a-zA-Z]{6,20}$)(?=(.*\d)+)(?=(.*[a-zA-Z])+).*
          { required: true, message: '登录密码不能为空', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度需为6~20位', trigger: 'blur' }
        ],
        password1: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: this.validate_confirmPassword, trigger: 'change' }
        ],
        email: [{ validator: this.validate_email, trigger: 'change' }],
        remarks: [{ validator: this.validate_remarks, trigger: 'change' }],
        oaUserCode: [
          {
            pattern: /^[^\u4e00-\u9fa5]+$/,
            message: 'OA用户编码格式不正确',
            trigger: 'change'
          }
        ],
        erpUserCode: [
          {
            pattern: /^[^\u4e00-\u9fa5]+$/,
            message: 'ERP用户编码格式不正确',
            trigger: 'change'
          }
        ],
        erpWorkCode: [
          {
            pattern: /^[^\u4e00-\u9fa5]+$/,
            message: 'ERP职员编码格式不正确',
            trigger: 'change'
          }
        ]
      },
      saveLoading: false,
      platformType: [],
      organList: [],
      positionList: [],
      sexList: [],
      isEdit: false
    }
  },
  created() {
    const vm = this
    vm.platformType = constants.platformType[this.$store.state.permission.isPlatform]
    vm.sexList = constants.sexList
  },
  methods: {
    validate_remarks(rule, value, callback) {
      if (value === '' || typeof value === 'undefined') {
        callback()
      } else if (value.length > 100) {
        callback(new Error('请输入0-100个字符'))
      } else {
        callback()
      }
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    handleSave() {
      console.log('===')
      const vm = this
      const { form } = vm
      vm.$refs.form.validate((valid) => {
        console.log('valid', valid)
        if (valid) {
          const { password, password1 } = form
          form.password = md5(password)
          form.password1 = md5(password1)
          vm.saveLoading = true
          addUserOperate(form).then((res) => {
            if (res.code === '0' || res.code === 0) {
              vm.$message.success('添加成功')
              vm.$router.push({ name: 'StaffManagement' })
            }
          })
        }
      })
    },
    /**
     * check username
     * @param rule
     * @param value
     * @param callback
     */
    validate_username(rule, value, callback) {
      const reg = new RegExp(/^[a-zA-Z0-9_]{6,20}$/)
      if (!reg.test(value)) {
        callback(new Error('长度在6到20个字符'))
      } else {
        checkUserName({ username: value })
          .then((res) => {
            if (res.code === '0' || res.code === 0) {
              callback()
            } else {
              callback(new Error(res.message))
            }
          })
          .catch(() => {
            callback(new Error('查询失败'))
          })
      }
    },
    /**
     * check mobile
     * @param rule
     * @param value
     * @param callback
     */
    validate_mobile(rule, value, callback) {
      const reg = new RegExp(/^[1][3,4,5,6,7,8,9][0-9]{9}$/)
      if (!reg.test(value)) {
        callback(new Error('请填写正确的手机号'))
      } else {
        checkUserName({ username: value })
          .then((res) => {
            if (res.code === '0' || res.code === 0) {
              callback()
            } else {
              callback(new Error(res.message))
            }
          })
          .catch(() => {
            callback(new Error('查询失败'))
          })
      }
    },
    /**
     *  confirm password
     * @param rule
     * @param value
     * @param callback
     */
    validate_confirmPassword(rule, value, callback) {
      const vm = this
      const { password } = vm.form
      if (password !== value) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    },
    validate_email(rule, value, callback) {
      const regEmail = new RegExp(/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/)
      console.log('value', value, value === '')
      if (value === '' || typeof value === 'undefined') {
        callback()
      } else if (!regEmail.test(value)) {
        callback(new Error('邮箱格式不正确'))
      } else {
        callback()
      }
    },
    handleChange_platform(value) {
      const vm = this
      vm.getOrganList(value)
      this.form.departmentId = null
    },
    handleChange_organ(value) {
      this.getPositionList(value)
    },
    /**
     * Get position
     * @param orgId
     */
    getPositionList(orgId) {
      const vm = this
      queryPositionLists({ entityId: orgId, currentPage: 1, itemsPerPage: 100 }).then((res) => {
        if (res.code === 0 || res.code === '0') {
          vm.positionList = res.data.listObj
        }
      })
    },
    getOrganList(departmentType) {
      const vm = this
      queryRoleManagementInfo({ departmentType: departmentType }).then((res) => {
        const { code, data } = res
        if (code === '0' || code === 0) {
          if (data && data.length > 0) {
            vm.organList = data.filter((item) => {
              return item !== null
            }) // 过滤null脏数据
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.margin-div {
  margin-bottom: 24px;
}
</style>
