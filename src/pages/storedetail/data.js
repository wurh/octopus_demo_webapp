export default {
	headData: {
		bgAminal: true,
		color: '#333',
		shareInfo: null
	},
	showMsg: '',
	toast: false,
	toastTimer:'',
	GroupPurchasePageBlock: {
		title: {
			desc: 'Group Purchase',
			isTitleRight: false
		},
		footer: {
			desc: 'View More >>',
			isFooter: true,
			titleRightIcon: 'arrow',
			haslinebottom: false,
			link: '',
		}
	},
	facebookPageBlock: {
		title: {
			desc: 'Feedback(112)',
			isTitleRight: true,
			titleRightTxt: "ALL",
			titleRightIcon: 'arrow',
			link: '#'
		},
		footer: {
			isFooter: false
		}
	},
	dialogPageBlock: {
		title: {
			desc: 'Group Purchase',
			isTitleRight: true,
			titleRightTxt: "",
			titleRightIcon: 'close'
		},
		footer: {
			isFooter: false
		}
	},
	boxStyle: {
		'margin-left': '8px'
	},
	joinBoxStyle: {
		'margin': '0 8px'
	},
	activeTab: 'tab1',
	showShare: false,
	isLoading: false,
	dialog: false,
	isShowing:false,
	bottomPopup_attr: false,
	feedback: [
		// {
		// 	imgUrl: '//a2.vimage1.com/upload/merchandise/pdcvis/601726/2017/0618/9/ba1e5826-94d5-437d-ad08-54dccc1e7259_t_218x274_70.jpg',
		// 	username: 'joel.shen',
		// 	desc: 'Great shorts,size approached. I recommend! Thank you very much! ',
		// 	time: '2017.02.12',
		// 	skuArr: 'Color: Multi   Size: M'
		// }, {
		// 	imgUrl: '//a4.vimage1.com/upload/merchandise/pdc/721/037/309980428891037721/0/7C5710630103-5_218x274_70.jpg',
		// 	username: 'joel.shen',
		// 	desc: 'Great shorts,size approached. I recommend! Thank you very much! ',
		// 	time: '2017.02.12',
		// 	skuArr: 'Color: Multi   Size: M'
		// }
	],
	userQuantity: 0,
	groupsPurchased: 0,
	detailInfo:{
		specifications: {},
		longDescription: '',
	},
	modelInfo: {},
	shipInfoDesc: '',
	productInfo: {
		productName: '',
		marketPrice: '',
		sellPrice: '',
		groupPrice: '',
		groupPrice: '',
		attributeList: [],
		detailImages: [],
		mediumImage: '',
		shipInfoDesc: "",
		productCategoryId: "",
		detailInfo: {
			longDescription: "",
			specifications: {}
		}
	},
	recommendation: [],
	attrShow: '',
	skaPrice: '',
	unit: '',
	orderType: 1,
	sizeGuideInfo: null,
	sizeTableCm: [],
	underwayGroupCount: 0,
	start_time:null,
	popProductInfo: null,
	popAttributeList: [],
	groupId: '',
	salesmanId: '',
	ordersalesmanId: '',
	store: null,
	isSoldOut: false,
	hasAdd: false,
	isStorer: false
}
