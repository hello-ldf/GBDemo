//<!--初始化数据-->
var itemNo = 1; // 项次
var server = localStorage.getItem("server"); // 服务器ip、端口
var user = JSON.parse(localStorage.getItem("userJson")); // 用户信息
var area = JSON.parse(localStorage.getItem("areaJson")); // 地区信息
var colors = null; // 临时存放colors信息
var colorPicker = new mui.PopPicker();;

//<!--二维码-->
//var img = null; // 保存图像
//var blist = []; // 未知

// 被子窗口调用			
function scaned(r) {
	resetModal();
	$("#pNo").val(r);
	GetProduct();
}

//<!--基本功能加载-->
// function  begin  **************************************************************				
(function($, doc) {

	// mui配置初始化
	$.init({
		keyEventBind: {
			backbutton: false //关闭back按键监听
		},
		gestureConfig: {
			longtap: true
		}
	});

	// 送货日期控件
	var btns = $('#deliver_Date');
	btns.each(function(i, btn) {
		btn.addEventListener('tap', function() {
			var optionsJson = this.getAttribute('data-options') || '{}';
			var options = JSON.parse(optionsJson);
			var id = this.getAttribute('id');
			var picker = new $.DtPicker(options);
			picker.show(function(rs) {
				/*
				 * rs.value 拼合后的 value
				 * rs.text 拼合后的 text
				 * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
				 * rs.m 月，用法同年
				 * rs.d 日，用法同年
				 * rs.h 时，用法同年
				 * rs.i 分（minutes 的第二个字母），用法同年
				 */
				btn.innerText = rs.text;
				picker.dispose();
			});
		}, false);
	});

	// mui.ready  -----------------------------------------------------------------
	$.ready(function() {
		// 获取全局参数
		var global = JSON.parse(localStorage.getItem("globalJson"));

		// 销售网点
		var stationPicker = new $.PopPicker();
		stationPicker.setData(global.stations);
		var stationButton = doc.getElementById('btn_station');
		stationButton.addEventListener('tap', function(event) {
			stationPicker.show(function(items) {
				stationButton.innerText = items[0].text;
				$("#station")[0].innerText = items[0].value;
			});
		}, false);

		// 业务员
		var salerPicker = new $.PopPicker();
		salerPicker.setData(global.salers);
		var salerButton = doc.getElementById('btn_saler');
		salerButton.addEventListener('tap', function(event) {
			salerPicker.show(function(items) {
				salerButton.innerText = items[0].text;
				$("#saler")[0].innerText = items[0].value;
			});
		}, false);

		// 客户分类
		var custmClassifyPicker = new $.PopPicker();
		custmClassifyPicker.setData(global.custclas);
		var custmClassifyButton = doc.getElementById('btn_custm_Classify');
		custmClassifyButton.addEventListener('tap', function(event) {
			custmClassifyPicker.show(function(items) {
				custmClassifyButton.innerText = items[0].text;
				$("#custm_Classify")[0].innerText = items[0].value;
			});
		}, false);

		// 签约设计师
		var signDesignerPicker = new $.PopPicker();
		signDesignerPicker.setData(global.singnstylists);
		var signDesignerButton = doc.getElementById('btn_sign_designer');
		signDesignerButton.addEventListener('tap', function(event) {
			signDesignerPicker.show(function(items) {
				signDesignerButton.innerText = items[0].text;
				$("#signed_designer")[0].innerText = items[0].value;
			});
		}, false);
		// 付款条件
		var payTermPicker = new $.PopPicker();
		payTermPicker.setData(global.payments);
		var payTermButton = doc.getElementById('btn_pay_term');
		payTermButton.addEventListener('tap', function(event) {
			payTermPicker.show(function(items) {
				payTermButton.innerText = items[0].text;
				$("#pay_term")[0].innerText = items[0].value;
			});
		}, false);

		// 结算方式
		var payWayPicker = new $.PopPicker();
		payWayPicker.setData(global.settleModes);
		var payWayButton = doc.getElementById('btn_pay_way');
		payWayButton.addEventListener('tap', function(event) {
			payWayPicker.show(function(items) {
				payWayButton.innerText = items[0].text;
				$("#pay_way")[0].innerText = items[0].value;
			});
		}, false);

		// 仓库
		var storePicker = new $.PopPicker();
		storePicker.setData(global.stores);
		var storeButton = doc.getElementById('btn_store');
		storeButton.addEventListener('tap', function(event) {
			storePicker.show(function(items) {
				storeButton.innerText = items[0].text;
				$("#store")[0].innerText = items[0].value;
			});
		}, false);

		// 返回  提示
		var old_back = mui.back;
		mui.back = function() {
			var btn = ["取消", "确定"];
			mui.confirm('确认关闭当前窗口？', '提示', btn, function(e) {
				if(e.index == 1) {
					//执行mui封装好的窗口关闭逻辑；
					old_back();
				}
			});
		}

	});
	// mui.ready  -----------------------------------------------------------------

})(mui, document);
// function  end  **************************************************************	

