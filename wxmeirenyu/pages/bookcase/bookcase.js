Page({
    data:{
        // text:"这是一个页面"
        novel:[],
    },
    onLoad:function(options){
        // 页面初始化 options为页面跳转所需要的参数
        wx.setNavigationBarTitle({ title: '书架' })
    },
    onShow:function(){
        // 页面显示
        var that = this;
        wx.getStorage({
            key: 'book',
            success: function(res) {
                if (res.data == '')
                {
                    wx.setStorage({
                      key: 'book',
                      data: [],
                    })
                }else{
                    that.setData({novel:res.data})
                }
            },
            fail:function(){
                wx.setStorage({
                      key: 'book',
                      data: [],
                })
            }
        })
    },
    onHide:function(){
        // 页面隐藏
    },
    onUnload:function(){
        // 页面关闭
    },
    onShareAppMessage: function () {
        return {
        title: '美人鱼小说',
        desc: '这是一个看小说的神器哦',
        path: '/pages/bookcase/bookcase'
        }
    },
    clickBook:function(e){
        var id = e.target.dataset.id;
        var ingchanum = e.target.dataset.ingchanum;
        wx.navigateTo({url: '../content/content?id=' + id+'&chapter='+ingchanum})
    },
    clickClear:function(e){
        wx.clearStorage()
    }
})