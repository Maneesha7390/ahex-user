const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const dotenv = require('dotenv')
dotenv.config()
const userService = require('../modules/user/user.service')
const moment = require('moment')
let timeNow = moment().unix()

// Google OAuth Strategy
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
                phoneNumber: profile.phoneNumber || '',
                picture,
                setCreatedBy() {
                    this.createdBy = `${this.firstName} ${this.lastName}`;
                  },
                providers: profile?.provider || 'google',
                googleSSO: true
            }
            await userService.registerUser(userData)
        }else if(!(user.providers.includes('google') || user.googleSSO == true)){
            await userService.updateProvider(email, 'google', picture)
        }
        return done(null, profile);  
      } catch (error) {
        console.log("error", error);
        return done(error, null);
      }
}));

// Facebook OAuth Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID || '',
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    callbackURL: process.env.FACEBOOK_OAUTH_REDIRECT_URL || '',
    profileFields: ['id', 'emails', 'name', 'photos']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('profile........', profile)
        let FB_Id = profile?.id
        let picture = profile?.photos?.[0]?.value || '';
        const user = await userService.findUserByFacebookId(FB_Id);
        if (user.length === 0) {
            let userData = {
            firstName: profile?._id?.first_name || '',
            lastName: profile?._id?.last_name || '',
            phoneNumber: '',
            picture,
            createdAt: timeNow,
            updatedAt: timeNow,
            createdBy: profile?._id?.first_name+' '+profile?._id?.last_name,
            password: '',
            provider: 'facebook'
            };
            await userService.registerUser(userData);
        } else {
            await userService.updateProvider(email, 'facebook', picture);
        }
        return done(null, profile);  
    } catch (error) {
        console.log("error", error);
        return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = passport;