// 加载自定义模板
function loadMould() {
	var mould = JSON.parse(localStorage.getItem("mould"));
	$("#btn_station").text(mould.btn_station);
	$("#station").text(mould.station);
	$("#btn_saler").text(mould.btn_saler);
	$("#saler").text(mould.saler);
	$("#custm_name").val(mould.custm_name);
	$("#btn_custm_Classify").text(mould.btn_custm_Classify);
	$("#custm_Classify").text(mould.custm_Classify);
	$("#deliver_Addr").val(mould.deliver_Addr);
	$("#designer").val(mould.designer);
	$("#btn_sign_designer").text(mould.btn_sign_designer);
	$("#signed_designer").text(mould.signed_designer);
	$("#GroupBuy_No").val(mould.GroupBuy_No);
	$("#btn_pay_term").text(mould.btn_pay_term);
	$("#pay_term").text(mould.pay_term);
	$("#btn_pay_way").text(mould.btn_pay_way);
	$("#pay_way").text(mould.pay_way);
	$("#remark").val(mould.remark);
	$("#btn_store").text(mould.btn_store);
	$("#store").text(mould.store);
	$("#discountText").val(mould.discountText);
	$("#discount").text(mould.discount);
}

function loadOrder(ccode) {
	mui.ajax({
		type: "post",
		crossDomain: true,
		headers: {
			'Content-Type': 'application/json'
		},
		url: server + "/Global/GetOrder",
		data: "{db:" + JSON.stringify(area.areaValue) + ", ccode:" + JSON.stringify(ccode) + ",flag: 1}",
		dataType: "json",
		success: function(data) {
			var orderQry = JSON.parse(data);
			var corder = orderQry.corder;
			var cordercs = orderQry.cordercs;
			var customer = orderQry.customer;

			// 单头  begin  **********************************************************************************
			var global = JSON.parse(localStorage.getItem("globalJson"));
			$("#ccode").text(ccode);
			$("#ccustid").text(customer.CCUSTID);
			$("#ddate").text(corder.DDATE);
			$("#cfromcode").val(corder.cfromcode);
			$("#station").text(corder.cwhid);
			$.each(global.stations, function(i, station) {
				if(station.value == corder.cwhid) {
					$("#btn_station").text(station.text);
					return false;
				}
			});
			$("#saler").text(corder.CSALEMAN);
			$.each(global.salers, function(i, saler) {
				if(saler.value == corder.CSALEMAN) {
					$("#btn_saler").text(saler.text);
					return false;
				}
			});

			$("#custm_name").val(customer.CNAME);
			$("#custm_Classify").text(customer.CCLASSID);
			$.each(global.custclas, function(i, custcla) {
				if(custcla.value == customer.CCLASSID) {
					$("#btn_custm_Classify").text(custcla.text);
					return false;
				}
			});

			$("#phone").val(customer.cconmante);
			$("#deliver_Date").text(corder.DDEDT.substring(0, 10));
			$("#deliver_Addr").val(corder.CDEADR);
			$("#designer").val(corder.cstylist);
			$("#signed_designer").text(corder.csignstylistid);
			$.each(global.singnstylists, function(i, singnstylist) {
				if(singnstylist.value == corder.csignstylistid) {
					$("#btn_sign_designer").text(singnstylist.text);
					return false;
				}
			});

			$("#GroupBuy_No").val(corder.email);
			$("#pay_term").text(corder.CPYID);
			$.each(global.payments, function(i, payment) {
				if(payment.value == corder.CPYID) {
					$("#btn_pay_term").text(payment.text);
					return false;
				}
			});

			$("#pay_way").text(corder.cpyway);
			$.each(global.settleModes, function(i, settleMode) {
				if(settleMode.value == corder.cpyway) {
					$("#btn_pay_way").text(settleMode.text);
					return false;
				}
			});
			$("#deposit").val(corder.DPAYAMT);
			$("#remark").val(corder.CREMARK);
			$("#TotalAccount").text(corder.DAMT);
			// 单头  end  **********************************************************************************

			$.each(cordercs, function(i, corderc) {
				var html = "<li class='mui-table-view-cell mui-collapse'>\
							<a class='mui-navigate-right' href='#'>\
							<label class='c_dcost' style='display: none'>"+ corderc.DCOST + "</label>\
							<label class='c_itemNo'>" + corderc.IORDER + "</label>）\
							<label class='c_pNo'>" + corderc.CMTEID + "</label>\
							<label class='c_pName'>" + corderc.pName + "</label></a>\
						<div class='mui-collapse-content'>\
							<div class='mui-card-header' style='position: relative;height: 130px;'>\
								<div style='background: green; width:100px;height: 100px;'></div>\
								<div style='position:absolute;top: 0px;left:130px'>\
									规格：<label class='c_pSzie'>" + corderc.pSpec + "</label></div>\
								<div style='position:absolute;top: 20px;left:130px'>\
									颜色：<label class='cText_pColor'>" + corderc.pColor + "</label>\
									<label class='c_pColor hidden'>" + corderc.CCOLORID + "</label></div>\
								<div style='position:absolute;top: 40px;left:130px'>\
									非标：<label class='cText_non_standard_flag'>" + (corderc.cpoflag == 1 ? '是' : '否') +
					"<label class='c_non_standard_flag hidden'>" + corderc.cpoflag + "</label>\
										<label class='c_non_standard_info'>" + corderc.cpodesc + "</label></div>\
								<div style='position:absolute;top: 60px;left:130px'>\
									仓库：<label class='cText_store'>" + corderc.pStore + "</label>\
									<label class='c_store hidden'>" + corderc.CWHID + "</label></div>\
									<div style='position:absolute;top: 80px;left:130px'>\
									库存：<label class='c_inventory'>" + corderc.pInventory + "</label></div>\
								<div style='position:absolute;top: 100px;left:130px'>\
									属性：<label class='cText_attrItem'>" + corderc.pAttritem + "</label>\
									<label class='c_attrItem hidden'>" + corderc.cattrid + "</label></div></div>\
							<div class='mui-card-content'>\
								<div class='mui-numbox' data-numbox-min='1' style='width: 70%;height: 40px; margin-left: 15%;margin-top: 10px;' data-numbox-min='1'>\
									<button class='mui-btn-primary mui-btn-numbox-minus' style='width: 25%;' type='button'>-</button>\
									<input class='c_quantity mui-input-numbox' type='number' value='" + corderc.DQTY + "' onchange='itemSum(this)' oninput='itemSum(this)' />\
									<button class='mui-btn-primary mui-btn-numbox-plus' style='width: 25%;' type='button'>+</button></div>\
								<div style='float: right;margin-top: 20px;margin-right: 15px;'>\
									<label class='c_unit'>" + corderc.pUnit + "</label></div></div>\
							<div class='mui-card-footer' style='margin-top: 10px;padding:auto 0 !important;'>\
								<div style='float: left;'>折扣：<label class='c_discount'>" + corderc.drate + "</label></div>\
								<div style='float: left;'>折扣价：<label class='c_price'>" + corderc.DPRICE + "</label></div>\
								<div style='float: left;'>原价：<label class='c_price2'>" + corderc.dprice2 + "</label></div>\
								<div style='float: right;margin-right: 7%;'>\
									合计：<label class='c_account'>" + corderc.damtc + "</label></div>\
							</div></div></li>";

				$("#itemCards").append(html);
				itemNo += 1;
				mui('.mui-numbox').numbox();
			});
			Summary();
		},
		error: function(error) {
			alert("/Global/GetOrder" + error);
		}
	});
}

