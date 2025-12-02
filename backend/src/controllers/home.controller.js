/* 
🎮 CONTROLLER (Controlador) → home.controller.js
    * Controlador simple para GET /
*/

// GET / - Página de inicio
function getHome(req, res) {
  // Respuesta JSON directa, sin lógica compleja
  res.json({
    api: 'Aves de Gredos - Ávila',
    description: 'Backend para sistema de observación de aves',
    status: 'online',
    timestamp: new Date().toISOString()
  });
}

module.exports = {
  getHome  // Solo exportamos esta función
};