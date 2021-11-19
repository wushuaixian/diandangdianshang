<template>
  <Temp :templateSource="2" :platformId="isPlatform" />
</template>

<script>
import Temp from '../purchasers/template.vue'
import { mapState } from 'vuex'
export default {
  components: { Temp },
  computed: {
    ...mapState({
      isPlatform: (state) => state.permission.isPlatform
    })
  }
}
</script>

<style>
</style>
