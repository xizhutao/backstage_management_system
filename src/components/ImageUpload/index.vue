<template>
  <div>
    <el-upload
      list-type="picture-card"
      :limit="limit"
      :file-list="fileList"
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :class="{ disabled: fileComputed }"
      :before-upload="beforeUpload"
      :http-request="upload"
      action="#"
    >
      <i class="el-icon-plus"> </i
    ></el-upload>
    <!-- 进度条 -->
    <el-progress
      v-if="isShowProcess"
      style="width: 180px"
      :percentage="percentage"
    ></el-progress>
    <el-dialog title="图片" :visible.sync="showDialog">
      <img :src="imgUrl" style="width: 100%" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import COS from 'cos-js-sdk-v5'
export default {

  filters: {},
  components: {},
  props: {
    limit: {
      default: 1,
      type: Number
    }
  },
  data () {
    return {
      fileList: [], // 图片地址设置为数组
      showDialog: false, // 控制显示弹层
      imgUrl: '', // 图片地址
      uploadUid: 0,
      percentage: 0, // 进度条的百分比
      isShowProcess: false // 控制进度条的显示和隐藏
    }
  },
  computed: {
    // 设定一个计算属性 判断是否已经上传完够了
    fileComputed () {
      return this.fileList.length === this.limit
    }
  },
  watch: {},
  created () { },
  methods: {
    preview (file) {
      // 这里应该弹出一个层 层里是点击的图片地址
      this.imgUrl = file.url
      this.showDialog = true
    },
    handleRemove (file) {
      // file是点击删除的文件
      //   将原来的文件给排除掉了 剩下的就是最新的数组了
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    // 上传、上传失败、上传成功都会调用这个钩子
    handleChange (file, fileList) {
      this.fileList = fileList.map(item => item)
    },
    // 上传文件之前的校验
    beforeUpload (file) {
      // 校验文件格式
      const fileFormat = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!fileFormat.some(item => item === file.type)) {
        this.$message.error('文件格式不正确')
        return false
      }
      // 校验文件的大小5Mb
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('文件尺寸太大')
        return false
      }
      // 确定上传文件的操作
      this.isShowProcess = true
      this.uploadUid = file.uid
      return true
    },
    // 上传文件到腾讯云
    upload (params) {
      // 创建一个cos实例
      var cos = new COS({
        SecretId: 'AKIDxiEUUDhvsY0ECm6AxTihT0HK7fcKOOBj', // 身份识别 ID
        SecretKey: 'NXS8aoo9HD0az92f2B5kBMGuGMBj03tY' // 身份密钥
      })
      cos.putObject({
        Bucket: 'staffphoto-1313030163', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-nanjing', /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: params.file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        StorageClass: 'STANDARD',
        Body: params.file, // 上传文件对象
        onProgress: (progressData) => {
          this.percentage = progressData.percent * 100
        }
      }, (err, data) => {
        console.log(err || data)
        // 文件上传成功后的处理
        this.fileList = this.fileList.map(item => {
          // 去找谁的uid等于刚刚记录下来的id
          if (item.uid === this.uploadUid) {
            // 将成功的地址赋值给原来的url属性
            return { url: 'http://' + data.Location, upload: true } // 根据 status标记 图片有没有上传成功，能不能保存
          }
          return item
        })
        // 文件上传完成后的操作
        setTimeout(() => {
          this.isShowProcess = false
          this.percentage = 0
        }, 1000)
      })
    }
  }
}
</script>

<style scoped lang='scss'>
::v-deep .disabled .el-upload--picture-card {
  display: none;
}
</style>
