import axios from 'axios';
import Vue from 'vue';
import urls from './url.js';
const vue = new Vue()
let myPost = axios.create({
	baseURL: urls.baseUrl,
	method: 'post',
	// timeout: 1000,
})
let myUploadImg = axios.create({
	baseURL: urls.baseUrl,
	method: 'post',
	// timeout: 1000,
})
let myGet = axios.create({
	baseURL: urls.baseUrl,
	method: 'get',
	// timeout: 1000,
})
let myDelete = axios.create({
	baseURL: urls.baseUrl,
	method: 'delete',
	// timeout: 1000,
})
let myPut = axios.create({
	baseURL: urls.baseUrl,
	method: 'put',
	// timeout: 1000,
})
let dzpMyPost = axios.create({
	baseURL: urls.dzpBaseUrl,
	method: 'post',
	// timeout: 1000,
})
let dzpMyGet = axios.create({
	baseURL: urls.dzpBaseUrl,
	method: 'get',
	// timeout: 1000,
})
let dzpMyDelete = axios.create({
	baseURL: urls.dzpBaseUrl,
	method: 'delete',
	// timeout: 1000,
})
let dzpMyPut = axios.create({
	baseURL: urls.dzpBaseUrl,
	method: 'put',
	// timeout: 1000,
})
axios.defaults.adapter = function(config) { //自己定义个适配器，用来适配uniapp的语法
	return new Promise((resolve, reject) => {
		var settle = require('axios/lib/core/settle');
		var buildURL = require('axios/lib/helpers/buildURL');
		uni.request({
			method: config.method.toUpperCase(),
			url: config.baseURL + buildURL(config.url, config.params, config.paramsSerializer),
			header: config.headers,
			data: config.data,
			dataType: config.dataType,
			responseType: config.responseType,
			sslVerify: config.sslVerify,
			complete: function complete(response) {
				response = {
					data: response.data,
					status: response.statusCode,
					errMsg: response.errMsg,
					header: response.header,
					config: config
				};

				settle(resolve, reject, response);
			}
		})
	})
}
myPut.interceptors.request.use(config => {
	if (uni.getStorageSync('token')) {
		config.headers = {
			'Accept': 'application/json',
			'Authorization': `Bearer ${uni.getStorageSync('token')}`
			// 'token':  uni.getStorageSync('token'),
			// 'Access-Control-Allow-Origin': '*',
			// "access-control-allow-credentials": "true"
		}
		// config.headers.token = uni.getStorageSync('token');
	}
	console.log(config)
	return config;
}, error => {
	console.log(error);
	return Promise.reject();
})
myDelete.interceptors.request.use(config => {
	if (uni.getStorageSync('token')) {
		config.headers = {
			'Accept': 'application/json',
			'Authorization': `Bearer ${uni.getStorageSync('token')}`
			// 'token':  uni.getStorageSync('token'),
			// 'Access-Control-Allow-Origin': '*',
			// "access-control-allow-credentials": "true"
		}
		// config.headers.token = uni.getStorageSync('token');
	}
	console.log(config)
	return config;
}, error => {
	console.log(error);
	return Promise.reject();
})
myPost.interceptors.request.use(config => {
	if (uni.getStorageSync('token')) {
		config.headers = {
			'Accept': 'application/json',
			'Authorization': `Bearer ${uni.getStorageSync('token')}`
			// 'token':  uni.getStorageSync('token'),
			// 'Access-Control-Allow-Origin': '*',
			// "access-control-allow-credentials": "true"
		}
		// config.headers.token = uni.getStorageSync('token');
	}
	console.log(config)
	return config;
}, error => {
	console.log(error);
	return Promise.reject();
})
myUploadImg.interceptors.request.use(config => {
	if (uni.getStorageSync('token')) {
		config.headers = {
			"Content-Type": "multipart/form-data;charse=UTF-8",
			'Authorization': `Bearer ${uni.getStorageSync('token')}`,
		}
		// config.headers.token = uni.getStorageSync('token');
	}
	console.log(config)
	return config;
}, error => {
	console.log(error);
	return Promise.reject();
})
myDelete.interceptors.response.use(response => {
	// console.log(response)
	if (response.status === 200) {
		if (response.data.code == 401) {
			uni.navigateTo({
				url: '/pages/login/index'
			})
		} else {
			return response.data
		}
	}
	// if (response.status === 200 && response.data.code == '200') {
	//     vue.$message({
	//         message: response.data.msg,
	//         type: "success",
	//     });
	//     return response.data;
	// }
	else {
		vue.$message.error(response.data.info);
		Promise.reject();
	}
}, error => {
	//错误跳转
	console.log(error)
	if (error.response.status === 500) {
		console.log(vue)
		if (error.response.data.info != '参数错误') {
			vue.$message.error(error.response.data.info);
		}
	} else if (error.response.status === 401) {
		sessionStorage.setItem("isLogin", false);
		console.log(sessionStorage.getItem("isLogin"));
		// router.push({ path: "/" })
		// router.go(0)
		return Promise.reject();
	} else if (error.response.status === 404) {
		vue.$alert('页面不存在', '404错误', {
			confirmButtonText: '确定',
		});
		return Promise.reject();
	} else if (error.response.status === 402) {
		vue.$alert('请求次数限制', '402错误', {
			confirmButtonText: '确定',
		});
		return Promise.reject();
	} else {
		if (error.response.data.info != '参数错误') {
			vue.$message.error(error.response.data.info);
		}
	}
})
myUploadImg.interceptors.response.use(response => {
	// console.log(response)
	if (response.status === 200) {
		if (response.data.code == 401) {
			uni.navigateTo({
				url: '/pages/login/index'
			})
		} else {
			return response.data
		}
	}
	// if (response.status === 200 && response.data.code == '200') {
	//     vue.$message({
	//         message: response.data.msg,
	//         type: "success",
	//     });
	//     return response.data;
	// }
	else {
		vue.$message.error(response.data.info);
		Promise.reject();
	}
}, error => {
	//错误跳转
	console.log(error)
	if (error.response.status === 500) {
		console.log(vue)
		if (error.response.data.info != '参数错误') {
			vue.$message.error(error.response.data.info);
		}
	} else if (error.response.status === 401) {
		sessionStorage.setItem("isLogin", false);
		console.log(sessionStorage.getItem("isLogin"));
		// router.push({ path: "/" })
		// router.go(0)
		return Promise.reject();
	} else if (error.response.status === 404) {
		vue.$alert('页面不存在', '404错误', {
			confirmButtonText: '确定',
		});
		return Promise.reject();
	} else if (error.response.status === 402) {
		vue.$alert('请求次数限制', '402错误', {
			confirmButtonText: '确定',
		});
		return Promise.reject();
	} else {
		if (error.response.data.info != '参数错误') {
			vue.$message.error(error.response.data.info);
		}
	}
})
myGet.interceptors.request.use(config => {
	if (uni.getStorageSync('token')) {
		config.headers = {
			'Accept': 'application/json',
			// 'token': sessionStorage.token,
			'Authorization': `Bearer ${uni.getStorageSync('token')}`,
			'Access-Control-Allow-Origin': '*',
			"access-control-allow-credentials": "true"
		}
		config.headers.token = uni.getStorageSync('token');
	}
	return config;
}, error => {
	console.log(error);
	return Promise.reject();
})
myPut.interceptors.response.use(response => {
	// console.log(response)
	if (response.status === 200) {
		if (response.data.code == 401) {
			uni.navigateTo({
				url: '/pages/login/index'
			})
		} else {
			return response.data
		}
	}
	// if (response.status === 200 && response.data.code == '200') {
	//     vue.$message({
	//         message: response.data.msg,
	//         type: "success",
	//     });
	//     return response.data;
	// }
	else {
		vue.$message.error(response.data.info);
		Promise.reject();
	}
}, error => {
	//错误跳转
	console.log(error)
	if (error.response.status === 500) {
		console.log(vue)
		if (error.response.data.info != '参数错误') {
			vue.$message.error(error.response.data.info);
		}
	} else if (error.response.status === 401) {
		sessionStorage.setItem("isLogin", false);
		console.log(sessionStorage.getItem("isLogin"));
		// router.push({ path: "/" })
		// router.go(0)
		return Promise.reject();
	} else if (error.response.status === 404) {
		vue.$alert('页面不存在', '404错误', {
			confirmButtonText: '确定',
		});
		return Promise.reject();
	} else if (error.response.status === 402) {
		vue.$alert('请求次数限制', '402错误', {
			confirmButtonText: '确定',
		});
		return Promise.reject();
	} else {
		if (error.response.data.info != '参数错误') {
			vue.$message.error(error.response.data.info);
		}
	}
})
myPost.interceptors.response.use(response => {
	// console.log(response)
	if (response.status === 200) {
		if (response.data.code == 410000) {
			uni.navigateTo({
				url: '/pages/login/index'
			})
		} else {
			return response.data
		}
	}
	// if (response.status === 200 && response.data.code == '200') {
	//     vue.$message({
	//         message: response.data.msg,
	//         type: "success",
	//     });
	//     return response.data;
	// }
	else {
		vue.$message.error(response.data.info);
		Promise.reject();
	}
}, error => {
	//错误跳转
	console.log(error)
	if (error.response.status === 500) {
		console.log(vue)
		if (error.response.data.info != '参数错误') {
			vue.$message.error(error.response.data.info);
		}
	} else if (error.response.status === 410000) {
		sessionStorage.setItem("isLogin", false);
		console.log(sessionStorage.getItem("isLogin"));
		// router.push({ path: "/" })
		// router.go(0)
		return Promise.reject();
	} else if (error.response.status === 404) {
		vue.$alert('页面不存在', '404错误', {
			confirmButtonText: '确定',
		});
		return Promise.reject();
	} else if (error.response.status === 402) {
		vue.$alert('请求次数限制', '402错误', {
			confirmButtonText: '确定',
		});
		return Promise.reject();
	} else {
		if (error.response.data.info != '参数错误') {
			vue.$message.error(error.response.data.info);
		}
	}
})
myGet.interceptors.response.use(response => {
	if (response.status === 200) {
		if (response.data.code == 410001) {
			uni.navigateTo({
				url: '/pages/login/index'
			})
		} else {
			return response.data
		}
	}
	// if (response.status === 200 && response.data.code == '200') {
	//     vue.$message({
	//         message: response.data.msg,
	//         type: "success",
	//     });
	//     return response.data;
	// }
	else {
		vue.$message.error(response.data.info);
		Promise.reject();
	}
}, error => {
	//错误跳转
	console.log(error);
	if (error.response.status === 500) {
		if (error.response.data.info != '参数错误') {
			vue.$message.error(error.response.data.info);
		}
	} else if (error.response.status === 410001) {
		sessionStorage.setItem("isLogin", false);
		console.log(sessionStorage.getItem("isLogin"));
		// router.push({ path: "/" })
		// router.go(0)
		return Promise.reject();
	} else if (error.response.status === 404) {
		vue.$alert('页面不存在', '404错误', {
			confirmButtonText: '确定',
		});
		return Promise.reject();
	} else if (error.response.status === 402) {
		vue.$alert('请求次数限制', '402错误', {
			confirmButtonText: '确定',
		});
		return Promise.reject();
	} else {
		if (error.response.data.info != '参数错误') {
			vue.$message.error(error.response.data.info);
		}
	}
})