//<!--各种功能模块-->
// function  begin  ****************************************************************
$(function() {

	// 删除项目的监听事件
	$("#itemCards").on('longtap', 'li', function() {
		var li = this;
		var btnArray = ['否', '是'];
		mui.confirm('是否删除该产品？', 'Warning', btnArray, function(e) {
			if(e.index == 1) {
				li.remove();
				itemNo -= 1;
				reloadItemNo();
				Summary();
			}
		});
	});
});
// function  end  ****************************************************************

// 规定为 非负数值
function checkNum(obj) {
	var floatReg = /^\d+(\.\d*)?$/; // 非负浮点
	if(!floatReg.test(obj.value)) { // 不是数值
		obj.value = 0;
	} else {
		var reg = /[0]\d+/; // 0打头跟数字
		if(reg.test(obj.value)) {
			obj.value = parseFloat(obj.value);
		}
	}
};

// 设置COLOR_BTN
function setColorBtn() {
	var colorVal = $("#color").val();
	$("#btn_color").text("");
	$.each(colors, function(i, color) {
		if(color.value == colorVal) {
			$("#btn_color").text(color.text);
		}
	})
};

// 重置模态框内容
function resetModal() {
	$("#dcost").text("");
	$("#pNo").val("");
	$("#pName").val("");
	$("#attrItemText").val("");
	$("#attrItem").text("");
	$("#non_standard_flag").prop("checked", false);
	$("#non_standard_info").val("");
	$("#pSize").val("");
	$("#btn_color").text("无分色");
	$("#color").val("@");
	$("#quantity").val("0");
	$("#unit").text("");
	$("#inventory").val("0");
	$("#discount").text("1");
	$("#discountText").val(100);
	$("#price").val("0");
	$("#price2").val("0");
	$("#account").val("0");
}

// 重新加载项次
function reloadItemNo() {
	var itemNos = $("#itemCards li .c_itemNo");
	$.each(itemNos, function(i, itemno) {
		itemno.innerText = i + 1;
	})
};

