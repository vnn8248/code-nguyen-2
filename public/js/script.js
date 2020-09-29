$(document).ready(function() {

    function logSubmit(event) {
        
        log.text(`Form submitted. Time stamp ${event.timeStamp}`);

        $.ajax({
            type: "POST",
            url: "http://localhost:3000/subscribe",
            data: {
                email: "laca@gmail.com"
            },
            success: (result) => console.log(result)
        });
    };

    const form = $("#subscribe");
    const log = $("#subscribeResult");
    form.on("submit", logSubmit);
});