import { ArchiveProcessor } from "./processor.js";
import { ArchiveRecord } from "../archive-record.js";
import { ArchiveStorage } from "../storage/storage.js";

class ArchiveProcessorTxt extends ArchiveProcessor {
  static mimeTypes: string[] = ["text/plain"];

  processRecord(record: ArchiveRecord) {
    console.log("ArchiveProcessorTxt.processRecord()", record);

    const recordDataStr = record.data.toString("utf8");

    record.metadata["word-count"] = recordDataStr.trim().split(/\s+/).length;
    record.metadata["line-count"] = recordDataStr.split(/\n/).length;

    record.addTag("mime-type: text/plain");

    return record;
  }
}

export { ArchiveProcessorTxt };
