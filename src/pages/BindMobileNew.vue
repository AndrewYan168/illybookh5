<template>
  <div id="bindMobile">
    <div class="el-sign-header">绑定用户信息</div>
    <div class="el-sign-content" style="margin-top: -10px">
      <div style="margin-bottom: 10px">
        <input type="text" placeholder="请输入手机号" maxlength=11 v-model.trim="phone">
      </div>

      <div style="margin-bottom: 10px">
        <input type="text" placeholder="请输入QQ号" v-model.trim="qq">
      </div>

      <div style="margin-bottom: 10px">
        <input type="text" placeholder="请输入支付宝账号" v-model.trim="alipay">
      </div>

      <div style="margin-bottom: 10px">
        <input type="text" placeholder="请输入支付宝验证名" v-model.trim="verificationName">
      </div>

      <div class="el-photo-content" style="margin: 0 auto;">
        <div class="el-imgs" v-for="(item, index) in imgs" :key="index" v-if="imgs.length>0">
          <img :src="item" alt="" style="width: 140px; height: 140px">
          <span @click="deletImg(index)"><i class="icon iconfont icon-close"></i></span>
        </div>
        <div class="el-upload" v-if="imgs.length<1">
          <div class="el-upload-img">添加支付宝付款码</div>
          <input type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" @change="fileImage">
        </div>
      </div>
      <div class="el-btn btn-green" @click="bindMobile">完成</div>
    </div>
  </div>
</template>

<script>
import { lrz } from 'lrz'
import { md5, Loading, TransferDom } from 'vux'
import { mapState } from 'vuex'
import Axios from 'axios'
export default {
  data () {
    return {
      showPassword: false,
      phone: '',
      password: '',
      alipay: '',
      verificationName: '',
      qq: '',

      imgs: []
    }
  },
  computed: {
    ...mapState({
      uid: state => state.vux.uid,
      token: state => state.vux.token,
      isWX: state => state.vux.isWX,
      wxUserInfo: state => state.vux.wxUserInfo
    })
  },
  created () {
    // console.log(2)
  },
  activated () {
    console.log(this.$route.query.from)
  },
  directives: {
    TransferDom
  },
  components: {
    Loading,
    // TransferDom,
    lrz
  },
  methods: {
    toShowPassword () {
      this.showPassword = true
    },
    hidePassword () {
      this.showPassword = false
    },
    bindMobile () {
      if (this.phone === '') {
        this.$vux.toast.show({
          text: '手机号不能为空'
        })
        return
      }

      if (this.qq === '') {
        this.$vux.toast.show({
          text: 'qq号不能为空'
        })
      }

      if (this.alipay === '') {
        this.$vux.toast.show({
          text: '支付宝账号不能为空'
        })
      }

      if (this.verificationName === '') {
        this.$vux.toast.show({
          text: '支付宝验证名称不能为空'
        })
      }
      if (this.imgs.length === 0) {
        this.$vux.toast.show({
          text: '支付宝付款码图片改填'
        })
      }
      if (/^1[3|4|5|6|7|8|9][0-9]{9}$/.test(this.phone)) {
        if (this.wxUserInfo) {
          let wxUserInfo = JSON.parse(this.wxUserInfo)
          this.$vux.loading.show()
          this.$axios.post('', this.$QS.SF({
            method: 'ella.user.bindAndLogin',
            content: JSON.stringify({
              customerName: this.phone,
              // password: md5(this.password),
              deviceNo: '',
              deviceToken: '',
              clientType: '',
              resource: '',
              uid: wxUserInfo.unionid,
              unionID: wxUserInfo.unionid,
              idname: wxUserInfo.nickname,
              gender: wxUserInfo.sex === 1 ? 'MALE' : 'FEMALE',
              iconurl: wxUserInfo.headimgurl,
              platformType: 'WEIXIN',
              loginFrom: '2',
              loginVerificationType: '0',
              alipay: this.alipay,

              checkCode: ''
            })
          })).then((response) => {
            if (response.data.status === '1') {
              console.log(response.data)
              window.localStorage.setItem('uid', response.data.data.uid)
              window.localStorage.setItem('token', response.data.data.token)
              this.$store.commit('updateUid', {uid: response.data.data.uid})
              this.$store.commit('updateToken', {token: response.data.data.token})
              this.$vux.toast.show({
                text: '绑定成功，欢迎回来'
              })
            } else {
              this.$vux.alert.show({
                title: '提示',
                content: response.data.message + ',页面将返回~',
                onShow () {
                  console.log('Plugin: I\'m showing')
                },
                onHide () {
                  this.$router.go(-1)
                }
              })
            }
            this.$router.replace(this.$route.query.from || 'index/mine')
            this.$vux.loading.hide()
          }).catch(function (error) {
            this.$vux.loading.hide()
            console.log(error)
          })
        } else {
          this.$vux.confirm.show({
            title: '提示',
            content: '还未授权，请先授权哦~',
            confirmText: '去授权',
            onCancel () {
              console.log('plugin cancel')
            },
            onConfirm () {
              window.location.reload()
            }
          })
        }
      } else {
        this.$vux.toast.show({
          text: '手机号格式不正确'
        })
      }
    },
    fileImage (e) {
      let file = e.target.files[0]
      let param = new FormData()
      param.append('file', file)
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      }
      this.$axios.post('/upload_url?media=image&type=order-alipay', param, config)
        .then(response => {
          console.log(JSON.stringify(response))
          this.imgs.push(response.data.file_url)
        }).catch((error) => {
          console.log(error)
          this.$vux.toast.show({
            text: '上传图片出错了~'
          })
        })
    },
    deletImg (index) {
      this.imgs.splice(index, 1)
    }
  }
}
</script>

