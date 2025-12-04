// QUERIES FUNCIONES ADMINISTRADOR

const queries = {
    createBird: `
        INSERT INTO "Navarrevisca_birds" (
          common_name,
          scientific_name,
          "order",
          family,
          description,
          image,
          threat_level
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `,

    updateBird: `
        UPDATE "Navarrevisca_birds"
        SET 
          common_name = COALESCE($1, common_name),
          scientific_name = COALESCE($2, scientific_name),
          "order" = COALESCE($3, "order"),
          family = COALESCE($4, family),
          description = COALESCE($5, description),
          image = COALESCE($6, image),
          threat_level = COALESCE($7, threat_level)
        WHERE id_bird = $8
        RETURNING *
    `,

    deleteFavoritesByBirdId: `
        DELETE FROM "Favorites_birds" 
        WHERE id_bird = $1
        RETURNING id_favbird
    `,

    deleteBird: `
        DELETE FROM "Navarrevisca_birds" 
        WHERE id_bird = $1
        RETURNING id_bird, common_name
    `,

    checkBirdExists: `
        SELECT id_bird FROM "Navarrevisca_birds" WHERE id_bird = $1
    `
};

module.exports = queries;