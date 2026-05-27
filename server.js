const express = require('express');
const path = require('path');

const app = express();

const userRoutes = require('./src/routes/usuario.route');
const authRoutes = require('./src/routes/auth.route');
const musicasRoutes = require('./src/routes/musicas.route')

const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/users', userRoutes)
app.use('/auth', authRoutes)
app.use('/musica', musicasRoutes)



app.listen(PORT, ()=>{
    console.log(`servidor rodando na http://localhost:${PORT}`)
})
