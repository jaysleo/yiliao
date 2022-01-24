<template>
	<!-- #ifdef MP-WEIXIN -->
	<view class="wechat_login">
		<view class="img">
			<image src="/static/image/wechat_login.png" mode="widthFix"></image>
		</view>
		<view class="btn-wrapper">
			<button v-if="btnShow" class="u-reset-button btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
				<view class="txt1">手机号授权</view>
			</button>
			<button v-else class="u-reset-button btn" @tap="getUserProfile">微信授权登录</button>
			<view class="cancel" @click="cancelAuth">取消授权</view>
		</view>
		<view class="auth_clause">
			<view class="mdagree">
				<u-checkbox v-model="ischeck" name="1" shape="circle" active-color="#BD9E81" @change="onChange"></u-checkbox>
			</view>
			<view class="mdagreecon">
				已阅读并同意<text @tap.stop="onDetails('agree')">用户协议</text>
			</view>
		</view>
	</view>
	<!-- #endif -->
	<!-- #ifdef APP-PLUS -->
	<view class="container u-rela">
		<view class="loginbg">
			<view class="tbg"></view>
		</view>
		<!-- <u-navbar back-icon-color="#ffffff" background="#FF6929" :border-bottom="false"></u-navbar> -->
		<u-gap height="104"></u-gap>
		<view class="loginwrap">
			<view class="welcome">
				<u-image :lazy-load="false" :fade="false" src="/static/image/user/hy.png" width="190" height="104">
				</u-image>
			</view>
			<view class="loginbox">
				<view class="litem u-flex">
					<view class="tit u-flex" @click="pickerShow = true">
						<text>{{pcode}}</text>
						<u-icon name="arrow-down-fill" size="10" color="#000000" class="icon"></u-icon>
					</view>
					<input type="number" v-model="form.phone" class="ipt" placeholder="请输入新手机号" />
				</view>
				<view class="litem last u-flex" v-if="pwdshow">
					<view class="tit">
						<text>密码</text>
					</view>
					<input type="password" v-model="form.pwd" class="ipt" placeholder="请输入密码" />
				</view>
				<view class="litem last u-flex" v-else>
					<view class="tit">
						<text>验证码</text>
					</view>
					<input type="number" v-model="form.code" class="ipt" placeholder="请输入验证码" />
					<view class="verify_btn" @click="getVerifyCode">{{verifyText}}</view>
				</view>
			</view>
			<view class="lht" @click="changeLogin(1)" v-if="pwdshow">验证码登录</view>
			<view class="lht" @click="changeLogin(2)" v-else>账号登录</view>
			<view class="btnbox u-flex-col u-col-center">
				<button class="u-reset-button btn_primary" :class="{'disabled':isDisabled}" :disabled="isDisabled"
					v-if="pwdshow" @click="onSubmit">登录</button>
				<button class="u-reset-button btn_primary" :class="{'disabled':isDisableds}" :disabled="isDisableds"
					v-else @click="phoneLogin">登录</button>
				<view class="other" @click="forget">注册</view>
			</view>
		</view>
		<u-picker mode="selector" v-model="pickerShow" cancel-color="#6F7070" confirm-color="#FF6929"
			:default-selector="dselector" :range="selectorObj" range-key="cateName" @confirm="confirmVal"></u-picker>
		<u-modal v-model="show" :content="tipcon"></u-modal>
	</view>
	<!-- #endif -->
</template>

