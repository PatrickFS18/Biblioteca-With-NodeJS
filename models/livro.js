module.exports = (sequelize, DataTypes) => {
  const livros = sequelize.define("livros", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    autores: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ano: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    editora: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    qntdisponivel: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  livros.associate = (models) => {
    livros.hasMany(models.UsuarioLivro, { foreignKey: "livroId" });
  };
  //livros.sync ({force:true})
  return livros;
};
