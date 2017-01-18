Page({
    data:{
        // text:"这是一个页面"
        content:"",
        id:'',
        ingchanum:'',
        nextpage:'下一页',
        nextpagedisabled:''
    },
    onLoad:function(options){
        var id = options.id;
        var chapter = parseInt(options.chapter);
        var that = this;
        // 页面初始化 options为页面跳转所需要的参数
        wx.request({
          url: 'http://localhost:8181/api/content',
          data: {id:id,chapter:chapter},
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function(res){
            // success
            var content = res.data.content;
            var novel = res.data.novel;

            //设置标题
            wx.setNavigationBarTitle({ title:res.data.novel.name+' 第'+chapter+'章' })
            //设置state
            that.setData({
                content:content,
                id:id,
                ingchanum:chapter,
            })
            //设置缓存
            wx.getStorage({
                key: 'book',
                success: function(res){
                    // success
                    var data = res.data;
                    for(var i=0;i<data.length; i++)
                    {
                        if (data[i].id == id)
                        {
                            data[i].ingchanum = chapter;
                        }
                    }
                    wx.setStorage({
                    key: 'book',
                    data: data,
                    })
                }
            })
            //设置‘下一页’
            if (novel.chanum == chapter)
            {
                that.setData({nextpage:'最后一页',nextpagedisabled:'disabled'})
            }
          }
        })
    },
    onShow:function(){
        // 页面显示
    },
    onHide:function(){
        // 页面隐藏
    },
    onUnload:function(options){
        // 页面关闭
    },
    clickNextpage:function(e){
        wx.redirectTo({ url: '/pages/content/content?id='+this.data.id+'&chapter='+(this.data.ingchanum+1) })
    },
    clickMenu:function(e){
        wx.redirectTo({ url:'/pages/bookpage/bookpage?id='+this.data.id })
    }
})