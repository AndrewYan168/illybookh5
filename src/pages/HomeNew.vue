<template>
  <div id="orderSystem">
    <div>
      <group label-width="5em">
        <group >
          <popup-picker class="fontStyle"  title="下单平台" :data="orderMallOptions"
                        :columns="1" v-model="dataForm.orderMall" show-name placeholder="请选择下单平台"></popup-picker>
        </group>

        <group>
          <popup-picker  class="fontStyle" title="付款方式" :data="payWayOptions"
                        :columns="1" v-model="dataForm.payWay" show-name placeholder="请选择付款方式"></popup-picker>
        </group>

        <group >
          <x-input class="fontStyle" text-align="right" title="订单号" v-model="dataForm.orderNum" required="true" placeholder="请输入订单号"></x-input>
        </group>

        <group >
          <x-input class="fontStyle" text-align="right" title="运单号" v-model="dataForm.trackingNumber" required="true" placeholder="请输入运单号"></x-input>
        </group>

        <group >
          <x-input class="fontStyle" text-align="right" title="收货人姓名" v-model="dataForm.consigneeName" required="true" is-type="china-name" placeholder="请输入收货人姓名"></x-input>
        </group>

        <group >
          <x-input class="fontStyle" text-align="right" title="收货人电话" v-model="dataForm.consigneePhone" is-type="china-mobile" required="true" placeholder="请输入收货人电话"></x-input>
        </group>

        <group >
          <x-input class="fontStyle" text-align="right" title="抢购手机型号" v-model="dataForm.phoneModel" required="true" placeholder="请输入抢购手机型号"></x-input>
        </group>

        <group >
          <x-input class="fontStyle" text-align="right" title="支付金额" v-model="dataForm.paidAmount" type="number" required="true" placeholder="请输入实际支付金额（成本价）"></x-input>
        </group>

        <group>
          <x-address class="fontStyle" title="下货地区" :list="addressData" v-model="dataForm.deliveryArea" placeholder="请选择地址"></x-address>
        </group>
        <group>
          <x-button plain type="primary" style="border-radius:99px;">primary</x-button>
        </group>

      </group>
    </div>
  </div>
</template>

<i18n>
  please select:
  zh-CN: 请选择
</i18n>

<script>
import { PopupPicker, Group, XInput, ChinaAddressV4Data, XAddress, XButton} from 'vux'
export default {
  data () {
    return {
      title: '两栏滚动',
      orderMallOptions: [
        { value: '0', name: '自寄' },
        {value: '1', name: '小米商城'},
        {value: '2', name: '华为商城'},
        {value: '3', name: '京东商城'},
        {value: '4', name: '天猫商城'},
        {value: '5', name: '苏宁商城'},
        {value: '6', name: '国美商城'},
        {value: '7', name: '一号店'},
        {value: '8', name: '唯品会'},
        {value: '9', name: '其它'}
      ],

      payWayOptions: [
        {
          value: '0',
          name: '垫付（已付款）'
        },
        {
          value: '1',
          name: '到付（到货需支付）'
        },
        {
          value: '2',
          name: '我付（小鑫已付成本）'
        },
        {
          value: '3',
          name: '其他'
        }
      ],
      addressData: ChinaAddressV4Data,
      dataForm: {
        orderMall: [],
        payWay: [],
        orderNum: '',
        trackingNumber: '',
        consigneeName: '',
        consigneePhone: '',
        phoneModel: '',
        paidAmount: '',
        deliveryArea: ''
      }

    }
  },

  created () {
    // console.log(2)
  },
  activated () {
  },

  components: {
    PopupPicker,
    Group,
    XInput,
    ChinaAddressV4Data,
    XAddress,
    XButton
  },

  methods: {

  }
}
</script>

<style lang="less" scoped>
  @import url('../assets/style/sign.less');
  #orderSystem{
    min-height: 100%;
    background-color: #fff;
  }
  .fontStyle {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    font-size: 2em;
    font-weight: 400;
  }
</style>
