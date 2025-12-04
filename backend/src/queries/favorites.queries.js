// queries/favorites.queries.js

const queries = {
    getUserFavorites: `
        SELECT * FROM "Favorites_birds" 
        WHERE id_user = $1
    `,

    isFavorite: `
        SELECT id_favbird FROM "Favorites_birds" 
        WHERE id_user = $1 AND id_bird = $2
        LIMIT 1
    `,

    addFavorite: `
        INSERT INTO "Favorites_birds" (id_user, id_bird)
        VALUES ($1, $2)
        RETURNING id_favbird, id_user, id_bird
    `,

    getUserFavoritesWithDetails: `
        SELECT 
          f.id_favbird,
          f.id_user,
          f.id_bird,
          b.common_name,
          b.scientific_name,
          b.family,
          b.image,
          b.threat_level
        FROM "Favorites_birds" f
        JOIN "Navarrevisca_birds" b ON f.id_bird = b.id_bird
        WHERE f.id_user = $1
    `,

    removeFavorite: `
        DELETE FROM "Favorites_birds"
        WHERE id_favbird = $1 AND id_user = $2
        RETURNING id_favbird
    `
};

module.exports = queries;