// 添加项目	begin  *****************************************************************
function addItem() {

	// 没有产品信息  不能添加
	if($("#account").val() == null ||
		$("#account").val() == "" ||
		$("#account").val() == "0") {
		return;
	}
	
	// 添加项
	var html =
		"<li class='mui-table-view-cell mui-collapse'>\
				<a class='mui-navigate-right' href='#'>\
					<label class='c_dcost' style='display: none'>"+ $('#dcost').text() + "</label>\
					<label class='c_itemNo'>" + itemNo + "</label>）\
					<label class='c_pNo'>" + $('#pNo').val() + "</label>\
					<label class='c_pName'>" + $('#pName').val() + "</label></a>\
				<div class='mui-collapse-content'>\
					<div class='mui-card-header' style='position: relative;height: 130px;'>\
						<div style='background: green; width:100px;height: 100px;'></div>\
						<div style='position:absolute;top: 0px;left:130px'>\
							规格：<label class='c_pSzie'>" + $('#pSize').val() + "</label></div>\
						<div style='position:absolute;top: 20px;left:130px'>\
							颜色：<label class='cText_pColor'>" + $('#btn_color').text() + "</label>\
							<label class='c_pColor hidden'>" + $('#color').val() + "</label></div>\
						<div style='position:absolute;top: 40px;left:130px'>\
							非标：<label class='cText_non_standard_flag'>" + ($('#non_standard_flag').prop("checked") ? '是' : '否') +
		"<label class='c_non_standard_flag hidden'>" + ($('#non_standard_flag').prop("checked") ? 1 : 0) + "</label>\
								<label class='c_non_standard_info'>" + $('#non_standard_info').val() + "</label></div>\
						<div style='position:absolute;top: 60px;left:130px'>\
							仓库：<label class='cText_store'>" + $('#btn_store').text() + "</label>\
							<label class='c_store hidden'>" + $('#store').text() + "</label></div>\
						<div style='position:absolute;top: 80px;left:130px'>\
							库存：<label class='c_inventory'>" + $('#inventory').val() + "</label></div>\
						<div style='position:absolute;top: 100px;left:130px'>\
							属性：<label class='cText_attrItem'>" + $('#attrItemText').val() + "</label>\
							<label class='c_attrItem hidden'>" + $('#attrItem').text() + "</label></div></div>\
					<div class='mui-card-content'>\
						<div class='mui-numbox' data-numbox-min='1' style='width: 70%;height: 40px; margin-left: 15%;margin-top: 10px;' data-numbox-min='1'>\
							<button class='mui-btn-primary mui-btn-numbox-minus' style='width: 25%;' type='button'>-</button>\
							<input class='c_quantity mui-input-numbox' type='number' value='" + $(' #quantity ').val() + "' onchange='itemSum(this)' oninput='itemSum(this)' />\
							<button class='mui-btn-primary mui-btn-numbox-plus' style='width: 25%;' type='button'>+</button></div>\
						<div style='float: right;margin-top: 20px;margin-right: 15px;'>\
							<label class='c_unit'>" + $('#unit').text() + "</label></div></div>\
					<div class='mui-card-footer' style='margin-top: 10px;padding:auto 0 !important;'>\
						<div style='float: left;'>折扣：<label class='c_discount'>" + $('#discount').text() + "</label></div>\
						<div style='float: left;'>折扣价：<label class='c_price'>" + $('#price').val() + "</label></div>\
						<div style='float: left;'>原价：<label class='c_price2'>" + $('#price2').val() + "</label></div>\
						<div style='float: right;margin-right: 7%;'>\
							合计：<label class='c_account'>" + $('#account').val() + "</label></div>\
					</div></div></li>";

	$("#itemCards").append(html);
	itemNo += 1;
	mui('.mui-numbox').numbox();
	Summary();
	resetModal();
};
// 添加项目	end  *****************************************************************

// 获取产品   begin ****************************************************************
function GetProduct() {
	var pNo = JSON.stringify($("#pNo").val()); // 型号
	var db = JSON.stringify(area.areaValue); // 数据库

	// 获取产品
	mui.ajax({
		type: "post",
		crossDomain: true,
		headers: {
			'Content-Type': 'application/json'
		},
		url: server + "/Global/GetProduct",
		data: "{db:" + db + ", pNo:" + pNo + "}",
		dataType: "json",
		success: function(json) {
			if(json != null) {
				// 有数据返回  组合信息
				var productQry = JSON.parse(json);
				var product = productQry.product;
				var attrItem = productQry.attrItem;
				colors = productQry.colors;
				$("#dcost").text(product.DCOST);
				$("#pName").val(product.CCNAME);
				$("#attrItem").text(attrItem.cattrid);
				$("#attrItemText").val(attrItem.cname);
				$("#pSize").val(product.CSPEC);
				colorPicker.setData(colors);
				var colorButton = document.getElementById('btn_color');
				colorButton.addEventListener('tap', function(event) {
					colorPicker.show(function(items) {
						colorButton.innerText = items[0].text;
						$("#color")[0].value = items[0].value;
					});
				}, false);
				$("#quantity").val("1");
				$("#unit").text(productQry.cunit);
				$("#inventory").val(productQry.inventory);
				$("#price").val(product.DPRICE);
				$("#price2").val(product.DPRICE);
				$("#account").val(Math.round($("#price").val() * $("#quantity").val() * parseFloat($("#discount").text())));
			} else {
				// 没数据返回
				alert("产品不存在");
			}
		},
		error: function(error) {
			// 请求失败
			alert("Global/GetProduct，请求失败" + error);
		}
	});
};
// 获取产品   end ****************************************************************

