<template>
  <div>
    <div class="tabTilte">
      {{ titleName }}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    titleName: {
      type: String,
      default: '信息'
    }
  }
}
</script>

<style lang="less" scoped>
.tabTilte {
  padding: 10px 0;
  border-bottom: 1px solid #e5e5e5;
  font-weight: 600;
  color: #262626;
}
.tabTilte::before {
  content: '';
  width: 4px;
  height: 16px;
  display: inline-block;
  background: #ff6b00;
  border-radius: 2px;
  margin-right: 10px;
  position: relative;
  top: 2px;
}
</style>
