export type MockExistingLine = {
  id: string;
  number: string;
  tariff: string;
  expires: string;
};

// Mock data - zamijeni s pravim podacima iz API-ja
export const mockExistingLines: MockExistingLine[] = [
  { id: "line-1", number: "385912345678", tariff: "Biz M", expires: "15.12.2025" },
  { id: "line-2", number: "385918765432", tariff: "Biz S", expires: "20.01.2026" },
  { id: "line-3", number: "385915551234", tariff: "Biz L Global", expires: "05.03.2026" },
];

export const findExistingLineNumber = (id: string | undefined) => {
  if (!id) return undefined;
  return mockExistingLines.find((l) => l.id === id)?.number;
};
