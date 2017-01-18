var mongoose = require('mongoose');

var NovelSchema = new mongoose.Schema({
	name:String,
	pic:String,
	author:String,
	introduction:String,
	chanum:Number,
	chaptertitle:String,
});

NovelSchema.pre('save',function(next){
	next()
});

NovelSchema.statics = {
	fetch:function(cb){
		return this
			.find({})
			.exec(cb)
	},
	findById:function(id,cb){
		return this
			.findOne({_id:id})
			.exec(cb)
	},
	findKeyword:function(keyword,cb){
		return this
			.find({$or:[{name: new RegExp("^.*"+keyword+".*$")},{author:  new RegExp("^.*"+keyword+".*$")}]})  //¶à¹Ø¼ü×ÖÄ£ºýËÑË÷
			//.find({name: new RegExp("^.*"+keyword+".*$")})  //Ä£ºýËÑË÷
			.exec(cb)
	},
	findTitle:function(title,cb){
		return this
			.find({chaptertitle:title})
			.exec(cb)
	}
}

module.exports = NovelSchema