import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
});

UserSchema.set("toJSON", {
  virtuals: true,
  transform: function (document, returnedObject) {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

UserSchema.method("transform", function () {
  var obj = this.toObject();

  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;
  delete obj.password;

  return obj;
});

const user = models?.User || model("User", UserSchema);
export default user;
