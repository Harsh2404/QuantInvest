$(document).ready(function () {
    const token = localStorage.getItem('token');

    if (!token) {
        setInterval(function () {
            $('.modal-main').removeClass("hidden");
        }, 1000);
    }

    handleLogin = () => {
        const apiUrl = 'http://localhost:3000/api/login';
        const postData = {
            username: $("#login-email").val(),
            password: $("#login-password").val(),
        };
        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        };

        fetch(apiUrl, fetchOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Parse the response data as JSON
            })
            .then(data => {
                // Handle the response data
                // console.log('Response data:', data);
                if (data?.token) {
                    localStorage.setItem('token', data.token);
                    $('.modal-main').addClass("hidden");
                } else {
                    $('.login-err').removeClass("hidden");
                }
            })
            .catch(error => {
                // Handle errors during the fetch request
                console.error('Error:', error.message);
                $('.login-err').removeClass("hidden");
            });

    }
});