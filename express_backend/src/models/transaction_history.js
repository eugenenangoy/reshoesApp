const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transaction_history', {
    history_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    history_modified_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    detail_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'service_detail',
        key: 'detail_id'
      }
    },
    history_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    }
  }, {
    sequelize,
    tableName: 'transaction_history',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "history_id" },
        ]
      },
      {
        name: "service_detail_fk",
        using: "BTREE",
        fields: [
          { name: "detail_id" },
        ]
      },
      {
        name: "user_id_fk",
        using: "BTREE",
        fields: [
          { name: "history_user_id" },
        ]
      },
    ]
  });
};
