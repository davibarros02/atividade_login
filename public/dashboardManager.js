const capacidadeForm = document.getElementById('capacidadeForm');
const capacidadeInput = document.getElementById('capacidadeTotal');
const editarCapacidadeButton = document.getElementById('editarCapacidade');
const decrementarCapacidadeButton = document.getElementById('decrementarCapacidade');
const incrementarCapacidadeButton = document.getElementById('incrementarCapacidade');

let editandoCapacidade = false;

const atualizarCapacidade = (delta) => {
    const valorAtual = Number(capacidadeInput.value);
    const valorMinimo = Number(capacidadeInput.min);
    const proximoValor = valorAtual + delta;

    capacidadeInput.value = Math.max(valorMinimo, proximoValor);
};

editarCapacidadeButton.addEventListener('click', () => {
    if (!editandoCapacidade) {
        editandoCapacidade = true;
        capacidadeInput.readOnly = false;
        decrementarCapacidadeButton.disabled = false;
        incrementarCapacidadeButton.disabled = false;
        editarCapacidadeButton.textContent = 'Salvar';
        capacidadeInput.focus();
        return;
    }

    capacidadeForm.submit();
});

decrementarCapacidadeButton.addEventListener('click', () => atualizarCapacidade(-1));
incrementarCapacidadeButton.addEventListener('click', () => atualizarCapacidade(1));
