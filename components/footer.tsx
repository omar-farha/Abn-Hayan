export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10">
      {" "}
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center">
              <img
                src="/logo22.png"
                alt="ابن حيان"
                className="w-[115px] h-[73px] object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
              منصة ابن حيان للتعليم الإلكتروني - نقدم تجربة تعليمية متكاملة تجمع
              بين العلم النظري والتطبيق العملي.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-blue-400 border-b border-blue-800 pb-2">
              روابط سريعة
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center"
                >
                  <span className="ml-2">→</span>
                  الرئيسية
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center"
                >
                  <span className="ml-2">→</span>
                  الكورسات
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center"
                >
                  <span className="ml-2">→</span>
                  المشاريع
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center"
                >
                  <span className="ml-2">→</span>
                  الاختبارات
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-blue-400 border-b border-blue-800 pb-2">
              تواصل معنا
            </h4>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-900/30 p-2 rounded-lg mr-3">
                  <svg
                    className="w-5 h-5 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">البريد الإلكتروني</p>
                  <a
                    href="mailto:info@ibnhayan.com"
                    className="text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    info@ibnhayan.com
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-900/30 p-2 rounded-lg mr-3">
                  <svg
                    className="w-5 h-5 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">الهاتف</p>
                  <a
                    href="tel:+201234567890"
                    className="text-gray-300 hover:text-blue-400 transition-colors"
                  >
                    +20 123 456 7890
                  </a>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="pt-4">
              <p className="text-gray-400 text-sm mb-3">تابعنا على</p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="bg-gray-800 hover:bg-blue-600 p-2 rounded-lg transition-all duration-300 transform hover:scale-110"
                  aria-label="فيسبوك"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-gray-800 hover:bg-red-600 p-2 rounded-lg transition-all duration-300 transform hover:scale-110"
                  aria-label="يوتيوب"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-gray-800 hover:bg-blue-400 p-2 rounded-lg transition-all duration-300 transform hover:scale-110"
                  aria-label="تليجرام"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.894 7.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.04 5.56-5.022c.241-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.652-.64.136-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} منصة ابن حيان - جميع الحقوق محفوظة.
          </p>

          <div className="flex gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-blue-400 transition-colors">
              شروط الخدمة
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              سياسة الخصوصية
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
