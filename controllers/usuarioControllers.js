const conexao = require('../database/connection');
const bcrypt = require('bcryptjs');

module.exports = (app) => {
  async function listaUsuarios() {
    return await conexao.select('id','nome','usuario','email','sobre','postagem_blog','boletim_noticias','ofertas_pessoais').table('usuarios');
  };

  async function senhaHash(senha) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(senha, salt); 
  };

  async function verificaSenhaHash(senha, hash) {
    return bcrypt.compareSync(senha, hash);
  };

  async function cadastraUsuario(dados) {
    return await conexao.insert([{
      nome: dados.nome,
      usuario: dados.usuario,
      email: dados.email,
      sobre: dados.sobre,
      senha: senhaHash(dados.senha),
      postagem_blog: dados.postagem_blog,
      boletim_noticias: dados.boletim_noticias,
      ofertas_pessoais: dados.ofertas_pessoais
    }]).into('usuarios');
  }

  async function dadosDeUsuario(id) {
    return await conexao.select('id','nome','usuario','email','sobre','postagem_blog','boletim_noticias','ofertas_pessoais').table('usuarios').where({ id: id });
  };

  async function deletaUsuario(id) {
    return await conexao.table('usuarios').where({ id: id }).del(); 
  };

  async function atualizarUsuario(id, dados) {
    return await conexao.table('usuarios')
        .where({ id: id })
        .update({
          nome: dados.nome,
          usuario: dados.usuario,
          email: dados.email,
          sobre: dados.sobre,
          postagem_blog: dados.postagem_blog,
          boletim_noticias: dados.boletim_noticias,
          ofertas_pessoais: dados.ofertas_pessoais
        });
  };

  async function atualizarSenhaUsuario(id, senha) {
    return await conexao.table('usuarios')
        .where({ id: id })
        .update({ senha: senhaHash(senha) });
  };

  async function login(usuario, senha) {
    let dados = [];
    const dadosUsuario = await conexao.table('usuarios').select('*').where({ usuario: usuario });
    const verif = await verificaSenhaHash(senha, dadosUsuario[0].senha);

    dados = {
      validado: verif,
      id: dadosUsuario[0].id,
      nome: dadosUsuario[0].nome,
      usuario: dadosUsuario[0].usuario,
      email: dadosUsuario[0].email,
      sobre: dadosUsuario[0].sobre,
      postagem_blog: dadosUsuario[0].postagem_blog,
      boletim_noticias: dadosUsuario[0].boletim_noticias,
      ofertas_pessoais: dadosUsuario[0].ofertas_pessoais
    }

    if(verif == true) {
      return dados;
    }
  }

  return { listaUsuarios, cadastraUsuario, dadosDeUsuario, deletaUsuario, atualizarUsuario, atualizarSenhaUsuario, login }
}
