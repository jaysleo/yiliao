import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
export default new Vuex.Store({
	state: {
		searchList: [],
		shopPage:1,
		shopPageSize: 15,//商品列表
		IndexshopPage:1,
		IndexshopPageSize: 15,//首页商品列表
		dingdanPage:1,
		dingdanPageSize: 15,//订单列表
		jifenShopPage:1,
		jifenShopPageSize: 15,//积分商品列表
		pinlunPage:1,
		pinlunPageSize: 15,//评论列表
		from:21,
		token:uni.getStorageSync("token")||"",
		userInfo: {},
		uid:uni.getStorageSync("uid") || 0,
		uphone:"",
		storeInfo:{},
		cartInfo:{},
		orderInfo:{},
		comentInfo:[],
		proComentInfo:[],
		wkorder:{},
		onResh:false,
		cartNum:0,
		xiufuDetail:{}
	},
	mutations: {
		searchList(state, str) {
			if (str != '') {
				state.searchList.push(str);
			}
			if (state.searchList.length > 10) {
				state.searchList.pop()
			}
		},
		clearSearchList(state){
			state.searchList = [];
		},
		from(state, str) {
			state.from = str;
		},
		shopPage(state, str) {
			state.shopPage = str;
		},
		IndexshopPage(state, str) {
			state.IndexshopPage = str;
		},
		dingdanPage(state, str) {
			state.dingdanPage = str;
		},
		jifenShopPage(state, str) {
			state.jifenShopPage = str;
		},
		pinlunPage(state, str) {
			state.pinlunPage = str;
		},
		// 
		Login(state, opt) {
			state.token = opt.token;
		},
		SetUid(state,val){
			state.uid = val;
			uni.setStorageSync("uid",val);
		},
		SetUphone(state,val){
			state.uphone = val;
		},
		UpdateUserinfo(state, userInfo) {
			state.userInfo = userInfo;
			uni.setStorageSync("userInfo",userInfo);
		},
		setStoreInfo(state,data){
			state.storeInfo = data;
		},
		setCartInfo(state,data){
			state.cartInfo = data;
		},
		setOrderInfo(state,data){
			state.orderInfo = data;
		},
		setComent(state,data){
			state.comentInfo = data;
		},
		setproComent(state,data){
			state.proComentInfo = data;
		},
		setwkorder(state,data){
			state.wkorder = data;
		},
		setResh(state,data){
			state.onResh = data;
		},
		setCartNum(state, data) {
			state.cartNum = data;
		},
		setXiufuDetail(state, data) {
			state.xiufuDetail = data;
		}
	},
	getters:{
		token: state => state.token,
		isLogin: state => !!state.token,
	},
	actions: {

	},
});
