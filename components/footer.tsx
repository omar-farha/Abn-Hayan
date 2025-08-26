export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center md:text-right">
            <div className="flex items-center justify-center md:justify-start space-x-3 space-x-reverse mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">ح</span>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                ابن حيان
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              منصة تعليمية متطورة لتعلم الفيزياء بطريقة حديثة وممتعة
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4 text-blue-400">
              روابط سريعة
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  الرئيسية
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  الكورسات
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  عن المعلم
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  تواصل معنا
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-4 text-blue-400">
              تواصل معنا
            </h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>📧 info@ibnhayan.com</p>
              <p>📱 +20 123 456 7890</p>
              <div className="flex justify-center md:justify-start space-x-4 space-x-reverse mt-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  فيسبوك
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  يوتيوب
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  تليجرام
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 ابن حيان - Physics Society. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
