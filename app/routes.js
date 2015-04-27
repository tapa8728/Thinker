module.exports = function(app, passport) {
	var User = require('../app/models/user')    ;
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
		
	//profile 
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user: req.user // get the user out of session and pass to template 	
		});
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
	var newUser = new User;

  newUser.local.email = req.body.email;
  newUser.local.password = req.body.password;
  newUser.good_subject = req.body.good_subject;
  newUser.bad_subject = req.body.bad_subject

  // Save the beer and check for errors
  newUser.save(function(err) {
    if (err)
      res.send(err);
    res.render('quiz.ejs', {user: newUser, flash: 'Created.'});
 	//res.json({ message: 'New user was  added to the locker!', data: newUser });
  });
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


