/* ====================================================================
// DATABASE: MAPS
// Define a estrutura do mapa estático (Hex Grid) e seus biomas.
// As chaves são coordenadas axiais "q,r".
// ==================================================================== */

export const STATIC_MAP_DATA = new Map([
    // --- Volcanics (Vermelho) ---
    ["-3,0", { biome: "volcanics" }],
    ["-3,1", { biome: "volcanics" }],
    ["-3,2", { biome: "volcanics" }],
    ["-2,-1", { biome: "volcanics" }],
    ["-2,0", { biome: "volcanics" }],
    ["-2,1", { biome: "volcanics" }],

    // --- Undergrounders (Marrom) ---
    ["-1,-2", { biome: "undergrounders" }],
    ["-1,-1", { biome: "undergrounders" }],
    ["-1,0", { biome: "undergrounders" }],
    ["0,-2", { biome: "undergrounders" }],
    ["0,-1", { biome: "undergrounders" }],

    // --- Wasteland (Amarelo - Centro) ---
    ["0,0", { biome: "wasteland" }],
    ["-1,1", { biome: "wasteland" }],
    ["1,-1", { biome: "wasteland" }],
    ["1,0", { biome: "wasteland" }],
    ["0,1", { biome: "wasteland" }],

    // --- Nocturnals (Azul) ---
    ["-2,2", { biome: "nocturnals" }],
    ["-2,3", { biome: "nocturnals" }],
    ["-1,2", { biome: "nocturnals" }],
    ["-1,3", { biome: "nocturnals" }],
    ["0,2", { biome: "nocturnals" }],
    ["0,3", { biome: "nocturnals" }],

    // --- Radioactives (Verde Claro) ---
    ["1,-2", { biome: "radioactives" }],
    ["2,-3", { biome: "radioactives" }],
    ["2,-2", { biome: "radioactives" }],
    ["3,-3", { biome: "radioactives" }],
    ["3,-2", { biome: "radioactives" }],

    // --- Reptilians (Verde Escuro) ---
    ["1,1", { biome: "reptilians" }],
    ["1,2", { biome: "reptilians" }],
    ["2,0", { biome: "reptilians" }],
    ["2,1", { biome: "reptilians" }],
    ["3,-1", { biome: "reptilians" }],
    ["3,0", { biome: "reptilians" }],
]);
