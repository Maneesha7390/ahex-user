const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv')
dotenv.config()
const userService = require('../modules/user/user.service')

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: process.env.GOOGLE_OAUTH_REDIRECT_URL || ''
},
async (accessToken, refreshToken, profile, done) => {
    try {
        let email = profile?.emails && profile?.emails?.[0].value
        if(!email){
            return done(error, null);
        }
        let picture= profile?.picture || profile?.photos?.[0]?.value || profile._json.picture || ''
        const user = await userService.findUser(email);
        if (!user) {
            let userData ={
                firstName: profile?.given_name || '',
                lastName: profile?.family_name || '',
                email: profile?.emails?.[0].value,
                phoneNumber: userData.phoneNumber || '',
                picture,
                createdAt: timeNow,
                updatedAt: timeNow,
                setCreatedBy() {
                    this.createdBy = `${this.firstName} ${this.lastName}`;
                  },
                password: userData.password,
                provider: profile?.provider || 'google'
            }
            await userService.registerUser(userData)
        }else{
            await userService.updateProvider(email, 'google', picture)
        }
        return done(null, profile);  
      } catch (error) {
        console.log("error", error);
        return done(error, null);
      }
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = passport;
