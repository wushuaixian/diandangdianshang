<template>
  <command :name="command">
    <icon :type="iconType" :isToolBar="true" />
  </command>
</template>

<script>
import { Command } from 'vg-editor'
import Icon from '../Icon'

export default {
  name: 'ToolbarButton',

  components: {
    Command,
    Icon
  },
  // 'command', 'icon', 'text'
  props: {
    command: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    text: {
      type: String,
      default: null
    }
  },

  computed: {
    iconType() {
      return `icon-${this.icon || this.command}`
    }
  }
}
</script>
