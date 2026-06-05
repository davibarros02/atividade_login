const Mensalista = require('../models/mensalistaModel');
const MensalistaPagamento = require('../models/mensalistaPagamentoModel');
const Estacionamento = require('../models/estacionamentoModel');

const PLACA_REGEX = /^[A-Z]{3}-?[0-9][A-Z0-9][0-9]{2}$/i;

exports.getMensalistas = async (req, res) => {
    try {
        const list = await Mensalista.findAll({
            order: [['validade', 'DESC']]
        });

        // Adicionar flag virtual 'ativo'
        const now = new Date();
        const mensalistas = list.map(m => {
            const data = m.toJSON();
            data.ativo = new Date(data.validade) >= now;
            return data;
        });

        res.render('mensalistas', {
            mensalistas,
            canCreateAdmin: req.canCreateAdmin
        });
    } catch (error) {
        req.flash('error', `Erro ao carregar mensalistas: ${error.message}`);
        res.redirect('/dashboard');
    }
};

exports.postPagamentoMensalidade = async (req, res) => {
    let { placa, tipoVeiculo } = req.body;

    if (!placa) {
        req.flash('error', 'Placa do veículo é obrigatória.');
        return res.redirect('/mensalistas');
    }

    placa = placa.trim().toUpperCase();

    if (!PLACA_REGEX.test(placa)) {
        req.flash('error', 'Formato de placa inválido. Formatos aceitos: ABC-1234 ou ABC1D23.');
        return res.redirect('/mensalistas');
    }

    if (!tipoVeiculo || (tipoVeiculo !== 'carro' && tipoVeiculo !== 'moto')) {
        tipoVeiculo = 'carro';
    }

    try {
        const [estacionamento] = await Estacionamento.findOrCreate({
            where: { id: 1 },
            defaults: {
                vagasOcupadasCarros: 0,
                vagasOcupadasMotos: 0,
                capacidadeCarros: Number(process.env.ESTACIONAMENTO_CAPACIDADE_CARROS || 150),
                capacidadeMotos: Number(process.env.ESTACIONAMENTO_CAPACIDADE_MOTOS || 20),
                valorTiqueteCarro: Number(process.env.TIQUETE_VALOR_CARRO || 4.00),
                valorTiqueteMoto: Number(process.env.TIQUETE_VALOR_MOTO || 2.00),
                valorMensalidadeCarro: Number(process.env.MENSALISTA_VALOR_CARRO || 88.00),
                valorMensalidadeMoto: Number(process.env.MENSALISTA_VALOR_MOTO || 44.00)
            }
        });

        const valorMensalidade = tipoVeiculo === 'moto'
            ? Number(estacionamento.valorMensalidadeMoto)
            : Number(estacionamento.valorMensalidadeCarro);

        const now = new Date();
        // Obter número de dias no mês corrente do pagamento
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

        // Registrar pagamento no histórico
        await MensalistaPagamento.create({
            placa,
            tipoVeiculo,
            valor: valorMensalidade
        });

        // Buscar cadastro de mensalista
        const mensalista = await Mensalista.findOne({ where: { placa } });

        let novaValidade;
        if (mensalista) {
            const validadeAtual = new Date(mensalista.validade);
            if (validadeAtual >= now) {
                // Adiciona os dias à validade futura
                novaValidade = new Date(validadeAtual);
                novaValidade.setDate(novaValidade.getDate() + daysInMonth);
            } else {
                // Plano expirado, nova validade a partir de hoje
                novaValidade = new Date(now);
                novaValidade.setDate(novaValidade.getDate() + daysInMonth);
            }

            await mensalista.update({
                tipoVeiculo,
                validade: novaValidade
            });
        } else {
            // Novo cadastro, validade a partir de hoje
            novaValidade = new Date(now);
            novaValidade.setDate(novaValidade.getDate() + daysInMonth);

            await Mensalista.create({
                placa,
                tipoVeiculo,
                validade: novaValidade
            });
        }

        req.flash('success', `Pagamento de mensalidade registrado para ${placa}. Válido por mais ${daysInMonth} dias (até ${novaValidade.toLocaleDateString('pt-BR')}).`);
    } catch (error) {
        req.flash('error', `Erro ao registrar mensalidade: ${error.message}`);
    }

    res.redirect('/mensalistas');
};
