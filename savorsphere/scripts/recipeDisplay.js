function fetchAndDisplayRecipes() {
  $.ajax({
    url: '/api/recipes', // Get recipes from the API endpoint
    method: 'GET',
    success: function(results) {
      const mainContainer = $("#recipe-cards-container");
      mainContainer.empty(); // Clear existing cards before adding new ones

      results.forEach(recipe => {
        // Directly pass the raw recipe_id in the URL
        const recipeCard = `
          <div class="flex flex-col h-full">
            <a href="recipe/index.html?id=${recipe.id}" class="block w-full h-full overflow-hidden rounded-lg shadow-md transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer bg-white flex flex-col">
              <div class="relative flex-shrink-0">
                <img
                  src="${recipe.images}"
                  alt="${recipe.title}"
                  class="w-full h-48 object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
                <h2 class="absolute bottom-2 left-2 text-lg font-bold text-white leading-tight p-1">
                  ${recipe.title}
                </h2>
              </div>
              <div class="p-4 bg-gradient-to-br from-white to-gray-100 flex-grow flex flex-col justify-between">
                <div>
                  <div class="flex items-center text-xs text-gray-600 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span class="mr-2">${recipe.author}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>${new Date(recipe.date).toLocaleDateString()}</span>
                  </div>
                  <p class="text-sm text-gray-700 mb-3 line-clamp-3">
                    ${recipe.body_text}
                  </p>
                </div>
                <div class="flex flex-wrap gap-1 mt-auto">
                  ${recipe.tags.split(',').map(tag => `
                    <span class="px-2 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full">
                      ${tag.trim()}
                    </span>
                  `).join('')}
                </div>
              </div>
            </a>
          </div>
        `;

        mainContainer.append(recipeCard);
      });
    },
    error: function(err) {
      console.error("Error fetching recipes:", err);
    }
  });
}

// Fetch and display recipes when the page is ready
$(document).ready(function() {
  fetchAndDisplayRecipes();
});

