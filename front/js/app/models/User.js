class User{

    constructor(nome, endereco, telefone, email, usuario, senha){
        this._id;
        this._nome = nome;
        this._endereco = endereco;
        this._telefone = telefone;
        this._email = email;
        this._usuario = usuario;
        this._senha = senha;

        //congela o objeto para não poder modificar depois de instanciado
        Object.freeze(this);
    }

    get nome(){
        return this._nome;
    }

    get endereco(){
        return this._endereco;
    }

    get telefone(){
        return this._telefone;
    }

    get usuario(){
        return this._usuario;
    }

    get senha(){
        return this._senha;
    }

    get email(){
        return this._email;
    }
}