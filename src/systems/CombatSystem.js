/* ====================================================================
// SYSTEM: CombatSystem.js
// Motor de Combate Idle (Automático).
// Simula a batalha turno a turno e retorna o resultado e o log.
// ==================================================================== */

/**
 * Rola um dado (0-100) para checagens de chance.
 */
const rollChance = (chance) => {
    const roll = Math.random() * 100;
    return roll < chance;
};

/**
 * Calcula o dano de um ataque único.
 */
const calculateDamage = (attacker, defender) => {
    let log = [];
    let isCrit = false;
    let isBlocked = false;
    let isDodged = false;
    let finalDamage = 0;

    // 1. Checagem de Esquiva (Dodge)
    if (rollChance(defender.dodgeChance || 0)) {
        isDodged = true;
        return { damage: 0, isCrit, isBlocked, isDodged, log: ["DODGED!"] };
    }

    // 2. Cálculo de Dano Base (Físico)
    let rawDamage = attacker.attack || 0;

    // 3. Checagem de Crítico
    if (rollChance(attacker.critChance || 0)) {
        isCrit = true;
        const critMult = 1 + ((attacker.critDamage || 50) / 100); // Base 150% se não definido
        rawDamage *= critMult;
    }

    // 4. Mitigação de Defesa (Fórmula simples: Dano - Defesa, mínimo 1)
    let mitigatedDamage = Math.max(1, rawDamage - (defender.defense || 0));

    // 5. Checagem de Bloqueio
    if (rollChance(defender.blockChance || 0)) {
        isBlocked = true;
        const blockAmt = defender.blockAmount || 0;
        mitigatedDamage = Math.max(0, mitigatedDamage - blockAmt);
    }

    // 6. Dano Elemental (Ignora defesa física, reduzido por resistência)
    // (Exemplo: Fogo)
    if (attacker.fireDamage > 0) {
        const resist = defender.fireResist || 0;
        const elementalDmg = attacker.fireDamage * (1 - (resist / 100));
        mitigatedDamage += Math.max(0, elementalDmg);
    }

    finalDamage = Math.floor(mitigatedDamage);

    return { damage: finalDamage, isCrit, isBlocked, isDodged };
};

export const CombatSystem = {

    /**
     * Simula um combate completo entre o Jogador e um Inimigo.
     * @param {object} playerStats - Stats finais do Kid.
     * @param {object} enemyData - Objeto do inimigo (enemies.js).
     * @returns {object} { victory: boolean, log: Array<string>, playerRemainingHP: number }
     */
    simulateCombat: function(playerStats, enemyData) {
        // Clona os stats para não mutar o estado original durante a simulação
        let p = { ...playerStats, name: "Hero", maxHP: playerStats.currentHP }; // Usa HP atual como Max da luta
        let e = { ...enemyData.stats, name: enemyData.name, currentHP: enemyData.stats.hp, maxHP: enemyData.stats.hp };
        
        let combatLog = [];
        let turn = 1;
        const MAX_TURNS = 50; // Previne loops infinitos

        combatLog.push(`Combat Started: ${p.name} vs ${e.name}`);

        // Lógica de Iniciativa (Quem tem mais Speed ataca primeiro)
        let attacker = p.speed >= e.speed ? p : e;
        let defender = p.speed >= e.speed ? e : p;

        while (p.currentHP > 0 && e.currentHP > 0 && turn <= MAX_TURNS) {
            combatLog.push(`--- Turn ${turn} ---`);

            // --- Ataque do Atacante ---
            const result = calculateDamage(attacker, defender);
            
            if (result.isDodged) {
                combatLog.push(`${defender.name} dodged ${attacker.name}'s attack!`);
            } else {
                defender.currentHP -= result.damage;
                let msg = `${attacker.name} hits for ${result.damage} damage.`;
                if (result.isCrit) msg += " (CRITICAL!)";
                if (result.isBlocked) msg += " (Blocked)";
                combatLog.push(msg);

                // Lifesteal (Roubo de Vida)
                if (attacker.lifesteal > 0) {
                    const heal = Math.floor(result.damage * (attacker.lifesteal / 100));
                    if (heal > 0) {
                        attacker.currentHP = Math.min(attacker.maxHP, attacker.currentHP + heal);
                        combatLog.push(`${attacker.name} steals ${heal} HP.`);
                    }
                }

                // Thorns (Espinhos - Dano de volta)
                if (defender.thorns > 0) {
                    attacker.currentHP -= defender.thorns;
                    combatLog.push(`${attacker.name} takes ${defender.thorns} thorns damage.`);
                }
            }

            // Checa Morte após o ataque
            if (p.currentHP <= 0 || e.currentHP <= 0) break;

            // --- Troca de Turno (O Defensor vira Atacante) ---
            const temp = attacker;
            attacker = defender;
            defender = temp;
            
            // Se ambos atacaram neste round (par), incrementa turno
            // (Lógica simplificada: cada "hit" conta como meio turno na troca)
            turn++; 
        }

        const victory = p.currentHP > 0;
        
        if (victory) {
            combatLog.push(`VICTORY! ${e.name} was defeated.`);
        } else {
            combatLog.push(`DEFEAT! You were knocked out.`);
        }

        return {
            victory: victory,
            log: combatLog,
            playerRemainingHP: Math.max(0, p.currentHP)
        };
    }
};