// 提交订单  begin *********************************************************************
function AddOrder() {
	var btnArray = ['否', '是'];
	mui.confirm('保存订单，确认？', '提示', btnArray, function(e) {

		// 确认提交
		if(e.index == 1) {

			// 按钮不可选
			mui("#submitBtn").button('loading');

			// 错误信息
			var errorMsg = "";
			//			if($("#station").text() == '') errorMsg += '销售网点/';
			//			if($("#saler").text() == '') errorMsg += '业务员/';
			//			if($("#custm_name").val() == '') errorMsg += '客户姓名/';
			if($("#custm_Classify").text() == '') errorMsg += '客户分类/';
			if($("#date").text() == "选填") errorMsg += '交货日期/';
			if($("#phone").val() == '') errorMsg += '联系电话/';
			//			if($("#pay_term").text() == '') errorMsg += '付款条件/';
			//			if($("#pay_way").text() == '') errorMsg += '结算方式/';
			//			if($("#itemCards li").length == 0) errorMsg += '产品/';
			//
			// 错误信息存在
			if(errorMsg != "") {
				mui.alert(errorMsg, '请填写完整');
				mui('#submitBtn').button('reset');
				return;
			}

			var date = new Date(); // 当前日期时间
			var user = JSON.parse(localStorage.getItem("userJson"));

			// 生成  customer
			var customer = {
				cdeareaid: area.areaValue,
				// id调用存储过程
				CNAME: $("#custm_name").val(),
				CCLASSID: $("#custm_Classify").text(),
				CDEADR1: $("#deliver_Addr").val(),
				CINADR: $("#deliver_Addr").val(),
				CCONMAN: $("#custm_name").val(),
				CCYID: '01',
				CPYID: '01',
				CSALEMAN: $("#saler").text(),
				CSTATUS: '0',
				// CREMARK: 订单号,
				BEGINMAN: user.cname,
				BEGINDT: date,
				cyusou: '0',
				cyinsou: '0',
				cyusoudf: '0',
				bzj: '0',
				yjbzj: '0',
				cconmante: $("#phone").val(),
				csettlemodeid: $("#pay_way").text(),
				cpivotflag: '0',
				dagio_a: 0,
				cstation1: $("#station").text(),
				cpost: '0'
			}

			// 生成  corder
			var corder = {
				cpathid: area.areaValue,
				// 订单id后台取
				//CCODE: '0243423',
				// 客户ID后台获取
				//CCUSTID: '13579888',
				DDATE: date,
				CCYID: '01',
				CPYID: $("#pay_term").text(), //付款id
				DAGIO: 1,
				DPAYAMT: $("#deposit").val(), //订金
				DDEDT: $("#deliver_Date").text(), //交货日期
				CDEADR: $("#deliver_Addr").val(), //地址
				CCMAN: $("#custm_name").val(), //客户名
				CSALEMAN: $("#saler").text(), //业务员号id
				CREMARK: $("#remark").val(), //备注
				CMTFLAG: '0',
				ENDFLAG: '0',
				BEGINMAN: user.cname,
				BEGINDT: date,
				INETFLAG: '1',
				DAMT: $("#TotalAccount").text(), // 合计金额
				DCYAMT: $("#TotalAccount").text(),
				custphone: $("#phone").val(), //电话
				drate: 1,
				creadyflag: '0',
				ccancelflag: '0',
				cwhid: $("#station").text(), //网点id
				cpyway: $("#pay_way").text(),
				cisship: '1',
				ipri: '0',
				cstockflag: '1',
				cforcestockflag: '0',
				DFREIGHTAMT: 0,
				cfreeflag1: '0',
				cfreeflag2: '0',
				cfreeflag3: '0',
				iprint: '0',
				ccounterid: '@',
				dpayamt_old: $("#TotalAccount").text(),
				dpayamt1_old: 0,
				dagio_old: 1,
				damt_old: $("#TotalAccount").text(),
				cupdflag: '0',
				cbldflag: '0',
				csmsflg: '0',
				ctenantflag: '0',
				ccinflag: '0',
				tally_damt: 0,
				cmtdeamtflag: '0',
				dcess: 0,
				csmsflg: '0',
				dcardamt: 0,
				dchargeamt: 0,
				//					cdeareaid: '',
				dconsumamt: 0,
				cappflag: '0',
				cstylist: $("#designer").val(), //设计师
				csignstylistid: $("#signed_designer").text(), //签约设计id
				email: $("#GroupBuy_No").val() //团购号
			}

			// 获取每个项目的信息
			var dcosts = $('#itemCards li .c_dcost');
			var pNos = $('#itemCards li .c_pNo');
			var pColors = $('#itemCards li .c_pColor');
			var stores = $('#itemCards li .c_store');
			var quantitys = $('#itemCards li .c_quantity');
			var attrItems = $('#itemCards li .c_attrItem');
			var discounts = $('#itemCards li .c_discount');
			var prices = $('#itemCards li .c_price');
			var price2s = $('#itemCards li .c_price2');
			var Accounts = $('#itemCards li .c_account');
			var cpoflags = $('#itemCards li .c_non_standard_flag');
			var cpodescs = $('#itemCards li .c_non_standard_info');

			// 生产  corderc  列表
			var cordercs = new Array(itemNo - 1);
			$.each(cordercs, function(i, corderc) {
				var temp = parseFloat(prices[i].innerText) * parseFloat(discounts[i].innerText);

				var corderc = {
					cquotid: area.areaValue,
					//CCODE: '02313132', //后台生产
					IORDER: i + 1,
					CMTEID: pNos[i].innerText,
					CCOLORID: pColors[i].innerText,
					CWHID: stores[i].innerText,
					DQTY: quantitys[i].value,
					DPRICE: prices[i].innerText, // pd
					INETFLAG: 1,
					DDEQTY: 0,
					DCOST: dcosts[i].innerText,
					DCYPRICE: prices[i].innerText,
					DCYCOST: dcosts[i].innerText,
					DAGIOC: 1,
					dshipqty: 0,
					cattrid: attrItems[i].innerText, //pd
					dprice2: price2s[i].innerText,
					dprise: 0, // pd
					dpayqty: 0,
					dunpackamt: 0,
					drate: discounts[i].innerText,
					cpomanid: '@',
					damtc: Accounts[i].innerText,
					cstation1: $("#station").text(),
					counterid: '@',
					crejtype: '0',
					cpoflag: cpoflags[i].innerText,
					cpostate: '0',
					dpercent: 0,
					cpodesc: cpodescs[i].innerText,
					clargessflag: '0',
					drejqty: '0',
					BargainFlag: '0',
					dshipplanqty: '0',
					dpack_qty: 0, // pd
					dpoqty: '0',
					dvinqty: '0',
					dTranprice: temp, //单价*比率
					csetflag: '0',
					dnotaxprice: prices[i].innerText,
					dpriseprice: '0',
					dplanqty: '0'
				}
				cordercs[i] = corderc;
			});

			// json打包
			var customerJson = JSON.stringify(JSON.stringify(customer));
			var corderJson = JSON.stringify(JSON.stringify(corder));
			var cordercsJson = JSON.stringify(JSON.stringify(cordercs));

			// 提交  添加  customer、corder、corderc
			mui.ajax({
				type: "Post",
				url: server + "/Saler/AddOrder",
				crossDomain: true,
				headers: {
					'Content-Type': 'application/json'
				},
				data: "{customerJson: " + customerJson + ", corderJson: " + corderJson + ", cordercsJson: " + cordercsJson + ",flag: 1}",
				dataType: "json",
				success: function(data) {
					if(data == "success") {
						mui.alert('保存成功', '提示');
						itemNo = 1;
						var lis = $("#itemCards li");
						$.each(lis, function(i, li) {
							li.remove();
						});
						resetOrderHead();
						resetModal();
					} else {
						// 保存失败
						mui.alert('保存失败', '错误提示');
					}
					mui('#submitBtn').button('reset');
				},
				error: function(error) { // 调用失败
					mui('#submitBtn').button('reset');
					alert("Global/SaveOrder，请求失败。" + error);
				}
			});
		}
	});
};
// 提交订单  end *********************************************************************

