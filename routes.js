const passport = require('passport');

module.exports = function (app, myDataBase) {

    app.route('/').get((req, res) => {
        res.render('pug', {
            title: 'Connected to Database',
            message: "Please login",
            showLogin: true,
            showRegistration: true,
        });
    });

    app.route("/login").post(passport.authenticate("local", {
        failureRedirect: "/"
    }), (req, res) => {
        res.redirect("/profile")
    })

    app.route("/profile").get(ensureAuthenticated, (req, res) => {
        res.render(process.cwd() + "/views/pug/profile" + {
            username: req.user.username
        })
    })

    app.route("register").post((req, res, next) => {
        const hash = bcrypt.hashSync(req.body.password, 12);
        myDataBase.findOne({
            username: req.body.username
        }, function (err, user) {
            if (err) {
                next(err)
            } else if (user) {
                res.redirect("/")
            } else {

                myDataBase.insertOne({
                    username: req.body.username,
                    password: hash
                }), (err, doc) => {
                    if (err) {
                        res.redirect("/")
                    } else {
                        next(null, doc.opc[0])
                    }
                }
            }

        })
    })
    app.route('/logout').get((req, res) => {
        req.logout();
        res.redirect('/');
    });


    function ensureAuthenticated(req,res,next){
        if(req.isAuthenticated()){
          return next()
        }
        res.redirect("/")
      }

}