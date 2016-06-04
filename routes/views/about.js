var keystone = require('keystone');

exports = module.exports = function(req,res){
	var view = new keystone.View(req,res);
	var locals = res.locals;
	
	view.on('init',function(next){
		keystone.list('Product').model.find({state:'published',nav: true}).select('title slug').exec(function(err,result){
			locals.productLinks = result;
			next(err);
		});
	});
	
	view.on('init',function(next){
		keystone.list('Testimonial').model.find({state:'published'}).sort('+sortOrder').exec(function(err,result){
			locals.testimonials = result;
			next(err);
		});
	});
	
	view.on('init',function(next){
		keystone.list('Partner').model.find({state:'published'}).sort('+sortOrder').limit(5).exec(function(err,result){
			locals.partners = result;
			next(err);
		});
	});
	
	// load six most recent posts
	view.on('init', function(next) {
		keystone.list('Post').model.find({
				'state': 'published'
			})
		.sort('-publishedDate')
		.limit(6)
		.lean()
		.exec(function(err, results) {
			var months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
			for(var i=0;i<results.length;i++){
				
				var d = new Date(results[i].publishedDate).toISOString().split('T')[0].split('-');
				var month = months[parseInt(d[1])];
				var day = d[2];
				results[i].publishedDate2 = {
					month: month,
					day: day
				};
				
			}
			locals.recentPosts = results;
			next(err);
		});
	});
	
	view.on('init',function(next){
		keystone.list('Home Settings').model.findOne().exec(function(err,result){
			locals.settings = result;
			next(err);
		});
	});
	
	view.on('init',function(next){
		keystone.list('Footer').model.findOne().exec(function(err,result){
			locals.footer = result;
			next(err);
		});
	});
	
	view.on('init',function(next){
		keystone.list('Stats').model.findOne().exec(function(err,result){
			locals.stats = result;
			next(err);
		});
	});
	
	view.on('init',function(next){
		keystone.list('About').model.findOne().populate('topSection.gallery').exec(function(err,result){
			locals.about = result;
			next(err);
		});
	});
	
	view.on('init',function(next){
		keystone.list('Staff Member').model.find({state:'published'}).exec(function(err,result){
			locals.staff = result;
			next(err);
		});
	});
	
	view.render('about');
};