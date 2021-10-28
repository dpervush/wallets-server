module.exports = class UserDto {
  firstName;
  secondName;
  email;
  id;
  isActivated;

  constructor(model) {
    this.firstName = model.firstName;
    this.secondName = model.secondName;
    this.email = model.email;
    this.id = model.id;
    this.isActivated = model.isActivated;
  }
};
