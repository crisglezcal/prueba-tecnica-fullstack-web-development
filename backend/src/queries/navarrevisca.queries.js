// QUERIES NAVARREVISCA_BIRDS

const queries = {

    getAllBirds: `
        SELECT * 
        FROM "Navarrevisca_birds"
        ORDER BY common_name ASC
      `,
    
    getBirdById: `
        SELECT * 
        FROM "Navarrevisca_birds" 
        WHERE id_bird = $1
        `,
    
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
      `
}

module.exports = queries;