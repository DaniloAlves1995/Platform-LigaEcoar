class LoadView{
    constructor(){
        this._local = document.querySelector("#local");
    } 

    view(name){

        this._view = name;
        this.clear();

        fetch('../js/app/views/'+name+'.html')
            .then(response => response.text())
            .then(data => {
  	            this._local.innerHTML = data;
                
                // change the title to user's timeline
                if(name=='timeline' && timelineController.isTimeLineUser())
                    timelineController.checkType();
                
        });
        
    }

    getView(el, name){

        fetch('../js/app/views/'+name+'.html')
            .then(response => response.text())
            .then(data => {
  	            // Do something with your data
  	            el.innerHTML = data;
        });
        
    }

    clear(){
        this._local.innerHTML = "";
    }

    getNameView(){
        return this._view;
    }
}