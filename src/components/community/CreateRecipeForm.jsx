import React, { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import RecipeIngredientsList from "./RecipeIngredientsList";
import RecipeInstructionsList from "./RecipeInstructionsList";
import { communityAPI } from "../../services/api";

function CreateRecipeForm({ onSuccess, onError, onCancel, error }) {
    const [formData, setFormData] = useState({
        title: "",
        image: null,
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

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        if (!formData.title.trim()) {
            onError("Recipe title is required");
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
            submitData.append("ingredients", JSON.stringify(validIngredients));
            submitData.append("instructions", JSON.stringify(validInstructions));

            if (formData.image) {
                submitData.append("image", formData.image);
            }

            console.log('🚀 Submitting recipe with authenticated API...');
            
            // Use the authenticated API service instead of direct axios
            await communityAPI.createRecipe(submitData);

            console.log('✅ Recipe submitted successfully!');

            // Reset form
            setFormData({
                title: "",
                image: null,
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