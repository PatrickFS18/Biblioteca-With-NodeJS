module.exports = (sequelize, DataTypes) => {
  const UsuarioLivro = sequelize.define("usuario_livros", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    livroId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
 // UsuarioLivro.sync({force:true});
  return UsuarioLivro;
};
