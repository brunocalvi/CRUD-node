module.exports = function(app) {
  
  app.get("/api/usuario", async (req, res) => {
    try {
      const usuarios = await app.controllers.usuarioControllers.listaUsuarios();

      res.status(200).json({ 
        status: 200, 
        Metodo: 'Lista de usuários', 
        usuarios: usuarios 
      });

    } catch(e) {
      //console.log('Retorno: ' + e);

      res.status(404).json({
        status: 404,
        metodo: 'Lista de usuários',
        mensagem: 'Falha ao consultar os usuários'
      });
    }
  });

  app.get("/api/usuario/:id", async (req, res) => {
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
          metodo: 'Dados do usuário',
          usuario: umUsuario
        })

      } catch(e) {
        console.log('Retorno: ' + e);

        res.status(404).json({
          status: 404,
          metodo: 'Dados do usuário',
          mensagem: 'Falha ao consultar os dados'
        });
      }
    } else {

      res.status(404).json({ 
        status: 404, 
        metodo: 'Dados do usuário', 
        erros: erro 
      });
    }
    
  });

  app.post("/api/usuario", async (req, res) => {
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
        const usuario = await app.controllers.usuarioControllers.cadastraUsuario(dados);
        
        res.status(200).json({ 
          status: 200, 
          metodo: 'Cadastrar usuário', 
          mensagem: `Usuário inserido com sucesso.` 
        });

      } catch(e) {
        console.log('Retorno: ' + e);

        res.status(404).json({ 
          status: 404, 
          metodo: 'Cadastrar usuário', 
          mensagem: 'Falha ao inserir o usuário.' 
        });
      }
    } else {

      res.status(404).json({ 
        status: 404, 
        metodo: 'Cadastrar usuário', 
        erros: erro 
      });
    }
  });

  return app;
}