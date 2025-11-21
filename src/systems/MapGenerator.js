/* ====================================================================
// SYSTEM: MapGenerator.js
// UPDATE: (Fase 4.0 - Todos os Biomas)
// Importa e registra TODOS os templates de mapa criados.
// ==================================================================== */

import { BURNING_RIDGE_TEMPLATE } from '../../database/maps/burning_ridge.js';
import { LAKE_RANCID_TEMPLATE } from '../../database/maps/lake_rancid.js';
// (NOVOS IMPORTS)
import { ANCIENT_METROPOLIS_TEMPLATE } from '../../database/maps/ancient_metropolis.js';
import { ABANDONED_MINES_TEMPLATE } from '../../database/maps/abandoned_mines.js';
import { COVENANT_SWAMP_TEMPLATE } from '../../database/maps/covenant_swamp.js';
import { WASTELAND_TEMPLATE } from '../../database/maps/wasteland.js';

const TEMPLATES = {
    'BURNING_RIDGE': BURNING_RIDGE_TEMPLATE,
    'LAKE_RANCID': LAKE_RANCID_TEMPLATE,
    'ANCIENT_METROPOLIS': ANCIENT_METROPOLIS_TEMPLATE,
    'ABANDONED_MINES': ABANDONED_MINES_TEMPLATE,
    'COVENANT_SWAMP': COVENANT_SWAMP_TEMPLATE,
    'WASTELAND': WASTELAND_TEMPLATE,
    
    // 'CYBERCITY': ... (Futuro)
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
        // Importante: Clona o objeto para não modificar o banco de dados original
        const mapInstance = JSON.parse(JSON.stringify(template));

        return mapInstance;
    },

    /**
     * Define o ponto de spawn aleatório para a expedição.
     * Regra: Não pode ser um ponto de trânsito (TRANSIT) ou saída.
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
