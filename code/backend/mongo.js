const mongoose = require("mongoose");

// if (process.argv.length < 3) {
//   console.log("give password as argument");
//   process.exit(1);
// }

// const password = process.argv[2];

const url = `mongodb+srv://202221045517_db_user:zIcnJyOOnXAkuioc@cluster0.colfckh.mongodb.net/noteApp?appName=Cluster0`;

// mongoose.set("strictQuery", false);

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

mongoose.connect(url, clientOptions);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

// const note = new Note({
//   content: "HTML is easy",
//   important: true,
// });

// note.save().then((result) => {
//   console.log("note saved!");
//   mongoose.connection.close();
// });

Note.find({ important: true }).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});
