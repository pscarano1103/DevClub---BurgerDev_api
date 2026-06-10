import * as Yup from 'yup';

import User from '../models/User.js';

import bcrypt from 'bcrypt';

class SessionController {
  async store(request, response) {
    //usando o Yup para validar se os campos digitados estão dentro do padão esperado
    const schema = Yup.object({
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
    });

    const isValid = await schema.isValid(request.body, {
      abortEarly: false,
      strict: true,
    });

    const emailOrPasswordIncorrect = () => {
      return response
        .status(400)
        .json({ error: 'Email or password incorrect' });
    };
    // se o schema não for validado vai retornar erro dentro dos padrões de segurança.
    if (!isValid) {
      emailOrPasswordIncorrect();
    }

    const { email, password } = request.body;

    //validadndo se o email do usuário existe no BD
    const existingUser = await User.findOne({
      where: {
        email,
      },
    });

    if (!existingUser) {
      emailOrPasswordIncorrect();
    }

    //Validando se a senha informada existe e está correta no BD

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password_hash,
    );

    if (!isPasswordCorrect) {
      emailOrPasswordIncorrect();
    }
    return response.status(200).json({
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      admin: existingUser.admin,
    });
  }
}

export default new SessionController();
