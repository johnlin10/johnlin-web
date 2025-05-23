"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageInfoService = void 0;
const admin = require("firebase-admin");
const SITE_CONFIG = {
    siteName: '林昌龍',
    defaultImageUrl: 'https://johnlin.me/assets/images/johnlin.jpeg',
    defaultDescription: '網頁設計師｜前端開發者',
    baseUrl: 'https://johnlin.me',
};
/**
 * 頁面資訊服務類別
 */
class PageInfoService {
    constructor() {
        this.db = admin.firestore();
    }
    /**
     * 根據路徑獲取頁面資訊
     * @param path URL 路徑（不含域名）
     * @returns 頁面資訊
     */
    async getPageInfo(path) {
        // 預設頁面資訊
        const defaultPageInfo = {
            title: SITE_CONFIG.siteName,
            description: SITE_CONFIG.defaultDescription,
            imageUrl: SITE_CONFIG.defaultImageUrl,
            url: `${SITE_CONFIG.baseUrl}${path}`,
            type: 'website',
            siteName: SITE_CONFIG.siteName,
            locale: 'zh_TW',
        };
        try {
            if (path === '/' || path === '') {
                return defaultPageInfo;
            }
            const segments = path.split('/').filter(Boolean);
            //* lab
            if (segments[0] === 'lab' && segments.length === 1) {
                return {
                    title: `實驗室 | ${SITE_CONFIG.siteName}`,
                    description: '這裡是我的實驗空間，用來放一些有趣的嘗試和實用的工具。',
                    imageUrl: '',
                    url: `${SITE_CONFIG.baseUrl}/lab`,
                    type: 'website',
                    siteName: SITE_CONFIG.siteName,
                };
            }
            //* shortcut
            if (segments[0] === 'shortcut' && segments.length === 1) {
                return {
                    title: `網址縮短器 | ${SITE_CONFIG.siteName}`,
                    description: '將長網址轉換成短網址',
                    imageUrl: SITE_CONFIG.defaultImageUrl,
                    url: `${SITE_CONFIG.baseUrl}/shortcut`,
                    type: 'website',
                    siteName: SITE_CONFIG.siteName,
                };
            }
            //* blog
            if (segments[0] === 'blog' && segments.length > 1) {
                const blogData = await this._getBlogData(segments[1]);
                if (blogData) {
                    return this._createBlogPageInfo(blogData, defaultPageInfo);
                }
            }
            return defaultPageInfo;
        }
        catch (error) {
            console.error('獲取頁面資訊失敗:', error);
            return defaultPageInfo;
        }
    }
    /**
     * 獲取部落格資料
     * @private
     */
    async _getBlogData(postId) {
        const postDoc = await this.db.collection('blogs').doc(postId).get();
        return postDoc.exists ? postDoc.data() : null;
    }
    /**
     * 創建部落格頁面資訊
     * @private
     */
    _createBlogPageInfo(blogData, defaultPageInfo) {
        var _a;
        return {
            title: `${(blogData === null || blogData === void 0 ? void 0 : blogData.title) || '文章'} | ${SITE_CONFIG.siteName}`,
            description: (blogData === null || blogData === void 0 ? void 0 : blogData.excerpt) ||
                ((_a = blogData === null || blogData === void 0 ? void 0 : blogData.content) === null || _a === void 0 ? void 0 : _a.substring(0, 160)) ||
                defaultPageInfo.description,
            imageUrl: (blogData === null || blogData === void 0 ? void 0 : blogData.featuredImage) || defaultPageInfo.imageUrl,
            url: defaultPageInfo.url,
            type: 'article',
            siteName: SITE_CONFIG.siteName,
            locale: 'zh_TW',
        };
    }
}
exports.PageInfoService = PageInfoService;
//# sourceMappingURL=pageMetadata.js.map