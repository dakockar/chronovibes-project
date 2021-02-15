  // Get the modal
  var pwdModal = document.getElementById("pwdModal");
  var delModal = document.getElementById("delModal");
  
  // Get the button that opens the modal
  var pwdBtn = document.getElementById("pwdBtn");
  var delBtn = document.getElementById("delBtn");
  
  // Get the <span> element that closes the modal
  var pwdSpan = document.getElementsByClassName("close")[0];
  var delSpan = document.getElementsByClassName("close")[1];
  
  // When the user clicks on the button, open the modal
  pwdBtn.onclick = function() {
    pwdModal.style.display = "block";
  }
  
  delBtn.onclick = function() {
    delModal.style.display = "block";
  }
  
  
  // When the user clicks on <span> (x), close the modal
  pwdSpan.onclick = function() {
    pwdModal.style.display = "none";
  }
  delSpan.onclick = function() {
    delModal.style.display = "none";
  }
  
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == pwdModal || event.target == delModal) {
      pwdModal.style.display = "none";
      delModal.style.display = "none";
    }
  }
  
  
  
  
  
  