const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('валидатор должен вернуть массив с одной ошибкой,, если тип значения не строка', ()=>{
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({name: 1});
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');
    });

    it('валидатор должен вернуть массив с одной ошибкой, если тип значения не число', ()=>{
      const validator = new Validator({
        name: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({name: 'Hello'});
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
    });


    it('валидатор должен вернуть массив с одной ошибкой, если число больше 20', ()=>{
      const validator = new Validator({
        name: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({name: 21});
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 20, got 21');
    });

    it('валидатор должен вернуть массив с одной ошибкой, если число меньше 10', ()=>{
      const validator = new Validator({
        name: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({name: 7});
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 10, got 7');
    });


    it('валидатор должен вернуть массив с одной ошибкой, если строка длиннее 10', ()=>{
      const validator = new Validator({
        name: {
          type: 'string',
          min: 3,
          max: 10,
        },
      });

      const errors = validator.validate({name: 'Hello hello hello!'});
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 10, got 18');
    });

    it('валидатор должен вернуть массив с одной ошибкой, если строка короче 3', ()=>{
      const validator = new Validator({
        name: {
          type: 'string',
          min: 3,
          max: 10,
        },
      });

      const errors = validator.validate({name: 'Hi'});
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 3, got 2');
    });

    it('валидатор должен вернуть массив с двумя ошибками, если name короче 10, age меньше 3', ()=>{
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
        age: {
          type: 'number',
          min: 3,
          max: 10,
        },
      });

      const errors = validator.validate({name: 'Hi!', age: 2});
      expect(errors).to.have.length(2);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 3');
      expect(errors[1]).to.have.property('field').and.to.be.equal('age');
      expect(errors[1]).to.have.property('error').and.to.be.equal('too little, expect 3, got 2');
    });

    it('валидатор не должен вернуть ошибок, если длина значения равна минимальному', ()=>{
      const validator = new Validator({
        name: {
          type: 'string',
          min: 3,
          max: 20,
        },
      });

      const errors = validator.validate({name: 'Hi!'});
      expect(errors).to.have.length(0);
    });

    it('валидатор должен вернуть одну ошибку', ()=>{
      const validator = new Validator({
        name: {
          type: 'string',
          min: 3,
          max: 20,
        },
        age: {
          type: 'number',
          min: 3,
          max: 10,
        },
      });

      const errors = validator.validate({name: 'Hi!', age: 2});
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 3, got 2');
    });

    it('валидатор должен вернуть одну ошибку', ()=>{
      const validator = new Validator({
        name: {
          type: 'string',
          min: 5,
          max: 20,
        },
        age: {
          type: 'number',
          min: 3,
          max: 10,
        },
      });

      const errors = validator.validate({name: 'Hi!', age: 3});
      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 5, got 3');
    });

    it('валидатор должен вернуть две ошибки', ()=>{
      const validator = new Validator({
        name: {
          type: 'string',
          min: 5,
          max: 20,
        },
        age: {
          type: 'number',
          min: 3,
          max: 10,
        },
      });

      const errors = validator.validate({name: 3, age: 2});
      expect(errors).to.have.length(2);
    });
  });
});
