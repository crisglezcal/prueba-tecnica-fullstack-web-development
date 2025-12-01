require('dotenv').config();
const axios = require('axios');
const ebirdService = require('../services/eBird.service.js');  // ← B mayúscula

// 1. OBSERVACIONES EN ÁVILA
async function getObservations(req, res) {
  try {
    const days = req.query.days || 7;
    const limit = req.query.limit || 30;
    const hotspot = req.query.hotspot || false;
    const lat = req.query.lat;
    const lng = req.query.lng;
    
    let observations;
    
    // Si hay coordenadas, buscar observaciones cercanas con axios
    if (lat && lng) {
      const response = await axios.get(
        'https://api.ebird.org/v2/data/obs/geo/recent',
        {
          headers: {
            'X-eBirdApiToken': process.env.EBIRD_API_KEY
          },
          params: {
            lat: lat,
            lng: lng,
            dist: 20,
            back: days
          }
        }
      );
      observations = response.data;
    } else {
      // Observaciones generales de Ávila
      observations = await ebirdService.getObservations({
        days: parseInt(days),
        limit: parseInt(limit),
        hotspot: hotspot === 'true'
      });
    }
    
    // Formatear respuesta
    const formattedObservations = observations.map(obs => ({
      especie: obs.comName,
      nombreCientifico: obs.sciName,
      lugar: obs.locName,
      fecha: obs.obsDt,
      cantidad: obs.howMany || 1,
      coordenadas: obs.lat && obs.lng ? {
        lat: obs.lat,
        lng: obs.lng
      } : null,
      validado: obs.obsValid || false
    }));
    
    res.json({
      success: true,
      region: 'Ávila',
      total: formattedObservations.length,
      datos: formattedObservations,
      metadata: {
        dias: days,
        limite: limit,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// 2. ESPECIES DE ÁVILA 
async function getSpecies(req, res) {
  try {
    const species = await ebirdService.getSpeciesList();
    
    // Formatear respuesta
    const formattedSpecies = species.map(s => ({
      codigo: s.code,
      nombreComun: s.comName,
      nombreCientifico: s.sciName,
      categoria: s.category,
      familia: s.familyComName || 'No especificada'
    }));
    
    res.json({
      success: true,
      region: 'Ávila',
      totalEspecies: formattedSpecies.length,
      especies: formattedSpecies,
      metadata: {
        actualizado: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// 3. BUSCAR ESPECIE
async function searchSpecies(req, res) {
  try {
    const q = req.query.q;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Parámetro de búsqueda (q) es requerido'
      });
    }
    
    const results = await ebirdService.searchSpecies(q);
    
    // Formatear resultados
    const formattedResults = results.map(result => ({
      codigo: result.code,
      nombreComun: result.comName,
      nombreCientifico: result.sciName,
      categoria: result.category,
      orden: result.order,
      familia: result.familyComName
    }));
    
    res.json({
      success: true,
      busqueda: q,
      resultados: formattedResults.length,
      datos: formattedResults
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// 4. INFORMACIÓN DETALLADA DE ESPECIE
async function getSpeciesDetail(req, res) {
  try {
    const code = req.params.code;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Código de especie es requerido'
      });
    }
    
    const speciesDetail = await ebirdService.getSpeciesDetail(code);
    
    res.json({
      success: true,
      especie: {
        codigo: speciesDetail.code,
        nombreComun: speciesDetail.comName,
        nombreCientifico: speciesDetail.sciName,
        nombreFamilia: speciesDetail.familyComName,
        nombreFamiliaCientifico: speciesDetail.familySciName,
        orden: speciesDetail.order,
        categoria: speciesDetail.category
      },
      observacionesRecientes: {
        total: speciesDetail.recentObservations?.length || 0,
        datos: speciesDetail.recentObservations?.map(obs => ({
          lugar: obs.locName,
          fecha: obs.obsDt,
          cantidad: obs.howMany
        })) || []
      },
      metadata: {
        region: 'Ávila',
        actualizado: new Date().toISOString()
      }
    });
  } catch (error) {
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// 5. PUNTOS CALIENTES DE OBSERVACIÓN
async function getHotspots(req, res) {
  try {
    const lat = req.query.lat;
    const lng = req.query.lng;
    const dist = req.query.dist || 20;
    
    const hotspots = await ebirdService.getHotspots({
      lat: lat ? parseFloat(lat) : undefined,
      lng: lng ? parseFloat(lng) : undefined,
      dist: parseInt(dist)
    });

    // Convertir a array si no lo es
    const hotspotsArray = Array.isArray(hotspots) 
      ? hotspots 
      : (hotspots ? [hotspots] : []);

    // Formatear respuesta
    const formattedHotspots = hotspotsArray.map((h, index) => ({
      id: h.locId || `hotspot_${index}`,
      nombre: h.name || `Punto de observación ${index + 1}`,
      coordenadas: {
        lat: h.latitude || 40.65,
        lng: h.longitude || -4.68
      },
      region: h.countryCode === 'ES' ? 'España' : (h.countryCode || 'ES'),
      subregion: h.subnational1Name || 'Castilla y León',
      especiesRegistradas: h.numSpeciesAllTime || 0,
      ultimaObservacion: h.latestObsDt || 'No disponible'
    }));

    res.json({
      success: true,
      region: 'Ávila',
      totalPuntos: formattedHotspots.length,
      puntosCalientes: formattedHotspots
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = {
  getObservations,
  getSpecies,
  searchSpecies,
  getSpeciesDetail,
  getHotspots
};