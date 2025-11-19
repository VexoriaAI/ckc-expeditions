/* ====================================================================
// (NOVO) RENDERER: renderEmbedConfirmation.js
// Renderiza o modal "Antes e Depois" para o Embed.
// ==================================================================== */

import { EQUIPMENT_DB } from '../../../database/equipment.js';
import { COMPONENTS_DB } from '../../../database/components.js';
import { calculatePowerScore } from '../../systems/StatCalculationSystem.js';

/**
 * Calcula os stats de um item (Base + Componentes).
 * (Versão local simplificada da lógica do sistema para exibição)
 */
const getItemStats = (itemInstance, addedComponentId = null) => {
    const staticData = EQUIPMENT_DB[itemInstance.item_id];
    let stats = { ...staticData.base_stats };

    // Soma componentes já existentes
    itemInstance.slots.forEach(slot => {
        if (slot.component_id) {
            const compData = COMPONENTS_DB[slot.component_id];
            for (const key in compData.stats) {
                stats[key] = (stats[key] || 0) + compData.stats[key];
            }
        }
    });

    // Soma o novo componente (Simulação)
    if (addedComponentId) {
        const compData = COMPONENTS_DB[addedComponentId];
        for (const key in compData.stats) {
            stats[key] = (stats[key] || 0) + compData.stats[key];
        }
    }

    return stats;
};

/**
 * Renderiza o HTML de comparação de stats.
 */
const renderStatComparison = (before, after) => {
    // Pega todas as chaves de stats únicas
    const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);
    
    return Array.from(allKeys).map(key => {
        const valBefore = before[key] || 0;
        const valAfter = after[key] || 0;
        
        if (valBefore === valAfter) return ''; // Não mostra se não mudou

        // Formatação (ex: Attack)
        const label = key.charAt(0).toUpperCase() + key.slice(1); 
        const diff = valAfter - valBefore;
        const diffClass = diff > 0 ? 'stat-gain' : 'stat-loss';
        const diffSymbol = diff > 0 ? '+' : '';

        return `
            <div class="stat-row-compare">
                <span class="stat-name">${label}</span>
                <div class="stat-values">
                    <span class="val-before">${valBefore}</span>
                    <span class="arrow">➜</span>
                    <span class="val-after ${diffClass}">${valAfter} (${diffSymbol}${diff})</span>
                </div>
            </div>
        `;
    }).join('');
};

export const renderEmbedConfirmationModal = (state) => {
    const { playerInventory, embedTargetEquipmentId, embedTargetComponentId } = state;
    
    const equipment = playerInventory.equipment.find(e => e.instance_id === embedTargetEquipmentId);
    const component = playerInventory.components.find(c => c.instance_id === embedTargetComponentId);

    if (!equipment || !component) return '<p>Error: Item not found.</p>';

    const equipData = EQUIPMENT_DB[equipment.item_id];
    const compData = COMPONENTS_DB[component.item_id];

    // Calcula Antes e Depois
    const statsBefore = getItemStats(equipment);
    const statsAfter = getItemStats(equipment, component.item_id);
    
    const scoreBefore = calculatePowerScore(statsBefore);
    const scoreAfter = calculatePowerScore(statsAfter);

    return `
        <h2>Confirm Embed</h2>
        <p>Are you sure you want to embed <strong>${compData.name}</strong> into <strong>${equipData.name}</strong>?</p>
        <p class="warning-text">This action consumes the component permanently.</p>

        <div class="embed-comparison-panel panel">
            <div class="comparison-header">
                <div class="comp-item">
                    <img src="${equipData.iconPath}">
                    <span>${equipData.name}</span>
                </div>
                <span class="plus-sign">+</span>
                <div class="comp-item">
                    <img src="${compData.iconPath}">
                    <span>${compData.name}</span>
                </div>
            </div>

            <div class="stats-comparison-list">
                ${renderStatComparison(statsBefore, statsAfter)}
                
                <div class="stat-row-compare power-row">
                    <span class="stat-name">Power Score</span>
                    <div class="stat-values">
                        <span class="val-before">${scoreBefore}</span>
                        <span class="arrow">➜</span>
                        <span class="val-after stat-gain">${scoreAfter} (+${scoreAfter - scoreBefore})</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal-actions">
            <button id="btn-cancel-embed" class="action-btn btn-secondary">CANCEL</button>
            <button id="btn-confirm-embed" class="action-btn btn-success">CONFIRM EMBED</button>
        </div>
    `;
};
