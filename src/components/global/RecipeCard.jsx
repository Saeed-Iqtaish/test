import React from "react";
import { Card, Badge } from "react-bootstrap";
import MoodBadge from "./MoodBadge";
import "../../styles/recipe-card.css"

function RecipeCard({ recipe }) {
    return (
        <Card className="flex-fill shadow-sm h-100">
            <Card.Img
                variant="top"
                src={recipe.image}
                alt={recipe.title}
                style={{ objectFit: "cover", height: "180px" }}
            />
            <Card.Body>
                <div className="d-flex justify-content-between mb-2 align-items-center">
                    <Card.Title as="h6" className="mb-0">
                        {recipe.title}
                    </Card.Title>
                    <MoodBadge mood={recipe.mood || "Happy"} />
                </div>
                <Card.Text className="text-muted" style={{ fontSize: "0.85rem" }}>
                    Prep Time: {recipe.readyInMinutes} mins &bull; Servings: {recipe.servings}
                </Card.Text>

                <div className="mt-2">
                    {recipe.diets?.map(function (diet) {
                        return (
                            <Badge key={diet} bg="success" className="me-1">
                                {diet}
                            </Badge>
                        );
                    })}
                </div>
            </Card.Body>
        </Card>
    );
}

export default RecipeCard;