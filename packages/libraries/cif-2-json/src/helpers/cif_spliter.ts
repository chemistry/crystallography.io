export function splitDataBloks(lines: string[]) {
  lines.reverse();
  let currentDataBlok = '';
  const result = Object.create(null);

  while (lines.length > 0) {
    const popped = lines.pop();
    if (!popped) {
      continue;
    }
    const line = popped.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    // start from data blok - then change it
    if (
      line.startsWith('data_') ||
      line.startsWith('DATA_') ||
      line.startsWith('global_') ||
      line.startsWith('GLOBAL_')
    ) {
      currentDataBlok = line.trim();
      result[currentDataBlok] = [];
    }

    if (currentDataBlok) {
      result[currentDataBlok].push(line);
    }
  }

  return result;
}
