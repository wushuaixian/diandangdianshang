import T from 'ant-design-vue/es/table/Table'
import get from 'lodash.get'
import './index.less'
import { getColumns, getCustomPageList, getTbaleRenderItems } from '@/components/_util/table'
import Sortable from 'sortablejs'
import $ from 'jquery'
import cookie from '@/utils/cookie'
export default {
  name: 'STable',
  props: Object.assign({}, T.props, {
    name: {
      // 如果一个页面多个table 一定需要添加name
      type: String,
      required: true,
      default: ''
    },
    initData: {
      type: Object,
      default: null
    },
    rowKey: {
      type: [String, Function],
      default: 'key'
    },
    data: {
      type: Function
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizeOptions: {
      type: Array,
      default: null
    },
    showSizeChanger: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'default'
    },
    /**
     * alert: {
     *   show: true,
     *   clear: Function
     * }
     */
    alert: {
      type: [Object, Boolean],
      default: null
    },
    rowSelection: {
      type: Object,
      default: null
    },
    /** @Deprecated */
    showAlertInfo: {
      type: Boolean,
      default: false
    },
    showPagination: {
      type: String | Boolean,
      default: 'auto'
    },
    pagination: {
      type: Object,
      default: () => {}
    },
    /**
     * enable page URI mode
     *
     * e.g:
     * /users/1
     * /users/2
     * /users/3?queryParam=test
     * ...
     */
    pageURI: {
      type: Boolean,
      default: false
    },
    // 默认数据传入
    list: {
      type: Array,
      default: () => []
    },
    // 是否自定义传入数开启当前属性将不会走loadData，如果传入list必须为true
    customPage: {
      type: Boolean,
      default: false
    },
    isCanFilter: {
      type: Boolean,
      default: true
    },
    isShowIndex: {
      type: Boolean,
      default: true
    }
  }),

  data() {
    return {
      showCustomOption: false,
      needTotalList: [],
      selectedRows: [],
      selectedRowKeys: [],
      localLoading: false,
      localDataSource: [],
      localPagination: Object.assign({}, this.pagination),
      localColumns: [],
      selecteds: [],
      actionWidth: 100,
      headerSelections: ['index', 'action', 'setting'],
      isShowAction: false,
      isShowSetting: false,
      localHeadeColumns: [],
      tableKey: this.name || this.$route.name
    }
  },
  watch: {
    'localPagination.current'(val) {
      this.pageURI &&
        this.$router.push({
          ...this.$route,
          name: this.$route.name,
          params: Object.assign({}, this.$route.params, {
            pageNo: val
          })
        })
      // change pagination, reset total data
      this.needTotalList = this.initTotalList(this.columns)
      this.selectedRowKeys = []
      this.selectedRows = []
      this.setColumns()
    },
    list(val) {
      this.getCustomList(this.localPagination.current, this.localPagination.pageSize, val)
    },
    columns: {
      handler(val) {
        if (val && val.length > 0) {
          this.setColumns()
        }
      }
    },
    pageNum(val) {
      Object.assign(this.localPagination, {
        current: val
      })
    },
    pageSize(val) {
      Object.assign(this.localPagination, {
        pageSize: val
      })
    },
    showSizeChanger(val) {
      Object.assign(this.localPagination, {
        showSizeChanger: val
      })
    }
  },
  created() {
    this.setColumns()
    const pageNo = this.$route?.params?.pageNo
    const localPageNum = (this.pageURI && pageNo && parseInt(pageNo)) || this.pageNum
    this.localPagination =
      (['auto', true].includes(this.showPagination) &&
        Object.assign({}, this.localPagination, {
          current: localPageNum,
          pageSize: this.pageSize,
          showSizeChanger: this.showSizeChanger,
          pageSizeOptions: this.pageSizeOptions || ['5', '10', '30', '50', '100'],
          showTotal: total => `共 ${total} 条`,
          showQuickJumper: true,
          showLessItems: true
        })) ||
      false
    this.needTotalList = this.initTotalList(this.columns)

    if (!this.customPage) {
      this.loadData()
    } else {
      this.getCustomList(localPageNum, this.pageSize, this.list)
    }
  },
  // mounted() {
  //   console.log(this.$route.name)
  // },
  methods: {
    getCustomList(current, pageSize, list) {
      const total = list?.length
      this.localPagination =
        (this.showPagination &&
          Object.assign({}, this.localPagination, {
            current: current || (this.showPagination && this.localPagination.current) || this.pageNum, // 返回结果中的当前分页数
            total, // 返回结果中的总记录数
            showSizeChanger: this.showSizeChanger,
            pageSize: pageSize || this.localPagination.pageSize
          })) ||
        false
      this.localDataSource = getCustomPageList(current, pageSize, list)
    },
    setSort() {
      const el = $(this.$refs.tableColumns.$el).find('.ant-table-body > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          dataTransfer.setData('Text', '')
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
        },
        onEnd: evt => {
          const key = `list-table-key:${this.tableKey}`
          const oldIndex = evt.oldIndex
          const newIndex = evt.newIndex + 1 // 序号默认第一位
          const targetRow = { ...this.localColumns.filter(x => !this.headerSelections.includes(x.key))[oldIndex] }
          const currentRow = { ...this.localColumns[newIndex] }
          const delteIndex = this.localColumns.findIndex(x => x.key === targetRow.key)
          this.localColumns.splice(delteIndex, 1)
          this.localColumns.splice(newIndex, 0, targetRow)
          if (currentRow.fixed) {
            const rows = [targetRow, currentRow].map(x => x.key || x.title)
            const [target, current] = this.localColumns.filter(x => rows.includes(x.title) || rows.includes(x.key))
            target.fixed = currentRow?.fixed
            current.fixed = null
          }
          cookie.setItem(key, JSON.stringify(this.localColumns))
        }
      })
    },
    setColumns() {
      const {
        tableKey,
        columns,
        headerSelections,
        isCanFilter,
        isShowIndex,
        localPagination: { current = 1, pageSize = 10 }
      } = this
      if (columns?.length <= 0) return
      const key = `list-table:${tableKey}`
      const headerKey = `list-table-key:${tableKey}`
      this.localColumns = getColumns(key, columns, current, pageSize, isCanFilter, isShowIndex)
      const action = this.localColumns.find(x => x.key === 'action' || x.title === '操作')
      const setting = this.localColumns.find(x => x.key === 'setting')
      if (action) {
        this.actionWidth = action?.width
        this.isShowAction = true
      } else {
        this.isShowAction = false
      }
      this.isShowSetting = !!setting
      this.localHeadeColumns = [...this.localColumns]
      if (cookie.getItem(headerKey)) {
        this.localColumns = getTbaleRenderItems(JSON.parse(cookie.getItem(headerKey)), this.localColumns)
        const columnsKey = this.localColumns.map(x => x.key)
        this.selecteds = this.localHeadeColumns
          .filter(x => !headerSelections.includes(x.key) && columnsKey.includes(x.key))
          .map(x => x.key)
      } else {
        this.selecteds = this.localColumns.filter(x => !headerSelections.includes(x.key)).map(x => x.key)
      }
    },
    /**
     * 表格重新加载方法
     * 如果参数为 true, 则强制刷新到第一页
     * @param Boolean bool
     */
    refresh(bool = false) {
      bool &&
        (this.localPagination = Object.assign(
          {},
          {
            current: 1,
            pageSize: this.pageSize
          }
        ))
      this.loadData()
    },
    /**
     * 加载数据方法
     * @param {Object} pagination 分页选项器
     * @param {Object} filters 过滤条件
     * @param {Object} sorter 排序条件
     */
    loadData(pagination, filters, sorter) {
      this.localLoading = true
      const parameter = Object.assign(
        {
          currentPage:
            (pagination && pagination.current) || (this.showPagination && this.localPagination.current) || this.pageNum,
          itemsPerPage:
            (pagination && pagination.pageSize) ||
            (this.showPagination && this.localPagination.pageSize) ||
            this.pageSize
        },
        (sorter &&
          sorter.field && {
            sortField: sorter.field
          }) ||
          {},
        (sorter &&
          sorter.order && {
            sortOrder: sorter.order
          }) ||
          {},
        {
          ...filters
        }
      )
      const { initData } = this
      const result = this.data({ ...parameter, ...initData })

      // 对接自己的通用数据接口需要修改下方代码中的 r.pageNo, r.totalCount, r.data
      // eslint-disable-next-line
      if ((typeof result === 'object' || typeof result === 'function') && typeof result.then === 'function') {
        result
          .then(r => {
            let { listObj, total } = r.data
            if (Array.isArray(r.data)) {
              listObj = r.data
              total = r.total
            }
            this.localPagination =
              (this.showPagination &&
                Object.assign({}, this.localPagination, {
                  current:
                    (pagination && pagination.current) ||
                    (this.showPagination && this.localPagination.current) ||
                    this.pageNum, // 返回结果中的当前分页数
                  total, // 返回结果中的总记录数
                  showSizeChanger: this.showSizeChanger,
                  pageSize: (pagination && pagination.pageSize) || this.localPagination.pageSize
                })) ||
              false
            // 为防止删除数据后导致页面当前页面数据长度为 0 ,自动翻页到上一页
            if (listObj?.length === 0 && this.showPagination && this.localPagination.current > 1) {
              this.localPagination.current--
              this.loadData()
              return
            }

            // 这里用于判断接口是否有返回 r.totalCount 且 this.showPagination = true 且 pageNo 和 pageSize 存在 且 totalCount 小于等于 pageNo * pageSize 的大小
            // 当情况满足时，表示数据不满足分页大小，关闭 table 分页功能
            try {
              if (
                ['auto', true].includes(this.showPagination) &&
                r.totalCount <= r.pageNo * this.localPagination.pageSize
              ) {
                this.localPagination.hideOnSinglePage = true
              }
            } catch (e) {
              this.localPagination = false
            }
            this.localDataSource = !['auto', true].includes(this.showPagination) ? r.data : listObj || [] // 返回结果中的数组数据
            this.localLoading = false
          })
          .finally(() => {
            this.localLoading = false
          })
      }
    },
    initTotalList(columns) {
      const totalList = []
      columns &&
        columns instanceof Array &&
        columns.forEach(column => {
          if (column.needTotal) {
            totalList.push({
              ...column,
              total: 0
            })
          }
        })
      return totalList
    },
    /**
     * 用于更新已选中的列表数据 total 统计
     * @param selectedRowKeys
     * @param selectedRows
     */
    updateSelect(selectedRowKeys, selectedRows) {
      this.selectedRows = selectedRows
      this.selectedRowKeys = selectedRowKeys
      const list = this.needTotalList
      this.needTotalList = list.map(item => {
        return {
          ...item,
          total: selectedRows.reduce((sum, val) => {
            const total = sum + parseInt(get(val, item.dataIndex))
            return isNaN(total) ? 0 : total
          }, 0)
        }
      })
    },
    /**
     * 清空 table 已选中项
     */
    clearSelected() {
      if (this.rowSelection) {
        this.rowSelection.onChange([], [])
        this.updateSelect([], [])
      }
    },
    /**
     * 处理交给 table 使用者去处理 clear 事件时，内部选中统计同时调用
     * @param callback
     * @returns {*}
     */
    renderClear(callback) {
      if (this.selectedRowKeys.length <= 0) return null
      return (
        <a
          style="margin-left: 24px"
          onClick={() => {
            callback()
            this.clearSelected()
          }}
        >
          清空
        </a>
      )
    },
    renderAlert() {
      // 绘制统计列数据
      const needTotalItems = this.needTotalList.map(item => {
        return (
          <span style="margin-right: 12px">
            {item.title}总计{' '}
            <a style="font-weight: 600">{!item.customRender ? item.total : item.customRender(item.total)}</a>
          </span>
        )
      })

      // 绘制 清空 按钮
      const clearItem =
        typeof this.alert.clear === 'boolean' && this.alert.clear
          ? this.renderClear(this.clearSelected)
          : this.alert !== null && typeof this.alert.clear === 'function'
          ? this.renderClear(this.alert.clear)
          : null

      // 绘制 alert 组件
      return (
        <a-alert showIcon={true} style="margin-bottom: 16px">
          <template slot="message">
            <span style="margin-right: 12px">
              已选择: <a style="font-weight: 600">{this.selectedRows.length}</a>
            </span>
            {needTotalItems}
            {clearItem}
          </template>
        </a-alert>
      )
    },
    renderHeaderColumnsOption() {
      const headerKey = `list-table-key:${this.tableKey}`
      const { headerSelections } = this
      const columnsNameList = this.localHeadeColumns
        .filter(x => !headerSelections.includes(x.key))
        .map((x, i) => {
          return {
            title: x.title || x?.headerTitle,
            key: x.key
          }
        })
      const onChange = (selectedRowKeys, selectedRows) => {
        const storageColumns = this.localHeadeColumns
          .map(x => {
            const show =
              selectedRowKeys.includes(x.key) || headerSelections.includes(x.key)
                ? Reflect.has(x, 'show')
                  ? x.show
                  : true
                : !x.show
            return {
              ...x,
              show
            }
          })
          .filter(x => x.show)
        this.localColumns = getTbaleRenderItems(storageColumns, this.localHeadeColumns)
        cookie.setItem(headerKey, JSON.stringify(this.localColumns))
        this.selecteds = selectedRowKeys
      }
      return (
        <a-table
          ref="tableColumns"
          class="custom-columns-name-table"
          rowKey="key"
          columns={[{ title: '栏目', dataIndex: 'title' }]}
          pagination={false}
          data-source={columnsNameList}
          rowSelection={{ onChange, selectedRowKeys: this.selecteds }}
        ></a-table>
      )
    },
    handleShowColumnsOption(val) {
      if (val) {
        this.$nextTick(() => {
          this.setSort()
        })
      }
    },
    handlePageChange(pagination, filters, sorter) {
      this.$emit('change', { pagination, filters, sorter })
      if (!this.customPage) {
        this.loadData(pagination, filters, sorter)
      } else {
        const { current, pageSize } = pagination
        this.getCustomList(current, pageSize, this.list)
      }
    }
  },
  render() {
    const { isShowAction, localLoading, isShowSetting, isCanFilter } = this
    const props = {}
    const localKeys = Object.keys(this.$data)
    const showAlert =
      (typeof this.alert === 'object' &&
        this.alert !== null &&
        this.alert.show &&
        typeof this.rowSelection.selectedRowKeys !== 'undefined') ||
      this.alert
    Object.keys(T.props).forEach(k => {
      const localKey = `local${k.substring(0, 1).toUpperCase()}${k.substring(1)}`
      if (localKeys.includes(localKey)) {
        props[k] = this[localKey]
        return props[k]
      }
      if (k === 'rowSelection') {
        if (showAlert && this.rowSelection) {
          // 如果需要使用alert，则重新绑定 rowSelection 事件
          props[k] = {
            ...this.rowSelection,
            selectedRows: this.selectedRows,
            selectedRowKeys: this.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              this.updateSelect(selectedRowKeys, selectedRows)
              typeof this[k].onChange !== 'undefined' && this[k].onChange(selectedRowKeys, selectedRows)
            }
          }
          return props[k]
        } else if (!this.rowSelection) {
          // 如果没打算开启 rowSelection 则清空默认的选择项
          props[k] = null
          return props[k]
        }
      }
      this[k] && (props[k] = this[k])
      return props[k]
    })
    const table = (
      <a-table
        columns={this.localColumns}
        {...{ props, scopedSlots: { ...this.$scopedSlots } }}
        onChange={this.handlePageChange}
        onExpand={(expanded, record) => {
          this.$emit('expand', expanded, record)
        }}
      >
        {/* <template slot="customAction">操作</template> */}
        {Object.keys(this.$slots).map(name => (
          <template slot={name}>{this.$slots[name]}</template>
        ))}
      </a-table>
    )
    const popover = (
      <a-popover
        onVisibleChange={this.handleShowColumnsOption}
        class="custom-action-popover"
        value={this.showCustomOption}
        trigger="click"
      >
        <template slot="content">{this.renderHeaderColumnsOption()}</template>
        <a-icon onClick={() => (this.showCustomOption = true)} type="setting" class="custom-option" />
      </a-popover>
    )
    return (
      <div class="s-table table-wrapper">
        {showAlert ? this.renderAlert() : null}
        <div class="table">
          {table}
          {isShowAction && !localLoading ? (
            <div
              class="action"
              style={{
                right: `${this.actionWidth - 52 - 16}px`
              }}
            >
              <span>操作</span>
              {isCanFilter ? popover : null}
            </div>
          ) : null}
          {isShowSetting && !localLoading ? (
            <div
              class="action"
              style={{
                right: `${this.actionWidth - 52 - 16}px`
              }}
            >
              {isCanFilter ? popover : null}
            </div>
          ) : null}
        </div>
      </div>
    )
  }
}
