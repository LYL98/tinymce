<template>
  <div class="teditor">
    <textarea :id="tinymceId"></textarea>
  </div>
</template>
<script>
const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce@5.10.2/tinymce.min.js'
import { Constant, Verification, Http } from '@/utils'
import { UploadFile } from '@/api/common'
import load from './dynamicLoadScript'

export default {
  name: 'Tinymce',
  components: {},
  props: {
    code: {
      type: String,
      default: 'sysArticle',
    },
    name: {
      type: String,
      default: 'myTinymce',
    },
    showContent: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      hasInit: false,
      hasChange: false,
      tinymceId: this.$props.name,
      // 图片相关
      fileList: [],
      videoList: [],
      // oss上传配置
      dataObj: {
        policy: '',
        signature: '',
        key: '',
        ossaccessKeyId: '',
        dir: '',
        host: '',
      },
      genenateUrl: '',
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    if (window.tinymce) {
      this.initTinymce()
    }
  },
  deactivated() {
    this.destroyTinymce()
  },
  beforeDestroy() {
    // 调用销毁 API 对当前编辑器实例进行销毁

    this.destroyTinymce()
  },
  created() {},
  computed: {},
  watch: {},
  methods: {
    init() {
      // dynamic load tinymce from cdn
      load(tinymceCDN, (err) => {
        if (err) {
          this.$message.error(err.message)
          return
        }
        this.initEditor()
      })
    },
    initEditor() {
      const that = this
      tinymce.init({
        selector: `#${this.tinymceId}`,
        deprecation_warnings: false, // 去除警告
        language_url: '/tinymce/langs/zh_CN.js', //汉化路径是自定义的，一般放在public或static里面
        language: 'zh_CN',
        // skin_url: '/tinymce/skins/ui/oxide', //皮肤
        content_style:
          '* {font-size: 16px;font-family: 默认字体; } p {margin: 5px 0;} img {max-width:100% !important ; height:auto } ',
        body_class: 'panel-body ',
        // advlist_bullet_styles: 'default', // 无序列表圆心样式
        // advlist_number_styles: 'default', // 有序列表的顺序
        readonly: this.$props.disabled, // 动态开启不能用这个
        quickbars_selection_toolbar: 'bold italic forecolor | link blockquote quickimage',
        quickbars_insert_toolbar: 'quickimage media',
        //     toolbar:
        //       'code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | \
        // styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \
        // table image media charmap emoticons hr pagebreak insertdatetime print preview | fullscreen | bdmap indent2em lineheight formatpainter axupimgs',
        plugins:
          'advlist autolink link image media  lists charmap table fullscreen imagetools preview code codesample  searchreplace directionality visualblocks visualchars template hr nonbreaking insertdatetime  textpattern autoresize paste', //插件
        //工具栏
        toolbar:
          'code undo redo image media link | preview | forecolor backcolor bold italic | lineheight formatselect fontselect fontsizeselect | \
          alignleft aligncenter alignright alignjustify | bullist numlist outdent indent lists | fullscreen ',
        toolbar_location: '/', //工具栏位置
        fontsize_formats: '12px 14px 16px 18px 20px 22px 24px 28px 32px 36px 48px 56px 72px', //字体大小
        font_formats:
          '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats;知乎配置=BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei, sans-serif;小米配置=Helvetica Neue,Helvetica,Arial,Microsoft Yahei,Hiragino Sans GB,Heiti SC,WenQuanYi Micro Hei,sans-serif',

        min_height: 400,
        placeholder: '在这里输入内容~',
        resize: false, //调整编辑器大小
        // branding: false, //隐藏右下角技术支持
        statusbar: false, // 隐藏底部状态栏
        // media_alt_source: false, // 是否允许禁用“介质”对话框中的“替代源”输入字段
        file_picker_types: 'file media image', //想要哪一个图标提供本地文件选择功能，参数可为media(媒体)、image(图片)、file(文件)
        default_link_target: '_blank', //链接在新页面打开
        // menubar: '', // 指定哪些一级菜单显示，或调整菜单顺序
        nonbreaking_force_tab: true, // 制表符
        end_container_on_empty_block: true, // 如果在空的内部块元素中按enter键，则此选项允许您拆分当前容器块元素。
        media_live_embeds: true, // 启用此选项后，用户将看到可编辑区域中嵌入视频内容的实时预览，而不是占位符图像
        powerpaste_word_import: 'clean', // 此设置控制如何筛选从Microsoft Word粘贴的内容
        entity_encoding: 'raw', //此选项控制TinyMCE如何处理实体/字符的转换方式.raw => 所有字符都将以非实体形式保存，除了XML默认实体<,>,&,"

        // imagetools_cors_hosts: ['dev-hoppo.oss-cn-shenzhen.aliyuncs.com'], //跨域处理,可以出现图片处理工具
        paste_data_images: false, // 是否允许粘贴图片
        paste_enable_default_filters: true, // 开启默认过滤器
        smart_paste: false, // 智能粘贴

        media_poster: false, //视频上传,显示隐藏图片封面输入框
        media_alt_source: false, //视频上传,显示隐藏资源备用地址输入框

        // 在粘贴的内容被插入到编辑器之前对其进行修改
        paste_preprocess: (plugin, args) => {
          if (args.content.includes('file://') || args.content.includes('data:image/')) {
            this.$message({
              type: 'warning',
              message: '粘贴图片过大,请通过编辑器手动上传!',
            })
          }
          console.log('pre', args.content)
        },

        file_picker_callback: function (callback, value, meta) {
          if (meta.filetype == 'media') {
            //创建一个隐藏的type=file的文件选择input
            let input = document.createElement('input')
            input.setAttribute('type', 'file')
            input.setAttribute('accept', '.mp4')
            input.click()
            input.onchange = function () {
              let file = this.files[0]
              if (file.type == 'video/mp4') {
                that.handleBeforeUpload(file, callback, null, 'video')
              } else {
                that.$message.warning('请上传MP4文件')
              }
            }
          }
          if (meta.filetype == 'file') {
            //创建一个隐藏的type=file的文件选择input
            let input = document.createElement('input')
            input.setAttribute('type', 'file')
            input.setAttribute('accept', '.pdf')
            input.click()
            input.onchange = function () {
              let file = this.files[0]
              that.handleBeforeUpload(file, callback, null, 'file')
            }
          }

          if (meta.filetype == 'image') {
            let types = ['image/jpg', 'image/jpeg', 'image/png']

            //创建一个隐藏的type=file的文件选择input
            let input = document.createElement('input')
            input.setAttribute('type', 'file')
            input.setAttribute('accept', 'image/jpg, image/jpeg,  image/png')
            input.click()
            input.onchange = function () {
              let file = this.files[0]
              const isImg = types.includes(file.type)

              // that.handleBeforeUpload(file, callback, null, 'file')
              if (isImg) {
                that.handleBeforeUpload(file, callback, null, 'img')
              } else {
                that.$message.warning('上传图片只能是jpg、png、jpeg格式!')
              }
            }
          }
        },
        images_upload_handler: (blobInfo, succFun, failFun) => {
          let file = blobInfo.blob()
          let types = ['image/jpg', 'image/jpeg', 'image/png']
          // const isLtSize = file.size / 1024 / 1024 < 10 //10M
          const isImg = types.includes(file.type)
          if (isImg) {
            that.handleBeforeUpload(file, succFun, failFun, 'img')
          } else {
            that.$message.warning('上传图片只能是jpg、png、jpeg格式!')
          }
        },
        setup: (editor) => {},

        init_instance_callback: (editor) => {
          //init_instance_callback为回调配置项
          if (that.$props.showContent) {
            let str = that.$props.showContent
            console.log('prop', str)
            editor.setContent(str)
          }
          that.hasInit = true
          // editor.on('NodeChange Change KeyUp SetContent', () => {
          //   that.hasChange = true
          //   that.$emit('handleQuillEditor', editor.getContent())
          //   console.log(editor.getContent())
          // })

          editor.on('input change', (e) => {
            console.log(11, editor.getContent())
            that.$emit('handleQuillEditor', editor.getContent())
          })

          editor.on('paste', (e) => {
            // 监听粘贴事件
            console.log('paste', editor.getContent())
            // const val = editor.getContent().replace(/<p><img\s?src="data.*?<\/p>/g, '')
            // if (
            //   editor.getContent().includes('file://') ||
            //   editor.getContent().includes('data:image')
            // ) {
            //   this.$message({
            //     type: 'warning',
            //     message: '粘贴图片过大,请通过编辑器手动上传!',
            //   })
            //   console.log(392)
            // }
            // that.$emit('handleQuillEditor', val)
          })
        }, //这个括号是回调配置项结束的括号
        //
      })
    },

    /**
     * 上传图片
     */
    handleBeforeUpload(file, succFun, failFun, type) {
      const that = this
      console.log(file, type)

      UploadFile({ code: this.$props.code }).then((res) => {
        if (res.code == 200) {
          let { policy, signature, accessId, dir, host } = res.data
          that.dataObj.policy = policy
          that.dataObj.signature = signature
          that.genenateUrl = that.getUUID()
          that.dataObj.key = res.data.dir + that.genenateUrl + '_${filename}'
          that.dataObj.accessId = accessId
          that.dataObj.ossaccessKeyId = accessId
          that.dataObj.dir = dir
          that.dataObj.host = host

          if (type == 'img') {
            that.handleUploadImg(file, succFun, failFun)
          } else if (type == 'video') {
            that.handleUploadVideoAndFile(file, succFun, failFun)
          } else {
            that.handleUploadVideoAndFile(file, succFun, failFun)
          }
        }
      })
    },
    getUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        return (c === 'x' ? (Math.random() * 16) | 0 : 'r&0x3' | '0x8').toString(16)
      })
    },

    handleUploadImg(file, succFun, failFun) {
      const formData = new FormData()
      formData.append('policy', this.dataObj.policy)
      formData.append('signature', this.dataObj.signature)
      formData.append('genenateUrl', this.genenateUrl)
      formData.append('key', this.dataObj.dir + this.genenateUrl + '_${filename}')
      formData.append('accessId', this.dataObj.accessId)
      formData.append('ossaccessKeyId', this.dataObj.accessId)
      formData.append('dir', this.dataObj.dir)
      formData.append('host', this.dataObj.host)
      formData.append('file', file)
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Bearer: localStorage.getItem('token'),
        },
      }

      Http.post(this.dataObj.host, formData, config).then((res) => {
        let url = this.dataObj.host + '/' + this.dataObj.dir + this.genenateUrl + `_${file.name}`
        succFun(url)
      })
    },
    /**
     * 视频 和文件
     */

    handleUploadVideoAndFile(file, callback) {
      const formData = new FormData()
      formData.append('policy', this.dataObj.policy)
      formData.append('signature', this.dataObj.signature)
      formData.append('genenateUrl', this.genenateUrl)
      formData.append('key', this.dataObj.dir + this.genenateUrl + '_${filename}')
      formData.append('accessId', this.dataObj.accessId)
      formData.append('ossaccessKeyId', this.dataObj.accessId)
      formData.append('dir', this.dataObj.dir)
      formData.append('host', this.dataObj.host)
      formData.append('file', file)
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Bearer: localStorage.getItem('token'),
        },
      }
      Http.post(this.dataObj.host, formData, config).then((res) => {
        let url = this.dataObj.host + '/' + this.dataObj.dir + this.genenateUrl + `_${file.name}`
        callback(url, { title: file.name, text: file.name })
      })
    },
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId)
      // if (this.fullscreen) {
      //   tinymce.execCommand('mceFullScreen')
      // }
      if (tinymce) {
        tinymce.destroy()
      }
    },
  },
}
</script>
<style lang="less" scoped>
.teditor {
  position: relative;
  z-index: 1;
  font-size: 14px;
  line-height: normal;
}
</style>