<script>
	// #ifdef  APP-PLUS
	export default {
		data() {
			return {
				form: {
					phone: "",
					pwd: "",
					code: ""
				},
				second: 0,
				clockTimer: null,
				pwdshow: true,
				show: false,
				tipcon: "您输入的账号密码有误，请重新输入",
				pcode: "+86",
				dselector: [2],
				pickerShow: false,
				selectorObj: [{
						cateName: "中国澳门",
						value: "+853"
					},
					{
						cateName: "中国香港",
						value: "+852"
					},
					{
						cateName: "中国",
						value: "+86"
					},
					{
						cateName: "新加坡",
						value: "+65"
					}
				]
			}
		},
		computed: {
			verifyText() {
				if (this.second == 0) {
					return '发送验证码';
				} else {
					if (this.second < 10) {
						return '重新发送(' + '0' + this.second + 's)';
					} else {
						return '重新发送(' + this.second + 's)';
					}
				}
			},
			isDisabled() {
				if (this.form.phone != "" && this.form.pwd != "") {
					return false;
				} else {
					return true;
				}
			},
			isDisableds() {
				if (this.form.phone != "" && this.form.code != "") {
					return false;
				} else {
					return true;
				}
			}
		},
		methods: {
			forget() {
				this.$u.route("/pages/login/region");
			},
			changeLogin(index) {
				if (index == 1) {
					this.pwdshow = false;
					this.form.pwd = "";
				} else {
					this.pwdshow = true;
					this.form.code = "";
				}
			},
			//获取验证码
			getVerifyCode() {
				let that = this;
				if (this.second > 0) {
					return;
				}
				this.second = 60;
				this.clockTimer = setInterval(() => {
					that.second--;
					if (that.second == 0) {
						clearInterval(this.clockTimer);
					}
				}, 1000)
				this.$api.verifyCode(this.form.phone, "captcha").then((res) => {
					if (res.code == 200) {
						this.$u.toast("发送成功");
					} else {
						this.$u.toast(res.msg);
					}
				})
				that.$api.verifyCode().then(res => {
					let data = {
						phone: this.form.phone,
						key: res.data.key
					}
					this.$api.registerVerify(data).then(res => {
						this.$u.toast(res.msg);
					}).catch(err => {
						this.$u.toast(err);
					});
				})
			},
			confirmVal(val) {
				this.pcode = this.selectorObj[val].value;
				this.dselector = [val];
			},
			onSubmit() {
				let isphone = this.$u.test.mobile(this.form.phone);
				if (!isphone) {
					this.$u.toast("请输入正确的手机号");
					return false;
				}
				if (this.form.pwd == "") {
					this.$u.toast("请输入密码");
					return false;
				}
				uni.showLoading({
					title: "登录中...",
					mask: true
				})
				let backurl = uni.getStorageSync("backurl");
				let prams = {
					account: this.form.phone,
					password: this.form.pwd,
					spread: uni.getStorageSync("spread")
				}
				this.$api.apiLogin(prams).then((res) => {
					if (res.status !== 200) {
						uni.hideLoading();
						this.show = true;
					} else {
						this.$store.commit("Login", {
							'token': res.data.token
						});
						this.$u.toast(res.msg);
						let time = res.data.expires_time - Math.round(
							new Date() / 1000);
						this.$store.commit('Login', {
							token: res.data.token,
							time: time
						});
						uni.setStorageSync("token", res.data.token);
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/tabBar/index'
							})
						}, 800);
					}
				}).catch(res => {
					uni.hideLoading();
				});
			},
			//验证码登录
			phoneLogin() {
				let isphone = this.$u.test.mobile(this.form.phone);
				let iscode = this.$u.test.code(this.form.code, 4);
				let backurl = uni.getStorageSync("backurl");
				if (!isphone) {
					this.$u.toast("请输入正确的手机号");
					return false;
				}
				if (this.form.code == "") {
					this.$u.toast("请输入正确的验证码");
					return false;
				}
				uni.showLoading({
					title: "登录中...",
					mask: true
				})
				let prams = {
					phone: this.form.phone,
					captcha: this.form.code,
				}
				this.$api.mobile(prams).then((res) => {
					if (res.status != 200) {
						uni.hideLoading();
						this.$u.toast(res.msg);
					} else {
						let time = res.data.expires_time - Math.round(
							new Date() / 1000);
						this.$store.commit('Login', {
							token: res.data.token,
							time: time
						});
						uni.setStorageSync("token", res.data.token);
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/tabBar/index'
							})
						}, 800);
					}
				}).catch(res => {
					uni.hideLoading();
				});
			},
		},
		onUnload() {
			clearInterval(this.clockTimer);
			this.clockTimer = null;
			this.second = 0;
		},
		onHide() {
			clearInterval(this.clockTimer);
			this.clockTimer = null;
			this.second = 0;
		}
	}

	// #endif

	// #ifdef  MP-WEIXIN
	export default {
		data() {
			return {
				ischeck:false,
				infoRes:"",
				btnShow:false,
				iv:'',
				phoneData:'',
			}
		},
		methods: {
			onChange(val){
				this.ischeck = val.value;
			},
			onDetails(){
				uni.navigateTo({
					url: "/pages/index/article/detail"
				})
			},
			async getPhoneNumber(e) {
				this.iv = e.detail.iv;
				this.phoneData = e.detail.encryptedData
				this.btnShow = false;
			},
			getUserProfile() {
				if(!this.ischeck){
					this.$u.toast("请先勾选已阅读并同意用户协议");
					return false;
				}
				uni.showLoading({
					title: '正在登录中'
				});
				let infoRes = "";
				if (uni.getUserProfile) {
					uni.getUserProfile({
						desc: '登录',
						success: (res) => {
							infoRes = res;
							let userInfo = res.userInfo;
							userInfo.spread_spid = getApp().globalData.spid; //获取推广人ID
							userInfo.spread_code = getApp().globalData.code; //获取推广人分享二维码ID
							uni.login({
								provider: 'weixin',
								success: (loginres) => {
									userInfo.code = loginres.code;
									this.$api.silenceAuth({
										code:loginres.code,
										avatar:userInfo.avatarUrl,
										spread_code: getApp().spread_code,
										spread_spid: getApp().spread_spid
									}).then(res => {
										uni.hideLoading();
										if (res.data.token !== undefined && res.data.token) {
											uni.hideLoading();
											let time = res.data.expires_time - Math.round(new Date() / 1000);
											this.$store.commit('Login', {token: res.data.token,time: time});
											uni.setStorageSync("token", res.data.token);
											uni.setStorageSync("session_key",res.data.session_key);
											this.$u.toast("登录成功");
											setTimeout(()=>{
												uni.navigateBack({
													delta: 1
												})
											},800)
										}
									}).catch(err => {
										uni.hideLoading();
										console.log(err)
									});
								}
							});
						},
						fail: (err) => {
							console.log(err);
							uni.hideLoading();
							this.$u.toast("取消授权");
						}
					})
				} else {
					uni.hideLoading();
					this.$u.toast("取消授权");
				}
			},
			getUserInfo() {
				this.$api.getUserInfo().then(res => {
					if(res.status==200){
						this.userInfo = res.data;
						this.$store.commit('SetUid', res.data.uid);
						this.$store.commit('UpdateUserinfo', res.data);
						this.$u.toast("登录成功");
						setTimeout(()=>{
							uni.navigateBack({
								delta: 1
							})
						},800)
					}
				});
			},
			cancelAuth() {
				uni.switchTab({
					url: "/pages/tabBar/index"
				})
			}
		},
		onLoad(options) {
			// if(!this.$store.getters.isLogin){
			// 	uni.login({
			// 		provider: 'weixin',
			// 		success: (res) => {
			// 			this.$api.silenceAuth({
			// 				code:res.code,
			// 				spread_code: getApp().spread_code,
			// 				spread_spid: getApp().spread_spid
			// 			}).then(res => {
			// 				if (res.data && res.data.token !== undefined) {
			// 					uni.hideLoading();
			// 					let time = res.data.expires_time - Math.round(new Date() / 1000);
			// 					this.$store.commit('Login', {token: res.data.token,time: time});
			// 					uni.setStorageSync("token", res.data.token);
			// 					this.$store.commit('SetUid', res.data.userInfo.uid);
			// 					this.$store.commit('UpdateUserinfo', res.data.userInfo);
			// 					uni.navigateBack({
			// 						delta:1
			// 					})
			// 				} else {
			// 					uni.hideLoading();
			// 					uni.navigateTo({
			// 						url: '/pages/login/index'
			// 					})
			// 				}
			// 			}).catch(err => {
			// 				uni.hideLoading();
			// 				console.log(err)
			// 			});
			// 		}
			// 	})
			// }
		}
	}
	
	
	// #endif
