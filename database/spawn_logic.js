/* ====================================================================
// DATABASE: SPAWN LOGIC
// Define as chances de encontrar inimigos por tipo de ação.
// ==================================================================== */

export const SPAWN_LOGIC = {
    "Investigate": {
        "cost": 1,
        "chances": [
            {
                "type": "nothing",
                "chance": 60
            },
            {
                "type": "common",
                "chance": 30
            },
            {
                "type": "elite",
                "chance": 10
            },
            {
                "type": "boss",
                "chance": 0
            }
        ]
    },
    "Search Enemy": {
        "cost": 2,
        "chances": [
            {
                "type": "nothing",
                "chance": 0
            },
            {
                "type": "common",
                "chance": 50
            },
            {
                "type": "elite",
                "chance": 40
            },
            {
                "type": "boss",
                "chance": 10
            }
        ]
    }
};
