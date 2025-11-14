import { TRIBES } from './tribes.js';
/* ====================================================================
// DATABASE: MOCK WALLET
// Simula uma carteira conectada com NFTs (Kidz) para teste.
// Depende de: database/tribes.js (para a constante TRIBES)
// ==================================================================== */

export const MOCK_WALLET = [
    { 
        id: '#313', 
        name: 'Blue Mutant', 
        tribe: TRIBES.RADIOACTIVES, 
        expeditions: 5, 
        equipped: { 
            helmet: 'h1', 
            weapon: 'w1', 
            accessory: null, 
            armor: null, 
            gloves: null, 
            implant: null, 
            boots: null 
        } 
    },
    { 
        id: '#222', 
        name: 'Demo Nocturnal', 
        tribe: TRIBES.NOCTURNALS, 
        expeditions: 2, 
        equipped: { 
            helmet: null, 
            weapon: null, 
            accessory: null, 
            armor: null, 
            gloves: null, 
            implant: null, 
            boots: null 
        } 
    },
    { 
        id: '#111', 
        name: 'Demo Volcanic', 
        tribe: TRIBES.VOLCANICS, 
        expeditions: 10, 
        equipped: { 
            helmet: null, 
            weapon: 'w1', 
            accessory: null, 
            armor: null, 
            gloves: null, 
            implant: null, 
            boots: null 
        } 
    },
    // Kidz extras para testar paginação e filtros
    { id: '#444', name: 'Swamp Kid', tribe: TRIBES.REPTILIANS, expeditions: 0, equipped: {} },
    { id: '#555', name: 'Miner', tribe: TRIBES.UNDERGROUNDERS, expeditions: 1, equipped: {} },
    { id: '#001', name: 'Rookie-1', tribe: TRIBES.VOLCANICS, expeditions: 0, equipped: {} },
    { id: '#002', name: 'Rookie-2', tribe: TRIBES.VOLCANICS, expeditions: 0, equipped: {} },
    { id: '#003', name: 'Rookie-3', tribe: TRIBES.NOCTURNALS, expeditions: 0, equipped: {} },
    { id: '#004', name: 'Rookie-4', tribe: TRIBES.RADIOACTIVES, expeditions: 0, equipped: {} },
    { id: '#005', name: 'Rookie-5', tribe: TRIBES.REPTILIANS, expeditions: 0, equipped: {} },
    { id: '#006', name: 'Rookie-6', tribe: TRIBES.UNDERGROUNDERS, expeditions: 0, equipped: {} },
    { id: '#007', name: 'Rookie-7', tribe: TRIBES.VOLCANICS, expeditions: 0, equipped: {} },
    { id: '#008', name: 'Rookie-8', tribe: TRIBES.NOCTURNALS, expeditions: 0, equipped: {} },
    { id: '#009', name: 'Rookie-9', tribe: TRIBES.RADIOACTIVES, expeditions: 0, equipped: {} },
    { id: '#010', name: 'Rookie-10', tribe: TRIBES.REPTILIANS, expeditions: 0, equipped: {} },
    { id: '#011', name: 'Rookie-11', tribe: TRIBES.UNDERGROUNDERS, expeditions: 0, equipped: {} }
];

export const DEMO_KID_ID = '#313';
