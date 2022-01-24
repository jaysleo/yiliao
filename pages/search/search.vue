<template>
	<view class="index">
		<u-navbar>
			<view class="myInp">
				<u-icon name="search" color="#C7C7C7" size="28"></u-icon>
				<u-input :clearable='false' v-model="searchVal" placeholder='搜索专家/项目/关键词' placeholder-style='color: #C7C7C7;' type="text" height="60rpx" @confirm='toSearchResult' />
			</view>
		</u-navbar>
		<view class="tit1" v-if="hotlist.length">搜索发现</view>
		<view class="items1" v-if="hotlist.length">
			<view class="item" v-for="(item,index) in hotlist" :key="index" @click="ontag(item.keyword)">{{item.keyword}}</view>
		</view>
		<view class="flex" v-if="searchList.length">
			<view class="tit1">历史搜索</view>
			<image src="/static/image/zu1527.png" @click="onDel" class="f-pic" mode=""></image>
		</view>
		<view class="items1">
			<view class="item" v-for="(item,index) in searchList" :key="index" @click="ontag(item)">{{item}}</view>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex';
	export default {
		computed: {
			...mapState(['searchList'])
		},
		data() {
			return {
				hotlist:[],
				type:'',
				searchVal: '',
			}
		},
		onLoad(option) {
			if(option.type){
				this.type = option.type;
			}
			if(option.keyword){
				this.searchVal = option.keyword;
			}
			this.getlist();
		},
		methods:{
			toBack(){
				uni.navigateBack({
					delta:1
				})
			},
			getlist(){
				this.$api.searchKeyword().then((res)=>{
					if(res.status==200){
						this.hotlist = res.data;
					}
				})
			},
			toSearchResult(){
				this.$store.commit("searchList",this.searchVal);
				uni.navigateTo({
					url:`/pages/search/searchResult?keyword=${this.searchVal}&type=${this.type}`
				})
			},
			onDel(){
				this.searchList = [];
				this.$store.commit("clearSearchList");
			},
			ontag(item){
				uni.navigateTo({
					url:`/pages/search/searchResult?keyword=${item}&type=${this.type}`
				})
			}
		}
	}
</script>

<style>
	page {
		background: #ffffff;
	}
</style>
<style lang="scss" scoped>

	.nav1 {
		display: flex;
		align-items: center;
		margin-top: 96rpx;
		padding-left: 30rpx;
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

	.tit1 {
		padding: 0 34rpx;
		margin-top: 44rpx;
		font-size: 28rpx;
		font-weight: 500;
		margin-bottom: 28rpx;
		color: #BD9E81;
	}

	.items1 {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		margin: 0 34rpx 0 14rpx;

		.item {
			margin-bottom: 16rpx;
			font-size: 24rpx;
			font-weight: 400;
			line-height: 60rpx;
			color: #707070;
			height: 60rpx;
			padding: 0 26rpx;
			background: #FAFAFA;
			border-radius: 10rpx;
			margin-right: 20rpx;
		}
	}
	.flex{
		padding-right: 34rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.f-pic{
			width: 30rpx;
			height: 28rpx;
		}
	}
</style>
