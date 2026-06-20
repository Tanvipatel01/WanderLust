const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// CHANGE THIS LINE: Destructure the plugin function or check your import
const passportLocalMongoose = require("passport-local-mongoose").default || require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

// If the above require still fails, you can safely use passportLocalMongoose if it's a function,
// or passportLocalMongoose.default / passportLocalMongoose.plugin depending on package bugs.
userSchema.plugin(passportLocalMongoose); 

module.exports = mongoose.model("User", userSchema);