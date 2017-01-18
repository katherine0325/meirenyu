Page({
    data:{
        // text:"这是一个页面"
        novel:{},
        chapter:[],
        disabled:'',
        fav:'收藏',
        favclass:'book-basic-fav',
        ingchanum:'',
        hidden:'true'
    },
    onLoad:function(options){
        // 页面初始化 options为页面跳转所需要的参数
        var that = this;
        wx.request({
          url: 'http://localhost:8181/api/bookpage',
          data: {id:options.id},
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function(res){
            // success
            var chapter = new Array;
            var chanum = res.data.novel.chanum;
            for (var i=1;i<=chanum;i++)
            {
                if (i<10)
                {
                    i = '0'+i;
                }
                chapter.push(i);
            }
            wx.setNavigationBarTitle({ title: res.data.novel.name });
            that.setData({chapter:chapter,novel:res.data.novel});
            wx.getStorage({
                key: 'book',
                success: function(res){
                    // success
                    var data = res.data;

                    for (var i=0; i<data.length; i++)
                    {
                        if (data[i].id == options.id)
                        {
                            that.setData({
                                fav:'已收藏',
                                favclass:'book-basic-faved',
                                ingchanum:data[i].ingchanum,
                                hidden:''
                            });
                        }
                    }
                }
            })
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
    clickChapter:function(e){
        // 章节点击事件，转跳到对应章节的内容
        var id = e.target.dataset.id;
        var chapter = e.target.dataset.chapter;
        wx.navigateTo({ url: '../content/content?id='+id+'&chapter='+chapter })
    },
    clickFav:function(e){
        //点击收藏
        var that = this;
        var id = e.target.dataset.id;
        var name = e.target.dataset.name;
        var pic = e.target.dataset.pic;
        var chaptertitle = e.target.dataset.chaptertitle;
        var ingchanum = 1;
        var book = {id:id,name:name,pic:pic,chaptertitle:chaptertitle,ingchanum:ingchanum};

        wx.getStorage({
            key: 'book',
            success: function(res) {
                var bookdata = res.data;
                var fav = that.data.fav;
                if (fav == '收藏')
                {
                    bookdata.push(book);
                    that.setData({fav:'已收藏',favclass:'book-basic-faved'});
                }else{
                    for(var i=0; i<bookdata.length; i++)
                    {
                        if (bookdata[i].id == id)
                        {
                            bookdata.splice(i,1);
                            that.setData({fav:'收藏',favclass:'book-basic-fav'});
                        }
                    }
                }
                
                wx.setStorage({
                    key:'book',
                    data:bookdata
                })
            } 
        })
    },
    clickGochapter:function(e){
        var id = e.target.dataset.id;
        wx.navigateTo({ url: '../content/content?id='+id+'&chapter='+this.data.ingchanum })
    }
})