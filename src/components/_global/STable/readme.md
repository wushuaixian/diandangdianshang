、、、 基于 a-table 二次封装的一个 table
、、 原生 a-table 可使用的属性都可以使用
columns = {
slots: { title: 'customdeliveryTime' },
headerTitle: '测试' // 如果自定义 slots 需要传入 以供小齿轮显示名称
}

、、、
s-table :data 需要一个回调方法此方法必须是 promise
<s-table :data="getList"> </s-table>

async getList(page){
// page 表格自带的分页传出
return request({...page})
}

、、、
:list 默认数据需要传入:customPage="true" 会自带假分页
<s-table :list="list" :customPage="true"  > </s-table>

、、、
:isCanFilter="true" 默认为 true 是否开启小齿轮，传入 false 则不显示齿轮
