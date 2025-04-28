import React, { useState } from 'react';
import { Calendar, Music, Trophy, Clock, MapPin } from 'lucide-react';

function Schedule() {
  const [selectedCategory, setSelectedCategory] = useState("Music");
  const [selectedSportsType, setSelectedSportsType] = useState("Team Events");
  const [activeSection, setActiveSection] = useState("cultural"); // "cultural" or "sports"

  const culturalEvents = {
    Music: [
      { event: "Singing Idol (Round I)", day: 2, date: "07/02/2025", time: "10:00 AM - 01:00 PM", venue: "N Block Seminar Hall I" },
      { event: "Group Singing", day: 2, date: "07/02/2025", time: "1:30 PM - 03:30 PM", venue: "Convocation Hall" },
      { event: "Singing Jodi", day: 2, date: "07/02/2025", time: "04:00 PM - 06:00 PM", venue: "N Block Seminar Hall I" },
      { event: "Singing Idol (Round II)", day: 2, date: "07/02/2025", time: "05:00 PM - 06:30 PM", venue: "U Block Centre" },
      { event: "Singing Idol (Round III)", day: 2, date: "07/02/2025", time: "06:30 PM - 08:00 PM", venue: "U Block Centre" },
      { event: "Classical/Light Vocal (Solo)", day: 3, date: "08/02/2025", time: "09:00 AM - 11:00 AM", venue: "N Block Seminar Hall I" },
      { event: "Classical / Western Instrumental Solo", day: 3, date: "08/02/2025", time: "11:00 AM - 1:00 PM", venue: "N Block Seminar Hall I" },
      { event: "Anthyakshari Duo", day: 3, date: "08/02/2025", time: "11:00 AM - 02:00 PM", venue: "N Block -210" },
      { event: "Singing Idol Round IV", day: 3, date: "08/02/2025", time: "02:00 PM - 03:00 PM", venue: "Convocation Hall" },
      { event: "Western Vocal Solo Prelims", day: 3, date: "08/02/2025", time: "2:30 AM - 03:30 AM", venue: "N Block Seminar Hall I" },
      { event: "Western Vocal Solo Finals", day: 3, date: "08/02/2025", time: "3:30 AM - 04:00 AM", venue: "N Block Seminar Hall I" },
    ],
    Dance: [
      { event: "Dancing Star – Western Solo (Prelims)", day: 2, date: "07/02/2025", time: "10:00 AM - 01:00 PM", venue: "U Block Centre" },
      { event: "Classical Dance (Solo)", day: 2, date: "07/02/2025", time: "11:00 AM - 01:00 PM", venue: "N Block Seminar Hall II" },
      { event: "Dancing Star – Western Solo (Finals)", day: 2, date: "07/02/2025", time: "02:00 PM - 03:00 PM", venue: "U Block Centre" },
      { event: "Group Dance (10 no.)", day: 3, date: "08/02/2025", time: "09:00 AM - 01:00 PM", venue: "Convocation Hall" },
      { event: "Dancing Jodi – Western Duo", day: 3, date: "08/02/2025", time: "12:00 PM - 02:00 PM", venue: "U Block Centre" },
      { event: "Spot Dance (Jodi)", day: 3, date: "08/02/2025", time: "02:00 PM - 04:00 PM", venue: "Informals stage at Amusement park" },
    ],
    "Dramatics & Filmmaking": [
      { event: "Short film (Spot Entries Screening)", day: 2, date: "07/02/2025", time: "09:00 AM - 04:00 PM", venue: "U Block AGF 04" },
      { event: "Skit (8 no.)", day: 2, date: "07/02/2025", time: "10:00 AM - 01:00 PM", venue: "Convocation Hall" },
      { event: "Dialogue Dhamakha", day: 2, date: "07/02/2025", time: "02:00 PM - 04:00 PM", venue: "MHP Stage" },
      { event: "Short film (Finals)", day: 3, date: "08/02/2025", time: "11:00 AM - 2:00 PM", venue: "U Block AGF 04" },
      { event: "Mime (6 no.)", day: 3, date: "08/02/2025", time: "09:00 AM - 11:00 AM", venue: "N Block Seminar Hall II" },
      { event: "Mono Action", day: 3, date: "08/02/2025", time: "11:00 AM - 01:00 PM", venue: "N Block Seminar Hall II" },
      { event: "On the Spot Ad making", day: 3, date: "08/02/2025", time: "02:00 PM - 03:00 PM", venue: "N Block Seminar Hall II" },
    ],
    "Literary Arts": [
      { event: "Master Orator (Round I)", day: 2, date: "07/02/2025", time: "10:00 AM - 01:00 PM", venue: "NTR Vignan Library - III Floor" },
      { event: "Telugu Vyaasa rachana", day: 2, date: "07/02/2025", time: "10:00 AM - 01:00 PM", venue: "N Block - 201" },
      { event: "Spot Creative writing", day: 2, date: "07/02/2025", time: "01:00 PM - 03:00 PM", venue: "N Block - 201, 202" },
      { event: "Master Orator (Round II)", day: 2, date: "07/02/2025", time: "02:00 PM - 04:00 PM", venue: "NTR Vignan Library - III Floor" },
      { event: "Shayari – Hindi", day: 2, date: "07/02/2025", time: "04:00 PM - 05:00 PM", venue: "NTR Vignan Library - III Floor" },
      { event: "Quiz wiz (3 no., Round I)", day: 2, date: "07/02/2025", time: "04:00 PM - 06:00 PM", venue: "NTR Vignan Library - II Floor" },
      { event: "Word Master Round 1", day: 3, date: "08/02/2025", time: "09:00 AM - 12:00 PM", venue: "N Block - 201" },
      { event: "Dumb charades (2 no.)", day: 3, date: "08/02/2025", time: "09:00 AM - 12:00 PM", venue: "MHP Stage" },
      { event: "Quiz wiz (3 no., Round II)", day: 3, date: "08/02/2025", time: "10:00 AM - 11:30 AM", venue: "NTR Vignan Library - III Floor" },
      { event: "Quiz wiz (3 no., Round III)", day: 3, date: "08/02/2025", time: "11:30 AM - 01:00 PM", venue: "NTR Vignan Library - III Floor" },
      { event: "Word Master Round III & IV", day: 3, date: "08/02/2025", time: "02:00 PM - 04:00 PM", venue: "N Block - 201" },
      { event: "Impromptu (JAM)", day: 3, date: "08/02/2025", time: "02:00 PM - 04:00 PM", venue: "NTR Vignan Library - III Floor" },
      { event: "Story telling", day: 3, date: "08/02/2025", time: "02:00 PM - 04:00 PM", venue: "MHP Stage" },
    ],
    "Fine Arts": [
      { event: "Mehandi", day: 2, date: "07/02/2025", time: "10:00 AM - 01:00 PM", venue: "N Block - 106" },
      { event: "Theme Painting", day: 2, date: "07/02/2025", time: "10:00 AM - 01:00 PM", venue: "N Block - 107" },
      { event: "Clay modelling", day: 2, date: "07/02/2025", time: "02:00 PM - 05:00 PM", venue: "N Block - 106" },
      { event: "Face Painting", day: 2, date: "07/02/2025", time: "02:00 PM - 05:00 PM", venue: "N Block - 107" },
      { event: "Mandala art", day: 2, date: "07/02/2025", time: "05:00 PM - 07:00 PM", venue: "N Block - 107" },
      { event: "Collage", day: 3, date: "08/02/2025", time: "01:00 PM - 04:00 PM", venue: "N Block - 107" },
      { event: "Pencil Sketching", day: 3, date: "08/02/2025", time: "09:00 AM - 12:00 PM", venue: "N Block - 107" },
      { event: "Rangoli (2 no.)", day: 3, date: "08/02/2025", time: "09:00 AM - 12:00 PM", venue: "H Block Grounds" },
      { event: "Photography (Theme)", day: 3, date: "08/02/2025", time: "11:00 AM - 01:00 PM", venue: "N Block - 209" }
    ],
    "Fashion & Spotlight": [
      { event: "Texart (Fashion sketching)", day: 2, date: "07/02/2025", time: "10:00 AM - 01:00 PM", venue: "N Block - 209" },
      { event: "Haute Couture (Theme Ramp walk, 12 no.)", day: 2, date: "07/02/2025", time: "05:00 PM - 07:00 PM", venue: "Convocation Hall" },
      { event: "Mr. & Ms. Mahotsav (Round I)", day: 2, date: "07/02/2025", time: "10:00 AM - 11:00 AM", venue: "N Block - 202" },
      { event: "Mahotsav Got Talent (Elimination)", day: 2, date: "07/02/2025", time: "03:00 PM - 05:00 PM", venue: "N Block Seminar Hall II" },
      { event: "Mr. & Ms. Mahotsav (Round II)", day: 2, date: "07/02/2025", time: "03:00 PM - 05:00 PM", venue: "U Block Centre" },
      { event: "T-Shirt designing", day: 3, date: "08/02/2025", time: "09:00 AM - 11:00 AM", venue: "H Block VGF 09" },
      { event: "Craft villa (Accessory design)", day: 3, date: "08/02/2025", time: "01:00 PM - 03:00 PM", venue: "N Block - 209" },
      { event: "Mr. & Ms. Mahotsav (Round III)", day: 3, date: "08/02/2025", time: "11:00 AM - 12:00 PM", venue: "U Block Centre" },
      { event: "Mahotsav Got Talent (Finals)", day: 3, date: "08/02/2025", time: "03:00 PM - 04:00 PM", venue: "Convocation Hall" }
    ]
  };
  const sportsEvents = {
    "Team Events": [
      { event: "Volleyball (Men & Women)", day: 2, date: "07/02/2025", time: "8:00 AM - 12:30 PM", venue: "Beside Convocation Hall" },
      { event: "Basketball (Men & Women)", day: 2, date: "07/02/2025", time: "8:00 AM - 12:30 PM", venue: "Opposite Convocation Hall" },
      { event: "Football (Men & Women)", day: 2, date: "07/02/2025", time: "8:00 AM - 12:30 PM", venue: "Cricket Ground" },
      { event: "Kabaddi (Men & Women)", day: 2, date: "07/02/2025", time: "8:00 AM - 12:30 PM", venue: "Out Door Gym Beside" },
      { event: "Kho-Kho (Men & Women)", day: 2, date: "07/02/2025", time: "8:00 AM - 12:30 PM", venue: "Out Door Gym Beside" },
      { event: "Hockey (Men)", day: 2, date: "07/02/2025", time: "8:00 AM - 12:30 PM", venue: "Beside Basket Ball Courts" },
      { event: "Throw Ball (Women)", day: 2, date: "07/02/2025", time: "8:00 AM - 12:30 PM", venue: "H-Block Back Side" },
      { event: "Tennikoit (Women)", day: 2, date: "07/02/2025", time: "8:00 AM - 12:30 PM", venue: "Lara Tennikoit Courts" }
    ],
    "Individual Events": [
      { event: "800Mts (Final-1) (Men)", day: 2, date: "07/02/2025", time: "09:30 AM", venue: "U-Block Opposite Running Track" },
      { event: "100Mts (ROUND-1) (Men)", day: 2, date: "07/02/2025", time: "10:00 AM", venue: "U-Block Opposite Running Track" },
      { event: "100Mts (ROUND-1) (Men & Women)", day: 2, date: "07/02/2025", time: "10:45 AM", venue: "U-Block Opposite Running Track" },
      { event: "4 X 400Mts RELAY (ROUND-1) (Men)", day: 2, date: "07/02/2025", time: "12:30 PM", venue: "U-Block Opposite Running Track" },
      { event: "4 X 400Mts RELAY (ROUND-1) (Women)", day: 2, date: "07/02/2025", time: "12:45 PM", venue: "U-Block Opposite Running Track" },
      { event: "100Mts (ROUND-2) (Men)", day: 2, date: "07/02/2025", time: "02:00 PM", venue: "U-Block Opposite Running Track" },
      { event: "100Mts (ROUND-2) (Women)", day: 2, date: "07/02/2025", time: "02:15 PM", venue: "U-Block Opposite Running Track" },
      { event: "SHOT PUT (FINAL 7) (Men)", day: 2, date: "07/02/2025", time: "02:45 PM", venue: "U-Block Opposite Running Track" },
      { event: "SHOT PUT (FINAL 8) (Women)", day: 2, date: "07/02/2025", time: "03:00 PM", venue: "U-Block Opposite Running Track" },
      { event: "LONG JUMP (FINAL 9) (Women)", day: 2, date: "07/02/2025", time: "03:15 PM", venue: "U-Block Opposite Running Track" },
      { event: "100Mts (FINAL 10) (Men)", day: 2, date: "07/02/2025", time: "03:45 PM", venue: "U-Block Opposite Running Track" },
      { event: "100Mts (FINAL 11) (Women)", day: 2, date: "07/02/2025", time: "04:00 PM", venue: "U-Block Opposite Running Track" },
      { event: "4X400Mts RELAY (FINAL 13) (Men)", day: 2, date: "07/02/2025", time: "04:20 PM", venue: "U-Block Opposite Running Track" },
      { event: "4X400Mts RELAY (FINAL 14) (Women)", day: 2, date: "07/02/2025", time: "04:45 PM", venue: "U-Block Opposite Running Track" },
      { event: "3000Mts (FINAL 15) (Men)", day: 3, date: "08/02/2025", time: "06:00 AM", venue: "U-Block Opposite Running Track" },
      { event: "LONG JUMP (FINAL 16) (Men & Women)", day: 3, date: "08/02/2025", time: "08:00 AM", venue: "U-Block Opposite Running Track" },
      { event: "400Mts (ROUND 1) (Men)", day: 3, date: "08/02/2025", time: "08:15 AM", venue: "U-Block Opposite Running Track" },
      { event: "400Mts (ROUND 1) (Women)", day: 3, date: "08/02/2025", time: "08:30 AM", venue: "U-Block Opposite Running Track" },
      { event: "4X100Mts RELAY (ROUND 1) (Men)", day: 3, date: "08/02/2025", time: "10:00 AM", venue: "U-Block Opposite Running Track" },
      { event: "4X100Mts RELAY (ROUND 1) (Women)", day: 3, date: "08/02/2025", time: "10:30 AM", venue: "U-Block Opposite Running Track" },
      { event: "SHOTPUT (4 Kg) (FINAL 21) (Women)", day: 3, date: "08/02/2025", time: "10:40 AM", venue: "U-Block Opposite Running Track" },
      { event: "400Mts (FINAL 23) (Men)", day: 3, date: "08/02/2025", time: "11:15 AM", venue: "U-Block Opposite Running Track" },
      { event: "400Mts (FINAL 24) (Women)", day: 3, date: "08/02/2025", time: "11:25 AM", venue: "U-Block Opposite Running Track" },
      { event: "4X100Mts RELAY (FINAL 25) (Men)", day: 3, date: "08/02/2025", time: "12:15 PM", venue: "U-Block Opposite Running Track" },
      { event: "4X100Mts RELAY (FINAL 26) (Women)", day: 3, date: "08/02/2025", time: "12:30 PM", venue: "U-Block Opposite Running Track" }
    ], 
    "Para sports" : [
      { event: "100Mts HAND AMPUTEE (Men)", day: 2, date: "07/02/2025", venue: "U-Block Opposite Running Track" },
      { event: "100Mts LEG AMPUTEE (Men)", day: 2, date: "07/02/2025", venue: "U-Block Opposite Running Track" },
      { event: "100Mts VISUAL AMPUTEE (Men)", day: 2, date: "07/02/2025", venue: "U-Block Opposite Running Track" },
      { event: "LONG JUMP (Men)", day: 2, date: "07/02/2025", venue: "U-Block Opposite Running Track" },
      { event: "400Mts HAND AMPUTEE (Men)", day: 3, date: "08/02/2025", venue: "U-Block Opposite Running Track" },
      { event: "400Mts LEG AMPUTEE (Men)", day: 3, date: "08/02/2025", venue: "U-Block Opposite Running Track" },
      { event: "400Mts VISUAL AMPUTEE (Men)", day: 3, date: "08/02/2025", venue: "U-Block Opposite Running Track" },
      { event: "LONG JUMP HAND AMPUTEE (Men)", day: 3, date: "08/02/2025", venue: "U-Block Opposite Running Track" }
    ] 
  };

  const renderEventCard = (event) => (
    <div className="bg-[#2a2a2a] rounded-lg p-4 mb-4 border-l-4 border-[#A3CFF0] hover:transform hover:scale-[1.02] transition-all">
      <h3 className="text-lg font-semibold text-[#A3CFF0] mb-2">{event.event}</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-[#A3CFF0]" />
          <span>Day {event.day} - {event.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-[#A3CFF0]" />
          <span>{event.time}</span>
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <MapPin size={16} className="text-[#A3CFF0]" />
          <span>{event.venue}</span>
        </div>
      </div>
    </div>
  );

  const renderSidebar = (type) => {
    const categories = type === "cultural" ? Object.keys(culturalEvents) : Object.keys(sportsEvents);
    const icon = type === "cultural" ? <Music size={20} /> : <Trophy size={20} />;
    
    return (
      <div className="w-1/4 p-6 bg-[#1f1f1f] border-r border-[#333] h-screen sticky top-0">
        <div className="flex items-center gap-3 mb-6">
          {icon}
          <h2 className="text-xl font-bold text-[#A3CFF0]">
            {type === "cultural" ? "Cultural Events" : "Sports Events"}
          </h2>
        </div>
        <div className="overflow-y-auto max-h-[calc(100vh-120px)] pr-2 scrollbar-thin scrollbar-thumb-[#A3CFF0] scrollbar-track-[#2a2a2a]">
          <ul className="space-y-2">
            {categories.map((category) => (
              <li
                key={category}
                onClick={() => {
                  setActiveSection(type);
                  type === "cultural" ? setSelectedCategory(category) : setSelectedSportsType(category);
                }}
                className={`
                  p-3 rounded-lg cursor-pointer transition-all
                  ${(type === "cultural" && activeSection === "cultural" && selectedCategory === category) ||
                  (type === "sports" && activeSection === "sports" && selectedSportsType === category)
                    ? "bg-[#A3CFF0] text-[#1a1a1a] font-semibold"
                    : "hover:bg-[#2a2a2a]"}
                `}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#1a1a1a] text-gray-200 overflow-hidden">
      {/* Cultural Events Sidebar */}
      {renderSidebar("cultural")}

      {/* Main Content Area */}
      <div className="w-2/4 h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-[#A3CFF0] scrollbar-track-[#2a2a2a]">
        <div className="sticky top-0 bg-[#1a1a1a] pt-6 pb-4 z-10">
          <h1 className="text-3xl font-bold text-[#A3CFF0] mb-2">
            {activeSection === "cultural" ? selectedCategory : selectedSportsType}
          </h1>
          <div className="h-1 w-20 bg-[#A3CFF0] rounded"></div>
        </div>
        
        <div className="space-y-4 px-6 pb-6">
          {activeSection === "cultural"
            ? culturalEvents[selectedCategory].map((event, index) => renderEventCard(event))
            : sportsEvents[selectedSportsType].map((event, index) => renderEventCard(event))
          }
        </div>
      </div>

      {/* Sports Events Sidebar */}
      {renderSidebar("sports")}
    </div>
  );
}

export default Schedule;