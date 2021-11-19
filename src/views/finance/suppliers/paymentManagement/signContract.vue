<template>
  <a-modal
    v-model="visible"
    :dialog-style="{ top: '20px' }"
    :footer="null"
    width="80%"
    title="通联协议签订"
    @cancel="close"
  >
    <iframe :src="url" frameborder="0"></iframe>
  </a-modal>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean
    },
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="less" scoped>
iframe {
  width: 100%;
  height: 600px;
}
</style>
