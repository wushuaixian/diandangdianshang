## choose-roles

选择角色

### 1. 普通选择

:::demo 普通选择

```html
<template>
  <div>
    <ody-roles-choose v-model="value" />
    {{ value }}
  </div>
</template>
<script>
  export default {
    data() {
      return {
        value: []
      }
    }
  }
</script>
```

:::

### 2. 选中 item

:::demo 普通选择

```html
<template>
  <div>
    <ody-roles-choose :selected.sync="selected" />
    {{ selected }}
  </div>
</template>
<script>
  export default {
    data() {
      return {
        selected: []
      }
    }
  }
</script>
```

:::

### Attributes

| 参数       | 说明           | 类型     | 必填 | 可选值 | 默认值 |
| ---------- | -------------- | -------- | ---- | ------ | ------ |
| v-model    | 选中数据       | Object   | true | —      | []     |
| load       | 展示数据方法   | function | true | —      | []     |
| list       | 展示数据       | Array    | true | —      | []     |
| brandIndex | 面包屑列表索引 | String   | true | —      | []     |

### Events

| 事件名称   | 说明 | 回调参数 |
| ---------- | ---- | -------- |
| loadSearch | 查询 | --       |
| add        | 添加 | —        |
| delete     | 删除 | —        |
