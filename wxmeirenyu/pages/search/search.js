Page({
    data:{
        // text:"这是一个页面"
        datas:[],
        none:0,
    },
    onLoad:function(options){
        // 页面初始化 options为页面跳转所需要的参数
        wx.setNavigationBarTitle({ title: '搜索' })
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
    formSubmit:function(e){
        var that = this;
        if(e.detail.value.bookname != '')
        {
            wx.request({
              url: 'http://localhost:8181/api/search',
              data: {bookname:e.detail.value.bookname},
              method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              // header: {}, // 设置请求的 header
              success: function(res){
                // success
                if(res.data.novel.length == 0)
                {
                    that.setData({ datas:res.data.novel,none:1 })
                }else{
                    that.setData({ datas:res.data.novel,none:0 })
                }
                
              }
            })
        }else{
            console.log('book name is null')
        }
        
    },
    clickBook:function(e){
        // 封面点击事件，跳转到章节页面
        wx.navigateTo({url: '../bookpage/bookpage?id=' + e.target.dataset.id})
    }
})