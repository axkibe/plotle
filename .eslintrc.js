module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "CHECK": true,
        "DEVEL": true,
        "FREEZE": true,
        "NODE": true,
        "TIM": true,
        "WEINRE": true,
        "opentype": true,
        "pass": true,
        "root": true,
        "system": true,
        "tim": true
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
        "eol-last": "error",
        "indent": [
            "off",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "no-console": "off",
        "no-trailing-spaces": "error",
        "no-unused-vars": [
            "error",
            {
                "args" : "none"
            },
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
