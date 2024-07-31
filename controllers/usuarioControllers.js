const bcrypt = require('bcryptjs');

module.exports = (app) => {
  const conexao = app.database.connection;

  async function listaUsuarios() {
    let lista = await conexao.select().table('usuarios');
    return lista;
  };

  function senhaHash(senha) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(senha, salt); 
  };

  async function cadastraUsuario(dados) {
    const cadastro = await conexao.insert([{
      nome: dados.nome,
      usuario: dados.usuario,
      email: dados.email,
      sobre: dados.sobre,
      senha: senhaHash(dados.senha),
      postagem_blog: dados.postagem_blog,
      boletim_noticias: dados.boletim_noticias,
      boletim_noticias: dados.ofertas_pessoais,
    }]).into('usuarios');

    return cadastro;
  }

  async function dadosDeUsuario(id) {
    //try {
      const usuario = await conexao.select('*').from('usuarios').where('id', id);
      //console.log(usuario);
      return usuario;

    //} catch(e) {
    //  console.log(e);
    //}
  };

  return { listaUsuarios, cadastraUsuario, dadosDeUsuario }
}
