
$(document).ready(function () {








  $("#togglePassword").on("click", function () {
    var passwordInput = $("#password");
    var isCurrentlyHidden = passwordInput.attr("type") === "password";

    passwordInput.attr("type", isCurrentlyHidden ? "text" : "password");
    $(this).text(isCurrentlyHidden ? "Hide" : "Show");
  });

  $("#toggleConfirm").on("click", function () {
    var confirmInput = $("#confirmPassword");
    var isCurrentlyHidden = confirmInput.attr("type") === "password";

    confirmInput.attr("type", isCurrentlyHidden ? "text" : "password");
    $(this).text(isCurrentlyHidden ? "Hide" : "Show");
  });







  $("#password").on("input", function () {
    var value = $(this).val();

    updateStrengthRule("ruleLength", value.length >= 8);
    updateStrengthRule("ruleUpper",  /[A-Z]/.test(value));
    updateStrengthRule("ruleLower",  /[a-z]/.test(value));
    updateStrengthRule("ruleNumber", /[0-9]/.test(value));
  });


  function updateStrengthRule(ruleId, isPassed) {
    if (isPassed) {
      $("#" + ruleId).addClass("passed");
    } else {
      $("#" + ruleId).removeClass("passed");
    }
  }








  function validateFullName() {
    var name = $.trim($("#fullName").val());

    if (name === "") {
      markInvalid("fullName", "Full name is required.");
      return false;
    }

    markValid("fullName");
    return true;
  }


  function validateEmail() {
    var email = $.trim($("#email").val());
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
      markInvalid("email", "Email address is required.");
      return false;
    }

    if (!emailPattern.test(email)) {
      markInvalid("email", "Please enter a valid email like user@example.com");
      return false;
    }

    markValid("email");
    return true;
  }


  function validatePhone() {
    var phone = $.trim($("#phone").val());

    if (phone === "") {
      markInvalid("phone", "Phone number is required.");
      return false;
    }

    if (!/^\d{10}$/.test(phone)) {
      markInvalid("phone", "Phone number must be exactly 10 digits.");
      return false;
    }

    markValid("phone");
    return true;
  }


  function validatePassword() {
    var password = $("#password").val();

    if (password === "") {
      markInvalid("password", "Password is required.");
      return false;
    }

    var isStrong =
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password);

    if (!isStrong) {
      markInvalid("password", "Password must meet all the requirements shown below.");
      return false;
    }

    markValid("password");
    return true;
  }


  function validateConfirmPassword() {
    var password = $("#password").val();
    var confirmPassword = $("#confirmPassword").val();

    if (confirmPassword === "") {
      markInvalid("confirmPassword", "Please confirm your password.");
      return false;
    }

    if (password !== confirmPassword) {
      markInvalid("confirmPassword", "Passwords do not match.");
      return false;
    }

    markValid("confirmPassword");
    return true;
  }








  function markInvalid(fieldId, message) {
    $("#" + fieldId)
      .addClass("is-invalid")
      .removeClass("is-valid");
    $("#" + fieldId + "Error").text(message);
  }


  function markValid(fieldId) {
    $("#" + fieldId)
      .removeClass("is-invalid")
      .addClass("is-valid");
    $("#" + fieldId + "Error").text("");
  }








  $("#fullName").on("blur", validateFullName);
  $("#email").on("blur", validateEmail);
  $("#phone").on("blur", validatePhone);
  $("#password").on("blur", validatePassword);
  $("#confirmPassword").on("blur", validateConfirmPassword);


  $("#phone").on("keypress", function (e) {
    var charTyped = String.fromCharCode(e.which);
    if (!/[0-9]/.test(charTyped)) {
      e.preventDefault();
    }
  });







  $("#registrationForm").on("submit", function (e) {
    e.preventDefault();


    var formIsValid =
      validateFullName() &
      validateEmail() &
      validatePhone() &
      validatePassword() &
      validateConfirmPassword();


    $("#successMsg").hide();
    $("#errorMsg").hide();

    if (formIsValid) {

      $("#successMsg")
        .text("Registration successful! Welcome aboard 🎉")
        .show();

      this.reset();


      $("input").removeClass("is-valid is-invalid");
      $(".strength-rules li").removeClass("passed");


      $("#togglePassword, #toggleConfirm").text("Show");
      $("#password, #confirmPassword").attr("type", "password");

    } else {

      $("#errorMsg")
        .text("Please fix the highlighted errors before submitting.")
        .show();
    }
  });


});
