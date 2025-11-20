/* ====================================================================
// SYSTEM: MapGenerator.js
// UPDATE: (Correção de Importação)
// Garante que o caminho para o template burning_ridge.js esteja correto.
// ==================================================================== */

// (CORREÇÃO) Caminho relativo ajustado: sobe 2 níveis (../..) para raiz de src, 
// depois entra em database/maps/
import { BURNING_RIDGE_TEMPLATE } from '../../database/maps/burning_ridge.js';

const TEMPLATES = {
    'BURNING_RIDGE': BURNING_RIDGE_TEMPLATE,
    // 'ANCIENT_METROPOLIS': ...
};

export const MapGenerator = {

    /**
     * Gera uma instância única de um mapa de bioma.
     * @param {string} biomeId - O ID do bioma (ex: 'BURNING_RIDGE').
     * @returns {object} Objeto do mapa instanciado com nós.
     */
    generateBiomeMap: function(biomeId) {
        const template = TEMPLATES[biomeId];

        // 1. Validação / Fallback
        if (!template) {
            console.warn(`MapGenerator: Template para '${biomeId}' não encontrado. Gerando mapa genérico.`);
            return this.generateGenericMap(biomeId);
        }

        // 2. Deep Copy (Cópia Profunda)
        const mapInstance = JSON.parse(JSON.stringify(template));

        return mapInstance;
    },

    /**
     * Define o ponto de spawn aleatório para a expedição.
     * @param {object} mapInstance - O mapa gerado.
     * @returns {string} O ID do nó escolhido.
     */
    getRandomSpawnNode: function(mapInstance) {
        if (!mapInstance || !mapInstance.nodes) return null;

        // Filtra nós válidos (Não TRANSIT, não bloqueados)
        const validNodes = mapInstance.nodes.filter(node => 
            node.type !== 'TRANSIT' && 
            node.type !== 'EXIT'
        );

        if (validNodes.length === 0) {
            // Fallback de segurança
            return mapInstance.nodes[0].id;
        }

        // Escolhe um aleatório
        const randomIndex = Math.floor(Math.random() * validNodes.length);
        return validNodes[randomIndex].id;
    },

    /**
     * Gera um mapa placeholder para biomas que ainda não têm arquivo próprio.
     */
    generateGenericMap: function(biomeId) {
        return {
            id: biomeId,
            name: `${biomeId} (Gerado)`,
            description: 'Bioma gerado proceduralmente (Template ausente).',
            difficultyTier: 0,
            nodes: [
                {
                    id: 'gen_start',
                    name: 'Landing Zone',
                    type: 'START',
                    subtype: 'GENERIC',
                    description: 'Zona segura.',
                    x: 50, y: 50,
                    connections: ['gen_resource_1', 'gen_combat_1']
                },
                {
                    id: 'gen_resource_1',
                    name: 'Resource Patch',
                    type: 'RESOURCE',
                    subtype: 'GENERIC',
                    description: 'Recursos básicos.',
                    x: 30, y: 30,
                    connections: ['gen_start']
                },
                {
                    id: 'gen_combat_1',
                    name: 'Danger Zone',
                    type: 'COMBAT',
                    subtype: 'GENERIC',
                    description: 'Inimigos à frente.',
                    x: 70, y: 70,
                    connections: ['gen_start']
                }
            ]
        };
    }
};