// 重置 订单头
function resetOrderHead() {
	$("#btn_station").text("必填");
	$("#station").text("");
	$("#btn_saler").text("必填");
	$("#saler").text("");
	$("#btn_custm_Classify").text("必填");
	$("#custm_Classify").text("");
	$("#phone").val("");
	$("#date").text("选填");
	$("#deliver_Addr").val("");
	$("#designer").val("");
	$("#btn_sign_designer").text("选填");
	$("#signed_designer").text("");
	$("#GroupBuy_No").val("");
	$("#btn_pay_term").text("必填");
	$("#pay_term").text("");
	$("#btn_pay_way").text("必填");
	$("#pay_way").text("");
	$("#deposit").val(0);
	$("#remark").text("");
}

// 保存订单  begin *********************************************************************
function SaveOrder() {
	var btnArray = ['否', '是'];
	mui.confirm('保存订单，确认？', '提示', btnArray, function(e) {

		// 确认提交
		if(e.index == 1) {

			// 按钮不可选
			mui("#submitBtn").button('loading');

			// 错误信息
			var errorMsg = "";
			//			if($("#station").text() == '') errorMsg += '销售网点/';
			//			if($("#saler").text() == '') errorMsg += '业务员/';
			//			if($("#custm_name").val() == '') errorMsg += '客户姓名/';
			if($("#custm_Classify").text() == '') errorMsg += '客户分类/';
			if($("#date").text() == "选填") errorMsg += '交货日期/';
			if($("#phone").val() == '') errorMsg += '联系电话/';
			//			if($("#pay_term").text() == '') errorMsg += '付款条件/';
			//			if($("#pay_way").text() == '') errorMsg += '结算方式/';
			//			if($("#itemCards li").length == 0) errorMsg += '产品/';
			//
			// 错误信息存在
			if(errorMsg != "") {
				mui.alert(errorMsg, '请填写完整');
				mui('#submitBtn').button('reset');
				return;
			}

			var date = new Date();
			var user = JSON.parse(localStorage.getItem("userJson"));

			// 生成  customer
			var customer = {
				cdeareaid: area.areaValue,
				CCUSTID: $("#ccustid").text(), // id调用存储过程
				CNAME: $("#custm_name").val(),
				CCLASSID: $("#custm_Classify").text(),
				CDEADR1: $("#deliver_Addr").val(),
				CINADR: $("#deliver_Addr").val(),
				CCONMAN: $("#custm_name").val(),
				CCYID: '01',
				CPYID: '01',
				CSALEMAN: $("#saler").text(),
				CSTATUS: '0',
				CREMARK: $("#ccode").text(),
				BEGINMAN: user.cname,
				BEGINDT: date,
				cyusou: '0',
				cyinsou: '0',
				cyusoudf: '0',
				bzj: '0',
				yjbzj: '0',
				cconmante: $("#phone").val(),
				csettlemodeid: $("#pay_way").text(),
				cpivotflag: '0',
				dagio_a: 0,
				cstation1: $("#station").text(),
				cpost: '0'
			}

			// 生成  corder
			var corder = {
				cpathid: area.areaValue,
				CCODE: $("#ccode").text(),
				CCUSTID: $("#ccustid").text(),
				DDATE: $("#ddate").text(),
				CCYID: '01',
				CPYID: $("#pay_term").text(), //付款id
				DAGIO: 1,
				DPAYAMT: $("#deposit").val(), //订金
				DDEDT: $("#deliver_Date").text(), //交货日期
				CDEADR: $("#deliver_Addr").val(), //地址
				CCMAN: $("#custm_name").val(), //客户名
				CSALEMAN: $("#saler").text(), //业务员号id
				CREMARK: $("#remark").val(), //备注
				CMTFLAG: '0',
				ENDFLAG: '0',
				BEGINMAN: user.cname,
				BEGINDT: date,
				INETFLAG: '1',
				DAMT: $("#TotalAccount").text(), // 合计金额
				DCYAMT: $("#TotalAccount").text(),
				custphone: $("#phone").val(), //电话
				drate: 1,
				creadyflag: '0',
				ccancelflag: '0',
				cwhid: $("#station").text(), //网点id
				cpyway: $("#pay_way").text(),
				cisship: '1',
				ipri: '0',
				cstockflag: '1',
				cforcestockflag: '0',
				DFREIGHTAMT: 0,
				cfreeflag1: '0',
				cfreeflag2: '0',
				cfreeflag3: '0',
				iprint: '0',
				ccounterid: '@',
				dpayamt_old: $("#TotalAccount").text(),
				dpayamt1_old: 0,
				dagio_old: 1,
				damt_old: $("#TotalAccount").text(),
				cupdflag: '0',
				cbldflag: '0',
				csmsflg: '0',
				ctenantflag: '0',
				ccinflag: '0',
				tally_damt: 0,
				cmtdeamtflag: '0',
				dcess: 0,
				csmsflg: '0',
				dcardamt: 0,
				dchargeamt: 0,
				//					cdeareaid: '',
				dconsumamt: 0,
				cappflag: '0',
				cstylist: $("#designer").val(), //设计师
				csignstylistid: $("#signed_designer").text(), //签约设计id
				email: $("#GroupBuy_No").val(), //团购号
				cfromcode: $("#cfromcode").val()
			}

			// 获取每个项目的信息
			var  dcosts = $('#itemCards li .c_dcost');
			var itemNos = $('#itemCards li .c_itemNo');
			var pNos = $('#itemCards li .c_pNo');
			var pColors = $('#itemCards li .c_pColor');
			var stores = $('#itemCards li .c_store');
			var quantitys = $('#itemCards li .c_quantity');
			var attrItems = $('#itemCards li .c_attrItem');
			var discounts = $('#itemCards li .c_discount');
			var prices = $('#itemCards li .c_price');
			var price2s = $('#itemCards li .c_price2');
			var Accounts = $('#itemCards li .c_account');
			var cpoflags = $('#itemCards li .c_non_standard_flag');
			var cpodescs = $('#itemCards li .c_non_standard_info');

			// 生产  corderc  列表
			var cordercs = new Array(itemNo - 1);
			$.each(cordercs, function(i, corderc) {
				var temp = parseFloat(prices[i].innerText) * parseFloat(discounts[i].innerText);
				var corderc = {
					cquotid: area.areaValue,
					CCODE: $("#ccode").text(), //后台生产
					IORDER: itemNos[i].innerText,
					CMTEID: pNos[i].innerText,
					CCOLORID: pColors[i].innerText,
					CWHID: stores[i].innerText,
					DQTY: quantitys[i].value,
					DPRICE: prices[i].innerText, // pd
					INETFLAG: 1,
					DDEQTY: 0,
					DCOST: dcosts[i].innerText, // pd
					DCYPRICE: prices[i].innerText,
					DCYCOST: dcosts[i].innerText,
					DAGIOC: 1,
					dshipqty: 0,
					cattrid: attrItems[i].innerText, //pd
					dprice2: price2s[i].innerText,
					dprise: 0, // pd
					dpayqty: 0,
					dunpackamt: 0,
					drate: discounts[i].innerText,
					cpomanid: '@',
					damtc: Accounts[i].innerText,
					cstation1: $("#station").text(),
					counterid: '@',
					crejtype: '0',
					cpoflag: cpoflags[i].innerText,
					cpostate: '0',
					dpercent: 0,
					cpodesc: cpodescs[i].innerText,
					clargessflag: '0',
					drejqty: '0',
					BargainFlag: '0',
					dshipplanqty: '0',
					dpack_qty: 0, // pd
					dpoqty: '0',
					dvinqty: '0',
					dTranprice: temp, //单价*比率
					csetflag: '0',
					dnotaxprice: prices[i].innerText,
					dpriseprice: '0',
					dplanqty: '0'
				}
				cordercs[i] = corderc;
			});

			// json打包
			var customerJson = JSON.stringify(JSON.stringify(customer));
			var corderJson = JSON.stringify(JSON.stringify(corder));
			var cordercsJson = JSON.stringify(JSON.stringify(cordercs));

			// 提交  添加  customer、corder、corderc
			mui.ajax({
				type: "Post",
				url: server + "/Saler/SaveOrder",
				crossDomain: true,
				headers: {
					'Content-Type': 'application/json'
				},
				data: "{customerJson: " + customerJson + ", corderJson: " + corderJson + ", cordercsJson: " + cordercsJson + ",flag: 1}",
				dataType: "json",
				success: function(data) {
					if(data == "success") {
						mui.alert('保存成功', '提示');
					} else {
						// 保存失败
						mui.alert('保存失败', '错误提示');
					}
					mui('#submitBtn').button('reset');
				},
				error: function(error) { // 调用失败
					mui('#submitBtn').button('reset');
					alert("Global/SaveOrder，请求失败。" + error);
				}
			});
		}
	});
};
// 保存订单  end *********************************************************************

