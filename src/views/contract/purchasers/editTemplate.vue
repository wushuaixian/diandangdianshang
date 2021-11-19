<template>
  <add-template :platformId="isPlatform" />
</template>

<script>
import { mapState } from 'vuex'
import AddTemplate from './addTemplate/index.vue'

export default {
  components: { AddTemplate },
  computed: {
    ...mapState({
      isPlatform: (state) => state.permission.isPlatform
    })
  }
}
</script>
