<template>
	<view class="index">
		<view class="nav1">
			<!-- <view class="icon" @click="toBack">
				<u-icon name="arrow-left" color="#000000" size="34"></u-icon>
			</view> -->
			<view class="position-icon">
				<view @click="collect">
					<!-- 未收藏 -->
					<u-icon name="star" color="#000000" size="48" v-if="obj.is_collect==0"></u-icon>
					<!-- 已收藏 -->
					<u-icon name="star-fill" color="#000000" size="48" v-if="obj.is_collect==1"></u-icon>
				</view>
				<button class="btnshare u-reset-button" open-type="share">
					<u-icon name="zhuanfa" style='margin-left: 40rpx;' color="#000000" size="50"></u-icon>
				</button>
			</view>
			<view class="nav1-flex">
				<image class="pic" :src="obj.doctor_img" mode=""></image>
				<view class="f-right">
					<view class="txt1">{{obj.doctor_name}}</view>
					<view class="f-bottom">
						<view class="txt2">{{obj.doctor_titles}}</view>
						<view class="txt2">——{{obj.doctor_sub_titles}}</view>
					</view>
				</view>
			</view>
			<view class="tit1">
				<view class="titBtn" @click="contentShow=!contentShow">
					<view class="txt1">详情</view>
					<u-icon v-if="!contentShow" name="arrow-down" color="#000000" size="26"></u-icon>
					<u-icon v-else name="arrow-up" color="#000000" size="26"></u-icon>
				</view>
				<view class="content" v-if="contentShow">{{obj.doctor_content}}</view>
			</view>
		</view>
		<!-- <view class="nav2">
			<u-tabs-swiper bg-color="#FFFFFF" height='84' font-size="32" gutter="30" inactive-color="#707070"
				bar-height="4" bar-width="64" active-color="#BD9E81" ref="uTabs" :list="list" :current="current"
				@change="tabsChange" :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
			<swiper :style="[{height: height + 'px'}]" :current="swiperCurrent">
				<swiper-item @touchmove.stop class="swiper-item" v-for="(item, index) in list" :key="index">
					<scroll-view scroll-y='true'>
						<view class="nav5Items">
							<template v-if="swiperCurrent == 0">
							</template>
							<template v-if="swiperCurrent == 1">
							</template>
							<template v-if="swiperCurrent == 2">
							</template>			
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view> -->
		<view class="tabmenu_sticky">
			<view class="tabmenu">
				<view class="tabitem" :class="{'active':current==index}" v-for="(item,index) in list" :key="index" @click="tabsChange(index)">{{item.name}}</view>
			</view>
		</view>
		<view class="tabcont">
			<view class="i1" v-if="swiperCurrent == 0">
				<image :src="obj.doctor_big_img" mode="widthFix" class="img" v-if="obj.doctor_big_img"></image>
			</view>
			<view class="i2" v-if="swiperCurrent == 1">
				<view class="pic" v-for="(item,index) in imgArr" :key="index" @click="previewImg(index,imgArr)">
					<image :src="item" mode="aspectFill" class="img"></image>
				</view>
			</view>
			<view class="i3" v-if="swiperCurrent == 2">
				<comment-list :Obj="pingjiaObj" :list="pinglunList" @getPinglunData="getPinglunData" @toSeeImg="toSeeImg"></comment-list>
				<u-loadmore :status="status" font-size="22" />
			</view>
		</view>
		<view class="fixedBtns">
			<button open-type="contact" bindcontact="handleContact" class="btn1">
				<image src="/static/image/zu1574.png" class="b-pic" mode=""></image>
				<view class="b-txt">在线咨询</view>
			</button>
			<button open-type="contact" bindcontact="handleContact" class="btn1 btn2">
				<image src="/static/image/zu1575.png" class="b-pic" mode=""></image>
				<view class="b-txt">挂号预约</view>
			</button>
			<button open-type="contact" bindcontact="handleContact" class="btn1 btn2">
				<image src="/static/image/lujin2236.png" class="b-pic" mode=""></image>
				<view class="b-txt">专家面诊</view>
			</button>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import commentList from "@/components/commentList";
	export default {
		computed: {
			...mapState(["doctorInfo","IndexshopPage", "IndexshopPageSize"]),
		},
		watch: {
			IndexshopPage: function(page) {
				this.$store.commit("IndexshopPage", page);
				if (this.IndexshopPage != 1) {
					this.getPinglunData();
				}
			},
			current: function() {
				// setTimeout(() => {
				// 	this.getCurrentSwiperHeight('.nav5Items')
				// }, 800)
			},
		},
		components:{
			commentList
		},
		data() {
			return {
				pingjiaObj:{},
				pinglunList: [],
				obj: {},
				id: 0,
				isOnShow: true,
				contentShow: false,
				imgArr: [],
				//
				swiperCurrentIndex: 0,
				height: 0,
				list: [{
					name: '主页'
				}, {
					name: '案例'
				}, {
					name: '评价'
				}],
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				// 加载
				status: 'loadmore'
			}
		},
		onLoad(options){
			if(options.id){
				this.id = options.id;
				this.obj = this.doctorInfo;
				if(this.obj.doctor_anli){
					this.imgArr = JSON.parse(this.obj.doctor_anli);
				}
			}
			if (options.obj) {
				this.obj = JSON.parse(decodeURIComponent(options.obj))
				if(this.obj.doctor_anli){
					this.imgArr = JSON.parse(this.obj.doctor_anli);
				}
			}
		},
		onShow() {
			if (!this.isOnShow) {
				return;
			}
			this.tabsChange(this.current);
		},
		onReachBottom() {
			this.$store.commit("IndexshopPage", this.IndexshopPage + 1);
		},
		// mounted() {
		// 	setTimeout(() => {
		// 		this.getCurrentSwiperHeight('.nav5Items')
		// 	}, 900)
		// },
		methods: {
			async getPinglunData(type) {
				this.status = 'loading';
				setTimeout(async () => {
					const res = await this.$api.replyList({
						page:this.IndexshopPage,
						limit:this.IndexshopPageSize
					}, this.obj.id)
					this.pingjiaObj = res.data.comment;
					if (res.data.list.length == 0) {
						this.status = 'nomore';
					} else {
						this.status = 'loadmore';
						this.pinglunList = this.pinglunList.concat(res.data.list)
					}
				}, 200)
			},
			collect() {
				if(this.obj.is_collect==0){
					this.$api.collectDoctor(this.id).then((res) => {
						if (res.status == 200) {
							this.$u.toast("收藏成功");
							this.obj.is_collect = 1;
						}else{
							this.$u.toast(res.msg);
						}
					})
				}else{
					this.$api.collectDoctor(this.id).then((res) => {
						if (res.status == 200) {
							this.$u.toast("取消收藏");
							this.obj.is_collect = 0;
						}else{
							this.$u.toast(res.msg);
						}
					})
				}
			},
			handleContact(e) {
				console.log(e.detail.path)
				console.log(e.detail.query)
			},
			toBack() {
				uni.navigateBack({
					delta: 1
				})
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
				// uni.previewImage({
				// 	current: i,
				// 	urls: imgArr,
				// 	longPressActions: {
				// 		itemList: ['发送给朋友', '保存图片', '收藏'],
				// 		success: function(data) {
				// 			console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) +
				// 				'张图片');
				// 		},
				// 		fail: function(err) {
				// 			console.log(err.errMsg);
				// 		}
				// 	}
				// });
			},
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
				this.swiperCurrentIndex = index;
				this.current = index;
				if(index==2){
					this.pinglunList = [];
					this.$store.commit("IndexshopPage", 1);
					this.getPinglunData();
				}
			},
			getCurrentSwiperHeight(element) {
				let query = uni.createSelectorQuery().in(this);
				query.selectAll(element).boundingClientRect();
				query.exec((res) => {
					this.height = res[0][this.swiperCurrentIndex].height;
				})
			},
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {
				console.log(res.target)
			}
			return {
				title: '医美',
				path: '/pages/index/zhuanjiatuandui/zhuanjiatuandui?id=' + this.id
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

	.nav1 {
		width: 750rpx;
		// height: 494rpx;
		// padding: 114rpx 40rpx 30rpx 40rpx;
		padding: 40rpx 40rpx 30rpx 40rpx;
		background: #FECF05;
		position: relative;

		// .icon {
		// 	padding-top: 114rpx;
		// }

		.position-icon {
			position: absolute;
			// top: 202rpx;
			top:40rpx;
			right: 46rpx;
			display: flex;
			align-items: center;
		}

		.nav1-flex {
			// margin-top: 74rpx;
			display: flex;
			align-items: center;

			.pic {
				width: 176rpx;
				height: 176rpx;
				border-radius: 50%;
				margin-right: 32rpx;
			}

			.f-right {
				height: 176rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.txt1 {
					margin-top: 30rpx;
					font-size: 36rpx;
					font-weight: bold;
					color: #122106;
				}

				.f-bottom {
					.txt2 {
						font-size: 28rpx;
						font-weight: bold;
						line-height: 40rpx;
						color: #122106;
					}
				}
			}
		}

		.tit1 {
			margin-left: 204rpx;
			margin-top: 28rpx;

			.titBtn {
				display: flex;
				align-items: center;
				width: 102rpx;
				height: 36rpx;
				justify-content: center;
				background: #F1C505;
				border-radius: 4rpx;

				.txt1 {
					font-size: 24rpx;
					font-weight: 400;
					margin-right: 8rpx;
				}
			}

			.content {
				margin-top: 32rpx;
				font-size: 24rpx;
				font-weight: 400;
				line-height: 34rpx;
				color: #122106;
			}


		}
	}

	.nav2 {
		/deep/ .u-tabs {
			padding: 0 80rpx;
		}

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
		margin-top: 20rpx;
		.i1 {
			background-color: #FFFFFF;
			width: 100%;
			.img{
				width: 100%;
			}
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
		.i3 {
			width: 100%;
			background: #FFFFFF;
		}
	}

	.fixedBtns {
		position: fixed;
		right: 40rpx;
		bottom: 100rpx;

		.btn1::after {
			border: none;
		}

		.btn1 {
			width: 168rpx;
			height: 92rpx;
			background: #FFFFFF;
			box-shadow: 0rpx 0rpx 12rpx rgba(0, 0, 0, 0.16);
			opacity: 1;
			border-radius: 10rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			.b-pic {
				width: 44rpx;
				height: 44rpx;
			}

			.b-txt {
				margin-left: 8rpx;
				width: 48rpx;
				font-size: 24rpx;
				font-weight: 500;
				line-height: 28rpx;
				color: #707070;
			}
		}

		.btn2.btn1 {
			&:nth-child(2) {
				margin: 20rpx 0;
			}

			background: #BD9E81;

			.b-txt {
				color: #FFFFFF;
			}
		}
	}
</style>
