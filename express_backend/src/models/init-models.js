const {Sequelize} = require('sequelize')
const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect : "mysql",
    pool : {
      max : 5,
      min : 0,
      acquire : 30000,
      idle : 10000
    },
    logging : false
  }
)

var DataTypes = require("sequelize").DataTypes;
var _locations = require("./locations");
var _payments = require("./payments");
var _service_detail = require("./service_detail");
var _services = require("./services");
var _transaction_history = require("./transaction_history");
var _users = require("./users");

function initModels(sequelize) {
  var locations = _locations(sequelize, DataTypes);
  var payments = _payments(sequelize, DataTypes);
  var service_detail = _service_detail(sequelize, DataTypes);
  var services = _services(sequelize, DataTypes);
  var transaction_history = _transaction_history(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  users.belongsTo(locations, { as: "address", foreignKey: "address_id"});
  locations.hasMany(users, { as: "users", foreignKey: "address_id"});
  service_detail.belongsTo(payments, { as: "payment", foreignKey: "payment_id"});
  payments.hasMany(service_detail, { as: "service_details", foreignKey: "payment_id"});
  transaction_history.belongsTo(service_detail, { as: "detail", foreignKey: "detail_id"});
  service_detail.hasMany(transaction_history, { as: "transaction_histories", foreignKey: "detail_id"});
  service_detail.belongsTo(services, { as: "service", foreignKey: "service_id"});
  services.hasMany(service_detail, { as: "service_details", foreignKey: "service_id"});
  transaction_history.belongsTo(users, { as: "history_user", foreignKey: "history_user_id"});
  users.hasMany(transaction_history, { as: "transaction_histories", foreignKey: "history_user_id"});

  return {
    locations,
    payments,
    service_detail,
    services,
    transaction_history,
    users,
  };
}
// module.exports = initModels;
// module.exports.initModels = initModels;
// module.exports.default = initModels;

const models = initModels(sequelize);
module.exports = {sequelize, models}