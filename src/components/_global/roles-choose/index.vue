<template>
  <div class="cp-roles-choose">
    <section class="content">
      <div :style="{ height: height + 'px' }" class="content-panel">
        <span class="content-title">{{ $t(sourceLabel) }}</span>
        <div class="content-main">
          <a-input v-model="sourceFilterText" placeholder="请输入搜索内容" />
          <a-icon type="search" @click="handleSearch" />
          <div v-show="showAll" ref="treeAll" :props="props" class="content-select-list">
            <div>
              <span v-for="(item, index) in list" :key="index">
                <span v-if="index > 0"> > </span>
                <a v-if="list.length != index + 1" class="content-select-list-link" @click="brandClick(index)">
                  {{ item.name }}
                </a>
                <span v-if="list.length === index + 1">{{ item.name }}</span>
              </span>
            </div>
            <a-checkbox
              :indeterminate="isIndeterminate"
              :checked="getCheckAll"
              :disabled="getDisabled"
              class="check-all"
              @change="handleCheckAllChange"
            >
              全选
            </a-checkbox>
            <ul
              v-infinite-scroll="load"
              :infinite-scroll-disabled="list[brandIndex].infiniteScrollDisabled"
              class="infinite-list"
              style="overflow: auto"
            >
              <div v-for="(item, index) in getListWidthChecked" :key="index" class="department-all">
                <a-checkbox
                  v-show="isShowCheckbox(item)"
                  v-model="item.checked"
                  :checked="item.checked"
                  type="checkbox"
                  @change="handleSourceCheck(item)"
                />
                <img v-show="isShowCategory(item)" src="./images/department.png" class="img" width="18px" />
                <span>{{ item.actorName }}</span>
                <img
                  v-show="isShowCategory(item)"
                  src="./images/next-department.png"
                  class="next-department"
                  width="18px"
                  @click="categoryed(item)"
                />
              </div>
            </ul>
          </div>
          <div v-show="!showAll" class="department-search">
            <div v-for="(item, index) in getSearchDataWidthChecked" :key="index" class="department-search-item">
              <a-checkbox
                v-if="isShowCheckbox(item)"
                v-model="item.checked"
                :checked="item.checked"
                type="checkbox"
                @change="handleSourceCheck(item)"
              />
              <img v-show="isShowCategory(item)" src="./images/department.png" class="img" width="18px" />
              <span>{{ item.actorName }}</span>
              <img
                v-show="isShowCategory(item)"
                src="./images/next-department.png"
                class="next-department"
                width="18px"
                @click="searchCategoryed(item)"
              />
            </div>
          </div>
          <slot name="left-footer" />
        </div>
      </div>
      <div :style="{ height: height + 'px', marginLeft: '30px' }" class="content-panel">
        <span class="content-title">{{ $t(targetLabel) }}</span>
        <div class="content-main">
          <div v-for="(tag, tagIndex) in checkedNodes" :key="tagIndex" class="organization-tree__tag-item">
            <a-tag closable @close="handleClose(tag)">
              {{ tag.actorName }}
            </a-tag>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'RolesChoose',
  props: {
    valueKey: {
      type: String,
      default: 'id'
    },
    lableKey: {
      type: String,
      default: 'name'
    },
    value: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: ''
    },
    props: {
      type: Object,
      default: null
    },
    height: {
      type: Number,
      default: 540
    },
    sourceLabel: {
      type: String,
      default: '来源'
    },
    targetLabel: {
      type: String,
      default: '目标'
    },
    load: {
      type: Function,
      default: () => {},
      desc: 'loadMore加载数据'
    },
    checkbox: {
      type: Boolean,
      default: true
    },
    list: {
      type: Array,
      default: () => []
    },
    brandIndex: {
      type: [String, Number],
      default: ''
    },
    showCheckboxKey: {
      type: String,
      default: 'type'
    },
    showCheckboxVal: {
      type: String,
      default: ''
    },
    showCategoryKey: {
      type: String,
      default: 'type'
    },
    showCategoryVal: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      checkAll: false,
      showAll: true, // 默认显示展示树
      sourceFilterText: '', // 左侧搜索关键字
      targetFilterText: '', // 右侧搜索关键字
      checkedNodes: [],
      searchAllCodeList: [],
      searchData: [],
      isIndeterminate: false
    }
  },
  computed: {
    getListWidthChecked() {
      const checkedKeys = this.checkedNodes.map((x) => x[this.valueKey])
      const { res } = this.list.length === 0 ? { res: [] } : this.list[this.brandIndex]
      return res.map((x) => {
        this.$set(x, 'checked', checkedKeys.includes(x[this.valueKey]))
        return x
      })
    },
    getCheckAll() {
      const checkedKeys = this.checkedNodes.map((x) => x[this.valueKey])
      const list = this.list[this.brandIndex].res.filter((x) => {
        console.log(this.showCheckboxVal)
        if ((x.type && x.type !== 'node') || this.showCheckboxVal === 'true') {
          return x
        } else if (!x.type) {
          return x
        }
      })
      console.log(list)
      const res = list.length === 0 ? [] : list
      const checkList = res.map((x) => {
        return checkedKeys.includes(x[this.valueKey])
      })
      if (checkList.includes(false) || checkList.length === 0) {
        return false
      } else {
        return true
      }
    },
    getDisabled() {
      const list = this.list[this.brandIndex].res.filter((x) => {
        if ((x.type && x.type !== 'node') || this.showCheckboxVal === 'true') {
          return x
        }
        // else if (!x.type) {
        //   return x
        // }
      })
      if (list.length === 0) {
        return true
      } else {
        return false
      }
    },
    getSearchDataWidthChecked() {
      const checkedKeys = this.checkedNodes.map((x) => x[this.valueKey])
      const res = this.searchData.length === 0 ? [] : this.searchData
      return res.map((x) => {
        this.$set(x, 'checked', checkedKeys.includes(x[this.valueKey]))
        return x
      })
    }
  },
  watch: {},

  mounted() {
    this.showAll = true
    this.checkedNodes = this.value
  },

  methods: {
    isShowCheckbox(item) {
      console.log(item)
      console.log(item[this.showCategoryKey] ? item[this.showCategoryKey] === this.showCheckboxVal : false)
      return item[this.showCategoryKey] ? item[this.showCategoryKey] === this.showCheckboxVal : false
      // return item.showCheckboxKey === 'employee'
      // true : item[this.showCheckboxKey] === this.showCheckboxVal
    },
    isShowCategory(item) {
      // return !item[this.showCategoryKey] ? true : item[this.showCategoryKey] === this.showCategoryVal
      return !item[this.showCategoryKey] ? true : item[this.showCategoryKey] === this.showCategoryVal
      // return !(item.showCheckboxKey === 'employee')
    },
    handleSourceCheck(e) {
      this.$set(e, 'checked', !!e.checked)
      if (!e.checked) {
        this.handleClose(e)
      } else {
        this.checkedNodes.push(e)
      }
      this.$emit('input', this.checkedNodes)
    },
    categoryed(param) {
      this.$emit('categoryed', param)
    },
    async searchCategoryed(param) {
      this.$emit('loadSearchCategoryed', { id: param.actorId }, (val) => {
        this.showAll = false
        this.searchAllCodeList = val.map((x) => x[this.valueKey])
        this.searchData = val
      })
    },
    brandClick(param) {
      this.$emit('brandClick', param)
    },
    handleSearchCheck(e) {
      const noSearchCheckedNodes = this.checkedNodes.filter((x) => !this.searchAllCodeList.includes(x.actorId))
      this.checkedNodes = [...noSearchCheckedNodes, ...Array.from(e)]
      this.$emit('input', this.checkedNodes)
    },
    async handleSearch() {
      if (!this.sourceFilterText) {
        this.showAll = true
        return false
      }
      this.$emit('loadSearch', { sourceFilterText: this.sourceFilterText }, (val) => {
        this.showAll = false
        this.searchAllCodeList = val.map((x) => x[this.valueKey])
        this.searchData = val
      })
    },
    handleClose(tag, tagIndex) {
      const checkedKeysIndex = this.checkedNodes.findIndex((x) => x[this.valueKey] === tag[this.valueKey])
      this.checkedNodes.splice(checkedKeysIndex, 1)
      this.$emit('input', this.checkedNodes)
    },
    handleCheckAllChange(e) {
      this.isIndeterminate = false
      const list = this.list[this.brandIndex].res.filter((x) => {
        if ((x.type && x.type !== 'node') || this.showCheckboxVal === 'true') {
          x.checked = e?.target?.checked
          this.$set(x, 'checked', e?.target?.checked)
          return x
        } else if (!x.type) {
          x.checked = e?.target?.checked
          this.$set(x, 'checked', e?.target?.checked)
          return x
        }
      })

      const ids = list.map((x) => x.actorId)
      const checkeds = list.filter((x) => x.checked)
      const notCurrentPageCheckedNodes = this.checkedNodes.filter((x) => !ids.includes(x.actorId))
      this.checkedNodes = [...notCurrentPageCheckedNodes, ...checkeds]
      this.$emit('input', this.checkedNodes)
    }
  }
}
</script>

