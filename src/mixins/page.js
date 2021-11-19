export default {
  data() {
    return {
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showLessItems: true,
        pageSizeOptions: ['5', '10', '30', '50', '100'],
        showTotal: total => `共 ${total} 条`,
        onChange: page => {
          this.pagination.current = page
        },
        onShowSizeChange: (page, size) => {
          this.pagination.current = 1
          this.pagination.pageSize = size
        }
      }
    }
  }
}