//<!--模态框合计-->
// 数量  变更
$("#quantity").on('change', function(obj) {
	$("#account").val($("#price").val() * $(this).val());
	$("#account").val(Math.round($("#account").val()));
});

// 数量  变更
$("#quantity").on('input', function(obj) {
	$("#account").val($("#price").val() * $(this).val());
	$("#account").val(Math.round($("#account").val()));
});

// 折扣  变更
$("#discountText").on('input', function(obj) {
	var floatReg = /^\d+(\.\d*)?$/; // 非负浮点
	if(!floatReg.test($(this).val())) { // 不是数值
		$(this).val(0);
	} else {
		if($(this).val() > 100) {
			$(this).val(100);
		} else {
			var reg = /[0]\d+/; // 0打头跟数字
			if(reg.test($(this).val())) {
				$(this).val(parseFloat($(this).val()));
			}
		}
	}
	// 计折扣
	$("#discount").text($(this).val() / 100.00);
	// 计折扣价
	$("#price").val(Math.round($("#price2").val() * parseFloat($("#discount").text())));
	// 计折后 合计
	$("#account").val($("#price").val() * $("#quantity").val());
});

// 折扣价格  变更
$("#price").on('input', function(obj) {
	// 计  折扣率
	$("#discountText").val(Math.round(100.00 * $("#price").val() / $("#price2").val()));
	$("#discount").text($("#discountText").val() / 100.00);
	// 计  合计
	$("#account").val($("#price").val() * $("#quantity").val());
});

// 各项产品合计
function itemSum(obj) {
	var quantity = parseFloat(obj.value);
	var price = parseFloat(obj.parentElement.parentElement.parentElement.getElementsByClassName('c_price')[0].innerText);
	var account = obj.parentElement.parentElement.parentElement.getElementsByClassName('c_account')[0];
	account.innerText = quantity * price;
	Summary();
}

// 所有产品合计
function Summary() {
	var accounts = $("#itemCards li .c_account");
	var totalAccount = 0;
	$.each(accounts, function(i, account) {
		totalAccount += parseFloat(account.innerText);
	})
	$("#TotalAccount").html(totalAccount);
}