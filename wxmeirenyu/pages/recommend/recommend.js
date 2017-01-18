Page({
    data:{
        // text:"这是一个页面"
        datas:[],
    },
    onLoad:function(options){
        // 页面初始化 options为页面跳转所需要的参数
        wx.setNavigationBarTitle({ title: '推荐' })
        var that = this;
        wx.request({
          url: 'http://localhost:8181/api/recommend',
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function(res){
            // success
            var novel = res.data.novel;
            that.setData({datas: novel});
          }
        })
    },
    onShow:function(){
        // 页面显示
    },
    onHide:function(){
        // 页面隐藏
    },
    onUnload:function(){
        // 页面关闭
    },
    clickBook:function(event){
        // 封面点击事件，跳转到章节页面
        wx.navigateTo({url: '../bookpage/bookpage?id=' + event.target.dataset.id})
    }
})