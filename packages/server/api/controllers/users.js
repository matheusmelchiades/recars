
module.exports = (app) => {
    const model = app.api.models.users;

    const signup = async (req, res) => {
        try {
            const { username, password } = req.body;

            if (!username || !password)
                return res.status(401).send({ message: 'Incomplete Data!' });

            const usersDb = await model.findOne({ username: username });

            if (usersDb)
                return res.status(401).send({ message: 'Username Alredy registred!' });

            await model.create({ username, password });

            return res.status(200).send({ message: 'Criado com sucesso!' });
        } catch (err) {
            return res.status(500).send({ message: 'Erro interno' });
        }
    };

    const signin = async (req, res) => {
        try {
            const { username, password } = req.body;

            if (!username || !password)
                return res.status(401).send({ message: 'Incomplete Data!' });

            const user = await model.getToken(req.body);

            if (!user)
                return res.status(401).send({ message: 'User not found' });

            if (!user.token)
                return res.status(401).send({ message: 'Username or password invalid' });

            return res.status(200).send(user);

        } catch (err) {
            return res.status(500).send({ message: 'Erro interno' });
        };
    };

    return { signup, signin };
};