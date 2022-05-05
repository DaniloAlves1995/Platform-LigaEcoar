class ContentController {

    constructor() {
        this._local = document.querySelector('#arquivo');
    }

    register(event, id) {
        
        if(event)
          event.preventDefault();
        
        var type;
        var file;
        let formData = new FormData();
        document.getElementsByName('tipo').forEach(el => {
            if (el.checked)
                type = el.value + '';
        });
        if(type == 'foto'){
          file = document.querySelector("#image-file").files[0];
          //check if it's update or cadastre
          if(this._edit && !file){
            file = document.querySelector("#imageSelected").src;
          }
          //check if file is empty
          if(!file && !this._edit){
            demo.showSwal('error-message', 'Imagem vazia.', 'Você deve selecionar uma imagem!');
            return null;
          }

          formData.append("file", file);
        }else{
          let url = new URL(document.querySelector("#URL").value.trim()); 
          let src = this.getNewURL(url);
          formData.append("url", src);
        }
        var titulo = document.querySelector("#titulo").value;
        var descricao = document.querySelector("#descricao").value;

       
        formData.append("titulo", titulo);
        formData.append("tipo", type);
        formData.append("descricao", descricao);
        
        formData.append("id_user", '606cd7d982325f1fe43d4d75');

        if(!this._edit){
         
          axios.post(BASE_URL + '/content/register', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          })
          .then(function (response) {
            if(response.data.success){
              demo.showSwal('success-message', 'Conteúdo Cadastrado', 'Seu conteúdo está disponível na Timeline.'); 
            }else{
              demo.showSwal('error-message', 'Erro ao cadastrar', ''+response.data.error);
            }

          }).catch(function (error) {
            demo.showSwal('error-message', 'Erro ao cadastrar', 'Houve um problema no cadastro de conteúdo.');
          });
          this.clearFilds();
        }else{
          // To edit
          console.log(id);
          axios.put(BASE_URL + '/content/update/'+id, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(function (response) {
            if(response.data.success){
              demo.showSwal('success-message', 'Conteúdo Editado.', 'Seu conteúdo foi editado com sucesso!'); 

              //update the card on the timeline after editing
              formData.append("id", id);
              formData.append("url", response.data.url);
              console.log("url: "+response.data.url+"\nDescricao: "+formData.get('descricao')+"\ntipo: "+formData.get('tipo')+"\ntitulo: "+formData.get('titulo'));
              timelineController.contentUpdate(formData);
              
            }else{
              demo.showSwal('error-message', 'Erro ao editar.', ''+response.data.error);
            }
          }).catch(() => {
            demo.showSwal('error-message', 'Erro ao editar.', 'Houve um problema na edição de conteúdo.');
          });
        }
    }

    photo() {

        document.querySelector('#arquivo').innerHTML = `
        <label class="col-sm-2 col-form-label">Imagem:</label>
        <div class="col-md-4 col-sm-4" style="margin-top: 15px;">
          <div class="fileinput fileinput-new text-center" data-provides="fileinput">
            <div class="fileinput-new thumbnail">
              <img id="imageSelected" src="../../../assets/img/image_placeholder.jpg" alt="...">
            </div>
            <div class="fileinput-preview fileinput-exists thumbnail"></div>
            <div>
              <span class="btn btn-rose btn-round btn-file">
                <span class="fileinput-new">Selecionar</span>
                <span class="fileinput-exists">Escolher</span>
                <input id="image-file" type="file" name="..." />
              </span>
              <a href="#pablo" class="btn btn-danger btn-round fileinput-exists" data-dismiss="fileinput"><i class="fa fa-times"></i> Remover</a>
            </div>
          </div>
        </div>`;
    }

    video() {

        document.querySelector('#arquivo').innerHTML = `
             
                <label class="col-sm-2 col-form-label">URL Vídeo:</label>
                <div id="urlcolum" class="col-sm-4">
                    <div class="form-group">
                    <input id="URL" class="form-control" required="true" name="emailadress" aria-required="true" aria-invalid="true">
                    <label style="display: none;" id="link-erro" class="error bmd-label-static" for="exampleEmails">O link do vídeo é obrigatório.</label>
                        <span class="bmd-help">Cole sua URL aqui!</span>
                    </div>
                </div>
                <div id="videobutton" class="col-sm-6">
                    <button id="previewVideo" type="button" onclick="contentController.getPrevURL()"  class="btn btn-just-icon btn-youtube">
                      <i class="fa fa-youtube"> </i>
                    </button>
                </div>
                <div class="col-sm-2 col-form-label"></div>
                <div id="videocolum" class="col-md-4 col-sm-4" style="margin-top: 15px;">
                  <div class="fileinput fileinput-new text-center" data-provides="fileinput" style="">
                    <div id="local-preview" class="fileinput-new thumbnail" style="">
                      <img  src="../../../assets/img/image_placeholder.jpg" alt="..." >
                    </div>
                  </div>
                </div>
              `;
              document.querySelector("#videocolum").className = "col-md-10";
              document.querySelector("#urlcolum").className = "col-sm-8";
              document.querySelector("#videobutton").className = "col-sm-2 col-form-label";
    }

    getPrevURL() {
      let url_txt = document.querySelector("#URL").value.trim();
      if(url_txt!=""){
        
        let url = new URL(url_txt);
        let div = document.querySelector("#local-preview");
        document.querySelector("#link-erro").style="display: none;"

        let src = this.getNewURL(url);

        div.style = "max-width: 100%;"
        div.innerHTML = `<iframe height="232.234" id="preview" src="${src}" frameborder="0" allowfullscreen></iframe>`;
      }else{
        document.querySelector("#link-erro").style="display: block;"
      }
    }

    getNewURL(url){
      //check url type
      let cod = url.searchParams.get("v");
      let src;
      if (cod) {
          src = "https://www.youtube.com/embed/" + cod;
      } else {
          src = "https://www.youtube.com/embed" + url.pathname;
      }

      return src;
    }

    clearFilds(){
        document.querySelector("#titulo").value = '';
        document.querySelector("#descricao").value = '';
        document.querySelector("#radio-photo").click();
    }

    //edit post
    setEditPost(id){
      this._edit = true;
      axios.get(BASE_URL + '/content/' + id, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
      })
      .then(function (response) {
        let content = response.data;
        //fill the filds
        document.querySelector("#titulo").value = content.titulo;
        document.querySelector("#descricao").value = content.descricao;
        if (content.tipo == "foto"){
          document.querySelector("#radio-photo").click();
          document.querySelector("#imageSelected").src = content.url;

        }else{
          document.querySelector("#radio-video").click();
          let array = content.url.split("/");
          document.querySelector("#URL").value = "https://www.youtube.com/watch?v="+array[array.length-1];
          document.querySelector("#previewVideo").click();
        }

        document.querySelector("#cadasterContent").style = "display: none;";
       

      }).catch(function (error) {
        demo.showSwal('error-message', 'Erro ao editar post.', 'Houve um problema na edição de post.');
      });
    }
}