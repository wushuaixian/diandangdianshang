<template>
  <div class="tinymce-editor">
    <Editor :id="id" v-model="myValue" :init="init" :disabled="disabled" @onClick="onClick"> </Editor>
  </div>
</template>
<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'
import 'tinymce/plugins/image' // 插入上传图片插件
import 'tinymce/plugins/media' // 插入视频插件
import 'tinymce/plugins/table' // 插入表格插件
import 'tinymce/plugins/lists' // 列表插件
import 'tinymce/plugins/wordcount' // 字数统计插件
import 'tinymce/icons/default'
import { uploadFile } from '@/api/user'
export default {
  components: {
    Editor
  },
  created() {
    this.id = `editor_${new Date().getTime()}`
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 600
    },
    // 基本路径，默认为空根目录，如果你的项目发布后的地址为目录形式，
    // 即abc.com/tinymce，baseUrl需要配置成tinymce，不然发布后资源会找不到
    baseUrl: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      default: 'lists image media table wordcount'
    },
    toolbar: {
      type: [String, Array],
      default:
        'undo redo |  fontselect fontsizeselect | bold italic underline strikethrough forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image table | mybutton removeformat'
    }
  },
  data() {
    return {
      id: '',
      hiddenTable: `<table style="border-collapse: collapse; width: 100%; background-color: #ffffff00; border-color: #ffffff00; border-style: solid;" border="1"><tbody><tr><td style="width: 49.069%;">示例：甲方信息</td><td style="width: 49.069%;">示例：乙方信息</td></tr></tbody></table>`,
      init: {
        language_url: `${this.baseUrl}/tinymce/langs/zh_CN.js`,
        language: 'zh_CN',
        skin_url: `${this.baseUrl}/tinymce/skins/ui/oxide`,
        content_css: `${this.baseUrl}/tinymce/skins/content/default/content.css`,
        // skin_url: `${this.baseUrl}/tinymce/skins/ui/oxide-dark`, // 暗色系
        // content_css: `${this.baseUrl}/tinymce/skins/content/dark/content.css`, // 暗色系
        height: this.height,
        plugins: this.plugins,
        toolbar: this.toolbar,
        fontsize_formats: '8pt 9pt 10pt 12pt 14pt 18pt 24pt 36pt',
        branding: true,
        menubar: true,
        // 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
        // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        images_upload_handler: (blobInfo, success, failure) => {
          console.log(blobInfo)
          uploadFile(blobInfo.blob()).then((res) => {
            if (res.code === '0') {
              success(res.data.url)
            }
          })
          // const img = 'data:image/jpeg;base64,' + blobInfo.base64()
        },
        paste_preprocess: (plugin, args) => {
          console.log(plugin)
          console.log(args)
        }
      },
      myValue: this.value
    }
  },
  mounted() {
    tinymce.init({
      selector: `#${this.id}`,
      // 注册button
      toolbar: 'mybutton',

      setup: (editor) => {
        editor.ui.registry.addButton(`mybutton`, {
          text: `插入推荐的商品链接`,
          onAction: () => {
            this.drawerFlagGoFather()
          }
        })
      }
    })
  },
  methods: {
    // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
    // 需要什么事件可以自己增加
    onClick(e) {
      this.$emit('onClick', e, tinymce)
    },
    // 可以添加一些自己的自定义事件，如清空内容
    clear() {
      this.myValue = ''
    },
    insertContent(dom) {
      console.log(dom)
      tinymce.editors[this.id].insertContent(dom)
    },
    insertHiddenTable() {
      tinymce.editors[this.id].insertContent(this.hiddenTable)
    }
  },
  watch: {
    value(newValue) {
      this.myValue = newValue
    },
    myValue(newValue) {
      this.$emit('input', newValue)
    }
  }
}
</script>
