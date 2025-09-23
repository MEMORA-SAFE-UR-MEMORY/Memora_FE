module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@app": "./app",
            "@src": "./src",
            "@components": "./src/components",
            "@store": "./src/store",
            "@lib": "./src/lib",
            "@theme": "./src/theme",
            "@utils": "./src/utils",
          },
        },
      ],
       "react-native-worklets/plugin",
    ],
  };
};
