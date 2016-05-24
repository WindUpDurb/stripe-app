"use strict";

let mongoose = require("mongoose");
let bcrypt = require("bcrypt");
let jwt = require("json-web-token");
let moment = require("moment");

let JWT_SECRET = process.env.JWT_SECRET;

let userSchema = new mongoose.Schema({
    authorization: { type: String, required: true },
    email: { type: String, required: true },
    verifiedEmail: { type: Boolean, default: false },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: false },
    password: { type: String, required: true },
    savedShoppingCarts: [{ type: String }]
});

userSchema.statics.obtainRegisteredUsers = function (callback) {
    User.find({}, function (error, registeredUserList) {
        if (error || !registeredUserList) return callback(error || { error: "There are no users" });
        return callback(null, registeredUserList);
    });
};


userSchema.statics.registerNewUser = function (newUserData, callback) {
    User.findOne({ email: newUserData.email }, function (error, databaseUser) {
        console.log("user: ", databaseUser);
        if (error || databaseUser) return callback(error || {error: "The email is already registered to a user."});
        bcrypt.hash(newUserData.password, 12, function (error, hash) {
            if (error) return callback(error);
            newUserData.password = hash;
            User.create(newUserData, function (error, savedUser) {
                if (savedUser) savedUser.password = null;
                return callback(error, savedUser);
            })
        });
    });
};

userSchema.statics.deleteUserAccount = function (userId, callback) {
    User.findByIdAndRemove(userId, function (error) {
        callback(error);
    });
};

userSchema.statics.updateUserAccount = function (updatedUserData, callback) {
    User.findById(updatedUserData._id, function (error, databaseUser) {
        if (error || !databaseUser) return callback(error || { error : "There is no user with that information." });
        bcrypt.compare(updatedUserData.password, databaseUser.password, function (error, isGood) {
            if (error || !isGood) return callback(error || { error: "Authentication failed." });
            databaseUser = updatedUserData;
            databaseUser.save(function (error, savedUser) {
                callback(error, savedUser);
            });
        })
    });
};

userSchema.methods.generateToken = function () {
    let payload = {
        _id: this._id,
        exp: moment().add(7, "day").unix()
    };
    return jwt.encode(JWT_SECRET, payload, function (error, token) {
       return error || token;
    });
};

userSchema.statics.authenticate = function (loginData, callback) {
    User.findOne({ email : loginData.email }, function (error, databaseUser) {
        if (error || !databaseUser) return callback(error || { error: "Authentication failed."});
        bcrypt.compare(loginData.password, databaseUser.password, function (error, isGood) {
            if (error || !isGood) return callback(error || { error: "Authentication Failed." });
            let token = databaseUser.generateToken();
            databaseUser.password = null;
            callback(null, token, databaseUser);
        });
    });
};

userSchema.statics.authorization = function (requiredRole) {
    return function (request, response, next) {
        let token = request.cookies.accessToken;
        jwt.decode(JWT_SECRET, token, function (error, payload) {
            if (error) return response.status(401).send({ error: "Authentication failed." });
            User.findById(payload._id, function (error, user) {
                if (error) return response.status(401).send({ error : "User not found." });
                if (requiredRole === "Admin" && user.authorization !== "Admin") {
                    return response.status(403).send({ error: "Not authorized" });
                }
                next();
            }).select("-password");
        })
    }
};




let User = mongoose.model("User", userSchema);

module.exports = User;