<template>
  <a-card :bordered="false">
    <header-title class="header-title">
      <span>员工信息</span>
    </header-title>
    <div class="margin-div"></div>
    <a-form-model :model="form" ref="form" :label-col="labelCol" :rules="rules" :wrapper-col="wrapperCol">
      <a-form-model-item has-feedback label="用户账号" prop="userName">
        <a-input v-model="form.username" disabled :maxLength="20" placeholder="请输入账号"></a-input>
      </a-form-model-item>
      <a-form-model-item label="姓名" prop="identityCardName">
        <a-input v-model="form.identityCardName" placeholder="请输入姓名"></a-input>
      </a-form-model-item>
      <a-form-model-item has-feedback label="手机号" prop="mobile">
        <a-input v-model="form.mobile" disabled :maxLength="11" placeholder="请输入手机号"></a-input>
      </a-form-model-item>

      <a-form-model-item label="登录密码">
        <a-input-password v-model="form.password" disabled placeholder="请输入登录密码"></a-input-password>
      </a-form-model-item>
      <a-form-model-item label="确认密码">
        <a-input-password v-model="form.password1" disabled placeholder="请输入确认密码"></a-input-password>
      </a-form-model-item>
      <a-form-model-item label="邮箱" prop="email">
        <a-input v-model="form.email" placeholder="请输入邮箱"></a-input>
      </a-form-model-item>
      <a-form-model-item label="所属机构" :wrapper-col="{ span: 22 }">
        <!--table begin-->
        <a-table ref="table" rowKey="id" :columns="columns" :scroll="{ x: 1200 }" :data-source="form.departments">
          <template slot="operation" slot-scope="record, item">
            <a-space>
              <a @click="() => handle_setAuthority(record, item)">功能权限</a>
            </a-space>
          </template>
          <template slot="mianEnterprise" slot-scope="record, item, index">
            <a-switch
              :checked="record.mianEnterprise === '1' ? true : false"
              @change="changeMianEnterprise(item, index)"
            ></a-switch>
          </template>
          <template slot="oaUserCode" slot-scope="record">
            <a-input v-model="record.oaUserCode" :value="record.oaUserCode" />
          </template>
          <template slot="erpUserCode" slot-scope="record">
            <a-input v-model="record.erpUserCode" />
          </template>
          <template slot="erpWorkCode" slot-scope="record">
            <a-input v-model="record.erpWorkCode" />
          </template>
          <!--工号-->
          <template slot="idNo" slot-scope="record">
            <a-input v-model="record.idNo" />
          </template>
          <!-- 岗位-->
          <template slot="positionId" slot-scope="record">
            <position-select
              :positionId="record.positionId"
              v-model="record.positionId"
              :org-id="record.orgId"
              :key="record.orgId"
            ></position-select>
          </template>
        </a-table>
        <!--table end-->
      </a-form-model-item>
      <a-form-model-item label="状态">
        <a-switch v-model="form.isAvailable"></a-switch>
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
        <a-date-picker :defaultValue="moment(form.birthday)" format="YYYY-MM-DD" v-model="form.birthday" />
      </a-form-model-item>
      <a-form-model-item label="备注" prop="remarks">
        <a-input v-model="form.remarks" type="textarea" placeholder="请输入备注" />
      </a-form-model-item>
    </a-form-model>
    <a-row>
      <a-col :span="24" align="center">
        <a-space align="center">
          <a-button type="primary" :loading="loading" @click="handleSave">保存</a-button>
          <a-button @click="$router.back()">返回</a-button>
          <a-button type="primary" @click="handleResetPwd(form.id)">重置密码</a-button>
        </a-space>
      </a-col>
    </a-row>

    <!--功能权限-->
    <a-modal
      :visible="visibleModal"
      :confirmLoading="confirmLoading"
      :title="modalTitle"
      destroyOnClose
      @ok="handleOk"
      @cancel="closeModal"
      okText="保存"
      width="1000px"
      cancelText="取消"
    >
      <authority v-if="visibleModal" :userId="form.id" :entityId="currentOrgId" @change="handleChange_role"></authority>
    </a-modal>
  </a-card>
</template>

