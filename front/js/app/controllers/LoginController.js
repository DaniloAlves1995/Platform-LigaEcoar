class LoginController{

    constructor(){
        this._usuario = document.querySelector('#usuario');
        this._senha = document.querySelector('#senha');
        
    }

    login(event){
        //retirar o evento de recarregar a página que é chamado pelo form
        event.preventDefault();

        axios.post(BASE_URL+'/user/authenticate', {
            usuario: this._usuario.value,
            senha: this._senha.value
        })
        .then(function (response) {
            if(response.data.success){
                console.log('logado com sucesso!');
                console.log(response.data);
            }else{
                document.querySelector("#texto-notificacao").innerHTML = '<b>Erro</b> - '+response.data.error;
                document.querySelector("#notificacao").hidden = false;
            }  
        })
        .catch(function (error) {
            document.querySelector("#texto-notificacao").innerHTML = '<b>Erro</b> - Houve um problema em seu login.';
            document.querySelector("#notificacao").hidden = false;
        });
    }
}