<style lang="less" scoped>
.cp-roles-choose {
  .content-title {
    padding: 0 15px;
    margin: 0;
    height: 40px;
    line-height: 40px;
    color: #303133;
    font-size: 16px;
    position: relative;
    .right {
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      font-weight: 400;
    }
  }
  .content-main {
    box-sizing: border-box;
    height: 100%;
    padding: 0px 20px;
    .organization-tree__tag-item {
      margin-top: 10px;
    }
    .content-select-list {
      height: calc(100% - 90px);
      .content-select-list-link {
        color: #1890ff;
      }
      .check-all {
        margin-top: 10px;
      }
      .infinite-list {
        height: calc(100% - 47px);
        padding: 0px;
        margin: 0px;
        .department-all {
          padding: 10px 0px;
          display: flex;
          align-items: center;
          .img,
          span {
            margin-left: 10px;
          }
          .next-department {
            margin-left: auto;
            margin-right: 15px;
          }
        }
      }
    }
    .department-search {
      display: block;
      height: calc(100% - 90px);
      overflow-y: auto;
      .department-search-item {
        display: flex;
        align-items: center;
        padding: 10px 0px;
        .img,
        span {
          margin-left: 10px;
        }
        .next-department {
          margin-left: auto;
          margin-right: 15px;
        }
      }
    }
  }
  .content-panel {
    border: 1px solid #ebeef5;
    background: #fff;
    width: 40%;
    height: 100%;
    box-sizing: border-box;
    border-radius: 5px;
    vertical-align: middle;
    display: inline-block;
    height: 100%;
  }
  .el-icon-search {
    position: relative;
    left: 260px;
    top: -24px;
  }
  .el-tree-node {
    .is-leaf + .el-checkbox .el-checkbox__inner {
      display: none;
    }
    .el-checkbox .el-checkbox__inner {
      display: inline-block;
    }
  }
}
</style>
