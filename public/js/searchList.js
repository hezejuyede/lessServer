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
    mounted() {
        this.recodeUserTab();

    },
    created(){
        this.getTabIndex();
    },


    methods: {
        getTabIndex:function(){
            var tabIndex = localStorage.getItem('tabIndex');
            var name = localStorage.getItem('assetName');
            this.selectTab = parseInt(tabIndex);
            this.assetName = name;
        },
        changeTab: function (index) {
            localStorage.setItem('tabIndex',index);
            self = this;
            this.selectTab = index;
            switch (index) {
                case 1:
                    self.assetName = '';
                    localStorage.setItem('assetName',self.assetName);
                    break;
                case 2:
                    self.assetName = '电能表';
                    localStorage.setItem('assetName',self.assetName);
                    break;
                case 3:
                    self.assetName = '互感器';
                    localStorage.setItem('assetName',self.assetName);
                    break;
                case 4:
                    self.assetName = '采集终端';
                    localStorage.setItem('assetName',self.assetName);
                    break;
                case 5:
                    self.assetName = 'SIM卡';
                    localStorage.setItem('assetName',self.assetName);
                    break;
                default:
                    break;
            }
        },
        // 调用接口
        recodeUserTab: function() {
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
            PHHttp.post(json, function(data) {
                PHLoading.hide();
                self.listSearch = data.data;
                var arrList = data.data;
                PHLoading.hide();
                for (var i = 0; i < arrList.length; i++) {
                    if (arrList[i].assetName === "电能表") {
                        self.elcMeterArr.push(arrList[i])
                    }
                    if (arrList[i].assetName === "互感器") {
                        self.inductorArr.push(arrList[i])
                    }
                    if (arrList[i].assetName === "采集终端") {
                        self.terminalArr.push(arrList[i])
                    }
                    if (arrList[i].assetName === "sim卡") {
                        self.SIMCardArr.push(arrList[i])
                    }
                }
            }, function(data) {
                PHLoading.hide();
            });

        },


       /* recodeUserTab: function () {
            let that = this
            jQuery.ajax({
                type: 'POST',
                url: 'getList',
                data: {
                    "assetName": that.assetName,
                    "page": 1
                },
                contentType: "application/x-www-form-urlencoded",
                dataType: 'json',
                success: function (rusult) {

                    that.listSearch = rusult.data;
                    for (var i = 0; i < that.listSearch.length; i++) {
                        if (that.listSearch[i].assetName === "电能表") {
                            that.elcMeterArr.push(that.listSearch[i])
                        }
                        if (that.listSearch[i].assetName === "互感器") {
                            that.inductorArr.push(that.listSearch[i])
                        }
                        if (that.listSearch[i].assetName === "采集终端") {
                            that.terminalArr.push(that.listSearch[i])
                        }
                        if (that.listSearch[i].assetName === "sim卡") {
                            that.SIMCardArr.push(that.listSearch[i])
                        }

                    }
                },
            });

        },*/

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
    dropload = $(".container").dropload({
        loadDownFn: function (me) {
            console.log("加载刷新数据显示============>");
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
                    if (dataL === 0 || dataL === undefined || dataL === "") {
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
        if ($('.meter-view').height() < $('.container').height()) {

            $('.dropload-down1').hide();
        } else {
            $('.dropload-down1').show();
        }
    }


    /*dropload1 = $('.m-scro2').dropload({
        loadDownFn: function (me) {
            initDropLoad1();
            if (storate.getItem("poolId")) {
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
                        pageNum: self.pageNum2,
                        orgNo: userInfo[0].orgNo
                    }
                }
                PHHttp.post(json, function (data) {
                    PHLoading.hide();
                    var dataL = data.data.length;
                    if (dataL == 0 || dataL == undefined || dataL == "") {
                        me.$domDown.find('.dropload-refresh').text("已加载完毕");
                        return 0;
                    } else {
                        var arrList = data.data;
                        for (var i = 0; i < arrList.length; i++) {
                            self.listSearch.push(arrList[i])
                        }
                        self.pageNum2++;
                        me.$domDown.find('.dropload-refresh').text("↑上拉加载更多");
                        // self.listSearch = self.dataList.concat(data.data);
                    }
                    initDropLoad1();
                    me.resetload();
                }, function (data) {
                    initDropLoad1();
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

    function initDropLoad1() {
        if ($('.ul-scroll02').height() < $('.m-scro2').height()) {
            $('.dropload-down2').hide();
        } else {
            $('.dropload-down2').show();
        }
    }*/

    // dropload2 = $('.m-scro3').dropload({
    //     loadDownFn: function (me) {
    //         initDropLoad2();
    //         console.log("互感器加载下拉刷新************");
    //         if (storate.getItem("poolId")) {
    //             var self = vm._data;
    //             var userInfo = PHYizuoye.getSysUserList();
    //             PHLoading.show();
    //             var json = {
    //                 serviceCode: "ydzyInventoryAssetsList",
    //                 params: {
    //                     serviceCode: "ydzyInventoryAssetsList",
    //                     userName: userInfo[0].appAccount,
    //                     appId: "com.sgcc.sgitg.yizuoye",
    //                     requestValue: self.assetName + self.inputCode,
    //                     pageNum: self.pageNum3,
    //                     orgNo: userInfo[0].orgNo
    //                 }
    //             }
    //             PHHttp.post(json, function (data) {
    //                 PHLoading.hide();
    //                 console.log('互感器加载数据=========', data)
    //                 var dataL = data.data.length;
    //                 if (dataL == 0 || dataL == undefined || dataL == "") {
    //                     me.$domDown.find('.dropload-refresh').text("已加载完毕");
    //                     return 0;
    //                 } else {
    //                     var arrList = data.data;
    // 		console.log("更新之前的数据信息=======////", self.listSearch);
    //                     for (var i = 0; i < arrList.length; i++) {
    //                         self.listSearch.push(arrList[i])
    //                     }
    // 		console.log("更新完毕=======////", self.listSearch);
    //                     self.pageNum3++;
    //                     me.$domDown.find('.dropload-refresh').text("↑上拉加载更多");
    //                     // self.listSearch = self.dataList.concat(data.data);
    //                 }
    //                 initDropLoad2();
    //                 me.resetload();
    //             }, function (data) {
    //                 initDropLoad2();
    //                 PHLoading.hide();
    //                 me.resetload();
    //             })
    //             return 0;
    //         }
    //         setTimeout(function () {
    //             me.resetload();
    //         }, 0);
    //     }
    // });

    // function initDropLoad2() {
    //     if ($('.ul-scroll03').height() < $('.m-scro3').height()) {
    //         $('.dropload-down').hide();
    //     } else {
    //         $('.dropload-down').show();
    //     }
    // }

    // dropload3 = $('.m-scro4').dropload({
    //     loadDownFn: function (me) {
    //         initDropLoad3();
    //         console.log("111")
    //         if (storate.getItem("poolId")) {
    //             var self = vm._data;
    //             var userInfo = PHYizuoye.getSysUserList();
    //             PHLoading.show();
    //             var json = {
    //                 serviceCode: "ydzyInventoryAssetsList",
    //                 params: {
    //                     serviceCode: "ydzyInventoryAssetsList",
    //                     userName: userInfo[0].appAccount,
    //                     appId: "com.sgcc.sgitg.yizuoye",
    //                     requestValue: self.assetName + self.inputCode,
    //                     pageNum: self.pageNum4,
    //                     orgNo: userInfo[0].orgNo
    //                 }
    //             }
    //             PHHttp.post(json, function (data) {
    //                 PHLoading.hide();
    //                 console.log('上拉加载数据', data)
    //                 var dataL = data.data.length;
    //                 if (dataL == 0 || dataL == undefined || dataL == "") {
    //                     me.$domDown.find('.dropload-refresh').text("已加载完毕");
    //                     return 0;
    //                 } else {
    //                     var arrList = data.data;
    //                     for (var i = 0; i < arrList.length; i++) {
    //                         self.listSearch.push(arrList[i])
    //                     }
    //                     self.pageNum4++;
    //                     me.$domDown.find('.dropload-refresh').text("↑上拉加载更多");
    //                     // self.listSearch = self.dataList.concat(data.data);
    //                 }
    //                 initDropLoad3();
    //                 me.resetload();
    //             }, function (data) {
    //                 initDropLoad3();
    //                 PHLoading.hide();
    //                 me.resetload();
    //             })
    //             return 0;
    //         }
    //         setTimeout(function () {
    //             me.resetload();
    //         }, 0);
    //     }
    // });

    // function initDropLoad3() {
    //     if ($('.ul-scroll04').height() < $('.m-scro4').height()) {
    //         $('.dropload-down').hide();
    //     } else {
    //         $('.dropload-down').show();
    //     }
    // }

    // dropload4 = $('.m-scro5').dropload({
    //     loadDownFn: function (me) {
    //         initDropLoad4();
    //         console.log("111")
    //         if (storate.getItem("poolId")) {
    //             var self = vm._data;
    //             var userInfo = PHYizuoye.getSysUserList();
    //             PHLoading.show();
    //             var json = {
    //                 serviceCode: "ydzyInventoryAssetsList",
    //                 params: {
    //                     serviceCode: "ydzyInventoryAssetsList",
    //                     userName: userInfo[0].appAccount,
    //                     appId: "com.sgcc.sgitg.yizuoye",
    //                     requestValue: self.assetName + self.inputCode,
    //                     pageNum: self.pageNum5,
    //                     orgNo: userInfo[0].orgNo
    //                 }
    //             }
    //             PHHttp.post(json, function (data) {
    //                 PHLoading.hide();
    //                 console.log('上拉加载数据', data)
    //                 var dataL = data.data.length;
    //                 if (dataL == 0 || dataL == undefined || dataL == "") {
    //                     me.$domDown.find('.dropload-refresh').text("已加载完毕");
    //                     return 0;
    //                 } else {
    //                     var arrList = data.data;
    //                     for (var i = 0; i < arrList.length; i++) {
    //                         self.listSearch.push(arrList[i])
    //                     }
    //                     self.pageNum5++;
    //                     me.$domDown.find('.dropload-refresh').text("↑上拉加载更多");
    //                     // self.listSearch = self.dataList.concat(data.data);
    //                 }
    //                 initDropLoad4();
    //                 me.resetload();
    //             }, function (data) {
    //                 initDropLoad4();
    //                 PHLoading.hide();
    //                 me.resetload();
    //             })
    //             return 0;
    //         }
    //         setTimeout(function () {
    //             me.resetload();
    //         }, 0);
    //     }
    // });

    // function initDropLoad4() {
    //     if ($('.ul-scroll05').height() < $('.m-scro5').height()) {
    //         $('.dropload-down').hide();
    //     } else {
    //         $('.dropload-down').show();
    //     }
    // }
})
