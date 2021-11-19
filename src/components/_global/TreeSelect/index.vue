<template>
  <div class="tree-select">
    <vue-tree-select
      :value="value"
      v-bind="getAttrs"
      @input="updateValue"
      :append-to-body="true"
      :class="{ 'collaps-tags': collapseTags }"
      @open="handleOpen"
      v-on="$listeners"
      :z-index="1000"
    />
  </div>
</template>

<script>
import $ from 'jquery'
// import the component
import VueTreeSelect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import tree2arr from '@/components/_util/tree'
export default {
  name: 'TreeSelect',
  components: {
    VueTreeSelect
  },
  props: {
    value: {
      type: [Array, String, Number],
      default: null
    },
    selected: {
      type: Object,
      default: () => {}
    },
    collapseTags: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    getAttrs() {
      let attrs = this.$attrs
      const defaultOptions = {
        placeholder: '请选择...'
      }

      attrs = { ...defaultOptions, ...attrs }

      return attrs
    }
  },
  methods: {
    handleOpen() {
      setTimeout(() => {
        $('.vue-treeselect__multi-value').scrollLeft(0)
      }, 200)
      this.$emit('open')
    },
    updateValue(newVal) {
      const { id, children } = this.$attrs.normalizer || { id: 'id', label: 'label', children: 'children' }
      const options = this.$attrs.options
      const arr = tree2arr(options, id, children)

      if (this.$attrs.multiple) {
        this.$emit(
          'update:selected',
          newVal.map((idVal) => {
            return arr.find((item) => item[id] === idVal)
          })
        )
      } else {
        this.$emit(
          'update:selected',
          arr.find((item) => item[id] === newVal)
        )
      }
      this.$emit('input', newVal)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
