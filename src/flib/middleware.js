// @flow

import passport from 'passport';

export const passportBearerAuthenticated = (req: any, res: any, next: any) => {
  const cb = (error, user) => {
    if (error) {
      return res.status(500).json({
        success: false,
        errorMessage: error,
      });
    }
    req.user = user;
    return next();
  };
  passport.authenticate('bearer', { session: false }, cb)(req, res, next);
};

export const requireUserAuthentication = (req: any, res: any, next: any) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      errorMessage: 'Invalid user authentication token.',
      forceLogout: true,
    });
  }
  return next();
};
