//index.js

const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../utils/user.js');
//获取应用实例
const app = getApp()

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        announcement: '目前上架的商品均可直接下单购买，欢迎大家购买支持我的工作！',
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        hotGoods: [],
        groupons:[],
        newGoods:[],
        brands:[],
        floorGoods:[],
        topics:[]
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        });
    },
    saveFormId:function(v){
        if(v.detail.formId !='the formId is a mock one'){
            util.request(api.UserFormIdCreate, {
                formId: v.detail.formId
            });
        }
    },
    onLoad: function (options) {
        let _this = this;
        wx.getSystemInfo({
            success: res => {
                _this.setData({
                    windowWidth: res.windowWidth,
                    windowHeight: res.windowHeight
                })
            }
        });
        if (options.scene) {
            let scene = decodeURIComponent(options.scene);
            let info_arr = [];
            info_arr = scene.split(',');
            let _type = info_arr[0];
            let id = info_arr[1];

            if (_type == 'goods') {
                wx.navigateTo({
                    url: '../goods/goods?id=' + id
                });
            } else if (_type == 'groupon') {
                wx.navigateTo({
                    url: '../goods/goods?grouponId=' + id
                });
            } else {
                wx.navigateTo({
                    url: '../index/index'
                });
            }

        }
        // 页面初始化 options为页面跳转所带来的参数
        if (options.grouponId) {
            //这个pageId的值存在则证明首页的开启来源于用户点击来首页,同时可以通过获取到的pageId的值跳转导航到对应的详情页
            wx.navigateTo({
                url: '../goods/goods?grouponId=' + options.grouponId
            });
        }

        // 页面初始化 options为页面跳转所带来的参数
        if (options.goodId) {
            //这个pageId的值存在则证明首页的开启来源于用户点击来首页,同时可以通过获取到的pageId的值跳转导航到对应的详情页
            wx.navigateTo({
                url: '../goods/goods?id=' + options.goodId
            });
        }

        // 页面初始化 options为页面跳转所带来的参数
        if (options.orderId) {
            //这个pageId的值存在则证明首页的开启来源于用户点击来首页,同时可以通过获取到的pageId的值跳转导航到对应的详情页
            wx.navigateTo({
                url: '../ucenter/orderDetail/orderDetail?id=' + options.orderId
            });
        }

        this.getIndexData();
        /* if (app.globalData.userInfo) {
           this.setData({
             userInfo: app.globalData.userInfo,
             hasUserInfo: true
           })
         } else if (this.data.canIUse){
           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
           // 所以此处加入 callback 以防止这种情况
           app.userInfoReadyCallback = res => {
             this.setData({
               userInfo: res.userInfo,
               hasUserInfo: true
             })
           }
         } else {
           // 在没有 open-type=getUserInfo 版本的兼容处理
           wx.getUserInfo({
             success: res => {
               app.globalData.userInfo = res.userInfo
               this.setData({
                 userInfo: res.userInfo,
                 hasUserInfo: true
               })
             }
           })
         }*/
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.getIndexData();
        wx.stopPullDownRefresh() //停止下拉刷新
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    getUserInfo: function (e) {
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    getIndexData: function () {
        let _this = this;
        util.request(api.IndexUrl).then(res=>{
            if(res.errno === 0){
                let data = res.data;
                // console.log( res.data.newGoodsList)
                _this.setData({
                    hotGoods:data.hotGoodsList,
                    groupons: res.data.grouponList,
                    newGoods: res.data.newGoodsList,
                    brands: res.data.brandList,
                    floorGoods: res.data.floorGoodsList,
                    topics: res.data.topicList,
                })
            }

        })
    }
})
