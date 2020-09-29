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

      <div class="screen">
        <section class="uploader">
          <div class="el-sign-header" style="padding-top: 10px; margin-bottom: 10px; text-align: -webkit-left;">上传支付宝付款码：</div>
          <div class="finish_room">
            <div class="finish_room2">
              <div
                v-for="(item ,index ) in imgs_report.imgSrc1"
                class="room_img"
                @click="changeBig"
                :key="index"
              >
                <img :src="item" class="img">
                <span >
                  <img src="/static/img/del.png" alt>
                </span>
              </div>
              <div class="room_add_img" v-show="isAdd2">
                <span>
                  <img src="/static/img/add_image.png">
                </span>
                <input
                  v-if="isEvent"
                  id="upload2"
                  type="file"
                  accept="image/png, image/jpg"
                  multiple="multiple"
                >
            </div>
              <div class="zoom_img" @touchmove.prevent v-show="isBig" @click.stop="stop">
                <img :src="item_big" alt width="300" height="300">
              </div>
            </div>
          </div>
        </section>
        <!-- 4.0 弹窗 -->
        <attention v-if="showWindow" :information="information"></attention>
        <!-- 7.0 正在上传 -->
        <div v-transfer-dom>
          <loading :show="showOrNot" :text="text"></loading>
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
export default {
  data () {
    return {
      showPassword: false,
      phone: '',
      password: '',
      alipay: '',
      verificationName: '',
      qq: '',
      showOrNot: false,
      text: '正在上传...',
      isEvent: true,
      showWindow: false,
      isAdd2: true,
      imgs_report: { imgSrc1: [], imgSrc2: [] },
      imgs_report_list: [],
      isBig: false,
      item_big: ''
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
      if (/^1[3|4|5|6|7|8|9][0-9]{9}$/.test(this.phone)) {
        if (this.wxUserInfo) {
          let wxUserInfo = JSON.parse(this.wxUserInfo)
          this.$vux.loading.show()
          this.$axios.post('', this.$QS.SF({
            method: 'ella.user.bindAndLogin',
            content: JSON.stringify({
              customerName: this.phone,
              password: md5(this.password),
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

</style>