dzpMyPut.interceptors.request.use(config => {
	if (uni.getStorageSync('token')) {
		config.headers = {
			'Accept': 'application/json',
			'Authorization': `Bearer ${uni.getStorageSync('token')}`
			// 'token':  uni.getStorageSync('token'),
			// 'Access-Control-Allow-Origin': '*',
			// "access-control-allow-credentials": "true"
		}
		// config.headers.token = uni.getStorageSync('token');
	}
	console.log(config)
	return config;
}, error => {
	console.log(error);
	return Promise.reject();
})
dzpMyPost.interceptors.request.use(config => {
	if (uni.getStorageSync('token')) {
		config.headers = {
			'Accept': 'application/json',
			'Authorization': `Bearer ${uni.getStorageSync('token')}`
			// 'token':  uni.getStorageSync('token'),
			// 'Access-Control-Allow-Origin': '*',
			// "access-control-allow-credentials": "true"
		}
		// config.headers.token = uni.getStorageSync('token');
	}
	console.log(config)
	return config;
}, error => {
	console.log(error);
	return Promise.reject();
})
dzpMyGet.interceptors.request.use(config => {
	if (uni.getStorageSync('token')) {
		config.headers = {
			'Accept': 'application/json',
			// 'token': sessionStorage.token,
			'Authorization': `Bearer ${uni.getStorageSync('token')}`,
			'Access-Control-Allow-Origin': '*',
			"access-control-allow-credentials": "true"
		}
		config.headers.token = uni.getStorageSync('token');
	}
	return config;
}, error => {
	console.log(error);
	return Promise.reject();
})
dzpMyPut.interceptors.response.use(response => {
	// console.log(response)
	if (response.status === 200) {
		if (response.data.code == 401) {
			uni.navigateTo({
				url: '/pages/login/index'
			})
		} else {
			return response.data
		}
	}
	// if (response.status === 200 && response.data.code == '200') {
	//     vue.$message({
	//         message: response.data.msg,
	//         type: "success",
	//     });
	//     return response.data;
	// }
	else {
		vue.$message.error(response.data.info);
		Promise.reject();
	}
}, error => {
	//错误跳转
	console.log(error)
	if (error.response.status === 500) {
		console.log(vue)
		if (error.response.data.info != '参数错误') {
			vue.$message.error(error.response.data.info);
		}
	} else if (error.response.status === 401) {
		sessionStorage.setItem("isLogin", false);
		console.log(sessionStorage.getItem("isLogin"));
		// router.push({ path: "/" })
		// router.go(0)
		return Promise.reject();
	} else if (error.response.status === 404) {
		vue.$alert('页面不存在', '404错误', {
			confirmButtonText: '确定',
		});
		return Promise.reject();
	} else if (error.response.status === 402) {
		vue.$alert('请求次数限制', '402错误', {
			confirmButtonText: '确定',
		});
		return Promise.reject();
	} else {
		if (error.response.data.info != '参数错误') {
			vue.$message.error(error.response.data.info);
		}
	}
})
dzpMyPost.interceptors.response.use(response => {
	// console.log(response)
	if (response.status === 200) {
		if (response.data.code == 401) {
			uni.navigateTo({
				url: '/pages/login/index'
			})
		} else {
			return response.data
		}
	}
	// if (response.status === 200 && response.data.code == '200') {
	//     vue.$message({
	//         message: response.data.msg,
	//         type: "success",
	//     });
	//     return response.data;
	// }
	else {
		vue.$message.error(response.data.info);
		Promise.reject();
	}
}, error => {
	//错误跳转
	console.log(error)
	if (error.response.status === 500) {
		console.log(vue)
		if (error.response.data.info != '参数错误') {
			vue.$message.error(error.response.data.info);
		}
	} else if (error.response.status === 401) {
		sessionStorage.setItem("isLogin", false);
		console.log(sessionStorage.getItem("isLogin"));
		// router.push({ path: "/" })
		// router.go(0)
		return Promise.reject();
	} else if (error.response.status === 404) {
		vue.$alert('页面不存在', '404错误', {
			confirmButtonText: '确定',
		});
		return Promise.reject();
	} else if (error.response.status === 402) {
		vue.$alert('请求次数限制', '402错误', {
			confirmButtonText: '确定',
		});
		return Promise.reject();
	} else {
		if (error.response.data.info != '参数错误') {
			vue.$message.error(error.response.data.info);
		}
	}
})
dzpMyGet.interceptors.response.use(response => {
	if (response.status === 200) {
		if (response.data.code == 401) {
			uni.navigateTo({
				url: '/pages/login/index'
			})
		} else {
			return response.data
		}
	}
	// if (response.status === 200 && response.data.code == '200') {
	//     vue.$message({
	//         message: response.data.msg,
	//         type: "success",
	//     });
	//     return response.data;
	// }
	else {
		vue.$message.error(response.data.info);
		Promise.reject();
	}
}, error => {
	//错误跳转
	console.log(error);
	if (error.response.status === 500) {
		if (error.response.data.info != '参数错误') {
			vue.$message.error(error.response.data.info);
		}
	} else if (error.response.status === 401) {
		sessionStorage.setItem("isLogin", false);
		console.log(sessionStorage.getItem("isLogin"));
		// router.push({ path: "/" })
		// router.go(0)
		return Promise.reject();
	} else if (error.response.status === 404) {
		vue.$alert('页面不存在', '404错误', {
			confirmButtonText: '确定',
		});
		return Promise.reject();
	} else if (error.response.status === 402) {
		vue.$alert('请求次数限制', '402错误', {
			confirmButtonText: '确定',
		});
		return Promise.reject();
	} else {
		if (error.response.data.info != '参数错误') {
			vue.$message.error(error.response.data.info);
		}
	}
})

