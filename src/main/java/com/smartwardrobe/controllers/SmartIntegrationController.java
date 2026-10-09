package com.smartwardrobe.controllers;

import com.smartwardrobe.dto.CalendarEventResponse;
import com.smartwardrobe.dto.ReceiptOcrResponse;
import com.smartwardrobe.dto.VisionAnalysisResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

/**
 * Mocks advanced AI and external integrations for hackathon judging purposes.
 * Demonstrates the system architecture and data contracts.
 */
@RestController
@RequestMapping("/api")
public class SmartIntegrationController {

    @GetMapping("/vision/analyze-image")
    public ResponseEntity<VisionAnalysisResponse> mockVisionAnalysis() {
        VisionAnalysisResponse response = new VisionAnalysisResponse(
                List.of("jacket", "leather", "outerwear", "biker", "black"),
                "black",
                "jacket",
                0.982
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/ocr/parse-receipt")
    public ResponseEntity<ReceiptOcrResponse> mockOcrReceipt() {
        ReceiptOcrResponse response = new ReceiptOcrResponse(
                "Zara",
                89.99,
                LocalDate.now().toString(),
                List.of("Faux Leather Biker Jacket - BLK")
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/calendar/today-events")
    public ResponseEntity<CalendarEventResponse> mockCalendarEvent() {
        CalendarEventResponse response = new CalendarEventResponse(
                "Q4 Client Pitch",
                "Business Meeting",
                "Formal",
                "14:00 PM"
        );
        return ResponseEntity.ok(response);
    }
}
