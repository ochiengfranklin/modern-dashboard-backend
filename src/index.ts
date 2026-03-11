 import express from 'express';

const app = express();
app.use(express.json());
const PORT = 8000;

app.get('/', (req, res) => {
    res.send('Hello, welcome to classroom API');
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})
