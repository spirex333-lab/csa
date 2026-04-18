export function csvToJson(csvText: string): Record<string, string>[] {
  const lines = csvText.trim().split('\n'); // Split by line
  const headers = lines[0].split(',').map((header) => header.trim()); // Extract headers

  return lines.slice(1).map((line) => {
    const values = line.split(',').map((value) => value.trim()); // Extract values
    return Object.fromEntries(
      headers.map((header, index) => [header, values[index] || ''])
    );
  });
}
