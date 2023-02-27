// CRUD

const { MongoClient, ObjectId } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(connectionURL, { useNewUrlParser: true })
  .then((client) => {
    const db = client.db(databaseName);

    const users = db.collection("users");
    const tasks = db.collection("tasks");

    tasks.deleteOne({ description: "Learn abracadabra" }).then((result) => {
      console.log(result);
    });
  })
  .catch((err) => {
    console.log("Error:", err);
  });
