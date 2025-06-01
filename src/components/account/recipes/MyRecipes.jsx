import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Spinner, Alert, Button, Card } from 'react-bootstrap';
import { FiEdit3, FiTrash2, FiEye } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { userAPI, communityAPI } from '../../../services/api';  // ✅ Fixed: 3 levels up
import EditRecipeModal from '../../community/shared/EditRecipeModal';  // ✅ Fixed: 2 levels up
import MoodBadge from '../../global/MoodBadge';  // ✅ Fixed: 2 levels up

function MyRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(null);

    const navigate = useNavigate();

    // Use useCallback to memoize the function to fix the dependency warning
    const fetchMyRecipes = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const response = await userAPI.getMyRecipes();

            // Add mood assignment to recipes
            const recipesWithMood = response.data.map(recipe => ({
                ...recipe,
                mood: assignMood(recipe)
            }));

            setRecipes(recipesWithMood);
        } catch (error) {
            console.error('Error fetching my recipes:', error);
            setError('Failed to load your recipes');
        } finally {
            setLoading(false);
        }
    }, []); // Empty dependency array since it doesn't depend on any props or state

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
    }, [fetchMyRecipes]); // Now fetchMyRecipes is properly memoized

    const handleEdit = (recipe) => {
        // Debug: Log the recipe data structure before editing
        console.log('🔍 Recipe data being passed to edit modal:', {
            id: recipe.id,
            title: recipe.title,
            prep_time: recipe.prep_time,
            servings: recipe.servings,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            hasImage: !!recipe.image_data
        });

        // Check if we need to fetch detailed recipe data
        if (!recipe.ingredients || !recipe.instructions) {
            console.log('⚠️ Recipe missing ingredients/instructions, fetching full data...');
            fetchFullRecipeData(recipe.id);
        } else {
            setSelectedRecipe(recipe);
            setShowEditModal(true);
        }
    };

    const handleView = (recipe) => {
        navigate(`/community/${recipe.id}`);
    };

    const handleDelete = async (recipeId) => {
        if (!window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
            return;
        }

        setDeleteLoading(recipeId);
        try {
            await communityAPI.deleteRecipe(recipeId);
            setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
        } catch (error) {
            console.error('Error deleting recipe:', error);
            alert('Failed to delete recipe. Please try again.');
        } finally {
            setDeleteLoading(null);
        }
    };

    const handleRecipeUpdated = () => {
        setShowEditModal(false);
        setSelectedRecipe(null);
        fetchMyRecipes(); // Refresh the list
    };

    const fetchFullRecipeData = async (recipeId) => {
        try {
            setLoading(true);
            const response = await communityAPI.getRecipe(recipeId);
            const fullRecipe = response.data;

            console.log('📋 Full recipe data fetched:', fullRecipe);

            setSelectedRecipe(fullRecipe);
            setShowEditModal(true);
        } catch (error) {
            console.error('Error fetching full recipe data:', error);
            alert('Failed to load recipe details for editing.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-4">
                <Spinner animation="border" />
                <p className="mt-2">Loading your recipes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger">
                {error}
                <Button variant="outline-danger" size="sm" className="ms-2" onClick={fetchMyRecipes}>
                    Try Again
                </Button>
            </Alert>
        );
    }

    if (recipes.length === 0) {
        return (
            <div className="text-center py-5">
                <h5>No recipes yet</h5>
                <p className="text-muted">You haven't created any recipes yet. Start sharing your favorite recipes with the community!</p>
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
                                            <span className="badge bg-success">✓ Approved</span>
                                        ) : (
                                            <span className="badge bg-warning">⏳ Pending</span>
                                        )}
                                    </div>
                                </div>

                                <Card.Title className="recipe-title h6">{recipe.title}</Card.Title>

                                <div className="recipe-meta text-muted mb-3">
                                    <small>
                                        Created: {new Date(recipe.created_at).toLocaleDateString()}
                                    </small>
                                    {recipe.updated_at !== recipe.created_at && (
                                        <small className="d-block">
                                            Updated: {new Date(recipe.updated_at).toLocaleDateString()}
                                        </small>
                                    )}
                                </div>

                                <div className="mt-auto">
                                    <div className="d-flex gap-2">
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => handleView(recipe)}
                                            className="flex-fill btn-view-custom"
                                        >
                                            <FiEye className="me-1" />
                                            View
                                        </Button>
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={() => handleEdit(recipe)}
                                            className="flex-fill btn-edit-custom"
                                        >
                                            <FiEdit3 className="me-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDelete(recipe.id)}
                                            disabled={deleteLoading === recipe.id}
                                            className="flex-fill btn-delete-custom"
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
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Edit Recipe Modal */}
            <EditRecipeModal
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                recipe={selectedRecipe}
                onRecipeUpdated={handleRecipeUpdated}
            />
        </>
    );
}

export default MyRecipes;