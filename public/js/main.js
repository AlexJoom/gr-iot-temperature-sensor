griot = {};
griot.enum = {};
griot.enum.State = {
    LOADING:0,
    HAS_RESULTS:1,
    NO_RESULTS:2,
    ERROR:3
}
griot.setState = function(state){
    $(".state").stop().hide();
     var className = "";
     switch (state) {
         case griot.enum.State.LOADING:
             className= "loading";
         break;
         case griot.enum.State.HAS_RESULTS:
             className= "results";
         break;
         case griot.enum.State.NO_RESULTS:
             className= "no-results";
         break;
         case griot.enum.State.ERROR:
             className= "error";
         break;
     }
     $(".state."+className).stop().fadeIn();
}
