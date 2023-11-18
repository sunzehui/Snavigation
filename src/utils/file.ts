interface JsonData {
  [key: string]: any;
}

export const downloadJSON = (jsonData: JsonData, fileName?: string): void => {
  const jsonString = JSON.stringify(jsonData);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName || "download.json";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
