<template>
	<view class="container u-rela forget">
		<view class="loginbg">
			<view class="tbg"></view>
		</view>
		<!-- <u-navbar back-icon-color="#ffffff" background="#FF6929" :border-bottom="false"></u-navbar> -->
		<u-gap height="114"></u-gap>
		<view class="loginwrap">
			<block v-if="step==1">
				<view class="welcome u-flex-col">
					<u-image :lazy-load="false" :fade="false" src="/static/image/user/yzm.png" width="222" height="52"></u-image>
					<text>请输入注册时使用的手机号</text>
				</view>
				<view class="loginbox">
					<view class="litem u-flex">
						<view class="tit u-flex" @click="pickerShow = true">
							<text>{{pcode}}</text>
							<u-icon name="arrow-down-fill" size="10" color="#000000" class="icon"></u-icon>
						</view>
						<input type="number" v-model="form.phone" class="ipt" placeholder="请输入新手机号" />
					</view>
				</view>
			</block>
			<block v-if="step==2">
				<view class="welcome u-flex-col">
					<u-image :lazy-load="false" :fade="false" src="/static/image/user/yzm.png" width="222" height="52"></u-image>
					<text>验证码已发送到{{form.phone.substr(0, 3) + '****' + form.phone.substr(7)}}手机号</text>
				</view>
				<view class="loginbox">
					<view class="litem u-flex">
						<view class="tit">
							<text>验证码</text>
						</view>
						<input type="number" v-model="form.code" class="ipt" placeholder="请输入验证码" />
						<view class="verify_btn" @click="getVerifyCode">{{verifyText}}</view>
					</view>
				</view>
			</block>
			<block v-if="step==3">
				<view class="welcome u-flex-col">
					<u-image :lazy-load="false" :fade="false" src="/static/images/index/tip_pwd.png" width="222" height="52"></u-image>
					<text>请设置新的登录密码</text>
				</view>
				<view class="loginbox">
					<view class="litem u-flex">
						<view class="tit">
							<text>新密码</text>
						</view>
						<input type="password" v-model="form.npwd" class="ipt" placeholder="请输入新密码" />
					</view>
					<view class="litem last u-flex">
						<view class="tit">
							<text></text>
						</view>
						<input type="password" v-model="form.npwds" class="ipt" placeholder="请再次输入新密码" />
					</view>
				</view>
			</block>
			<u-gap height="300"></u-gap>
			<view class="btnbox u-flex-col u-col-center">
				<button class="u-reset-button btn_primary" :class="{'disabled':isDisabled}" :disabled="isDisabled" @click="nextStep" v-if="subShow">下一步</button>
				<button class="u-reset-button btn_primary" :class="{'disabled':isDisabled}" :disabled="isDisabled" @click="onSubmit" v-else>提交</button>
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
					code:"",
					npwd:"",
					npwds:""
				},
				step:1,
				second: 0,
				clockTimer: null,
				pcode:"+86",
				dselector:[2],
				pickerShow:false,
				subShow:true,
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
				if(this.step==1){
					if(this.form.phone!=""){
						return false;
					}
				}else if(this.step==2){
					if(this.form.code!=""){
						return false;
					}
				}else if(this.step==3){
					this.subShow = false;
					if(this.form.npwd!=""&&this.form.npwds!=""){
						return false;
					}
				}
				return true;
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
				this.clockTimer = setInterval(()=> {
					that.second--;
					if (that.second == 0) {
						clearInterval(this.clockTimer);
					}
				}, 1000)
				this.$http.sendSms(this.form.phone,"register").then((res)=>{
					if(res.code==200){
						this.$u.toast("发送成功");
					}else{
						this.$u.toast(res.message);
					}
				})
			},
			confirmVal(val){
				this.pcode = this.selectorObj[val].value;
				this.dselector = [val];
			},
			nextStep(){
				let num = this.step;
				let isphone = this.$u.test.mobile(this.form.phone);
				let iscode = this.$u.test.code(this.form.code,4);
				if(num==1){
					if(!isphone){
						this.$u.toast("请输入正确的手机号");
						return false;
					}
				}else if(num==2){
					if(this.form.code!=""&&!iscode){
						this.$u.toast("请输入正确的验证码");
						return false;
					}
				}
				this.step = this.step+1;
				console.log(this.step)
			},
			onSubmit(){
				if(this.form.npwds!=this.form.npwd){
					this.$u.toast("密码不一致，请重新输入");
					return false;
				}
				this.step = 1;
				this.subShow = true;
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
