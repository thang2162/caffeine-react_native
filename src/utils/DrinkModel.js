// @flow
export default class Drink {
  /**
   * Getter for the class name
   * @return {String} Class name
   */
  static get() {
    return Drink.schema.name;
  }

  /**
   * Gets the model primary key
   * @return {String} Primary key of the session model
   */
  static primaryKey() {
    return Drink.schema.primaryKey;
  }

  /**
   * Class (Realm) schema
   * @type {Object}
   */
  static schema = {
    name: 'Drink',
    properties: {
      _id: 'int',
      name: 'string',
      caffeineLevel: 'int',
      dateTime: 'date',
    },
    primaryKey: '_id',
  }
}
