<!--
 * @Author: your name
 * @Date: 2021-07-14 19:28:27
 * @LastEditTime: 2021-08-09 23:38:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/finance/payable/custom/components/totaling.vue
-->
<template>
  <div>
    <a-modal v-model="visible" ok-text="确认" cancel-text="取消" title="申请付款" @ok="handleOk">
      <div style="text-align: center">
        请确认是否生成创建付款单，如确认请去
        <span @click="createPayment">付款单管理查看</span>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { paymentCreate } from '@/api/custom'
export default {
  data() {
    return {
      visible: false,
      id: '',
      ids: ''
    }
  },
  methods: {
    init(data) {
      this.visible = true
      this.id = data.id
      this.ids = data.id
      // console.log(data)
    },
    showModal() {
      this.visible = true
    },
    handleOk() {
      this.visible = false
      // this.$router.push({
      //   name: this.$hasSuppliers() ? 'SuppliersPaymentManage' : 'SysPaymentManage',
      //   params: {
      //     id: this.id
      //   }
      // })
      this.paymentCreate()
    },
    // 跳转供应商付款单，生成付款单
    createPayment() {
      this.paymentCreate()
      this.$router.push({
        name: !this.$hasOpeerate() ? 'SuppliersPaymentManage' : 'SysPaymentManage',
        params: {
          id: this.id
        }
      })
    },
    paymentCreate() {
      paymentCreate({ ids: [this.ids] }).then((res) => {
        if (res.code === '0') {
          console.log(res)
          this.$emit('search')
          this.$emit('getList')
        }
      })
    }
  }
}
</script>
<style lang='less' scoped>
div {
  span {
    color: blue;
  }
}
</style>
