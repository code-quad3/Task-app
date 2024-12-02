const passport = require('passport');


const Person = require('./models/Person');

const LocalStrategy = require("passport-local").Strategy;
passport.use( 'local',
    new LocalStrategy({usernameField: 'email' ,passwordField: 'password'},async (email, password, done) => {
      try {
        console.log("Received credentials:", email, password);
  
        const user = await Person.findOne({ email });
        
        if (!user) { console.log("not found");
          return done(null, false, { message: "Incorrect email." });
        }
  
        const isPasswordMatch = await user.comparePassword(password); 
        if (isPasswordMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password." });
        }
      } catch (err) {
        return done(err);
      }
    })
  );        
  

