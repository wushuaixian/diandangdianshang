<template>
  <item-panel>
    <item
      :model="{
        color: '#FA8C16',
        label: '开始',
        ref: {
          type: 0
        }
      }"
      type="node"
      size="72*72"
      shape="flow-circle"
      class="demo-chart__sidebar__item"
      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIiIGhlaWdodD0iNzIiIHZpZXdCb3g9IjAgMCA3MiA3MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgc3Ryb2tlPSIjRkZDMDY5IiBmaWxsPSIjRkZGM0VBIiBjeD0iMzYiIGN5PSIzNiIgcj0iMzUiLz48dGV4dCBmb250LWZhbWlseT0iQWxpYmFiYVB1SHVpVGlNLCBBbGliYWJhIFB1SHVpVGkiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSI0MDAiIGZpbGw9IiMzMzMiPjx0c3BhbiB4PSIyMiIgeT0iNDIiPuW8gOWnizwvdHNwYW4+PC90ZXh0PjwvZz48L3N2Zz4="
    />
    <item
      :model="{
        color: '#1890FF',
        label: '审批',
        ref: {
          type: 2,
          appdType: 1,
          appdActorType: 1,
          appdActorSubtype: 1,
          actorList: []
        }
      }"
      type="node"
      size="80*48"
      shape="flow-rect"
      class="demo-chart__sidebar__item"
      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA4MCA1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxyZWN0IHN0cm9rZT0iIzE4OTBGRiIgZmlsbD0iI0U5RjhGRiIgeD0iLjUiIHk9Ii41IiB3aWR0aD0iNzkiIGhlaWdodD0iNDkiIHJ4PSI0Ii8+PHRleHQgZm9udC1mYW1pbHk9IlBpbmdGYW5nU0MtUmVndWxhciwgUGluZ0ZhbmcgU0MiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzMzMiPjx0c3BhbiB4PSIyNiIgeT0iMzEiPuWuoeaJuTwvdHNwYW4+PC90ZXh0PjwvZz48L3N2Zz4="
    />
    <item
      :model="{
        color: '#13C2C2',
        label: '条件',
        ref: {
          type: 1
        }
      }"
      type="node"
      size="80*72"
      shape="flow-rhombus"
      class="demo-chart__sidebar__item"
      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODIiIGhlaWdodD0iODIiIHZpZXdCb3g9IjAgMCA4MiA4MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik00My4xNzEgNS45NThhMy41IDMuNSAwIDAgMC00Ljc1NyAwTDMuNjcgMzguMTQ0YTMuNSAzLjUgMCAwIDAgLjA3IDUuMmwzNC43NDYgMzAuNDc4YTMuNSAzLjUgMCAwIDAgNC42MTYgMGwzNC43NDYtMzAuNDc5YTMuNSAzLjUgMCAwIDAgLjA3LTUuMTk5TDQzLjE3MSA1Ljk1OHoiIHN0cm9rZT0iIzVDRENENCIgZmlsbD0iI0U4RkZGQiIvPjx0ZXh0IGZvbnQtZmFtaWx5PSJQaW5nRmFuZ1NDLVJlZ3VsYXIsIFBpbmdGYW5nIFNDIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMzMzIj48dHNwYW4geD0iMjciIHk9IjQ3Ij7mnaHku7Y8L3RzcGFuPjwvdGV4dD48L2c+PC9zdmc+"
    />
    <item
      :model="{
        color: '#13C2C2',
        label: '条件',
        ref: {
          type: 1
        }
      }"
      type="edge"
      size="80*72"
      class="demo-chart__sidebar__item"
    />
    <item
      :model="{
        color: '#722ED1',
        label: '结束',
        ref: {
          type: 3
        }
      }"
      type="node"
      size="80*48"
      shape="flow-capsule"
      class="demo-chart__sidebar__item"
      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA4MCA0OCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxyZWN0IHN0cm9rZT0iI0I0N0ZFQyIgZmlsbD0iI0ZBRjJGRiIgeD0iLjUiIHk9Ii41IiB3aWR0aD0iNzkiIGhlaWdodD0iNDciIHJ4PSIyMy41Ii8+PHRleHQgZm9udC1mYW1pbHk9IkFsaWJhYmFQdUh1aVRpTSwgQWxpYmFiYSBQdUh1aVRpIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iNDAwIiBmaWxsPSIjMzMzIj48dHNwYW4geD0iMjYiIHk9IjMwIj7nu5PmnZ88L3RzcGFuPjwvdGV4dD48L2c+PC9zdmc+"
    />
  </item-panel>
</template>

<script>
import { ItemPanel, Item } from 'vg-editor'

export default {
  name: 'FlowItemPanel',
  components: { ItemPanel, Item }
}
</script>
<style lang="less" scoped>
.demo-chart__sidebar__item {
  margin-top: 24px;
}
.demo-chart__sidebar__item:nth-child(1) {
  margin-top: 27px;
}
</style>
