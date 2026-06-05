document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('entradaForm');
    if (!form) return;

    const placaInput = document.getElementById('placa');
    const tipoPagamentoSelect = document.getElementById('tipoPagamento');

    if (!placaInput || !tipoPagamentoSelect) return;

    let mensalistas = [];
    try {
        mensalistas = JSON.parse(form.dataset.mensalistas || '[]');
    } catch (e) {
        console.error('Error parsing mensalistas dataset', e);
    }

    const checkPlaca = () => {
        const value = placaInput.value.trim().replace('-', '').toUpperCase();
        const isMensalista = mensalistas.some(p => p.replace('-', '').toUpperCase() === value);

        if (isMensalista) {
            tipoPagamentoSelect.value = 'mensalista';
        } else {
            if (tipoPagamentoSelect.value === 'mensalista') {
                tipoPagamentoSelect.value = 'pospago';
            }
        }
    };

    placaInput.addEventListener('input', checkPlaca);
    placaInput.addEventListener('change', checkPlaca);
});
