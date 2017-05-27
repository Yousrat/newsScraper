$(document).ready(function() {
    //var itemLenderId;

    // Getting lender id
    // $("").on("click", function() {
            
             

    //          });

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


    // Sending mail to the Lender
    // $(".contact-lender").on("click", function() {
    //     var reply = {
    //         mailMessage: $("#reply-lender-mail").val(),
    //         lenderId: itemLenderId
    //     };
    //     $.ajax({
    //         method: "POST",
    //         url: "/contact-lender",
    //         data: reply
    //     }).done(function() {});
    // });
});