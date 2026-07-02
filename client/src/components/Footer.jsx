import { useState } from "react";
import { Phone, Mail, X } from "lucide-react";

const footerLinks = {
  QuickLinks: ["Home", "Features", "Gallery", "Pricing", "Testimonials", "Contact Us"],
  Programs: ["Basic Training", "Pro Program", "Pro Max Elite", "Group Classes", "Personal Coaching"],
  Support: ["FAQs", "Contact Us", "Terms & Conditions", "Privacy Policy", "Refund Policy"]
};

const popupContent = {
  "Basic Training": {
    title: "Basic Training",
    body: "Our Basic Training program is the perfect starting point for beginners and casual gym-goers who want to build a consistent fitness routine without overwhelm.\n\nYou get 1-hour gym sessions with full access to our standard equipment zone, including cardio machines, cable stations, and free weights up to 40 kg. Locker rooms with showers and changing areas are included in every visit.\n\nEvery new member receives a complimentary basic orientation session where one of our trainers walks you through the facility, demonstrates proper machine usage, and helps you set realistic initial goals.\n\nOur standard entry process ensures a smooth check-in experience. You can access the gym during all operating hours — Monday to Saturday, 6 AM to 10 PM, and Sunday 7 AM to 8 PM.\n\nThis plan is ideal if you're looking for an affordable entry point into a premium gym environment with room to grow as your strength and confidence increase."
  },
  "Pro Program": {
    title: "Pro Program",
    body: "The Pro Program is our most popular plan, trusted by hundreds of regular members who train with serious intention. It strikes the perfect balance between flexibility, access, and professional guidance.\n\nEnjoy 2-3 hour gym sessions with unrestricted access to every piece of equipment in the facility — from Olympic lifting platforms and squat racks to cable crossover machines and specialty bars. No equipment is off-limits.\n\nYour membership includes two personal coaching sessions per month. During these sessions, a certified coach assesses your form, updates your program, and addresses weak points. You also receive a personalized diet plan created by our in-house nutritionist, tailored to your body type and fitness goals.\n\nPriority entry processing means less waiting and more training. Group classes — including HIIT, yoga, and boxing — are included at no extra cost. And with 24/7 access, you can train whenever inspiration strikes.\n\nIf you're ready to take your training beyond the basics and want professional support to accelerate your progress, the Pro Program is built for you."
  },
  "Pro Max Elite": {
    title: "Pro Max Elite",
    body: "Pro Max Elite is the ultimate THE FORGE experience — designed for those who demand the absolute best from themselves and their gym. This is not just a membership. It's a lifestyle commitment.\n\nTrain for up to 4 hours per session with VIP access to our premium equipment zone, featuring specialty strongman tools, calibrated competition plates, reverse hyper machines, and exclusive functional training rigs not available to other plans.\n\nYour journey is supported by unlimited personal coaching sessions. Your dedicated coach is available for daily check-ins, program adjustments, and even remote guidance via our member app. You also receive a premium, fully customized diet plan updated every two weeks based on your progress.\n\nThe VIP entry process includes an express lane with biometric scanning — no queues, no delays. Post-workout, access our recovery zone featuring a dry sauna, cold plunge, compression boots, and massage chairs.\n\nExclusive perks include a welcome merch pack (custom apparel, shaker, towel, and gym bag) plus priority booking for all classes, workshops, and special events before they open to the general membership.\n\nPro Max Elite is limited to 50 members at any time to ensure an uncompromised experience. This is the forge at its finest."
  },
  "Group Classes": {
    title: "Group Classes",
    body: "Group Classes at THE FORGE are where community meets intensity. Led by certified trainers with years of coaching experience, our group sessions are designed to challenge every fitness level within a supportive, high-energy environment.\n\nOur class roster includes:\n- HIIT Inferno: High-intensity interval training combining bodyweight movements, kettlebell drills, and battle ropes\n- Power Yoga Flow: A dynamic vinyasa practice that builds core strength, flexibility, and mental focus\n- Strength Circuit: Full-body resistance training using barbells, dumbbells, and machines\n- Box & Burn: Boxing-based cardio conditioning with bag work and footwork drills\n- Core Crusher: A targeted 30-minute session focused on abdominal and lower back strength\n\nEach class is capped at 20 participants to ensure individual attention. Classes are included in Pro and Pro Max plans, or available as a add-on for Basic members.\n\nThe group training environment creates natural accountability — you'll show up because others are counting on you. This collective energy consistently produces some of the best results among our members."
  },
  "Personal Coaching": {
    title: "Personal Coaching",
    body: "Personal Coaching at THE FORGE is a transformative one-on-one partnership between you and a certified fitness professional who is 100% invested in your success.\n\nYour journey begins with a comprehensive initial assessment: movement screening, body composition analysis, strength benchmarks, and a detailed discussion of your goals, lifestyle, and any past injuries or limitations.\n\nBased on this assessment, your coach designs a fully customized training program that evolves with you. Every session is tracked, every rep is coached, and every milestone is celebrated. Your coach is there to push you when you want to quit and pull you back when you're pushing too hard.\n\nCoaching sessions include:\n- Hands-on form correction and technique development\n- Progressive overload programming tailored to your rate of adaptation\n- Nutrition and recovery guidance integrated into your training plan\n- Monthly progress reviews with updated body composition analysis\n\nWhether your goal is fat loss, muscle gain, athletic performance, or general health transformation, our coaches have the experience and tools to get you there efficiently and safely.\n\nAvailable as 2x/month (Pro Plan), unlimited (Pro Max Elite), or as a standalone add-on for Basic members."
  },
  "FAQs": {
    title: "FAQs",
    body: "Got questions? We've compiled answers to the most common inquiries so you can get started without any confusion.\n\nQ: What are your operating hours?\nA: Monday to Saturday, 6:00 AM to 10:00 PM. Sunday, 7:00 AM to 8:00 PM. Pro and Pro Max members enjoy 24/7 access.\n\nQ: Do I need to bring my own equipment?\nA: No. We provide all equipment including barbells, dumbbells, kettlebells, resistance bands, yoga mats, and more. Just bring workout clothes, a towel, and a water bottle.\n\nQ: Is there parking available?\nA: Yes. We have a dedicated parking area with 50+ spots for members. It's free and monitored by security cameras.\n\nQ: Can I freeze my membership?\nA: Yes. Members can freeze their membership for up to 30 days per year with prior notice of at least 7 days. Medical freezes require a doctor's note.\n\nQ: Is there a joining fee?\nA: No. There is no joining fee or hidden charges. You only pay your membership dues.\n\nQ: Can I bring a guest?\nA: Yes. Basic members can bring 1 guest per month. Pro members can bring 2. Pro Max Elite members can bring 4 guests per month. Guests must sign a waiver.\n\nQ: What COVID-19 precautions are in place?\nA: We maintain hospital-grade sanitation with hourly cleaning cycles, UV sanitization for equipment, and enhanced ventilation throughout the facility."
  },
  "Contact Us": {
    title: "Contact Us",
    body: "We're always ready to hear from you — whether you have a question about memberships, need support, or just want to share your Forge journey with us.\n\n📍 Visit Us\nSector 45, Gurugram, Haryana 122003\nOur facility is easily accessible from Golf Course Road and MG Road. Use Google Maps for accurate navigation.\n\n📞 Call Us\n+91 96546 73316\nOur front desk team is available Monday to Saturday, 6 AM to 10 PM. Sunday, 7 AM to 8 PM.\n\n📧 Email Us\nalonesurvivor03@gmail.com\nWe aim to respond to all email inquiries within 24 hours. For urgent matters, please call us directly.\n\n🌐 Follow Us\nStay connected on Instagram, Facebook, and YouTube for daily training tips, member spotlights, class schedules, and special announcements.\n\nWhether you're a prospective member curious about plans or an existing member needing assistance, we're here to help. Stop by anytime for a free facility tour — no appointment needed."
  },
  "Terms & Conditions": {
    title: "Terms & Conditions",
    body: "By enrolling as a member of THE FORGE, you agree to the following terms and conditions that govern the use of our facilities, equipment, and services.\n\nMEMBERSHIP\nMembership is personal and non-transferable. Each member must check in using their registered credentials. Sharing membership credentials is strictly prohibited and may result in immediate termination without refund.\n\nPAYMENT\nAll fees must be paid in full at the time of enrollment or according to the agreed payment schedule. Late payments beyond 7 days will incur a late fee of ₹500. Membership may be suspended until dues are cleared.\n\nFACILITY USE\nMembers must use equipment in a safe and responsible manner. We are not liable for injuries resulting from improper use of equipment, failure to follow trainer instructions, or pre-existing medical conditions. Always consult a physician before beginning any exercise program.\n\nCODE OF CONDUCT\nWe maintain a zero-tolerance policy for harassment, discrimination, aggressive behavior, or language that creates an unsafe or unwelcoming environment. Management reserves the right to revoke membership of any member violating this policy.\n\nLOCKER USAGE\nLockers are available on a daily basis. Items left overnight are removed and stored at lost & found for 7 days. THE FORGE is not responsible for lost or stolen personal belongings.\n\nCANCELLATION\nMembers may cancel within 48 hours of signup for a full refund if no sessions have been used. After this period, no refunds are issued. Membership can be frozen per our freeze policy."
  },
  "Privacy Policy": {
    title: "Privacy Policy",
    body: "Your privacy is a priority at THE FORGE. This policy outlines how we collect, use, store, and protect your personal information when you use our services.\n\nINFORMATION WE COLLECT\nWe collect personal information you provide during registration: your name, email address, phone number, date of birth, and emergency contact details. With your consent, we may also collect health-related information to ensure safe participation in our programs.\n\nHOW WE USE YOUR INFORMATION\nYour data is used exclusively to:\n- Process your membership and payments\n- Communicate class schedules, promotions, and service updates\n- Maintain safety and emergency contact records\n- Improve our facilities and member experience\n\nWe do not sell, rent, or share your personal data with third parties for marketing purposes. The only exceptions are legal obligations or explicit written consent from you.\n\nDATA STORAGE & SECURITY\nYour information is stored on secure servers with encryption protocols. Access is restricted to authorized personnel only. We retain your data for the duration of your membership plus 12 months after cancellation, after which it is permanently deleted.\n\nCOOKIES\nOur website uses minimal cookies for essential functionality and analytics. You can adjust cookie preferences in your browser settings.\n\nUPDATES\nWe may update this policy periodically. Members will be notified of significant changes via email. Continued membership constitutes acceptance of the updated policy."
  },
  "Refund Policy": {
    title: "Refund Policy",
    body: "At THE FORGE, we want you to be completely confident in your membership decision. Our refund policy is transparent and fair.\n\nCOOLING-OFF PERIOD\nYou are entitled to a full refund within 48 hours of your initial signup, provided you have not used any gym sessions during this period. To initiate, simply email us or visit the front desk.\n\nNO REFUNDS AFTER COOLING-OFF\nOnce the 48-hour cooling-off period has passed, membership fees are non-refundable. This includes if you decide to discontinue usage before your membership term ends. We encourage you to use your freeze option if you need a temporary pause.\n\nPARTIAL REFUNDS\nPartial refunds may be considered in exceptional circumstances such as medical emergencies (requiring a doctor's certificate), relocation to a city without a THE FORGE facility, or similar unforeseen events. Each case is reviewed individually by management and processing takes 7-10 business days.\n\nPAYMENT FAILURES\nIf a payment fails due to insufficient funds or incorrect payment details, your membership will be suspended. A ₹500 reactivation fee applies. No refund is issued for the suspension period.\n\nCANCELLATION PROCEDURE\nTo request a refund or cancellation, contact us at alonesurvivor03@gmail.com or visit the front desk. Include your full name, registered email, and reason for cancellation. We will respond within 3 business days.\n\nUPGRADES & DOWNGRADES\nMembers upgrading to a higher plan will be charged the difference in prorated amount. Downgrades take effect at the start of the next billing cycle with no retroactive refunds."
  }
};

