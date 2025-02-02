document.addEventListener('DOMContentLoaded', function () {
  // Fetch user data and recipes
  fetch('/account')
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
        return;
      }

      // Display the user's username and UID
      document.getElementById('username').textContent = data.user.username;
      document.getElementById('uid').textContent = data.user.uid;

      // Display the recipe cards
      const recipeCards = document.getElementById('recipeCards');
      if (data.recipes.length === 0) {
        recipeCards.innerHTML = '<p class="text-center text-lg text-gray-500">No recipes found.</p>';
      } else {
        data.recipes.forEach(recipe => {
          const card = document.createElement('div');
          card.classList.add('bg-white', 'p-6', 'rounded-lg', 'shadow-md');

          card.innerHTML = `
            <h3 class="text-2xl font-bold">${recipe.title}</h3>
            <p class="text-lg mt-2">by ${recipe.author}</p>
            <p class="text-gray-700 mt-4">${recipe.body_text.substring(0, 100)}...</p>
            <a href="/recipe/${recipe.id}" class="text-black mt-4 inline-block">Read more &rarr;</a>
          `;
          recipeCards.appendChild(card);
        });
      }
    })
    .catch(err => console.error('Error fetching user data:', err));
});

