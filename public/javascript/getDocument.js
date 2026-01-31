const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");

async function loadAndSplitPDF(filePath) {
  const loader = new PDFLoader(filePath);
  
  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1500,
    chunkOverlap: 200,
  });

  const chunks = await splitter.splitDocuments(docs);

  let documents = chunks.map((doc) => doc.pageContent);
  return documents
}

module.exports = loadAndSplitPDF;