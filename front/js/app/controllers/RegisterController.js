class RegisterController{
    constructor(){
        this._nome = document.querySelector('#nome');
        this._telefone = document.querySelector('#telefone');
        this._endereco = document.querySelector('#endereco');
        this._cpf = document.querySelector('#cpf');
        this._email = document.querySelector('#email');
        this._usuario = document.querySelector('#usuario');
        this._senha = document.querySelector('#senha');
    }

    register(event){
        event.preventDefault();
        
        axios.post(BASE_URL+'/user/registe', {
                nome: this._nome.value,
                telefone: this._telefone.value,
                endereco: this._endereco.value,
                cpf: this._cpf.value,
                email: this._email.value,
                usuario: this._usuario.value,
                senha: this._senha.value
            })
        .then(function (response) {
            demo.showSwal('success-message', 'Login cadastrado', 'Agora você pode logar.', () => {window.location = 'login.html';});   
        })
        .catch(function (error) {
            demo.showSwal('error-message', 'Erro ao cadastrar', 'Houve um problema em seu cadastro.');
            console.log(error);
        });
        
    }
}