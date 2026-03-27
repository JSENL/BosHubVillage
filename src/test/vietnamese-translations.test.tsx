import { describe, it, expect, beforeEach } from "vitest";
import i18n from "@/i18n/config";

describe("Vietnamese Translations", () => {
  beforeEach(() => {
    i18n.changeLanguage("vi");
  });

  describe("Navigation translations", () => {
    it("should have Vietnamese translation for backToHome", () => {
      expect(i18n.t("navigation.backToHome")).toBe("Về Trang Chủ");
    });

    it("should have Vietnamese translation for news", () => {
      expect(i18n.t("navigation.news")).toBe("Văn Hóa");
    });

    it("should have Vietnamese translation for submit", () => {
      expect(i18n.t("navigation.submit")).toBe("Gửi");
    });

    it("should have Vietnamese translation for submitEvent", () => {
      expect(i18n.t("navigation.submitEvent")).toBe("Gửi Sự Kiện");
    });

    it("should have Vietnamese translation for submitBusiness", () => {
      expect(i18n.t("navigation.submitBusiness")).toBe("Gửi Doanh Nghiệp");
    });

    it("should have Vietnamese translation for signIn", () => {
      expect(i18n.t("navigation.signIn")).toBe("Đăng Nhập");
    });

    it("should have Vietnamese translation for signOut", () => {
      expect(i18n.t("navigation.signOut")).toBe("Đăng Xuất");
    });
  });

  describe("Card translations", () => {
    it("should have Vietnamese translation for viewDetails", () => {
      expect(i18n.t("cards.viewDetails")).toBe("Xem Chi Tiết");
    });

    it("should have Vietnamese translation for free", () => {
      expect(i18n.t("cards.free")).toBe("Miễn Phí");
    });

    it("should have Vietnamese translation for location", () => {
      expect(i18n.t("cards.location")).toBe("Vị Trí");
    });

    it("should have Vietnamese translation for date", () => {
      expect(i18n.t("cards.date")).toBe("Ngày");
    });

    it("should have Vietnamese translation for time", () => {
      expect(i18n.t("cards.time")).toBe("Thời Gian");
    });

    it("should have Vietnamese translation for price", () => {
      expect(i18n.t("cards.price")).toBe("Giá");
    });
  });

  describe("Item types translations", () => {
    it("should have Vietnamese translation for events", () => {
      expect(i18n.t("itemTypes.events")).toBe("Sự Kiện");
    });

    it("should have Vietnamese translation for news", () => {
      expect(i18n.t("itemTypes.news")).toBe("Văn Hóa");
    });

    it("should have Vietnamese translation for businesses", () => {
      expect(i18n.t("itemTypes.businesses")).toBe("Doanh Nghiệp");
    });

    it("should have Vietnamese translation for localServices", () => {
      expect(i18n.t("itemTypes.localServices")).toBe("Dịch Vụ Địa Phương");
    });
  });

  describe("Filter translations", () => {
    it("should have Vietnamese translation for filters", () => {
      expect(i18n.t("filters.filters")).toBe("Bộ Lọc");
    });

    it("should have Vietnamese translation for category", () => {
      expect(i18n.t("filters.category")).toBe("Danh Mục");
    });

    it("should have Vietnamese translation for allCategories", () => {
      expect(i18n.t("filters.allCategories")).toBe("Tất Cả Danh Mục");
    });

    it("should have Vietnamese translation for clearAll", () => {
      expect(i18n.t("filters.clearAll")).toBe("Xóa Tất Cả");
    });

    it("should have Vietnamese translation for neighborhood", () => {
      expect(i18n.t("filters.neighborhood")).toBe("Khu Vực");
    });
  });

  describe("Common UI translations", () => {
    it("should have Vietnamese translation for submit", () => {
      expect(i18n.t("common.submit")).toBe("Gửi");
    });

    it("should have Vietnamese translation for cancel", () => {
      expect(i18n.t("common.cancel")).toBe("Hủy");
    });

    it("should have Vietnamese translation for save", () => {
      expect(i18n.t("common.save")).toBe("Lưu");
    });

    it("should have Vietnamese translation for delete", () => {
      expect(i18n.t("common.delete")).toBe("Xóa");
    });

    it("should have Vietnamese translation for edit", () => {
      expect(i18n.t("common.edit")).toBe("Chỉnh Sửa");
    });

    it("should have Vietnamese translation for search", () => {
      expect(i18n.t("common.search")).toBe("Tìm Kiếm");
    });

    it("should have Vietnamese translation for loading", () => {
      expect(i18n.t("common.loading")).toBe("Đang Tải...");
    });

    it("should have Vietnamese translation for noResults", () => {
      expect(i18n.t("common.noResults")).toBe("Không Tìm Thấy Kết Quả");
    });
  });

  describe("Form translations", () => {
    it("should have Vietnamese translation for enterTitle", () => {
      expect(i18n.t("forms.enterTitle")).toBe("Nhập tiêu đề");
    });

    it("should have Vietnamese translation for enterDescription", () => {
      expect(i18n.t("forms.enterDescription")).toBe("Nhập mô tả");
    });

    it("should have Vietnamese translation for required", () => {
      expect(i18n.t("forms.required")).toBe("Trường này là bắt buộc");
    });

    it("should have Vietnamese translation for invalidEmail", () => {
      expect(i18n.t("forms.invalidEmail")).toBe("Vui lòng nhập email hợp lệ");
    });
  });

  describe("Message translations", () => {
    it("should have Vietnamese translation for messageSent", () => {
      expect(i18n.t("messages.messageSent")).toBe("Tin nhắn đã gửi thành công");
    });

    it("should have Vietnamese translation for saveSuccess", () => {
      expect(i18n.t("messages.saveSuccess")).toBe("Đã lưu thành công");
    });

    it("should have Vietnamese translation for deleteSuccess", () => {
      expect(i18n.t("messages.deleteSuccess")).toBe("Đã xóa thành công");
    });

    it("should have Vietnamese translation for confirmDelete", () => {
      expect(i18n.t("messages.confirmDelete")).toBe("Bạn có chắc chắn muốn xóa mục này không?");
    });
  });

  describe("Location translations", () => {
    it("should have Vietnamese translation for allNeighborhoods", () => {
      expect(i18n.t("location.allNeighborhoods")).toBe("Tất Cả Khu Vực");
    });

    it("should have Vietnamese translation for allVillages", () => {
      expect(i18n.t("location.allVillages")).toBe("Tất Cả Làng");
    });

    it("should have Vietnamese translation for neighborhood", () => {
      expect(i18n.t("location.neighborhood")).toBe("Khu Vực");
    });

    it("should have Vietnamese translation for village", () => {
      expect(i18n.t("location.village")).toBe("Làng");
    });
  });

  describe("Discovery translations", () => {
    it("should have Vietnamese translation for followingFeed", () => {
      expect(i18n.t("discovery.followingFeed")).toBe("Bảng Tin Đang Theo Dõi");
    });

    it("should have Vietnamese translation for discoverPeople", () => {
      expect(i18n.t("discovery.discoverPeople")).toBe("Khám Phá Mọi Người");
    });

    it("should have Vietnamese translation for similarInterests", () => {
      expect(i18n.t("discovery.similarInterests")).toBe("Sở Thích Tương Tự");
    });

    it("should have Vietnamese translation for trending", () => {
      expect(i18n.t("discovery.trending")).toBe("Xu Hướng");
    });

    it("should have Vietnamese translation for nearYou", () => {
      expect(i18n.t("discovery.nearYou")).toBe("Gần Bạn");
    });

    it("should have Vietnamese translation for noRecentActivity", () => {
      expect(i18n.t("discovery.noRecentActivity")).toBe("Không có hoạt động gần đây từ những người bạn theo dõi.");
    });
  });

  describe("Bookmarks translations", () => {
    it("should have Vietnamese translation for yourBookmarks", () => {
      expect(i18n.t("bookmarks.yourBookmarks")).toBe("Dấu Trang Của Bạn");
    });

    it("should have Vietnamese translation for noBookmarks", () => {
      expect(i18n.t("bookmarks.noBookmarks")).toContain("Chưa có dấu trang");
    });

    it("should have Vietnamese translation for moreBookmarks with interpolation", () => {
      expect(i18n.t("bookmarks.moreBookmarks", { count: 5 })).toBe("+5 dấu trang khác");
    });
  });

  describe("Saved searches translations", () => {
    it("should have Vietnamese translation for title", () => {
      expect(i18n.t("savedSearches.title")).toBe("Tìm Kiếm Đã Lưu");
    });

    it("should have Vietnamese translation for signInPrompt", () => {
      expect(i18n.t("savedSearches.signInPrompt")).toBe("Đăng nhập để lưu tìm kiếm và được thông báo về các kết quả mới.");
    });
  });

  describe("No untranslated English text", () => {
    it("navigation keys should not return English when in Vietnamese mode", () => {
      expect(i18n.t("navigation.backToHome")).not.toBe("Back to Home");
      expect(i18n.t("navigation.news")).not.toBe("News");
      expect(i18n.t("navigation.submit")).not.toBe("Submit");
      expect(i18n.t("navigation.signIn")).not.toBe("Sign In");
      expect(i18n.t("navigation.signOut")).not.toBe("Sign Out");
    });

    it("common UI keys should not return English when in Vietnamese mode", () => {
      expect(i18n.t("common.submit")).not.toBe("Submit");
      expect(i18n.t("common.cancel")).not.toBe("Cancel");
      expect(i18n.t("common.save")).not.toBe("Save");
      expect(i18n.t("common.delete")).not.toBe("Delete");
      expect(i18n.t("common.edit")).not.toBe("Edit");
      expect(i18n.t("common.search")).not.toBe("Search");
      expect(i18n.t("common.loading")).not.toBe("Loading...");
    });

    it("discovery keys should not return English when in Vietnamese mode", () => {
      expect(i18n.t("discovery.discoverPeople")).not.toBe("Discover People");
      expect(i18n.t("discovery.followingFeed")).not.toBe("Following Feed");
      expect(i18n.t("bookmarks.yourBookmarks")).not.toBe("Your Bookmarks");
      expect(i18n.t("savedSearches.title")).not.toBe("Saved Searches");
    });
  });

  describe("Language switching works correctly", () => {
    it("should switch from English to Vietnamese correctly", () => {
      i18n.changeLanguage("en");
      expect(i18n.t("navigation.signIn")).toBe("Sign In");

      i18n.changeLanguage("vi");
      expect(i18n.t("navigation.signIn")).toBe("Đăng Nhập");
    });

    it("should switch from Vietnamese to English correctly", () => {
      i18n.changeLanguage("vi");
      expect(i18n.t("navigation.signIn")).toBe("Đăng Nhập");

      i18n.changeLanguage("en");
      expect(i18n.t("navigation.signIn")).toBe("Sign In");
    });

    it("should switch discovery components from English to Vietnamese correctly", () => {
      i18n.changeLanguage("en");
      expect(i18n.t("discovery.discoverPeople")).toBe("Discover People");
      expect(i18n.t("location.allNeighborhoods")).toBe("All Neighborhoods");

      i18n.changeLanguage("vi");
      expect(i18n.t("discovery.discoverPeople")).toBe("Khám Phá Mọi Người");
      expect(i18n.t("location.allNeighborhoods")).toBe("Tất Cả Khu Vực");
    });
  });
});
