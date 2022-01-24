<template>
	<view class="index">
		<u-navbar>
			<view class="myInp">
				<u-icon name="search" color="#C7C7C7" size="28"></u-icon>
				<u-input v-model="searchVal" placeholder='搜索专家/项目/关键词' placeholder-style='color: #C7C7C7;' type="text" height="60rpx" @confirm='toSearchResult' />
			</view>
		</u-navbar>
		<view class="nav2">
			<view class="item" @click="changeRad(1)">
				<view :class='{"txt":true,"active":RadIndex==1}'>综合</view>
				<view v-if="RadIndex == 1">
					<image class="pic" src="/static/image/zu1564.png" mode="" v-if="isSel"></image>
					<image class="pic" src="/static/image/1880.png" mode="" v-else></image>
				</view>
				<image class="pic" v-else src="/static/image/zu1567.png" mode=""></image>
			</view>
			<view class="item" @click="changeRad(2)">
				<view :class='{"txt":true,"active":RadIndex==2}'>价格</view>
				<!-- <image class="pic" v-if="RadIndex == 2" src="/static/image/zu1564.png" mode=""></image>
				<image class="pic" v-else src="/static/image/zu1567.png" mode=""></image> -->
				<view v-if="RadIndex == 2">
					<image class="pic" src="/static/image/zu1564.png" mode="" v-if="isSel2"></image>
					<image class="pic" src="/static/image/1880.png" mode="" v-else></image>
				</view>
				<image class="pic" v-else src="/static/image/zu1567.png" mode=""></image>
			</view>
			<view class="item" @click="changeRad(3)">
				<view :class='{"txt":true,"active":RadIndex==3}'>销量</view>
				<!-- <image class="pic" v-if="RadIndex == 3" src="/static/image/zu1564.png" mode=""></image>
				<image class="pic" v-else src="/static/image/zu1567.png" mode=""></image> -->
				<view v-if="RadIndex == 3">
					<image class="pic" src="/static/image/zu1564.png" mode="" v-if="isSel3"></image>
					<image class="pic" src="/static/image/1880.png" mode="" v-else></image>
				</view>
				<image class="pic" v-else src="/static/image/zu1567.png" mode=""></image>
			</view>
		</view>
		<view class="nav3">
			<view class="item" v-for="item in list" :key='item.id' @click="toSousuoXiangqin(item)">
				<image :src="item.image" class="pic" mode=""></image>
				<view class="right">
					<view class="txt1">{{item.store_name}}</view>
					<view class="txt2" v-if="item.cate_name.length">{{item.cate_name[0].cate_name}}</view>
					<view class="small">{{item.yisheng_level||item.sub_titles}}</view>
					<view class="txt4">擅长：{{item.store_info||"无"}}</view>
				</view>
			</view>
		</view>
		<u-loadmore :status="status" font-size="22" />
	</view>
</template>

