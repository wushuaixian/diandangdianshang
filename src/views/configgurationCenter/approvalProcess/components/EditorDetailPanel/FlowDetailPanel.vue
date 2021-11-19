<template>
  <detail-panel>
    <!-- vue 2.6.x -->
    <template v-slot="{ status }">
      <node-panel :status="status">
        <detail-form :type-code="typeCode" type="node" />
      </node-panel>
      <edge-panel :status="status">
        <detail-form :type-code="typeCode" type="edge" />
      </edge-panel>
      <group-panel :status="status">
        <detail-form :type-code="typeCode" type="group" />
      </group-panel>
      <multi-panel :status="status" />
      <canvas-panel :status="status" />
    </template>
  </detail-panel>
</template>

<script>
import { NodePanel, EdgePanel, GroupPanel, MultiPanel, CanvasPanel, DetailPanel } from 'vg-editor'
import DetailForm from './DetailForm'

export default {
  name: 'FlowDetailPanel',
  components: {
    NodePanel,
    EdgePanel,
    GroupPanel,
    MultiPanel,
    CanvasPanel,
    DetailPanel,
    DetailForm
  },
  props: {
    typeCode: {
      type: String,
      default: ''
    }
  }
}
</script>