<style lang="less" scoped>
  @import url('../assets/style/sign.less');
  #bindMobile{
    min-height: 100%;
    background-color: #fff;
  }
  .screen {
    width: 100%;
    min-height: 100%;
    background: #f4f4f4;
    .uploader {
      padding: 0.26rem 0 0 0.3rem;
      background: #fff;
      .finish_room {
        width: 100%;
        height: auto;
      }
      .finish_room2 {
        width: 100%;
        height: auto;
        padding-bottom: 0.3rem;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
      }
      .finish_room2 .room_img {
        margin-top: 0.3rem;
        width: 27%; // flex: 1;
        height: 1.76rem;
        margin-right: 0.4rem;
        position: relative; // overflow: hidden;
        border: 1px solid #ccc;
      }
      .finish_room2 .room_img img {
        width: 100%;
        height: 100%;
      }
      .finish_room2 > .room_img span {
        position: absolute;
        width: auto;
        height: auto;
        top: -0.26rem;
        right: -0.28rem;
      }
      .finish_room2 > .room_img span i {
        font-size: 40px;
      }
      .room_add_img {
        margin-top: 0.3rem;
        width: 1.7rem;
        height: 1.7rem;
        border: 1px solid #e1e1e1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        position: relative;
      }
      .room_add_img > span:nth-child(1) {
        margin-top: 0.3rem;
        width: 1rem;
        height: 1rem;
        overflow: hidden;
        text-align: center;
        img {
          margin: 0 auto;
        }
      }
      .room_add_img > span:nth-child(2) {
        margin-bottom: 0.2rem;
      }
      .room_add_img input {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        opacity: 0;
      }
      .zoom_img {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        justify-content: center;
        -webkit-justify-content: center;
        position: fixed;
        left: 0;
        top: 0;
        background: rgba(0, 0, 0, 0.5);
      }
    }
  }
  .el-upload{
    height: 250px;
    width: 250px;
    background-color: #f6f6f6;
    color: #aaa;
    position: relative;
    .el-upload-img{
      height: 100%;
      width: 100%;
      line-height: 140px;
      font-size: 12px;
      text-align: center;
    }
    &>input{
      display: block;
      height: 100%;
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
    }
  }

</style>
