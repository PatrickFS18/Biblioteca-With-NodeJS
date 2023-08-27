module.exports = (sequelize, DataTypes) => {
  const livros = sequelize.define('livros', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    salario_bruto: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    departamento: {
      type: DataTypes.INTEGER,
      allowNull: false
    }

  });
  livros.sync ({force:true})
  return livros;
};
