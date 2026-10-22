const fs = require('node:fs');
const path = require('node:path');
const root = path.dirname(require.resolve('@fortawesome/fontawesome-free/package.json'));
hexo.extend.generator.register('local-icons', () => {
  const files = ['css/all.min.css', ...fs.readdirSync(path.join(root, 'webfonts')).map(file => 'webfonts/' + file)];
  return files.map(file => ({ path: 'lib/fontawesome/' + file, data: () => fs.createReadStream(path.join(root, file)) }));
});
