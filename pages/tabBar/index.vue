<template>
	<view class="index">
		<view class="navbg"></view>
		<view class="nav1">
			<view class="tit1">
				<!-- <view v-if="city.label" @click="cityShow = true" class="txt1">{{city.label}}
					<u-icon name="arrow-down" color="#000000" size="20"></u-icon>
				</view> -->
				<view class="myInp" @click="toSearch">
					<u-icon name="search" color="#000000" size="28"></u-icon>
					<input type="text" class="input" placeholder='搜索专家/项目/关键词' placeholder-style='color: #122106;' />
				</view>
			</view>
			<view class="tit2" v-if="searchList.length">
				<view class="hot">
					<view class="txt1-1">热搜榜</view>
					<image src="/static/image/lujin1732.png" class="pic" mode=""></image>
				</view>
				<view class="right">
					<view @click="toSearchResult(item.keyword)" v-for="item in searchList" :key='item.id' class="txt2">
						{{item.keyword}}
					</view>
				</view>
			</view>
			<view class="tit3">
				<u-swiper height='320' :list="bannerList" @click="banClick"></u-swiper>
			</view>
		</view>
		<view class="nav2">
			<view class="cyy">
				<view class="c-item" @click="changeMenu(3)">
					<image v-if="!mySj" src="/static/image/yy3-1.png" class="c-pic" mode=""></image>
					<image v-else src="/static/image/yy3-3.png" class="c-pic" mode=""></image>
					<view :class="{'c-txt':true,'active':mySj}">神经外科</view>
				</view>
				<view class="c-item" @click="changeMenu(4)">
					<image v-if="!mySj" src="/static/image/yy3-2.png" class="c-pic" mode=""></image>
					<image v-else src="/static/image/yy3-4.png" class="c-pic" mode=""></image>
					<view :class="{'c-txt':true,'active':!mySj}">骨科专业</view>
				</view>
			</view>
			<template v-if="!mySj">
				<view class="items">
					<view class="item" @click="toYimeixiangmu(21)">
						<image src="/static/image/yy2-1.png" class="pic-item" mode=""></image>
						<view class="txt-item">关节外科</view>
					</view>
					<view class="item" @click="toYimeixiangmu(20)">
						<image src="/static/image/yy2-2.png" class="pic-item" mode=""></image>
						<view class="txt-item">脊柱外科</view>
					</view>
					<view class="item" @click="toYimeixiangmu(19)">
						<image src="/static/image/yy2-3.png" class="pic-item" mode=""></image>
						<view class="txt-item">创伤骨科</view>
					</view>
					<view class="item" @click="toYimeixiangmu(18)">
						<image src="/static/image/yy2-4.png" class="pic-item" mode=""></image>
						<view class="txt-item">骨肿瘤</view>
					</view>
					<view class="item" @click="toYimeixiangmu(17)">
						<image src="/static/image/yy2-5.png" class="pic-item" mode=""></image>
						<view class="txt-item">运动医学</view>
					</view>
				</view>
				<view class="items items2">
					<view class="item" @click="toYimeixiangmu(5)">
						<image src="/static/image/yy2-6.png" class="pic-item" mode=""></image>
						<view class="txt-item">足踝外科</view>
					</view>
				</view>
			</template>
			<template v-else>
				<view class="items">
					<view class="item" @click="toYimeixiangmu(16)">
						<image src="/static/image/yy1-1.png" class="pic-item" mode=""></image>
						<view class="txt-item">脑血管病</view>
					</view>
					<view class="item" @click="toYimeixiangmu(15)">
						<image src="/static/image/yy1-2.png" class="pic-item" mode=""></image>
						<view class="txt-item">前中后颅底</view>
					</view>
					<view class="item" @click="toYimeixiangmu(14)">
						<image src="/static/image/yy1-3.png" class="pic-item" mode=""></image>
						<view class="txt-item">创伤</view>
					</view>
					<view class="item" @click="toYimeixiangmu(13)">
						<image src="/static/image/yy1-4.png" class="pic-item" mode=""></image>
						<view class="txt-item">功能神经外科</view>
					</view>
					<view class="item" @click="toYimeixiangmu(12)">
						<image src="/static/image/yy1-5.png" class="pic-item" mode=""></image>
						<view class="txt-item">椎管病变</view>
					</view>
				</view>
				<view class="items items2">
					<view class="item" @click="toYimeixiangmu(11)">
						<image src="/static/image/yy1-6.png" class="pic-item" mode=""></image>
						<view class="txt-item">NICU</view>
					</view>
					<view class="item" @click="toYimeixiangmu(9)">
						<image src="/static/image/yy1-1.png" class="pic-item" mode=""></image>
						<view class="txt-item">胶质瘤</view>
					</view>
					<view class="item" @click="toYimeixiangmu(6)">
						<image src="/static/image/yy1-8.png" class="pic-item" mode=""></image>
						<view class="txt-item">小儿神经外科</view>
					</view>
				</view>
			</template>
			<view class="nav2-1" v-if="newslist.length">
				<image src="/static/image/zu1501.png" class="pic3-1" mode=""></image>
				<view class="tit3-1">
					<swiper :autoplay="true" :vertical="true" :interval="3000">
						<swiper-item v-for="(item,index) in newslist" :key="index" @click="goArticle(item.id)">
							<view>{{item.title}}</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
		<view class="nav3" v-if="servList.length">
			<view class="title">
				<view class="shu"></view>
				<view class="t-txt">远程服务中心</view>
			</view>
			<view class="items">
				<view class="item" v-for="item in servList" :key='item.id' @click="toXiufu(item)">
					<image :src="item.xiufu_img" class="pic" mode=""></image>
					<view class="txt">{{item.xiufu_name}}</view>
				</view>
			</view>
		</view>
		<view class="nav3 nav4">
			<view class="title">
				<view class="shu"></view>
				<view class="t-txt">专家团队</view>
			</view>
			<scroll-view class="scroll-view" scroll-x="true" style="width: 100%;">
				<view class="itemss">
					<view class="item" @click="toZhuanjiatuandui(item)" v-for="item in zjtdList" :key='item.id'>
						<image :src="item.image" class="pic" mode="heightFix"></image>
						<view class="right">
							<view class="txt1 u-line-1">{{item.store_name}}</view>
							<view class="txt2" v-if="item.titles">
								<view class="dot">.</view>
								<view class="u-line-2"><text>{{item.titles}}</text></view>
							</view>
							<view class="txt2" v-if="item.sub_titles">
								<view class="dot">.</view>
								<view class="u-line-2" style="height: 92rpx;"><text>{{item.sub_titles}}</text></view>
							</view>
							<view class="btn">
								<image src="/static/image/lujin1758.png" class="btn-img" mode=""></image>
								<view class="btn-txt">点击预约</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<image class="picc" src="/static/image/zu1872.png" mode=""></image>
			<view class="picc2" v-if="advImg.length">
				<u-swiper height='220' border-radius="0" :list="advImg" @click="onBanClick"></u-swiper>
			</view>
			<u-select @confirm='changeCity' v-model="cityShow" :list="cityList"></u-select>
		</view>
	</view>
