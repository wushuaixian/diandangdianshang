<template>
  <div class="category-leader">
    <div class="form-item">
      <span class="form-item-lbl">姓名:</span>
      <div class="form-item-input"><span>{{ info.identityCardName }}</span></div>
    </div>
    <div class="form-item">
      <span class="form-item-lbl">账号:</span>
      <div class="form-item-input"><span>{{ info.username }}</span></div>
    </div>
    <div class="form-item">
      <span class="form-item-lbl">手机号:</span>
      <div class="form-item-input"><span>{{ info.mobile }}</span></div>
    </div>
    <div class="form-item operation-btn">
      <a-button type="primary" @click="handleEdit">编辑负责人</a-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CategoryLeader',
    props: {
      info: {
        type: Object,
        require: true,
        default: () => {
          return {}
        }
      }
    },
    methods: {
      handleEdit() {
        this.$emit('edit', {})
      }
    }
  }
</script>

<style lang="less" scoped>
.category-leader{
  margin-top: 24px;
  height: 32px;
  display: flex;
  flex-direction: row;
  .form-item{
    flex:1;
    .form-item-lbl{
      width:65px;
      text-align: right;
      color:#333333;
      font-size: 14px;
      display: inline-block;
      height: 32px;
      font-weight: 400;
      line-height: 32px;
      padding-right: 10px;
    }
    .form-item-input{
      display: inline-block;
      width:120px;
      height: 32px;
      background-color:#F5F5F5;
      border:1px solid #D9D9D9;
      border-radius: 2px;
      line-height: 32px;
      padding: 0 8px;
      span{
        font-weight: 400;
        font-size: 14px;
        color: #666666;
      }
    }
  }
  .operation-btn{
    text-align: right;
  }
}
</style>
