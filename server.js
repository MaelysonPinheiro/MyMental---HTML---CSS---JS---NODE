const express = require('express');
const mysql = require('mysql');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors'); 
const multer = require('multer');

const app = express();
const port = 3000;

// Configuração do middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use(cors());
app.use(bodyParser.json());

// Configuração da sessão
app.use(session({
    secret: 'segredo', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

// Conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '', 
    database: 'mymental' 
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage: storage });

// Serve os arquivos estáticos
app.use(express.static(path.join(__dirname, 'views')));

// Rota para servir o formulário de registro
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// Rota para lidar com o envio do formulário de registro
app.post('/register', async (req, res) => {
    const { username, email, password, confirmPassword, prefere_forum, prefere_grupo_conversacao } = req.body;

    if (password !== confirmPassword) {
        return res.send('As senhas não coincidem!');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)';

        const forumPreference = prefere_forum ? 1 : 0;
        const groupPreference = prefere_grupo_conversacao ? 1 : 0;

        db.query(sql, [username, email, hashedPassword, forumPreference, groupPreference], (err, result) => {
            if (err) {
                console.error('Erro ao inserir usuário no banco de dados:', err);
                return res.send('Erro ao registrar o usuário.');
            }
            res.redirect('/login');
        });
    } catch (err) {
        console.error('Erro ao registrar o usuário:', err);
        res.send('Erro ao registrar o usuário.');
    }
});

// Rota para servir a página de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Rota para lidar com o login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    const sql = 'SELECT * FROM users WHERE email = ?';
    
    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error('Erro ao consultar o banco de dados:', err);
            return res.send('Erro ao fazer login.');
        }

        if (results.length === 0) {
            return res.send('E-mail ou senha inválidos.');
        }

        const user = results[0];

        try {
            const match = await bcrypt.compare(password, user.senha);
            if (match) {
                req.session.userId = user.id; 
                req.session.username = user.nome; 
                res.redirect('/auto'); 
            } else {
                res.send('E-mail ou senha inválidos.');
            }
        } catch (error) {
            console.error('Erro ao comparar senha:', error);
            res.send('Erro ao fazer login.');
        }
    });
});

// Rota para servir a página auto.html
app.get('/auto', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, 'views', 'auto.html'));
});

// Rota para servir a página de configuração
app.get('/config', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, 'views', 'config.html'));
});

// Rota para fazer logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao destruir sessão:', err);
            return res.send('Erro ao fazer logout.');
        }
        res.redirect('/index.html');
    });
});

// Middleware para verificar se o usuário está autenticado
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/login');
}

// Exemplo de rota protegida
app.get('/dashboard', isAuthenticated, (req, res) => {
    res.send('Bem-vindo ao Dashboard!');
});


// Rota para obter o nome do usuário logado
app.get('/username', isAuthenticated, (req, res) => {
    const sql = 'SELECT nome FROM users WHERE id = ?';
    db.query(sql, [req.session.userId], (err, results) => {
        if (err) {
            console.error('Erro ao consultar o nome do usuário:', err);
            return res.status(500).json({ error: 'Erro ao obter o nome do usuário' });
        }
        if (results.length > 0) {
            res.json({ username: results[0].nome });
        } else {
            res.json({ username: 'Usuário' });
        }
    });
});


// Rota para obter as informações do usuário logado
app.get('/api/informacoes-pessoais', isAuthenticated, (req, res) => {
    const userId = req.session.userId; // Obtém o ID do usuário da sessão

    db.query('SELECT nome, email FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Erro ao consultar as informações do usuário:', err);
            return res.status(500).json({ error: 'Erro ao obter informações do usuário' });
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    });
});


// Rota para atualizar a senha do usuário
// Rota para atualizar a senha
app.post('/update-password', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send('Usuário não autenticado.');
    }

    const { newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).send('Nova senha é necessária.');
    }

    // Hash da nova senha
    bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Erro ao hash da nova senha:', err);
            return res.status(500).send('Erro ao atualizar a senha.');
        }

        // Atualiza a senha no banco de dados
        const sql = 'UPDATE users SET senha = ? WHERE id = ?';
        db.query(sql, [hashedPassword, req.session.userId], (err, result) => {
            if (err) {
                console.error('Erro ao atualizar a senha no banco de dados:', err);
                return res.status(500).send('Erro ao atualizar a senha.');
            }
            res.send('Senha atualizada com sucesso!');
        });
    });
});

