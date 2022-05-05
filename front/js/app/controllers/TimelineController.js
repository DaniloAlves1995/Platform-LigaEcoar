class TimelineController{

    posI = 0;
    flag = true;
    ration = 0.4;
    idUser = null;

    constructor(){
        this.eventScroll();
    }

    //append scroll event for add post by scroll event
    eventScroll(){
        let onScroll =  () => {
    
  
            //apply the calls only on timelines page
            if (window.scrollY+750>document.querySelector('html').scrollHeight && loadView.getNameView() == 'timeline') {
                if(this.flag){
                    this.flag = false;
                    setTimeout(() => {
                        this.flag = true;
                    }, 1000);
                    this.fetchContents(this.posI);
                    
                }
            }
        }

        //add to touch and scroll
        document.body.ontouchmove = onScroll;
        window.onscroll = onScroll;
    }

    setUserId(id){
        this.idUser = id;
    }

    fetchContents(posI){
        
        console.log("add conteudo "+posI);
        var listContents;
        var urlTimeline = '/content/timeline';
        //check if is mytimeline or global timeline
        if(this.idUser)
            urlTimeline = '/content/timeline/'+this.idUser;
        

        //fetch contents in database
        axios.post(BASE_URL + urlTimeline, {
            posI: posI
        })
        .then(function (response) {
          if(response.data.success){
             listContents = response.data.list;
             if(listContents.length!=0){
                this.buildTimeline(listContents);
                this.posI = posI + 2;
                this.ration += 0.1;
             }

          }else
            console.log("error em buscar da timeline");

        }.bind(this)).catch((error) => {
            console.log("error em chamar API");
            console.log(error);
        }); 
    }


    buildTimeline(listContents){
        const colors = ['#9c27b0', '#f44336', '#00bcd4', '#4caf50', '#ff9800', 'brown', 'darkblue', 'deeppink', 'tomato', 'teal', 'slategrey', 'orchid'];
        const icons = ['favorite', 'lightbulb', 'verified', 'thumb_up', 'trending_up', 'check_circle_outline', 'task_alt', 'star_rate',
                        'article', 'work', 'grade', 'done_outline', 'thumb_up_off_alt', 'done_all', 'flight_takeoff', 'stars', 'work_outline',
                        'extension', 'assignment_turned_in', 'offline_bolt', 'offline_pin', 'online_prediction', 'try', 'hotel_class', 'check',
                        'campaign', 'groups', 'public', 'emoji_events', 'psychology', 'thumb_up_alt', 'sentiment_very_satisfied', 'emoji_objects',
                        'military_tech', 'mood', 'recommend', 'insights', 'bolt', 'sentiment_satisfied_alt', 'auto_awesome', 'flash_on', 'star',
                        'star_border', 'show_chart', 'auto_graph'];
        var listColors = [...colors];
        var listIcons = [...icons];
        listContents.forEach( (content, idx) => {
            //select a random icon and color
            var numI = Math.floor(Math.random() * listIcons.length);
            var numC = Math.floor(Math.random() * listColors.length);

            //mount card for the timeline
            this.createCard(listIcons[numI], listColors[numC],content, idx);
            
            //remove from list
            listIcons.splice(numI, 1);
            listColors.splice(numC, 1);

            //check if lists are empty
            if(listIcons.length==0)
                listIcons = [...icons];

            if(listColors.length==0)
                listColors = [...colors];
        });
      
    }

    createCard(icon, color, content, idx){
        let li = document.createElement('li');
        let bottons = '<div></div>'

        //set the id for each post space on timeline
        li.id = "ti"+content._id;

        //check if is even number, for to invert the side
        if(idx % 2 == 0)
            li.className = "timeline-inverted";
            
        if(this.idUser)
            bottons = `<div class="card-actions text-center" style="position: relative; float: right; right:0px; top:-20px; width: fit-content;">
                            <button onclick="timelineController.showEditPost('${content._id}')" type="button" class="btn btn-success btn-link" rel="tooltip" data-placement="bottom" title="Edit">
                                <i class="material-icons">edit</i>
                            </button>
                            <button onclick="timelineController.showdeletePost('${content._id}')"  type="button" class="btn btn-danger btn-link" rel="tooltip" data-placement="bottom" title="Remove">
                                <i class="material-icons">close</i>
                            </button>
                        </div>`;
        
        let data = new Date(content.createdAt);

        li.innerHTML = `
            <div class="timeline-badge" style="background-color: ${color};box-shadow: 0 4px 20px 0px rgb(0 0 0 / 14%), 0 7px 13px -5px ${color};">
                <i class="material-icons">${icon}</i>
            </div>
            <div class="timeline-panel" id="id${content._id}">
                <div class="timeline-heading">
                    <span id="title" class="badge badge-pill badge-danger" style="font-size: 13px; background-color: ${color};box-shadow: 0 4px 20px 0px rgb(0 0 0 / 14%), 0 7px 13px -5px ${color};">${content.titulo}</span>
                    ${bottons}
                </div>
                <div class="timeline-body">
                    
                    <p>${content.descricao}</p>
                    <div class="fileinput fileinput-new text-center" data-provides="fileinput" style="width: 100%">
                        <div class="thumbnail" style="max-width: inherit; width: 100%;">
                            ${content.tipo == "foto" ? `
                                <img src="${content.url}" alt="...">
                            ` : `<iframe height="232.234" id="preview" src="${content.url}" frameborder="0" style="width: inherit;" allowfullscreen></iframe>`}
                        </div>
                    </div>
                </div>
                <h6>
                    <i class="ti-time">${data.toLocaleDateString()} às ${data.toLocaleTimeString()}</i>
                </h6>
            </div>
        `;

        let ul = document.querySelector(".timeline");
        ul.append(li);
    }

    isTimeLineUser(){
        return this.idUser ? true : false;
    }

    showEditPost(id_post){
        demo.showSwal('edit-post', id_post);
        
    }

    showdeletePost(id_post){
        demo.showSwal('warning-message-and-cancel', 'Deletar conteúdo', 'Você gostaria de apagar este conteúdo?', id_post);
    }

    deletePost(id_pos){
         //fetch contents in database
         axios.delete(BASE_URL + '/content/delete/' + id_pos, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
         })
        .then((response) => {
            if(response.data.success){
                demo.showSwal('success-message', 'Apagar conteúdo.', 'Conteúdo apagado com sucesso!');

                //hide the post
                this.restartTimeline();
            }else{
                demo.showSwal('error-message', 'Erro ao apagar conteúdo.', ''+response.data.error);
            }
        }).catch(() => {
            demo.showSwal('error-message', 'Erro ao apagar.', 'Houve um problema ao apagar o conteúdo.');
        });
    }

    clearTimeline(){
        let ul = document.querySelector(".timeline");
        if(ul)
            ul.innerHTML='';
    }

    checkType(){
        console.log('aqui');
        if(this.idUser)
            document.querySelector("h3.title").innerHTML = "Timeline de suas atividades na Liga";
    }

    //update the timeline card after editing
    contentUpdate(formData){

        let card = document.querySelector("#id"+formData.get('id'));
        card.querySelector("#title").innerText = formData.get('titulo');
        card.querySelector(".timeline-body").innerHTML = 
            `<p>${formData.get('descricao')}</p>
            <div class="fileinput fileinput-new text-center" data-provides="fileinput" style="width: 100%">
                <div class="thumbnail" style="max-width: inherit; width: 100%;">
                    ${formData.get('tipo') == "foto" ? `
                        <img src="${formData.get('url')}" alt="...">
                    ` : `<iframe height="232.234" id="preview" src="${formData.get('url')}" frameborder="0" style="width: inherit;" allowfullscreen></iframe>`}
                </div>
            </div>`;
    }

    restartTimeline(){
        let ul = document.querySelector(".timeline");
        ul.innerHTML = '';
        this.posI = 0;
        this.flag = true;
    }

}