export default {
	apiLogin(obj) {
		return myPost({
			url: urls.apiLogin,
			data: {
				...obj
			}
		})
	},
	apiRegister(obj) {
		return myPost({
			url: urls.apiRegister,
			data: {
				...obj
			}
		})
	},
	mobile(obj) {
		return myPost({
			url: urls.mobile,
			data: {
				...obj
			}
		})
	},
	silenceAuth(obj) {
		return myGet({
			url: urls.silence_auth,
			params: {
				...obj
			}
		})
	},
	bind_mini_phone(obj) {
		return myPost({
			url: urls.bind_mini_phone,
			data: {
				...obj
			}
		})
	},
	getUserInfo(obj) {
		return myGet({
			url: urls.user,
			params: {
				...obj
			}
		})
	},
	userEdit(obj) {
		return myPost({
			url: urls.user_update,
			data: {
				...obj
			}
		})
	},
	verifyCode() {
		return myGet({
			url: urls.verifyCode
		})
	},
	registerVerify(obj) {
		return myPost({
			url: urls.registerVerify,
			data: {
				...obj
			}
		})
	},
	updatePhone(obj) {
		return myPost({
			url: urls.user_update,
			data: {
				...obj
			}
		})
	},
	addressList() {
		return myGet({
			url: urls.addressList
		})
	},
	editAddress(obj) {
		return myPost({
			url: urls.editAddress,
			data: {
				...obj
			}
		})
	},
	delAddress(obj) {
		return myPost({
			url: urls.delAddress,
			data: {
				...obj
			}
		})
	},
	cartlist() {
		return myGet({
			url: urls.cartlist
		})
	},
	cartDel(id) {
		return myPost({
			url: urls.cartDel,
			data: {
				ids:id
			}
		})
	},
	changeCartNum(obj) {
		return myPost({
			url: urls.cartNum,
			data: {
				...obj
			}
		})
	},
	collectDoctor(id) {
		return myPost({
			url: urls.collectDoctor,
			data: {
				doctor_id:id
			}
		})
	},
	collectDoctorlist(obj) {
		return myGet({
			url: urls.collectDoctorlist,
			params: {
				...obj
			}
		})
	},
	spreadBanner(type) {
		return myGet({
			url: urls.spreadBanner,
			params:{
				type:type
			}
		})
	},
	orderComment(obj) {
		return myPost({
			url: urls.orderComment,
			data: {
				...obj
			}
		})
	},
	myCommentDel(id) {
		return myPost({
			url: urls.myCommentDel,
			data: {
				id
			}
		})
	},
	integralList(obj) {
		return myGet({
			url: urls.integralList,
			params: {
				...obj
			}
		})
	},
	getOrderDetail(uni, cart_id){
		return myGet({
			url: urls.orderDetail +"/"+ uni + `${cart_id ? `/${cart_id}`:''}`
		})
	},
	collectAdd(id) {
		return myPost({
			url: urls.collectAdd,
			data: {
				id
			}
		})
	},
	collectDel(id) {
		return myPost({
			url: urls.collectDel,
			data: {
				id
			}
		})
	},
	userCollect(obj) {
		return myGet({
			url: urls.userCollect,
			params: {
				...obj
			}
		})
	},
	orderDel(uni) {
		return myPost({
			url: urls.orderDel,
			data: {
				uni
			}
		})
	},
	myCommentList(obj) {
		return myGet({
			url: urls.myCommentList,
			params: {
				...obj
			}
		})
	},
	myAppointmentlist(obj) {
		return myGet({
			url: urls.myAppointmentlist,
			params: {
				...obj
			}
		})
	},
	orderWaitpay(uni) {
		return myPost({
			url: urls.orderWaitpay,
			data: {
				uni
			}
		})
	},
	spreadPeople(obj) {
		return myPost({
			url: urls.spreadPeople,
			data: {
				...obj
			}
		})
	},
	spreadPeopleCount(obj) {
		return myGet({
			url: urls.spreadPeopleCount,
			params: {
				...obj
			}
		})
	},
	getRefundOrderDetail(uni, cart_id){
		return myGet({
			url: urls.refundOrderDetail +"/" + uni + `${cart_id ? `/${cart_id}`:''}`
		})
	},
	ordeRefundReason() {
		return myGet({
			url: urls.ordeRefundReason
		})
	},
	orderRefundVerify(obj) {
		return myPost({
			url: urls.orderRefundVerify,
			data: {
				...obj
			}
		})
	},
	refundExpress(obj) {
		return myPost({
			url: urls.refundExpress,
			data: {
				...obj
			}
		})
	},
	getCartCounts(numType) {
		return myGet({
			url: urls.getCartCounts,
			params: {
				numType: numType === undefined ? 0 : numType
			}
		})
	},
	newlist(id){
		return myGet({
			url: urls.newlist+"/"+id
		})
	},
	xieyi(){
		return myGet({
			url: urls.xieyi
		})
	},
	guanggao(){
		return myGet({
			url: urls.guanggao
		})
	},
	getArticleDetails(id){
		return myGet({
			url: urls.articleDetails+"/"+id
		})
	},
	getLiveList(){
		return myGet({
			url: urls.wechatLive
		})
	},
	lianxifangshi(){
		return myGet({
			url: urls.lianxifangshi
		})
	},
	upload_pic(file, type) {
		return new Promise(async (resolve, reject) => {
			uni.uploadFile({
				url: `${urls.baseUrl}${urls.upload_pic}`,
				filePath: file.path,
				header: {
					"Content-Type": "multipart/form-data;charse=UTF-8",
					'Authorization': `Bearer ${uni.getStorageSync('token')}`,
				},
				name: 'image',
				formData: {
					token: uni.getStorageSync('token'),
					type,
				},
				success: (res) => {
					if (JSON.parse(res.data).code == 401) {
						uni.navigateTo({
							url: '/pages/login/index'
						})
					}
					return resolve(JSON.parse(res.data))
				}
			})
		})
	},
	category(obj) {
		return myGet({
			url: urls.category,
			params: {
				...obj
			}
		})
	},
	products(obj) {
		return myGet({
			url: urls.products,
			params: {
				...obj
			}
		})
	},
	detail(id) {
		return myGet({
			url: `${urls.detail}/${id}`,
		})
	},
	cartAdd(obj) {
		return myPost({
			url: urls.cartAdd,
			data: {
				...obj
			}
		})
	},
	getAddressDetail(id) {
		return myGet({
			url: `${urls.addressDetail}/${id}`,
		})
	},
	cityList() {
		return myGet({
			url: urls.city_list
		})
	},
	orderCancel(id) {
		return myPost({
			url: urls.orderCancel,
			data: {
				id
			}
		})
	},
	orderConfirm(obj) {
		return myPost({
			url: urls.orderConfirm,
			data: {
				...obj
			}
		})
	},
	orderCreate(obj,key) {
		return myPost({
			url: `${urls.orderCreate}/${key}`,
			data: {
				...obj
			}
		})
	},
	orderList(obj) {
		return myGet({
			url: urls.orderList,
			params: {
				...obj
			}
		})
	},
	orderPay(obj) {
		return myPost({
			url: urls.orderPay,
			data: {
				...obj
			}
		})
	},
	zhuanjia(obj) {
		return myGet({
			url: urls.zhuanjia,
			params: {
				...obj
			}
		})
	},
	xiufu(obj) {
		return myGet({
			url: urls.xiufu,
			params: {
				...obj
			}
		})
	},
	orderComputed(obj,key) {
		return myPost({
			url: `${urls.orderComputed}/${key}`,
			data: {
				...obj
			}
		})
	},
	productHot(obj) {
		return myGet({
			url: urls.productHot,
			params: {
				...obj
			}
		})
	},
	searchKeyword(obj) {
		return myGet({
			url: urls.searchKeyword,
			params: {
				...obj
			}
		})
	},
	position(obj) {
		return myGet({
			url: urls.position,
			params: {
				...obj
			}
		})
	},
	banner(obj) {
		return myGet({
			url: urls.banner,
			params: {
				...obj
			}
		})
	},
	store_integralList(obj) {
		return myGet({
			url: urls.store_integralList,
			params: {
				...obj
			}
		})
	},
	yanxuan_index(obj) {
		return myGet({
			url: urls.yanxuan_index,
			params: {
				...obj
			}
		})
	},
	combinationDetail(id) {
		return myGet({
			url: `${urls.combinationDetail}/${id}`,
		})
	},
	replyList(obj,id) {
		return myGet({
			url: `${urls.replyList}/${id}`,
			params:{
				...obj
			}
		})
	},
	orderAgain(obj) {
		return myPost({
			url: urls.orderAgain,
			data: {
				...obj
			}
		})
	},
	orderTake(obj) {
		return myPost({
			url: `${urls.orderTake}`,
			data:{
				...obj
			}
		})
	},
	combinationPink(id) {
		return myGet({
			url: `${urls.combinationPink}/${id}`,
		})
	},
	combinationRemove(obj) {
		return myPost({
			url: urls.combinationRemove,
			data: {
				...obj
			}
		})
	},
	store_integralDetail(id) {
		return myGet({
			url: `${urls.store_integralDetail}/${id}`,
		})
	},
	spread_info() {
		return myGet({
			url: `${urls.spread_info}`,
		})
	},
	store_integralOrderConfirm(obj) {
		return myPost({
			url: `${urls.store_integralOrderConfirm}`,
			data:{
				...obj
			}
		})
	},
	store_integralOrderCreate(obj) {
		return myPost({
			url: `${urls.store_integralOrderCreate}`,
			data:{
				...obj
			}
		})
	},
	store_integralOrderList(obj) {
		return myGet({
			url: `${urls.store_integralOrderList}`,
			params:{
				...obj
			}
		})
	},
	store_integralOrderTake(obj) {
		return myPost({
			url: `${urls.store_integralOrderTake}`,
			data:{
				...obj
			}
		})
	},
	store_integralOrderCount_num() {
		return myGet({
			url: `${urls.store_integralOrderCount_num}`,
		})
	},
	userRoutine_code() {
		return myGet({
			url: `${urls.userRoutine_code}`,
		})
	},
}