app.post('/api/metas', isAuthenticated, (req, res) => {
    const { meta, data_meta } = req.body; 
    const userId = req.session.userId; 

    const sql = 'INSERT INTO metas_pessoais (user_id, meta, data_meta) VALUES (?, ?,?)';
    db.query(sql, [userId, meta, data_meta], (err, results) => {
        if (err) {
            console.error('Erro ao salvar a meta:', err);
            return res.status(500).json({ error: 'Erro ao salvar a meta' });
        }
        res.status(201).json({ meta }); 
    });
});

app.get('/api/metas', isAuthenticated, (req, res) => {
    const userId = req.session.userId; 

    const sql = 'SELECT id, meta, data_meta FROM metas_pessoais WHERE user_id = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar metas:', err);
            return res.status(500).json({ error: 'Erro ao buscar metas' });
        }
        res.json(results); 
    });
});

app.delete('/api/metas/:id', isAuthenticated, (req, res) => {
    const metaId = req.params.id;
    const userId = req.session.userId; 

    console.log('Meta ID:', metaId);
    console.log('User ID:', userId);

    const sql = 'DELETE FROM metas_pessoais WHERE id = ? AND user_id = ?';
    db.query(sql, [metaId, userId], (err, result) => {
        if (err) {
            console.error('Erro ao excluir a meta:', err);
            return res.status(500).json({ error: 'Erro ao excluir a meta' });
        }
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Meta excluída com sucesso' });
        } else {
            res.status(404).json({ error: 'Meta não encontrada ou não pertence ao usuário' });
        }
    });
});

//Rota para adicionar ao Diario

app.post('/api/diarios', isAuthenticated, (req, res) => {
    const { diario } = req.body;
    const sql = 'INSERT INTO diario_pessoal (user_id, entrada, data_entrada) VALUES (?, ?, CURDATE())';

    db.query(sql, [req.session.userId, diario], (err, result) => {
        if (err) {
            console.error('Erro ao registrar no diario, Erro: ', err);
            return res.status(500).json({ error: 'Erro ao registrar no diario' });
        }
        res.status(201).json({ success: true });
    });
});

// Rota para buscar todas as entradas do diário
app.get('/api/diarios', isAuthenticated, (req, res) => {
    const sql = 'SELECT id, entrada, data_entrada FROM diario_pessoal WHERE user_id = ?';
    
    db.query(sql, [req.session.userId], (err, resultados) => {
        if (err) {
            console.error('Erro ao buscar entradas do diário:', err);
            return res.status(500).json({ error: 'Erro ao buscar entradas do diário' });
        }
        res.json(resultados); // Retorna as entradas do diário
    });
});

// Rota para excluir uma entrada do diário
app.delete('/api/diarios/:id', isAuthenticated, (req, res) => {
    const { id } = req.params; // Obtém o ID da entrada a ser excluída
    const sql = 'DELETE FROM diario_pessoal WHERE id = ? AND user_id = ?';

    db.query(sql, [id, req.session.userId], (err, result) => {
        if (err) {
            console.error('Erro ao excluir entrada do diário:', err);
            return res.status(500).json({ error: 'Erro ao excluir entrada do diário' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Entrada do diário não encontrada' });
        }
        res.status(204).send(); // Responde com sucesso (sem conteúdo)
    });
});


// Rota para adicionar uma emoção
app.post('/api/diario', isAuthenticated, (req, res) => {
    const { emocao, data_emocao } = req.body; 
    const sql = 'INSERT INTO registro_emocoes (user_id, emocao, data_emocao) VALUES (?, ?, ?)';
    
    db.query(sql, [req.session.userId, emocao, data_emocao], (err, results) => {
        if (err) {
            console.error('Erro ao registrar a emoção:', err);
            return res.status(500).json({ error: 'Erro ao registrar a emoção' });
        }
        res.status(201).json({ success: true });
    });
});

// Rota para excluir uma emoção
app.delete('/api/diario/:id', isAuthenticated, (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM registro_emocoes WHERE id = ? AND user_id = ?'; 
    
    db.query(sql, [id, req.session.userId], (err, results) => {
        if (err) {
            console.error('Erro ao deletar a entrada do diário:', err);
            return res.status(500).json({ error: 'Erro ao deletar a entrada do diário' });
        }
        if (results.affectedRows > 0) {
            res.status(200).json({ message: 'Entrada deletada com sucesso' });
        } else {
            res.status(404).json({ error: 'Entrada não encontrada ou você não tem permissão' });
        }
    });
});

// Rota para buscar emoções
app.get('/api/diario', isAuthenticated, (req, res) => {
    const userId = req.session.userId; 

    const sql = 'SELECT id, emocao, data_emocao FROM registro_emocoes WHERE user_id = ? ORDER BY data_emocao DESC'; 
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Erro ao buscar emoções:', err);
            return res.status(500).json({ error: 'Erro ao buscar emoções' });
        }
        res.json(results);
    });
});


