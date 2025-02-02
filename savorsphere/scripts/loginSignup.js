document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  const slider = document.getElementById('slider');

  // Handle login form submission
  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          alert(data.message);
          window.location.href = '../homepage/index.html'; // Redirect on success
        }
      })
      .catch((err) => alert('Error during login: ' + err));
  });

  // Handle signup form submission
  signupForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const fullName = signupForm.querySelector('input[type="text"]').value;
    const email = signupForm.querySelector('input[type="email"]').value;
    const password = signupForm.querySelector('input[type="password"]').value;

    fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, username: fullName }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          alert(data.message);
          loginBtn.click(); // Switch to login after successful signup
        }
      })
      .catch((err) => alert('Error during signup: ' + err));
  });

  // Switch to login form
  loginBtn.addEventListener('click', function () {
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    slider.classList.remove('translate-x-full');
    loginBtn.classList.add('text-white');
    signupBtn.classList.add('text-black');
    signupBtn.classList.remove('text-white');
  });

  // Switch to signup form
  signupBtn.addEventListener('click', function () {
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    slider.classList.add('translate-x-full');
    signupBtn.classList.add('text-white');
    loginBtn.classList.add('text-black');
    loginBtn.classList.remove('text-white');
  });
});