<script>
	import {mapState} from "vuex";
	export default {
		data() {
			return {
				data:{
					salesOrder:"sales desc"
				},
				isSel:false,
				isSel2:false,
				isSel3:false,
				searchVal: '',
				RadIndex: 1,
				sid:'',
				list:[],
				type:'',
				keyword:'',
				// 加载
				status: 'loadmore'
			}
		},
		computed: {
			...mapState(["shopPage", "shopPageSize"]),
		},
		watch: {
			shopPage: function(page) {
				console.log('ddpage')
				this.$store.commit("shopPage", page);
				if (this.shopPage != 1) {
					this.getData();
				}
			},
		},
		onLoad(options) {
			this.sid = options.sid;
			if(options.type){
				this.type = options.type;
			}
			if(options.keyword){
				this.searchVal = options.keyword;
				this.keyword = options.keyword;
			}
			this.list = [];
			this.$store.commit("shopPage", 1);
			this.getData();
		},
		// onShow() {
		// 	this.getData()
		// },
		onReachBottom() {
			this.$store.commit("shopPage", this.shopPage + 1);
		},
		methods: {
			async getData(){
				this.status = 'loading';
				setTimeout(async () => {
					let data = {
						sid:this.sid,
						page: this.shopPage,
						limit: this.shopPageSize,
						keyword:this.keyword,
						type:this.type
					}
					if(this.RadIndex==1){
						data.newsOrder = this.isSel?"":"news";
					}else if(this.RadIndex==2){
						data.priceOrder = this.isSel2?"desc":"asc";
					}else if(this.RadIndex==3){
						data.salesOrder = this.isSel3?"desc":"asc";
					}
					const res = await this.$api.products(data);
					if (res.data.length <= 10) {
						this.status = 'nomore';
						this.list = this.list.concat(res.data);
					} else {
						this.status = 'loadmore';
						this.list = this.list.concat(res.data);
					}
				}, 200)
			},
			changeRad(val) {
				this.RadIndex = val;
				if(val==1){
					this.isSel = !this.isSel;
				}else if(val==2){
					this.isSel2 = !this.isSel2;
				}else if(val==3){
					this.isSel3 = !this.isSel3;
				}
				this.list = [];
				this.$store.commit("shopPage", 1);
				this.getData();
			},
			toBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			toSousuoXiangqin(item){
				uni.navigateTo({
					url:`/pages/index/search/xiangqin?title=${item.store_name}&id=${item.id}`
				})
			},
			toSearchResult(){
				this.$store.commit("searchList",this.searchVal);
				uni.navigateTo({
					url:`/pages/search/searchResult?keyword=${this.searchVal}&type=${this.type}`
				})
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
		// width: 686rpx;
		height: 100rpx !important;
	}
	.myInp {
		margin-left: 8rpx;
		padding: 0 24rpx;
		width: 436rpx;
		height: 64rpx;
		background: rgba(189, 158, 129, 0.05);
		border: 2rpx solid #BD9E81;
		display: flex;
		align-items: center;
		border-radius: 30rpx;
	
		/deep/ .u-input {
			margin-left: 14rpx;
			width: 340rpx !important;
	
			.u-input__input {
				font-size: 24rpx;
				font-weight: 400;
				line-height: 60rpx;
			}
		}
	}

	.nav1 {
		background: #FFFFFF !important;
		padding-bottom: 18rpx;
		display: flex;
		align-items: center;
		padding-top: 96rpx;
		padding-left: 30rpx;

		
	}

	.nav2 {
		display: flex;
		align-items: center;
		justify-content: space-around;
		.item {
			height: 80rpx;
			display: flex;
			align-items: center;

			.txt {
				font-size: 24rpx;
				font-weight: bold;
				color: #707070;
			}
			.txt.active{
				color: #BD9E81;
			}

			.pic {
				margin-left: 14rpx;
				height: 18rpx;
				width: 12rpx;
			}
		}
	}
	.nav3{
		.item{
			display: flex;
			background: #FFFFFF;
			padding: 24rpx 36rpx;
			margin-bottom: 20rpx;
			.pic{
				width: 140rpx;
				height: 140rpx;
				margin-right: 24rpx;
			}
			.right{
				width: 512rpx;
				display: flex;
				flex-direction: column;
				// justify-content: space-between;
				.txt1{
					font-size: 32rpx;
					font-weight: 500;
					color: #BD9E81;
				}
				.txt2{
					margin: 12rpx 0;
					font-size: 24rpx;
					color: #707070;
				}
				.small{
					padding-bottom: 12rpx;
					font-size: 24rpx;
					color: #707070;
					font-weight: bold;
				}
				.txt4{
					font-size: 24rpx;
					color: #707070;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
				.txt3{
					font-size: 32rpx;
					font-weight: bold;
					color: #FA8677;
					.small{
						font-size: 24rpx;
						font-weight: 400;
						color: #707070;
						text-decoration:line-through;
					}
				}
			}
		}
	}
</style>
