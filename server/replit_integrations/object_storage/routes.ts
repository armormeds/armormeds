import type { Express, Request, Response } from "express";
import busboy from "busboy";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";

/**
 * Register object storage routes for file uploads.
 *
 * This provides example routes for the presigned URL upload flow:
 * 1. POST /api/uploads/request-url - Get a presigned URL for uploading
 * 2. The client then uploads directly to the presigned URL
 *
 * IMPORTANT: These are example routes. Customize based on your use case:
 * - Add authentication middleware for protected uploads
 * - Add file metadata storage (save to database after upload)
 * - Add ACL policies for access control
 */
export function registerObjectStorageRoutes(app: Express): void {
  const objectStorageService = new ObjectStorageService();

  /**
   * Request a presigned URL for file upload.
   *
   * Request body (JSON):
   * {
   *   "name": "filename.jpg",
   *   "size": 12345,
   *   "contentType": "image/jpeg"
   * }
   *
   * Response:
   * {
   *   "uploadURL": "https://storage.googleapis.com/...",
   *   "objectPath": "/objects/uploads/uuid"
   * }
   *
   * IMPORTANT: The client should NOT send the file to this endpoint.
   * Send JSON metadata only, then upload the file directly to uploadURL.
   */
  app.post("/api/uploads/request-url", async (req, res) => {
    try {
      const { name, size, contentType } = req.body;

      if (!name) {
        return res.status(400).json({
          error: "Missing required field: name",
        });
      }

      const uploadURL = await objectStorageService.getObjectEntityUploadURL();

      // Extract object path from the presigned URL for later reference
      const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);

      res.json({
        uploadURL,
        objectPath,
        // Echo back the metadata for client convenience
        metadata: { name, size, contentType },
      });
    } catch (error) {
      console.error("Error generating upload URL:", error);
      res.status(500).json({ error: "Failed to generate upload URL" });
    }
  });

  /**
   * Proxy file upload — works on Cloud Run (no Replit sidecar needed).
   *
   * POST /api/uploads/file  (multipart/form-data, field name "file")
   *
   * The browser sends the actual file here; the server writes it to GCS using
   * Application Default Credentials, then returns { objectPath, metadata }.
   * Requires GCS_UPLOAD_BUCKET env var on Cloud Run.
   */
  app.post("/api/uploads/file", (req: Request, res: Response) => {
    const MAX_BYTES = 15 * 1024 * 1024;
    let received = 0;
    let finished = false;

    const bb = busboy({ headers: req.headers, limits: { fileSize: MAX_BYTES } });

    bb.on("file", (fieldname, stream, info) => {
      const { filename, mimeType } = info;
      const chunks: Buffer[] = [];

      stream.on("data", (chunk: Buffer) => {
        received += chunk.length;
        chunks.push(chunk);
      });

      stream.on("limit", () => {
        if (!finished) {
          finished = true;
          res.status(413).json({ error: "File too large (max 15 MB)" });
        }
      });

      stream.on("end", async () => {
        if (finished) return;
        finished = true;
        try {
          const buffer = Buffer.concat(chunks);
          const { objectPath } = await objectStorageService.uploadBufferToGCS(
            buffer,
            mimeType || "application/octet-stream"
          );
          res.json({
            objectPath,
            metadata: { name: filename, size: received, contentType: mimeType },
          });
        } catch (err) {
          console.error("Error uploading file to GCS:", err);
          res.status(500).json({ error: "Failed to upload file" });
        }
      });
    });

    bb.on("error", (err: Error) => {
      if (!finished) {
        finished = true;
        console.error("Busboy error:", err);
        res.status(500).json({ error: "Failed to parse upload" });
      }
    });

    req.pipe(bb);
  });

  /**
   * Serve uploaded objects.
   *
   * GET /objects/:objectPath(*)
   *
   * This serves files from object storage. For public files, no auth needed.
   * For protected files, add authentication middleware and ACL checks.
   */
  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      await objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error serving object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.status(404).json({ error: "Object not found" });
      }
      return res.status(500).json({ error: "Failed to serve object" });
    }
  });
}

