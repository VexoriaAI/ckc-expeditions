/* ====================================================================
// DATABASE: ENEMIES
// Contém todos os dados de inimigos, gerados a partir do CSV do usuário.
// ==================================================================== */

export const ENEMIES_BY_BIOME = {
    "volcanics": {
        "common": {
            "id": "vol_com_01",
            "name": "Magma Crawler",
            "sprite": "images/enemies/magma_crawler.png",
            "stats": {
                "hp": 20,
                "strength": 6,
                "defense": 3,
                "speed": 5
            },
            "rewards": {
                "scrap": {
                    "chance": 100,
                    "quantity": [
                        1,
                        5
                    ]
                }
            }
        },
        "elite": {
            "id": "vol_eli_02",
            "name": "Cinder Hulk",
            "sprite": "images/enemies/cinder_hulk.png",
            "stats": {
                "hp": 50,
                "strength": 12,
                "defense": 8,
                "speed": 3
            },
            "rewards": {
                "scrap": {
                    "chance": 100,
                    "quantity": [
                        10,
                        20
                    ]
                },
                "metal": {
                    "chance": 50,
                    "quantity": [
                        1,
                        3
                    ]
                }
            }
        },
        "boss": {
            "id": "vol_bos_03",
            "name": "Obsidian Golem",
            "sprite": "images/enemies/obsidian_golem.png",
            "stats": {
                "hp": 120,
                "strength": 25,
                "defense": 15,
                "speed": 5
            },
            "rewards": {
                "scrap": {
                    "chance": 100,
                    "quantity": [
                        20,
                        50
                    ]
                },
                "metal": {
                    "chance": 100,
                    "quantity": [
                        5,
                        10
                    ]
                },
                "volcanics_core": {
                    "chance": 100,
                    "quantity": [
                        1,
                        1
                    ]
                }
            }
        }
    },
    "undergrounders": {
        "common": {
            "id": "und_com_04",
            "name": "Cave Skitter",
            "sprite": "images/enemies/cave_skitter.png",
            "stats": {
                "hp": 15,
                "strength": 5,
                "defense": 5,
                "speed": 8
            },
            "rewards": {
                "scrap": {
                    "chance": 100,
                    "quantity": [
                        1,
                        5
                    ]
                }
            }
        },
        "elite": {
            "id": "und_eli_05",
            "name": "Crystalback Behemoth",
            "sprite": "images/enemies/crystalback_behemoth.png",
            "stats": {
                "hp": 45,
                "strength": 10,
                "defense": 12,
                "speed": 4
            },
            "rewards": {
                "scrap": {
                    "chance": 100,
                    "quantity": [
                        10,
                        20
                    ]
                },
                "metal": {
                    "chance": 50,
                    "quantity": [
                        1,
                        3
                    ]
                }
            }
        },
        "boss": {
            "id": "und_bos_06",
            "name": "Deep Rock Tyrant",
            "sprite": "images/enemies/deep_rock_tyrant.png",
            "stats": {
                "hp": 100,
                "strength": 20,
                "defense": 20,
                "speed": 6
            },
            "rewards": {
                "scrap": {
                    "chance": 100,
                    "quantity": [
                        20,
                        50
                    ]
                },
                "metal": {
                    "chance": 100,
                    "quantity": [
                        5,
                        10
                    ]
                },
                "undergrounders_core": {
                    "chance": 100,
                    "quantity": [
                        1,
                        1
                    ]
                }
            }
        }
    },
    "nocturnals": {
        "common": {
            "id": "noc_com_07",
            "name": "Glitch Bot",
            "sprite": "images/enemies/glitch_bot.png",
            "stats": {
                "hp": 15,
                "strength": 7,
                "defense": 1,
                "speed": 15
            },
            "rewards": {
                "scrap": {
                    "chance": 100,
                    "quantity": [
                        1,
                        5
                    ]
                }
            }
        },
        "elite": {
            "id": "noc_eli_08",
            "name": "Rogue Sentry",
            "sprite": "images/enemies/rogue_sentry.png",
            "stats": {
                "hp": 40,
                "strength": 14,
                "defense": 3,
                "speed": 20
            },
            "rewards": {
                "scrap": {
                    "chance": 100,
                    "quantity": [
                        10,
                        20
                    ]
                },
                "metal": {
                    "chance": 50,
                    "quantity": [
                        1,
                        3
                    ]
                }
            }
        },
        "boss": {
            "id": "noc_bos_09",
            "name": "Code-Wraith",
            "sprite": "images/enemies/code_wraith.png",
            "stats": {
                "hp": 90,
                "strength": 22,
                "defense": 5,
                "speed": 25
            },
            "rewards": {
                "scrap": {
                    "chance": 100,
                    "quantity": [
                        20,
                        50
                    ]
                },
                "metal": {
                    "chance": 100,
                    "quantity": [
                        5,
                        10
                    ]
                },
                "nocturnals_core": {
                    "chance": 100,
                    "quantity": [
                        1,
                        1
                    ]
                }
            }
        }
    },
    "radioactives": {
        "common": {
            "id": "rad_com_10",
            "name": "Goo Blob",
            "sprite": "images/enemies/goo_blob.png",
            "stats": {
                "hp": 30,
                "strength": 4,
                "defense": 0,
                "speed": 3
            },
            "rewards": {
                "scrap": {
                    "chance": 100,
                    "quantity": [
                        1,
                        5
                    ]
                }
            }
        },
        "elite": {
            "id": "rad_eli_11",
            "name": "Irradiated Ghoul",
            "sprite": "images/enemies/irradiated_ghoul.png",
            "stats": {
                "hp": 60,
                "strength": 10,
                "defense": 2,
                "speed": 7
            },
            "rewards": {
                "scrap": {
                    "chance": 100,
                    "quantity": [
                        10,
                        20
                    ]
                },
                "metal": {
                    "chance": 50,
                    "quantity": [
                        1,
                        3
                    ]
                }
            }
        },
        "boss": {
            "id": "rad_bos_12",
            "name": "Toxic Abomination",
            "sprite": "images/enemies/toxic_abomination.png",
            "stats": {
                "hp": 150,
                "strength": 18,
                "defense": 5,
                "speed": 4
            },
            "rewards": {
                "scrap": {
                    "chance": 100,
                    "quantity": [
                        20,
                        50
                    ]
                },
                "metal": {
                    "chance": 100,
                    "quantity": [
                        5,
                        10
                    ]
                },
                "radioactives_core": {
                    "chance": 100,
                    "quantity": [
                        1,
                        1
                    ]
                }
            }
        }
    },
    "reptilians": {
        "common": {
            "id": "rep_com_13",
            "name": "Swamp Lurker",
            "sprite": "images/enemies/swamp_lurker.png",
            "stats": {
                "hp": 20,
                "strength": 6,
                "defense": 3,
                "speed": 7
            },
            "rewards": {
                "scrap": {
                    "chance": 100,
                    "quantity": [
                        1,
                        5
                    ]
                }
            }
        },
        "elite": {
            "id": "rep_eli_14",
            "name": "Alpha Hunter",
            "sprite": "images/enemies/alpha_hunter.png",
            "stats": {
                "hp": 50,
                "strength": 13,
                "defense": 6,
                "speed": 10
            },
            "rewards": {
                "scrap": {
                    "chance": 100,
                    "quantity": [
                        10,
                        20
                    ]
                },
                "metal": {
                    "chance": 50,
                    "quantity": [
                        1,
                        3
                    ]
                }
            }
        },
        "boss": {
            "id": "rep_bos_15",
            "name": "Covenant Drake",
            "sprite": "images/enemies/covenant_drake.png",
            "stats": {
                "hp": 110,
                "strength": 22,
                "defense": 10,
                "speed": 12
            },
            "rewards": {
                "scrap": {
                    "chance": 100,
                    "quantity": [
                        20,
                        50
                    ]
                },
                "metal": {
                    "chance": 100,
                    "quantity": [
                        5,
                        10
                    ]
                },
                "reptilians_core": {
                    "chance": 100,
                    "quantity": [
                        1,
                        1
                    ]
                }
            }
        }
    },
    "wasteland": {
        "common": {
            "id": "was_com_16",
            "name": "Scavenger Drone",
            "sprite": "images/enemies/scavenger_drone.png",
            "stats": {
                "hp": 15,
                "strength": 5,
                "defense": 2,
                "speed": 12
            },
            "rewards": {
                "scrap": {
                    "chance": 100,
                    "quantity": [
                        1,
                        5
                    ]
                }
            }
        },
        "elite": {
            "id": "was_eli_17",
            "name": "Wasteland Marauder",
            "sprite": "images/enemies/wasteland_marauder.png",
            "stats": {
                "hp": 45,
                "strength": 11,
                "defense": 5,
                "speed": 9
            },
            "rewards": {
                "scrap": {
                    "chance": 100,
                    "quantity": [
                        10,
                        20
                    ]
                },
                "metal": {
                    "chance": 50,
                    "quantity": [
                        1,
                        3
                    ]
                }
            }
        },
        "boss": {
            "id": "was_bos_18",
            "name": "The Iron Warlord",
            "sprite": "images/enemies/iron_warlord.png",
            "stats": {
                "hp": 100,
                "strength": 20,
                "defense": 12,
                "speed": 8
            },
            "rewards": {
                "scrap": {
                    "chance": 100,
                    "quantity": [
                        20,
                        50
                    ]
                },
                "metal": {
                    "chance": 100,
                    "quantity": [
                        5,
                        10
                    ]
                },
                "wasteland_core": {
                    "chance": 100,
                    "quantity": [
                        1,
                        1
                    ]
                }
            }
        }
    }
};
