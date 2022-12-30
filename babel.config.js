module.exports = (api) => {
  api.cache(true);

  return {
    presets: [
      [
        "@babel/env",
        {
          targets: { browsers: ["last 2 versions, > 1%, not dead"] },
          useBuiltIns: "usage",
          corejs: 3,
        },
      ],
    ],
    plugins: [["@babel/transform-runtime", { regenerator: true }]],
  };
};
