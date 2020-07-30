const { explore } = require('source-map-explorer');

const sum = (a, b) => a + b;

explore('./build/static/js/*.js', {
  output: { format: 'json' },
  gzip: false
}).then(result => {
  // const totalBytes = result.bundles.map(e => e.totalBytes).reduce(sum, 0);
  // const totalKilloByes = totalBytes / 1000;
  // console.log(totalKilloByes);

  const totalBytesFromNodeModules = result.bundles
    .map(e =>
      Object.entries(e.files)
        .filter(([fileName]) => fileName.includes('node_modules'))
        .map(([, fileData]) => fileData.size)
        .reduce(sum, 0)
    )
    .reduce(sum, 0);

  const totalKbFromNodeModules = totalBytesFromNodeModules / 1000;

  console.log('total file sizes from node_modules: ');
  console.log(`\`${totalKbFromNodeModules}\` kb`);
});
