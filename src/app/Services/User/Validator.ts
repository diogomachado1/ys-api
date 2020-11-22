import * as Yup from 'yup';
import Validator from '../Validator';

class UserValidator extends Validator {
  protected createSchema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string().required().email(),
    username: Yup.string().required().lowercase().matches(/^[a-zA-Z0-9_]{5,}[a-zA-Z]+[0-9]*$/),
    password: Yup.string().required().min(8),
  });

  protected updateSchema = Yup.object().shape({
    name: Yup.string(),
    imageUrl: Yup.string().url(),
    stream: Yup.object().shape({
      streamTitle: Yup.string(),
    }),
    oldPassword: Yup.string()
      .min(8)
      .when('password', (password: string, field: Yup.StringSchema<string>) =>
        password ? field.required() : field
      ),
    password: Yup.string().min(8),
    confirmPassword: Yup.string().when(
      'password',
      (password: string, field: Yup.StringSchema<string>) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
    ),
  });

  protected updatePasswordSchema = Yup.object().shape({
    password: Yup.string().required().min(8),
    confirmPassword: Yup.string().when(
      'password',
      (password: string, field: Yup.StringSchema<string>) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
    ),
  });

  protected sessionSchema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
  });

  async updatePassword<T>(payload: object) {
    return this.validate<T>(this.updatePasswordSchema, payload);
  }

  async sessionValidator<T>(payload: object) {
    return this.validate<T>(this.sessionSchema, payload);
  }
}

export default new UserValidator();
