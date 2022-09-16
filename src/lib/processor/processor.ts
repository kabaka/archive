import { ArchiveRecord } from "../archive-record.js";
import { ArchiveStorage } from "../storage/storage.js";

class ArchiveProcessor {
  mimeTypes: string[];

  processRecord(record: ArchiveRecord): ArchiveRecord {
    throw "processRecord() not implemented for this processor";
  }
}

export { ArchiveProcessor };
