module.exports = (app) => {

    const model = app.api.models.cases;

    const getAll = async (req, res) => {
        try {
            const User = req.user;
            if (!User || User.role !== 'ADMIN')
                return res.status(401).send({ message: 'Usuario nao autorizado!' });

            const casesPending = await model.findCases();

            if (!casesPending) return res.status(401).send({ message: 'Erro na busca de casos' });

            return res.status(200).send(casesPending);
        } catch (err) {
            return res.status(401).send({ message: 'Erro desconhecido' });
        }
    };

    const create = async (req, res) => {
        try {
            const { oneCase } = req.body;
            const User = req.user;

            if (User.role === 'USER') return res.status(400).send({ message: 'Usuario nao autorizado!' });

            const result = await model.createCase({ ...oneCase, createdBy: User });

            if (!result) return res.status(400).send({ message: 'Erro Desconhecido' });

            return res.status(200).send('created successful!');
        } catch (err) {
            return res.status(400).send('Error Desconhecido');
        }
    };

    const getCasesPending = async (req, res) => {
        try {
            const User = req.user;
            let casesPending;
            if (!User || (User.role !== 'ADMIN' && User.role !== 'HELPER'))
                return res.status(401).send('Usuario Nao autorizado!');

            if (User.role === 'HELPER')
                casesPending = await model.findPendingByHelper(User.username);
            else
                casesPending = await model.findPending();

            if (!casesPending)
                return res.status(401).send({ message: 'Erro em buscar casos pendentes!' });

            return res.status(200).send(casesPending);
        } catch (err) {
            return res.status(401).send({ message: 'Erro desconhecido' });
        }
    };

    const approveCase = async (req, res) => {
        try {
            const { pendencies } = req.body;
            const User = req.user;
            let result;

            if (!User || (User.role !== 'ADMIN' && User.role !== 'HELPER'))
                return res.status(401).send({ message: 'Nao Autorizado' });
            if (!pendencies || !pendencies.length) return res.status(401).send({ message: 'Nao existem pendencias!' });

            if (User.role === 'HELPER')
                result = await model.ApprovePendenciesByHelper(pendencies);
            else
                result = await model.ApprovePendencies(pendencies);

            if (!result) return res.status(400).send('error nas mudanças!');

            return res.status(200).send({ message: 'Aprovados com sucesso!' });
        } catch (err) {
            console.log(err);
            return res.status(500).send({ message: 'Erro desconhecido!' });
        }
    };

    const deleteCase = async (req, res) => {
        try {
            const { cases } = req.body;
            const User = req.user;

            if (!User || (User.role !== 'ADMIN' && User.role !== 'HELPER'))
                return res.status(401).send({ message: 'Nao Autorizado' });

            const result = await model.deleteCases(cases);

            if (!result) return res.status(400).send('Erro nas mudanças!');

            return res.status(200).send({ message: 'Deletado com sucesso!' });
        } catch (err) {

        }
    };

    return { getAll, create, getCasesPending, approveCase, deleteCase };
};