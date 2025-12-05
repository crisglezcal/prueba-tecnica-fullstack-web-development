const { validateBird, validateBirdUpdate, validateIdParam, ALLOWED_THREAT_LEVELS } = require('../../src/middlewares/validateBirds.middleware.js');
const { validationResult } = require('express-validator');

// Función auxiliar para pruebas de express-validator
  // Simula cómo Express realmente ejecuta los middlewares
const testValidation = async (validationChain, data, location = 'body') => {
  const req = { [location]: data, params: {}, query: {} };
  const res = {};
  const next = jest.fn();
  
  // Ejecuta cada validación en la cadena (excepto el middleware final)
  for (let i = 0; i < validationChain.length - 1; i++) {
    const validation = validationChain[i];
    await validation.run(req);
  }
  
  return validationResult(req);
};

describe('VALIDACIÓN BÁSICA', () => {
  test('ALLOWED_THREAT_LEVELS contiene códigos UICN', () => {
    expect(ALLOWED_THREAT_LEVELS).toContain('LC');
    expect(ALLOWED_THREAT_LEVELS).toContain('EN');
    expect(ALLOWED_THREAT_LEVELS).toContain('VU');
  });

  test('validateBird es un array de middlewares', () => {
    expect(Array.isArray(validateBird)).toBe(true);
    expect(validateBird.length).toBeGreaterThan(0);
  });
});

describe('VALIDACIÓN DE CREACIÓN DE AVES', () => {
  test('acepta objeto de ave válido completo', async () => {
    const validBird = {
      common_name: 'Carbonero común',
      scientific_name: 'Parus major',
      order: 'Passeriformes',
      family: 'Paridae',
      description: 'Descripción de prueba de al menos 20 caracteres.',
      image: 'https://example.com/bird.jpg',
      threat_level: 'LC'
    };

    const result = await testValidation(validateBird, validBird);
    expect(result.isEmpty()).toBe(true);
  });

  test('rechaza si falta algún campo obligatorio', async () => {
    const incompleteBird = {
      common_name: 'Carbonero común',
      scientific_name: 'Parus major'
    };

    const result = await testValidation(validateBird, incompleteBird);
    expect(result.isEmpty()).toBe(false);
    expect(result.array().length).toBeGreaterThan(0);
  });

  test('rechaza nombre común vacío', async () => {
    const birdWithEmptyName = {
      common_name: '',
      scientific_name: 'Parus major',
      order: 'Passeriformes',
      family: 'Paridae',
      description: 'Descripción de prueba.',
      image: 'https://example.com/bird.jpg',
      threat_level: 'LC'
    };

    const result = await testValidation(validateBird, birdWithEmptyName);
    expect(result.isEmpty()).toBe(false);
    
    const commonNameErrors = result.array().filter(err => err.path === 'common_name');
    expect(commonNameErrors.length).toBeGreaterThan(0);
  });

  test('rechaza threat_level inválido', async () => {
    const birdWithInvalidThreat = {
      common_name: 'Carbonero común',
      scientific_name: 'Parus major',
      order: 'Passeriformes',
      family: 'Paridae',
      description: 'Descripción de prueba.',
      image: 'https://example.com/bird.jpg',
      threat_level: 'INVALIDO'
    };

    const result = await testValidation(validateBird, birdWithInvalidThreat);
    expect(result.isEmpty()).toBe(false);
    
    const threatErrors = result.array().filter(err => err.path === 'threat_level');
    expect(threatErrors.length).toBeGreaterThan(0);
  });
});

describe('VALIDACIÓN DE ID', () => {
  test('acepta ID válido positivo', async () => {
    const req = { params: { id: '123' }, body: {} };
    
    for (let i = 0; i < validateIdParam.length - 1; i++) {
      const validation = validateIdParam[i];
      await validation.run(req);
    }
    
    const result = validationResult(req);
    expect(result.isEmpty()).toBe(true);
  });

  test('rechaza ID negativo', async () => {
    const req = { params: { id: '-1' }, body: {} };
    
    for (let i = 0; i < validateIdParam.length - 1; i++) {
      const validation = validateIdParam[i];
      await validation.run(req);
    }
    
    const result = validationResult(req);
    expect(result.isEmpty()).toBe(false);
  });

  test('rechaza ID no numérico', async () => {
    const req = { params: { id: 'abc' }, body: {} };
    
    for (let i = 0; i < validateIdParam.length - 1; i++) {
      const validation = validateIdParam[i];
      await validation.run(req);
    }
    
    const result = validationResult(req);
    expect(result.isEmpty()).toBe(false);
  });
});

describe('VALIDACIÓN DE ACTUALIZACIÓN', () => {
  test('acepta actualización parcial', async () => {
    const updateData = {
      common_name: 'Nombre actualizado',
      threat_level: 'EN'
    };

    const result = await testValidation(validateBirdUpdate, updateData);
    expect(result.isEmpty()).toBe(true);
  });

  test('acepta objeto vacío para actualización', async () => {
    const result = await testValidation(validateBirdUpdate, {});
    expect(result.isEmpty()).toBe(true);
  });
});

describe('EXPORTACIONES', () => {
  test('exporta todas las funciones necesarias', () => {
    expect(typeof validateBird).toBe('object');
    expect(typeof validateBirdUpdate).toBe('object');
    expect(typeof validateIdParam).toBe('object');
    expect(Array.isArray(ALLOWED_THREAT_LEVELS)).toBe(true);
  });
});