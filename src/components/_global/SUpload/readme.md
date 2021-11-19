、、、 多图上传
<s-upload v-model="form.complaintUrls" :limit="3" :multiple="true" list-type="picture-card">

<div class="upload" v-if="form.complaintUrls.length < 3">
<div class="plus">
<img :src="require('@/assets/images/enterprise/plus.png')" alt="" />
</div>
<div class="text">上传图片</div>
</div>
</s-upload>
、、、 单图上传

  <s-upload v-model="form.complaintUrls" list-type="picture-card">
              <div class="upload" v-if="!form.complaintUrls">
                <div class="plus">
                  <img :src="require('@/assets/images/enterprise/plus.png')" alt="" />
                </div>
                <div class="text">上传图片</div>
              </div>
            </s-upload>
、、、事件
@change   url
@aschange  data对象
