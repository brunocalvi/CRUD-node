const jwt = require("jsonwebtoken");
const request = require('supertest');
const app = require('../index');

const secret = "zRGqjNM|[]o|*@aQ6>A^n20ch-Xq?g";
let token = '';
let idTeste = '';

const usuarioFake = {
  nome: `Teste ${Date.now()}`,
  usuario: `teste.${Date.now()}`, 
  email: `${Date.now()}@teste.com.br`, 
  sobre: 'Usuário para o Jest fazer o teste. | uAk1729-McG', 
  senha: `${Date.now()}uAk1729-McG`,
};

beforeAll(async () => {
  let result = await app.controllers.usuarioControllers.cadastraUsuario(usuarioFake);
  idTeste = result[0];

  token = jwt.sign({ email: usuarioFake.email }, secret, { expiresIn: '1h' /* em minutos */ });
});

test.skip('Deve cadastrar um usuário com sucesso', async () => {
  return await request(app).post('/api/usuario')
    .send(usuarioFake)
    .then((res) => {
      expect(res.statusCode).toEqual(201);
      expect(res.body.mensagem).toBe('Usuário cadastrado com sucesso.');
    });
});

test('Deve logar e pegar o token de acesso', async () => {
  return await request(app).post('/api/login')
    .send({ usuario: usuarioFake.usuario , senha: usuarioFake.senha })
    .then((res) => {
      expect(res.statusCode).toEqual(200);
      expect(res.body.token).toBeDefined();
    });
});

test('O middleware deve impedir a consulta sem o token', async () => {
  return await request(app).get('/api/usuario')
    .then((res) => {
      expect(res.status).toBe(401);
      expect(res.body.metodo).toBe('Validar token.');
    });
});

test('Deve listar todos os usuários', async () => {
  return await request(app).get('/api/usuario')
    .set('authorization', `bearer ${token}`)
    .then((res) => {
      expect(res.status).toBe(200);
    });
});

test('Deve consultar apenas um usuário', async () => {
  return await request(app).get(`/api/usuario/${idTeste}`)
    .set('authorization', `bearer ${token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.usuario[0].id).toEqual(idTeste);
      expect(res.body.usuario[0].email).toBeDefined();
    });
});

test('Deve atualizar informações do usuário', async () => {
  return await request(app).put(`/api/usuario/${idTeste}`)
    .set('authorization', `bearer ${token}`)
    .send({ 
      nome: `Teste Alterado`,
      usuario: 'teste.alterado', 
      email: 'email.alterado@teste.com', 
      sobre: 'Alterado',  
    })
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.mensagem).toBe('Usuário atualizado com sucesso.');
    })
});

describe('Ao pedir para alterar a senha ...', () => {

  test('Deve pedir para ter mais de 8 caracteres', async () => {
    return await request(app).put(`/api/usuario/${idTeste}`)
      .set('authorization', `bearer ${token}`)
      .send({ 
        nome: `Teste Alterado`,
        usuario: 'teste.alterado', 
        email: 'email.alterado@teste.com', 
        senha: 'uA1-Mc',
        sobre: 'Alterado',  
      })
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.body.mensagem[0]).toBe('Senha deve ter no mínimo 8 caracteres.');
      })
  });

  test('Deve pedir para ter letras minusculas', async () => {
    return await request(app).put(`/api/usuario/${idTeste}`)
      .set('authorization', `bearer ${token}`)
      .send({ 
        nome: `Teste Alterado`,
        usuario: 'teste.alterado', 
        email: 'email.alterado@teste.com', 
        senha: `UAK1729-MCG`,
        sobre: 'Alterado',  
      })
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.body.mensagem[0]).toBe('Senha deve conter letras minusculas.');
      })
  });

  test('Deve pedir para ter letras maiusculas', async () => {
    return await request(app).put(`/api/usuario/${idTeste}`)
      .set('authorization', `bearer ${token}`)
      .send({ 
        nome: `Teste Alterado`,
        usuario: 'teste.alterado', 
        email: 'email.alterado@teste.com', 
        senha: `uak1729-mcg`,
        sobre: 'Alterado',  
      })
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.body.mensagem[0]).toBe('Senha deve conter letras maiúsculas.');
      })
  });

  test('Deve pedir para ter numéros', async () => {
    return await request(app).put(`/api/usuario/${idTeste}`)
      .set('authorization', `bearer ${token}`)
      .send({ 
        nome: `Teste Alterado`,
        usuario: 'teste.alterado', 
        email: 'email.alterado@teste.com', 
        senha: `uakAbCC-mcg`,
        sobre: 'Alterado',  
      })
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.body.mensagem[0]).toBe('Senha deve conter números.');
      })
  });

  test('Deve pedir para ter caracteres especiais', async () => {
    return await request(app).put(`/api/usuario/${idTeste}`)
      .set('authorization', `bearer ${token}`)
      .send({ 
        nome: `Teste Alterado`,
        usuario: 'teste.alterado', 
        email: 'email.alterado@teste.com', 
        senha: `uAK1729mcG`,
        sobre: 'Alterado',  
      })
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.body.mensagem[0]).toBe('Senha deve conter caracteres especiais.');
      })
  });

});

test('Deve excluir um usuário', async () => {
  return await request(app).delete(`/api/usuario/${idTeste}`)
    .set('authorization', `bearer ${token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.mensagem).toBe('Usuário deletado com sucesso.');
    })
});




