/**
 * app.js - Main application entry point
 */

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Show loading overlay
        UIManager.showLoading();
        
        // Initialize data manager
        await DataManager.init();
        
        // Initialize analytics manager
        await AnalyticsManager.init();
        
        // Initialize UI manager
        await UIManager.init();
        
        // Hide loading overlay
        UIManager.hideLoading();
        
        console.log('RoV Draft Helper initialized successfully!');
    } catch (error) {
        console.error('Error initializing application:', error);
        alert('เกิดข้อผิดพลาดในการโหลดแอปพลิเคชัน กรุณาลองใหม่อีกครั้ง');
    }
});