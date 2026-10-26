// Text of the About / Help / Privacy pages (Nepali + English). build-data.mjs writes it to web/pages.json.
// English is the owner's wording ("main focus.txt", 2026-10-26). The Nepali is a Claude draft of it: please check it.
// Edit the words here, then run: node build-data.mjs
const P = (h_ne, h_en, p_ne, p_en) => ({ h: { ne: h_ne, en: h_en }, p: { ne: p_ne, en: p_en } });

export const pages = {
  about: {
    title: { ne: 'बारेमा', en: 'About' },
    items: [
      P('यो वेबसाइट किन बनाइएको हो', 'Why this website exists',
        'आजभोलि किरात परिवारहरू धेरै देशमा बस्छन्। भजनका लागि भेला हुँदा सबैसँग भजनको किताब नहुन सक्छ, र प्रायः केही साझा प्रतिलिपि मात्र उपलब्ध हुन्छन्। यो वेबसाइटले भजनहरू एकै ठाउँमा निःशुल्क ल्याएको छ, ताकि जो कोहीले फोन वा कम्प्युटरमा साथसाथै पढ्न सकून्।',
        'Kirat families live in many countries today. When they gather for bhajan, not everyone has a bhajan book, and often only a few shared copies are available. This website brings the bhajans together in one place, free of charge, so anyone can read along on a phone or computer.'),
      P('यो वेबसाइट के हो', 'What this website is',
        'किरात भजनहरू नेपाली (देवनागरी) वा नेपाङ्ग्लिसमा पढ्न सकिन्छ। नेपाङ्ग्लिस भनेको उही नेपाली शब्दहरू रोमन अक्षरमा लेखिएको रूप हो; यो अङ्ग्रेजी अनुवाद होइन। यो वेबसाइट निःशुल्क छ, लगइन चाहिँदैन र तपाईंसँग व्यक्तिगत जानकारी माग्दैन।',
        'Read the Kirat bhajans in Nepali (Devanagari) or Nepanglish. Nepanglish is the same Nepali words written in Roman letters; it is not an English translation. The website is free, does not require sign-in, and does not ask you for personal information.'),
      P('भजनहरू कहाँबाट आएका हुन्', 'Where the bhajans come from',
        'किरात समुदायका सदस्यहरूलाई भजनका लागि भेला हुँदा भजन पढ्न सहयोग गर्न यो वेबसाइट बनाइएको हो। यी भजनहरू स्वलगनशील किरात परिवारले पहिले प्रकाशित गरेको पुस्तकबाट लिइएका हुन्। शब्द र सङ्गीत तिनका मूल लेखक तथा सङ्गीतकारका हुन्। तपाईं अधिकारधनी हुनुहुन्छ र कुनै कुरा सच्याउन वा हटाउन चाहनुहुन्छ भने कृपया सम्पर्क गर्नुहोस्।',
        'The website was made to help Kirat community members read bhajans when they gather for bhajan. The bhajans are taken from a book previously published by Swalagansheel Kirat Pariwar. The words and music belong to their original writers and composers. If you are a rights holder and would like something corrected or removed, please contact us.'),
      P('पाठको बारेमा', 'About the text',
        'भजनका पाठ स्वलगनशील किरात परिवारले प्रकाशित गरेको पुस्तकबाट लिइएका हुन् र नेपाली (देवनागरी) लिपिमा प्रस्तुत गरिएका छन्। यी अझै जाँच र सफा गर्ने क्रममा छन्, त्यसैले केही हिज्जे परिवर्तन हुन सक्छन्। नेपाङ्ग्लिस भनेको उही शब्दहरू उही क्रममा रोमन अक्षरमा लेखिएको रूप हो। वेबसाइट र छापिएको पुस्तकमा फरक भएमा छापिएको पुस्तकलाई आधार मान्नुहोस्।',
        'The bhajan texts are taken from a book published by Swalagansheel Kirat Pariwar and are presented in Nepali (Devanagari) script. They are still being checked and cleaned up, so some spellings may change. Nepanglish is a Roman-letter version of the same words in the same order. If the website and the printed book ever disagree, the printed book is the reference.'),
      P('सम्पर्क', 'Contact',
        'गल्ती सच्याउन, कुनै भजन हटाउन वा अरू कुनै कुराका लागि khaling.studio@gmail.com मा लेख्नुहोस्।',
        'To report a mistake, request the removal of a bhajan, or ask about anything else, email khaling.studio@gmail.com.'),
    ],
  },
  help: {
    title: { ne: 'सहयोग', en: 'Help' },
    items: [
      P('वेबसाइट पढ्ने र प्रयोग गर्ने तरिका', 'Reading and using the website',
        'माथिको स्विचबाट नेपाली र नेपाङ्ग्लिस बदल्नुहोस्। फोनमा EN / ने बटन वा सेटिङ प्रयोग गर्नुहोस्। तपाईं अक्षरको आकार र फन्ट बदल्न, मनपर्ने भजन सुरक्षित गर्न, हरफ बुकमार्क गर्न, पढ्ने मोड प्रयोग गर्न, बोल कपी वा प्रिन्ट गर्न, र शीर्षक वा बोलबाट खोज्न सक्नुहुन्छ। नेपाङ्ग्लिस भनेको रोमन अक्षरमा लेखिएको नेपाली हो, अङ्ग्रेजी अनुवाद होइन।',
        'Use the switch at the top to change between Nepali and Nepanglish. On a phone, use the EN / ने button or the Display setting. You can change text size and font, save favourite bhajans, bookmark individual lines, use reading mode, copy or print lyrics, and search by title or lyrics. Nepanglish is Nepali written in Roman letters, not an English translation.'),
    ],
  },
  privacy: {
    title: { ne: 'गोपनीयता', en: 'Privacy' },
    items: [
      P('गोपनीयता र सुरक्षित रोजाइ', 'Privacy and saved preferences',
        'यो वेबसाइटले खाता खोल्न वा व्यक्तिगत जानकारी दिन अनुरोध गर्दैन। यसमा विज्ञापन वा ट्र्याकिङ छैन। तपाईंका मनपर्ने भजन, बुकमार्क, भाषा, अक्षरको आकार, फन्ट र थिम तपाईंको ब्राउजरमा सुरक्षित हुन्छन्। वेबसाइटले Google Fonts बाट फन्ट लोड गर्छ; फन्ट लोड हुँदा Google ले तपाईंको इन्टरनेट ठेगाना र केही प्राविधिक जानकारी प्राप्त गर्न सक्छ।',
        'The website does not ask you to create an account or provide personal information. It has no advertising or tracking. Your favourites, bookmarks, language, text size, font and theme are saved in your browser. The website also loads fonts from Google Fonts, which may receive your internet address and technical information when fonts load.'),
    ],
  },
};
