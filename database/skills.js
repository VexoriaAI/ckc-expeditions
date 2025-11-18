/* ====================================================================
// DATABASE: SKILLS
// Define as habilidades de combate (Ativas e Passivas) usadas
// por Equipamentos e Tribos.
// ==================================================================== */

/**
 * Estrutura de uma Skill:
 * @property {string} name - Nome de exibição.
 * @property {string} type - 'ACTIVE' (tem cooldown) ou 'PASSIVE' (efeito constante).
 * @property {number} cooldown - Tempo em segundos para recarregar (se ACTIVE).
 * @property {object} effect - Define o comportamento da skill.
 * @property {string} effect.target - 'ENEMY' ou 'SELF'.
 * @property {string} effect.type - 'PHYSICAL_DAMAGE', 'ELEMENTAL_DAMAGE', 'HEAL', 'BUFF'.
 * @property {string} effect.scaling - Qual stat base define a força (ex: 'attack', 'defense').
 * @property {number} effect.multiplier - Multiplicador do stat base (ex: 1.5 = 150% do Ataque).
 * @property {object} [effect.status] - Efeito de status opcional (ex: stun, burn).
 */

export const SKILLS_DB = {
    
    // --- SKILLS BÁSICAS (Tier 1) ---
    'skill_normal_attack': {
        name: 'Basic Strike',
        description: 'A simple, reliable attack.',
        type: 'ACTIVE',
        cooldown: 2.0,
        effect: {
            target: 'ENEMY',
            type: 'PHYSICAL_DAMAGE',
            scaling: 'attack',
            multiplier: 1.0
        }
    },
    'skill_quick_stab': {
        name: 'Quick Stab',
        description: 'A fast attack with low damage but high frequency.',
        type: 'ACTIVE',
        cooldown: 1.2,
        effect: {
            target: 'ENEMY',
            type: 'PHYSICAL_DAMAGE',
            scaling: 'attack',
            multiplier: 0.7
        }
    },
    'skill_heavy_smash': {
        name: 'Heavy Smash',
        description: 'A slow, heavy blow that deals massive damage.',
        type: 'ACTIVE',
        cooldown: 4.0,
        effect: {
            target: 'ENEMY',
            type: 'PHYSICAL_DAMAGE',
            scaling: 'attack',
            multiplier: 1.8
        }
    },

    // --- SKILLS DE TRIBO / ELEMENTAIS (Tier 3+) ---
    
    // Volcanics (Fogo / Dano)
    'skill_magma_slash': {
        name: 'Magma Slash',
        description: 'Coats the weapon in lava, dealing extra Fire Damage.',
        type: 'ACTIVE',
        cooldown: 5.0,
        effect: {
            target: 'ENEMY',
            type: 'ELEMENTAL_DAMAGE',
            element: 'fire',
            scaling: 'attack',
            multiplier: 1.5,
            status: { type: 'BURN', duration: 3, damagePerSec: 0.2 }
        }
    },
    'passive_flame_aura': {
        name: 'Flame Aura',
        description: 'Nearby enemies take constant heat damage.',
        type: 'PASSIVE',
        effect: {
            target: 'ENEMY',
            type: 'DOT', // Damage Over Time
            element: 'fire',
            scaling: 'defense', // Escala com defesa (Tank ofensivo)
            multiplier: 0.1 // 10% da defesa por segundo
        }
    },

    // Nocturnals (Crítico / Elétrico)
    'skill_shadow_strike': {
        name: 'Shadow Strike',
        description: 'A strike from the shadows with high critical chance.',
        type: 'ACTIVE',
        cooldown: 3.5,
        effect: {
            target: 'ENEMY',
            type: 'PHYSICAL_DAMAGE',
            scaling: 'attack',
            multiplier: 1.2,
            bonusCritChance: 50 // +50% chance de crit neste ataque
        }
    },
    'skill_shock_blade': {
        name: 'Shock Blade',
        description: 'Electrocutes the target, bypassing armor.',
        type: 'ACTIVE',
        cooldown: 4.0,
        effect: {
            target: 'ENEMY',
            type: 'ELEMENTAL_DAMAGE',
            element: 'energy',
            scaling: 'attack',
            multiplier: 1.3,
            status: { type: 'STUN', duration: 1, chance: 0.3 } // 30% chance de stun
        }
    },

    // Undergrounders (Defesa / Terra)
    'skill_shield_bash': {
        name: 'Shield Bash',
        description: 'Uses defensive weight to inflict damage and stun.',
        type: 'ACTIVE',
        cooldown: 6.0,
        effect: {
            target: 'ENEMY',
            type: 'PHYSICAL_DAMAGE',
            scaling: 'defense', // Dano baseado na DEFESA
            multiplier: 1.5,
            status: { type: 'STUN', duration: 1.5, chance: 1.0 } // 100% chance
        }
    },

    // Reptilians (Veneno / Sangramento)
    'skill_feral_bite': {
        name: 'Feral Bite',
        description: 'A savage bite that causes bleeding.',
        type: 'ACTIVE',
        cooldown: 3.0,
        effect: {
            target: 'ENEMY',
            type: 'PHYSICAL_DAMAGE',
            scaling: 'attack',
            multiplier: 1.0,
            status: { type: 'BLEED', duration: 5, damagePerSec: 0.3 }
        }
    },
    
    // Radioactives (Toxina / Regen)
    'skill_toxic_spit': {
        name: 'Toxic Spit',
        description: 'Spits corrosive acid that lowers enemy defense.',
        type: 'ACTIVE',
        cooldown: 4.5,
        effect: {
            target: 'ENEMY',
            type: 'ELEMENTAL_DAMAGE',
            element: 'toxin',
            scaling: 'maxHP', // Escala com HP Máximo
            multiplier: 0.1
        }
    },
    'passive_rad_regen': {
        name: 'Radioactive Mutation',
        description: 'Rapidly regenerates health when low.',
        type: 'PASSIVE',
        effect: {
            target: 'SELF',
            type: 'HEAL',
            scaling: 'maxHP',
            multiplier: 0.05 // 5% HP por segundo passivo
        }
    },

    // --- SKILLS MYTHIC (Tier 8) ---
    'skill_obliterate': {
        name: 'Obliterate',
        description: 'A mythic level attack that devastates the enemy.',
        type: 'ACTIVE',
        cooldown: 10.0,
        effect: {
            target: 'ENEMY',
            type: 'TRUE_DAMAGE', // Ignora defesa
            scaling: 'attack',
            multiplier: 3.0
        }
    }
};
