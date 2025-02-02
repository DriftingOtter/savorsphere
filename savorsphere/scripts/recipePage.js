function getRecipeIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id"); // Ensure we're using 'id' to fetch the parameter
}

function fetchAndDisplayRecipe() {
    const recipeId = getRecipeIdFromURL();
    if (!recipeId) {
        console.error("No recipe ID found in URL.");
        return;
    }

    $.ajax({
        url: `/api/recipes/${recipeId}`, // API should handle lookup of ID from raw ID
        method: 'GET',
        success: function (recipe) {
            if (!recipe) {
                console.error("Recipe not found.");
                return;
            }

            $("#recipe-title").text(recipe.title);
            $("#recipe-image").attr("src", recipe.images);
            $("#recipe-author").text(`By: ${recipe.author}`);
            $("#recipe-date").text(`Published on: ${new Date(recipe.date).toLocaleDateString()}`);
            $("#recipe-body").text(recipe.body_text);

            $("#recipe-tags").html(
                recipe.tags.split(',').map(tag => `<span class="px-2 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full">${tag.trim()}</span>`).join('')
            );
        },
        error: function (err) {
            console.error("Error fetching recipe:", err);
        }
    });
}

// Run when page is ready
$(document).ready(function () {
    fetchAndDisplayRecipe();
});

