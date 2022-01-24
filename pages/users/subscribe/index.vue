<template>
	<view>
		<view class="navbar">
			<view class="navbar_item" :class="{'on':current==0}" @click="tabChange(0)">
				<text class="text">全部</text>
			</view>
			<view class="navbar_item" :class="{'on':current==1}" @click="tabChange(1)">
				<text class="text">待付款</text>
			</view>
			<view class="navbar_item" :class="{'on':current==2}" @click="tabChange(2)">
				<text class="text">待面诊</text>
			</view>
			<view class="navbar_item" :class="{'on':current==3}" @click="tabChange(3)">
				<text class="text">待评价</text>
			</view>
			<view class="navbar_item" :class="{'on':current==4}" @click="tabChange(4)">
				<text class="text">已完成</text>
			</view>
		</view>
		<view class="scribelist">
			<view class="scribe_item" v-for="(item,index) in list" :key="index">
				<view class="hd">
					<view class="time">
						<image src="/static/image/user/icon_time.png" mode="aspectFit" class="icon"></image>
						<text>预约时间：{{item.appointment_time||""}}</text>
					</view>
					<view class="status" v-if="item._status._type==0">待付款</view>
					<view class="status" v-else-if="item._status._type==1">待面诊</view>
					<view class="status" v-else-if="item._status._type==3">待评价</view>
					<view class="status" v-else-if="item._status._type==4">已完成</view>
					<view class="status" v-else-if="item.refund_type==1">申请退款中</view>
					<view class="status" v-else-if="item.refund_type==4">待退款</view>
					<view class="status" v-else-if="item.refund_type==5">退款中</view>
					<view class="status" v-else-if="item.refund_type==6">已退款</view>
				</view>
				<view class="bd" v-for="(pitem,pindex) in item.cartInfo" :key="pindex">
					<image :src="pitem.productInfo.image" mode="aspectFill" class="img"></image>
					<view class="info">
						<view class="name">{{pitem.productInfo.store_name}}</view>
						<view class="fnwrap">
							<view class="sprice">￥{{pitem.productInfo.price}}</view>
						</view>
					</view>
				</view>
				<view class="ft">
					<view class="no">
						<text>订单编号：{{item.order_id}}</text>
						<view class="light" @click.stop="$tool.onCopy(item.order_id)">复制</view>
					</view>
					<view class="btnwrap">
						<view class="btn gray" v-if="item._status._type == 0 || item._status._type == 9" @click.stop="cancelOrder(index, item.order_id)">取消订单</view>
						<view class="btn" v-if="item._status._type == 0 || item._status._type == 6" @click.stop="goPay(item)">去支付</view>
						<view class="btn" v-else-if="item._status._type == 2" @click.stop="confirmOrder(item.order_id)">确认面诊</view>
						<view class="btn" v-else-if="item._status._type == 3" @click.stop="goOrderComment(item)">去评论</view>
						<view class="btn" @click="goOrderDetails(item.order_id)">查看详情</view>
					</view>
				</view>
			</view>
		</view>
		<u-loadmore height="100rpx" font-size="20" :status="loadStatus" icon-type="flower" color="#707070" />
	</view>
</template>