app.post('/api/professionals/register', upload.single('profile_picture'), (req, res) => {
    const { name, specialty, location, price_range, bio } = req.body;
    const profilePicturePath = `/uploads/${req.file.filename}`; 

    const sql = 'INSERT INTO profissionais (nome, especialidade, preco, localizacao, biografia, foto_url) VALUES (?,?, ?, ?, ?, ?)';
    const values = [name, specialty, price_range, location, bio, profilePicturePath];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erro ao cadastrar profissional:', err);
            return res.status(500).json({ error: 'Erro ao cadastrar profissional' });
        }
        res.redirect('/auto.html')
    });
});

app.get('/api/professionals', (req, res) => {
    db.query('SELECT * FROM profissionais', (err, results) => {
        if (err) {
            console.error('Erro ao buscar profissionais:', err);
            return res.status(500).json({ error: 'Erro ao buscar profissionais' });
        }
        res.json(results);
    });
});

app.use('/uploads', express.static('uploads'));

app.get('/api/professionals', async (req, res) => {
    try {
        const professionals = await db.query('SELECT * FROM profissionais'); 
        res.json(professionals);
    } catch (error) {
        console.error('Erro ao buscar profissionais:', error);
        res.status(500).json({ message: 'Erro ao buscar profissionais.' });
    }
});

//FORUM

app.post('/api/posts', upload.single('image'), isAuthenticated, (req, res) => {
    const { message } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const userId = req.session.userId; // Ajuste se necessário

    if (!message) {
        return res.status(400).json({ success: false, message: 'Conteúdo do post não pode estar vazio.' });
    }

    const query = `
        INSERT INTO forum_posts (user_id, conteudo, foto_url, data_postagem)
        VALUES (?, ?, ?, NOW())
    `;

    db.query(query, [userId, message, imageUrl], (err, result) => {
        if (err) {
            console.error(err); // Veja o erro no console do servidor para entender o que está errado
            return res.status(500).json({ success: false, message: 'Erro ao salvar o post.' }); // Resposta de erro no formato JSON
        }
        res.status(201).json({ success: true, message: 'Post criado com sucesso!' }); // Resposta de sucesso
    });
});



app.get('/api/posts', (req, res) => {
    const query = 'SELECT * FROM forum_posts ORDER BY data_postagem DESC';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao recuperar os posts:', err);
            return res.status(500).json({ success: false, message: 'Erro ao recuperar os posts.' });
        }
        res.json(results); // Retorna os dados como JSON
    });
});

  



//CHAT GLOBAL

app.post('/api/chat', upload.single('image'), (req, res) => {
    const {message} = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const userId = req.session.userId; // O ID do usuário logado, você pode obter da sessão ou token

    const query = `
        INSERT INTO chat_global (user_id, message, image_url, sent_at)
        VALUES (?, ?, ?, NOW())
    `;
    db.query(query, [userId, message, imageUrl], (err, result) => {
        if (err) {
            console.error('Erro ao salvar a mensagem:', err);
            return res.status(500).send('Erro ao salvar a mensagem');
        }
        res.status(200).json({ success: true, message: 'Mensagem enviada com sucesso' });
    });
});

// Rota para carregar as mensagens do chat
app.get('/api/chat', (req, res) => {
    const query = 'SELECT * FROM chat_global ORDER BY sent_at DESC';  // Busca as mensagens mais recentes

    db.query(query, (err, result) => {
        if (err) {
            console.error('Erro ao carregar mensagens:', err);
            return res.status(500).send('Erro ao carregar mensagens.');
        }

        res.json({
            messages: result // Retorna as mensagens ordenadas por data
        });
    });
});


module.exports = router;

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
