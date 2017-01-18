var express = require('express');

var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var fs = require('fs');
var _ = require('underscore');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var formidable = require('formidable');

var credentials = require('./credentials.js');

var Novel = require('./models/novel.js');



var app = express();

mongoose.connect('mongodb://localhost/yuntu');

//设置handlebars视图引擎
var handlebars = require('express3-handlebars').create({defaultLayout:'main'});
app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');

app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser(credentials.cookieSecret));
app.use(session({
	resave:false,
    saveUninitialized: true,
	secret:'123456',
}));

app.set('port',process.env.PORT || 8181);

app.use(express.static(__dirname+'/public'));

//页面

/*
 * input page
 */
app.get('/input',function(req,res){
	res.render('input',{
		title:'小说后台录入页',
		movie:{
			name:'',
			pic:'',
			author:'',
			introduction:'',
			chanum:1,
			chaptertitle:'',
		}
	})
});

/*
 * GET /updatenovel
 */
app.get('/updatenovel/:id',function(req,res){
	var id = req.params.id
	if (id)
	{
		Novel.findById(id,function(err,novel){
			res.render('input',{
				title:'小说后台更新页',
				novel:novel
			})
		})
	}
})

/*
 * list page
 */
app.get('/',function(req,res){
	Novel.fetch(function(err,novel){
		if (err)
		{
			console.log(err);
		}
		res.render('list',{
			title:'美人鱼小说后台列表',
			novel:novel
		})
	})
});

/*
 * POST /admin/addnovel
 */
 app.post('/admin/addnovel',function(req,res){
	var id = req.body.novel._id;
	var novelObj = req.body.novel;
	var _novel;

	if (!id == '')
	{
		Novel.findById(id,function(err,novel){
			if (err)
			{
				console.log(err);
			}
			_novel = _.extend(novel,novelObj);
			_novel.save(function(err,novel){
				if (err)
				{
					console.log(err);
				}
				res.redirect('/');
			});
		});
	}else{
		_novel = new Novel({
			name:novelObj.name,
			pic:novelObj.pic,
			author:novelObj.author,
			introduction:novelObj.introduction,
			chanum:novelObj.chanum,
			chaptertitle:novelObj.chaptertitle,
		});
		_novel.save(function(err,novel){
			if (err)
			{
				console.log(err);
			}
			res.redirect('/');
		});
	}
 });

/*
 * DELETE /admin/deletenovel
 */
app.delete('/admin/deletenovel',function(req,res){
	var id = req.query.id

	if (id)
	{
		Novel.remove({_id:id},function(err,novel){
			if (err)
			{
				console.log(err)
			}else{
				res.json({success:1})
			}

		})
	}
})



//前端接口api

/*
 * POST /api/recommend
 */
 app.post('/api/recommend',function(req,res){
	Novel.fetch(function(err,novel){
		if (err)
		{
			console.log(err);
		}
		res.json({ novel:novel })
	})
 })

/*
 * POST /api/bookpage
 */
app.post('/api/bookpage',function(req,res){
	var id = req.body.id;

	Novel.findById(id,function(err,novel){
		if (err)
		{
			console.log(err)
		}
		res.json({novel:novel});
	});
});

/*
 * POST /api/content
 */
 app.post('/api/content',function(req,res){
	var id = req.body.id;
	var chapter = req.body.chapter;

	Novel.findById(id,function(err,novel){
		if (err)
		{
			console.log(err)
		}
		var href = './public/book/'+novel.chaptertitle+'/'+chapter+'.txt';

		fs.readFile(href,'utf-8',function(err,content){
			if (err)
			{
				console.log(err);
			}
			res.json({
				novel:novel,
				content:content,
			});
		});
	})
 })

 /*
 * POST /api/onLogin
 */
 app.post('/api/onLogin',function(req,res){
	var code = req.body.code;
	console.log(code);
	res.json({code:code});
 })

/*
 * POST /api/search
 */
app.post('/api/search',function(req,res){
	var bookname = req.body.bookname;

	Novel.findKeyword(bookname,function(err,novel){
		res.json({novel:novel});
	})
})


//定制404页面
app.use(function(req,res,next){
	res.status(404);
	res.render('404');
});

//定制500页面
app.use(function(err,req,ers,next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'),function(){
	console.log('Express started on http://localhost:' + app.get('port') + ';press Ctrl-C to terminate.');
});
