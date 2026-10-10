import ExcelJS from "exceljs";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { frameworkConfig } from "../src/config/frameworkConfig";

async function createWorkbook(): Promise<void> {
  const output = resolve(process.cwd(), frameworkConfig.testDataFile);
  if (existsSync(output) && !process.argv.includes("--force")) {
    console.log(`Keeping existing Excel test data: ${output}`);
    return;
  }
  await mkdir(dirname(output), { recursive: true });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Scenarios");
  sheet.addRow([
    "id", "username", "password", "searchTerm", "minPrice", "maxPrice",
    "paymentMethod", "fullName", "phone", "pincode", "address"
  ]);
  sheet.addRows([
    ["guest-under-10000", "", "", "mobile", 0, 9999, "", "", "", "", ""],
    ["guest-over-50000", "", "", "mobile", 50001, 1000000, "", "", "", "", ""],
    ["valid-user", "replace-with-test-user", "replace-with-test-password", "mobile", 0, 1000000, "", "", "", "", ""],
    ["invalid-user", "invalid@example.test", "invalid-password", "mobile", 0, 1000000, "", "", "", "", ""],
    ["order-placement", "replace-with-test-user", "replace-with-test-password", "mobile", 0, 1000000, "Cash on Delivery", "Test Customer", "9999999999", "000000", "Test address"]
  ]);
  sheet.getRow(1).font = { bold: true };
  sheet.columns.forEach((column) => {
    column.width = Math.max(14, ...sheet.getColumn(column.number ?? 1).values.map((value) => String(value ?? "").length + 2));
  });
  await workbook.xlsx.writeFile(output);
  console.log(`Created Excel test data: ${output}`);
}

createWorkbook().catch((error: unknown) => {
  console.error("Unable to create test-data workbook", error);
  process.exitCode = 1;
});
