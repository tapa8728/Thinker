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
	
	var results = [];
	var rescount=0		//stores the coount of the number of users
	var tutor=[]
	var listusers
	var tutcount=0
	var pupil=[]
	var pupcount=0
	var quizflag=0
	app.get('/profile',isLoggedIn, function(req,res) {
	
		console.log("results outside" + results);
		
		console.log("TOTAL COUNT ... ");
		console.log(rescount);
		res.render('profile.ejs', {
			user: newUser, match: results, count: rescount, tutors: tutor, tut_count: tutcount, pupils: pupil, pup_count:pupcount
			});
	});
		
	//profile 
	app.get('/delete',function(req, res) {

		User.remove(function(err,removed){
			res.send(removed);
		});

	});


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
  newUser.first_name = usr['first_name'];
  newUser.last_name = usr['last_name'];
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

  	// Finds the tutors
    User.find({'good_subject': newUser.bad_subject},function(err,listusers )
    {
        for (var usr in listusers)
        {
        		tutor.push(listusers[usr]);
        		tutcount = tutcount+1;
                // Finds the best match..
                if(listusers[usr].bad_subject == newUser.good_subject)
                    {
                        console.log("Match!!!");
                        console.log(listusers[usr]);
                        // quiz match logic here
                        if(listusers[usr].key1 == newUser.key1)
                        	quizflag=quizflag+1
                        if(listusers[usr].key2 == newUser.key2)
                        	quizflag=quizflag+1
                        if(listusers[usr].key3 == newUser.key3)
                        	quizflag=quizflag+1
                        if(listusers[usr].key4 == newUser.key4)
                        	quizflag=quizflag+1
                        if(listusers[usr].key5 == newUser.key5)
                        	quizflag=quizflag+1
                        // if 3 or more answers match
                        if(quizflag > 2)   
                        {
                       			results.push(listusers[usr]);
                        		rescount = rescount +1;	
                    	}	
                    }
        }
    });

    // Finds the pupils
    User.find({'bad_subject': newUser.good_subject},function(err,listusers )
    {
        for (var usr in listusers)
        {
        		pupil.push(listusers[usr]);
        		pupcount = pupcount+1;
                
        }
    });
})
	
	
	/*app.post('/profile', isLoggedIn, function(req, res) 
	{
		 User.find({'good_subject': newUser.bad_subject},function(err,listusers )
		 { 
			for (var usr in listusers)
			{	//perfect study-buddies. Need to add qui logic here
				if(listusers[usr].bad_subject == newUser.good_subject)
				{
					console.log("Match!!!");
					console.log(listusers[usr]);
					results.push(listusers[usr]);
					
				}
			}
		//tutors will be in listusers fully.


		});

		
	});*/


	//logout
	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
		});
	


	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile',
		failureRedirect : '/login',
		failureFlash : true
		}));

    app.get('/data',function(req, res){
		 User.find(function(err,users ){
    		if (err)
      			res.send(err);

    		res.json(users);
  		});
});




app.post('/quiz',  passport.authenticate('local-signup'),function(req, res) {

  // Save the beer and check for errors
  newUser.save(function(err) {
    if (err)
      res.send(err);
	
	 usr= {email: req.body.email, password: req.body.password,first_name: req.body.first_name, last_name:req.body.last_name, good_subject: req.body.good_subject, bad_subject: req.body.bad_subject}
    res.render('quiz.ejs', {flash: 'Created.'});
  });
//};

/*function handle_2(){
	 var user = User.findById(req.params.id, function(err, user) {
    if (err)
      res.send(err);

    console.log(res.json(user));
  });
	};*/ 

});

	// route middleware to make sure a user is logged in
	function isLoggedIn(req,res, next) {
		
		// if user is authenticates in the session, carry on 
		if (req.isAuthenticated())
			return next();

		// if they aren't, redirect them to the home page 
		res.redirect('/');
	};
};

