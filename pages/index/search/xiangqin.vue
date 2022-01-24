<template>
	<view class="index">
		<u-toast ref="uToast" />
		<view class="nav1">
			<u-swiper height='602' :list="bannerList" border-radius="0"></u-swiper>
		</view>
		<view class="nav3">
			<!-- <image src="/static/image/zu1873.png" class="pic" mode=""></image> -->
			<!-- <view class="left">
				<view class="txt1">原价</view>
				<view class="txt2">￥<text class="big">{{storeInfo.ot_price||0.00}}</text></view>
			</view> -->
			<view class="right">
				<view class="txt1">服务费</view>
				<view class="txt2">￥<text class="big">{{storeInfo.price||0.00}}/次</text></view>
			</view>
		</view>
		<view class="nav2">
			<view class="left">
				<view class="txt1">{{storeInfo.store_name}}</view>
				<view class="txt2" v-if="storeInfo.cateName.length">{{storeInfo.cateName[0].cate_name}}</view>
			</view>
			<view class="right">
				<button open-type="share" class="u-reset-button">
					<image src="/static/image/zu1570.png" class="r-pic" mode=""></image>
					<view class="txt1">分享</view>
				</button>
			</view>
		</view>
		<view class="tabmenu_sticky">
			<view class="tabmenu">
				<view class="tabitem" :class="{'active':current==index}" v-for="(item,index) in list" :key="index" @click="tabsChange(index)">{{item.name}}</view>
			</view>
		</view>
		<view class="tabcont">
			<view class="i1" v-if="swiperCurrent == 0">
				<u-parse :html="storeInfo.description" :tag-style="tagstyle"></u-parse>
			</view>
			<view class="i2" v-if="swiperCurrent == 1">
				<page-empty v-if="imgArr.length==0" style='width: 100%;'></page-empty>
				<template v-else>
					<view class="pic" v-for="(item,index) in imgArr" :key="index" @click="previewImg(index,imgArr)">
						<image :src="item" mode="aspectFill" class="img"></image>
					</view>
				</template>
			</view>
			<view class="i3" v-if="swiperCurrent == 2">
				<comment-list :Obj="pingjiaObj" :list="pinglunList" @changeType="changeType" @toSeeImg="toSeeImg"></comment-list>
				<u-loadmore :status="status" font-size="22" />
			</view>
		</view>
		<u-gap height="240"></u-gap>
		<view class="footer2">
			<view class="item" @click="toHome">
				<image src="/static/tabBar/home-active.png" class="pic" mode=""></image>
				<view class="txt">首页</view>
			</view>
			<view class="item item2" @click="toCollect">
				<u-icon name="star-fill" color="#BD9E81" size="48" v-if="storeInfo.userCollect"></u-icon>
				<u-icon name="star" color="#BD9E81" size="48" v-else></u-icon>
				<view class="txt">收藏</view>
			</view>
			<view @click="toQuerendingdan" class="btn">立即购买</view>
		</view>
		<view>
			<button open-type="contact" class="u-reset-button">
				<image src="/static/image/zu1840.png" class="kefu" mode=""></image>
			</button>
		</view>
	</view>
</template>

