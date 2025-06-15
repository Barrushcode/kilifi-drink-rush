
// Utility to download the CSV of products missing an image in refinedproductimages
export async function downloadMissingImagesCSV() {
  try {
    const url = "https://tyfsxboxshbkdetweuke.functions.supabase.co/products-missing-images";
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) {
      alert("Failed to generate CSV: " + await res.text());
      return;
    }
    const blob = await res.blob();
    const urlObj = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = urlObj;
    a.download = "products-missing-images.csv";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(urlObj);
    }, 100);
  } catch (err) {
    alert("Error downloading missing images CSV: " + (err as Error).message);
  }
}
