class Mailgun {
  constructor(formdata) {}
  client() {
    return {
      messages: {
        create() {},
      },
    };
  }
  access_name() {
    return this.name;
  }
  access_age() {
    return this.age;
  }
}

module.exports = Mailgun;
