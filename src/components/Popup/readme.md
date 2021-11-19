<Popup
      :popupStatus="popupStatus"
      @close="closeExaminPopup"
      @submitExamine="submitExamine"
      :examineMode="examineMode"
    />

popupStatus: true false
@close 关闭弹窗方法
submitExamine 点击确认方法 value 1 为单审核 2为批量审核
examineMode：1 || 2
 submitExamine(value, status, auditReason) {
      let params = []
      if (value === 1) {
        params = [this.id]
      } else {
        for (let i = 0; i < this.idList.length; i++) {
          params.push(this.idList[i].id)
        }
      }
      submitExamine({ ids: params, auditStatus: status, auditReason }).then((res) => {
        if (res.success) {
          this.$message.success('提交成功')
          this.popupStatus = false
        } else {
          this.$message.error('提交失败')
        }
      })
    },