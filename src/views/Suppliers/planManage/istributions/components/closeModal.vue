<!--
 * @Author: your name
 * @Date: 2021-06-24 14:25:41
 * @LastEditTime: 2021-07-20 20:54:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/Suppliers/implement/compoents/waitPage/table/closeBth.vue
-->
<template>
  <div>
    <a-modal
      destroyOnClose
      :visible="visibleClose"
      title="提示"
      width="600px"
      ok-text="确认"
      cancel-text="取消"
      @ok="handleOk"
      @cancel="closePupup"
    >
      <div class="text">确认关闭当前所选计划?</div>
      <div class="applyCloseReason">
        <span class="applyCloseReason-span">关闭原因: </span>
        <a-textarea height="60" placeholder="请输入关闭原因" v-model="applyCloseReason" allow-clear maxlength="50" />
      </div>
    </a-modal>
  </div>
</template>
<script>
import { closePlan } from '@/api/projectCarry'
export default {
  props: {
    visibleClose: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    id: {
      type: Number,
      default: () => {
        return null
      }
    }
  },
  data() {
    return {
      applyCloseReason: ''
    }
  },
  methods: {
    async handleOk() {
      const { id, applyCloseReason } = this
      if (applyCloseReason === '') {
        return this.$message.warning('请填写原因')
      }
      const result = await closePlan({
        id,
        applyCloseReason
      })
      if (result.code === '0') {
        this.$message.success('计划关闭成功')
      }
      this.$emit('ok')
      this.closePupup()
    },
    closePupup() {
      this.applyCloseReason = ''
      this.$emit('update:visibleClose', false)
    }
  }
}
</script>
<style scoped lang='less'>
/deep/ .ant-modal-body {
  padding: 40px 100px;
}
.text {
  margin-bottom: 40px;
}
/deep/ .applyCloseReason {
  display: flex;
  .applyCloseReason-span {
    width: 100px;
  }
}
</style>
