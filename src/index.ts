 import express from 'express';
 import subjectsRouter from "./routes/subjects";
 import cors from "cors";

const app = express();
app.use(express.json());
app.use('/api/subjects', subjectsRouter);

if(!process.env.FRONTEND_URL) {
    throw new Error('No FronTEND_URL environment variable');
}
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods:  [ "GET", "POST", "PUT", "DELETE" ],
    credentials: true

}))
const PORT = 8000;

app.get('/', (req, res) => {
    res.send('Hello, welcome to classroom API');
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})