<script>
	import {mapState} from "vuex";
	import pageEmpty from "@/components/page-empty/page-empty.vue";
	import commentList from "@/components/commentList";
	export default {
		components:{
			pageEmpty,
			commentList
		},
		computed: {
			...mapState(["pinlunPage", "pinlunPageSize"]),
		},
		// watch: {
		// 	pinlunPage: function(page) {
		// 		this.$store.commit("pinlunPage", page);
		// 		if (this.pinlunPage != 1) {
		// 			this.getPinglunData();
		// 		}
		// 	},
		// },
		data() {
			return {
				tagstyle:{
					p:"padding:20rpx"
				},
				storeInfo:{},
				pingjiaObj:{},
				pinglunList: [],
				id: 0,
				replyCount:0,
				replyChance:0,
				obj: {},
				isOnShow: true,
				navTitle: '',
				bannerList: [],
				imgArr: [],
				//
				swiperCurrentIndex: 0,
				height: 0,
				list: [
					{
						name: '主页'
					},
					{
						name: '案例'
					}
				],
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				page:1,
				// 加载
				status: 'loadmore'
			}
		},
		onLoad(options) {
			//扫码携带参数处理
			if (options.scene) {
			  let value = this.$tool.getUrlParams(decodeURIComponent(options.scene));
			  if (value.id) options.id = value.id;
			  //记录推广人uid
			  if (value.pid) getApp().globalData.spid = value.pid;
			}
			if (!options.id) {
			  this.$u.toast("缺少参数无法查看商品");
			  setTimeout(()=>{
				  uni.navigateBack();
			  },1500)
			} else {
			  this.id = options.id;
			}
			//记录推广人uid
			if (options.spid) getApp().globalData.spid = options.spid;
		},
		onShow() {
			if (!this.isOnShow) {
				return;
			}
			this.getData();
			this.tabsChange(this.current);
		},
		onShareAppMessage() {
			return {
				title: this.navTitle,
				path: '/pages/index/search/xiangqin?id=' + this.id,
				imageUrl: this.storeInfo.recommend_image
			}
		},
		methods: {
			async getPinglunData() {
				this.status = 'loading';
				setTimeout(async () => {
					const res = await this.$api.replyList({
						page:this.page,
						limit:10
					}, this.id)
					this.pingjiaObj = res.data.comment;
					if (res.data.list.length <= 10) {
						this.status = 'nomore';
					} else {
						this.status = 'loadmore';
					}
					this.pinglunList = this.pinglunList.concat(res.data.list);
				}, 200)
			},
			changeType(val){
				this.page = 1;
				this.pinglunList = [];
				this.getPinglunData();
			},
			async getData() {
				const res = await this.$api.detail(this.id);
				if(res.status==200){
					this.obj = res.data;
					this.storeInfo = res.data.storeInfo;
					this.navTitle = res.data.storeInfo.store_name;
					uni.setNavigationBarTitle({
						title:res.data.storeInfo.store_name.substring(0, 16)
					})
					this.storeInfo.slider_image.forEach((ele, i) => {
						this.$set(this.bannerList, i, {
							image: ele
						})
					})
					this.imgArr = this.storeInfo.anli;
				}else{
					this.$u.toast(res.msg);
					setTimeout(()=>{
						uni.navigateBack();
					},800)
				}
			},
			previewImg(i, imgArr){
				this.isOnShow = false;
				uni.previewImage({
					current: i,
					urls: imgArr,
					success: (res) => {
						console.log(res)
					}
				})
			},
			toSeeImg(val) {
				let i = val.index, imgArr = val.imgArr;
				this.isOnShow = false;
				uni.previewImage({
					current: i,
					urls: imgArr,
					success: (res) => {
						console.log(res)
					}
				})
			},
			async toQuerendingdan() {
				const res = await this.$api.cartAdd({
					productId: this.id,
					cartNum: 1,
					new: 1
				})
				if (res.status == 200) {
					const res2 = await this.$api.orderConfirm({
						cartId: res.data.cartId,
						new: 1,
					})
					if (res2.status == 200) {
						this.$store.commit("setStoreInfo",this.storeInfo);
						this.$store.commit("setCartInfo",res2.data.cartInfo[0]);
						uni.navigateTo({
							url: `/pages/index/search/querendingdan?cartId=${res.data.cartId}&orderKey=${res2.data.orderKey}`
						})
						// var obj = {
						// 	...this.obj.doctor_info,
						// 	yuprice:res2.data.cartInfo[0].sum_price,
						// 	weiPrice:this.obj.storeInfo.finish_pay_price,
						// 	store_name:res2.data.cartInfo[0].productInfo.store_name,
						// 	orderKey:res2.data.orderKey,
						// }
					} else {
						this.$refs.uToast.show({
							title: res2.msg,
							type: 'warning',
						})
					}
				} else {
					this.$refs.uToast.show({
						title: res.msg,
						type: 'warning',
					})
					setTimeout(()=>{
						uni.navigateTo({
							url:"/pages/login/index"
						})
					},800)
				}
			},
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
				this.swiperCurrentIndex = index;
				this.current = index;
			},
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},
			getCurrentSwiperHeight(element) {
				let query = uni.createSelectorQuery().in(this);
				query.selectAll(element).boundingClientRect();
				query.exec((res) => {
					this.height = res[0][this.swiperCurrentIndex].height;
				})
			},
			toHome(){
				uni.switchTab({
					url:"/pages/tabBar/index"
				})
			},
			toCollect(){
				if (this.storeInfo.userCollect) {
					this.$api.collectDel(this.id).then((res)=>{
						if(res.status==200){
							this.$u.toast("取消成功");
							this.$set(this.storeInfo,"userCollect",false);
						}else{
							this.$u.toast(res.msg);
						}
					}).catch((err)=>{
						this.$u.toast(err);
					})
				}else{
					this.$api.collectAdd(this.id).then((res)=>{
						if(res.status==200){
							this.$u.toast(res.msg);
							this.$set(this.storeInfo,"userCollect",true);
						}else{
							this.$u.toast(res.msg);
						}
					}).catch((err)=>{
						this.$u.toast(err);
					})
				}
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
	/deep/ .u-load-more-wrap {
		height: 100rpx !important;
	}
	.index {
		position: relative;
	}

	.nav1 {}

	.nav3 {
		position: relative;
		width: 100%;
		height: 150rpx;
		background: #BD9E81;

		.pic {
			position: absolute;
			top: 0;
			left: 0;
			margin-top: -16rpx;
			height: 150rpx;
			width: 100%;
		}

		.left {
			position: absolute;
			top: 20rpx;
			left: 0;
			width: 264rpx;

			.txt1 {
				font-size: 28rpx;
				font-weight: 500;
				color: #707070;
				text-align: center;
			}

			.txt2 {
				text-align: center;
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: 800;
				line-height: 56rpx;
				color: #707070;
				text-decoration: line-through;

				.big {
					font-size: 40rpx;
				}
			}
		}

		.right {
			position: absolute;
			top: 20rpx;
			right: 0;
			// width: calc(750rpx - 280rpx);
			width: 100%;

			.txt1 {
				font-size: 28rpx;
				font-weight: 500;
				color: #ffffff;
				text-align: center;
			}

			.txt2 {
				text-align: center;
				font-size: 30rpx;
				font-family: PingFang SC;
				font-weight: 800;
				line-height: 56rpx;
				color: #ffffff;

				.big {
					font-size: 40rpx;
				}
			}
		}
	}

	.nav2 {
		margin: 0 0 20rpx 0;
		display: flex;
		justify-content: space-between;
		background: #FFFFFF;
		padding: 28rpx 40rpx;

		.left {
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.txt1 {
				font-size: 32rpx;
				font-weight: 500;
				color: #BD9E81;
				width: 600rpx;
			}

			.txt2 {
				font-size: 24rpx;
				font-weight: 400;
				color: #707070;
			}
		}

		.right {
			display: flex;
			align-items: center;
			flex-direction: column;
			// justify-content: space-between;

			.r-pic {
				width: 42rpx;
				height: 42rpx;
			}

			.txt1 {
				margin-top: 14rpx;
				font-size: 24rpx;
				font-weight: 400;
				color: #707070;
			}
		}
	}

	.nav4 {
		margin-bottom: 240rpx;

		.swiper-item {
			// background: #FFFFFF;
		}

		.nav5Items {
			// padding: 8rpx 24rpx 20rpx 24rpx;
			// background: #FFFFFF;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
		}
	}
	.tabmenu_sticky{
		position: sticky;
		top:0;
		left:0;
		right:0;
		.tabmenu{
			position: relative;
			width: 100%;
			height: 84rpx;
			padding:0 60rpx;
			background-color: #FFFFFF;
			display: flex;
			align-items: center;
			.tabitem{
				flex:1;
				height: 84rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 32rpx;
				color: #707070;
				position: relative;
				&.active{
					color:#BD9E81;
					&::before{
						content:"";
						width: 64rpx;
						height: 2rpx;
						background-color: #BD9E81;
						position: absolute;
						bottom:0;
						left:50%;
						right:0;
						transform: translateX(-50%);
						z-index: 20;
					}
				}
			}
		}
	}
	.tabcont{
		width: 100%;
		.i1{
			background-color: #FFFFFF;
		}
		.i2 {
			background-color: #FFFFFF;
			width: 100%;
			padding:28rpx 32rpx;
			display: flex;
			flex-wrap: wrap;
			.pic{
				width: 50%;
				margin-bottom: 28rpx;
				box-sizing: border-box;
				&:nth-child(even) {
					padding-left: 18rpx;
				}
				.img{
					width: 100%;
					height: 238rpx;
				}
			}
		}
		.i3{
			background-color: #FFFFFF;
			margin-top: 20rpx;
		}
	}
	.kefu {
		position: fixed;
		bottom: 120rpx;
		right: 8rpx;
		width: 172rpx;
		height: 172rpx;
		z-index: 100;
	}
	.footer1 {
		position: fixed;
		z-index: 50;
		bottom: 140rpx;
		width: 100%;
		height: 88rpx;
		background: #F2ECE6;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.txt1 {
			font-size: 24rpx;
			font-family: PingFang SC;
			line-height: 34rpx;
			color: #BD9E81;
		}

		.txt2 {
			font-size: 24rpx;
			font-family: PingFang SC;
			line-height: 34rpx;
			color: #BD9E81;
		}
	}

	.footer2 {
		position: fixed;
		left:0;
		bottom: 0;
		z-index: 50;
		width: 100%;
		height: 140rpx;
		padding: 0 50rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 8rpx 28rpx rgba(166, 179, 194, 0.3);
		display: flex;
		.item {
			margin-top: 12rpx;
			height: 80rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;

			.pic {
				width: 50rpx;
				height: 50rpx;
			}

			.txt {
				font-size: 24rpx;
				font-weight: 400;
				color: #707070;
			}

			.pic2 {
				margin-top: 4rpx;
				width: 40rpx;
				height: 40rpx;
			}
		}

		.item2 {
			margin-left: 25rpx;
			width: 140rpx;
		}

		.btn {
			border-radius: 40rpx;
			margin-left: 70rpx;
			margin-top: 12rpx;
			width: 406rpx;
			height: 80rpx;
			font-size: 28rpx;
			font-weight: bold;
			line-height: 80rpx;
			text-align: center;
			color: #FFFFFF;
			background: #BD9E81;
		}
	}
</style>
