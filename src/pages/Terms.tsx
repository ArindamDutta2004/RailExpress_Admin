import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Globe } from 'lucide-react';

const termsContent = {
  english: {
    title: 'Terms and Conditions',
    content: [
      'Welcome to our Railway Ticket Booking System. By using this service, you agree to the following terms and conditions:',
      '1. Booking Policy: All bookings are subject to availability and confirmation from the railway authorities.',
      '2. Payment Terms: Advance payment is required for booking confirmation. Final payment must be completed before ticket issuance.',
      '3. Cancellation: Cancellation charges will apply as per railway rules and regulations.',
      '4. Refunds: Refunds will be processed within 7-14 business days after cancellation approval.',
      '5. User Responsibilities: You must provide accurate information. Any misrepresentation may lead to booking cancellation.',
      '6. Privacy: Your personal information will be protected and used only for booking purposes.',
      '7. Liability: We are not responsible for any delays or cancellations by railway authorities.',
      '8. Maximum 3 bookings per day are allowed per user.',
      '9. Duplicate bookings for the same journey will not be permitted.',
      '10. By accepting these terms, you acknowledge that you have read and understood all conditions.',
    ],
  },
  hindi: {
    title: 'नियम और शर्तें',
    content: [
      'हमारी रेलवे टिकट बुकिंग प्रणाली में आपका स्वागत है। इस सेवा का उपयोग करके, आप निम्नलिखित नियमों और शर्तों से सहमत हैं:',
      '1. बुकिंग नीति: सभी बुकिंग उपलब्धता और रेलवे अधिकारियों की पुष्टि के अधीन हैं।',
      '2. भुगतान शर्तें: बुकिंग की पुष्टि के लिए अग्रिम भुगतान आवश्यक है। टिकट जारी करने से पहले अंतिम भुगतान पूरा होना चाहिए।',
      '3. रद्दीकरण: रेलवे नियमों के अनुसार रद्दीकरण शुल्क लागू होगा।',
      '4. धनवापसी: रद्दीकरण की मंजूरी के बाद 7-14 कार्य दिवसों के भीतर धनवापसी की जाएगी।',
      '5. उपयोगकर्ता जिम्मेदारियां: आपको सटीक जानकारी प्रदान करनी होगी। कोई भी गलत बयानी बुकिंग रद्द कर सकती है।',
      '6. गोपनीयता: आपकी व्यक्तिगत जानकारी सुरक्षित रहेगी और केवल बुकिंग उद्देश्यों के लिए उपयोग की जाएगी।',
      '7. दायित्व: हम रेलवे अधिकारियों द्वारा किसी भी देरी या रद्दीकरण के लिए जिम्मेदार नहीं हैं।',
      '8. प्रति उपयोगकर्ता प्रति दिन अधिकतम 3 बुकिंग की अनुमति है।',
      '9. एक ही यात्रा के लिए डुप्लिकेट बुकिंग की अनुमति नहीं दी जाएगी।',
      '10. इन शर्तों को स्वीकार करके, आप स्वीकार करते हैं कि आपने सभी शर्तों को पढ़ और समझ लिया है।',
    ],
  },
  bengali: {
    title: 'শর্তাবলী',
    content: [
      'আমাদের রেলওয়ে টিকিট বুকিং সিস্টেমে আপনাকে স্বাগতম। এই পরিষেবাটি ব্যবহার করে, আপনি নিম্নলিখিত শর্তাবলীতে সম্মত হন:',
      '1. বুকিং নীতি: সমস্ত বুকিং প্রাপ্যতা এবং রেলওয়ে কর্তৃপক্ষের নিশ্চিতকরণের সাপেক্ষে।',
      '2. পেমেন্ট শর্তাবলী: বুকিং নিশ্চিতকরণের জন্য অগ্রিম পেমেন্ট প্রয়োজন। টিকিট ইস্যু করার আগে চূড়ান্ত পেমেন্ট সম্পন্ন করতে হবে।',
      '3. বাতিলকরণ: রেলওয়ে নিয়ম অনুযায়ী বাতিলকরণ চার্জ প্রযোজ্য হবে।',
      '4. রিফান্ড: বাতিলকরণ অনুমোদনের পরে 7-14 কার্যদিবসের মধ্যে রিফান্ড প্রক্রিয়া করা হবে।',
      '5. ব্যবহারকারীর দায়িত্ব: আপনাকে সঠিক তথ্য প্রদান করতে হবে। যেকোনো ভুল উপস্থাপনা বুকিং বাতিলের কারণ হতে পারে।',
      '6. গোপনীয়তা: আপনার ব্যক্তিগত তথ্য সুরক্ষিত থাকবে এবং শুধুমাত্র বুকিংয়ের উদ্দেশ্যে ব্যবহার করা হবে।',
      '7. দায়বদ্ধতা: রেলওয়ে কর্তৃপক্ষের দ্বারা কোনো বিলম্ব বা বাতিলের জন্য আমরা দায়ী নই।',
      '8. প্রতি ব্যবহারকারী প্রতিদিন সর্বাধিক 3টি বুকিং অনুমোদিত।',
      '9. একই যাত্রার জন্য ডুপ্লিকেট বুকিং অনুমোদিত হবে না।',
      '10. এই শর্তাবলী গ্রহণ করে, আপনি স্বীকার করছেন যে আপনি সমস্ত শর্ত পড়েছেন এবং বুঝেছেন।',
    ],
  },
};

type Language = 'english' | 'hindi' | 'bengali';

const Terms = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language>('english');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  const handleAccept = () => {
    if (!agreed) {
      setError('You must accept the terms and conditions to continue');
      return;
    }

    localStorage.setItem('termsAccepted', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">
                {termsContent[language].title}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-gray-600" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="english">English</option>
                <option value="hindi">हिंदी</option>
                <option value="bengali">বাংলা</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 max-h-96 overflow-y-auto">
            <div className="space-y-4">
              {termsContent[language].content.map((paragraph, index) => (
                <p key={index} className="text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 mb-6">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                setError('');
              }}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="agree" className="text-gray-700 font-medium">
              {language === 'english' && 'I have read and agree to the Terms and Conditions'}
              {language === 'hindi' && 'मैंने नियम और शर्तें पढ़ ली हैं और उनसे सहमत हूं'}
              {language === 'bengali' && 'আমি শর্তাবলী পড়েছি এবং সম্মত হয়েছি'}
            </label>
          </div>

          <button
            onClick={handleAccept}
            disabled={!agreed}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {language === 'english' && 'Continue to Dashboard'}
            {language === 'hindi' && 'डैशबोर्ड पर जारी रखें'}
            {language === 'bengali' && 'ড্যাশবোর্ডে চালিয়ে যান'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Terms;
