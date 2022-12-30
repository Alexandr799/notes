const findInDataBase = async (db, collection, obj) => db.collection(collection).findOne(obj);

const pushInDatabase = async (db, collection, obj) =>
  db
    .collection(collection)
    .insertOne(obj)
    .then((data) => {
      if (!data.acknowledged) {
        throw new Error("Ошибка на сервере при добавлении в базу");
      }
      return data;
    });

const deleteInDataBase = async (db, collection, obj) =>
  db
    .collection(collection)
    .deleteOne(obj)
    .then((data) => {
      if (!data.acknowledged || data.deletedCount === 0) {
        throw new Error("Ошибка на сервере при удалении");
      }
      return data;
    });

const deleteInDataBaseAll = async (db, collection, obj) =>
  db
    .collection(collection)
    .deleteMany(obj)
    .then((data) => {
      console.log(data);
      if (!data.acknowledged || data.deletedCount === 0) {
        throw new Error("Ошибка на сервере при удалении");
      }
      return data;
    });

const findInDataBaseAllAndSort = async (db, collection, obj, sortCriteria, skipCount) =>
  db.collection(collection).find(obj).sort(sortCriteria).skip(skipCount).limit(20).toArray();

const countData = async (db, collection, obj) => db.collection(collection).countDocuments(obj);

const updateInDataBase = async (db, collection, obj, data) =>
  db
    .collection(collection)
    .updateOne(obj, { $set: data })
    .then((data) => {
      if (data.modifiedCount === 0 || data.matchedCount === 0) {
        throw new Error("Ошибка на сервере при редактировании");
      }
      return data;
    });

module.exports = {
  findInDataBase,
  pushInDatabase,
  deleteInDataBase,
  findInDataBaseAllAndSort,
  updateInDataBase,
  deleteInDataBaseAll,
  countData,
};
