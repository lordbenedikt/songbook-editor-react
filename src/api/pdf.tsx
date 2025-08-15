export async function downloadPdfFromHtml(html: string, fileName = 'document.pdf') {
    try {
        const response = await fetch('http://localhost:3001/generate-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ html }),
        });

        if (!response.ok) {
            throw new Error(`Failed to generate PDF: ${response.statusText}`);
        }

        const pdfBlob = await response.blob();

        // Trigger browser download
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error(err);
        alert(err + 'Error generating PDF');
    }
}