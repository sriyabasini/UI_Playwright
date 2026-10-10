import ExcelJS from "exceljs";
import { isAbsolute, resolve } from "node:path";
import { frameworkConfig } from "../config/frameworkConfig";
import type { ScenarioData } from "../models/testData";

const requiredColumns = [
  "id", "username", "password", "searchTerm", "minPrice", "maxPrice",
  "paymentMethod", "fullName", "phone", "pincode", "address"
] as const;

export class TestDataReader {
  private rows?: Map<string, ScenarioData>;

  async getScenario(id: string): Promise<ScenarioData> {
    if (!this.rows) await this.load();
    const row = this.rows?.get(id);
    if (!row) throw new Error(`No test-data row "${id}" was found in ${frameworkConfig.testDataFile}`);
    return row;
  }

  private async load(): Promise<void> {
    const file = isAbsolute(frameworkConfig.testDataFile)
      ? frameworkConfig.testDataFile
      : resolve(process.cwd(), frameworkConfig.testDataFile);
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(file);
    const sheet = workbook.getWorksheet("Scenarios");
    if (!sheet) throw new Error(`Workbook ${file} must contain a "Scenarios" worksheet`);

    const headerRow = sheet.getRow(1);
    const headers = Array.from({ length: headerRow.cellCount }, (_, index) =>
      headerRow.getCell(index + 1).text.trim()
    );
    const missing = requiredColumns.filter((column) => !headers.includes(column));
    if (missing.length > 0) throw new Error(`Test-data worksheet is missing columns: ${missing.join(", ")}`);

    const rows = new Map<string, ScenarioData>();
    for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber += 1) {
      const row = sheet.getRow(rowNumber);
      if (Array.from({ length: row.cellCount }, (_, index) => row.getCell(index + 1).text.trim())
        .every((value) => value === "")) continue;
      const value = (column: typeof requiredColumns[number]): string => {
        return row.getCell(headers.indexOf(column) + 1).text.trim();
      };
      const id = value("id");
      if (!id) throw new Error(`Test-data row ${rowNumber} has no scenario id`);
      if (rows.has(id)) throw new Error(`Duplicate test-data scenario id "${id}"`);
      const minPrice = Number(value("minPrice"));
      const maxPrice = Number(value("maxPrice"));
      if (!Number.isFinite(minPrice) || !Number.isFinite(maxPrice) || minPrice > maxPrice) {
        throw new Error(`Test-data row "${id}" has an invalid price range`);
      }
      rows.set(id, {
        id,
        username: value("username"),
        password: value("password"),
        searchTerm: value("searchTerm"),
        minPrice,
        maxPrice,
        paymentMethod: value("paymentMethod"),
        fullName: value("fullName"),
        phone: value("phone"),
        pincode: value("pincode"),
        address: value("address")
      });
    }
    this.rows = rows;
  }
}
