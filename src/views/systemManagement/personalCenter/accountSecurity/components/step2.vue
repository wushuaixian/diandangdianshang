<!--
 * @Author: your name
 * @Date: 2021-07-10 15:15:05
 * @LastEditTime: 2021-07-25 11:35:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/systemManagement/personalCenter/accountSecurity/components/step2.vue
-->
<template>
  <div>
    <!-- <a-card> -->
    <!-- <div class="password1">设置新密码</div> -->
    <a-form-model ref="ruleForm" :model="queryParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="设置密码" prop="password1">
        <a-input type="password" v-model="queryParams.password1" />
      </a-form-model-item>
      <a-form-model-item label="确认密码" prop="password2">
        <a-input type="password" v-model="queryParams.password2" />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 10, offset: 8 }">
        <a-button class="btn" type="primary" @click="submit">提交</a-button>
      </a-form-model-item>
    </a-form-model>
    <!-- </a-card> -->
  </div>
</template>
<script>
import { updatePassword } from '@/api/fince'
import md5 from 'md5'
export default {
  data() {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 10 },
      queryParams: {
        password1: '',
        password2: ''
      },
      rules: {
        password1: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'change'
          },
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
        password2: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.queryParams.password2 === '') {
                callback(new Error('请输入密码'))
              }
              if (this.queryParams.password1 !== this.queryParams.password2) {
                callback(new Error('两次输入的密码不一致'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    async submit() {
      const vm = this
      const {
        queryParams: { password1, password2 }
      } = vm
      this.$refs.ruleForm.validate(async (valid) => {
        console.log(valid)
        if (valid) {
          const result = await updatePassword({
            password1: md5(password1),
            password2: md5(password2)
          })
          if (result.code === '0') {
            vm.$emit('stepChange')
          } else {
            vm.$message.warning(result.message)
          }
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
.password1 {
  margin-bottom: 40px;
}
.btn {
  width: 100%;
  height: 40px;
  line-height: 40px;
}
</style>