const socials = [
  {
    label: "Instagram",
    path: "M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
  },
  {
    label: "Facebook",
    path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
  },
  {
    label: "YouTube",
    path: "M10 15l5-3-5-3v6zm1.1-13h1.8C19 2 22 5 22 12.1v1.8C22 21 19 24 12.1 24h-1.8C5 24 2 21 2 14v-1.8C2 5 5 2 12.1 2z"
  },
  {
    label: "WhatsApp",
    path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
  }
];

export default function Footer() {
  const logoSrc = "https://res.cloudinary.com/dhudpc4eu/image/upload/v1782970725/pixora-uploads/pixora-bg-1782970725175-xdteey.png";
  const [popup, setPopup] = useState(null);

  const handleLink = (link, section) => {
    if (section === "QuickLinks") {
      const id = link.toLowerCase().replace(/\s+/g, "-");
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    setPopup(popupContent[link] || { title: link, body: "Details coming soon." });
  };

  return (
    <footer className="bg-[#0A0A0A] border-t border-white/5 pt-14 md:pt-20 pb-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-6 pb-10 md:pb-14 border-b border-white/5">
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={logoSrc} alt="THE FORGE" className="h-9 w-auto" />
              <span className="font-heading text-xl font-bold tracking-widest text-white">
                THE<span className="text-forge-red"> FORGE</span>
              </span>
            </div>
            <p className="font-body text-forge-dim text-sm leading-relaxed max-w-xs mb-6">
              Strength isn't given. It's forged. Premium gym equipment, expert trainers, and a community that pushes you beyond.
            </p>
            <div className="flex gap-3">
              {socials.map((s, i) => (
                <a key={i} href="#" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-forge-muted hover:text-forge-red hover:bg-forge-red/10 transition-all" aria-label={s.label}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-heading text-xs uppercase tracking-[0.15em] text-white mb-4">{section}</h4>
              <div className="flex flex-col gap-2">
                {links.map(link => (
                  <button key={link} onClick={() => handleLink(link, section)}
                    className="font-body text-forge-dim text-sm hover:text-forge-red transition-colors w-fit text-left">
                    {link}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6">
          <p className="font-body text-xs text-forge-dim">&copy; {new Date().getFullYear()} THE FORGE. All rights reserved. Forged with fire.</p>
          <div className="flex items-center gap-4 text-forge-dim">
            <a href="tel:+919654673316" className="flex items-center gap-1.5 text-xs hover:text-forge-red transition-colors">
              <Phone size={12} /> +91 96546 73316
            </a>
            <a href="mailto:alonesurvivor03@gmail.com" className="flex items-center gap-1.5 text-xs hover:text-forge-red transition-colors">
              <Mail size={12} /> alonesurvivor03@gmail.com
            </a>
          </div>
        </div>
      </div>

      {popup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setPopup(null)}>
          <div className="glass rounded-2xl p-6 md:p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xl font-bold text-white">{popup.title}</h3>
              <button onClick={() => setPopup(null)} className="text-forge-dim hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="w-10 h-0.5 bg-forge-red mb-5" />
            <div className="space-y-4">
              {popup.body.split("\n\n").map((block, i) => {
                const lines = block.split("\n");
                const isQuestion = lines.some(l => /^Q:/i.test(l.trim()));
                if (isQuestion) {
                  const qaPairs = [];
                  let current = [];
                  for (const line of lines) {
                    if (/^Q:/i.test(line.trim())) {
                      if (current.length) { qaPairs.push(current); current = []; }
                      current.push(line);
                    } else if (/^A:/i.test(line.trim())) {
                      current.push(line);
                      qaPairs.push(current);
                      current = [];
                    } else {
                      current.push(line);
                    }
                  }
                  if (current.length) qaPairs.push(current);
                  return (
                    <div key={i} className="space-y-4">
                      {qaPairs.map((pair, j) => (
                        <div key={j}>
                          {pair.map((line, k) => {
                            const isQ = /^Q:/i.test(line.trim());
                            const isA = /^A:/i.test(line.trim());
                            const content = line.replace(/^[QA]:\s*/i, "");
                            if (isQ) return <p key={k} className="font-heading text-sm font-bold text-white">{content}</p>;
                            if (isA) return <p key={k} className="font-body text-sm text-forge-muted leading-relaxed pl-3 border-l-2 border-forge-red/30">{content}</p>;
                            return <p key={k} className="font-body text-sm text-forge-muted leading-relaxed">{line}</p>;
                          })}
                        </div>
                      ))}
                    </div>
                  );
                }
                const isSectionHeader = lines.length === 1 && /^[A-Z\s&]+$/.test(lines[0]);
                if (isSectionHeader) {
                  return <p key={i} className="font-heading text-sm font-bold text-forge-red tracking-wider uppercase">{lines[0]}</p>;
                }
                const hasBullets = lines.some(l => l.trim().startsWith("-"));
                if (hasBullets) {
                  return (
                    <div key={i} className="space-y-1.5">
                      {lines.map((line, k) => {
                        const isBullet = line.trim().startsWith("-");
                        if (isBullet) return <p key={k} className="font-body text-sm text-forge-muted leading-relaxed pl-3 flex gap-2"><span className="text-forge-red shrink-0 mt-0.5">•</span>{line.trim().replace(/^-\s*/, "")}</p>;
                        return <p key={k} className="font-body text-sm text-forge-muted leading-relaxed">{line}</p>;
                      })}
                    </div>
                  );
                }
                return <p key={i} className="font-body text-sm text-forge-muted leading-relaxed">{block}</p>;
              })}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