<script>
import { addUserOperate, positionList, queryUserOperate, resetPassword } from '@/api/employee.js'
import { queryRoleManagementInfo } from '@/api/roleManagement.js'
import { batchUpdateUserRole } from '@/api/userRole.js'
import constants from '@/config/constants.js'
import Authority from '../authority/index'
import PositionSelect from './positionSelect'
import moment from 'moment'
export default {
  name: 'EditStaff',
  components: {
    Authority,
    PositionSelect
  },
  data() {
    return {
      that: this,
      moment,
      form: {},
      loading: false,
      labelCol: { span: 2 },
      wrapperCol: { span: 14 },
      rules: {
        identityCardName: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        email: [{ validator: this.validate_email, trigger: 'change' }],
        remarks: [{ validator: this.validate_remarks, trigger: 'change' }]
      },
      saveLoading: false,
      platformType: [],
      organList: [],
      positionList: [],
      sexList: [],
      isEdit: false,
      columns: [
        { title: '机构名称', width: 100, dataIndex: 'enterpriseName' },
        { title: 'OA用户编码', width: 120, key: 'oaUserCode', scopedSlots: { customRender: 'oaUserCode' } },
        { title: 'ERP用户编码', width: 120, key: 'erpUserCode', scopedSlots: { customRender: 'erpUserCode' } },
        { title: 'ERP职员编码', width: 120, key: 'erpWorkCode', scopedSlots: { customRender: 'erpWorkCode' } },
        { title: '工号', width: 120, key: 'idNo', scopedSlots: { customRender: 'idNo' } },
        { title: '部门', dataIndex: 'name' },
        { title: '岗位', width: 120, key: 'positionId', scopedSlots: { customRender: 'positionId' } },
        { title: '是否主企业', width: 120, key: 'mianEnterprise', scopedSlots: { customRender: 'mianEnterprise' } },
        { title: '操作', width: 100, key: 'operation', fixed: 'right', scopedSlots: { customRender: 'operation' } }
      ],
      visibleModal: false,
      confirmLoading: false,
      modalTitle: '功能权限',
      currentOrgId: -1,
      currentRoleList: [],
      positions: [],
      originRoleList: []
    }
  },
  created() {
    const vm = this
    vm.platformType = constants.platformType[this.$store.state.permission.isPlatform]
    vm.sexList = constants.sexList
    const id = vm.$router?.history?.current?.params?.id
    // if (id) {
    vm.getDetail(id)
    // }
  },
  methods: {
    validate_remarks(rule, value, callback) {
      if (value === '' || typeof value === 'undefined') {
        callback()
      } else if (value && value.length > 100) {
        callback(new Error('请输入0-100个字符'))
      } else {
        callback()
      }
    },
    handleSave() {
      const vm = this
      const { form } = vm
      const { isAvailable } = form
      form.isAvailable = isAvailable === true ? 1 : 0
      vm.$refs.form.validate((valid) => {
        if (valid) {
          vm.saveLoading = true
          vm.loading = true
          // form.birthday = new Date(form.birthday).getTime()
          addUserOperate(form).then((res) => {
            if (res.code === '0' || res.code === 0) {
              vm.$message.success('编辑成功')
              vm.getDetail(vm.$router?.history?.current?.params?.id)
              // vm.$router.push({ name: 'StaffManagement' })
            }
          })
        }
      })
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
      positionList({ orgId: orgId }).then((res) => {
        if (res.code === 0 || res.code === '0') {
          vm.positionList = res.data
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
    },
    getDetail(id) {
      const vm = this
      queryUserOperate({ id: id }).then((res) => {
        const { code, data } = res
        if (code === '0' || code === 0) {
          const { isAvailable } = data || {}
          data.isAvailable = isAvailable === 1
          vm.form = data
          vm.form.birthday = moment(vm.form.birthday)
          vm.form.password1 = data.password
          vm.loading = false
        }
      })
    },
    handle_setAuthority(row, item) {
      const vm = this
      console.log(item)
      vm.currentOrgId = row.entityId
      vm.visibleModal = true
    },
    closeModal() {
      const vm = this
      vm.visibleModal = false
    },
    handleOk() {
      const vm = this
      const delRoleList = []
      const { form, currentRoleList, originRoleList } = vm
      if (currentRoleList.length === 0) {
        this.$message.warning('请选择功能权限')
        return
      }
      if (originRoleList && originRoleList.length > 0) {
        originRoleList.forEach((item) => {
          const key = currentRoleList.find((role) => {
            return role === item
          })
          if (typeof key === 'undefined') {
            delRoleList.push(item)
          }
        })
      }
      vm.confirmLoading = true
      const params = {
        userId: form.id,
        roleList: currentRoleList,
        operaDepartmentId: null,
        delRoleList: delRoleList
      }
      batchUpdateUserRole(params).then((res) => {
        vm.confirmLoading = false
        if (res.code === '0' || res.code === 0) {
          vm.visibleModal = false
          vm.$message.success('保存成功')
        }
      })
    },
    handleChange_role(roleList, originRoleList) {
      this.currentRoleList = roleList
      this.originRoleList = originRoleList
    },
    handleResetPwd(id) {
      resetPassword({ userId: id }).then((res) => {
        if (res.code === 0 || res.code === '0') {
          this.$message.success('重置成功')
        }
      })
    },
    changeMianEnterprise(item, index) {
      const {
        form: { departments }
      } = this
      this.$confirm({
        title: '提示',
        content: '确定取消设为部门主管后，将取消原主管的身份，确认设置吗？',
        onOk: () => {
          departments.map((i, ind) => {
            if (index === ind) i.mianEnterprise = '1'
            else i.mianEnterprise = '0'
            return i
          })
        },
        onCancel() {}
      })
      // departments.map((i) => {
      //   i.mianEnterprise = '0'
      //   return i
      // })
      // departments[index]?.mianEnterprise = '1'

      // this.form.departments[index]?.mianEnterprise = true
    }
  }
}
</script>

<style scoped lang="less">
.margin-div {
  margin-bottom: 24px;
}
/deep/ .ant-transfer-list {
  width: none;
}
</style>