</template>

<script>
	import {mapState} from "vuex";
	export default {
		data() {
			return {
				mySj:true,
				city: '',
				searchList: [],
				cityShow: false,
				cityList: [],
				zjtdList: [],
				catelist:[],
				servList: [],
				searchVal: '',
				bannerList: [],
				newslist: [],
				advImg: []
			}
		},
		onShow(){
			this.getBanner();
			this.getCategory();
			this.getData();
			this.getTeam();
			this.getGao();
		},
		methods: {
			async getBanner() {
				const res = await this.$api.banner({
					position: 0
				})
				this.bannerList = res.data;
				this.bannerList.forEach(ele => {
					ele.image = ele.image_url;
					ele.id = ele.redirect_url;
				})
			},
			async getGao() {
				const res = await this.$api.banner({
					position: 1
				})
				this.advImg = res.data;
				this.advImg.forEach(ele => {
					ele.image = ele.image_url;
					ele.id = ele.redirect_url;
				})
			},
			banClick(index){
				let id = this.bannerList[index].id;
				uni.navigateTo({
					url: `/pages/index/search/xiangqin?id=${id}`
				})
			},
			onBanClick(index){
				let id = this.advImg[index].id;
				uni.navigateTo({
					url: `/pages/index/search/xiangqin?id=${id}`
				})
			},
			async getData() {
				const res4 = await this.$api.searchKeyword()
				this.searchList = res4.data;
				const resnews = await this.$api.newlist(1);
				if (resnews.status == 200) {
					this.newslist = resnews.data;
				}
				const res2 = await this.$api.xiufu();
				if (res2.status == 200) {
					this.servList = res2.data;
				}
				
				// const res5 = await this.$api.position()
				// this.cityList = res5.data;
				// this.cityList = JSON.stringify(this.cityList)
				// this.cityList = this.cityList.replace(/city_name/g, 'label')
				// this.cityList = this.cityList.replace(/id/g, 'value')
				// this.cityList = JSON.parse(this.cityList)
				// this.city = this.cityList[0];
			},
			changeMenu(id){
				if(id==3){
					this.mySj = true;
				}else if(id==4){
					this.mySj = false;
				}
			},
			getCategory(){
				this.$api.category().then((res)=>{
					if(res.status==200){
						this.catelist = res.data;
						this.changeMenu(3);
					}
				})
			},
			getTeam(){
				this.$api.products({
					page: 1,
					limit: 5,
					product_from: 0
				}).then((res)=>{
					this.zjtdList = res.data;
				})
			},
			changeCity(e) {
				this.city = e[0];
			},
			toYimeixiangmu(val) {
				uni.navigateTo({
					url:`/pages/search/searchResult?sid=${val}&type=1`
				})
			},
			goArticle(id) {
				uni.navigateTo({
					url: "/pages/index/article/index?id=" + id
				})
			},
			toSearchResult(val = '') {
				uni.navigateTo({
					url: `/pages/search/searchResult?keyword=${val}&type=1`
				})
			},
			toZhuanjiatuandui(item) {
				uni.navigateTo({
					url: `/pages/index/search/xiangqin?id=${item.id}`
				})
			},
			toXiufu(val){
				this.$store.commit("setXiufuDetail",val);
				uni.navigateTo({
					url: `/pages/index/xiufu/xiufu?id={val.id}`
				})
			},
			toSearch() {
				uni.navigateTo({
					url: `/pages/search/search?type=1`
				})
			},
			//广告跳转
			goShop() {
				uni.navigateTo({
					url: "/pages/index/live/index"
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F7F8FA;
	}
</style>
<style lang="scss" scoped>
	.index{
		position: relative;
	}
	.navbg{
		position: absolute;
		top:0;
		left:0;
		z-index: -1;
		width: 100%;
		height: 298rpx;
		background: linear-gradient(316deg, #F6A309 0%, #F8B607 22%, #FFD438 42%, #F9C706 51%, #F8CA20 80%, #FECF05 100%);
	}
	.nav1 {
		padding: 0 36rpx;
		.tit1 {
			padding-top: 32rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			.txt1 {
				font-size: 28rpx;
				font-weight: 500;
				line-height: 40rpx;
				color: #122106;
				margin-right: 14rpx;
			}

			.myInp {
				padding: 0 24rpx;
				width: 494rpx;
				height: 60rpx;
				background: rgba(255, 255, 255, 0.2);
				border-radius: 50rpx;
				display: flex;
				align-items: center;

				.input {
					width: 400rpx;
					font-size: 24rpx;
					font-weight: 400;
					line-height: 60rpx;
					color: #122106;
					text-align: center;
				}
			}
		}

		.tit2 {
			margin-top: 30rpx;
			display: flex;
			align-items: center;
			padding: 0 10rpx;
			flex-wrap: wrap;
			height: 34rpx;
			overflow: hidden;
			// justify-content: space-between;

			.hot {
				display: flex;
				align-items: center;
				margin-right: 36rpx;

				.txt1-1 {
					font-size: 24rpx;
					font-weight: bold;
					line-height: 34rpx;
					color: #122106;
				}

				.pic {
					margin-left: 8rpx;
					width: 20rpx;
					height: 22rpx;
				}
			}

			.right {
				// display: flex;
				align-items: center;
				width: 522rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;

				.txt2 {
					font-size: 24rpx;
					font-weight: 400;
					line-height: 34rpx;
					color: #122106;
					margin-left: 20rpx;
				}
			}
		}

		.tit3 {
			margin-top: 34rpx;
		}

	}
	.cyy{
		height: 116rpx;
		display: flex;
		align-items: center;
		margin-bottom: 18rpx;
		justify-content: center;
		.c-item{
			width: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			.c-pic{
				width: 48rpx;
				height: 66rpx;
			}
			.c-txt{
				margin-left: 20rpx;
				font-size: 28rpx;
				font-family: PingFang SC, PingFang SC-Medium;
				font-weight: 500;
				text-align: left;
				color: #707070;
			}
			.active{
				color: #BD9E81;
			}
		}
	}
	.nav2 {
		background: #FFFFFF;
		padding: 20rpx 38rpx;

		.items {
			display: flex;
			align-items: center;
			// justify-content: space-between;

			.item {
				width: 20%;
				display: flex;
				flex-direction: column;
				align-items: center;

				.pic-item {
					width: 62rpx;
					height: 86rpx;
				}

				.txt-item {
					margin-top: 20rpx;
					font-size: 24rpx;
					font-weight: 400;
					color: #122106;
					text-align: center;
					    width: 144rpx;
				}
			}
		}

		.items2.items {
			margin-top: 40rpx;
		}

		.nav2-1 {
			margin-top: 40rpx;
			padding-bottom: 40rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.pic3-1 {
				width: 28rpx;
				height: 28rpx;
				transform: translateX(16rpx);
				margin-right: 16rpx;
			}

			.tit3-1 {
				padding-left: 24rpx;
				width: 612rpx;
				height: 60rpx;
				background: #fff2ee;
				border-radius: 30rpx;
				font-size: 24rpx;
				font-weight: 500;
				color: #FF7C5E;
				line-height: 60rpx;

				/deep/swiper {
					height: 60rpx;
				}
			}
		}
	}

	.nav3 {
		margin-top: 20rpx;
		width: 750rpx;
		background: #FFFFFF;
		padding: 28rpx 0;

		.title {
			display: flex;
			align-items: center;

			.shu {
				margin-left: 24rpx;
				margin-right: 20rpx;
				width: 6rpx;
				height: 28rpx;
				background: #BD9E81;
			}

			.t-txt {
				font-size: 28rpx;
				font-weight: bold;
				color: #BD9E81;
			}
		}

		.items {
			padding-left: 40rpx;
			margin-top: 36rpx;
			display: flex;
			align-items: center;
			width: 100%;
			white-space: nowrap;
			overflow-x: scroll;

			.item {
				width: 25%;
				display: flex;
				flex-direction: column;
				align-items: center;

				.pic {
					width: 150rpx;
					height: 150rpx;
					border-radius: 10rpx;
				}

				.txt {
					margin: 12rpx 0;
					font-size: 28rpx;
					font-weight: 400;
					color: #BD9E81;
				}
			}
		}
	}

	.nav4.nav3 {

		.scroll-view {
			height: 356rpx;
		}

		.itemss {
			margin-top: 36rpx;
			display: flex;
			align-items: center;

			.item {
				width: 460rpx;
				height: 284rpx;
				margin-left: 24rpx;
				display: flex;
				flex-wrap: nowrap;
				align-items: center;

				.pic {
					height: 284rpx;
					width: 196rpx;
					flex-shrink: 0;
				}

				.right {
					width: 260rpx;
					padding-left: 20rpx;

					.txt1 {
						margin-bottom: 16rpx;
						font-size: 32rpx;
						font-weight: bold;
						color: #BD9E81;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;

						.small {
							margin-left: 12rpx;
							font-weight: 500;
							font-size: 24rpx;
						}
					}

					.txt2 {
						position: relative;
						left: 14rpx;
						width: 280rpx;
						margin-top: 10rpx;
						font-size: 28rpx;
						font-weight: 500;
						color: #707071;
						.dot {
							position: absolute;
							left: -14rpx;
							top: -12rpx;
							font-weight: 500;
							width: 14rpx;
							height: 14rpx;
							color: #707071;
						}
					}

					.btn {
						margin-top: 24rpx;
						width: 186rpx;
						height: 52rpx;
						background: #FA8677;
						border-radius: 26rpx;
						display: flex;
						align-items: center;
						justify-content: center;

						.btn-img {
							width: 26rpx;
							height: 26rpx;
							margin-right: 6rpx;
						}

						.btn-txt {
							font-size: 28rpx;
							font-weight: 500;
							color: #FFFFFF;
						}
					}
				}
			}

		}

		.picc {
			width: 702rpx;
			height: 8rpx;
			margin-left: 26rpx;
			margin-bottom: 20rpx;
		}

		.picc2 {
			margin-left: 26rpx;
			width: 702rpx;
			height: 220rpx;
		}
	}

	.nav5 {
		.swiper-item {
			background: #FFFFFF;
		}
	}

	.nav5Items {
		padding: 8rpx 24rpx 20rpx 24rpx;
		background: #FFFFFF;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		.item {
			margin-top: 24rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			box-sizing: border-box;
			width: 50%;

			.pic {
				width: 334rpx;
				height: 334rpx;
			}

			.txt {
				margin-top: 20rpx;
				width: 334rpx;
				font-size: 28rpx;
				font-weight: 500;
				color: #BD9E81;
				display: -webkit-box; //将对象作为弹性伸缩盒子模型显示。
				-webkit-box-orient: vertical; //从上到下垂直排列子元素（设置伸缩盒子的子元素排列方式）
				-webkit-line-clamp: 2;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
	}
</style>
