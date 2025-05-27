import React from 'react'
import RecipeHeader from '../components/recipeDetails/RecipeHeader'

function RecipePage() {
    return (
        <RecipeHeader
            title={recipe.title}
            image={recipe.image}
            mood={assignMood(recipe)}
        />
    )
}

export default RecipePage