var selDiv = "";
var storedFiles = []; //store the object of the all files

document.addEventListener("DOMContentLoaded", init, false); 

function init() {
   //To add the change listener on over file element
   document.querySelector('#uploadInput').addEventListener('change', handleFileSelect, false);
   //allocate division where you want to print file name
   selDiv = document.querySelector("#filelist");
}

//function to handle the file select listenere
function handleFileSelect(e) {
   //to check that even single file is selected or not
   if(!e.target.files) return;      

   //for clear the value of the selDiv
   selDiv.innerHTML = "";

   //get the array of file object in files variable
   var files = e.target.files;
   var filesArr = Array.prototype.slice.call(files);

   //print if any file is selected previosly 
   for(var i=0;i<storedFiles.length;i++)
   {
       selDiv.innerHTML += "<div class='filename'> <span> " + storedFiles[i].name + "</span></div>";
   }
   filesArr.forEach(function(f) {
       //add new selected files into the array list
       storedFiles.push(f);
       //print new selected files into the given division
       selDiv.innerHTML += "<div class='filename'> <span> " + f.name + "</span></div>";
   });

   //store the array of file in our element this is send to other page by form submit
   $("input[name=replyfiles]").val(storedFiles);
}
