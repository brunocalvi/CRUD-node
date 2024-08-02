const jwt = require("jsonwebtoken");
const validaToken = require('../../middleware/TokenAuth');

const secret = "zRGqjNM|[]o|*@aQ6>A^n20ch-Xq?g";

module.exports = function(app) {
  app.get("/api/usuario", validaToken, async (req, res) => {
    try {
      const pegaUsuarios = await app.controllers.usuarioControllers.listaUsuarios();

      res.status(200).json({ 
        status: 200, 
        Metodo: 'lista de usuarios', 
        usuarios: pegaUsuarios 
      });

    } catch(e) {
      console.log('Retorno: ' + e);

      res.status(404).json({
        status: 404,
        metodo: 'lista de usuarios',
        mensagem: 'Falha ao consultar os usuários'
      });
    }
  });

  app.get("/api/usuario/:id", validaToken, async (req, res) => {
    const id = req.params.id;
    let erro = [];

    if(isNaN(id)) {
      erro.push("O valor inserido na url não é válido.");
    }

    if(erro.length == 0) {
      try {
        const umUsuario = await app.controllers.usuarioControllers.dadosDeUsuario(id);

        res.status(200).json({
          status: 200,
          metodo: 'dados do usuario',
          usuario: umUsuario
        })

      } catch(e) {
        console.log('Retorno: ' + e);

        res.status(404).json({
          status: 404,
          metodo: 'dados do usuario',
          mensagem: 'Falha ao consultar os dados'
        });
      }
    } else {

      res.status(404).json({ 
        status: 404, 
        metodo: 'dados do usuario', 
        mensagem: erro 
      });
    }
    
  });

  app.post("/api/usuario", validaToken, async (req, res) => {
    let dados = req.body;
    let { nome, usuario, email, sobre, senha, postagem_blog, boletim_noticias, ofertas_pessoais } = dados;
 
    let regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let regexCaracter = /[^a-zA-Z0-9\s]/;
    let erro = [];

    if(nome.lenght < 3 || nome.indexOf(" ") == -1) {
      erro.push("Insira um nome e sobrenome válido.");
    }

    if(regexCaracter.test(nome)) {
      erro.push("Não use caracteres especiais no nome.");
    }

    if(email.indexOf("@") == -1 || email.indexOf(".") == -1 || !regexEmail.test(email)) {
      erro.push("Indique um e-mail válido.");
    }

    if(senha.length < 8) {
      erro.push("Senha deve ter no minimo 8 caracteres.");
    }

    if(!senha.match(/[a-z]/)) {
      erro.push("Senha deve conter letras minusculas.");
    }

    if(!senha.match(/[A-Z]/)) {
      erro.push("Senha deve conter letras maiusculas.");
    }

    if(!senha.match(/\d/)) {
      erro.push("Senha deve conter numeros");
    }

    if(!senha.match(/[^a-zA-Z\d]/)) {
      erro.push("Senha deve conter caracteres especiais.");
    }

    if(erro.length == 0) {
      try {
        const cadasUsuario = await app.controllers.usuarioControllers.cadastraUsuario(dados);
        
        res.status(201).json({ 
          status: 201, 
          metodo: 'cadastrar usuario', 
          mensagem: `Usuário inserido com sucesso.` 
        });

      } catch(e) {
        console.log('Retorno: ' + e);

        res.status(404).json({ 
          status: 404, 
          metodo: 'cadastrar usuario', 
          mensagem: 'Falha ao inserir o usuário.' 
        });
      }
    } else {

      res.status(404).json({ 
        status: 404, 
        metodo: 'cadastrar usuario', 
        mensagem: erro 
      });
    }
  });

  app.delete('/api/usuario/:id', validaToken, async (req, res) => {
    const id = req.params.id;

    try {
      const delUsuario = await app.controllers.usuarioControllers.deletaUsuario(id); 

      res.status(200).json({
        status: 200,
        metodo: 'deletar usuario',
        mensagem: 'Usuário deletado com sucesso'
      });

    } catch(e) {
      console.log('Retorno: ' + e);

      res.status(404).json({
        status: 404,
        metodo: 'deletar usuario',
        mensagem: 'Falha ao deletar o usuário.' 
      })
    }
  });

  app.put('/api/usuario/:id', validaToken, async (req, res) => {
    const id = req.params.id;
    let dados = req.body;
    let { nome, usuario, email, sobre, senha, postagem_blog, boletim_noticias, ofertas_pessoais } = dados;

    let regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let regexCaracter = /[^a-zA-Z0-9\s]/;
    let erro = [];

    if(nome.lenght < 3 || nome.indexOf(" ") == -1) {
      erro.push("Insira um nome e sobrenome válido.");
    }

    if(regexCaracter.test(nome)) {
      erro.push("Não use caracteres especiais no nome.");
    }

    if(email.indexOf("@") == -1 || email.indexOf(".") == -1 || !regexEmail.test(email)) {
      erro.push("Indique um e-mail válido.");
    }

    if(senha != undefined) {
      if(senha.length < 8) {
        erro.push("Senha deve ter no minimo 8 caracteres.");
      }
  
      if(!senha.match(/[a-z]/)) {
        erro.push("Senha deve conter letras minusculas.");
      }
  
      if(!senha.match(/[A-Z]/)) {
        erro.push("Senha deve conter letras maiusculas.");
      }
  
      if(!senha.match(/\d/)) {
        erro.push("Senha deve conter numeros");
      }
  
      if(!senha.match(/[^a-zA-Z\d]/)) {
        erro.push("Senha deve conter caracteres especiais.");
      }
    }

    if(erro.length == 0) {
      try {
        const atualizaUsuario = await app.controllers.usuarioControllers.atualizarUsuario(id, dados);

        if(senha != undefined) {
          const atualizaSenhaUsuario = await app.controllers.usuarioControllers.atualizarSenhaUsuario(id, senha);
        }

        res.status(200).json({
          status: 200,
          metodo: 'atualizar usuario',
          mensagem: 'Usuário atualizado com sucesso'
        });

      } catch(e) {
        console.log('Retorno: ' + e);

        res.status(404).json({
          status: 404,
          metodo: 'atualizar usuario',
          mensagem: 'Falha ao atualizar o usuário.' 
        })

      }
    } else {

      res.status(404).json({ 
        status: 404, 
        metodo: 'atualizar usuario', 
        mensagem: erro 
      });

    }
  });

  app.post('/api/login', async (req, res) => {
    let dados = req.body;
    let { usuario, senha } = dados;
    
    try {
      const login = await app.controllers.usuarioControllers.login(usuario, senha);

      if(login != undefined) {
        let token = jwt.sign({ id: login.id, email: login.email }, secret, { expiresIn: '1h' /* em minutos */ });

        res.status(200).json({
          status: 200,
          metodo: 'login de usuario',
          usuario: login,
          token: token
        });

      } else {
        res.status(401).json({
          status: 401,
          metodo: 'login de usuario',
          mensagem: 'Usuário ou senha invalidos'
        })
      }

    } catch(e) {
      console.log('Retorno: ' + e);

      res.status(404).json({
        status: 404,
        metodo: 'login de usuario',
        mensagem: 'Erro ao realizar o login'
      })
    }

  });

  return app;
}