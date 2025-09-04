import { Sequelize } from "sequelize";

//database connection
const sequelize=new Sequelize('crm_02','root','Suvrajit@2003',{
    host:'localhost',
    dialect:'mysql',
    logging:false,
})

export default sequelize;