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
	feedback: [],
	userQuantity: 0,
	store: null,
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
	sizeGuideInfo: null,
	sizeTableCm: [],
	underwayGroupCount: 0,
	start_time:null,
	popProductInfo: null,
	popAttributeList: [],
	groupId: '',
	deviceWidth:0,
	swiperHeight:0,
	isBeautyImage:false,
	isSoldOut: false
}
