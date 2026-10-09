package com.smartwardrobe.dto;

import java.util.List;

public class ReceiptOcrResponse {
    private String store;
    private double price;
    private String purchaseDate;
    private List<String> itemsDetected;

    public ReceiptOcrResponse() {
    }

    public ReceiptOcrResponse(String store, double price, String purchaseDate, List<String> itemsDetected) {
        this.store = store;
        this.price = price;
        this.purchaseDate = purchaseDate;
        this.itemsDetected = itemsDetected;
    }

    public String getStore() {
        return store;
    }

    public void setStore(String store) {
        this.store = store;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(String purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public List<String> getItemsDetected() {
        return itemsDetected;
    }

    public void setItemsDetected(List<String> itemsDetected) {
        this.itemsDetected = itemsDetected;
    }
}
