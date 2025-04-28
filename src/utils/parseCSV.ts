import { ParsedCSVType } from "@/db/models";
import Papa from "papaparse";

export const parseCsv = async (
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
  const parsedData = parsed.data as ParsedCSVType[];

  const columns = getColumns(parsedData);

  return { parsedData, columns };
};

const getColumns = (data: any[]): string[] => {
  if (data.length === 0) return [];
  return Object.keys(data[0]);
};

export const getParsedCell = (
  row: ParsedCSVType,
  cols: string[],
  index: number
) => {
  if (index >= 0 && index < cols.length) {
    return Array.isArray(row) ? row[index] : row[cols[index]];
  }
  return undefined;
};
