const { nanoid } = require("nanoid");
const {
  pushInDatabase,
  findInDataBaseAllAndSort,
  findInDataBase,
  updateInDataBase,
  deleteInDataBase,
  deleteInDataBaseAll,
  countData,
} = require("../methods/methodsDB");
const { auth, authWarningInit } = require("../methods/authMehods");
const noteRouter = require("express").Router();
const showdown = require("showdown");
const convertPDF = require("../methods/convertPDF");
const fs = require("fs").promises;

const converter = new showdown.Converter();

noteRouter.get("/", auth(), authWarningInit(), async (req, res) => {
  try {
    let note = await findInDataBase(req.db, "notes", { id: req.query.id });
    note.html = converter.makeHtml(note.text);
    res.json(note);
  } catch (err) {
    console.error(err);
    res.send(500).send("Ошибка на сервере!");
  }
});

noteRouter.post("/", auth(), authWarningInit(), async (req, res) => {
  try {
    let criterias = {
      userId: req.user.id,
      isArchived: req.body.age === "archive",
    };
    if (req.body.age != "archive" && req.body.age != "alltime") {
      const today = new Date();
      criterias.created =
        req.body.age === "1month"
          ? { $gte: new Date(today.setMonth(today.getMonth() - 1)) }
          : { $gte: new Date(today.setMonth(today.getMonth() - 3)) };
    }
    const skip = (req.body.page - 1) * 20;
    const data = await findInDataBaseAllAndSort(req.db, "notes", criterias, { created: -1 }, skip);
    const count = await countData(req.db, "notes", criterias);
    res.json({
      data: data,
      hasMore: count > req.body.page * 20,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка на сервере");
  }
});

noteRouter.put("/", auth(), authWarningInit(), async (req, res) => {
  try {
    const id = req.body.id;
    delete req.body.id;
    const editedobj = {
      ...req.body,
      created: new Date(),
    };
    await updateInDataBase(req.db, "notes", { id }, editedobj);
    res.json(editedobj);
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка на сервере");
  }
});

noteRouter.delete("/", auth(), authWarningInit(), async (req, res) => {
  try {
    if (req.query.id === "all") {
      await deleteInDataBaseAll(req.db, "notes", { userId: req.user.id, isArchived: true });
      return res.json({});
    }
    await deleteInDataBase(req.db, "notes", { id: req.query.id });
    res.json({});
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка на сервере");
  }
});

noteRouter.post("/new", auth(), authWarningInit(), async (req, res) => {
  try {
    const newNote = {
      title: req.body.title,
      text: req.body.text,
      id: nanoid(),
      userId: req.user.id,
      created: new Date(),
      isArchived: false,
    };
    await pushInDatabase(req.db, "notes", newNote);
    res.json(newNote);
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка на сервере");
  }
});

noteRouter.put("/archive", auth(), authWarningInit(), async (req, res) => {
  try {
    await updateInDataBase(req.db, "notes", { id: req.body.id }, { isArchived: req.body.archive });
    res.json({});
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка на сервере");
  }
});

noteRouter.get("/pdf", auth(), authWarningInit(), async (req, res) => {
  try {
    let note = await findInDataBase(req.db, "notes", { id: req.query.id });
    note.html = converter.makeHtml(note.text);
    const pdf = await convertPDF(note.html, note.id);
    res.download(pdf);
    await fs.rm(pdf);
  } catch (err) {
    console.error(err);
    res.status(500).send("Ошибка на сервере!");
  }
});

module.exports = noteRouter;
