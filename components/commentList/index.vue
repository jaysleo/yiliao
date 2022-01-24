<template>
	<view>
		<view class="i3-nav1">
			<view class="tit1">
				<view class="tit1-1">
					<view class="txt1">产品评价</view>
					<view class="txt2">（好评度{{Obj.reply_chance||0}}%）</view>
				</view>
				<view class="tit1-2">共{{Obj.sum_count||0}}条评论</view>
			</view>
			<view class="tit2">
				<view class="item">
					<view class="txt1">有图</view>
					<view class="txt2">{{Obj.pics_count||0}}</view>
				</view>
				<view class="item">
					<u-icon name="thumb-up-fill" color="#BD9E81" size="22"></u-icon>
					<view class="txt2">{{Obj.good_count||0}}</view>
				</view>
				<view class="item bed">
					<u-icon name="thumb-down-fill" color="#D9D9D9" size="22"></u-icon>
					<view class="txt2">{{Obj.poor_count||0}}</view>
				</view>
			</view>
		</view>
		<view class="i3-items">
			<view class="i3-item" v-for="(item,indexz) in list" :key="indexz">
				<u-avatar size="94" v-if="item.avatar==''"></u-avatar>
				<image class="ava" :src="item.avatar" mode="" v-else></image>
				<view class="right">
					<view class="tit1">
						<view class="txt1">{{item.nickname||""}}</view>
						<view class="txt2">{{item.add_time||""}}</view>
					</view>
					<view class="tit2">
						<u-icon name="thumb-up-fill" color="#BD9E81" size="22"></u-icon>
						<view class="txt2">赞了该商品</view>
					</view>
					<view class="tit3">{{item.comment}}</view>
					<view class="tit4">
						<image :src="pic" mode="aspectFill" @click.stop="toSeeImg(i,item.pics)" class="picc" v-for="(pic,i) in item.pics" :key="i"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			Obj:{
				type:Object,
				default:()=>{return {}}
			},
			list:{
				type:Array,
				default:()=>{return []}
			}
		},
		data(){
			return{
				type: 0
			}
		},
		methods:{
			changeType(e) {
				let type = parseInt(e);
				if (type == this.type) return;
				this.type = type;
				this.$emit("changeType",type);
			},
			toSeeImg(index,imgArr){
				let data = {index:index,imgArr:imgArr};
				this.$emit("toSeeImg",data);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.i3-nav1 {
		background: #FFFFFF;
		padding: 24rpx;
		
		.tit1 {
			display: flex;
			align-items: center;
			justify-content: space-between;
		
			.tit1-1 {
				display: flex;
				align-items: center;
		
				.txt1 {
					font-size: 32rpx;
					font-weight: 500;
					color: #BD9E81;
				}
		
				.txt2 {
					font-size: 24rpx;
					font-weight: 400;
					color: #707070;
				}
			}
		
			.tit1-2 {
				font-size: 24rpx;
				font-weight: 400;
				color: #707070;
			}
		}
		
		.tit2 {
			margin-top: 32rpx;
			display: flex;
			align-items: center;
		
			.item {
				border-radius: 10rpx;
				display: flex;
				align-items: center;
				padding: 12rpx 20rpx;
				background: #F2ECE6;
				margin-right: 20rpx;
		
				.txt1 {
					font-size: 24rpx;
					font-weight: bold;
					color: #707070;
				}
		
				.txt2 {
					margin-left: 12rpx;
					font-size: 24rpx;
					font-weight: bold;
					color: #707070;
				}
			}
		
			.item.bed {
				background: #FAFAFA;
			}
		}
	}
		
	.i3-items {
		background: #FFFFFF;
		margin-top: 20rpx;
		.i3-item {
			border-bottom: 2rpx solid #F7F8FA;
			display: flex;
			padding: 24rpx;
			.ava {
				height: 94rpx;
				width: 94rpx;
				border-radius: 50%;
			}
			.right {
				margin-left: 20rpx;
				width: calc(100% - 94rpx - 20rpx);
				.tit1 {
					display: flex;
					align-items: center;
					justify-content: space-between;
					.txt1 {
						font-size: 24rpx;
						font-weight: 500;
						color: #BD9E81;
					}
					.txt2 {
						font-size: 20rpx;
						font-weight: 400;
						color: #707070;
					}
				}
		
				.tit2 {
					display: flex;
					align-items: center;
					.txt2 {
						margin-top: 4rpx;
						margin-left: 8rpx;
						font-size: 20rpx;
						font-weight: 400;
						color: #707070;
					}
				}
				.tit3 {
					margin-top: 10rpx;
					font-size: 24rpx;
					font-weight: 400;
					color: #707070;
				}
		
				.tit4 {
					margin-top: 20rpx;
					.picc {
						border-radius: 8rpx;
						margin-right: 16rpx;
						width: 150rpx;
						height: 150rpx;
					}
				}
			}
		}
	}
</style>
