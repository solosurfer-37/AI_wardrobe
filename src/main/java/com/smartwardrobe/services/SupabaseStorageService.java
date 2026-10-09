package com.smartwardrobe.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

/**
 * SupabaseStorageService
 * ──────────────────────
 * Handles uploading image files to Supabase Storage via its REST API.
 * The service-role key is used only on the backend and is never exposed
 * to the frontend.
 *
 * Storage object path convention:
 *   users/{userId}/clothing/{itemId}/original.{ext}   ← raw upload
 *   users/{userId}/clothing/{itemId}/processed.{ext}  ← after AI tweaks
 *
 * Call uploadImage() with the processed/final image bytes produced by
 * your AI pipeline. The returned object path is what you save to
 * ClothingItem.imagePath in PostgreSQL.
 */
@Service
public class SupabaseStorageService {

    private static final Logger log = LoggerFactory.getLogger(SupabaseStorageService.class);

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service-role-key}")
    private String serviceRoleKey;

    @Value("${supabase.storage.bucket}")
    private String bucket;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    /**
     * Upload a MultipartFile directly to Supabase Storage.
     *
     * @param file       The image file uploaded by the user / produced by AI
     * @param objectPath Relative path in bucket, e.g. "users/1/clothing/5/processed.png"
     * @return           The full public-readable object path saved in the DB
     * @throws IOException if the upload fails
     */
    public String uploadImage(MultipartFile file, String objectPath) throws IOException, InterruptedException {
        byte[] bytes = file.getBytes();
        String contentType = file.getContentType() != null ? file.getContentType() : "image/jpeg";
        return uploadBytes(bytes, contentType, objectPath);
    }

    /**
     * Upload raw image bytes to Supabase Storage.
     * Use this when your AI pipeline returns processed bytes directly.
     *
     * @param imageBytes  The processed image bytes
     * @param contentType MIME type, e.g. "image/png" or "image/jpeg"
     * @param objectPath  Relative path in bucket, e.g. "users/1/clothing/5/processed.png"
     * @return            The stored object path (save this to ClothingItem.imagePath)
     * @throws IOException if upload fails
     */
    public String uploadBytes(byte[] imageBytes, String contentType, String objectPath)
            throws IOException, InterruptedException {

        if (serviceRoleKey == null || serviceRoleKey.isBlank()) {
            throw new IllegalStateException(
                "SUPABASE_SERVICE_ROLE_KEY is not configured. " +
                "Set it in your .env file from: Supabase Dashboard > Settings > API > service_role key"
            );
        }

        String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucket + "/" + objectPath;

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(uploadUrl))
                .header("Authorization", "Bearer " + serviceRoleKey)
                .header("Content-Type", contentType)
                .header("x-upsert", "true") // overwrite if exists
                .PUT(HttpRequest.BodyPublishers.ofByteArray(imageBytes))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            log.error("Supabase Storage upload failed. Status: {}, Body: {}", response.statusCode(), response.body());
            throw new IOException("Supabase Storage upload failed with status " + response.statusCode() + ": " + response.body());
        }

        log.info("Image uploaded to Supabase Storage: bucket={}, path={}", bucket, objectPath);
        return objectPath;
    }

    /**
     * Generate a signed (temporary) URL to display a private image in the UI.
     * Expiry is set to 1 hour (3600 seconds) by default.
     *
     * @param objectPath  The stored path from ClothingItem.imagePath
     * @param expiresInSeconds How long the URL should remain valid
     * @return Signed URL string, or null if generation fails
     */
    public String getSignedUrl(String objectPath, int expiresInSeconds) {
        try {
            String signUrl = supabaseUrl + "/storage/v1/object/sign/" + bucket + "/" + objectPath;
            String body = "{\"expiresIn\":" + expiresInSeconds + "}";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(signUrl))
                    .header("Authorization", "Bearer " + serviceRoleKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                // Extract signedURL from JSON response:  {"signedURL":"..."}
                String responseBody = response.body();
                int idx = responseBody.indexOf("\"signedURL\":\"");
                if (idx != -1) {
                    int start = idx + 13;
                    int end = responseBody.indexOf("\"", start);
                    return supabaseUrl + responseBody.substring(start, end);
                }
            }
        } catch (Exception e) {
            log.warn("Could not generate signed URL for path {}: {}", objectPath, e.getMessage());
        }
        return null;
    }

    /**
     * Build the standard object path for a clothing item image.
     *
     * @param userId    The user's database ID
     * @param itemId    The clothing item's database ID
     * @param filename  e.g. "original.jpg", "processed.png"
     * @return e.g. "users/1/clothing/5/original.jpg"
     */
    public static String buildObjectPath(Long userId, Long itemId, String filename) {
        return "users/" + userId + "/clothing/" + itemId + "/" + filename;
    }
}
