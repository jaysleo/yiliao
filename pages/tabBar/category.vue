<template>
	<view class="category_wrap">
		<view class="menu_wrap">
			<scroll-view scroll-y scroll-with-animation class="tab_view menu_scroll_view" :scroll-top="scrollTop">
				<view v-for="(item,index) in tabbar" :key="index">
					<view class="tab_item" :class="{'tab_item_active':current==index}" @tap="swichMenu(item.id,index)">{{item.cate_name}}</view>
					<view :class="{'bgactive':current==index}">
						<view class="tab_item" :class="{'active':sid==pitem.id}" v-for="(pitem, index1) in item.children" :key="index1" @tap="onSwichMenu(pitem.id,index)">{{pitem.cate_name}}</view>
					</view>
				</view>
			</scroll-view>
			<scroll-view class="rightbox" scroll-y="true" @scrolltolower="loadData">
				<view class="pageview">
					<view class="list">
						<view class="thumb_item" v-for="(item1, index1) in list" :key="index1">
							<view class="thumb_box" @click="toSearchResult(item1.id)">
								<image class="image" :src="item1.image?item1.recommend_image:item1.image" mode="aspectFill"></image>
								<view class="name">
									<view class="text u-line-2">{{item1.store_name}}</view>
								</view>
							</view>
						</view>
					</view>
					<u-loadmore :status="status" font-size="22"></u-loadmore>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {mapState} from "vuex";
	export default {
		data() {
			return {
				tabIndex:'',
				tabbar:[],
				scrollTop: 0,
				current: 0,
				id:0,
				sid:0,
				menuHeight: 0,
				menuItemHeight: 0,
				status:"loadmore",
				list:[],
				page:1
			}
		},
		onShow() {
			this.list = [];
			this.page = 1;
			this.getData();
		},
		methods: {
			async getData(){
				const res = await this.$api.category();
				if(res.status==200){
					let data = res.data;
					if(data.length){
						this.tabbar = data;
						this.id = this.tabbar[this.current].id;
						this.loadData2();
					}
				}
			},
			async loadData(){
				this.status = 'loading';
				let data = {
					sid:this.sid,
					page: this.page,
					limit: 10,
					product_from:1
				}
				await this.$api.products(data).then((res)=>{
					if (res.data.length <= 10) {
						this.status = 'nomore'
					} else {
						this.status = 'loadmore';
						this.page = this.page + 1;
					}
					this.list = this.list.concat(res.data);
				})
			},
			async loadData2(){
				this.status = 'loading';
				let data = {
					cid:this.id,
					page: this.page,
					limit: 10,
					product_from:1
				}
				await this.$api.products(data).then((res)=>{
					if (res.data.length <= 10) {
						this.status = 'nomore'
					} else {
						this.status = 'loadmore';
						this.page = this.page + 1;
					}
					this.list = this.list.concat(res.data);
				})
			},
			toSearchResult(id){
				uni.navigateTo({
					url:"/pages/index/search/xiangqin?id="+id
				})
			},
			onSwichMenu(id,index) {
				this.current = index;
				this.sid = id;
				this.page = 1;
				this.list = [];
				this.loadData();
			},
			// 点击左边的栏目切换
			async swichMenu(id,index) {
				this.id = id;
				this.sid = 0;
				this.current = index;
				// 如果为0，意味着尚未初始化
				if (this.menuHeight == 0 || this.menuItemHeight == 0) {
					await this.getElRect('menu_scroll_view', 'menuHeight');
					await this.getElRect('tab_item', 'menuItemHeight');
				}
				// 将菜单菜单活动item垂直居中
				this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
				this.page = 1;
				this.list = [];
				this.loadData2();
			},
			// 获取一个目标元素的高度
			getElRect(elClass, dataVal) {
				new Promise((resolve, reject) => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.' + elClass).fields({
						size: true
					}, res => {
						// 如果节点尚未生成，res值为null，循环调用执行
						if (!res) {
							setTimeout(() => {
								this.getElRect(elClass);
							}, 10);
							return;
						}
						this[dataVal] = res.height;
					}).exec();
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.category_wrap{
		width: 100%;
		height: calc(100vh);
		display: flex;
		flex-direction: column;
	}
	.menu_wrap {
		flex: 1;
		display: flex;
		overflow: hidden;
		background-color: #FFFFFF;
		.tab_view {
			width: 170rpx;
			height: 100%;
			flex-shrink: 0;
		}
		.tab_item {
			padding: 0 20rpx;
			height: 122rpx;
			background: #FFFFFF;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: center;
			font-family: PingFang SC;
			font-size: 24rpx;
			color: #707070;
			font-weight: 400;
			line-height: 1;
			&.active{
				color: #BD9E81;
			}
		}
		.tab_item_active {
			position: relative;
			color: #BD9E81;
			font-weight: 600;
			background: #fcfaf9;
		}
		.tab_item_active::before {
			content: "";
			position: absolute;
			background-color:#BD9E81;
			width: 100%;
			height: 8rpx;
			left: 0;
			top: 0;
		}
		.bgactive{
			background-color:#BD9E81;
			.tab_item{
				background-color:#fcfaf9;
			}
		}
	}
	.rightbox{
		background-color: #F4F5F7;
		.pageview{
			padding:20rpx 24rpx;
			.banner{
				width: 100%;
				height: 180rpx;
				background-color: #eee;
			}
			.list {
				display: flex;
				flex-wrap: wrap;
				padding: 0 0 40rpx;
				.thumb_item {
					width: 50%;
					box-sizing: border-box;
					&:nth-child(even) {
						padding-left: 10rpx;
					}
					&:nth-child(odd) {
						padding-right: 10rpx;
					}
				}
				.thumb_box {
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					margin-top: 20rpx;
					box-shadow: 0rpx 12rpx 40rpx rgba(0, 0, 0, 0.05);
					.image{
						width: 100%;
						height: 256rpx;
						border-radius: 8rpx 8rpx 0 0;
					}
					.name{
						width: 100%;
						padding: 0 20rpx;
						height: 80rpx;
						background: #FFFFFF;
						border-radius:0 0 8rpx 8rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 28rpx;
						font-family: PingFang SC;
						color: #707070;
					}
				}
			}
		}
	}
</style>
