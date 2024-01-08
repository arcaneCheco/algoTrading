import express from 'express';
import Alpaca from '@alpacahq/alpaca-trade-api';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
const port = 3000;

app.use(cors({
  origin: "*",
}));

// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())
app.use(express.json())

const alpaca = new Alpaca({
  keyId: process.env.APCA_API_KEY_ID_PAPER,
  secretKey: process.env.APCA_API_SECRET_KEY_PAPER,
  paper: true,
});

// alpaca.getAccount().then((account: any) => {
//   console.log("Current Account:", account);
// });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/assets", async (req, res) => {
  const filters = req.body;
  const assets = await getAssets(filters);
  res.send(assets)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


const getAssets = async (filters: Filters) => {
  try {
    const data = await alpaca.getAssets(filters);
    return data;
  } catch (error) {
    console.log({error})
  }
}

interface Filters {
  status?: string;
  asset_class?: string;
  exchange?: string;
}