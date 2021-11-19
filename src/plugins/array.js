// eslint-disable-next-line no-extend-native
Array.prototype.deleteItem = function(val) {
  const index = this.findIndex(x => x.id === val)
  if (index > -1) {
    this.splice(index, 1)
  }
}

// eslint-disable-next-line no-extend-native
Array.prototype.deleteItemAll = function(ids) {
  ids.forEach(x => {
    const index = this.findIndex(c => c?.id === x)
    if (index > -1) {
      this.splice(index, 1)
    }
  })
}
