         <a-form-model-item label="类目名称" prop="time">
                <tree-select
                  :value="params.materialCategoryId"
                  :normalizer="normalizer"
                  :options="treeList"
                  multiple="multiple"
                  @select="handleSelect"
                ></tree-select>
              </a-form-model-item>



                data() {
    return {
      columns: [],
      params: {},
      treeList: [],
      normalizer(node) {
        return {
          id: node?.id,
          label: node?.name,
          children: node?.children || []
        }
      }
    }

},

对于非固定和多选模式，如果选中了分支节点及其所有后代，则 vue-treeselect 会将它们组合到值数组中的单个项目中，如以下示例所示。通过使用 valueConsistsOf 道具，您可以更改该行为。该道具有四个选项：

"ALL" - 选中的所有节点都将包含在 value 数组中
"BRANCH_PRIORITY"（默认）-如果选中了分支节点，则其所有后代将被排除在 value 数组之外
"LEAF_PRIORITY" - 如果选中了分支节点，则此节点本身及其分支后代将从 value 阵列中排除，但其叶后代将包括在内
"ALL_WITH_INDETERMINATE" -选中的任何节点将包括在 value 数组中，另外还有不确定的节点
