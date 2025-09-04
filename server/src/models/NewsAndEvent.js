import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const NewsAndEvent = sequelize.define(
  'NewsAndEvent',
  {
    titleEnglish: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    titleOdia: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    eventDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    document: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Active',
      validate: {
        isIn: [['Active', 'Inactive']]
      }
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: 'news_and_events',
    timestamps: true,
    // ❌ DEFAULT SCOPE REMOVED - Admin ko sabhi events chahiye
    scopes: {
      active: {
        where: {
          status: 'Active'
        }
      },
      inactive: {
        where: {
          status: 'Inactive'
        }
      }
    }
  }
);

export default NewsAndEvent;