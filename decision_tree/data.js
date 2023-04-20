export function getData(index) {
    if (index == 1) {
        return [
            ["Fever", "Cough", "Breathing", "Infected"],
            ["YES",   "NO",    "YES",       "YES"],
            ["YES",   "NO",    "NO",        "NO"],
            ["YES",   "YES",   "NO",        "NO"],
            ["NO",    "NO",    "NO",        "NO"],
            ["YES",   "YES",   "YES",       "YES"],
            ["NO",    "YES",   "NO",        "NO"],
            ["YES",   "NO",    "YES",       "YES"],
            ["YES",   "NO",    "YES",       "YES"],
            ["NO",    "YES",   "YES",       "YES"],
            ["YES",   "YES",   "NO",        "YES"],
            ["NO",    "YES",   "NO",        "NO"],
            ["NO",    "YES",   "YES",       "NO"],
            ["NO",    "YES",   "YES",       "NO"],
            ["YES",   "YES",   "NO",        "NO"]
        ];
    }
    
    if (index == 2) {
        return [
            ["usd",     "lamphat",  "nctt",     "slkt",     "play" ],
            ["TANG",    "GIAM",     "THAP",     "TB",       "THAP" ],
            ["TANG",    "TANG",     "THAP",     "TB",       "CAO"  ],
            ["TANG",    "ON DINH",  "CAO",      "TB",       "CAO"  ],
            ["TANG",    "TANG",     "THAP",     "THAP",     "CAO"  ],
            ["TANG",    "GIAM",     "TB",       "THAP",     "CAO"  ],
            ["TANG",    "GIAM",     "CAO",      "THAP",     "THAP" ],
            ["TB",      "ON DINH",  "TB",       "CAO",      "THAP" ],
            ["TB",      "GIAM",     "THAP",     "CAO",      "THAP" ],
            ["TB",      "TANG",     "TB",       "THAP",     "THAP" ],
            ["TB",      "ON DINH",  "CAO",      "TB",       "CAO"  ],
            ["TB",      "GIAM",     "CAO",      "CAO",      "CAO"  ],
            ["GIAM",    "ON DINH",  "CAO",      "THAP",     "THAP" ],
            ["GIAM",    "GIAM",     "CAO",      "CAO",      "CAO"  ],
            ["GIAM",    "TANG",     "CAO",      "TB",       "CAO" ],
            ["GIAM",    "TANG",     "THAP",     "THAP",     "THAP" ],
            ["GIAM",    "ON DINH",  "CAO",      "TB",       "THAP"  ],
            ["GIAM",    "ON DINH",  "THAP",     "TB",       "CAO"  ]
        ];
    }

    if (index == 3) {
        return [
            ["Outlook",   "Temperature", "Humidity", "Wind",   "Play Tennis"],
            ["Sunny",     "Hot",         "High",     "Weak",   "No"],
            ["Sunny",     "Hot",         "High",     "Strong", "No"],
            ["Overcast",  "Hot",         "High",     "Weak",   "Yes"],
            ["Rain",      "Mild",        "High",     "Weak",   "Yes"],
            ["Rain",      "Cool",        "Normal",   "Weak",   "Yes"],
            ["Rain",      "Cool",        "Normal",   "Strong", "Yes"],
            ["Overcast",  "Cool",        "Normal",   "Strong", "No"],
            ["Sunny",     "Mild",        "High",     "Weak",   "Yes"],
            ["Sunny",     "Cool",        "Normal",   "Weak",   "No"],
            ["Rain",      "Mild",        "Normal",   "Weak",   "Yes"],
            ["Sunny",     "Mild",        "Normal",   "Strong", "Yes"],
            ["Overcast",  "Mild",        "High",     "Strong", "Yes"],
            ["Overcast",  "Hot",         "Normal",   "Weak",   "Yes"],
            ["Rain",      "Mild",        "High",     "Strong", "No"]
        ];
    }

    if (index == 4)
    {
    return [
        ["Toothed",     "Hair",     "Breathes",     "Legs",     "Species"],
        ["Toothed",     "Hair",     "Breathes",     "Legs",     "Mammal"],
        ["Toothed",     "Hair",     "Breathes",     "Legs",     "Mammal"],
        ["Toothed",     "Not Hair", "Breathes",     "Not Legs", "Reptile"],
        ["Not Toothed", "Hair",     "Breathes",     "Legs",     "Mammal"],
        ["Toothed",     "Hair",     "Breathes",     "Legs",     "Mammal"],
        ["Toothed",     "Hair",     "Breathes",     "Legs",     "Mammal"],
        ["Toothed",     "Not Hair", "Not Breathes", "Not Legs", "Reptile"],
        ["Toothed",     "Not Hair", "Breathes",     "Not Legs", "Reptile"],
        ["Toothed",     "Not Hair", "Breathes",     "Legs",     "Mammal"],
        ["Toothed",     "Not Hair", "Breathes",     "Legs",     "Mammal"],
        ["Not Toothed", "Not Hair", "Breathes",     "Legs",     "Mammal"],
    ];
    }
}