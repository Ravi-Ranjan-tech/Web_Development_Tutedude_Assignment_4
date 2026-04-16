$(function () {

  const REGEX = {
    email:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone:/^\d{10}$/,
    upper:/[A-Z]/,
    lower:/[a-z]/,
    number:/[0-9]/
  };

  const MIN_PASSWORD_LENGTH = 8;

  function showFieldError(groupId,errorId,message){
    $('#'+groupId).removeClass('valid').addClass('invalid');
    $('#'+errorId).text(message);
  }

  function clearFieldError(groupId,errorId){
    $('#'+groupId).removeClass('invalid').addClass('valid');
    $('#'+errorId).text('');
  }

  function resetFieldState(groupId,errorId){
    $('#'+groupId).removeClass('valid invalid');
    $('#'+errorId).text('');
  }

  function showAlert(type,message){
    $('#successMsg,#errorMsg').hide();
    if(type==='success'){
      $('#successText').text(message);
      $('#successMsg').fadeIn(250);
    }else{
      $('#errorText').text(message);
      $('#errorMsg').fadeIn(250);
    }
  }

  function hideAlerts(){
    $('#successMsg,#errorMsg').fadeOut(200);
  }

  function validateName(){
    const value=$('#fullName').val().trim();
    if(value===''){
      showFieldError('group-name','err-name','Full name is required.');
      return false;
    }
    clearFieldError('group-name','err-name');
    return true;
  }

  function validateEmail(){
    const value=$('#email').val().trim();
    if(value===''){
      showFieldError('group-email','err-email','Email address is required.');
      return false;
    }
    if(!REGEX.email.test(value)){
      showFieldError('group-email','err-email','Enter a valid email (e.g. user@example.com).');
      return false;
    }
    clearFieldError('group-email','err-email');
    return true;
  }

  function validatePhone(){
    const value=$('#phone').val().trim();
    if(value===''){
      showFieldError('group-phone','err-phone','Phone number is required.');
      return false;
    }
    if(!REGEX.phone.test(value)){
      showFieldError('group-phone','err-phone','Phone number must be exactly 10 digits.');
      return false;
    }
    clearFieldError('group-phone','err-phone');
    return true;
  }

  function validatePassword(){
    const value=$('#password').val();
    if(value===''){
      showFieldError('group-password','err-password','Password is required.');
      return false;
    }

    const lengthOk=value.length>=MIN_PASSWORD_LENGTH;
    const upperOk=REGEX.upper.test(value);
    const lowerOk=REGEX.lower.test(value);
    const numberOk=REGEX.number.test(value);

    if(!(lengthOk&&upperOk&&lowerOk&&numberOk)){
      showFieldError('group-password','err-password','Password does not meet all requirements.');
      return false;
    }
    clearFieldError('group-password','err-password');
    return true;
  }

  function validateConfirm(){
    const password=$('#password').val();
    const confirm=$('#confirmPassword').val();

    if(confirm===''){
      showFieldError('group-confirm','err-confirm','Please confirm your password.');
      return false;
    }
    if(password!==confirm){
      showFieldError('group-confirm','err-confirm','Passwords do not match.');
      return false;
    }
    clearFieldError('group-confirm','err-confirm');
    return true;
  }

  function validateTerms(){
    if(!$('#terms').is(':checked')){
      showFieldError('group-terms','err-terms','You must agree to the Terms & Conditions.');
      return false;
    }
    clearFieldError('group-terms','err-terms');
    return true;
  }

  function updatePasswordStrength(password){
    const rules={
      length:password.length>=MIN_PASSWORD_LENGTH,
      upper:REGEX.upper.test(password),
      lower:REGEX.lower.test(password),
      number:REGEX.number.test(password)
    };

    const passedCount=Object.values(rules).filter(Boolean).length;

    toggleRule('rule-length',rules.length);
    toggleRule('rule-upper',rules.upper);
    toggleRule('rule-lower',rules.lower);
    toggleRule('rule-number',rules.number);

    const $bar=$('#strengthBar');
    const $label=$('#strengthLabel');

    if(password===''){
      $bar.css({width:'0%',backgroundColor:''});
      $label.text('').css('color','');
      return;
    }

    const levels=[
      {label:'Very weak',color:'#e53e3e',width:'15%'},
      {label:'Weak',color:'#dd6b20',width:'33%'},
      {label:'Fair',color:'#d69e2e',width:'55%'},
      {label:'Good',color:'#38a169',width:'78%'},
      {label:'Strong',color:'#14f0c8',width:'100%'}
    ];

    const level=levels[passedCount];
    $bar.css({width:level.width,backgroundColor:level.color});
    $label.text(level.label).css('color',level.color);
  }

  function toggleRule(ruleId,passed){
    const $rule=$('#'+ruleId);
    const $icon=$rule.find('i');

    if(passed){
      $rule.addClass('passed');
      $icon.removeClass('fa-xmark').addClass('fa-check');
    }else{
      $rule.removeClass('passed');
      $icon.removeClass('fa-check').addClass('fa-xmark');
    }
  }

  function bindPasswordToggle(buttonId,inputId,iconId){
    $('#'+buttonId).on('click',function(){
      const $input=$('#'+inputId);
      const $icon=$('#'+iconId);
      const isHidden=$input.attr('type')==='password';

      $input.attr('type',isHidden?'text':'password');

      $icon.toggleClass('fa-eye',!isHidden)
           .toggleClass('fa-eye-slash',isHidden);
    });
  }

  bindPasswordToggle('togglePassword','password','eyeIcon');
  bindPasswordToggle('toggleConfirm','confirmPassword','eyeIconConfirm');

  $('#fullName').on('blur',validateName);
  $('#email').on('blur',validateEmail);

  $('#phone')
    .on('input',function(){
      $(this).val($(this).val().replace(/\D/g,''));
    })
    .on('blur',validatePhone);

  $('#password')
    .on('input',function(){
      updatePasswordStrength($(this).val());
    })
    .on('blur',validatePassword);

  $('#confirmPassword').on('blur',validateConfirm);

  $('#password').on('blur',function(){
    if($('#confirmPassword').val()!==''){
      validateConfirm();
    }
  });

  $('#terms').on('change',function(){
    if($(this).is(':checked')){
      clearFieldError('group-terms','err-terms');
    }
  });

  $('#registrationForm').on('submit',function(event){
    event.preventDefault();
    hideAlerts();

    const results=[
      validateName(),
      validateEmail(),
      validatePhone(),
      validatePassword(),
      validateConfirm(),
      validateTerms()
    ];

    const allValid=results.every(Boolean);

    if(!allValid){
      const $firstInvalid=$('.form-group.invalid').first();
      if($firstInvalid.length){
        $('html,body').animate({scrollTop:$firstInvalid.offset().top-80},300);
      }
      showAlert('error','Please fix the highlighted errors before submitting.');
      return;
    }

    showAlert('success','Account created successfully! Welcome aboard 🎉');
    resetForm();
  });

  function resetForm(){
    document.getElementById('registrationForm').reset();

    const fieldMap=[
      ['group-name','err-name'],
      ['group-email','err-email'],
      ['group-phone','err-phone'],
      ['group-password','err-password'],
      ['group-confirm','err-confirm'],
      ['group-terms','err-terms']
    ];

    fieldMap.forEach(function([groupId,errorId]){
      resetFieldState(groupId,errorId);
    });

    updatePasswordStrength('');

    $('#password,#confirmPassword').attr('type','password');
    $('#eyeIcon,#eyeIconConfirm')
      .removeClass('fa-eye-slash')
      .addClass('fa-eye');
  }

});
