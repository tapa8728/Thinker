module.exports = function(app, passport) {
	var User = require('../app/models/user')    ;
     var newUser = new User;
	var usr;
	//Home page
	app.get('/', function(req,res) {
		res.render('index.ejs'); //load the index.ejs file
	});

	//Login
	app.get('/login', function(req, res) {
		res.render('login.ejs', {message: req.flash('loginMessage')}); // render the page and pass in any flash data if it exists
	});

	//Signup
	app.get('/signup', function(req,res) {
		res.render('signup.ejs', {message: req.flash('sighupMessage')}); //render the page in any flash data if it exists
	});
	
	app.get('/profile',isLoggedIn, function(req,res) {
	var results = [ ];	
	User.find({'good_subject': newUser.bad_subject},function(err,listusers ){
        for (var usr in listusers){
                //console.log(usr);
                if(listusers[usr].bad_subject == newUser.good_subject)
                    {
                        console.log("Match!!!");
                        console.log(listusers[usr]);
						results.push(listusers[usr]);
                    }
        }
		

    });
		console.log("results outside" + results);
		res.render('profile.ejs',{user: newUser, match: results});
	});
		
	//profile 
	app.post('/profile', isLoggedIn, function(req, res) {
	//var user_name=JSON.parse(req.body.user);
    var quiz=req.body.quiz;
	console.log("I'm in profile post quiz--"+quiz)
	console.log("I'm in profile post user--" + JSON.stringify(usr)); 
	newUser = new User;

  newUser.local.email = usr['email'];
  newUser.local.password = usr['password'];
  newUser.good_subject = usr['good_subject'];
  newUser.bad_subject = usr['bad_subject'];
  newUser.quiz.key1 = quiz[0];
  newUser.quiz.key2 = quiz[1];
  newUser.quiz.key3 = quiz[2];
  newUser.quiz.key4 = quiz[3];
  newUser.quiz.key5 = quiz[4];

 
  // Save the beer and check for errors
  newUser.save(function(err) {
    if (err)
      res.send(err);
	})
	});


	//logout
	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
		});
	

	/*app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : handle(),
		failureRedirect : '/signup',
		failureFlash: true //allow flash messages
		}));*/

   /* app.post('/quiz', passport.authenticate('local-signup',{
		successRedirect : handle(),
		failureRedirect : '/signup',
		failureFlash: true
		}));*/
	
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile',
		failureRedirect : '/login',
		failureFlash : true
		}));
 app.get('quiz/:id', function(req, res){
        var id = req.params.id;
        User.findOne({_id: id}, function(err,user){
            if(req.accepts('json')){
                if(err) {
                    return res.json(500, {
                        message: 'Error saving user',
                        error: err
                    });
            }
            if(!user) {
                return res.json(404, {
                    message: 'No such user'
                });
            }
            user.quiz.key1 = req.body.answer1;
            user.quiz.key2 = req.body.answer2;
            user.quiz.key3 = req.body.answer3;
            user.quiz.key4 = req.body.answer4;
            user.quiz.key5 = req.body.answer5;
            user.save(function(err, user){
                if(err) {
                    return res.send('500: Internal Server Error', 500);
                }
                if(!user) {
                    return res.send('No such user');
                }
                return res.render('users/edit', {user: user, flash: 'Saved.'});
     });
    }
  })
})
    app.get('/data',function(req, res){
		 User.find(function(err,users ) 		{
    		if (err)
      			res.send(err);

    		res.json(users);
  		});
});


/*app.get('/quiz',function(req, res) {
	res.render('quiz.ejs', {user: ''});	
})*/

//function handle(){
app.post('/quiz',  passport.authenticate('local-signup'),function(req, res) {
	/* newUser = new User;

  newUser.local.email = req.body.email;
  newUser.local.password = req.body.password;
  newUser.good_subject = req.body.good_subject;
  newUser.bad_subject = req.body.bad_subject

  // Save the beer and check for errors
  newUser.save(function(err) {
    if (err)
      res.send(err);*/
	/*var usr=[];
	usr.push(req.body.email);	
	usr.push(req.body.password);
	usr.push(req.body.good_subject);
	usr.push(req.body.bad_subject);*/
	
	 usr= {email: req.body.email, password: req.body.password, good_subject: req.body.good_subject, bad_subject: req.body.bad_subject}
    res.render('quiz.ejs', {flash: 'Created.'});
  });
//};

function handle_2(){
//	app.post('/quiz/:id', function(req, res) {
	 var user = User.findById(req.params.id, function(err, user) {
    if (err)
      res.send(err);

    console.log(res.json(user));
  });
//})
	}; 

}

	// route middleware to make sure a user is logged in
	function isLoggedIn(req,res, next) {
		
		// if user is authenticates in the session, carry on 
		if (req.isAuthenticated())
			return next();

		// if they aren't, redirect them to the home page 
		res.redirect('/');
	};


