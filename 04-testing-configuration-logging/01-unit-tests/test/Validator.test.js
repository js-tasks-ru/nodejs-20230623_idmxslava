const Validator = require("../Validator");
const expect = require("chai").expect;

describe("testing-configuration-logging/unit-tests", () => {
  describe("Validator", () => {
    it("валидатор проверяет строковые поля", () => {
      const validator = new Validator({
        name: {
          type: "string",
          min: 5,
          max: 10,
        },
      });

      let errors = validator.validate({ name: "Lal" });
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property("field").and.to.be.equal("name");
      expect(errors[0])
        .to.have.property("error")
        .and.to.be.equal("too short, expect 5, got 3");

      errors = validator.validate({ name: "LalalaLaLaLa" });
      expect(errors).to.have.length(1);
      expect(errors[0])
        .to.have.property("error")
        .and.to.be.equal("too long, expect 10, got 12");

      errors = validator.validate({ name: "Lalala" });
      expect(errors).to.have.length(0);

      errors = validator.validate({ name: 123 });
      expect(errors).to.have.length(1);
      expect(errors[0])
        .to.have.property("error")
        .and.to.be.equal("expect string, got number");
    });

    it("валидатор проверяет числовые поля", () => {
      const validator = new Validator({
        age: {
          type: "number",
          min: 18,
          max: 65,
        },
      });

      let errors = validator.validate({ age: 13 });
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property("field").and.to.be.equal("age");
      expect(errors[0])
        .to.have.property("error")
        .and.to.be.equal("too little, expect 18, got 13");

      errors = validator.validate({ age: 66 });
      expect(errors).to.have.length(1);
      expect(errors[0])
        .to.have.property("error")
        .and.to.be.equal("too big, expect 65, got 66");

      errors = validator.validate({ age: 23 });
      expect(errors).to.have.length(0);

      errors = validator.validate({ age: "asd" });
      expect(errors).to.have.length(1);
      expect(errors[0])
        .to.have.property("error")
        .and.to.be.equal("expect number, got string");
    });

    it("валидатор проверяет оба поля", () => {
      const validator = new Validator({
        age: {
          type: "number",
          min: 18,
          max: 65,
        },
        name: {
          type: "string",
          min: 5,
          max: 10,
        },
      });

      let errors = validator.validate({ name: "asd" });
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property("field").and.to.be.equal("age");
      expect(errors[0])
        .to.have.property("error")
        .and.to.be.equal("expect number, got undefined");

      errors = validator.validate({ name: "asd", age: 10 });
      expect(errors).to.have.length(2);

      errors = validator.validate({ name: "asd", age: "10" });
      expect(errors).to.have.length(1);
    });
  });
});
