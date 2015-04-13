module.exports = function(app, passport) {
	
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
	

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : handle(),
		failureRedirect : '/signup',
		failureFlash: true //allow flash messages
		}));


	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile',
		failureRedirect : '/login',
		failureFlash : true
		}));



var User = require('../app/models/user');

// Create endpoint /api/beers for POSTS
function handle(){
app.post('/signup', function(req, res) {

	var newUser= new User;

  // Set the beer properties that came from the POST data
  newUser.email = req.body.name;
  newUser.password = req.body.password;
  newUser.good_subject = req.body.good_subject;
  newUser.bad_subject = req.body.bad_subject

  // Save the beer and check for errors
  newUser.save(function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'New user was  added to the locker!', data: newUser });
  });
});

}};

	// route middleware to make sure a user is logged in
	function isLoggedIn(req,res, next) {
		
		// if user is authenticates in the session, carry on 
		if (req.isAuthenticated())
			return next();

		// if they aren't, redirect them to the home page 
		res.redirect('/');
	}


