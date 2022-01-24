<template>
	<view class="container u-rela">
		<view class="loginbg">
			<view class="tbg"></view>
		</view>
		<!-- <u-navbar back-icon-color="#ffffff" background="#FF6929" :border-bottom="false"></u-navbar> -->
		<u-gap height="104"></u-gap>
		<view class="loginwrap">
			<view class="welcome">
				<u-image :lazy-load="false" :fade="false" src="/static/image/user/yzm.png" width="222" height="52"></u-image>
			</view>
			<view class="loginbox">
				<view class="litem u-flex">
					<view class="tit u-flex" @click="pickerShow = true">
						<text>{{pcode}}</text>
						<u-icon name="arrow-down-fill" size="10" color="#000000" class="icon"></u-icon>
					</view>
					<input type="number" v-model="form.phone" class="ipt" placeholder="请输入新手机号" />
				</view>
				<view class="litem last u-flex">
					<view class="tit">
						<text>验证码</text>
					</view>
					<input type="number" v-model="form.code" class="ipt" placeholder="请输入验证码" />
					<view class="verify_btn" @click="getVerifyCode">{{verifyText}}</view>
				</view>
				<view class="litem last u-flex">
					<view class="tit">
						<text>密码</text>
					</view>
					<input type="password" v-model="form.pwd" class="ipt" placeholder="请输入密码" />
				</view>
				<view class="litem last u-flex">
					<view class="tit">
						<text>邀请码</text>
					</view>
					<input type="text" v-model="form.spread" class="ipt" placeholder="非必填" />
				</view>
			</view>
			<u-gap height="70"></u-gap>
			<view class="btnbox u-flex-col u-col-center">
				<button class="u-reset-button btn_primary" :class="{'disabled':isDisabled}" :disabled="isDisabled" @click="onSubmit">注册</button>
			</view>
		</view>
		<u-picker mode="selector" v-model="pickerShow" cancel-color="#6F7070" confirm-color="#FF6929" :default-selector="dselector" :range="selectorObj" range-key="cateName" @confirm="confirmVal"></u-picker>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				form:{
					phone:"",
					pwd:"",
					code:"",
					spread:""
				},
				second: 0,
				clockTimer: null,
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
				if(this.form.phone!="" && this.form.code!="" && this.form.pwd!=""){
					return false;
				}else{
					return true;
				}
			}
		},
		methods:{
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
						key: res.data.key,
						type:'register'
					}
					this.$api.registerVerify(data).then(res => {
						this.$u.toast(res.msg);
					}).catch(err => {
						this.$u.toast(err);
					});
				})
			},
			//电话类型选择
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
				if(this.form.code==""){
					this.$u.toast("请输入验证码");
					return false;
				}
				let prams = {
					account:this.form.phone,
					password:this.form.pwd,
					captcha:this.form.code,
					spread: uni.getStorageSync("spread")||this.form.spread
				}
				this.$api.apiRegister(prams).then((res)=>{
					this.$u.toast(res.msg);
					// let time = res.data.expires_time - Math.round(
					// 	new Date() / 1000);
					// this.$store.commit('Login', {
					// 	token: res.data.token,
					// 	time: time
					// });
					// uni.setStorageSync("token", res.data.token);
					setTimeout(() => {
						uni.navigateTo({
							url:'/pages/login/index'
						})
					}, 800);
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


<style lang="scss">
	page{
		background: #fafbff;
	}
</style>
<style lang="scss" scoped>
	@import "./login.scss";
	/*  #ifdef  APP-PLUS */
	@import "./login.scss";
	/*  #endif  */
</style>
