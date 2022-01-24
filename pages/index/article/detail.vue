<template>
	<view class="newsDetail">
		<view class="conters">
			<u-parse :html="content" :lazy-load="true" :tag-style="tagStyle"></u-parse>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: 0,
				content:'',
				tagStyle: {
					img: 'width:100%;'
				}
			}
		},
		methods: {
			 getArticleOne(){
			    this.$api.xieyi().then(res=>{
					this.content = res.data.content.content;
			    });
			}
		},
		onLoad(options) {},
		onShow(){
			this.getArticleOne();
		}
	}
</script>

<style lang="scss" scoped>
	.newsDetail{
		padding:28rpx;
		.conters {
			font-size: 28rpx;
			color: #000;
			line-height: 1.7;
			text-align: justify;
		}
	}
</style>
