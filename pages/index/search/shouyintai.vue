<template>
	<view class="index">
		<view class="nav1">
			<u-icon name="error-circle-fill" color="#BD9E81" size="40"></u-icon>
			<view class="txt">请确认订单信息无误后再提交并支付</view>
		</view>
		<view class="nav2">
			<view class="item">
				<view class="txt1">订单类型</view>
				<view class="txt1">商品订单</view>
			</view>
			<view class="item">
				<view class="txt1">订单编号</view>
				<view class="txt1">{{orderInfo.orderId}}</view>
			</view>
			<view class="item">
				<view class="txt1 txt2">手术医生</view>
				<view class="txt1 u-line-2">{{orderInfo.store_name}}</view>
			</view>
			<view class="item">
				<view class="txt1">预约时间</view>
				<view class="txt1">{{orderInfo.time}}</view>
			</view>
		</view>
		<view class="nav3">
			<view class="txt1">预付金<text class="n4-txt">¥{{orderInfo.sum_price}}</text></view>
			<u-icon name="checkmark-circle-fill" color="#BD9E81" size="40"></u-icon>
		</view>
		<view class="footer">
			<view @click="toPay" class="btn">支付¥{{orderInfo.sum_price}}</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {mapState} from "vuex";
	export default {
		data() {
			return {
				obj:{}
			}
		},
		computed:{
			...mapState(["orderInfo"])
		},
		methods:{
			toPay(){
				uni.showLoading({
					title:"支付中..."
				})
				uni.requestPayment({
					provider: 'wxpay',
					timeStamp: this.orderInfo.jsConfig.timestamp,
					nonceStr: this.orderInfo.jsConfig.nonceStr,
					package: this.orderInfo.jsConfig.package,
					signType: this.orderInfo.jsConfig.signType,
					paySign: this.orderInfo.jsConfig.paySign,
					success: (res)=> {
						uni.hideLoading();
						uni.showToast({
							title:"支付成功",
							icon:"success"
						})
						setTimeout(()=>{
							uni.redirectTo({
								url:"/pages/users/subscribe/index"
							})
						},1500)
					},
					fail:(err)=> {
						uni.hideLoading();
						console.log('fail:' + JSON.stringify(err));
						this.$u.toast(err);
					},
					complete: (e)=> {
						uni.hideLoading();
						if (e.errMsg == 'requestPayment:cancel'){
							this.$u.toast("取消支付");
						}
					}
				});
			}
		}
	}
</script>

<style>
	page {
		background: #F7F8FA;
	}
</style>
<style lang="scss" scoped>
	.index {
		position: relative;
	}

	.nav1 {
		width: 750rpx;
		height: 74rpx;
		background: #FFFBED;
		display: flex;
		align-items: center;
		padding: 0 44rpx;

		.txt {
			margin-left: 20rpx;
			font-size: 24rpx;
			font-weight: 500;
			line-height: 74rpx;
			color: #BD9E81;
		}
	}

	.nav2 {
		background: #FFFFFF;

		.item {
			height: 88rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 34rpx;

			.txt1 {
				font-size: 28rpx;
				font-weight: 400;
				color: #707070;
			}
			.txt2{
				flex-shrink: 0;
				padding-right: 60rpx;
			}
		}
	}

	.nav3 {
		margin-top: 20rpx;
		height: 120rpx;
		background: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 34rpx;

		.txt1 {
			font-size: 28rpx;
			font-weight: bold;
			color: #BD9E81;

			.n4-txt {
				margin-left: 22rpx;
			}
		}
	}

	.footer {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 140rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 8rpx 28rpx rgba(166, 179, 194, 0.3);
		.btn{
			width: 682rpx;
			height: 84rpx;
			background: #BD9E81;
			border-radius: 44rpx;
			margin-top: 10rpx;
			margin-left: 34rpx;
			font-size: 28rpx;
			font-weight: bold;
			line-height: 84rpx;
			color: #FFFFFF;
			text-align: center;
		}
	}
</style>