</script>

<style lang="scss">
	page {
		background: #fafbff;
	}
</style>
<style lang="scss" scoped>
	/*  #ifdef  APP-PLUS */
	@import "./login.scss";
	/*  #endif  */
	
	/*  #ifdef  MP-WEIXIN */
	.wechat_login {
		padding: 72rpx 34rpx;
		height: 100vh;
		.img {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
	
			image {
				width: 100%;
			}
		}
	
		.btn-wrapper {
			margin-top: 86rpx;
			width: 100%;
			display: flex;
			flex-direction: column;
	
			.btn {
				width: 100%;
				height: 86rpx;
				line-height: 86rpx;
				margin-bottom: 40rpx;
				border-radius: 43rpx;
				font-size: 28rpx;
				color: #fff;
				background: #07c160;
			}
	
			.cancel {
				width: 100%;
				color: #C4C4C4;
				text-align: center;
			}
		}
	}
	.auth_clause{
		position: absolute;
		left:0;
		right:0;
		bottom: 34rpx;
		width: 100%;
		font-size: 24rpx;
		color: #333333;
		display: flex;
		justify-content: center;
		text{
			color:#FB6729;
		}
		.mdagree{
			display: flex;
			align-items: center;
			flex-shrink: 0;
			width: 40rpx;
			height: 50rpx;
		}
		.ckbox{
			width: 22rpx;
			height: 22rpx;
			&.checked{
				border: 0;
			}
		}
		.mdagreecon{
			line-height: 1;
			display: flex;
			align-items: center;
		}
	}
	
	/*  #endif  */
</style>
