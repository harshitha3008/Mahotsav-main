import React, { useState } from 'react';
import { 
  BookOpen, 
  MapPin, 
  Home, 
  Phone, 
  HelpCircle 
} from 'lucide-react';
import { X } from "lucide-react";

const HospitalityPage = () => {
  const handleClose = () => {
    window.close(); // Closes the current tab
};
  const [activeTab, setActiveTab] = useState('instructions');

  const navItems = [
    { 
      id: 'instructions', 
      label: 'Instructions', 
      icon: <BookOpen size={24} />
    },
    { 
      id: 'howToReach', 
      label: 'How to Reach', 
      icon: <MapPin size={24} />
    },
    { 
      id: 'accommodation', 
      label: 'Accommodation', 
      icon: <Home size={24} />
    },
    { 
      id: 'contacts', 
      label: 'Contacts', 
      icon: <Phone size={24} />
    },
    { 
      id: 'faqs', 
      label: 'FAQs', 
      icon: <HelpCircle size={24} />
    }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'instructions':
        return (
          <div className="p-6 bg-[#1a1a1a] text-white flex flex-col items-center space-y-6">
            <h2 className="text-2xl font-bold mb-4 text-[#A3CFF0] text-center">
              Eligibility & Registrations
            </h2>
        
            {/* Eligibility Box */}
            <div className="w-[60%] p-4 border border-[#A3CFF0] rounded-lg bg-[#262626] transition-all duration-300">
              <h3 className="text-xl font-semibold text-[#A3CFF0]">Eligibility</h3>
              <p className="mb-4">
                <strong>Sports & Games:</strong> Students of any UG / PG program from Technical Deemed Universities, Health Universities, Engineering, and Pharmacy institutes are only allowed to participate in sports events.
              </p>
              <p>
                <strong>Cultural:</strong> Students of any UG / PG program of any discipline are permitted to participate, from institutes of Engineering & Technology, Arts & Sciences, Designing, Fashion, Medical, Pharma, etc., in Cultural / Literary / Fine Arts / Fashion events.
              </p>
            </div>
        
            {/* Registrations Box */}
            <div className="w-[60%] p-4 border border-[#A3CFF0] rounded-lg bg-[#262626] transition-all duration-300">
              <h3 className="text-xl font-semibold text-[#A3CFF0]">Registrations</h3>
              <ul className="list-disc pl-5 space-y-4">
                <li>All external participants must report at the Registration desk near the main gate before 12 noon on 6th Feb 2025.</li>
                <li>Registration Fee:
                  <ul className="list-circle pl-5">
                    <li>Sports & Games: ₹350 for Men, ₹250 for Women</li>
                    <li>Cultural/Literary/Fine Arts and Fashion: ₹250</li>
                    <li>Entry is free for PARA sports participants</li>
                  </ul>
                </li>
                <li>Participants must produce their college ID card and Bonafide certificate.</li>
                <li>Upon individual registration, a Mahotsav ID will be generated.</li>
                <li>Team captains must register their team at designated counters with Mahotsav ID cards of all team members.</li>
                <li>Sports participants can join one team event and multiple individual sports/cultural events.</li>
                <li>Cultural participants cannot take part in Sports & Games.</li>
                <li>Accommodation is available on a first-come, first-serve basis upon producing a Mahotsav ID card.</li>
                <li>Institutes can send any number of individuals or teams for an event.</li>
                <li>Lunch is provided for Sports & Games participants only.</li>
                <li>Visitors must register with a nominal entry fee.</li>
                <li>Winners and runners will receive cash prizes, mementos/medals, and appreciation certificates during the valedictory function on 8th Feb 2025 from 6 – 8 p.m.</li>
                <li>Participation certificates will be issued at the event venue upon completion of the event.</li>
              </ul>
            </div>
        
            {/* Contact Information Box */}
            <div className="w-[60%] p-4 border border-[#A3CFF0] rounded-lg bg-[#262626] transition-all duration-300">
              <h3 className="text-xl font-semibold text-[#A3CFF0]">For Further Queries & Details Contact:</h3>
              <table className="w-full border-collapse border border-[#A3CFF0] mt-4">
                <thead>
                  <tr className="bg-[#A3CFF0] text-black">
                    <th className="border border-[#A3CFF0] px-4 py-2">Name</th>
                    <th className="border border-[#A3CFF0] px-4 py-2">Contact</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-[#A3CFF0] px-4 py-2">HARSHAD.S</td><td className="border border-[#A3CFF0] px-4 py-2">7569395043</td></tr>
                  <tr><td className="border border-[#A3CFF0] px-4 py-2">HYDER AHAMAD SHAIK</td><td className="border border-[#A3CFF0] px-4 py-2">7780176877</td></tr>
                  <tr><td className="border border-[#A3CFF0] px-4 py-2">PHANI KUMAR</td><td className="border border-[#A3CFF0] px-4 py-2">9542666866</td></tr>
                  <tr><td className="border border-[#A3CFF0] px-4 py-2">SHAIK ASSAD</td><td className="border border-[#A3CFF0] px-4 py-2">9390019163</td></tr>
                  <tr><td className="border border-[#A3CFF0] px-4 py-2">GAYATHRI TATHIREDDY</td><td className="border border-[#A3CFF0] px-4 py-2">9553464625</td></tr>
                  <tr><td className="border border-[#A3CFF0] px-4 py-2">NALLURI LIKHITHA</td><td className="border border-[#A3CFF0] px-4 py-2">9390720020</td></tr>
                  <tr><td className="border border-[#A3CFF0] px-4 py-2">T.ANUVARSHITHA</td><td className="border border-[#A3CFF0] px-4 py-2">9182672419</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      
      case 'howToReach':
        return (
          <div className="p-6 bg-[#1a1a1a] text-white flex flex-col items-center space-y-6">
            
            {/* How to Reach Box */}
            <div className="border border-[#A3CFF0] p-6 rounded-2xl shadow-lg w-[60%] bg-[#252525]">
              <h2 className="text-2xl font-bold mb-4 text-[#A3CFF0]">How to Reach</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Vignan University is well-connected to neighboring cities and towns, making it easily accessible for visitors. The nearest major city is Guntur, which is approximately 20 kilometers away. Guntur has a railway station and is connected to major cities like Hyderabad, Vijayawada, and Chennai. From Guntur, one can hire a taxi or take a bus that goes to Tenali to reach Vignan.</li>
                <li>The nearest major railway station is in Tenali, which is approximately 12 km from Vignan University and is connected to major cities like Vishakhapatnam, Chennai, Coimbatore, and Cochin.</li>
                <li>One can get down at Vijayawada junction that has great connectivity to all parts of India and reach Tenali by bus, which would take around 45 minutes.</li>
                <li>There are plenty of auto-rickshaws and buses available from Tenali to reach Vignan University.</li>
              </ul>
            </div>
        
            {/* Contact Details Box */}
            <div className="border border-[#A3CFF0] p-6 rounded-2xl shadow-lg w-[60%] bg-[#252525]">
              <h3 className="text-xl font-semibold text-[#A3CFF0] mb-4">For Further Queries & Details Contact:</h3>
              <table className="w-full border border-[#A3CFF0] text-left">
                <thead>
                  <tr className="bg-[#A3CFF0] text-black">
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["HARSHAD.S", "7569395043"],
                    ["HYDER AHAMAD SHAIK", "7780176877"],
                    ["PHANI KUMAR", "9542666866"],
                    ["SHAIK ASSAD", "9390019163"],
                    ["GAYATHRI TATHIREDDY", "9553464625"],
                    ["NALLURI LIKHITHA", "9390720020"],
                    ["T.ANUVARSHITHA", "9182672419"],
                  ].map(([name, contact], index) => (
                    <tr key={index} className="border">
                      <td className="p-2 border">{name}</td>
                      <td className="p-2 border">{contact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        
          </div>
        );
        
      
      case 'accommodation':
        return (
          <div className="p-6 bg-[#1a1a1a] text-white flex flex-col items-center space-y-6">
            
            {/* Accommodation Details Box */}
            <div className="border border-[#A3CFF0] p-6 rounded-2xl shadow-lg w-[60%] bg-[#252525]">
              <h2 className="text-2xl font-bold mb-4 text-[#A3CFF0]">Accommodation Details</h2>
              
              <ul className="list-disc pl-5 space-y-2">
                <li>Participants who require accommodation must register at the hospitality desk by producing the Mahotsav ID card issued post registration process.</li>
                <li>Participants coming from distances more than 100 km from Guntur will only be provided with accommodation upon first come first serve basis depending on the availability with basic amenities.</li>
                <li>Participants are advised to bring their basic bedding and electrical spikes for charging their gadgets.</li>
                <li>Boys and Girls will be accommodated at different venues; common halls will be provided along with decent washroom facilities.</li>
                <li>No additional charge will be taken for accommodation from sports & Games participants; a nominal fee of Rs.100 will be charged from participants of cultural events.</li>
                <li>Smoking, drinking, and other drug consumption are strictly prohibited, and necessary action will be taken by the institute if a participant is found to be in possession of these items.</li>
                <li>Any damage to institution facilities and property provided to the participants would result in serious action, and necessary reimbursement charges should be paid by the participants found guilty.</li>
                <li>Participants are required to keep the given check-in receipts and ID card safe until they checkout. The candidate has to pay the registration fee again and get a new ID card.</li>
                <li>Participants should report at the accommodation venue to the concerned in-charge with their ID cards every time they enter or exit the room for safety concerns.</li>
                <li>Participants are requested to adhere to the check-out time mentioned in the check-in receipt. Check-out after the time indicated will not be entertained.</li>
                <li>Participants are expected not to create any kind of nuisance which might trouble other participants in the room.</li>
                <li>The college will not be responsible for any damage or loss of property or valuables stored in places of accommodation.</li>
                <li>Girls should strictly follow the curfew timings of Vignan that are specified during the allocation of room.</li>
                <li>The decision of organizers is final and binding in case of any dispute.</li>
                <li>Faculty members accompanying the students will be provided the facility free of cost, if informed in advance.</li>
              </ul>
            </div>
        
            {/* Contact Details Box */}
            <div className="border border-[#A3CFF0] p-6 rounded-2xl shadow-lg w-[60%] bg-[#252525]">
              <h3 className="text-xl font-semibold text-[#A3CFF0] mb-4">For Further Queries & Details Contact:</h3>
              <table className="w-full border border-[#A3CFF0] text-left">
                <thead>
                  <tr className="bg-[#A3CFF0] text-black">
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["HARSHAD.S", "7569395043"],
                    ["HYDER AHAMAD SHAIK", "7780176877"],
                    ["PHANI KUMAR", "9542666866"],
                    ["SHAIK ASSAD", "9390019163"],
                    ["GAYATHRI TATHIREDDY", "9553464625"],
                    ["NALLURI LIKHITHA", "9390720020"],
                    ["T.ANUVARSHITHA", "9182672419"],
                  ].map(([name, contact], index) => (
                    <tr key={index} className="border">
                      <td className="p-2 border">{name}</td>
                      <td className="p-2 border">{contact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        
          </div>
        );
        
      
      case 'contacts':
        return (
          <div className="p-6 bg-[#1a1a1a] text-white flex flex-col items-center">
            
            {/* Contact Information Box */}
            <div className="border border-[#A3CFF0] p-6 rounded-2xl shadow-lg w-[50%] bg-[#252525]">
              <h2 className="text-2xl font-bold mb-4 text-[#A3CFF0] text-center">Contact Information</h2>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#A3CFF0] text-black">
                    <th className="p-2">Name</th>
                    <th className="p-2">Contact Number</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "HARSHAD.S", contact: "7569395043" },
                    { name: "HYDER AHAMAD SHAIK", contact: "7780176877" },
                    { name: "PHANI KUMAR", contact: "9542666866" },
                    { name: "SHAIK ASSAD", contact: "9390019163" },
                    { name: "GAYATHRI TATHIREDDY", contact: "9553464625" },
                    { name: "NALLURI LIKHITHA", contact: "9390720020" },
                    { name: "T.ANUVARSHITHA", contact: "9182672419" },
                  ].map((contact, index) => (
                    <tr key={index} className="border-b border-gray-700 text-center">
                      <td className="p-2">{contact.name}</td>
                      <td className="p-2">{contact.contact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        
          </div>
        );
        
      
      case 'faqs':
        return (
          <div className="p-6 bg-[#1a1a1a] text-white flex justify-center">
            
            {/* FAQ Box */}
            <div className="border border-[#A3CFF0] p-6 rounded-2xl shadow-lg w-[60%] bg-[#252525]">
              <h2 className="text-2xl font-bold mb-4 text-[#A3CFF0] text-center">FAQs</h2>
        
              <ul className="space-y-4">
                {[
                  ["From when can I avail accommodation?", "Accommodation can be availed from 5th February, 2025 - 10 pm onwards."],
                  ["What documents and proofs are required while coming to Mahotsav?", "It is mandatory to bring the College ID card and bonafide certificate when you arrive at the registration desk at Vignan University."],
                  ["Does the accommodation include food?", "No, but you can make use of the canteens/food stalls available during Mahotsav at your own expense. Whereas, for Sports & Games participants, Lunch will be provided."],
                  ["When can I come for registration and accommodation?", "Accommodation and registration services can be availed from 5th Feb 2025, starting at 10 PM. The Registration and Hospitality desk will operate 24/7 until 6th Feb 2025. Please note that registrations and check-outs are paused during Inaugural and Valedictory functions, so kindly plan accordingly."],
                  ["Can I vacate earlier than the registered date?", "Yes, however you have to inform the coordinator regarding your check out."],
                  ["Whom and How should I approach for accommodation on arrival?", "You have to report at the hospitality desk. You can contact Helpline numbers for any further help. Helpline No: 7995426657."],
                  ["Will Mahotsav guarantee security for my luggage and stuff?", "The attendees are responsible for managing their own belongings, Mahotsav does not guarantee security of luggage or any personal belongings."],
                  ["Can I check out later than my scheduled time of checkout?", "You have to checkout at your given time only."],
                  ["Are Male and Female students provided with the same accommodations?", "No, male and female students would not be provided with the same accommodation."],
                  ["Can I expect to have a private room allotted to me?", "No, common halls will be arranged with decent washroom facilities."],
                  ["Is there any curfew for students?", "Yes, there will be a curfew for girl students. It will be informed during the allocation of room."],
                  ["What about the food provision inside the college?", "You can make use of the canteens/food stalls available during Mahotsav at your own expense."],
                ].map(([question, answer], index) => (
                  <li key={index} className="border-b border-gray-700 pb-3">
                    <p className="font-semibold text-[#A3CFF0]">{question}</p>
                    <p className="text-gray-300">{answer}</p>
                  </li>
                ))}
              </ul>
            </div>
        
          </div>
        );
        
      
      default:
        return null;
    }
  };

  <div>
    <h1>Hospitality Page</h1>
    <button onClick={handleClose} style={{ position: 'absolute', top: 10, right: 10 }}>
        Close
    </button>
</div>

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a1a] text-white">
      {/* Navigation */}
      <div className="flex justify-center space-x-4 p-4 bg-[#1a1a1a] sticky top-0 z-10">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              activeTab === item.id 
                ? 'bg-[#A3CFF0] text-black' 
                : 'hover:bg-gray-700 text-gray-300'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-grow">
        {renderContent()}
      </div>
    </div>
  );
};

export default HospitalityPage;