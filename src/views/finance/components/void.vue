<template>
  <div>
    <a-modal v-model="visible" width="599px" title="发票作废" @ok="handleOk">
      <div class="content">
        <div class="nav">请将发票寄回开票方</div>
        <div class="table-page-search-wrapper-custom">
          <a-form-model
            layout="inline"
            :model="form"
            ref="ruleForm"
            v-bind="{
              labelCol: { span: 5 },
              wrapperCol: { span: 16 }
            }"
          >
            <a-row>
              <a-col :md="22" :sm="24">
                <a-form-model-item label="收件人：" prop="addressee">
                  <a-input :disabled="true" class="input" v-model="addressee" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="22" :sm="24">
                <a-form-model-item label="电话" prop="phone">
                  <a-input :disabled="true" class="input" v-model="phone" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :md="22" :sm="24">
                <a-form-model-item label="发票邮寄地址" prop="address">
                  <a-input :disabled="true" v-model="address" type="textarea" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row class="a-row_f">
              <a-col :md="22" :sm="24">
                <a-form-model-item label="作废原因" prop="desc">
                  <a-input v-model="form.desc" type="textarea" />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { voidas } from '@/api/invoice'
export default {
  data() {
    return {
      visible: false,
      form: {
        desc: '',
        id: ''
      },
      addressee: '黄女士',
      phone: '022-59859977',
      address: '天津自贸试验区（空港经济区）环河北路76号空港商务园西区W20四层'
    }
  },
  methods: {
    handleOk(e) {
      console.log(this.form.id, this.form.desc)
      this.voidas()
    },
    async voidas() {
      try {
        const data = await voidas({
          id: this.form.id,
          remark: this.form.desc
        })
        if (data.code === '0') {
          // this.datalistsupplierbusiness = data.data
          this.visible = false
          this.$router.go(0)
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  padding: 0 24px;
  .nav {
    text-align: center;
    background-color: rgb(255, 240, 229);
    color: #ff6b00;
    font-size: 16px;
    line-height: 48px;
    margin-bottom: 24px;
  }
  .a-row_f {
    margin-top: 19px;
  }
}
</style>
