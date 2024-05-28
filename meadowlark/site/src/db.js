import 'dotenv/config';
import mongoose from 'mongoose';

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bfomdfu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
};
const maxConnectTries = 5;
let tries = 1;
export default async function dbConnect() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } catch (err) {
    console.dir(err);
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
    if (maxConnectTries > tries) {
      dbConnect();
      tries++;
    } else {
      tries = 0;
      console.dir('Out of tries');
      setTimeout(() => {
        dbConnect();
      }, 3000);
    }
  }
}
