var self, dropload, dropload1, dropload2, dropload3, dropload4 = null;
var vm = new Vue({
    el: "#app",
    data: {
        selectTab: 1,
        pageNum1: 1,
        pageNum2: 1,
        pageNum3: 1,
        pageNum4: 1,
        pageNum5: 1,
        assetName: '',
        inputCode: '',
        listSearch: [],
        elcMeterArr: [],
        inductorArr: [],
        terminalArr: [],
        SIMCardArr: [],
    },

    created: function () {

        var that = this;
        document.addEventListener('PHJSReady', function (content) {
            //在这里面调用其它组件方法
            that.getTabIndex();
        });
    },

    methods: {
        getTabIndex: function () {
            var tabIndex = localStorage.getItem('tabIndex');
            var name = localStorage.getItem('assetName');

            if (name !== null && name !== "") {
                this.selectTab = parseInt(tabIndex);
            } else {
                this.selectTab = 1
            }


            if (name !== null && name !== "") {
                this.assetName = name;
            } else {
                this.assetName = ""
            }

            this.recodeUserTab();

        },


        changeTab: function (index) {
            localStorage.setItem('tabIndex', index);
            self = this;
            this.selectTab = index;
            switch (index) {
                case 1:
                    self.assetName = '';
                    localStorage.setItem('assetName', "");
                    localStorage.getItem('assetName');
                    var url = "microapp://" + storate.getItem("mappId") + "/recordLists2.html";
                    PHWindow.open({
                        "url": url
                    });
                    break;
                case 2:
                    self.assetName = '电能表';
                    localStorage.setItem('assetName', self.assetName);
                    var url = "microapp://" + storate.getItem("mappId") + "/recordLists3.html";
                    PHWindow.open({
                        "url": url
                    });
                    break;
                case 3:
                    self.assetName = '互感器';
                    localStorage.setItem('assetName', self.assetName);
                    var url = "microapp://" + storate.getItem("mappId") + "/recordLists4.html";
                    PHWindow.open({
                        "url": url
                    });

                    break;
                case 4:
                    self.assetName = '采集终端';
                    localStorage.setItem('assetName', self.assetName);
                    var url = "microapp://" + storate.getItem("mappId") + "/recordLists5.html";
                    PHWindow.open({
                        "url": url
                    });
                    break;
                case 5:
                    self.assetName = 'SIM卡';
                    localStorage.setItem('assetName', self.assetName);
                    var url = "microapp://" + storate.getItem("mappId") + "/recordLists6.html";
                    PHWindow.open({
                        "url": url
                    });
                    break;
                default:
                    break;
            }
        },


        // 调用接口
        recodeUserTab: function () {
            PHLoading.show();
            self = this;
            var userMsg = PHYizuoye.getSysUserList();
            var json = {
                serviceCode: "ydzyInventoryAssetsList",
                params: {
                    serviceCode: "ydzyInventoryAssetsList", //ydzyInventoryServiceSyn
                    appId: "com.sgcc.sgitg.yizuoye", //	请求标识
                    userName: userMsg[0].appAccount, //	用户名称
                    requestValue: self.assetName + self.inputCode, //	需查询的值
                    orgNo: userMsg[0].orgNo, //供电单位
                }
            };
            PHHttp.post(json, function (data) {
                PHLoading.hide();
                self.listSearch = data.data;
                var arrList = data.data;
                PHLoading.hide();
                for (var i = 0; i < arrList.length; i++) {
                    if (arrList[i].assetName == "电能表") {
                        self.elcMeterArr.push(arrList[i])
                    }
                    if (arrList[i].assetName == "互感器") {
                        self.inductorArr.push(arrList[i])
                    }
                    if (arrList[i].assetName == "采集终端") {
                        self.terminalArr.push(arrList[i])
                    }
                    if (arrList[i].assetName == "sim卡") {
                        self.SIMCardArr.push(arrList[i])
                    }
                }
                document.getElementById("itemLists1").scrollTop = 0;
            }, function (data) {
                PHLoading.hide();
            });

        },
        chechMeterBoxMsg: function (item) {
            storate.removeItem("meterInfo")
            storate.setItem("meterboxInfo", JSON.stringify(item))
            var url = "microapp://" + storate.getItem("mappId") + "/meterBoxInfo.html";
            PHWindow.open({
                "url": url
            });
        },
        chechMeterMsg: function (item) {
            storate.removeItem("meterboxInfo")
            storate.setItem("meterInfo", JSON.stringify(item))
            var url = "microapp://" + storate.getItem("mappId") + "/meterInfo.html";
            PHWindow.open({
                "url": url
            });
        },
    }
});
$(function () {
    dropload = $('.m-scro1').dropload({
        loadDownFn: function (me) {
            console.log("加载刷新数据显示============>")
            initDropLoad();
            if (storate.getItem("poolId")) {
                console.log("测试进入条件筛选")
                var self = vm._data;
                var userInfo = PHYizuoye.getSysUserList();
                PHLoading.show();
                var json = {
                    serviceCode: "ydzyInventoryAssetsList",
                    params: {
                        serviceCode: "ydzyInventoryAssetsList",
                        userName: userInfo[0].appAccount,
                        appId: "com.sgcc.sgitg.yizuoye",
                        requestValue: self.assetName + self.inputCode,
                        pageNum: self.pageNum1,
                        orgNo: userInfo[0].orgNo
                    }
                }
                PHHttp.post(json, function (data) {
                    console.log("加载请求数据", data)
                    PHLoading.hide();
                    var dataL = data.data.length;
                    if (dataL == 0 || dataL == undefined || dataL == "") {
                        console.log("加载完毕**********")
                        me.$domDown.find('.dropload-refresh').text("已加载完毕");
                        return 0;
                    } else {
                        console.log("重新渲染**********")
                        var arrList = data.data;
                        for (var i = 0; i < arrList.length; i++) {
                            self.listSearch.push(arrList[i])
                        }
                        self.pageNum1++;
                        me.$domDown.find('.dropload-refresh').text("↑上拉加载更多");
                        // self.listSearch = self.dataList.concat(data.data);
                    }
                    initDropLoad();
                    me.resetload();
                }, function (data) {
                    initDropLoad();
                    PHLoading.hide();
                    me.resetload();
                })
                return 0;
            }
            setTimeout(function () {
                me.resetload();
            }, 0);
        }
    });

    function initDropLoad() {
        if ($('.ul-scroll01').height() < $('.m-scro1').height()) {
            $('.dropload-down1').hide();
        } else {
            $('.dropload-down1').show();
        }
    }

})
