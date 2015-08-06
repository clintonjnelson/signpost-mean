'use strict';

module.exports = function signOwnerAuth(req, res, next) {
  console.log("CHECKING SIGN OWNER...");

  var userId      = req.user._id;
  var signOwnerId = req.body.sign.userId;
  var userIdStr      = String(req.user._id).trim();
  var signOwnerIdStr = String(req.body.sign.userId).trim();

  if(userId && signOwnerId && (userIdStr !== signOwnerIdStr) ) {  // verify not a sign sabbotage
    console.log("User is not the owner of this sign. Access denied.");
    return res.status(500).json({error: true, msg: "You do not appear to be the owner of this sign."});
  }

  next(); // otherwise, OK
};
