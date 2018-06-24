  $("#scrapeButton").on("click", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    // Send the POST request.
    $.get("/scrape", function(data) {
        console.log(data);
      }
    );
  });

  $(".saveButton").on("click", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    console.log(this.id)
    var title = $("#title"+this.id).text().trim();
    var desc = $("#desc"+this.id).text().trim();

    var formData = {
      title: title,
      desc: desc
    }
    console.log(formData);
  
    // Send the POST request.
    $.post("/scrape", formData, function(data) {
        console.log(data);
      }
    );
  });

  $(".deleteButton").on("click", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    console.log(this.id)

    var formData = {
      id: this.id,
    }
    console.log(formData);
  
    // Send the POST request.
    $.post("/deleteArticle", formData, function(data) {
        console.log(data);
      }
    );
  });

  $(".addNoteButton").on("click", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    console.log(this.id)
    var note = $("#noteTextarea").text().trim();

    var formData = {
      id: this.id,
      note: note
    }
    console.log(formData);
  
    // Send the POST request.
    $.post("/addNote", formData, function(data) {
        console.log(data);
      }
    );
  });