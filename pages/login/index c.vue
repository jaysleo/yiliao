<template>
	<view class="container u-rela">
		<view class="loginbg">
			<view class="tbg"></view>
		</view>
		<!-- <u-navbar back-icon-color="#ffffff" background="#FF6929" :border-bottom="false"></u-navbar> -->
		<u-gap height="104"></u-gap>
		<view class="loginwrap">
			<view class="welcome">
				<u-image :lazy-load="false" :fade="false" src="/static/images/index/welcomes.png" width="298" height="104"></u-image>
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
				<button class="u-reset-button btn_primary" :class="{'disabled':isDisabled}" :disabled="isDisabled" v-if="pwdshow" @click="onSubmit">登录</button>
				<button class="u-reset-button btn_primary" :class="{'disabled':isDisableds}" :disabled="isDisableds" v-else @click="phoneLogin">登录</button>
				<view class="other" @click="forget">忘记密码？</view>
			</view>
		</view>
		<u-picker mode="selector" v-model="pickerShow" cancel-color="#6F7070" confirm-color="#FF6929" :default-selector="dselector" :range="selectorObj" range-key="cateName" @confirm="confirmVal"></u-picker>
		<u-modal v-model="show" :content="tipcon"></u-modal>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				form:{
					phone:"",
					pwd:"",
					code:""
				},
				second: 0,
				clockTimer: null,
				pwdshow:true,
				show: false,
				tipcon: "您输入的账号密码有误，请重新输入",
				pcode:"+86",
				dselector:[2],
				pickerShow:false,
				selectorObj: [
					{
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
		computed:{
			verifyText() {
				if (this.second == 0) {
					return '发送验证码';
				} else {
					if (this.second < 10) {
						return '重新发送('+'0' + this.second +'s)';
					} else {
						return '重新发送('+ this.second +'s)';
					}
				}
			},
			isDisabled(){
				if(this.form.phone!="" && this.form.pwd!=""){
					return false;
				}else{
					return true;
				}
			},
			isDisableds(){
				if(this.form.phone!="" && this.form.code!=""){
					return false;
				}else{
					return true;
				}
			}
		},
		methods:{
			forget(){
				this.$u.route("pages/library/login/forgetpwd");
			},
			changeLogin(index){
				if(index==1){
					this.pwdshow = false;
					this.form.pwd = "";
				}else{
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
				this.clockTimer = setInterval(()=> {
					that.second--;
					if (that.second == 0) {
						clearInterval(this.clockTimer);
					}
				}, 1000)
				this.$http.sendSms(this.form.phone,"captcha").then((res)=>{
					if(res.code==200){
						this.$u.toast("发送成功");
					}else{
						this.$u.toast(res.msg);
					}
				})
			},
			confirmVal(val){
				this.pcode = this.selectorObj[val].value;
				this.dselector = [val];
			},
			onSubmit(){
				let isphone = this.$u.test.mobile(this.form.phone);
				if(!isphone){
					this.$u.toast("请输入正确的手机号");
					return false;
				}
				if(this.form.pwd==""){
					this.$u.toast("请输入密码");
					return false;
				}
				uni.showLoading({
					title:"登录中...",
					mask:true
				})
				let backurl = uni.getStorageSync("backurl");
				let prams = {
					phone:this.form.phone,
					password:this.form.pwd,
					spread:uni.getStorageSync("spread")
				}
				this.$http.login(prams).then((res)=>{
					if(res.code!==200){
						uni.hideLoading();
						this.show = true;
					}else{
						this.$store.commit("Login", {'token':res.data.token});
						this.$u.toast(res.msg);
						this.getUserinfo();
						// setTimeout(()=>{
						// 	if(backurl!=""&&backurl!=undefined){
						// 		if(backurl=="/pages/index/index"||backurl=="/pages/index/user"){
						// 			uni.switchTab({
						// 				url:backurl
						// 			})
						// 		}else{
						// 			uni.redirectTo({url:backurl});
						// 		}
						// 	}else{
						// 		uni.switchTab({
						// 			url:"/pages/index/user"
						// 		})
						// 	}
						// 	uni.removeStorageSync("backurl");
						// },800);
					}
				}).catch(res => {
					uni.hideLoading();
				});
			},
			//验证码登录
			phoneLogin(){
				let isphone = this.$u.test.mobile(this.form.phone);
				let iscode = this.$u.test.code(this.form.code,4);
				let backurl = uni.getStorageSync("backurl");
				if(!isphone){
					this.$u.toast("请输入正确的手机号");
					return false;
				}
				if(this.form.code!=""&&!iscode){
					this.$u.toast("请输入正确的验证码");
					return false;
				}
				uni.showLoading({
					title:"登录中...",
					mask:true
				})
				let prams = {
					phone:this.form.phone,
					captcha:this.form.code,
					spread:uni.getStorageSync("spread")
				}
				this.$http.mlogin(prams).then((res)=>{
					if(res.code!=200){
						uni.hideLoading();
						this.$u.toast(res.msg);
					}else{
						this.$store.commit("Login", {'token':res.data.token});
						this.$u.toast(res.msg);
						this.getUserinfo();
						// setTimeout(()=>{
						// 	if(backurl!=""&&backurl!=undefined){
						// 		if(backurl=="/pages/index/index"||backurl=="/pages/index/user"){
						// 			uni.switchTab({
						// 				url:backurl
						// 			})
						// 		}else{
						// 			uni.redirectTo({url:backurl});
						// 		}
						// 	}else{
						// 		uni.switchTab({
						// 			url:"/pages/index/user"
						// 		})
						// 	}
						// 	uni.removeStorageSync("backurl");
						// },800);
					}
				}).catch(res => {
					uni.hideLoading();
				});
			},
			getUserinfo() {
				this.$http.getUserInfo().then(res => {
					if(res.code==200){
						this.$store.commit("updateUserinfo", res.data);
						uni.navigateTo({
							url:"/pages/login/auth"
						});
					}
				})
			}
		},
		onUnload() {
			clearInterval(this.clockTimer);
			this.clockTimer = null;
			this.second = 0;
		},
		onHide(){
			clearInterval(this.clockTimer);
			this.clockTimer = null;
			this.second = 0;
		}
	}
</script>

<style lang="scss" scoped>
	@import "./login.scss";
</style>
