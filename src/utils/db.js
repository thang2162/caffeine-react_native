// @flow

import Realm from 'realm';

import DrinkModel from './DrinkModel';

console.log(JSON.stringify(DrinkModel.schema));

const saveDrink = (name, caffeine) => {
  return new Promise(async resolve => {
    const realm = await Realm.open({
      path: 'caffeine_realm',
      schema: [DrinkModel.schema],
    });

    let drink;
    console.log(name, caffeine);

    try {
      // Auto increment ID logic
      const lastDrink = realm
        .objects(DrinkModel.get())
        .sorted('_id', true)[0];
      const highestId = lastDrink == null ? 0 : lastDrink._id;

      realm.write(() => {
        drink = realm.create(DrinkModel.get(), {
          _id: highestId == null ? 1 : highestId + 1,
          name: name,
          caffeineLevel: caffeine,
          dateTime: new Date(),
        });

        console.log(`Drink Added: ${drink.name}`);
      });
    } catch (error) {
      console.log(`An error occurred: ${error}`);
      resolve({success: false});
    }
    // realrm.close();
    resolve({success: true});
  });
};

const getDrinks = () => {
  return new Promise(async resolve => {
    try {
      const realm = await Realm.open({
        path: 'caffeine_realm',
        schema: [DrinkModel.schema],
      });

      let results = [];

      // query realm for all instances of the "Task" type.
      const drinks = realm.objects('Drink');
      console.log(`The list of drinks are: ${drinks.map(drink => drink.name)}`);

      drinks.forEach((item, ind, arr) => {
        if (item && item.dateTime.getTime() - Date.now() <= -86400000) {
          realm.write(() => {
            realm.delete(item);
          });
        } else {
          results.push(item);
        }

        if (ind === arr.length - 1) {
          resolve(results);
        }
      });
      if (drinks.length === 0) {
        console.log(drinks.length);
        resolve(drinks);
      }
    } catch (error) {
      console.log(`An error occurred: ${error}`);
    }

    // realm.close();
  });
};

const removeDrink = item => {
  return new Promise(async resolve => {
    try {
      const realm = await Realm.open({
        path: 'caffeine_realm',
        schema: [DrinkModel.schema],
      });
      realm.write(() => {
        realm.delete(item);
      });
      resolve();
    } catch (error) {
      console.log(`An error occurred: ${error}`);
    }

    // realm.close();
  });
};

export {saveDrink, getDrinks, removeDrink};
