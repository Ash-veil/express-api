import  {DataTypes} from 'sequelize';
import sequelize  from '../config/database.js';

const User =  sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true     
    }, 
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user'
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
  

}, {
    scopes: {
        withoutPassword: {
            attributes: { exclude: ['password'] }
        }
    },
    timestamps: true,
    tableName: 'users',
    underscored: true,
    freezeTableName: true   
})

export default User;