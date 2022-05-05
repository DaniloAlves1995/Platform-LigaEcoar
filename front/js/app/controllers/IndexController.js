class IndexController {

    constructor() {
        
    }

    // search content by title
    search(){

        var field = document.querySelector("#searchFild");

        if (field.value.trim() != ""){

            let fields = timelineController.idUser ? { titulo: field.value, id: timelineController.idUser} : { titulo: field.value};
           
            axios.post(BASE_URL+'/content/search', fields)
            .then(function (response) {
                let contentList = response.data;
                if(contentList.length>0){
                    timelineController.clearTimeline();
                    timelineController.buildTimeline(contentList);

                    //erase scroll event
                    window.onscroll = null;
                }else{
                    console.log("Sem resultados");
                }
            })
            .catch(function (error) {
                demo.showSwal('error-message', 'Erro ao pesquisar', 'Houve um problema ao pesquisar conteúdos.');
                console.log(error);
            });
        }else{
            //case text search is void
            timelineController.clearTimeline();
            timelineController.eventScroll();
            timelineController.fetchContents(0);
        }


    }

}