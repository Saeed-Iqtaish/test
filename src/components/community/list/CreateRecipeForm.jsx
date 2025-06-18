import React, { useState } from "react";
import { Modal, Form, Button, Alert, Row, Col } from "react-bootstrap";
import RecipeIngredientsList from "../shared/RecipeIngredientsList";
import RecipeInstructionsList from "../shared/RecipeInstructionsList";
import RecipeMoodSelector from "../shared/RecipeMoodSelector";
import { communityAPI } from "../../../services/api";

function CreateRecipeForm({ onSuccess, onError, onCancel, error }) {
    const [formData, setFormData] = useState({
        title: "",
        prepTime: "",
        servings: "",
        image: null,
        mood: "",
        ingredients: [""],
        instructions: [""]
    });
    const [loading, setLoading] = useState(false);

    function handleInputChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    function handleImageChange(e) {
        const file = e.target.files[0];
        setFormData(prev => ({ ...prev, image: file }));
    }

    function handleIngredientsChange(ingredients) {
        setFormData(prev => ({ ...prev, ingredients }));
    }

    function handleInstructionsChange(instructions) {
        setFormData(prev => ({ ...prev, instructions }));
    }

    function handleMoodChange(mood) {
        setFormData(prev => ({ ...prev, mood }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        // Validation
        if (!formData.title.trim()) {
            onError("Recipe title is required");
            setLoading(false);
            return;
        }

        if (!formData.prepTime || formData.prepTime <= 0) {
            onError("Valid prep time is required");
            setLoading(false);
            return;
        }

        if (!formData.servings || formData.servings <= 0) {
            onError("Valid number of servings is required");
            setLoading(false);
            return;
        }

        if (!formData.mood) {
            onError("Please select a mood for your recipe");
            setLoading(false);
            return;
        }

        const validIngredients = formData.ingredients.filter(ing => ing.trim());
        const validInstructions = formData.instructions.filter(inst => inst.trim());

        if (validIngredients.length === 0) {
            onError("At least one ingredient is required");
            setLoading(false);
            return;
        }

        if (validInstructions.length === 0) {
            onError("At least one instruction is required");
            setLoading(false);
            return;
        }

        try {
            const submitData = new FormData();
            submitData.append("title", formData.title.trim());
            submitData.append("prep_time", parseInt(formData.prepTime));
            submitData.append("servings", parseInt(formData.servings));
            submitData.append("mood", formData.mood);
            submitData.append("ingredients", JSON.stringify(validIngredients));
            submitData.append("instructions", JSON.stringify(validInstructions));

            if (formData.image) {
                submitData.append("image", formData.image);
            }

            console.log('🚀 Submitting recipe with mood:', formData.mood);
            
            await communityAPI.createRecipe(submitData);

            console.log('✅ Recipe submitted successfully!');

            setFormData({
                title: "",
                prepTime: "",
                servings: "",
                image: null,
                mood: "",
                ingredients: [""],
                instructions: [""]
            });

            onSuccess();
        } catch (err) {
            console.error("❌ Error creating recipe:", err);
            
            if (err.response?.status === 401) {
                onError("Please log in again to create recipes.");
            } else {
                onError(err.response?.data?.details || err.response?.data?.error || "Failed to create recipe. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form.Group className="mb-3">
                    <Form.Label>Recipe Title *</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter recipe title"
                        required
                    />
                </Form.Group>

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Prep Time (minutes) *</Form.Label>
                            <Form.Control
                                type="number"
                                name="prepTime"
                                value={formData.prepTime}
                                onChange={handleInputChange}
                                placeholder="e.g., 30"
                                min="1"
                                max="1440"
                                required
                            />
                            <Form.Text className="text-muted">
                                Total preparation and cooking time in minutes
                            </Form.Text>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Servings *</Form.Label>
                            <Form.Control
                                type="number"
                                name="servings"
                                value={formData.servings}
                                onChange={handleInputChange}
                                placeholder="e.g., 4"
                                min="1"
                                max="50"
                                required
                            />
                            <Form.Text className="text-muted">
                                Number of people this recipe serves
                            </Form.Text>
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label>Recipe Image</Form.Label>
                    <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <Form.Text className="text-muted">
                        Upload an image for your recipe (optional, max 5MB)
                    </Form.Text>
                </Form.Group>

                <RecipeMoodSelector
                    selectedMood={formData.mood}
                    onMoodChange={handleMoodChange}
                    disabled={loading}
                />

                <RecipeIngredientsList
                    ingredients={formData.ingredients}
                    onChange={handleIngredientsChange}
                />

                <RecipeInstructionsList
                    instructions={formData.instructions}
                    onChange={handleInstructionsChange}
                />
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel} disabled={loading}>
                    Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Recipe"}
                </Button>
            </Modal.Footer>
        </Form>
    );
}

export default CreateRecipeForm;