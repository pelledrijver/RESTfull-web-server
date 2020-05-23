function deletePhone(){
  var removeButton = $(this);
  var id = removeButton.attr("id");
  $.ajax({
       url: "http://localhost:3000/api/phones/id/" + id,
       method: "DELETE"
    }).done(function() {
      removeButton.parent().parent().remove();
    });
}

function updatePhone(){
  var updateButton = $(this);
  var id = updateButton.attr("id");
  var addData = {image: $("input[name='image']").val(),
                brand: $("input[name='brand']").val(),
                model: $("input[name='model']").val(),
                os: $("input[name='os']").val(),
                screensize: $("input[name='screensize']").val()
                };
  $.ajax({
       url: "http://localhost:3000/api/phones/id/" + id,
       method: "PUT",
       data: JSON.stringify(addData),
       contentType: "application/json"
    }).done(function(data) {
      var tablecontent = "";
      tablecontent +=
        "<td> <img src='" + $("input[name='image']").val() + "'></td>" +
        "<td>" + $("input[name='brand']").val() + "</td>" +
        "<td>" + $("input[name='model']").val() + "</td>" +
        "<td>" + $("input[name='os']").val() + "</td>" +
        "<td>" + $("input[name='screensize']").val() + "</td>" +
        "<td> <button id='" + id + "' class='tablebutton' type='button' name='update'>Update</button></td>" +
        "<td> <button id='" + id + "' class='tablebutton' type='button' name='delete'>Delete</button></td>";

      updateButton.parent().parent().html(tablecontent);
      $("button[name='update']").click(updatePhone);
      $("button[name='delete']").click(deletePhone);
      $("form").trigger("reset");
    });

}

function updateTable(){
  $.ajax({
       url: "http://localhost:3000/api/phones",
       method: "GET",
       dataType: "json"
    })
    .done(function(data) {
      var tablecontent = "";
      for(var row of data){
        tablecontent +=
          "<tr class='row'>" +
          "<td> <img src='" + row.image + "'></td>" +
          "<td>" + row.brand + "</td>" +
          "<td>" + row.model + "</td>" +
          "<td>" + row.os + "</td>" +
          "<td>" + row.screensize + "</td>" +
          "<td> <button id='" + row.id + "' class='tablebutton' type='button' name='update'>Update</button></td>" +
          "<td> <button id='" + row.id + "' class='tablebutton' type='button' name='delete'>Delete</button></td>" +
          "</tr>"
      }
      $("#tbody").prepend(tablecontent);
      $("button[name='update']").click(updatePhone);
      $("button[name='delete']").click(deletePhone);
      $("form").trigger("reset");
    });
}

function resetTable(){
  $(".row").remove();
  $.ajax({
      url: "http://localhost:3000/api/phones/reset",
      method: "DELETE",
      dataType: "json"
   }).done(updateTable);
   //removes characters in input boxes
}

function sortTable() {
    var table, rows, switching, i, x, y, shouldSwitch, loopsubstract;
    var columnNr = this.columnNr;

    /*the if-else statement is used to determine if
    the static or dynamic table is being sorted */
    if(this.tableNr === 2){
      table = document.getElementById("table2");
      loopSubstract = 1;
    }
    else{
      table = document.getElementById("table");
      loopSubstract = 2;
    }
    switching = true;

    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - loopSubstract); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[columnNr];
            y = rows[i + 1].getElementsByTagName("TD")[columnNr];

            if(this.classList.value === "clicked") {
              if (x.innerHTML > y.innerHTML) {
                  //if so, mark as a switch and break the loop:
                  shouldSwitch = true;
                  break;
              }
            }
            else {
              if (x.innerHTML < y.innerHTML) {
                  shouldSwitch = true;
                  break;
              }
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
    //makes the table sort the other way around when the header is clicked again
    this.classList.toggle("clicked");
}

function addPhone(){
  var addData = {image: $("input[name='image']").val(),
                brand: $("input[name='brand']").val(),
                model: $("input[name='model']").val(),
                os: $("input[name='os']").val(),
                screensize: $("input[name='screensize']").val()
                };

  $.ajax({
      url: "http://localhost:3000/api/phones",
      method: "POST",
      data: JSON.stringify(addData),
      contentType: "application/json",
      dataType: "json"
   }).done(function(data){
       var tablecontent = "";
       tablecontent +=
         "<tr class='row'>" +
         "<td> <img src='" + $("input[name='image']").val() + "'></td>" +
         "<td>" + $("input[name='brand']").val() + "</td>" +
         "<td>" + $("input[name='model']").val() + "</td>" +
         "<td>" + $("input[name='os']").val() + "</td>" +
         "<td>" + $("input[name='screensize']").val() + "</td>" +
         "<td> <button id='" + data.id + "' class='tablebutton' type='button' name='update'>Update</button></td>" +
         "<td> <button id='" + data.id + "' class='tablebutton' type='button' name='delete'>Delete</button></td>" +
         "</tr>";
       $("tr.above700pix").before(tablecontent);
       $("button[name='update']").click(updatePhone);
       $("button[name='delete']").click(deletePhone);
       $("form").trigger("reset");
   }).fail(function(){
     console.log(data);
     $("form").trigger("reset");
   });
  //makes sure that the page doesn't refresh
  event.preventDefault();

}

updateTable();

//sorting dynamic table
document.getElementsByTagName("th")[1].columnNr = 1;
document.getElementsByTagName("th")[1].addEventListener("click", sortTable);

document.getElementsByTagName("th")[2].columnNr = 2;
document.getElementsByTagName("th")[2].addEventListener("click", sortTable);

document.getElementsByTagName("th")[3].columnNr = 3;
document.getElementsByTagName("th")[3].addEventListener("click", sortTable);

document.getElementsByTagName("th")[4].columnNr = 4;
document.getElementsByTagName("th")[4].addEventListener("click", sortTable);

//event handlers for the buttons
$("form").submit(addPhone);
$(".tablebutton2").click(resetTable);

//sorting static table
document.getElementsByTagName("th")[7].columnNr = 0;
document.getElementsByTagName("th")[7].tableNr = 2;
document.getElementsByTagName("th")[7].addEventListener("click", sortTable);

document.getElementsByTagName("th")[8].columnNr = 1;
document.getElementsByTagName("th")[8].tableNr = 2;
document.getElementsByTagName("th")[8].addEventListener("click", sortTable);


/* The formula that we used to sort our table is an altered version based on one
we found on the internet. We improved some of the code and added some extra features.
The original source is: https://www.w3schools.com/howto/howto_js_sort_table.asp */
