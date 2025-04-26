import Papa from "papaparse";

export type ParsedCSVType = string[] | { [key: string]: string };
export const parseCsv = (
  csvString: string,
  header: boolean,
  delimiter: string,
  comments: string
) => {
  const parsed = Papa.parse(csvString, {
    skipEmptyLines: true,
    header: header,
    delimiter: delimiter,
    comments: comments,
  });
  return parsed.data as ParsedCSVType[];
};

export const getParsedCell = (
  row: ParsedCSVType,
  cols: string[],
  index: number
) => {
  if(index >= 0 && index < cols.length) {
    return Array.isArray(row) ? row[index] : row[cols[index]];
  }
  return undefined;
};
