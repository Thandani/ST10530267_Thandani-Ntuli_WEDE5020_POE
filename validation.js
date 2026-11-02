document.getElementById('myForm').addEventListener("submit", function(event) {
  event.preventDefault();

  const firstName = document.getElementById('fname').value.trim();
  const lastName = document.getElementById('lname').value.trim();
  const email = document.getElementById('email').value.trim();
  const phoneNumber = document.getElementById('pnumber').value.trim();

  // Clear old errors
  document.getElementById('fnameError').innerHTML = "";
  document.getElementById('lnameError').innerHTML = "";
  document.getElementById('emailError').innerHTML = "";
  document.getElementById('pnumberError').innerHTML = "";

  // Name validation
  if (firstName === "") {
    document.getElementById('fnameError').innerHTML = "Please enter your first name";
    return;
  }
  if (lastName === "") {
    document.getElementById('lnameError').innerHTML = "Please enter your last name";
    return;
  }

  // Email validation: must contain "@" and "."
  const emailPattern = /^[^@]+@[^@]+\.[^@]+$/;
  if (!emailPattern.test(email)) {
    document.getElementById('emailError').innerHTML = "Please enter a valid email address";
    return;
  }



  // Phone number validation: must be a valid phone number
   const phonePattern = /^0\d{9}$/;
    if (!phonePattern.test(phoneNumber)) {
    document.getElementById('pnumberError').innerHTML = "Please enter a valid phone number";
    return;
  }


  document.getElementById('messages').innerHTML = "Form submitted successfully!";
});
