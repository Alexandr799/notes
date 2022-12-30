const html_to_pdf = require("html-pdf-node");
const fs = require("fs").promises;
const path = require("path");

const convertPDF = async (html, id) => {
  const options = { format: "A4" };
  const file = { content: html };
  const pdf = await html_to_pdf.generatePdf(file, options);
  const name = `Заметка # ${id}.pdf`;
  let pathname = path.join(__dirname, "..", "pdf", name);
  await fs.writeFile(pathname, pdf)
  return pathname
};

module.exports = convertPDF;
