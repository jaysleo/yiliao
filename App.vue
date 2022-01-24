<script>
	export default {
		globalData: {
			spid: 0,
			code: 0
		},
		onLaunch(option) {
			if (option.query.hasOwnProperty('scene')) {
				switch (option.scene) {
					//扫描小程序码
					case 1047:
						let val = this.$tool.getUrlParams(decodeURIComponent(option.query.scene));
						this.globalData.code = val.pid === undefined ? val : val.pid;
						break;
						//长按图片识别小程序码
					case 1048:
						this.globalData.code = option.query.scene;
						break;
						//手机相册选取小程序码
					case 1049:
						this.globalData.code = option.query.scene;
						break;
						//直接进入小程序
					case 1001:
						this.globalData.spid = option.query.scene;
						break;
				}
			}
		},
		onShow(route) {
			console.log(route, 'onShow')
		},
		onHide() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	page{
		font-family: PingFang SC;
	}
</style>
