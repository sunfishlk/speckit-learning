// Beauty Rating App - JavaScript Implementation
class BeautyRatingApp {
    constructor() {
        this.currentSection = 'upload-section';
        this.uploadedImage = null;
        this.analysisResult = null;
        this.initializeEventListeners();
        this.initializeCelebrityData();
        this.initializeDisplay();
    }

    initializeEventListeners() {
        // Photo upload functionality
        const uploadArea = document.getElementById('upload-area');
        const photoInput = document.getElementById('photo-input');
        const previewContainer = document.getElementById('preview-container');
        const previewImage = document.getElementById('preview-image');

        // Upload area click and drag handlers
        uploadArea.addEventListener('click', () => photoInput.click());
        uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        uploadArea.addEventListener('drop', this.handleDrop.bind(this));

        // File input change
        photoInput.addEventListener('change', this.handleFileSelect.bind(this));

        // Button event listeners
        document.getElementById('analyze-btn').addEventListener('click', this.startAnalysis.bind(this));
        document.getElementById('reset-btn').addEventListener('click', this.resetUpload.bind(this));
        document.getElementById('retry-btn').addEventListener('click', this.resetUpload.bind(this));

        // Navigation buttons
        document.getElementById('view-details-btn').addEventListener('click', () => this.showSection('details-section'));
        document.getElementById('new-analysis-btn').addEventListener('click', this.resetApp.bind(this));
        document.getElementById('back-to-results').addEventListener('click', () => this.showSection('results-section'));
        document.getElementById('view-recommendations-btn').addEventListener('click', () => this.showSection('recommendations-section'));
        document.getElementById('back-to-details').addEventListener('click', () => this.showSection('details-section'));
        document.getElementById('start-over-btn').addEventListener('click', this.resetApp.bind(this));
        document.getElementById('share-results-btn').addEventListener('click', this.shareResults.bind(this));

        // Tab functionality for recommendations
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', this.switchTab.bind(this));
        });
    }

    initializeCelebrityData() {
        this.celebrities = {
            '81-100': [
                { name: '刘亦菲', score: 95, emoji: '👑' },
                { name: '赵丽颖', score: 92, emoji: '✨' },
                { name: '杨幂', score: 89, emoji: '💎' },
                { name: '迪丽热巴', score: 94, emoji: '🌟' },
                { name: '范冰冰', score: 91, emoji: '👸' }
            ],
            '61-80': [
                { name: '周冬雨', score: 78, emoji: '🎭' },
                { name: '马思纯', score: 75, emoji: '🎨' },
                { name: '宋茜', score: 79, emoji: '🎪' },
                { name: '关晓彤', score: 73, emoji: '🎯' },
                { name: '欧阳娜娜', score: 76, emoji: '🎵' }
            ],
            '41-60': [
                { name: '贾玲', score: 58, emoji: '😊' },
                { name: '沈腾', score: 55, emoji: '😄' },
                { name: '马丽', score: 59, emoji: '😆' },
                { name: '王祖蓝', score: 52, emoji: '🤗' },
                { name: '岳云鹏', score: 54, emoji: '😂' }
            ],
            '21-40': [
                { name: '路人甲', score: 35, emoji: '😐' },
                { name: '路人乙', score: 38, emoji: '😑' },
                { name: '路人丙', score: 32, emoji: '😶' },
                { name: '路人丁', score: 39, emoji: '🙂' },
                { name: '路人戊', score: 36, emoji: '😊' }
            ],
            '1-20': [
                { name: '需要努力', score: 15, emoji: '💪' },
                { name: '加油改善', score: 18, emoji: '🌱' },
                { name: '潜力巨大', score: 12, emoji: '📈' },
                { name: '未来可期', score: 19, emoji: '🔮' },
                { name: '相信自己', score: 16, emoji: '⭐' }
            ]
        };
    }

    initializeDisplay() {
        // Ensure the upload section is shown on initial load
        this.showSection('upload-section');
        console.log('Initial display setup completed');
    }

    handleDragOver(e) {
        e.preventDefault();
        document.getElementById('upload-area').classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        document.getElementById('upload-area').classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        document.getElementById('upload-area').classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    processFile(file) {
        // Validate file type and size
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!validTypes.includes(file.type)) {
            this.showError('文件格式不支持', '请上传 JPG、PNG 或 WebP 格式的图片');
            return;
        }

        if (file.size > maxSize) {
            this.showError('文件过大', '图片大小不能超过 10MB，请压缩后重试');
            return;
        }

        // Check if it's a valid image and potentially contains a face
        this.validateImage(file);
    }

    validateImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                // Basic image validation
                if (img.width < 200 || img.height < 200) {
                    this.showError('图片分辨率过低', '请上传至少 200x200 像素的清晰图片');
                    return;
                }

                // Simulate face detection (in real app, this would call an AI API)
                const hasFace = this.simulateFaceDetection();
                if (!hasFace) {
                    this.showError('未检测到人脸', '请上传包含清晰人脸的正面照片，确保光线充足且面部清晰可见');
                    return;
                }

                this.uploadedImage = e.target.result;
                this.showPreview();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    simulateFaceDetection() {
        // Simulate 95% success rate for face detection
        return Math.random() > 0.05;
    }

    showPreview() {
        const previewImage = document.getElementById('preview-image');
        const previewContainer = document.getElementById('preview-container');
        const uploadArea = document.getElementById('upload-area');

        previewImage.src = this.uploadedImage;
        uploadArea.style.display = 'none';
        previewContainer.classList.remove('hidden');
        this.hideError();
    }

    startAnalysis() {
        this.showSection('upload-section');
        document.getElementById('preview-container').style.display = 'none';
        document.getElementById('loading-section').classList.remove('hidden');

        // Simulate AI analysis with progress
        this.simulateAnalysis();
    }

    simulateAnalysis() {
        const progressFill = document.getElementById('progress-fill');
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress > 100) progress = 100;

            progressFill.style.width = progress + '%';

            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    this.completeAnalysis();
                }, 500);
            }
        }, 200);
    }

    completeAnalysis() {
        // Generate mock analysis results
        this.analysisResult = this.generateAnalysisResult();

        // Hide loading section first
        document.getElementById('loading-section').classList.add('hidden');

        // Display results and then show results section
        this.displayResults();
        this.showSection('results-section');

        // Debug logging
        console.log('Analysis completed, showing results section');
        console.log('Analysis result:', this.analysisResult);
    }

    generateAnalysisResult() {
        // Generate realistic beauty score with some randomness
        const baseScore = 60 + Math.random() * 35; // 60-95 range
        const score = Math.round(baseScore);

        const features = {
            symmetry: Math.max(50, score + (Math.random() - 0.5) * 20),
            proportions: Math.max(50, score + (Math.random() - 0.5) * 15),
            skinQuality: Math.max(50, score + (Math.random() - 0.5) * 18),
            eyeFeatures: Math.max(50, score + (Math.random() - 0.5) * 12)
        };

        return {
            score: score,
            category: this.getScoreCategory(score),
            description: this.getScoreDescription(score),
            features: features,
            celebrityRange: this.getCelebrityRange(score)
        };
    }

    getScoreCategory(score) {
        if (score >= 90) return '绝世美颜';
        if (score >= 80) return '颜值出众';
        if (score >= 70) return '清秀佳人';
        if (score >= 60) return '端庄秀丽';
        if (score >= 50) return '朴实自然';
        if (score >= 40) return '需要改善';
        return '潜力无限';
    }

    getScoreDescription(score) {
        if (score >= 90) return '你拥有令人惊艳的美貌，面部比例完美，五官精致立体';
        if (score >= 80) return '你拥有很好的面部比例和五官协调性，整体效果出众';
        if (score >= 70) return '你的五官清秀，面部轮廓较好，给人舒适的感觉';
        if (score >= 60) return '你的容貌端庄秀气，五官比较协调，有自然美感';
        if (score >= 50) return '你有朴实自然的美感，通过适当的打扮能提升不少';
        if (score >= 40) return '你有很大的提升空间，通过护肤和妆容能有明显改善';
        return '每个人都有自己的美，相信自己并持续改善';
    }

    getCelebrityRange(score) {
        if (score >= 81) return '81-100';
        if (score >= 61) return '61-80';
        if (score >= 41) return '41-60';
        if (score >= 21) return '21-40';
        return '1-20';
    }

    displayResults() {
        const result = this.analysisResult;

        console.log('Displaying results:', result);

        // Update score display
        document.getElementById('score-number').textContent = result.score;
        document.getElementById('rating-category').textContent = result.category;
        document.getElementById('rating-description').textContent = result.description;

        // Update feature analysis
        this.updateFeatureScores(result.features);

        // Update celebrity comparisons
        this.displayCelebrityComparisons(result.celebrityRange);

        console.log('Results display completed');
    }

    updateFeatureScores(features) {
        const featureItems = document.querySelectorAll('.feature-item');
        const featureNames = ['symmetry', 'proportions', 'skinQuality', 'eyeFeatures'];

        featureItems.forEach((item, index) => {
            if (index < featureNames.length) {
                const score = Math.round(features[featureNames[index]]);
                const fill = item.querySelector('.feature-fill');
                const scoreElement = item.querySelector('.feature-score');

                // Animate the progress bar
                setTimeout(() => {
                    fill.style.width = score + '%';
                    scoreElement.textContent = score + '分';
                }, index * 200);
            }
        });
    }

    displayCelebrityComparisons(range) {
        const celebrityGrid = document.getElementById('celebrity-grid');
        const celebrities = this.celebrities[range] || [];

        celebrityGrid.innerHTML = '';

        celebrities.forEach((celebrity, index) => {
            const card = document.createElement('div');
            card.className = 'celebrity-card';
            card.innerHTML = `
                <div class="celebrity-image">${celebrity.emoji}</div>
                <div class="celebrity-name">${celebrity.name}</div>
                <div class="celebrity-score">${celebrity.score}分</div>
            `;

            // Add staggered animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            celebrityGrid.appendChild(card);

            setTimeout(() => {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    switchTab(e) {
        const tabBtn = e.target;
        const tabName = tabBtn.dataset.tab;

        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        tabBtn.classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName + '-content').classList.add('active');
    }

    showSection(sectionId) {
        console.log('Switching to section:', sectionId);

        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
            section.classList.add('hidden');
            console.log('Removed active from:', section.id);
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.classList.remove('hidden'); // Remove hidden class
            console.log('Added active to:', sectionId);
        } else {
            console.error('Section not found:', sectionId);
        }

        this.currentSection = sectionId;

        // Scroll to top on mobile
        window.scrollTo(0, 0);
    }

    showError(title, message) {
        document.getElementById('error-title').textContent = title;
        document.getElementById('error-message').textContent = message;
        document.getElementById('error-section').classList.remove('hidden');
        document.getElementById('upload-area').style.display = 'none';
        document.getElementById('preview-container').classList.add('hidden');
    }

    hideError() {
        document.getElementById('error-section').classList.add('hidden');
    }

    resetUpload() {
        document.getElementById('photo-input').value = '';
        document.getElementById('upload-area').style.display = 'block';
        document.getElementById('preview-container').classList.add('hidden');
        this.hideError();
        this.uploadedImage = null;
    }

    resetApp() {
        this.resetUpload();
        document.getElementById('loading-section').classList.add('hidden');
        document.getElementById('progress-fill').style.width = '0%';
        this.analysisResult = null;
        this.showSection('upload-section');
    }

    shareResults() {
        if (this.analysisResult) {
            const shareText = `我在颜值测试中获得了 ${this.analysisResult.score} 分！${this.analysisResult.category} ✨`;

            if (navigator.share) {
                navigator.share({
                    title: '颜值测试结果',
                    text: shareText,
                    url: window.location.href
                });
            } else {
                // Fallback for browsers that don't support Web Share API
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(shareText + ' - ' + window.location.href);
                    alert('结果已复制到剪贴板！');
                } else {
                    alert('分享功能需要在 HTTPS 环境下使用');
                }
            }
        }
    }

    // Accessibility features
    handleKeyboardNavigation(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.target.click();
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new BeautyRatingApp();

    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.classList.contains('upload-area')) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.target.click();
            }
        }
    });

    // Add touch support enhancements
    document.addEventListener('touchstart', () => {}, { passive: true });

    // Performance monitoring
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            // Could register a service worker here for offline capability
        });
    }

    // Accessibility announcements
    const announceToScreenReader = (message) => {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.textContent = message;
        document.body.appendChild(announcement);

        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    };

    // Network status handling
    window.addEventListener('online', () => {
        announceToScreenReader('网络连接已恢复');
    });

    window.addEventListener('offline', () => {
        announceToScreenReader('网络连接已断开，部分功能可能无法使用');
    });
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    // In a real app, this would report to an error tracking service
});

// Performance measurement
window.addEventListener('load', () => {
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);

        // Check if it meets our 3-second target
        if (loadTime > 3000) {
            console.warn('Page load time exceeds 3-second target');
        }
    }
});