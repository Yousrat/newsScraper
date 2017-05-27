$(document).ready(function() {


 $("#add-new-note").on("click", function(e) {
console.log("testing");
        //prompt("Enter your note");
        window.alert("hello");

        $.ajax({
            method: "POST",
            url: "/notes/:_id",
            data: "_id"
        }).done(function() {
            //window.location.href = "/items-by-lender";
        });
    });


});