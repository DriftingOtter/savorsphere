document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('createRecipeForm');

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            // Collect form data
            const title = document.getElementById('title').value;
            const body_text = document.getElementById('body_text').value;
            const tags = document.getElementById('tags').value;
            const images = document.getElementById('images').value;

            // Create recipe object
            const recipe = {
                title: title,
                body_text: body_text,
                tags: tags,
                images: images
            };

            // Send a POST request to add the recipe
            fetch('/api/createrecipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(recipe)
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    showError(data.error); // Show error if any
                } else {
                    showSuccess('Recipe added successfully!');
                }
            })
            .catch(error => {
                console.error('Error adding recipe:', error);
                showError('Failed to add recipe. Please try again.');
            });
        });
    }

    // Function to display success message
    function showSuccess(message) {
        const successModal = document.getElementById('successModal');
        if (successModal) {
            const successMessage = document.getElementById('successMessage');
            successMessage.textContent = message;
            successModal.style.display = 'block';
            
            // Add event listener for the "OK" button to redirect to homepage
            const closeSuccessModal = document.getElementById('closeSuccessModal');
            closeSuccessModal.addEventListener('click', function() {
                window.location.href = '/homepage/index.html';  // Redirect to homepage
            });
        }
    }

    // Function to display error message
    function showError(message) {
        const errorModal = document.getElementById('errorModal');
        if (errorModal) {
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = message;
            errorModal.style.display = 'block';
        }
    }
});

