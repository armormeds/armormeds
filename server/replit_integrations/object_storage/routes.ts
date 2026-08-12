import express from "express";
import type { Express } from "express";
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
   * POST /api/uploads/file
   *   Content-Type: <file mime type>
   *   Query params: name (filename), contentType (mime type)
   *   Body: raw file bytes
   *
   * The browser sends the file as a raw body; the server writes it to GCS using
   * Application Default Credentials, then returns { objectPath, metadata }.
   * Requires GCS_UPLOAD_BUCKET env var on Cloud Run.
   */
  app.post(
    "/api/uploads/file",
    express.raw({ type: "*/*", limit: "15mb" }),
    async (req, res) => {
      try {
        const fileName = (req.query.name as string) || "upload";
        const contentType =
          (req.query.contentType as string) ||
          req.get("Content-Type") ||
          "application/octet-stream";

        const buffer = req.body as Buffer;
        if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
          return res.status(400).json({ error: "No file data received" });
        }

        const { objectPath } = await objectStorageService.uploadBufferToGCS(
          buffer,
          contentType
        );

        res.json({
          objectPath,
          metadata: { name: fileName, size: buffer.length, contentType },
        });
      } catch (err) {
        console.error("Error uploading file to GCS:", err);
        res.status(500).json({ error: "Failed to upload file" });
      }
    }
  );

  /**
   * GET /api/object-storage/download?path=<objectPath>
   *
   * Used by the admin UI to download/view uploaded files.
   * Accepts the objectPath as a query param (e.g. /objects/uploads/<uuid>).
   */
  app.get("/api/object-storage/download", async (req, res) => {
    try {
      const path = req.query.path as string;
      if (!path) {
        return res.status(400).json({ error: "Missing path query parameter" });
      }
      const objectFile = await objectStorageService.getObjectEntityFile(path);
      await objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error serving object via download route:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.status(404).json({ error: "Object not found" });
      }
      return res.status(500).json({ error: "Failed to serve object" });
    }
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

