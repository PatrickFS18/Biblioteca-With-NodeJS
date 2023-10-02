module.exports = (sequelize, DataTypes) => {
    const usuario = sequelize.define("usuarios", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        senha: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
    usuario.associate = (models) => {
        usuario.hasMany(models.UsuarioLivro, { foreignKey: "usuarioId" });
    };
    usuario.sync({ force: true })

    return usuario;
};