$(document).ready(function(){
    if (window.location.pathname !== "/") { //TODO: better parsing
        //join room id in pathname
    } else {
        $("#initial-selection").modal('show');
    }
});