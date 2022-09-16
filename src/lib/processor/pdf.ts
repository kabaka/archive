import { ComputerVisionClient } from "@azure/cognitiveservices-computervision";
import { ApiKeyCredentials } from "@azure/ms-rest-js";

import { ArchiveProcessor } from "./processor.js";
import { ArchiveRecord } from "../archive-record.js";
import { ArchiveStorage } from "../storage/storage.js";

import { config } from "../../config.js";

class ArchiveProcessorPdf extends ArchiveProcessor {
  static mimeTypes: string[] = ["application/pdf"];

  computerVisionClient;

  constructor() {
    super();

    this.computerVisionClient = new ComputerVisionClient(
      new ApiKeyCredentials({
        inHeader: {
          "Ocp-Apim-Subscription-Key": config.azureComputerVision.key,
        },
      }),
      config.azureComputerVision.endpoint
    );
  }

  processRecord(record: ArchiveRecord) {
    console.log("ArchiveProcessorPdf.processRecord()", record);
    return record;
  }
}

export { ArchiveProcessorPdf };

/*
function computerVision() {
  async.series([
    async function () {

      // URL images containing printed and/or handwritten text. 
      // The URL can point to image files (.jpg/.png/.bmp) or multi-page files (.pdf, .tiff).
      const printedTextSampleURL = 'https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/ComputerVision/Images/printed_text.jpg';

      // Recognize text in printed image from a URL
      console.log('Read printed text from URL...', printedTextSampleURL.split('/').pop());
      const printedResult = await readTextFromURL(computerVisionClient, printedTextSampleURL);
      printRecText(printedResult);

      // Perform read and await the result from URL
      async function readTextFromURL(client, url) {
        // To recognize text in a local image, replace client.read() with readTextInStream() as shown:
        let result = await client.read(url);
        // Operation ID is last path segment of operationLocation (a URL)
        let operation = result.operationLocation.split('/').slice(-1)[0];

        // Wait for read recognition to complete
        // result.status is initially undefined, since it's the result of read
        while (result.status !== "succeeded") { await sleep(1000); result = await client.getReadResult(operation); }
        return result.analyzeResult.readResults; // Return the first page of result. Replace [0] with the desired page if this is a multi-page file such as .pdf or .tiff.
      }

      // Prints all text from Read result
      function printRecText(readResults) {
        console.log('Recognized text:');
        for (const page in readResults) {
          if (readResults.length > 1) {
            console.log(`==== Page: ${page}`);
          }
          const result = readResults[page];
          if (result.lines.length) {
            for (const line of result.lines) {
              console.log(line.words.map(w => w.text).join(' '));
            }
          }
          else { console.log('No recognized text.'); }
        }
      }


      console.log();
      console.log('-------------------------------------------------');
      console.log('End of quickstart.');

    },
    function () {
      return new Promise((resolve) => {
        resolve();
      })
    }
  ], (err) => {
    throw (err);
  });
}

computerVision();*/
