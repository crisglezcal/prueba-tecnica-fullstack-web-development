/* 
🛣️ ADMIN ROUTES → admin.routes.js
    * Rutas para administradores (CRUD completo de aves)
    * IMPORTANTE: Temporalmente sin auth para desarrollo
    * Cuando haya auth: verificar que el usuario tenga rol 'admin'
    * Documentación con Swagger
*/

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller.js');
const { validateBird, validateIdParam } = require('../middlewares/validateBirds.middleware.js');
const getAccessToken = require('../middlewares/getAccessToken.js');
const decodeToken = require('../middlewares/decodeToken.js');
const adminRoutes = require('../middlewares/auth.admin.middleware.js'); 

// =============================================================================================================================
// 1. RUTAS PROTEGIDAS (requieren autenticación)
// =============================================================================================================================

/**
 * @swagger
 * /admin/aves:
 *   post:
 *     summary: Crear nueva ave (solo administradores)
 *     description: Crea una nueva ave en el sistema. Requiere autenticación con rol 'admin'.
 *     tags: [Administración - Aves]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - common_name
 *               - scientific_name
 *               - family
 *               - description
 *               - threat_level
 *             properties:
 *               common_name:
 *                 type: string
 *                 example: "Buitre leonado"
 *               scientific_name:
 *                 type: string
 *                 example: "Gyps fulvus"
 *               family:
 *                 type: string
 *                 example: "Accipitridae"
 *               description:
 *                 type: string
 *                 example: "Ave rapaz de gran tamaño..."
 *               image:
 *                 type: string
 *                 example: "https://ejemplo.com/imagen.jpg"
 *               threat_level:
 *                 type: string
 *                 enum: [LC, NT, VU, EN, CR]
 *                 example: "LC"
 *     responses:
 *       201:
 *         description: Ave creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Ave creada correctamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_bird:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Error de validación o datos incompletos
 *       401:
 *         description: No autenticado o sin permisos de administrador
 *       500:
 *         description: Error interno del servidor
 */
router.post('/aves', getAccessToken, decodeToken, adminRoutes, validateBird, adminController.createBird);

/**
 * @swagger
 * /admin/aves/{id}:
 *   put:
 *     summary: Actualizar ave existente (solo administradores)
 *     description: Actualiza la información de un ave existente. Requiere autenticación con rol 'admin'.
 *     tags: [Administración - Aves]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del ave a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               common_name:
 *                 type: string
 *                 example: "Buitre leonado actualizado"
 *               scientific_name:
 *                 type: string
 *                 example: "Gyps fulvus"
 *               family:
 *                 type: string
 *                 example: "Accipitridae"
 *               description:
 *                 type: string
 *                 example: "Descripción actualizada..."
 *               image:
 *                 type: string
 *                 example: "https://ejemplo.com/nueva-imagen.jpg"
 *               threat_level:
 *                 type: string
 *                 enum: [LC, NT, VU, EN, CR]
 *                 example: "NT"
 *     responses:
 *       200:
 *         description: Ave actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Ave actualizada correctamente"
 *                 data:
 *                   type: object
 *       404:
 *         description: Ave no encontrada
 *       401:
 *         description: No autenticado o sin permisos de administrador
 *       500:
 *         description: Error interno del servidor
 */
router.put('/aves/:id', getAccessToken, decodeToken, adminRoutes, validateIdParam, validateBird, adminController.updateBird); 

/**
 * @swagger
 * /admin/aves/{id}:
 *   delete:
 *     summary: Eliminar ave (solo administradores)
 *     description: Elimina un ave del sistema. Requiere autenticación con rol 'admin'.
 *     tags: [Administración - Aves]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del ave a eliminar
 *     responses:
 *       200:
 *         description: Ave eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Ave eliminada correctamente"
 *                 data:
 *                   type: object
 *       404:
 *         description: Ave no encontrada
 *       401:
 *         description: No autenticado o sin permisos de administrador
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/aves/:id', getAccessToken, decodeToken, adminRoutes, validateIdParam, adminController.deleteBird);

/**
 * @swagger
 * /admin/test-auth:
 *   get:
 *     summary: Probar autenticación de administrador
 *     description: Endpoint de prueba para verificar la autenticación y permisos de administrador.
 *     tags: [Administración - Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Autenticación exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Autenticación exitosa"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id_user:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: No autenticado o sin permisos de administrador
 */
router.get('/test-auth', getAccessToken, decodeToken, adminRoutes, (req, res) => {
    res.json({
        success: true,
        message: 'Autenticación exitosa',
        user: req.user
    });
});

module.exports = router;