// upon clicking the submit button, send the post request
// $("#submitButton").on("click", function(event) {

//     // Make sure to preventDefault on a submit event.
//     event.preventDefault();

//     // pull all necessary information from the form
//     var formData = {
//         msgVpn: $("#msgVpn").val().trim(),
//         username: $("#username"),
//         password: $("#password"),
//         app: $("#app"),
//         desc: $("#desc")
//     };

//     // Send the POST request.
//     $.post("/", formData, function(data) {
//         console.log(data);
//       }
//     );
//   });

  $("#scrapeButton").on("click", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    // Send the POST request.
    $.get("/scrape", function(data) {
        console.log(data);
      }
    );
  });