<script>
	import {mapState} from 'vuex';
	export default{
		data(){
			return{
				type:"",
				current: 0,
				list:[],
				loadStatus: 'nomore',
				currentPage: 1
			}
		},
		computed: {
			...mapState(['onResh'])
		},
		methods:{
			tabChange(index) {
				if(index==1){
					this.type = 0;
				}else if(index==0){
					this.type = "";
				}else{
					this.type = index;
				}
				this.current = index;
				this.list = [];
				this.currentPage = 1;
				this.loadData();
			},
			loadData(){
				this.loadStatus = 'loading';
				this.$api.orderList({type: this.type,page:this.currentPage,limit:10}).then((res)=>{
					if(res.status==200){
						if (res.data.length == 0) {
							this.loadStatus = 'nomore';
						} else {
							if(this.currentPage==1 && res.data.length<=10){
								this.loadStatus = 'nomore';
							}else{
								this.loadStatus = 'loadmore';
								this.currentPage++;
							}
						}
						this.list = this.list.concat(res.data);
					}
				})
			},
			cancelOrder(index, order_id){
				if (!order_id){
					this.$u.toast('缺少订单号无法取消订单');
					return;
				}
				uni.showModal({
					title: '温馨提示',
					content: '是否确认取消订单',
					confirmColor:"#BD9E81",
					success: (res)=> {
						if (res.confirm) {
							this.$api.orderCancel(order_id).then(res => {
								this.$u.toast(res.msg);
								this.list.splice(index, 1);
							}).catch(err => {
								this.$u.toast(err);
							});
						}
					}
				});
			},
			goPay(item) {
				uni.navigateTo({
					url: `/pages/users/order/querendingdan?id=${item.order_id}&price=${item.pay_price}`
				})
			},
			goOrderComment(val){
				this.$store.commit("setComent",val.cartInfo);
				uni.navigateTo({
					url:"/pages/users/order/comment?id="+val.id
				})
			},
			confirmOrder(id){
				uni.showModal({
				    title: '温馨提示',
				    content: '为保障用户权益，确认无误后，再确认面诊',
					confirmColor:"#BD9E81",
				    success:(res)=> {
				        if (res.confirm) {
							uni.showLoading({
								title: '请稍后'
							});
							this.$api.orderTake({uni: id}).then((res)=>{
								if(res.status==200){
									uni.hideLoading();
									this.$u.toast("成功");
									this.loadStatus = "nomore";
									this.current_page = 1;
									this.loadData();
								}else{
									uni.hideLoading();
									this.$u.toast(res.msg);
								}
							}).catch(err=>{
								uni.hideLoading();
							})
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			goOrderReturn(id){
				uni.navigateTo({
					url:"/pages/users/sale/index?orderId="+id
				})
			},
			goOrderReturnDetail(id){
				uni.navigateTo({
					url:"/pages/users/sale/detail?orderId="+id
				})
			},
			goOrderDetails(order_id) {
				if (!order_id){
					return this.$u.toast({
						title: '缺少订单号无法查看订单详情'
					});
				}else{
					uni.navigateTo({
						url: '/pages/users/order/Detail?order_id=' + order_id
					});
				}
			},
		},
		onLoad(){
			this.loadData();
		},
		onShow(){
			if(this.onResh){
				this.loadStatus = "nomore";
				this.list = [];
				this.current_page = 1;
				this.loadData();
			}
		},
		onReachBottom() {
			this.loadData();
		},
		onPullDownRefresh() {
			uni.stopPullDownRefresh();
		}
	}
</script>

<style>
	page{
		background: #F7F8FA;
	}
</style>
<style lang="scss" scoped>
	.navbar {
		width: 100%;
		height: 80rpx;
		background-color: #FFFFFF;
		margin-top: 2rpx;
		display: flex;
		align-items: center;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 50;
		.navbar_item {
			flex: 1;
			font-size: 28rpx;
			color: #707070;
			text-align: center;
			height: 100%;
			position: relative;
			.badge {
				background-color: #FA8677;
			}
			.text {
				display: inline-block;
				line-height: 80rpx;
			}
			&.on {
				.text {
					border-bottom: 2rpx #BD9E81 solid;
					color: #BD9E81;
				}
			}
		}
	}
	.scribelist{
		padding-top: 90rpx;
		.scribe_item{
			background-color: #FFFFFF;
			margin-bottom: 20rpx;
			.hd{
				padding:0 40rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
			.time{
				height: 88rpx;
				display: flex;
				align-items: center;
				font-size: 24rpx;
				color: #707070;
				.icon{
					padding-right: 16rpx;
					width: 24rpx;
					height: 24rpx;
				}
			}
			.status{
				font-size: 24rpx;
				color: #BD9E81;
			}
			.tip{
				text-align: center;
				font-size: 20rpx;
				color: #BD9E81;
				font-weight: bold;
				background-color: #F2ECE6;
				padding: 14rpx 0;
			}
			.bd{
				margin-left: 40rpx;
				padding:28rpx 40rpx 34rpx 0;
				border-bottom: 2rpx #F7F8FA solid;
				display: flex;
				.img{
					width: 186rpx;
					height: 186rpx;
					background-color: #eee;
				}
				.info{
					flex:1;
					padding-left: 24rpx;
					.name{
						font-size: 28rpx;
						font-family: PingFang SC;
						font-weight: 700;
						color: #707070;
						padding-bottom: 12rpx;
					}
					.attr{
						font-size: 24rpx;
						font-family: PingFang SC;
						color: #707070;
					}
					.fnwrap{
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding-top: 30rpx;
						.price{
							font-size: 24rpx;
							font-family: PingFang SC;
							font-weight: 500;
							color: #707070;
						}
						.sprice{
							font-size: 24rpx;
							color: #FA8677;
							font-family: PingFang SC;
						}
					}
				}
			}
			.ft{
				display: flex;
				flex-direction: column;
				padding:20rpx 40rpx;
				.no{
					font-size: 24rpx;
					color: #707070;
					display: flex;
					align-items: center;
					margin-bottom: 20rpx;
					.light{
						font-size: 24rpx;
						color: #BD9E81;
						padding-left: 20rpx;
					}
				}
				.btnwrap{
					display: flex;
					justify-content: flex-end;
				}
				.btn{
					margin-left: 20rpx;
					width: 152rpx;
					height: 56rpx;
					line-height: 56rpx;
					text-align: center;
					font-size: 24rpx;
					color: #FFFFFF;
					border: 2rpx solid #BD9E81;
					background-color: #BD9E81;
					border-radius: 10rpx;
					&.gray{
						color: #707070;
						border-color: #666666;
						background-color: #FFFFFF;
					}
				}
			}
		}
	}
</style>