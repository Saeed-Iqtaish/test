import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Spinner, Alert, Button, Card } from 'react-bootstrap';
import { FiEdit3, FiTrash2, FiEye } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { userAPI, communityAPI } from '../../../services/api';
import EditRecipeModal from '../../community/shared/EditRecipeModal'; 
import MoodBadge from '../../global/MoodBadge'; 

function MyRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(null);

    const navigate = useNavigate();

    const fetchMyRecipes = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const response = await userAPI.getMyRecipes();

            // For community recipes, use the mood from database, don't auto-generate
            const recipesWithMood = response.data.map(recipe => ({
                ...recipe,
                // Use the mood from the database if it exists, otherwise fallback to assignMood
                mood: recipe.mood || assignMood(recipe)
            }));

            setRecipes(recipesWithMood);
        } catch (error) {
            console.error('Error fetching my recipes:', error);
            setError('Failed to load your recipes');
        } finally {
            setLoading(false);
        }
    }, []);

    // Keep assignMood as fallback for recipes without a mood in DB
    const assignMood = (recipe) => {
        const text = `${recipe.title} ${recipe.summary || ""}`.toLowerCase();

        if (text.includes("soup") || text.includes("creamy") || text.includes("bake")) {
            return "Cozy";
        }
        if (text.includes("avocado") || text.includes("smooth")) {
            return "Relaxed";
        }
        if (text.includes("spicy") || text.includes("noodle") || text.includes("chili")) {
            return "Energetic";
        }

        return "Happy";
    };

    useEffect(() => {
        fetchMyRecipes();
    }, [fetchMyRecipes]);

    const handleEdit = (recipe) => {
        console.log('🔍 Recipe data being passed to edit modal:', {
            id: recipe.id,
            title: recipe.title,
            prep_time: recipe.prep_time,
            servings: recipe.servings,
            mood: recipe.mood, // This should now be the actual DB mood
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            hasImage: !!recipe.image_data
        });

        if (!recipe.ingredients || !recipe.instructions) {
            console.log('⚠️ Recipe missing ingredients/instructions, fetching full data...');
            fetchFullRecipeData(recipe.id);
        } else {
            setSelectedRecipe(recipe);
            setShowEditModal(true);
        }
    };

    const fetchFullRecipeData = async (recipeId) => {
        try {
            const response = await communityAPI.getRecipe(recipeId);
            const fullRecipe = {
                ...response.data,
                // Use the mood from database, not auto-generated
                mood: response.data.mood || assignMood(response.data)
            };
            setSelectedRecipe(fullRecipe);
            setShowEditModal(true);
        } catch (error) {
            console.error('Error fetching full recipe data:', error);
            setError('Failed to load recipe details');
        }
    };

    const handleView = (recipe) => {
        navigate(`/community/${recipe.id}`);
    };

    const handleDelete = async (recipeId) => {
        if (!window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) return;

        try {
            setDeleteLoading(recipeId);
            await communityAPI.deleteRecipe(recipeId);
            
            // Remove the deleted recipe from state
            setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
            
            console.log('✅ Recipe deleted successfully');
        } catch (error) {
            console.error('Error deleting recipe:', error);
            setError('Failed to delete recipe');
        } finally {
            setDeleteLoading(null);
        }
    };

    const handleRecipeUpdated = () => {
        // Refresh the recipes list to show updated data
        fetchMyRecipes();
        setShowEditModal(false);
        setSelectedRecipe(null);
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Loading your recipes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger" className="mb-4">
                <Alert.Heading>Error</Alert.Heading>
                <p>{error}</p>
                <Button variant="outline-danger" onClick={fetchMyRecipes}>
                    Try Again
                </Button>
            </Alert>
        );
    }

    if (recipes.length === 0) {
        return (
            <div className="text-center py-5">
                <h4 className="text-muted mb-3">No recipes yet</h4>
                <p className="text-muted mb-4">
                    Start sharing your favorite recipes with the community!
                </p>
                <Button className="btn-main" onClick={() => navigate('/community')}>
                    Go to Community
                </Button>
            </div>
        );
    }

    return (
        <>
            <Row xs={1} md={2} lg={3} className="g-3">
                {recipes.map((recipe) => (
                    <Col key={recipe.id}>
                        <Card className="h-100 shadow-sm">
                            {recipe.image_data && (
                                <Card.Img
                                    variant="top"
                                    src={`${process.env.REACT_APP_API_URL}/community/${recipe.id}/image`}
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                            )}

                            <Card.Body className="d-flex flex-column">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <MoodBadge mood={recipe.mood} />
                                    <div className="d-flex align-items-center gap-1">
                                        {recipe.approved ? (
                                            <span className="badge bg-success">Approved</span>
                                        ) : (
                                            <span className="badge bg-warning">Pending</span>
                                        )}
                                    </div>
                                </div>

                                <Card.Title className="mb-2">{recipe.title}</Card.Title>
                                
                                <div className="mb-2">
                                    <small className="text-muted">
                                        ⏱️ {recipe.prep_time} mins • 🍽️ {recipe.servings} servings
                                    </small>
                                </div>

                                <div className="mt-auto d-flex gap-2">
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => handleView(recipe)}
                                        className="flex-fill"
                                    >
                                        <FiEye className="me-1" />
                                        View
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={() => handleEdit(recipe)}
                                        className="flex-fill"
                                    >
                                        <FiEdit3 className="me-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDelete(recipe.id)}
                                        disabled={deleteLoading === recipe.id}
                                        className="flex-fill"
                                    >
                                        {deleteLoading === recipe.id ? (
                                            <Spinner size="sm" />
                                        ) : (
                                            <>
                                                <FiTrash2 className="me-1" />
                                                Delete
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Edit Recipe Modal */}
            <EditRecipeModal
                show={showEditModal}
                onHide={() => {
                    setShowEditModal(false);
                    setSelectedRecipe(null);
                }}
                recipe={selectedRecipe}
                onRecipeUpdated={handleRecipeUpdated}
            />
        </>
    );
}

export default MyRecipes;