$(document).ready(() => {
    $("#subscribe").submit((e) => {
        e.preventDefault();

        var data = {};
        data.email = $("#subscriberEmail").val();
        
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/subscribe',
            success: (data) => {
                $("#subscribeResult").text(data);
            },
            error: (error) => {
                $("#subscribeResult").text(error);
            }
          });
    });
  }
);
