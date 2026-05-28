const form = document.getElementById('form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        await axios.post('/login', {
                email: form.email.value,
                password: form.password.value
            })
        window.location = '/dashboard';
    } catch (error) {
        alert(error.response.data.message);
    }
});
