const jwt = require("jsonwebtoken");
const secret = "zRGqjNM|[]o|*@aQ6>A^n20ch-Xq?g";

module.exports = (req, res, next) => {
  const authToken = req.headers['authorization'];

  if(authToken != undefined) {
    const bearer = authToken.split(" ");
    const token = bearer[1];

    try {
      let decoded = jwt.verify(token, secret);
      next();

    } catch(e) {
      res.status(401).json({
        status: 401,
        metodo: 'validar token', 
        mensagem: `Erro ao verificar o token erro: ${e}`
      });
    }
    
  } else {
    res.status(401).json({
      status: 401,
      metodo: 'validar token',
      mensagem: 'Token inválido'
    });
    return;
  }
};